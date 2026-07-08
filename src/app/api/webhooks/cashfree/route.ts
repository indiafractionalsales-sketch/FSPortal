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
import { Cashfree, CFEnvironment } from 'cashfree-pg';

const cashfree = new Cashfree(
  process.env.CASHFREE_ENVIRONMENT === 'PRODUCTION' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
  process.env.NEXT_PUBLIC_CASHFREE_APP_ID || '',
  process.env.CASHFREE_SECRET_KEY || ''
);

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-webhook-signature');
    const timestamp = req.headers.get('x-webhook-timestamp');

    if (!signature || !timestamp) {
      return NextResponse.json({ error: 'Missing webhook headers' }, { status: 400 });
    }

    try {
      cashfree.PGVerifyWebhookSignature(signature, rawBody, timestamp);
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
      const postData = postDoc.data();
      const paymentStatus = payload.data?.payment?.payment_status;

      if (paymentStatus === 'SUCCESS') {
        // Finalize the lock and mark it as sold
        await postRef.update({
          paymentStatus: 'sold',
          paymentCompletedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`Post ${postDoc.id} marked as sold.`);

        // Create Deal Record
        const buyerUid = postData.paymentLockedBy;
        const authorUid = postData.ownerUid;
        const packageId = postData.paymentPackageId;
        const cfPaymentId = String(payload.data?.payment?.cf_payment_id || '');
        const paymentMode = payload.data?.payment?.payment_group || 'UPI';
        const amount = payload.data?.payment?.payment_amount || 0;
        const currency = payload.data?.payment?.payment_currency || 'INR';

        if (buyerUid && authorUid && packageId) {
          const buyerDbId = await getUserDatabaseId(buyerUid);
          const authorDbId = await getUserDatabaseId(authorUid);

          const dealPayload = {
            dealId: `deal_${orderId}`,
            postId: postDoc.id,
            packageId,
            buyerUid,
            authorUid,
            amount,
            currency,
            paymentOrderId: orderId,
            cfPaymentId,
            paymentMode,
            status: 'success',
            createdAt: new Date().toISOString()
          };

          const dbsToWrite = Array.from(new Set([buyerDbId, authorDbId]));
          for (const dbId of dbsToWrite) {
            const db = getDbForId(dbId);
            if (db) {
              const dealRef = db.collection('Deals').doc(`deal_${orderId}`);
              const dealSnap = await dealRef.get();
              if (!dealSnap.exists) {
                await dealRef.set(dealPayload);
                console.log(`Created Deal record in database: ${dbId}`);
              }
            }
          }
        }
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
