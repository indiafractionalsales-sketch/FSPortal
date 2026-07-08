<!--
  Copyright (c) 2026 Biztribe Trading & Consultancy India Private Limited.
  All rights reserved.

  This document is part of the Fractional Sales Partner platform.
  CONFIDENTIAL AND PROPRIETARY — Unauthorised copying, redistribution,
  modification, or use of this document, via any medium, is strictly prohibited.
  Violation will result in civil and criminal prosecution under the
  Copyright Act 1957, Information Technology Act 2000, and applicable
  Indian and international intellectual property laws.
-->

# Implementation Plan: AI Powered Networking

This document describes the technical steps to build **AI Powered Networking**—a conversational, semantic search and reporting interface that allows Business Owners and Sales Partners to query their leads (e.g., *"Who was the lady with the dairy unit in Pune?"* or *"Who can build mobile apps?"*).

---

## 1. Naming & Entry Point

*   **Feature Name**: **AI Powered Networking**
*   **UI Entry Point**: We will add a new item under the **Quick Links** section in the Left Sidebar labeled:
    `✨ AI Powered Networking`
*   **Target Page**: `/networking` (a full-page conversational dashboard maintaining the identical Left/Right sidebar layouts of the homepage).

---

## 2. Key Architectural Guardrails (Brainstormed Checklist)

To address your requirements, the architecture incorporates the following features:

### A. De-duplication (Master Contact vs. Captures)
*   Instead of writing duplicate leads to Firestore when different Sales Partners scan the same card, the system will resolve them to a single **Master Contact** document.
*   The voice notes and partner-specific logs are registered as sub-records (**Captures**).
*   The embedding vector is generated once for the Master Contact and updated only if new context is added.

### B. High Concurrency Handling (GCP Vertex AI)
*   The API integrates with **Vertex AI Agent Platform API** using standard GCP authentication.
*   Includes automatic retry logic with **exponential backoff** to handle transient rate-limit errors (HTTP 429) gracefully.

### C. Monetization & Access Validation
*   The query API enforces a pre-flight check against the user's regional billing schema (`UserBilling` model) to verify they have sufficient credits or a valid active plan before executing any model calculations.

### D. Structured Reporting (Synthesis Output)
*   The AI won't just output raw text; it is instructed to compile findings in a structured **Report** format (displaying tables with contact info, action items, dates, and locations).
*   A **"Download Report"** CTA will allow users to export the AI's search results as a CSV/PDF.

### E. Scalability (Company ID Stamping)
*   The Lead schema includes an optional `companyId` field (stamped from the owner's profile) to keep the B2B enterprise partitioning window open for the future.

### F. LinkedIn Profiling Extension (Option B Placeholder)
*   The database and vector serialization schemas include an optional `linkedinData` field. 
*   For the initial MVP, this field remains empty (we query over cards, voice notes, and website catalogs). This stages the codebase for a direct API key drop-in later (e.g., Proxycurl/RapidAPI integrations) without database refactoring.

---

## 3. Proposed Changes

### Component 1: Database Schema & Vector Indexes

#### [MODIFY] [firestore.indexes.json](file:///c:/Users/Hrushikesh%20Pangarkar/OneDrive/Desktop/Fracctional%20Sales/Org/firestore.indexes.json)
Define vector indexes for the `Leads` collection:
```json
{
  "collectionGroup": "Leads",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "ownerUid", "order": "ASCENDING" },
    { "fieldPath": "companyId", "order": "ASCENDING" },
    {
      "fieldPath": "embedding",
      "vectorConfig": { "dimension": 768, "flat": {} }
    }
  ]
}
```

---

### Component 2: Write-Time Pipeline (De-duplication & Stamping)

#### [MODIFY] [process/route.ts](file:///c:/Users/Hrushikesh%20Pangarkar/OneDrive/Desktop/Fracctional%20Sales/Org/src/app/api/leads/process/route.ts)
*   Upon Gemini extraction, search if a lead with the same `email` or `phone` exists.
*   If a match exists:
    *   Append the new partner commentary to the existing `contextSummary`.
    *   Stamp the owner's `companyId` (fetched from their profile).
    *   Re-generate the text embedding using `vertexai/text-embedding-004` and update the document.
*   If no match exists:
    *   Create a new lead document with the `companyId` and the generated embedding vector.

---

### Component 3: Search & Synthesis API

#### [NEW] [query/route.ts](file:///c:/Users/Hrushikesh%20Pangarkar/OneDrive/Desktop/Fracctional%20Sales/Org/src/app/api/leads/query/route.ts)
Build a POST handler endpoint at `/api/leads/query` which:
1.  **Authenticates** the user via `idToken`.
2.  **Validates Access**: Checks the regional monetization schema on the user's profile.
3.  **Embeds User Question** via `vertexai/text-embedding-004`.
4.  **Queries Firestore** using `findNearest` scoped to the user's regional database (`fsindiadb` or `default`).
5.  **Synthesizes Report**: Directs `vertexai/gemini-2.5-flash` to return a structured report layout in markdown (combining high-level summary, tabular contacts details, and action lists).

---

### Component 5: Left Sidebar & UI Dashboard

#### [MODIFY] [home/page.tsx](file:///c:/Users/Hrushikesh%20Pangarkar/OneDrive/Desktop/Fracctional%20Sales/Org/src/app/home/page.tsx) / [insights/[postId]/page.tsx](file:///c:/Users/Hrushikesh%20Pangarkar/OneDrive/Desktop/Fracctional%20Sales/Org/src/app/insights/%5BpostId%5D/page.tsx)
*   Add the `✨ AI Powered Networking` link to the Quick Links left sidebar block.

#### [NEW] [networking/page.tsx](file:///c:/Users/Hrushikesh%20Pangarkar/OneDrive/Desktop/Fracctional%20Sales/Org/src/app/networking/page.tsx)
*   Build the user interface: Left/Right sidebars + Center AI Search Panel.
*   Include chat interface with prompt suggestion bubbles and typewriter output.
*   Add **Download Report (CSV)** and **Download PDF** buttons for exporting search results.

---

## 4. Verification Plan

### Automated Tests
- Run `npx tsc --noEmit` to ensure typecheck compliance across the new NextJS API endpoints and frontend components.

### Manual Verification
1. Click the `AI Powered Networking` link in the Left Sidebar.
2. Enter natural language prompts (e.g. *"Show me warm leads from Pune trade show"*).
3. Verify the AI returns results in a clean table report layout.
4. Click **Download Report** and verify the CSV exports correctly.
5. Verify billing credit is decremented.
