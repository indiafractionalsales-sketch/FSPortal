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

// Haversine formula to calculate distance in meters between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
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
    const partnerName = decodedToken.name || decodedToken.email || 'Partner';

    const body = await request.json();
    const { postId, latitude, longitude, overrideReason, overridePhotoUrl } = body;

    if (!postId || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: 'Missing required fields: postId, latitude, longitude' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    // 1. Fetch Post from default database to get geofence center coordinates
    const postDoc = await adminDb.collection('Posts').doc(postId).get();
    if (!postDoc.exists) {
      return NextResponse.json({ error: 'Deal post not found' }, { status: 404 });
    }
    const postData = postDoc.data() || {};

    // Determine target geofence center (fallback to default Pune test coordinates if none found)
    const targetLat = postData.latitude || postData.venueLatitude || 18.5204;
    const targetLng = postData.longitude || postData.venueLongitude || 73.8567;
    const clientName = postData.eventName || postData.expectedOutcomes || 'Client Location';

    const distance = calculateDistance(latitude, longitude, targetLat, targetLng);
    const isWithinGeofence = distance <= 100; // 100 meters limit

    let status = 'active';
    let verified = true;
    let overrideRequest = null;

    if (!isWithinGeofence) {
      if (overrideReason) {
        status = 'flagged';
        verified = false;
        overrideRequest = {
          reason: overrideReason,
          photoUrl: overridePhotoUrl || null,
          approved: false,
          approvedBy: null,
          requestedAt: new Date().toISOString()
        };
      } else {
        return NextResponse.json({
          error: 'OutsideGeofence',
          distance: Math.round(distance),
          message: `You are currently ${Math.round(distance)}m away. Move within 100m or request an override.`
        }, { status: 400 });
      }
    }

    // 2. Select corresponding multitenant DB for the sales partner
    const spDatabaseId = await getUserDatabaseId(uid);
    const spDb = getDbForId(spDatabaseId) || adminDb;

    // 3. Verify there is no other active shift for this user
    const activeShifts = await spDb.collection('Attendance')
      .where('partnerId', '==', uid)
      .where('status', '==', 'active')
      .limit(1)
      .get();

    if (!activeShifts.empty) {
      return NextResponse.json({ error: 'You already have an active check-in session.' }, { status: 400 });
    }

    // 4. Create the attendance record
    const attendanceData = {
      partnerId: uid,
      partnerName,
      clientId: postData.ownerUid || 'unknown_client',
      clientName,
      postId,
      date: new Date().toISOString().split('T')[0],
      checkIn: {
        timestamp: new Date().toISOString(),
        geopoint: { latitude, longitude },
        verified,
        distanceFromCenterMeters: Math.round(distance)
      },
      checkOut: null,
      status,
      totalDurationMinutes: null,
      locationPings: [
        {
          timestamp: new Date().toISOString(),
          geopoint: { latitude, longitude },
          status: isWithinGeofence ? 'on-site' : 'off-site',
          source: 'check-in'
        }
      ],
      overrideRequest,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const newDocRef = await spDb.collection('Attendance').add(attendanceData);

    return NextResponse.json({
      success: true,
      attendanceId: newDocRef.id,
      verified,
      distance: Math.round(distance),
      status
    });

  } catch (error: any) {
    console.error('Check-in error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
