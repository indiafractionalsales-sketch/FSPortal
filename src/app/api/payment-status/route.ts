import { NextResponse } from 'next/server';
import { admin, adminDb, getDbForId, getUserDatabaseId } from '@/lib/firebase-admin';
import { Cashfree, CFEnvironment } from 'cashfree-pg';

const cashfree = new Cashfree(
  process.env.CASHFREE_ENVIRONMENT === 'PRODUCTION' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
  process.env.NEXT_PUBLIC_CASHFREE_APP_ID || '',
  process.env.CASHFREE_SECRET_KEY || ''
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      return NextResponse.json({ error: 'Missing order_id parameter' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Database configuration error' }, { status: 500 });
    }

    // 1. Fetch Order Status from Cashfree directly (source of truth)
    let cashfreeOrder;
    try {
      const response = await cashfree.PGFetchOrder(orderId);
      cashfreeOrder = response.data;
    } catch (cfErr: any) {
      console.error("Error fetching order from Cashfree:", cfErr.response?.data || cfErr.message || cfErr);
      return NextResponse.json({ error: 'Failed to fetch order status from payment provider' }, { status: 502 });
    }

    // 2. Query the post in Firestore associated with this order ID
    const postsSnapshot = await adminDb.collection('Posts')
      .where('paymentOrderId', '==', orderId)
      .limit(1)
      .get();

    if (postsSnapshot.empty) {
      return NextResponse.json({ 
        status: cashfreeOrder.order_status,
        message: 'No associated post found in database.'
      });
    }

    const postDoc = postsSnapshot.docs[0];
    const postRef = postDoc.ref;
    const postData = postDoc.data();

    // 3. Update database status based on Cashfree status
    if (cashfreeOrder.order_status === 'PAID') {
      if (postData.paymentStatus !== 'sold') {
        await postRef.update({
          paymentStatus: 'sold',
          paymentCompletedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      // 4. Create Deal Record
      const buyerUid = postData.paymentLockedBy;
      const authorUid = postData.ownerUid;
      const packageId = postData.paymentPackageId;

      if (buyerUid && authorUid && packageId) {
        let cfPaymentId = '';
        let paymentMode = 'UPI';

        try {
          const paymentsResponse = await cashfree.PGOrderFetchPayments(orderId);
          const payments = paymentsResponse.data;
          const successPayment = payments?.find((p: any) => p.payment_status === 'SUCCESS');
          if (successPayment) {
            cfPaymentId = String(successPayment.cf_payment_id || '');
            paymentMode = successPayment.payment_group || 'UPI';
          }
        } catch (pmErr) {
          console.error("Error fetching payment details from Cashfree:", pmErr);
        }

        const buyerDbId = await getUserDatabaseId(buyerUid);
        const authorDbId = await getUserDatabaseId(authorUid);

        const dealPayload = {
          dealId: `deal_${orderId}`,
          postId: postDoc.id,
          packageId,
          buyerUid,
          authorUid,
          amount: cashfreeOrder.order_amount || 0,
          currency: cashfreeOrder.order_currency || 'INR',
          paymentOrderId: orderId,
          cfPaymentId,
          paymentMode,
          status: 'success',
          createdAt: new Date().toISOString()
        };

        // Write to both buyer and author databases
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
    } else if (['FAILED', 'CANCELLED', 'EXPIRED'].includes(cashfreeOrder.order_status || '')) {
      // Release lock if failed/expired
      await postRef.update({
        paymentStatus: admin.firestore.FieldValue.delete(),
        paymentLockedBy: admin.firestore.FieldValue.delete(),
        paymentLockedAt: admin.firestore.FieldValue.delete(),
        paymentPackageId: admin.firestore.FieldValue.delete(),
        paymentOrderId: admin.firestore.FieldValue.delete()
      });
    }

    return NextResponse.json({
      status: cashfreeOrder.order_status,
      postId: postDoc.id,
      paymentStatus: cashfreeOrder.order_status === 'PAID' ? 'sold' : null
    });

  } catch (err: any) {
    console.error("Payment status check error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

