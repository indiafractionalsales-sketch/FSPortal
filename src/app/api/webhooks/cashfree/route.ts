import { NextResponse } from 'next/server';
import { admin, adminDb } from '@/lib/firebase-admin';
import { Cashfree } from 'cashfree-pg';

Cashfree.XClientId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID || '';
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY || '';
Cashfree.XEnvironment = process.env.CASHFREE_ENVIRONMENT === 'PRODUCTION' 
  ? Cashfree.Environment.PRODUCTION 
  : Cashfree.Environment.SANDBOX;

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-webhook-signature');
    const timestamp = req.headers.get('x-webhook-timestamp');

    if (!signature || !timestamp) {
      return NextResponse.json({ error: 'Missing webhook headers' }, { status: 400 });
    }

    try {
      Cashfree.PGVerifyWebhookSignature(signature, rawBody, timestamp);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    console.log("Cashfree Webhook received:", payload.type);

    if (payload.type === 'PAYMENT_SUCCESS_WEBHOOK') {
      const orderId = payload.data?.order?.order_id;
      if (!orderId) {
        return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
      }

      // Order ID format: order_{postId}_{timestamp}
      const parts = orderId.split('_');
      // The prefix might be 'order', followed by the postId
      // Because postId itself might contain underscores, we should find the post dynamically or store it better.
      // Since orderId was generated as: `order_${postId}_${Date.now()}`, we can extract it.
      // A safer approach is querying the database for the post with this paymentOrderId.
      
      const postsSnapshot = await adminDb!.collection('Posts')
        .where('paymentOrderId', '==', orderId)
        .limit(1)
        .get();

      if (postsSnapshot.empty) {
        console.error("No post found for order ID:", orderId);
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }

      const postDoc = postsSnapshot.docs[0];
      const postRef = postDoc.ref;
      const paymentStatus = payload.data?.payment?.payment_status;

      if (paymentStatus === 'SUCCESS') {
        // Finalize the lock and mark it as sold
        await postRef.update({
          paymentStatus: 'sold',
          paymentCompletedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`Post ${postDoc.id} marked as sold.`);
      } else {
        // Payment failed or is pending, we can remove the lock so others can buy
        await postRef.update({
          paymentStatus: admin.firestore.FieldValue.delete(),
          paymentLockedBy: admin.firestore.FieldValue.delete(),
          paymentLockedAt: admin.firestore.FieldValue.delete(),
          paymentPackageId: admin.firestore.FieldValue.delete(),
          paymentOrderId: admin.firestore.FieldValue.delete()
        });
        console.log(`Removed lock on Post ${postDoc.id} due to payment failure.`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
