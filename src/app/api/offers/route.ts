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

import { NextResponse } from "next/server";
import { admin, adminDb, getUserDatabaseId } from "@/lib/firebase-admin";
import { sendDealFinalizationEmail } from "@/lib/mailer";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// Create or verify active DB configuration helper
const getDb = () => {
  if (!adminDb) {
    throw new Error("Database configuration error.");
  }
  return adminDb;
};

// POST /api/offers - Create a proposal/offer
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { postId, amount, currency, message, idToken } = body;

    if (!postId || amount === undefined || !currency || !idToken) {
      return NextResponse.json({ error: "Missing required parameters." }, { status: 400 });
    }

    const db = getDb();

    // 1. Verify User Authentication
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (authErr) {
      console.error("Auth error:", authErr);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const uid = decodedToken.uid;

    // 2. Fetch Post to verify existence and owner
    const postRef = db.collection("Posts").doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return NextResponse.json({ error: "Post not found." }, { status: 444 });
    }

    const postData = postDoc.data()!;
    
    // Validate that OBO is not offering on their own post
    if (postData.ownerUid === uid) {
      return NextResponse.json({ error: "You cannot make an offer on your own post." }, { status: 400 });
    }

    // Check if the post is accepting offers
    if (postData.acceptingOffers === false || postData.paymentStatus === "sold") {
      return NextResponse.json({ error: "This post is no longer accepting offers." }, { status: 400 });
    }

    // 3. Check for existing active offer from this user on this post
    const existingOffers = await postRef
      .collection("Offers")
      .where("offerorUid", "==", uid)
      .get();

    const hasActiveOffer = existingOffers.docs.some(
      (doc) => doc.data().status === "pending" || doc.data().status === "accepted"
    );

    if (hasActiveOffer) {
      return NextResponse.json(
        { error: "You already have an active offer on this post. Withdraw it first to submit a new one." },
        { status: 409 }
      );
    }

    // 4. Get offeror details (SP Profile)
    const spDoc = await db.collection("SP_Profile").doc(uid).get();
    const offerorName = spDoc.exists ? (spDoc.data()?.fullName || "Sales Partner") : (decodedToken.name || "Sales Partner");
    const offerorAvatar = spDoc.exists ? (spDoc.data()?.profilePhoto || "") : (decodedToken.picture || "");

    // 5. Save Offer
    const offerId = `offer_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const offerData = {
      offerId,
      postId,
      offerorUid: uid,
      offerorName,
      offerorAvatar,
      amount: Number(amount),
      currency,
      message: message || "",
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      acceptedAt: null,
      declinedAt: null,
    };

    const batch = db.batch();
    batch.set(postRef.collection("Offers").doc(offerId), offerData);
    
    // Increment count
    batch.update(postRef, {
      offerCount: admin.firestore.FieldValue.increment(1),
    });

    await batch.commit();

    return NextResponse.json({ success: true, offerId });
  } catch (err: any) {
    console.error("Create offer error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET /api/offers - List offers for a post
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    const authHeader = req.headers.get("Authorization");

    if (!postId || !authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing required parameters." }, { status: 400 });
    }

    const idToken = authHeader.substring(7);
    const db = getDb();

    // 1. Verify Authentication
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (authErr) {
      console.error("Auth error:", authErr);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const uid = decodedToken.uid;

    // 2. Fetch Post to verify owner
    const postRef = db.collection("Posts").doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    const postData = postDoc.data()!;
    const isPostOwner = postData.ownerUid === uid;

    // 3. Query subcollection
    const offersCollection = postRef.collection("Offers");
    let querySnapshot;

    if (isPostOwner) {
      // Post owner gets all offers (except withdrawn ones)
      querySnapshot = await offersCollection.where("status", "!=", "withdrawn").get();
    } else {
      // SP gets only their own offers
      querySnapshot = await offersCollection.where("offerorUid", "==", uid).get();
    }

    const offers = querySnapshot.docs.map((doc) => doc.data());
    return NextResponse.json({ offers });
  } catch (err: any) {
    console.error("Get offers error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH /api/offers - Update offer status (Accept / Decline / Withdraw)
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { postId, offerId, action, idToken } = body;

    if (!postId || !offerId || !action || !idToken) {
      return NextResponse.json({ error: "Missing required parameters." }, { status: 400 });
    }

    const db = getDb();

    // 1. Verify User Authentication
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (authErr) {
      console.error("Auth error:", authErr);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const uid = decodedToken.uid;

    const postRef = db.collection("Posts").doc(postId);
    const offerRef = postRef.collection("Offers").doc(offerId);

    const postDoc = await postRef.get();
    const offerDoc = await offerRef.get();

    if (!postDoc.exists || !offerDoc.exists) {
      return NextResponse.json({ error: "Post or Offer not found." }, { status: 404 });
    }

    const postData = postDoc.data()!;
    const offerData = offerDoc.data()!;

    if (action === "withdraw") {
      // Verify that the offer belongs to this SP
      if (offerData.offerorUid !== uid) {
        return NextResponse.json({ error: "Permission denied." }, { status: 403 });
      }

      const batch = db.batch();
      batch.update(offerRef, {
        status: "withdrawn",
        updatedAt: new Date().toISOString(),
      });
      // Decrement count
      batch.update(postRef, {
        offerCount: admin.firestore.FieldValue.increment(-1),
      });

      await batch.commit();
      return NextResponse.json({ success: true });
    }

    // Decline or Accept are only allowed for the Post Owner (OBO)
    if (postData.ownerUid !== uid) {
      return NextResponse.json({ error: "Permission denied." }, { status: 403 });
    }

    if (action === "decline") {
      await offerRef.update({
        status: "declined",
        declinedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return NextResponse.json({ success: true });
    }

    if (action === "accept") {
      if (postData.paymentStatus === "sold") {
        return NextResponse.json({ error: "This post has already been finalized." }, { status: 400 });
      }

      // Check if both the buyer (current user, post owner) and the sales partner (offeror) are from India
      const buyerDbId = await getUserDatabaseId(uid);
      const offerorDbId = await getUserDatabaseId(offerData.offerorUid);

      const bothFromIndia = buyerDbId === "fsindiadb" && offerorDbId === "fsindiadb";

      if (bothFromIndia) {
        // Create Razorpay Order
        const orderId = `ord_offer_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        
        try {
          const offerAmount = Number(offerData.amount);
          if (isNaN(offerAmount) || offerAmount <= 0) {
            return NextResponse.json({ error: "Invalid offer amount." }, { status: 400 });
          }

          // Apply lock to Post
          await postRef.update({
            paymentStatus: 'locked_for_offer_payment',
            paymentLockedBy: uid, // OBO / Post Owner is the one paying
            paymentLockedAt: admin.firestore.FieldValue.serverTimestamp(),
            paymentOfferId: offerId,
            paymentOrderId: orderId
          });

          const options = {
            amount: Math.round(offerAmount * 100), // in paise
            currency: "INR",
            receipt: orderId,
          };

          const response = await razorpay.orders.create(options);
          
          return NextResponse.json({
            requiresPayment: true,
            order_id: response.id,
            receipt: orderId,
            amount: options.amount,
            currency: "INR"
          });
        } catch (checkoutErr: any) {
          console.error("Offer checkout generation error:", checkoutErr);
          return NextResponse.json({ error: "Failed to generate checkout order." }, { status: 500 });
        }
      }

      // 1. Accept this offer, decline all other pending offers on this post
      const allOffersSnapshot = await postRef.collection("Offers").where("status", "==", "pending").get();
      
      const batch = db.batch();

      // Update the accepted offer
      batch.update(offerRef, {
        status: "accepted",
        acceptedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Update parent post
      batch.update(postRef, {
        acceptedOfferId: offerId,
        acceptingOffers: false,
        paymentStatus: "sold",
        paymentLockedBy: offerData.offerorUid,
        paymentLockedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Decline other pending ones
      allOffersSnapshot.docs.forEach((doc) => {
        if (doc.id !== offerId) {
          batch.update(doc.ref, {
            status: "declined",
            declinedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      });

      await batch.commit();

      // 2. Fetch emails for OBO (Brand Owner) and SP (Sales Partner) to send notifications
      let oboEmail = decodedToken.email || "sales@fractionalsalespartner.com";
      let oboBrandName = postData.authorName || "Business Owner";

      // Try reading OBO profile details
      const oboDoc = await db.collection("OBO_Profile").doc(postData.ownerUid).get();
      if (oboDoc.exists) {
        oboBrandName = oboDoc.data()?.brandName || oboBrandName;
      }

      // Try reading SP email
      let spEmail = "partner@fractionalsalespartner.com";
      try {
        const spUserRecord = await admin.auth().getUser(offerData.offerorUid);
        spEmail = spUserRecord.email || spEmail;
      } catch (authFetchErr) {
        console.error("Failed to fetch SP user account details:", authFetchErr);
      }

      // 3. Format budget range
      let budgetRangeText = "";
      if (postData.pricingType === "range") {
        budgetRangeText = `${postData.budgetCurrency} ${postData.budgetMin} – ${postData.budgetMax}`;
      } else {
        budgetRangeText = "Open Pitch";
      }

      // 4. Trigger Email Notification (Mailtrap API)
      try {
        await sendDealFinalizationEmail({
          oboBrandName,
          oboEmail,
          postTitle: postData.expectedOutcomes || "Commercial Sales Representation Project",
          budgetRange: budgetRangeText,
          spName: offerData.offerorName,
          spEmail,
          offerAmount: offerData.amount,
          offerCurrency: offerData.currency,
          spMessage: offerData.message,
          postId,
          offerId,
        });
      } catch (emailErr) {
        console.error("Failed to send deal finalization email:", emailErr);
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (err: any) {
    console.error("Update offer status error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT /api/offers - Update (upsert) an existing pending offer by the SP
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { postId, offerId, amount, currency, message, idToken } = body;

    if (!postId || !offerId || amount === undefined || !idToken) {
      return NextResponse.json({ error: "Missing required parameters." }, { status: 400 });
    }

    const db = getDb();

    // 1. Verify User Authentication
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (authErr) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const uid = decodedToken.uid;

    const postRef = db.collection("Posts").doc(postId);
    const offerRef = postRef.collection("Offers").doc(offerId);

    const offerDoc = await offerRef.get();
    if (!offerDoc.exists) {
      return NextResponse.json({ error: "Offer not found." }, { status: 404 });
    }

    const offerData = offerDoc.data()!;

    // 2. Only the offer owner can update it
    if (offerData.offerorUid !== uid) {
      return NextResponse.json({ error: "Permission denied." }, { status: 403 });
    }

    // 3. Only pending offers can be updated
    if (offerData.status !== "pending") {
      return NextResponse.json(
        { error: "Only pending offers can be updated." },
        { status: 409 }
      );
    }

    // 4. Update the offer
    await offerRef.update({
      amount: Number(amount),
      currency: currency || offerData.currency,
      message: message ?? offerData.message,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, offerId });
  } catch (err: any) {
    console.error("Update offer error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
