/**
 * Copyright (c) 2026 Biztribe Trading & Consultancy India Private Limited.
 * All rights reserved.
 *
 * This file is part of the Fractional Sales Partner platform.
 * CONFIDENTIAL AND PROPRIETARY — Unauthorised copying, redistribution,
 * modification, or use of this file, via any medium, is strictly prohibited.
 * Violation will result in civil and criminal prosecution under the
 * Copyright Act 1957, Information Technology Act 2000, and applicable
 * Indian and international intellectual property laws.
 */

import { NextResponse } from 'next/server';
import { admin, adminDb, getDbForId, getUserDatabaseId } from '@/lib/firebase-admin';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { sendDealFinalizationEmail } from '@/lib/mailer';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// POST: Verify Razorpay Signature and record successful transaction
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      receipt 
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !receipt) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Database configuration error' }, { status: 500 });
    }

    // 1. Cryptographically verify Razorpay signature
    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isSignatureValid = generatedSignature === razorpay_signature;

    if (!isSignatureValid) {
      console.error("Signature verification failed.");
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // 2. Fetch Payment Details from Razorpay directly (source of truth)
    let paymentDetails;
    try {
      paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
    } catch (rzpErr) {
      console.error("Error fetching payment details from Razorpay:", rzpErr);
      return NextResponse.json({ error: 'Failed to fetch payment details' }, { status: 502 });
    }

    // 3. Query the post in Firestore associated with this receipt/order ID
    const postsSnapshot = await adminDb.collection('Posts')
      .where('paymentOrderId', '==', receipt)
      .limit(1)
      .get();

    if (postsSnapshot.empty) {
      return NextResponse.json({ 
        status: 'PAID',
        message: 'No associated post found in database.'
      });
    }

    const postDoc = postsSnapshot.docs[0];
    const postRef = postDoc.ref;
    const postData = postDoc.data();

    // 4. Update database status to sold
    let buyerUid = postData.paymentLockedBy;
    let authorUid = postData.ownerUid;
    let packageId = postData.paymentPackageId;
    let offerId = null;
    let offerData: any = null;

    if (postData.paymentStatus !== 'sold') {
      if (postData.paymentStatus === 'locked_for_offer_payment') {
        const targetOfferId = postData.paymentOfferId;
        const offerRef = postRef.collection('Offers').doc(targetOfferId);
        const offerDoc = await offerRef.get();
        if (!offerDoc.exists) {
          return NextResponse.json({ error: 'Associated offer not found' }, { status: 404 });
        }

        offerData = offerDoc.data()!;
        const allOffersSnapshot = await postRef.collection("Offers").where("status", "==", "pending").get();
        
        const batch = adminDb.batch();

        // Update the accepted offer
        batch.update(offerRef, {
          status: "accepted",
          acceptedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        // Update parent post
        batch.update(postRef, {
          acceptedOfferId: targetOfferId,
          acceptingOffers: false,
          paymentStatus: "sold",
          paymentLockedBy: offerData.offerorUid,
          paymentCompletedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Decline other pending ones
        allOffersSnapshot.docs.forEach((doc) => {
          if (doc.id !== targetOfferId) {
            batch.update(doc.ref, {
              status: "declined",
              declinedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        });

        await batch.commit();

        // Define Deal parameters for offer payment
        buyerUid = postData.ownerUid; // OBO is the payer
        authorUid = offerData.offerorUid; // SP is the provider
        offerId = targetOfferId;
        packageId = null;
      } else {
        await postRef.update({
          paymentStatus: 'sold',
          paymentCompletedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    } else {
      // If already sold, but it was locked for offer payment, we can populate Deal variables based on current DB state
      if (postData.acceptedOfferId) {
        buyerUid = postData.ownerUid;
        const offerRef = postRef.collection('Offers').doc(postData.acceptedOfferId);
        const offerDoc = await offerRef.get();
        if (offerDoc.exists) {
          authorUid = offerDoc.data()?.offerorUid;
          offerData = offerDoc.data();
        }
        offerId = postData.acceptedOfferId;
        packageId = null;
      }
    }

    // 5. Create Deal Record
    if (buyerUid && authorUid && (packageId || offerId)) {
      const buyerDbId = await getUserDatabaseId(buyerUid);
      const authorDbId = await getUserDatabaseId(authorUid);

      const dealPayload = {
        dealId: `deal_${receipt}`,
        postId: postDoc.id,
        packageId: packageId || null,
        offerId: offerId || null,
        buyerUid,
        authorUid,
        amount: Number(paymentDetails.amount || 0) / 100, // Convert from paise to Rupees
        currency: paymentDetails.currency || 'INR',
        paymentOrderId: receipt,
        rzpPaymentId: razorpay_payment_id,
        rzpOrderId: razorpay_order_id,
        paymentMode: paymentDetails.method || 'UPI',
        status: 'success',
        createdAt: new Date().toISOString()
      };

      // Write to both buyer and author databases
      const dbsToWrite = Array.from(new Set([buyerDbId, authorDbId]));
      let dealCreated = false;
      for (const dbId of dbsToWrite) {
        const db = getDbForId(dbId);
        if (db) {
          const dealRef = db.collection('Deals').doc(`deal_${receipt}`);
          const dealSnap = await dealRef.get();
          if (!dealSnap.exists) {
            await dealRef.set(dealPayload);
            console.log(`Created Deal record in database: ${dbId}`);
            dealCreated = true;
          }
        }
      }

      // 5.5 Trigger Email Notification on successful Deal Record insertion (non-blocking)
      if (dealCreated) {
        try {
          // Fetch OBO (Buyer) details
          let oboEmail = "buyer@fractionalsalespartner.com";
          try {
            const oboUser = await admin.auth().getUser(buyerUid);
            oboEmail = oboUser.email || oboEmail;
          } catch (authErr) {
            console.error("Failed to fetch OBO email:", authErr);
          }

          let oboBrandName = "Business Owner";
          const oboProfileDoc = await adminDb.collection("OBO_Profile").doc(buyerUid).get();
          if (oboProfileDoc.exists) {
            oboBrandName = oboProfileDoc.data()?.brandName || oboBrandName;
          }

          // Fetch SP (Author/Seller) details
          let spEmail = "partner@fractionalsalespartner.com";
          try {
            const spUser = await admin.auth().getUser(authorUid);
            spEmail = spUser.email || spEmail;
          } catch (authErr) {
            console.error("Failed to fetch SP email:", authErr);
          }

          let spName = "Sales Partner";
          const spProfileDoc = await adminDb.collection("SP_Profile").doc(authorUid).get();
          if (spProfileDoc.exists) {
            spName = spProfileDoc.data()?.fullName || spName;
          }

          // Determine post title and budget text based on Flow A (package) vs Flow B (offer)
          let postTitle = "Commercial Sales Representation Project";
          let budgetRangeText = "";

          if (offerId) {
            postTitle = postData.expectedOutcomes || "Commercial Sales Representation Project";
            if (postData.pricingType === "range") {
              budgetRangeText = `${postData.budgetCurrency} ${postData.budgetMin} – ${postData.budgetMax}`;
            } else {
              budgetRangeText = "Open Pitch";
            }
          } else {
            postTitle = postData.title || "Sales Package Engagement";
            budgetRangeText = `${dealPayload.currency} ${dealPayload.amount.toLocaleString()}`;
          }

          console.log(`>>> [API PAYMENT-STATUS] Sending deal finalization email. OBO: ${oboEmail}, SP: ${spEmail}`);

          await sendDealFinalizationEmail({
            oboBrandName,
            oboEmail,
            postTitle,
            budgetRange: budgetRangeText,
            spName,
            spEmail,
            offerAmount: dealPayload.amount,
            offerCurrency: dealPayload.currency,
            spMessage: offerData?.message || (offerId ? "Offer Accepted" : "Package Purchase"),
            postId: postDoc.id,
            offerId: offerId || `pkg_${packageId}`,
          });
        } catch (emailErr) {
          console.error("Failed to send deal finalization email after payment:", emailErr);
        }
      }
    }

    return NextResponse.json({
      status: 'PAID',
      postId: postDoc.id,
      paymentStatus: 'sold'
    });

  } catch (err: any) {
    console.error("Payment verification error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET: Handle cancel/failure or explicit release of lock
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('order_id');
    const action = searchParams.get('action');

    if (!orderId) {
      return NextResponse.json({ error: 'Missing order_id parameter' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    const postsSnapshot = await adminDb.collection('Posts')
      .where('paymentOrderId', '==', orderId)
      .limit(1)
      .get();

    if (postsSnapshot.empty) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const postDoc = postsSnapshot.docs[0];
    const postRef = postDoc.ref;

    // If explicit cancel action is requested, release lock
    if (action === 'cancel') {
      await postRef.update({
        paymentStatus: admin.firestore.FieldValue.delete(),
        paymentLockedBy: admin.firestore.FieldValue.delete(),
        paymentLockedAt: admin.firestore.FieldValue.delete(),
        paymentPackageId: admin.firestore.FieldValue.delete(),
        paymentOrderId: admin.firestore.FieldValue.delete(),
        paymentOfferId: admin.firestore.FieldValue.delete()
      });
      return NextResponse.json({ status: 'CANCELLED', message: 'Payment lock released.' });
    }

    // Default status fallback check
    return NextResponse.json({ status: 'PENDING', postId: postDoc.id });

  } catch (err) {
    console.error("Payment status GET error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
