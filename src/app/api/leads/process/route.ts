import { NextRequest, NextResponse } from 'next/server';
import { adminDb, admin } from '@/lib/firebase-admin';
import { extractLead } from '@/ai/flows/lead-extraction';

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

    const body = await req.json();
    const { imageUrl, audioUrl, textNote, postId, ownerUid } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    // Determine who owns this lead
    // If captured from a post context, ownerUid is the Business Owner
    // If captured independently (global CRM), ownerUid is the capturing user themselves
    const leadOwnerUid = ownerUid || uid;

    // Call the AI extraction flow
    const extractionResult = await extractLead({
      imageUrl,
      audioUrl: audioUrl || undefined,
      textNote: textNote || undefined,
    });

    // Save the lead to Firestore
    const leadData = {
      ownerUid: leadOwnerUid,
      capturedByUid: uid,
      postId: postId || null,
      contactInfo: extractionResult.contactInfo,
      temperature: extractionResult.temperature,
      actionItem: extractionResult.actionItem,
      contextSummary: extractionResult.contextSummary,
      originalImageUrl: imageUrl,
      originalAudioUrl: audioUrl || null,
      textNote: textNote || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await adminDb.collection('Leads').add(leadData);

    return NextResponse.json({
      success: true,
      leadId: docRef.id,
      data: extractionResult,
    });

  } catch (error: any) {
    console.error('Lead processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process lead' },
      { status: 500 }
    );
  }
}
