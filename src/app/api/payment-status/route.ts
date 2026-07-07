import { NextResponse } from 'next/server';
import { admin, adminDb, getDbForId, getUserDatabaseId } from '@/lib/firebase-admin';
import Razorpay from 'razorpay';
import crypto from 'crypto';

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
    if (postData.paymentStatus !== 'sold') {
      await postRef.update({
        paymentStatus: 'sold',
        paymentCompletedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // 5. Create Deal Record
    const buyerUid = postData.paymentLockedBy;
    const authorUid = postData.ownerUid;
    const packageId = postData.paymentPackageId;

    if (buyerUid && authorUid && packageId) {
      const buyerDbId = await getUserDatabaseId(buyerUid);
      const authorDbId = await getUserDatabaseId(authorUid);

      const dealPayload = {
        dealId: `deal_${receipt}`,
        postId: postDoc.id,
        packageId,
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
      for (const dbId of dbsToWrite) {
        const db = getDbForId(dbId);
        if (db) {
          const dealRef = db.collection('Deals').doc(`deal_${receipt}`);
          const dealSnap = await dealRef.get();
          if (!dealSnap.exists) {
            await dealRef.set(dealPayload);
            console.log(`Created Deal record in database: ${dbId}`);
          }
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
        paymentOrderId: admin.firestore.FieldValue.delete()
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
