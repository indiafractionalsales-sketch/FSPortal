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

async function fetchWebsiteContent(url: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 second timeout
    
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      return `[Failed to load website: HTTP ${res.status}]`;
    }
    
    const html = await res.text();
    // Strip scripts, styles, and HTML tags to get clean text
    const cleanText = html
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
      .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
      
    // Return first 5000 characters
    return cleanText.slice(0, 5000);
  } catch (err: any) {
    console.error(`Error scraping website ${url}:`, err.message || err);
    return `[Failed to scrape website: ${err.message || err}]`;
  }
}

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

    // Check for URLs in the queryText to scrape
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = queryText.match(urlRegex) || [];
    let websiteData: { url: string; content: string }[] = [];
    
    if (urls.length > 0) {
      console.log(`[AI Networking] Found ${urls.length} URLs in query. Scraping...`);
      const scrapers = urls.map(async (url) => {
        const content = await fetchWebsiteContent(url);
        return { url, content };
      });
      websiteData = await Promise.all(scrapers);
      debugInfo.scrapedUrlsCount = websiteData.length;
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

    // Check if user is asking for all leads / everything in general
    const matchesAll = queryWords.length === 0 || 
                       queryText.toLowerCase().includes("show all") || 
                       queryText.toLowerCase().includes("list all") ||
                       queryText.toLowerCase().includes("show everything") ||
                       queryText.toLowerCase().includes("list everything");

    const textMatchResults: any[] = [];
    const allDocs = [...ownerAllSnap.docs, ...capturerAllSnap.docs];

    // Extract domain from crawled URLs to enable matching by website domain
    const domains = urls.map(urlStr => {
      try {
        return new URL(urlStr).hostname.replace('www.', '').toLowerCase();
      } catch (e) {
        return null;
      }
    }).filter(Boolean) as string[];

    for (const doc of allDocs) {
      const data = doc.data();
      const ci = data.contactInfo || {};
      const web = (ci.website || "").toLowerCase();
      
      const domainMatch = domains.some(domain => web.includes(domain));
      
      if (matchesAll || domainMatch) {
        textMatchResults.push({ id: doc.id, ...data });
      } else {
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
    if (matchingLeads.length === 0 && websiteData.length === 0) {
      reportText = "I searched your Lead Directory but could not find any processed contacts or websites matching your query. Try searching for other companies, locations, or product types.";
    } else {
      let systemPrompt = `
        You are an expert AI Networking Assistant for "Fractional Sales Partner". 
        You help Business Owners and Sales Partners analyze, search, and recall contacts from their lead directories, and perform website analysis.
        
        The user has asked the following search query: "${queryText}"
        Compile a highly professional report summarizing the results.
        
        Guidelines:
        1. Start with a brief, intelligent executive summary.
      `.trim();

      if (matchingLeads.length > 0) {
        systemPrompt += `
        
        2. Compile the matched contacts in a structured Markdown table with columns: Name, Company, Designation, Location, Action Item, and Temperature (Hot/Warm/Cold).
        3. Provide details on each matching lead, summarizing notes from their meetings (Pune trade fair, dairy equipment, etc.).
        `.trim();
      } else {
        systemPrompt += `
        
        2. Mention that no matching contacts were found in their local database.
        `.trim();
      }

      if (websiteData.length > 0) {
        systemPrompt += `
        
        4. CRITICAL WEBSITE ANALYSIS: We crawled the website(s) mentioned in the query. Under a dedicated "Website Insights & Company Profile" section:
           - Explain the company's core business, services, products, or industry.
           - Identify any immediate business opportunities, target audience, or potential synergies.
           - If a database contact matches this website, tie the website insights back to that contact's profile.
        `.trim();
      }

      systemPrompt += `
        
        5. Add a clean "Next Steps" checklist highlighting immediate follow-up items or recommendations.
        6. Maintain a professional, premium corporate tone. Keep descriptions concise.
      `.trim();

      let userPrompt = `
        Search Query: "${queryText}"
        Matched Leads Data:
        ${JSON.stringify(matchingLeads, null, 2)}
      `;

      if (websiteData.length > 0) {
        userPrompt += `
        
        Crawled Website Data:
        ${websiteData.map(d => `URL: ${d.url}\nContent Snippet:\n${d.content}\n---`).join('\n')}
        `;
      }

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
