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

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const spDatabaseId = await getUserDatabaseId(uid);
    const spDb = getDbForId(spDatabaseId) || adminDb;

    let query = spDb.collection('Attendance')
      .where('partnerId', '==', uid)
      .where('status', 'in', ['active', 'flagged']);

    if (postId) {
      query = query.where('postId', '==', postId);
    }

    const snapshot = await query.limit(1).get();

    if (snapshot.empty) {
      return NextResponse.json({ active: false });
    }

    const doc = snapshot.docs[0];
    return NextResponse.json({
      active: true,
      attendanceId: doc.id,
      data: doc.data()
    });

  } catch (error: any) {
    console.error('Attendance status fetch error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
