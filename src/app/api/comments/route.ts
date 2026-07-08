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

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const body = await request.json();
    const { postId, text, authorName, authorAvatar, imageUrl } = body;

    if (!postId || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const postRef = adminDb.collection('Posts').doc(postId);
    const newCommentRef = postRef.collection('Comments').doc();

    const commentData = {
      id: newCommentRef.id,
      postId,
      text,
      authorUid: uid,
      authorName: authorName || 'Unknown User',
      authorAvatar: authorAvatar || '',
      imageUrl: imageUrl || null,
      createdAt: new Date().toISOString(),
    };

    // Run transaction to add comment and increment count securely
    await adminDb.runTransaction(async (t) => {
      const postDoc = await t.get(postRef);
      if (!postDoc.exists) {
        throw new Error('Post not found');
      }

      t.set(newCommentRef, commentData);
      t.update(postRef, {
        commentCount: admin.firestore.FieldValue.increment(1)
      });
    });

    return NextResponse.json({ success: true, commentId: newCommentRef.id, data: commentData });

  } catch (error: any) {
    console.error('Add comment error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    
    if (!postId) {
      return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
    }
    
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const commentsRef = adminDb.collection('Posts').doc(postId).collection('Comments');
    const snapshot = await commentsRef.orderBy('createdAt', 'asc').get();
    
    const comments = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      };
    });

    return NextResponse.json({ comments });

  } catch (error: any) {
    console.error('Get comments error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
