# Cost Analysis: Google AI Studio vs. Vertex AI for Gemini 2.5 Flash

This document provides a detailed cost comparison and real-world calculation model for running the **Gemini 2.5 Flash** model (for lead extraction, processing, and semantic search) on both **Google AI Studio (Gemini API)** and **Google Cloud Vertex AI**.

---

## 1. Token-Level Pricing Comparison

| Platform / Cost Item | Input Price (per 1M tokens) | Output Price (per 1M tokens) | Context Caching Price (per 1M tokens / hr) | Text Embeddings Price (per 1M tokens) |
| :--- | :--- | :--- | :--- | :--- |
| **Google AI Studio (Gemini Developer API)** | $0.30 | $2.50 | $0.075 (Storage) / $0.15 (Query) | $0.025 (`text-embedding-004`) |
| **Google Cloud Vertex AI API** | $0.30 | $2.50 | $0.075 (Storage) / $0.15 (Query) | $0.025 (`text-embedding-004`) |

> **Verdict**: The core per-token utility cost is **exactly identical** across both Google platforms. 

---

## 2. Infrastructure & Overhead Costs

While token costs are the same, the operational overhead and billing structures differ:

### Google AI Studio (Developer API)
*   **Free Tier**: Includes a free rate-limited tier (15 Requests per Minute / 1,500 Requests per Day). Excellent for development and beta testing.
*   **Infrastructure Overhead**: **$0.00**. You only pay for token usage once you link a billing account and request pay-as-you-go scaling.
*   **Pricing Predictability**: Simple billing per API call based on token size.

### Google Cloud Vertex AI
*   **Free Tier**: No model free tier. You pay for all calls from request #1.
*   **Infrastructure Overhead**: Possible additional charges for Google Cloud resources:
    *   *Virtual Private Cloud (VPC-SC)* network transfers (if deploying behind strict enterprise private networks).
    *   *Vertex AI Pipelines / MLOps* tracking (if using automated deployment retraining blocks).
    *   *IAM & Key Management Service (KMS)* key rotations.
*   **Billing Complexity**: Invoices are integrated directly into standard Google Cloud Platform (GCP) bills alongside Firestore, App Hosting, and Cloud Functions.

---

## 3. Real-World Cost Estimation Per Action

Let's calculate the exact transaction costs for the system under regular usage.

### Scenario A: Processing 1 Lead (AI Extraction)
*   **Input**: Card Image (OCR converted to ~500 tokens) + Voice Note (~100 tokens) + Prompt (~400 tokens) = **1,000 Input Tokens**
*   **Output**: Extracted Contact info + Action Item + Summary = **300 Output Tokens**
*   **Formula**: `(1,000 * $0.0000003) + (300 * $0.0000025)`
*   **Cost**: **$0.00105** (approx. **1/10th of a cent**)
*   *Scale*: Processing 1,000 leads costs **$1.05**.

### Scenario B: Running 1 Semantic Search Query (GPT Recall Window)
*   **Step 1: Embed Query**: User inputs query (~20 tokens). Embedded using `text-embedding-004`.
    *   *Embedding Cost*: `20 * $0.000000025` = **$0.0000005** (essentially free).
*   **Step 2: Database Retrieval**: Firestore retrieves the 5 most relevant leads matching the query.
    *   *Firestore Cost*: 5 read operations = **$0.000003** (standard Firestore pricing).
*   **Step 3: Synthesis (LLM)**: We pass the user's prompt + 5 matching lead text summaries into Gemini 2.5 Flash to synthesize the answer.
    *   *Input*: Prompt (~200 tokens) + 5 leads (~1,500 tokens) = **1,700 Input Tokens**.
    *   *Output*: Natural language answer (~250 tokens) = **250 Output Tokens**.
    *   *Formula*: `(1,700 * $0.0000003) + (250 * $0.0000025)` = **$0.001135**.
*   **Total Cost**: **$0.001138** (approx. **0.11 cents**)
*   *Scale*: Querying the copilot 1,000 times costs **$1.14**.

---

## 4. Cost Optimization Strategy: Prompt Caching

If the user runs multiple queries in a row, we can cache the lead directory context on the model:
*   Instead of sending the lead catalog with every query, we store the catalog in Gemini's context cache.
*   **Pricing Saving**: Caching inputs cuts input token rates by **50%** ($0.15 per million tokens instead of $0.30). For frequent power users, this reduces search execution costs significantly.

---

## 5. Summary Recommendation

1.  **For Launch & Scaling**: Stick with **Google AI Studio (Pay-As-You-Go)**. It delivers identical model pricing, has a free tier for development, incurs zero infrastructure overhead, and easily supports quotas of thousands of requests per minute by registering a billing card.
2.  **For Enterprise Compliance**: Migrate to **Vertex AI** only when you need strict enterprise controls, dedicated SLAs, SOC2 compliance guarantees, private VPC networking, or data residency constraints (e.g. strict EU-only model routing).
