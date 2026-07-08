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
import { admin, adminDb } from '@/lib/firebase-admin';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

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
    let orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

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
        } else if (pkg.items) {
          packagePrice = pkg.items.reduce((acc: number, item: any) => acc + (Number(item.cost) || 0), 0);
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

    let returnUrl = `${req.headers.get('origin') || 'http://localhost:9002'}/payment-status?order_id={order_id}`;
    if (process.env.CASHFREE_ENVIRONMENT === 'PRODUCTION' && returnUrl.startsWith('http://')) {
      returnUrl = returnUrl.replace('http://', 'https://');
    }

    // 3. Create Razorpay Order (amount must be in paise)
    const options = {
      amount: Math.round(packagePrice * 100),
      currency: "INR",
      receipt: orderId,
    };

    const response = await razorpay.orders.create(options);
    
    // Return the Razorpay order ID to the client so they can open the checkout overlay
    return NextResponse.json({
      order_id: response.id,
      receipt: orderId
    });

  } catch (err: any) {
    console.error("Checkout error:", err.response?.data || err.message || err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
