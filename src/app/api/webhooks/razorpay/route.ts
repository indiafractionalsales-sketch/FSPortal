import { NextResponse } from 'next/server';
import { admin, adminDb, getDbForId, getUserDatabaseId } from '@/lib/firebase-admin';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing webhook signature' }, { status: 400 });
    }

    // 1. Verify Webhook Signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    if (webhookSecret) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      const isSignatureValid = signature === expectedSignature;
      if (!isSignatureValid) {
        console.error("Razorpay webhook signature verification failed.");
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    console.log("Razorpay Webhook received event:", payload.event);

    // 2. Handle 'order.paid' event
    if (payload.event === 'order.paid') {
      const orderEntity = payload.payload?.order?.entity;
      const paymentEntity = payload.payload?.payment?.entity;
      
      const receipt = orderEntity?.receipt; // This maps to our internal order ID (order_postId_timestamp)
      const razorpayOrderId = orderEntity?.id;
      const razorpayPaymentId = paymentEntity?.id;

      if (!receipt) {
        console.error("Missing receipt/internal order ID in webhook payload.");
        return NextResponse.json({ error: 'Missing receipt' }, { status: 400 });
      }

      if (!adminDb) {
        return NextResponse.json({ error: 'Database configuration error' }, { status: 500 });
      }

      // Query the post in Firestore associated with this receipt/order ID
      const postsSnapshot = await adminDb.collection('Posts')
        .where('paymentOrderId', '==', receipt)
        .limit(1)
        .get();

      if (postsSnapshot.empty) {
        console.error("No associated post found for receipt:", receipt);
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }

      const postDoc = postsSnapshot.docs[0];
      const postRef = postDoc.ref;
      const postData = postDoc.data();

      // 3. Mark the post as sold
      if (postData.paymentStatus !== 'sold') {
        await postRef.update({
          paymentStatus: 'sold',
          paymentCompletedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`Post ${postDoc.id} marked as sold via webhook.`);
      }

      // 4. Create Deal Record
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
          amount: (paymentEntity?.amount || 0) / 100, // Convert from paise to Rupees
          currency: paymentEntity?.currency || 'INR',
          paymentOrderId: receipt,
          rzpPaymentId: razorpayPaymentId || '',
          rzpOrderId: razorpayOrderId || '',
          paymentMode: paymentEntity?.method || 'UPI',
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
              console.log(`Created Deal record in database via webhook: ${dbId}`);
            }
          }
        }
      }
    }

    return NextResponse.json({ received: true });

  } catch (err: any) {
    console.error("Razorpay webhook handler error:", err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
