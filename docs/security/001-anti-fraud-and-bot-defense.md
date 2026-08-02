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

# Platform Security Blueprint: Anti-Fraud, Bot Defense & Identity Protection Architecture

**Document Version:** 1.0.0  
**Date Created:** 2 August 2026  
**Primary Objective:** Provide a permanent, architectural reference documenting the platform's multi-layered defense strategy against fake identities, bad actors, automated bots, and multi-account abuse.

---

## 1. Executive Summary & Strategic Rationale

### 1.1 The Threat Landscape
As a business-to-business (B2B) marketplace connecting **Business Owners (OBOs)** and **Sales Partners (SPs)**, trust and authenticity are the core foundation of Fractional Sales. The platform faces two major threats from bad actors:
1. **Automated Bots & Scraping Scripts:** Mass creation of spam posts, credential stuffing, and scraping proprietary business listings.
2. **Human Impersonation & Multi-Account Fraud:** A single malicious human creating multiple fake Sales Partner or Business Owner identities to manipulate pitches, bypass restrictions, or scam counterparties.

### 1.2 The Core Philosophy
To protect legitimate users without ruining their onboarding experience, our security architecture adheres to **Three Golden Principles**:
* **Zero Friction for Genuine Users:** No annoying image puzzles (traditional CAPTCHAs) or unnecessary browser permission popups.
* **Invisible Defense:** Telemetry and risk scoring happen silently in the background on the server and edge layers.
* **Privacy by Design:** Full compliance with the **Digital Personal Data Protection Act, 2023 (DPDPA 2023)** and international standards.

---

## 2. Architectural Decisions & Technology Selection Rationale

Three years down the line, when reviewing why specific technologies were selected, the rationale is documented below:

| Security Requirement | Selected Solution | Why Selected over Alternatives | Cost Impact |
| :--- | :--- | :--- | :--- |
| **Bot & Script Defense** | **Cloudflare Turnstile** | Replaces legacy Google reCAPTCHA. Runs invisibly in <1 sec. Eliminates puzzle friction while stopping 99.9% of automated scripts. | **$0** (Free unlimited on Cloudflare) |
| **Multi-Account / Device Tracking** | **FingerprintJS** | Generates a persistent browser/hardware `visitorId`. If a fraudster opens 10 Incognito windows to create 10 fake profiles, FingerprintJS catches them because their device fingerprint remains identical. | **$0** (Open Source NPM tier) |
| **Network & Location Verification** | **Server-Side IP & Geolocation Telemetry** | Leverages standard HTTP headers (`x-forwarded-for`). Requires zero user permission prompts. Detects datacenter IPs, TOR nodes, and geographic anomalies. | Included in infrastructure |
| **Privacy & Legal Alignment** | **DPDPA 2023 & SPDI Rules Consent** | Integrated directly into Section 3E & 4 of the Platform Privacy Policy as legitimate interest for security and fraud prevention. | N/A |

---

## 3. The 3-Tier Security Defense Architecture

```
[ Incoming Request from User Browser ]
                 │
                 ▼
 ┌────────────────────────────────────────────────────────┐
 │ TIER 1: Edge & Network Defense (Cloudflare Turnstile)  │
 │ • Filters automated scripts, DDoS, and spam bots       │
 └─────────────────────────┬──────────────────────────────┘
                           │ Passed Human Verification
                           ▼
 ┌────────────────────────────────────────────────────────┐
 │ TIER 2: Client Telemetry (FingerprintJS Hardware ID)   │
 │ • Hashes browser/hardware capabilities into visitorId   │
 │ • Detects multi-account creation on the same laptop    │
 └─────────────────────────┬──────────────────────────────┘
                           │ Validated Token
                           ▼
 ┌────────────────────────────────────────────────────────┐
 │ TIER 3: Backend Verification & Risk Engine (Next.js)   │
 │ • Extracts IP address & performs Geo-IP lookup         │
 │ • Checks for VPN / Proxy / TOR datacenter IPs          │
 │ • Compares IP location vs declared Profile location    │
 └─────────────────────────┬──────────────────────────────┘
                           │ Risk Score OK
                           ▼
              [ Database / Action Allowed ]
```

### 3.1 Tier 1: Edge & Bot Defense (Cloudflare Turnstile)
* **How it operates:** Embedded on critical forms (Sign up, Login, Post Creation, Deal Acceptance).
* **Behavior:** Checks browser APIs, JS environment, and non-sensitive signals invisibly.
* **Outcome:** Issuance of a short-lived cryptographic token validated on the Next.js backend API before writing to Cloud Firestore.

### 3.2 Tier 2: Device Fingerprinting (FingerprintJS)
* **How it operates:** Executes client-side asynchronously without blocking rendering (~15ms execution time).
* **Signals Collected:** WebGL renderer, canvas hash, screen resolution, system fonts, timezone offset, CPU hardware concurrency.
* **Outcome:** Generates a deterministic 32-character `visitorId`.
* **Enforcement Rule:** Strict cap of **maximum 3 accounts per physical device fingerprint (`visitorId`)**. A legitimate user might reasonably have 1 Business Owner profile and 1 Sales Partner profile (or share a device with 1 colleague), but any attempt to register a 4th account from the same device triggers an automatic block and flags all linked accounts for manual fraud review.

### 3.3 Tier 3: Server-Side IP & Telemetry Engine
* **How it operates:** Next.js API middleware intercepts `x-forwarded-for` and `x-real-ip` headers.
* **Risk Scoring Signals:**
  1. **VPN / Proxy / TOR Detection:** Flag IPs originating from known commercial hosting datacenters.
  2. **Location Mismatch:** Compare the IP country (e.g., Germany) with the user's declared profile country (e.g., India).
  3. **Velocity Checks:** Track request frequency from single IP ranges to stop brute-force attacks.

---

## 4. Privacy & Compliance Framework

### 4.1 Legal Alignment under Indian Law (DPDPA 2023)
* **Lawful Basis:** Processing is grounded in **Legitimate Interest** for security, fraud mitigation, and protection of platform integrity under Section 4 of the DPDPA 2023.
* **Privacy Policy Notice:** Covered under **Section 3.E (Technical and Usage Data)** and **Section 5 (Purpose of Processing: Fraud Prevention)** of the Platform Privacy Policy located at `fractionalsales.com/legal/privacy`.
* **Zero Intrusiveness:** No intrusive permissions (such as microphone, camera, or precise GPS location) are requested for baseline telemetry.

---

## 5. Implementation & Execution Strategy

### Phase 1: Passive Server Telemetry (Next.js Middleware)
* Log client IP, user-agent, and request timestamp on all API authentication and post creation routes.
* Store telemetry in audit collections to establish baseline normal behavior.

### Phase 2: Client Fingerprinting Integration
* Install `@fingerprintjs/fingerprintjs` package.
* Capture `visitorId` during user registration (`/api/auth/register`) and save in user metadata document.

### Phase 3: Cloudflare Edge Routing & Turnstile
* Route DNS through Cloudflare proxy.
* Enable Cloudflare Turnstile on sign-up, deal submission, and payment forms.

---

## 6. Document Revision & Audit Log

| Date | Version | Description of Changes | Author |
| :--- | :--- | :--- | :--- |
| **02-Aug-2026** | 1.0.0 | Initial release of Anti-Fraud & Bot Defense Security Architecture | Engineering Team |
