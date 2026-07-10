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
import { adminDb, admin, getUserDatabaseId, getDbForId } from '@/lib/firebase-admin';
import { getStorage } from 'firebase-admin/storage';

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    // Parse multipart form data
    const formData = await req.formData();
    const leadId = formData.get('leadId') as string | null;
    const voiceNote = formData.get('voiceNote') as File | null;
    const textNote = formData.get('textNote') as string | null;

    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required' }, { status: 400 });
    }

    // Route to the user's country-specific database
    const dbId = await getUserDatabaseId(uid);
    const db = getDbForId(dbId) || adminDb;

    // Verify the lead exists, belongs to this user, and is still pending
    const leadRef = db.collection('Leads').doc(leadId);
    const leadDoc = await leadRef.get();

    if (!leadDoc.exists) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const leadData = leadDoc.data()!;
    if (leadData.capturedByUid !== uid) {
      return NextResponse.json({ error: 'You do not own this lead' }, { status: 403 });
    }

    if (leadData.status !== 'pending') {
      return NextResponse.json({ error: 'Lead is not in pending state' }, { status: 400 });
    }

    // Prepare update payload
    const updatePayload: Record<string, any> = {};

    // Upload voice note if provided
    if (voiceNote) {
      const isIndia = dbId === 'fsindiadb';
      const BUCKET = isIndia
        ? 'fractional-sales-india'
        : (process.env.FIREBASE_STORAGE_BUCKET || 'fractional-sales-4436e.firebasestorage.app');
      const bucket = getStorage().bucket(BUCKET);

      const timestamp = Date.now();
      const voiceBuffer = Buffer.from(await voiceNote.arrayBuffer());
      const voicePath = `leads/${uid}/${timestamp}_voice_update.webm`;
      const voiceFile = bucket.file(voicePath);
      await voiceFile.save(voiceBuffer, { contentType: 'audio/webm' });
      await voiceFile.makePublic();
      updatePayload.voiceNoteUrl = `https://storage.googleapis.com/${bucket.name}/${voicePath}`;
    }

    // Update text note if provided
    if (textNote !== null && textNote !== undefined) {
      updatePayload.textNote = textNote || null;
    }

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    await leadRef.update(updatePayload);

    return NextResponse.json({
      success: true,
      leadId,
      updated: Object.keys(updatePayload),
    });

  } catch (error: any) {
    console.error('Lead update-note error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update lead note' },
      { status: 500 }
    );
  }
}
