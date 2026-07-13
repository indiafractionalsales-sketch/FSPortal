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
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      receipt,
      idToken
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !receipt || !idToken) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }
    const db = adminDb;

    // 1. Authenticate user
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (authErr) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const uid = decodedToken.uid;

    // 2. Verify Razorpay signature
    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // 3. Fetch payment details from Razorpay (source of truth)
    let paymentDetails;
    try {
      paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
    } catch (rzpErr: any) {
      console.error('Error fetching Razorpay payment:', rzpErr);
      return NextResponse.json({ error: 'Failed to retrieve payment details' }, { status: 502 });
    }

    // Retrieve order metadata from notes
    const notes = paymentDetails.notes || {};
    const metadataUid = notes.userId;
    const planId = notes.planId;
    const billingCycle = notes.billingCycle;
    const topupId = notes.topupId;
    const region = notes.region || 'US';
    const currency = notes.currency || 'USD';
    const localPrice = Number(notes.localPrice || 0);

    if (metadataUid !== uid) {
      return NextResponse.json({ error: 'Tampered payment details' }, { status: 400 });
    }

    // 4. Update Database in a transaction
    const userRef = db.collection('users').doc(uid);
    const invoiceId = `INV-${region}-2026-${Date.now().toString().slice(-6)}`;

    let finalBillingState: any = null;

    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new Error('User document not found');
      }

      const configRef = db.collection('Pricing_Configs').doc(region);
      const configDoc = await transaction.get(configRef);
      if (!configDoc.exists) {
        throw new Error(`Pricing configuration for region ${region} not found`);
      }
      const configData = configDoc.data() || {};

      const userData = userDoc.data() || {};
      let billing = userData.billing || {};

      let description = '';
      let invoicePeriod: any = null;

      if (planId) {
        const plan = configData.plans?.[planId];
        if (!plan) throw new Error('Invalid plan selected in payment notes');

        const durationDays = billingCycle === 'yearly' ? 365 : 30;
        const validUntilMs = Date.now() + durationDays * 24 * 60 * 60 * 1000;
        const validUntil = new Date(validUntilMs).toISOString();

        description = `Upgrade to ${plan.planName} Plan - ${billingCycle === 'yearly' ? 'Yearly' : 'Monthly'}`;
        invoicePeriod = {
          start: new Date().toISOString(),
          end: validUntil
        };

        // Reset and populate quotas
        billing = {
          ...billing,
          planId,
          planName: plan.planName,
          region,
          currency,
          validUntil,
          billingCycle: billingCycle || 'monthly',
          status: 'active',
          quotas: {
            cardScans: {
              limit: plan.quotas.cardScansLimit,
              usedThisMonth: 0,
              maxStored: plan.quotas.maxStored || plan.quotas.maxCardsStored || -1
            },
            aiSearch: {
              limit: plan.quotas.aiSearchLimit,
              usedThisMonth: 0,
              creditType: 'metered',
              creditsRemaining: billing.quotas?.aiSearch?.creditsRemaining || 0
            },
            reports: {
              limit: plan.quotas.reportsLimit,
              usedThisMonth: 0
            }
          }
        };
      } else if (topupId) {
        const topup = configData.topups?.[topupId];
        if (!topup) throw new Error('Invalid top-up package in payment notes');

        description = `${topup.quantity} AI Search Queries Top-up`;
        
        // Ensure sub-objects exist
        const currentCredits = Number(billing.quotas?.aiSearch?.creditsRemaining || 0);
        billing = {
          ...billing,
          quotas: {
            ...billing.quotas,
            aiSearch: {
              ...billing.quotas?.aiSearch,
              creditsRemaining: currentCredits + Number(topup.quantity)
            }
          }
        };
      }

      // Write updated billing block back to user profile
      transaction.update(userRef, { billing });
      finalBillingState = billing;

      // 5. Generate Invoice Document
      const invoiceRef = userRef.collection('Invoices').doc(invoiceId);
      
      // Calculate India taxes (GST) if applicable
      let taxBreakdown = {};
      if (region === 'IN') {
        const total = localPrice;
        const taxable = Math.round((total / 1.18) * 100) / 100; // 18% inclusive GST
        const gst = Math.round((total - taxable) * 100) / 100;
        const cgst = Math.round((gst / 2) * 100) / 100;
        const sgst = cgst;
        taxBreakdown = {
          taxableAmount: taxable,
          cgst,
          sgst,
          gstRate: '18% GST (9% CGST + 9% SGST)'
        };
      }

      const invoiceData = {
        invoiceId,
        userId: uid,
        userEmail: decodedToken.email || '',
        userName: decodedToken.name || '',
        amount: localPrice,
        currency,
        paymentMethod: paymentDetails.method || 'UPI',
        paymentProvider: 'razorpay',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        description,
        status: 'paid',
        taxBreakdown,
        billingPeriod: invoicePeriod,
        createdAt: new Date().toISOString()
      };

      transaction.set(invoiceRef, invoiceData);
    });

    return NextResponse.json({
      success: true,
      invoiceId,
      billing: finalBillingState
    });

  } catch (err: any) {
    console.error('Plans Verification Error:', err.message || err);
    return NextResponse.json({ error: err.message || 'Verification Failed' }, { status: 500 });
  }
}
