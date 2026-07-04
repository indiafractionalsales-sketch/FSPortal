import { NextResponse } from 'next/server';
import { admin, adminDb } from '@/lib/firebase-admin';
import { Cashfree } from 'cashfree-pg';

// Configure Cashfree SDK
Cashfree.XClientId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID || '';
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY || '';
Cashfree.XEnvironment = process.env.CASHFREE_ENVIRONMENT === 'PRODUCTION' 
  ? Cashfree.Environment.PRODUCTION 
  : Cashfree.Environment.SANDBOX;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { postId, packageId, idToken } = body;

    if (!postId || !packageId || !idToken) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Database configuration error' }, { status: 500 });
    }

    // 1. Verify Authentication
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (authErr) {
      console.error("Auth error:", authErr);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const uid = decodedToken.uid;
    const userEmail = decodedToken.email || 'customer@example.com';

    const postRef = adminDb.collection('Posts').doc(postId);
    
    // 2. Transaction for Two-Phase Commit Lock
    let packagePrice = 0;
    let orderId = `order_${postId}_${Date.now()}`;

    try {
      await adminDb.runTransaction(async (t) => {
        const doc = await t.get(postRef);
        
        if (!doc.exists) {
          throw new Error('Post not found');
        }

        const data = doc.data()!;
        
        // Find the selected package to get the price
        const pkg = data.packages?.find((p: any) => p.id === packageId);
        if (!pkg) {
          throw new Error('Package not found on this post');
        }

        // Calculate cost based on line items or a direct price field
        if (pkg.price) {
          packagePrice = Number(pkg.price);
        } else if (pkg.lineItems) {
          packagePrice = pkg.lineItems.reduce((acc: number, item: any) => acc + (Number(item.cost) || 0), 0);
        } else {
          packagePrice = 100; // Fallback
        }

        if (packagePrice <= 0) {
          throw new Error('Invalid package price');
        }

        // Check if sold
        if (data.paymentStatus === 'sold') {
          throw new Error('This post package has already been sold.');
        }

        // Check lock expiration (15 minutes)
        if (data.paymentStatus === 'locked_for_payment' && data.paymentLockedAt) {
          const lockedTime = data.paymentLockedAt.toDate().getTime();
          const now = Date.now();
          const lockAgeMinutes = (now - lockedTime) / (1000 * 60);

          // If lock is less than 15 mins old and NOT locked by the current user, block it.
          if (lockAgeMinutes < 15 && data.paymentLockedBy !== uid) {
            throw new Error('Someone is currently completing a payment for this post. Please try again in 15 minutes.');
          }
        }

        // Apply Lock
        t.update(postRef, {
          paymentStatus: 'locked_for_payment',
          paymentLockedBy: uid,
          paymentLockedAt: admin.firestore.FieldValue.serverTimestamp(),
          paymentPackageId: packageId,
          paymentOrderId: orderId
        });
      });
    } catch (txErr: any) {
      console.error("Transaction Error:", txErr);
      return NextResponse.json({ error: txErr.message }, { status: 409 });
    }

    // 3. Create Cashfree Order
    const request = {
      order_amount: packagePrice,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: uid,
        customer_email: userEmail,
        customer_phone: "9999999999", // Can be updated if phone is passed in body
        customer_name: "Customer"
      },
      order_meta: {
        // You can set this to return to the app if Cashfree redirects
        return_url: `${req.headers.get('origin')}/payment-status?order_id={order_id}`
      }
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    
    // Return the session ID to the client so they can open the checkout modal
    return NextResponse.json({
      payment_session_id: response.data.payment_session_id,
      order_id: orderId
    });

  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
