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
import { admin, adminDb, getDbForId, getUserDatabaseId } from '@/lib/firebase-admin';
import { ai } from '@/ai/genkit';
import { vertexAI } from '@genkit-ai/google-genai';

export async function POST(req: NextRequest) {
  try {
    // 1. Verify authentication
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
    const { queryText } = body;

    if (!queryText || typeof queryText !== 'string') {
      return NextResponse.json({ error: 'queryText is required' }, { status: 400 });
    }

    // 2. Pre-Flight Billing / Credit Check
    let billingEnabled = true;
    try {
      const userProfile = await adminDb.collection('users').doc(uid).get();
      if (userProfile.exists) {
        const billing = userProfile.data()?.billing;
        if (billing) {
          // Verify if general subscription is still valid
          if (billing.validUntil && new Date(billing.validUntil) < new Date()) {
            return NextResponse.json({ error: 'Subscription expired. Please renew.' }, { status: 402 });
          }
          // Verify if AI search feature is enabled
          const searchFeat = billing.features?.aiSearch;
          if (searchFeat && !searchFeat.enabled) {
            return NextResponse.json({ error: 'AI Powered Networking is not enabled in your current plan.' }, { status: 403 });
          }
          // Verify metered credits
          if (searchFeat && searchFeat.creditType === 'metered' && searchFeat.creditsRemaining <= 0) {
            return NextResponse.json({ error: 'Out of credits. Please purchase more search credits.' }, { status: 402 });
          }
          billingEnabled = searchFeat?.enabled ?? true;
        }
      }
    } catch (billingErr) {
      console.warn("Skipping billing pre-flight check due to error:", billingErr);
    }

    // 3. Resolve user's regional database ID
    const databaseId = await getUserDatabaseId(uid);
    const db = getDbForId(databaseId) || adminDb;
    const debugInfo: any = { uid, databaseId, queryText, dbFallback: !getDbForId(databaseId) };
    console.log(`[AI Networking] uid=${uid}, databaseId=${databaseId}, queryText="${queryText}"`);

    // 4. Generate query vector using Vertex AI embedding model
    let queryVector: number[] = [];
    try {
      const embedResult = await ai.embed({
        embedder: vertexAI.embedder('text-embedding-005'),
        content: queryText,
      });
      if (embedResult && embedResult[0]?.embedding) {
        queryVector = embedResult[0].embedding;
        debugInfo.embeddingDims = queryVector.length;
      }
    } catch (embedErr) {
      console.error('Failed to generate query embedding:', embedErr);
      return NextResponse.json({ error: 'Failed to process AI embedding for search' }, { status: 500 });
    }

    // 4b. Debug: Check how many leads exist for this user
    try {
      const allLeadsSnap = await db.collection('Leads').where('ownerUid', '==', uid).limit(5).get();
      debugInfo.leadsForOwner = allLeadsSnap.size;
      if (allLeadsSnap.size > 0) {
        const sample = allLeadsSnap.docs[0].data();
        debugInfo.sampleLead = { status: sample.status, hasEmbedding: !!sample.embedding, name: sample.contactInfo?.name };
      }
    } catch (dbErr: any) {
      debugInfo.leadsQueryError = dbErr.message || dbErr.code;
    }
    // Also check capturer leads
    try {
      const capSnap = await db.collection('Leads').where('capturedByUid', '==', uid).limit(5).get();
      debugInfo.leadsForCapturer = capSnap.size;
    } catch (dbErr: any) {
      debugInfo.capturerQueryError = dbErr.message || dbErr.code;
    }

    // 5. Search leads — two strategies run in parallel:
    //    A) Vector search (for leads WITH embeddings)
    //    B) Text-match fallback (catches ALL leads including those without embeddings)
    const leadsRef = db.collection('Leads');
    const queryLower = queryText.toLowerCase();
    
    // Strategy A: Vector nearest-neighbor search (only matches leads that have embedding field)
    let vectorResults: any[] = [];
    if (queryVector.length > 0) {
      try {
        const ownerQuery = leadsRef
          .where('ownerUid', '==', uid)
          .findNearest('embedding', queryVector, {
            limit: 15,
            distanceMeasure: 'COSINE',
          })
          .get();

        const capturerQuery = leadsRef
          .where('capturedByUid', '==', uid)
          .findNearest('embedding', queryVector, {
            limit: 15,
            distanceMeasure: 'COSINE',
          })
          .get();

        const [ownerSnap, capturerSnap] = await Promise.all([ownerQuery, capturerQuery]);
        ownerSnap.docs.forEach(doc => vectorResults.push({ id: doc.id, ...doc.data() }));
        capturerSnap.docs.forEach(doc => vectorResults.push({ id: doc.id, ...doc.data() }));
      } catch (vectorErr) {
        console.warn('[AI Networking] Vector search failed (index may not exist yet):', (vectorErr as any).message);
      }
    }

    // Strategy B: Fetch all user's leads and do client-side keyword matching
    const ownerAllSnap = await leadsRef.where('ownerUid', '==', uid).limit(50).get();
    const capturerAllSnap = await leadsRef.where('capturedByUid', '==', uid).limit(50).get();
    
    // Extract meaningful keywords from the query (ignore common stop words)
    const stopWords = new Set(['is','are','there','anyone','anybody','any','the','a','an','in','on','at',
      'to','for','of','with','do','we','have','has','had','can','could','who','what','where','when',
      'how','find','show','me','my','our','called','named','name','database','from','and','or','not',
      'i','it','its','this','that','get','all','out','about','their','them','be','been','was','were',
      'will','would','should','may','might','let','no','yes','please','want','need','looking','search',
      'contacts','leads','lead','contact','directory','list','know','tell','give']);
    const queryWords = queryText.toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1 && !stopWords.has(w));
    
    debugInfo.searchKeywords = queryWords;

    const textMatchResults: any[] = [];
    const allDocs = [...ownerAllSnap.docs, ...capturerAllSnap.docs];
    for (const doc of allDocs) {
      const data = doc.data();
      const ci = data.contactInfo || {};
      // Search across all text fields — contactInfo is a nested object
      const searchableText = [
        ci.name, ci.email, ci.phone, ci.company,
        ci.designation, ci.address, ci.city, ci.website,
        data.contextSummary, data.actionItem, data.textNote,
      ].filter(Boolean).join(' ').toLowerCase();
      
      // Match if ANY keyword appears in the searchable text
      const matches = queryWords.some(keyword => searchableText.includes(keyword));
      if (matches) {
        textMatchResults.push({ id: doc.id, ...data });
      }
    }

    // Merge both result sets, deduplicating by doc ID
    const uniqueLeadsMap = new Map<string, any>();
    // Vector results first (higher relevance)
    vectorResults.forEach(lead => uniqueLeadsMap.set(lead.id, lead));
    // Then text matches
    textMatchResults.forEach(lead => uniqueLeadsMap.set(lead.id, lead));

    console.log(`[AI Networking] Vector matches: ${vectorResults.length}, Text matches: ${textMatchResults.length}, Total unique: ${uniqueLeadsMap.size}`);

    // Clean embeddings from results to keep API response payload size small
    const matchingLeads = Array.from(uniqueLeadsMap.values()).map(lead => {
      const { embedding, ...safeLead } = lead;
      return safeLead;
    });

    // 6. Synthesize final conversational report using Vertex AI Gemini 2.5 Flash
    let reportText = "";
    if (matchingLeads.length === 0) {
      reportText = "I searched your Lead Directory but could not find any processed contacts matching your query. Try searching for other companies, locations, or product types.";
    } else {
      const systemPrompt = `
        You are an expert AI Networking Assistant for "Fractional Sales Partner". 
        You help Business Owners and Sales Partners analyze, search, and recall contacts from their lead directories.
        
        The user has asked the following search query: "${queryText}"
        We searched their directory and returned the top matching leads.
        
        Compile a highly professional report summarizing the results.
        
        Guidelines:
        1. Start with a brief, intelligent executive summary explaining who matches the user's intent.
        2. Compile the matches in a structured Markdown table with columns: Name, Company, Designation, Location, Action Item, and Temperature (Hot/Warm/Cold).
        3. Provide details on each matching lead, summarizing notes from their meetings (Pune trade fair, dairy equipment, etc.).
        4. Add a clean "Next Steps" checklist highlighting immediate follow-up items or deadlines.
        5. Maintain a professional, premium corporate tone. Keep descriptions concise.
      `.trim();

      const userPrompt = `
        Search Query: "${queryText}"
        Matched Leads Data:
        ${JSON.stringify(matchingLeads, null, 2)}
      `;

      try {
        const genResult = await ai.generate({
          model: 'vertexai/gemini-2.5-flash',
          prompt: userPrompt,
          system: systemPrompt,
        });
        reportText = genResult.text;
      } catch (genErr: any) {
        console.error('Failed to generate Gemini synthesis:', genErr);
        return NextResponse.json({ error: 'Failed to synthesize search report' }, { status: 500 });
      }
    }

    // 7. Post-execution: Decrement metered credits if enabled
    try {
      if (billingEnabled) {
        const userRef = adminDb.collection('users').doc(uid);
        await adminDb.runTransaction(async (t) => {
          const uDoc = await t.get(userRef);
          if (uDoc.exists) {
            const billing = uDoc.data()?.billing;
            const searchFeat = billing?.features?.aiSearch;
            if (searchFeat && searchFeat.creditType === 'metered' && searchFeat.creditsRemaining > 0) {
              t.update(userRef, {
                'billing.features.aiSearch.creditsRemaining': admin.firestore.FieldValue.increment(-1),
              });
            }
          }
        });
      }
    } catch (creditErr) {
      console.warn("Failed to decrement credit count:", creditErr);
    }

    return NextResponse.json({
      report: reportText,
      leads: matchingLeads,
      _debug: debugInfo,
    });

  } catch (err: any) {
    console.error("AI Powered Networking search error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
