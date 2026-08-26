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

# Modular Strategy 003: Strategic Pillars, Roadmap & Execution Framework

**Document Owner:** Biztribe Product & Engineering  
**Project Code:** Fractional Sales Partner (`ScaleFraction`)  
**Active Environment Backends:** Dev: `fractionalsalesdev` | Prod: `prod`  

---

## 1. Strategic Pillars

ScaleFraction centers product innovation around four core strategic pillars:

```
+-----------------------------------------------------------------------------------+
|                            STRATEGIC PILLARS                                      |
+-------------------+-------------------+-------------------+-----------------------+
| PILLAR 1          | PILLAR 2          | PILLAR 3          | PILLAR 4              |
| ScaleMatch        | ScaleExecution    | ScaleTrust        | ScaleEnterprise       |
| (AI Matchmaking)  | (Telemetry & AI)  | (Ledger & Legal)  | (Multi-Tenant Hub)    |
+-------------------+-------------------+-------------------+-----------------------+
| Deep vector search| GPS attendance,   | Clickwrap contracts| Enterprise RBAC,     |
| matching SP skills| voice lead ingest | automated escrow, | custom CRM sync,      |
| to OBO ICPs.      | & CRM automation. | commission tracking.| sub-account teams.  |
+-------------------+-------------------+-------------------+-----------------------+
```

1. **ScaleMatch (AI-Powered Talent Matching):** Leveraging Genkit AI embeddings and candidate historical close rate vectors to match OBO job postings with top 5% Sales Partners in < 48 hours.
2. **ScaleExecution (Verifiable Field Intelligence):** Integrated GPS location tracking (`AttendanceDrawer`), voice lead ingestion (`LeadCaptureInterface`), and real-time CRM updates to remove field operational ambiguity.
3. **ScaleTrust (Institutional Legal & Financial Infrastructure):** Clickwrap Service Agreements compliant with Indian Contract Act 1957 & IT Act 2000 (`ServiceAgreementModal`), milestone escrow, and automated deal ledgering.
4. **ScaleEnterprise (Scale & Multi-Tenancy):** Supporting enterprise sub-accounts, team hierarchy commission splits, and institutional audit trails across `fractionalsalesdev` and `prod`.

---

## 2. Product Execution Roadmap (Now / Next / Later)

```
+-----------------------------------------------------------------------------------+
| NOW (Q3 2026)             | NEXT (Q4 2026 - Q1 2027)  | LATER (H2 2027+)          |
+---------------------------+---------------------------+---------------------------+
| [x] Clickwrap Legal Engine| [ ] Escrow Payout Gateway | [ ] Enterprise CRM Sync   |
| [x] AI Lead Capture CRM   | [ ] Genkit AI Voice Copilot|   (Salesforce / HubSpot)  |
| [x] GPS Field Telemetry   | [ ] SP Reputation Scoring | [ ] Cross-Border Escrow   |
| [x] Offer & Deal Drawers  | [ ] Tiered Billing Engine | [ ] Predictive AI Closing |
+-----------------------------------------------------------------------------------+
```

### Detailed Release Breakdown
- **NOW (Completed / Active in Q3 2026):**
  - Clickwrap Service Agreement flow & template generator (`src/lib/service-agreement-template.ts`).
  - AI Lead Capture CRM and processing widget (`src/components/LeadCaptureInterface.tsx`).
  - GPS Field Attendance & location verification drawer (`src/components/AttendanceDrawer.tsx`).
  - SP & OBO Post Creation Drawers (`SPCreatePostDrawer`, `OBOCreatePostDrawer`).
- **NEXT (Targeted Q4 2026 – Q1 2027):**
  - Automated Escrow & Milestone Payout Gateway (Razorpay/Stripe integration).
  - Genkit AI Voice Lead Summarizer & Sales Copilot live assistant.
  - Multi-tier Subscription Billing Engine for enterprise OBO clients.
  - Transparent SP Rating & Verified Deal Reputation Score.
- **LATER (Targeted H2 2027+):**
  - Bi-directional enterprise CRM connectors (Salesforce, HubSpot, Zoho).
  - Multi-currency cross-border commission escrow (USD, SGD, INR).
  - Predictive AI sales forecasting & deal closure probability engine.

---

## 3. Risk Matrix & Mitigation Strategy

| Risk Domain | Risk Event | Severity | Likelihood | Mitigation Action Plan |
| :--- | :--- | :--- | :--- | :--- |
| **Platform Leakage** | SP and OBO take transactions off-platform | High | Medium | Require platform escrow for legal dispute coverage; offer free AI sales copilot tools exclusively for active platform deals. |
| **Legal Classification** | Misclassification of SPs as employees | High | Low | Enforce mandatory Clickwrap Service Agreements explicitly defining independent contractor consultancy under Indian Law. |
| **Field Data Verification** | Fraudulent GPS location spoofing | Medium | Low | Multi-factor location checks (Cell Tower + Wi-Fi BSSID + Device Sensor telemetry) in `AttendanceDrawer`. |
| **Marketplace Cold-Start** | Imbalance between SP talent supply and OBO deal demand | High | Medium | Deploy targeted account-based onboarding cohorts matching SP talent directly with pre-committed enterprise OBO demand. |

---

## 4. Stakeholder Governance & Alignment (RACI Matrix)

| Stakeholder Role | Primary Responsibilities | Strategy Review Cadence |
| :--- | :--- | :--- |
| **Product Lead** | Core roadmap definition, UX quality, user feedback loops | Weekly Sprint Review |
| **Engineering Lead / Architect** | Platform scalability, Genkit AI integration, Cloud Firestore schemas | Bi-Weekly Architecture Audit |
| **Legal & Compliance Counsel** | Service agreement templates, regulatory compliance (IT Act / DPDP) | Monthly Legal Audit |
| **Growth & Commercial Lead** | OBO client acquisition, SP talent community growth, monetization | Weekly Growth Sync |

---
*Biztribe Trading & Consultancy India Private Limited — Confidential & Proprietary*
