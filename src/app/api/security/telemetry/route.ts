/**
 * Copyright (c) 2026 Biztribe Trading & Consultancy India Private Limited.
 * All rights reserved.
 *
 * This file is part of the Fractional Sales Partner platform.
 * CONFIDENTIAL AND PROPRIETARY — Unauthorised copying, redistribution,
 * modification, or use of this document, via any medium, is strictly prohibited.
 * Violation will result in civil and criminal prosecution under the
 * Copyright Act 1957, Information Technology Act 2000, and applicable
 * Indian and international intellectual property laws.
 */

import { NextRequest, NextResponse } from 'next/server';
import { admin, adminDb, getDbForId, getUserDatabaseId } from '@/lib/firebase-admin';
import { extractClientTelemetry } from '@/lib/server-telemetry';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitorId, userId, action = 'ACTIVITY', extraDetails = {} } = body;

    // Extract network telemetry from request headers
    const telemetry = extractClientTelemetry(request);

    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const effectiveVisitorId = visitorId && visitorId !== 'unknown_visitor' ? visitorId : 'fallback_visitor';
    const effectiveUserId = userId || 'anonymous';

    // Multi-Account Enforcement Check (Max 3 accounts per physical device)
    if (effectiveVisitorId !== 'fallback_visitor' && effectiveUserId !== 'anonymous') {
      const deviceRef = adminDb.collection('DeviceFingerprints').doc(effectiveVisitorId);
      const deviceDoc = await deviceRef.get();

      let associatedUserIds: string[] = [];
      let accountCount = 0;
      let isBlocked = false;

      if (deviceDoc.exists) {
        const data = deviceDoc.data() || {};
        associatedUserIds = data.associatedUserIds || [];
        isBlocked = data.isBlocked || false;

        if (isBlocked) {
          return NextResponse.json(
            {
              success: false,
              blocked: true,
              message: 'This device has been flagged and suspended for security violations.',
            },
            { status: 403 }
          );
        }

        const isExistingUser = associatedUserIds.includes(effectiveUserId);

        // Strict limit: Max 3 distinct accounts per physical device
        if (!isExistingUser && associatedUserIds.length >= 3) {
          return NextResponse.json(
            {
              success: false,
              blocked: true,
              message: 'Maximum account registration limit reached (Max 3 accounts allowed per device).',
            },
            { status: 403 }
          );
        }

        if (!isExistingUser) {
          associatedUserIds.push(effectiveUserId);
        }
        accountCount = associatedUserIds.length;
      } else {
        associatedUserIds = [effectiveUserId];
        accountCount = 1;
      }

      // Update DeviceFingerprints collection
      await deviceRef.set(
        {
          visitorId: effectiveVisitorId,
          associatedUserIds,
          accountCount,
          lastSeen: new Date().toISOString(),
          lastIp: telemetry.ip,
          lastCountry: telemetry.country,
        },
        { merge: true }
      );
    }

    // Update Latest Security Snapshot on user document (if authenticated)
    if (effectiveUserId !== 'anonymous') {
      const dbId = await getUserDatabaseId(effectiveUserId);
      const targetDb = getDbForId(dbId) || adminDb;

      const userRef = targetDb.collection('users').doc(effectiveUserId);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        await userRef.update({
          lastLoginIp: telemetry.ip,
          lastLoginCountry: telemetry.country,
          lastLoginCity: telemetry.city,
          lastVisitorId: effectiveVisitorId,
          isVpnOrProxy: telemetry.isVpnOrProxy,
          lastSeenAt: new Date().toISOString(),
        });
      }
    }

    // Append to AuditLogs collection (Immutable security event log)
    const auditLogRef = adminDb.collection('AuditLogs').doc();
    await auditLogRef.set({
      logId: auditLogRef.id,
      userId: effectiveUserId,
      visitorId: effectiveVisitorId,
      action,
      ip: telemetry.ip,
      country: telemetry.country,
      city: telemetry.city,
      userAgent: telemetry.userAgent,
      isVpnOrProxy: telemetry.isVpnOrProxy,
      extraDetails,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      telemetry: {
        ip: telemetry.ip,
        country: telemetry.country,
        city: telemetry.city,
      },
    });
  } catch (error: any) {
    console.error('[Security Telemetry API Error]:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
