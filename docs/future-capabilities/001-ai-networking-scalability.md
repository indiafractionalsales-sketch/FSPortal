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

# Scalability Assessment & Future Capability Enhancements: AI Powered Networking

This document provides a technical assessment of the system's capacity to handle massive concurrent search loads and outlines architectural recommendations for future scaling.

---

## 1. Scenario Under Evaluation

* **Active User Count:** 5,000 users querying simultaneously in a 1-to-2-minute window (~40 to 80 requests per second).
* **Database Volume:** Each user has 10,000+ personal lead records (totaling 50,000,000+ leads in the system).
* **Query Context:** Regional multi-tenant routing (e.g., `default` and `fsindiadb` databases).

---

## 2. Current Architecture Capacity & Bottlenecks

Under the current architecture, a query triggers:
1. A database read to check billing/credits.
2. An embedding generation call to Vertex AI (`text-embedding-005`).
3. A native Firestore Vector Search query (`findNearest`).
4. A keyword fallback text search (limited to the 50 most recent leads).
5. A Gemini 2.5 Flash model invocation to synthesize the final markdown report.

### Key Bottlenecks at Scale:

### 1. Gemini & Vertex AI Rate Limits (High Risk)
* **Default Quota:** Standard Google Cloud projects limit Gemini 2.5 Flash to **1,000 RPM (Requests Per Minute)** and Vertex AI Embeddings to **3,000 RPM**.
* **Impact:** With 5,000 users querying within a minute, 4,000 users will receive `HTTP 429 (Too Many Requests)` rate-limiting errors from the AI model.

### 2. Manual Text-Search Fallback (Functional Limitation)
* **Current Design:** Strategy B (text keyword search) downloads up to 50 leads per query to perform client-side keyword matches.
* **Impact:** 
  * If the vector index **is** active, this functions fine as a minor safety net for recent records.
  * If the vector index **is not** active, the search is functionally blind to 9,950 of the user's 10,000+ leads.
  * If the 50-document limit were removed to search all 10,000+ leads client-side, the next serverless container would run out of memory, timeout, and generate massive Firestore read charges ($30+ USD per minute).

---

## 3. Scalability Analysis by Layer

### A. Database Layer (Firestore)
* **Capacity:** Native Firestore vector indexing is built on Google Spanner and scales horizontally. It handles **50,000+ read operations per second** easily.
* **Status:** **Ready**. Firestore will comfortably handle 10,000+ vector searches per minute with negligible latency once indexes are active.

### B. Hosting Layer (Firebase App Hosting / Cloud Run)
* **Capacity:** Serverless Cloud Run containers auto-scale instantly from 0 to 1,000+ instances. Each container supports 250 concurrent requests.
* **Status:** **Ready**. The hosting layer can handle 25,000+ concurrent requests per minute without performance degradation.

### C. AI Model Layer (Vertex AI / Gemini)
* **Capacity:** Default project quotas are strictly enforced at the project level.
* **Status:** **Immediate bottleneck** (1,000 RPM limit).

---

## 4. Future Capability Enhancements & Scaling Playbook

To transition the AI Powered Networking search API from 1,000 users/min to **10,000+ users/min**, the following enhancements are recommended:

### Phase 1: AI Quota Scaling (Zero Code Changes)
1. Go to the **Google Cloud Console** -> **IAM & Admin** -> **Quotas**.
2. Filter for:
   * `generate_content_requests_per_minute` for `gemini-2.5-flash`
   * `predict_requests_per_minute` for `text-embedding-005`
3. Request a quota increase to **10,000 RPM** or higher. This is usually approved automatically or within a few hours for billing-enabled corporate accounts.

### Phase 2: Decoupled High-Volume Text Search
To search large text records (10,000+) without relying on memory-heavy client-side loops:
* **Integrate Algolia / Typesense:** Deploy the **Firestore Search Extension** to automatically sync the `Leads` collection to Algolia. 
* Replace Strategy B (client-side text scan) with an API call to Algolia. Algolia searches millions of records in under 20ms and scales to hundreds of thousands of concurrent users.

### Phase 3: Application Resiliency (Rate Limiting & Retries)
* **Server-Side Queue / Throttling:** Add a rate-limiting middleware (e.g., Upstash or Redis rate-limiting) to next.js routes to smooth out sudden concurrency spikes.
* **Client-Side Exponential Backoff:** Update the web client chat logic to catch `HTTP 429` status codes and transparently retry the query after a small delay (1s, 2s, 4s) instead of failing.
