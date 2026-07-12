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

    if (!postId) {
      return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    // 1. Fetch Post from default database to determine partner's UID
    const postDoc = await adminDb.collection('Posts').doc(postId).get();
    if (!postDoc.exists) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    const postData = postDoc.data() || {};

    const isOwner = uid === postData.ownerUid;
    const isLockedBy = uid === postData.paymentLockedBy;

    // Check authorization: only post owner or partner can view history
    if (!isOwner && !isLockedBy) {
      return NextResponse.json({ error: 'Unauthorized to view this history' }, { status: 403 });
    }

    // Determine partner UID to find the correct tenant DB
    const partnerUid = postData.postType === 'sp' 
      ? postData.ownerUid 
      : postData.paymentLockedBy;

    if (!partnerUid) {
      return NextResponse.json({ history: [] }); // No partner assigned yet
    }

    const tenantDbId = await getUserDatabaseId(partnerUid);
    const tenantDb = getDbForId(tenantDbId) || adminDb;

    // 2. Query Attendance logs for this postId
    const snapshot = await tenantDb.collection('Attendance')
      .where('postId', '==', postId)
      .orderBy('createdAt', 'desc')
      .get();

    const history = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      };
    });

    return NextResponse.json({ history });

  } catch (error: any) {
    console.error('Fetch post-history error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
