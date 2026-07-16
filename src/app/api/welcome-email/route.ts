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
import { admin } from '@/lib/firebase-admin';
import { sendWelcomeEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing Authorization header' }, { status: 401 });
    }

    // Verify token to ensure only authenticated users can trigger
    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (authError) {
      console.error('>>> [API WELCOME EMAIL] Token verification failed:', authError);
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const { email, name, role } = await request.json();

    if (!email || !name || !role) {
      return NextResponse.json({ error: 'Bad Request: Missing required parameters (email, name, role)' }, { status: 400 });
    }

    console.log('>>> [API WELCOME EMAIL] Triggering welcome email for:', email, 'with role:', role);

    const success = await sendWelcomeEmail(email, name, role);

    if (success) {
      return NextResponse.json({ message: 'Welcome email processed successfully.' });
    } else {
      return NextResponse.json({ error: 'Failed to process welcome email.' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('>>> [API WELCOME EMAIL] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
