import { NextRequest, NextResponse } from 'next/server';
import { admin, adminDb, getDbForId, getUserDatabaseId } from '@/lib/firebase-admin';
import { ai } from '@/ai/genkit';

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

    // 4. Generate query vector using Vertex AI embedding model
    let queryVector: number[] = [];
    try {
      const embedResult = await ai.embed({
        embedder: 'vertexai/text-embedding-004',
        content: queryText,
      });
      if (embedResult && embedResult[0]?.embedding) {
        queryVector = embedResult[0].embedding;
      }
    } catch (embedErr) {
      console.error('Failed to generate query embedding:', embedErr);
      return NextResponse.json({ error: 'Failed to process AI embedding for search' }, { status: 500 });
    }

    // 5. Query Firestore leads in parallel for both Owner and Capturer scoping
    const leadsRef = db.collection('Leads');
    
    // We execute flat nearest neighbor cosine search on both ownership types to keep SP connects aligned
    const ownerQuery = leadsRef
      .where('status', '==', 'processed')
      .where('ownerUid', '==', uid)
      .findNearest('embedding', queryVector, {
        limit: 15,
        distanceMeasure: 'COSINE',
      })
      .get();

    const capturerQuery = leadsRef
      .where('status', '==', 'processed')
      .where('capturedByUid', '==', uid)
      .findNearest('embedding', queryVector, {
        limit: 15,
        distanceMeasure: 'COSINE',
      })
      .get();

    const [ownerSnap, capturerSnap] = await Promise.all([ownerQuery, capturerQuery]);

    // Merge snaps removing duplicates
    const uniqueLeadsMap = new Map<string, any>();
    ownerSnap.docs.forEach(doc => uniqueLeadsMap.set(doc.id, { id: doc.id, ...doc.data() }));
    capturerSnap.docs.forEach(doc => uniqueLeadsMap.set(doc.id, { id: doc.id, ...doc.data() }));

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
    });

  } catch (err: any) {
    console.error("AI Powered Networking search error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
