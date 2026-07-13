<!--
  Copyright (c) 2026 Biztribe Trading & Consultancy India Private Limited.
  All rights reserved.

  This document is part of the Fractional Sales Partner platform.
  CONFIDENTIAL AND PROPRIETARY — Unauthorised copying, redistribution,
  modification, or use of this file, via any medium, is strictly prohibited.
  Violation will result in civil and criminal prosecution under the
  Copyright Act 1957, Information Technology Act 2000, and applicable
  Indian and international intellectual property laws.
-->

# Implementation Plan: World-Standard Pricing & Monetization Feature

This document details the architectural plan for a **world-class SaaS billing, subscription, and progressive commission** system on the **ScaleFraction** platform. It aligns with standards set by leading platforms like Stripe, Vercel, and Salesforce.

---

## 1. System Overview & Brainstorming

The system manages dynamic regional billing (6 global regions), handles progressive commission slabs, processes metered API consumption, and generates billing records using standard one-time transactions for term-based subscriptions (Option 1: Pre-Paid/Manual Renewal model).

### Key Monetizable Features
*   **A] Card Processing (AI Lead Extraction)**: Scanning business cards and synthesizing with audio notes via Gemini.
*   **B] AI Lead Search (Semantic Copilot)**: Using Vertex AI embeddings and Gemini to query directories via conversational search.
*   **C] Report Generation**: Scanning results and exporting comprehensive leads sheets as downloadable reports.
*   **D] Deal Commission**: Charging platform transaction fees based on Sales Partner pricing.
*   **E] Metered Top-Ups**: Add-on credits for cards, searches, and reports when plan quotas are exhausted.

---

## 2. Multi-Region Pricing Tiers & Schemes

Tiers are dynamically localized based on the user's mapped region.

| Scheme Name | Corporate Plan | Quotas & Features Included | Cost (INR) | Cost (USD - USA/Global) |
| :--- | :--- | :--- | :--- | :--- |
| **Free Tier** | **Starter** | • 5 Card Scans/mo<br>• Max 20 stored cards total<br>• Report generation locked<br>• AI Search locked | **Free** | **Free** |
| **Scheme 1** | **Growth (Silver)** | • 30 Card Scans/mo<br>• Max 250 stored cards total<br>• 1 Report generation total<br>• AI Search locked | **₹59 / month**<br>or **₹639 / year** | **$1.99 / month**<br>or **$19.99 / year** |
| **Scheme 2** | **Professional (Gold)** | • 59 Card Scans/mo<br>• Max 600 stored cards total<br>• Unlimited Report generation<br>• 1 GPT AI search query/mo<br>• Supports query top-ups (99 queries for ₹49) | **₹108 / month**<br>or **₹1296 / year** | **$3.99 / month**<br>or **$39.99 / year** |
| **Scheme 3** | **Enterprise (Platinum)** | • Unlimited Card Scans/mo<br>• Max 5000 stored cards total<br>• Unlimited Report generation<br>• 100 GPT AI search queries/mo<br>• Supports query top-ups (99 queries for ₹49) | **₹369 / month**<br>or **₹3501 / year** | **$9.99 / month**<br>or **$99.99 / year** |

*Note: Regions supported are `IN`, `US`, `GB` (GBP £), `EU` (EUR €), `SEA` (SGD S$), and `ME` (AED).*

---

## 3. World-Standard System Architecture

To meet global software-as-a-service compliance, the architecture incorporates:

```
                                  ┌──────────────────────────┐
                                  │      ScaleFraction UI    │
                                  └─────────────┬────────────┘
                                                │
       ┌──────────────────┬─────────────────────┼─────────────────────┬──────────────────┐
       ▼                  ▼                     ▼                     ▼                  ▼
┌──────────────┐   ┌──────────────┐     ┌──────────────┐       ┌──────────────┐   ┌──────────────┐
│ Left Sidebar │   │ Profile Menu │     │ Scanner Page │       │ AI Search Pg │   │ Reports Page │
│ Plans Button │   │ Billing Link │     │ Quota Widget │       │ Credit Alert │   │ Unlock Banner│
└──────┬───────┘   └──────┬───────┘     └──────┬───────┘       └──────┬───────┘   └──────┬───────┘
       │                  │                    │                      │                  │
       └──────────────────┴────────────────────┼──────────────────────┴──────────────────┘
                                               ▼
                                 ┌──────────────────────────┐
                                 │   /pricing Dashboard     │
                                 │  - Glassmorphic Cards    │
                                 │  - Invoice Ledger Table  │
                                 └─────────────┬────────────┘
                                                │
                                                ▼
                               ┌───────────────────────────────┐
                               │     Standard Razorpay SDK     │
                               │  - Handles Cards & UPI / QR   │
                               └───────────────┬───────────────┘
                                               │
                                               ▼
                               ┌───────────────────────────────┐
                               │  verify-payment API Handler   │
                               │  - Signature Check            │
                               │  - Quota Update Transaction   │
                               │  - Invoice Generator & Audit  │
                               └───────────────────────────────┘
```

### A. Resilient Quota Verification (Secure Middleware Pattern)
Rather than writing verification checks inside every endpoint, we build a centralized middleware utility `withQuotaCheck` in `src/lib/services/billing.ts`. This acts as a decorator for Next.js API handlers, returning standardized HTTP statuses:
*   `402 Payment Required` (Quota fully exhausted, triggers Top-Up/Upgrade popup).
*   `403 Forbidden` (Feature locked on current subscription tier).

### B. Standard Subscription State Lifecycle (Pre-Paid/Manual Renewal)
We model term-based subscription lifecycles where users pay upfront for a set period (30 days for monthly, 365 days for yearly):
*   **Billing Expiry (`validUntil`)**: The timestamp is computed as `Date.now() + billingDuration`.
*   **Grace Period**: If the cycle expires, users get a 3-day grace window during which billing status is `past_due`. Features remain active, but an in-app banner prompts them to renew.
*   **Expiry**: If no payment occurs after the grace period, status updates to `expired` and features lock.

### C. Legal & Tax Audit Compliance (Invoices Ledger)
Every successful subscription or top-up triggers the generation of an immutable Invoice record inside the default database user subcollection (`users/{userId}/Invoices/{invoiceId}`):
*   **Sequential Numbering**: Generates region-specific invoice indexes (e.g. `INV-IN-2026-0034`).
*   **Localized Taxes**:
    *   **India (IN)**: Computes and displays GST (18% CGST/SGST/IGST breakdown).
    *   **Europe (EU)**: Handles VAT calculations based on region.
    *   **USA / Rest of World**: Standard pricing structure.

---

## 4. UI/UX Design Specifications (Highly Professional)

The user interface will be built to mimic the visual premium of Stripe and linear.app:

1.  **Obsidian & Glassmorphism Aesthetics**:
    *   Dark Obsidian background (`#0d0e12`) with vibrant Electric Indigo (`#6366f1`) and Celestial Blue (`#73b9f5`) linear highlights.
    *   Pricing comparison cards built with semi-transparent frosted panels (`backdrop-blur-md bg-white/5 border border-white/10`).
2.  **Toggle Switch Animation**:
    *   A micro-animated sliding toggle selector for `Monthly` and `Yearly` billing, triggering a smooth counter-slide numbers fade-in.
3.  **Detailed Plan Feature Grid**:
    *   An interactive comparative breakdown showing ticks `Check` and locks `Lock` icons for every granular platform functionality.
4.  **Print-Ready HTML Invoice Previewer**:
    *   A clean modal slide-out receipt containing vendor tax records (GSTIN, Corporate Office Address), client details, transactional hashes, line item breakdown, and a prominent print/save action.

---

## 5. Dynamic Configuration Database Schema

### Example JSON Document: `Pricing_Configs/IN`
```json
{
  "regionCode": "IN",
  "regionName": "India",
  "currency": "INR",
  "currencySymbol": "₹",
  "plans": {
    "starter": {
      "planName": "Starter",
      "costMonth": 0,
      "costYear": 0,
      "quotas": {
        "cardScansLimit": 5,
        "maxCardsStored": 20,
        "reportsLimit": 0,
        "aiSearchLimit": 0
      }
    },
    "growth": {
      "planName": "Growth (Silver)",
      "costMonth": 59,
      "costYear": 639,
      "quotas": {
        "cardScansLimit": 30,
        "maxCardsStored": 250,
        "reportsLimit": 1,
        "aiSearchLimit": 0
      }
    },
    "professional": {
      "planName": "Professional (Gold)",
      "costMonth": 108,
      "costYear": 1296,
      "quotas": {
        "cardScansLimit": 59,
        "maxCardsStored": 600,
        "reportsLimit": -1,
        "aiSearchLimit": 1
      }
    },
    "enterprise": {
      "planName": "Enterprise (Platinum)",
      "costMonth": 369,
      "costYear": 3501,
      "quotas": {
        "cardScansLimit": -1,
        "maxCardsStored": 5000,
        "reportsLimit": -1,
        "aiSearchLimit": 100
      }
    }
  },
  "topups": {
    "aiSearch": {
      "quantity": 99,
      "cost": 49
    }
  },
  "commissionSlabs": [
    { "limit": 5000, "rate": 0.10 },
    { "limit": 15999, "rate": 0.20 },
    { "limit": 99999999, "rate": 0.25 }
  ]
}
```

---

## 6. Managing Admin Claims & Access Control

To restrict access to the Admin Pricing panel `/admin/pricing` and secure the configuration writes in Firestore, we use a hybrid approach combining **Firestore Flags** and **Firebase Auth Custom Claims**.

### 1. Database Document Flag (Source of Truth)
We add an `isAdmin` boolean flag on the user document in the default database:
```typescript
// users/{userId}
{
  uid: string;
  email: string;
  role: "sp" | "obo" | "tpsp";
  isAdmin?: boolean;
}
```

### 2. Firebase Auth Custom Claims (Cryptographic Verification)
We use Firebase Admin SDK to attach a custom cryptographic claim `{ admin: true }` to the user's ID token.

---

## 7. Implementation Plan Checklist & TODOs

We will maintain progress in `task.md` tracking the implementation of the following files:

*   **[NEW]** `src/lib/services/billing.ts` (Dynamic calculation & quota middleware wrapper logic)
*   **[NEW]** `scripts/set-admin.ts` (Cli promotes helper utility script)
*   **[NEW]** `src/app/api/plans/checkout/route.ts` (Razorpay payment session endpoints)
*   **[NEW]** `src/app/api/plans/verify-payment/route.ts` (Verification endpoints & updates & invoicing)
*   **[NEW]** `src/app/pricing/page.tsx` (Glassmorphic plan presenters & invoice logs viewer)
*   **[NEW]** `src/app/admin/pricing/page.tsx` (Admin panel console settings)
*   **[MODIFY]** `src/app/api/leads/process/route.ts` (Integrating scan check pre-flight blocks)
*   **[MODIFY]** `src/app/api/leads/query/route.ts` (Integrating semantic search check pre-flight blocks)
*   **[MODIFY]** `src/app/api/reports/generate/route.ts` (Integrating report limit checking blocks)

---

## 8. Verification Plan

### Automated Checks
- Run `npm run typecheck` to ensure build compliance.

### Manual Verification
- Execute `scripts/set-admin.ts` to grant admin rights to a test account.
- Complete a mock Razorpay checkout flow using UPI credentials, verifying:
  - User quotas update instantly.
  - An invoice document is added to database.
  - The invoice appears in the billing history log and can be opened in the print overlay.
- Try accessing `/admin/pricing` on a normal user vs. an admin user to ensure strict block.
- Verify security rules correctly prevent standard accounts from modifying `Pricing_Configs`.
