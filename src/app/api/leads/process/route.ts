import { NextRequest, NextResponse } from 'next/server';
import { adminDb, admin, getUserDatabaseId, getDbForId } from '@/lib/firebase-admin';
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

    // Accept a leadId — the lead doc was already saved by the client
    const body = await req.json();
    const { leadId } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required' }, { status: 400 });
    }

    // Look up the SP's country-specific database (same pattern as onboarding/profile)
    const spDatabaseId = await getUserDatabaseId(uid);
    const spDb = getDbForId(spDatabaseId) || adminDb;

    // Fetch the pending lead doc from the SP's database
    const leadRef = spDb.collection('Leads').doc(leadId);
    const leadSnap = await leadRef.get();

    if (!leadSnap.exists) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const leadData = leadSnap.data()!;

    // Only the capturing SP can trigger processing
    if (leadData.capturedByUid !== uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (leadData.status !== 'pending') {
      return NextResponse.json({ error: `Lead is already ${leadData.status}` }, { status: 409 });
    }

    // Mark as processing
    await leadRef.update({ status: 'processing' });

    // Download card image from Firebase Storage and convert to base64
    const imageResponse = await fetch(leadData.cardImageUrl);
    if (!imageResponse.ok) throw new Error('Failed to download card image from Storage');
    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');

    // Download voice note if available
    let audioBase64: string | undefined;
    if (leadData.voiceNoteUrl) {
      const audioResponse = await fetch(leadData.voiceNoteUrl);
      if (audioResponse.ok) {
        const audioBuffer = await audioResponse.arrayBuffer();
        audioBase64 = Buffer.from(audioBuffer).toString('base64');
      }
    }

    // Run Gemini AI extraction
    const extractionResult = await extractLead({
      imageBase64,
      audioBase64,
      textNote: leadData.textNote || undefined,
    });

    // Update the lead doc with AI results
    await leadRef.update({
      status: 'processed',
      contactInfo: extractionResult.contactInfo,
      temperature: extractionResult.temperature,
      actionItem: extractionResult.actionItem,
      contextSummary: extractionResult.contextSummary,
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      leadId,
      lead: extractionResult,
    });

  } catch (error: any) {
    console.error('Lead processing error:', error);

    // If we have a leadId and something failed after marking as processing,
    // reset status back to pending so the user can retry
    try {
      const body = await req.json().catch(() => ({}));
      if (body?.leadId && adminDb) {
        await adminDb.collection('Leads').doc(body.leadId).update({
          status: 'pending',
        });
      }
    } catch { /* ignore reset errors */ }

    return NextResponse.json(
      { error: error.message || 'Failed to process lead' },
      { status: 500 }
    );
  }
}
