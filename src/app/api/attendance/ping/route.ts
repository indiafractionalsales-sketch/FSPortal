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

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

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
    const { latitude, longitude } = body;

    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: 'Missing required fields: latitude, longitude' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const spDatabaseId = await getUserDatabaseId(uid);
    const spDb = getDbForId(spDatabaseId) || adminDb;

    // 1. Find active shift
    const snapshot = await spDb.collection('Attendance')
      .where('partnerId', '==', uid)
      .where('status', 'in', ['active', 'flagged'])
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ error: 'No active attendance session', stopPinger: true }, { status: 404 });
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    const postId = data.postId;

    // 2. Fetch Post to calculate distance
    const postDoc = await adminDb.collection('Posts').doc(postId).get();
    let targetLat = 18.5204;
    let targetLng = 73.8567;
    if (postDoc.exists) {
      const postData = postDoc.data() || {};
      targetLat = postData.latitude || postData.venueLatitude || 18.5204;
      targetLng = postData.longitude || postData.venueLongitude || 73.8567;
    }

    const distance = calculateDistance(latitude, longitude, targetLat, targetLng);
    const isWithinGeofence = distance <= 100;

    const newPing = {
      timestamp: new Date().toISOString(),
      geopoint: { latitude, longitude },
      status: isWithinGeofence ? 'on-site' : 'off-site',
      source: 'periodic-ping'
    };

    // 3. Append to timeline
    await spDb.collection('Attendance').doc(doc.id).update({
      locationPings: admin.firestore.FieldValue.arrayUnion(newPing)
    });

    return NextResponse.json({
      success: true,
      onSite: isWithinGeofence,
      distance: Math.round(distance)
    });

  } catch (error: any) {
    console.error('Ping error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
