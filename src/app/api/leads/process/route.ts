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

    // Parse multipart FormData (frontend sends FormData, not JSON)
    const formData = await req.formData();
    const imageBase64 = formData.get('imageBase64') as string | null;
    const audioFile = formData.get('audio') as File | null;
    const textNote = formData.get('textNote') as string | null;
    const postId = formData.get('postId') as string | null;
    const targetOwnerUid = formData.get('targetOwnerUid') as string | null;

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    // Convert audio File to base64 if provided
    let audioBase64: string | undefined;
    if (audioFile) {
      const arrayBuffer = await audioFile.arrayBuffer();
      audioBase64 = Buffer.from(arrayBuffer).toString('base64');
    }

    // Determine lead owner
    const leadOwnerUid = targetOwnerUid || uid;

    // Call the AI extraction flow
    const extractionResult = await extractLead({
      imageBase64,
      audioBase64,
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
      textNote: textNote || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await adminDb.collection('Leads').add(leadData);

    return NextResponse.json({
      success: true,
      leadId: docRef.id,
      lead: extractionResult,
    });

  } catch (error: any) {
    console.error('Lead processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process lead' },
      { status: 500 }
    );
  }
}
