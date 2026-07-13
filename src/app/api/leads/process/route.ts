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
import { extractLead } from '@/ai/flows/lead-extraction';
import { ai } from '@/ai/genkit';
import { vertexAI } from '@genkit-ai/google-genai';
import { checkAndConsumeQuota } from '@/lib/services/billing';


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

    // Validate and consume card scanning quota
    const quotaCheck = await checkAndConsumeQuota(uid, 'cardScans');
    if (!quotaCheck.allowed) {
      if (quotaCheck.error === 'subscription_expired') {
        return NextResponse.json({ error: 'Subscription expired. Please renew.' }, { status: 402 });
      }
      return NextResponse.json({ error: 'Card processing quota exceeded. Please upgrade your plan.' }, { status: 402 });
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

    // 1. Fetch Owner's profile to retrieve companyId (for B2B scalability)
    let companyId: string | null = null;
    try {
      const ownerProfile = await adminDb.collection('users').doc(leadData.ownerUid).get();
      if (ownerProfile.exists) {
        companyId = ownerProfile.data()?.companyId || null;
      }
    } catch (profileErr) {
      console.error('Error fetching owner profile for companyId:', profileErr);
    }

    // 2. Check for duplicate processed contacts in the SP's database (de-duplication)
    let existingLeadId: string | null = null;
    let existingLeadData: any = null;
    const email = extractionResult.contactInfo.email;
    const phone = extractionResult.contactInfo.phone;

    if (email || phone) {
      const leadsRef = spDb.collection('Leads');
      // Look up unique fully processed leads
      if (email) {
        const snap = await leadsRef
          .where('status', '==', 'processed')
          .where('contactInfo.email', '==', email)
          .limit(1)
          .get();
        if (!snap.empty) {
          existingLeadId = snap.docs[0].id;
          existingLeadData = snap.docs[0].data();
        }
      }
      if (!existingLeadId && phone) {
        const snap = await leadsRef
          .where('status', '==', 'processed')
          .where('contactInfo.phone', '==', phone)
          .limit(1)
          .get();
        if (!snap.empty) {
          existingLeadId = snap.docs[0].id;
          existingLeadData = snap.docs[0].data();
        }
      }
    }

    // 3. Compile context summaries and action items
    const finalSummary = existingLeadId 
      ? `${existingLeadData.contextSummary || ''}\n\n[Additional Note - SP Scan]: ${extractionResult.contextSummary || ''}`.trim()
      : (extractionResult.contextSummary || '');

    const finalAction = existingLeadId
      ? `${existingLeadData.actionItem || ''}\n\n[Additional Action]: ${extractionResult.actionItem || ''}`.trim()
      : (extractionResult.actionItem || '');

    // 4. Generate Vertex AI text embedding vector
    const profileText = `
      Name: ${extractionResult.contactInfo.name || ''}
      Company: ${extractionResult.contactInfo.company || ''}
      Title: ${extractionResult.contactInfo.designation || ''}
      Location: ${leadData.eventLocation || ''}
      Notes: ${finalSummary}
      Actions: ${finalAction}
    `.trim();

    let embedding: number[] | null = null;
    try {
      const embedResult = await ai.embed({
        embedder: vertexAI.embedder('text-embedding-005'),
        content: profileText,
      });
      if (embedResult && embedResult[0]?.embedding) {
        embedding = embedResult[0].embedding;
      }
    } catch (embedErr) {
      console.error('Failed to generate Vertex AI embedding:', embedErr);
    }

    // 5. Update Firestore records
    if (existingLeadId) {
      // Merge into the Master Contact record
      await spDb.collection('Leads').doc(existingLeadId).update({
        contextSummary: finalSummary,
        actionItem: finalAction,
        embedding: embedding || existingLeadData.embedding || null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Mark current lead ID as duplicate reference
      await leadRef.update({
        status: 'duplicate',
        masterLeadId: existingLeadId,
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      // Create new processed Lead record
      await leadRef.update({
        status: 'processed',
        contactInfo: extractionResult.contactInfo,
        temperature: extractionResult.temperature,
        actionItem: extractionResult.actionItem,
        contextSummary: extractionResult.contextSummary,
        embedding: embedding || null,
        companyId: companyId || null,
        linkedinData: null, // Option B placeholder
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json({
      success: true,
      leadId: existingLeadId || leadId,
      merged: !!existingLeadId,
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
