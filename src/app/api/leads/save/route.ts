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

    // Parse multipart form data (image blob + optional audio blob + metadata)
    const formData = await req.formData();
    const cardImage = formData.get('cardImage') as File | null;
    const voiceNote = formData.get('voiceNote') as File | null;
    const textNote = formData.get('textNote') as string | null;
    const postId = formData.get('postId') as string | null;
    const ownerUid = formData.get('ownerUid') as string | null;

    if (!cardImage) {
      return NextResponse.json({ error: 'Card image is required' }, { status: 400 });
    }

    // Upload card image to Firebase Storage (server-side)
    const timestamp = Date.now();
    const bucket = getStorage().bucket();

    const cardImageBuffer = Buffer.from(await cardImage.arrayBuffer());
    const cardImagePath = `leads/${uid}/${timestamp}_card.jpg`;
    const cardFile = bucket.file(cardImagePath);
    await cardFile.save(cardImageBuffer, { contentType: 'image/jpeg' });
    await cardFile.makePublic();
    const cardImageUrl = `https://storage.googleapis.com/${bucket.name}/${cardImagePath}`;

    // Upload voice note if provided
    let voiceNoteUrl: string | null = null;
    if (voiceNote) {
      const voiceBuffer = Buffer.from(await voiceNote.arrayBuffer());
      const voicePath = `leads/${uid}/${timestamp}_voice.webm`;
      const voiceFile = bucket.file(voicePath);
      await voiceFile.save(voiceBuffer, { contentType: 'audio/webm' });
      await voiceFile.makePublic();
      voiceNoteUrl = `https://storage.googleapis.com/${bucket.name}/${voicePath}`;
    }

    // Look up the SP's country-specific database
    const spDatabaseId = await getUserDatabaseId(uid);
    const spDb = getDbForId(spDatabaseId) || adminDb;

    // Save the pending lead to the SP's country database
    const leadData = {
      status: 'pending',
      capturedByUid: uid,
      ownerUid: ownerUid || uid,
      postId: postId || null,
      cardImageUrl,
      voiceNoteUrl,
      textNote: textNote || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      // AI fields — null until processed
      contactInfo: null,
      temperature: null,
      actionItem: null,
      contextSummary: null,
      processedAt: null,
    };

    const docRef = await spDb.collection('Leads').add(leadData);

    return NextResponse.json({
      success: true,
      leadId: docRef.id,
      databaseId: spDatabaseId,
    });

  } catch (error: any) {
    console.error('Lead save error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save lead' },
      { status: 500 }
    );
  }
}
