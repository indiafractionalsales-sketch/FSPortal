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
import { admin, adminDb, getDbForId } from '@/lib/firebase-admin';
import { getRegionFromCountry, getCurrencyForRegion } from '@/lib/billing-utils';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// Conversion rates to convert regional currencies to INR for Razorpay checkout
const CURRENCY_TO_INR_RATES: Record<string, number> = {
  USD: 85,
  GBP: 110,
  EUR: 93,
  SGD: 63,
  AED: 23,
  INR: 1
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { planId, billingCycle, topupId, idToken } = body;

    if (!idToken || (!planId && !topupId)) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    // 1. Authenticate user
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (authErr) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const uid = decodedToken.uid;

    // 2. Load user record to determine region
    const userDoc = await adminDb.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data() || {};
    const billing = userData.billing || {};
    
    // Fallback: Resolve region from user profile if not set
    let region = billing.region;
    if (!region) {
      const role = userData.role || 'sp';
      const dbId = userData.databaseId || 'default';
      const db = getDbForId(dbId);
      let profileSnap;
      if (db) {
        if (role === 'sp') profileSnap = await db.collection('SP_Profile').doc(uid).get();
        else if (role === 'obo') profileSnap = await db.collection('OBO_Profile').doc(uid).get();
        else if (role === 'tpsp') profileSnap = await db.collection('TPSP_Profile').doc(uid).get();
        
        // If profile is missing in 'default', search in 'fsindiadb' in case they are an India user
        if ((!profileSnap || !profileSnap.exists) && dbId === 'default') {
          const indiaDb = getDbForId('fsindiadb');
          if (indiaDb) {
            if (role === 'sp') profileSnap = await indiaDb.collection('SP_Profile').doc(uid).get();
            else if (role === 'obo') profileSnap = await indiaDb.collection('OBO_Profile').doc(uid).get();
            else if (role === 'tpsp') profileSnap = await indiaDb.collection('TPSP_Profile').doc(uid).get();
          }
        }
      }
      const country = profileSnap?.exists ? (profileSnap.data()?.country || '') : '';
      region = getRegionFromCountry(country);

      // If mapped country defaulted to US but database is partitioned in India, override to IN
      if (region === 'US' && dbId === 'fsindiadb') {
        region = 'IN';
      }
    }

    // 3. Load pricing configuration from database
    const configDoc = await adminDb.collection('Pricing_Configs').doc(region).get();
    if (!configDoc.exists) {
      return NextResponse.json({ error: 'Pricing configurations not found for region' }, { status: 404 });
    }

    const configData = configDoc.data() || {};
    let localPrice = 0;
    let description = '';

    if (planId) {
      const plan = configData.plans?.[planId];
      if (!plan) {
        return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
      }
      
      const cycle = billingCycle || 'monthly';
      localPrice = cycle === 'yearly' ? Number(plan.costYear) : Number(plan.costMonth);
      description = `Upgrade to ${plan.planName} Plan - ${cycle === 'yearly' ? 'Yearly' : 'Monthly'}`;
      
      if (localPrice <= 0) {
        return NextResponse.json({ error: 'Selected plan is free, no payment required' }, { status: 400 });
      }
    } else if (topupId) {
      const topup = configData.topups?.[topupId];
      if (!topup) {
        return NextResponse.json({ error: 'Invalid top-up selected' }, { status: 400 });
      }
      localPrice = Number(topup.cost);
      description = `${topup.quantity} AI Search Queries Top-up`;
    }

    // 4. Calculate total amount in INR for Razorpay
    const currency = configData.currency || 'INR';
    const exchangeRate = CURRENCY_TO_INR_RATES[currency] || 1;
    const priceInINR = localPrice * exchangeRate;

    // Amount must be in paise (smallest currency unit)
    const amountInPaise = Math.round(priceInINR * 100);
    const receiptId = `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // 5. Generate Razorpay Order
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
      notes: {
        userId: uid,
        planId: planId || '',
        billingCycle: billingCycle || '',
        topupId: topupId || '',
        region,
        currency,
        localPrice: String(localPrice)
      }
    };

    const response = await razorpay.orders.create(options);

    return NextResponse.json({
      order_id: response.id,
      receipt: receiptId,
      amount: amountInPaise,
      currency: 'INR',
      localPrice,
      localCurrency: currency,
      description
    });

  } catch (err: any) {
    console.error('Plans Checkout Error:', err.message || err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
