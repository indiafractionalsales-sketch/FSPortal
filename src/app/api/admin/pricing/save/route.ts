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

import { NextRequest, NextResponse } from 'next/server';
import { admin, adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Strict validation: Verify Admin Custom User Claims
    if (!decodedToken.admin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const configData = await req.json();
    const regionId = configData.id;

    if (!regionId || !['IN', 'US', 'GB', 'EU', 'SEA', 'ME'].includes(regionId)) {
      return NextResponse.json({ error: 'Invalid or missing region ID' }, { status: 400 });
    }

    // Save configuration document in dynamic configs collection
    await adminDb.collection('Pricing_Configs').doc(regionId).set(configData);
    console.log(`>>> [ADMIN CONFIG] Pricing configuration updated for region: ${regionId} by admin: ${decodedToken.email}`);

    return NextResponse.json({ success: true, regionId });

  } catch (error: any) {
    console.error('Failed to save regional pricing configuration:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
