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

# Cloudflare Zero-Cost Security Shield Architecture

**Document Version:** 1.0.0  
**Date Created:** 2 August 2026  
**Primary Objective:** Provide a detailed architectural blueprint for configuring Cloudflare’s enterprise-grade, zero-cost ($0) edge security capabilities to defend `fractionalsalespartner.com` against scrapers, DDoS attacks, API abuse, and email harvesting.

---

## 1. Executive Summary & Edge Defense Strategy

### 1.1 Why Edge-Level Security?
Processing threat mitigation at the application server layer (Next.js/Node.js) consumes memory, bandwidth, and database quota. By deploying **Cloudflare Edge Defense**, malicious traffic, scrapers, and botnets are identified and neutralized at Cloudflare’s global Anycast DNS network **before ever reaching our cloud infrastructure**.

### 1.2 Cost Efficiency Principle
All security capabilities detailed in this document are available on **Cloudflare's $0 Free Tier**, delivering maximum protection without incurring recurring software licensing costs.

---

## 2. The 6 Zero-Cost Cloudflare Security Modules

```
[ Incoming Web Traffic ]
          │
          ▼
┌───────────────────────────────────────────────────────────┐
│ CLOUDFLARE ANYCAST EDGE SHIELD ($0 Free Tier)             │
│                                                           │
│  1. Bot Fight Mode         ➜ Blocks bad crawlers         │
│  2. Custom WAF Rules       ➜ Blocks datacenter botnets   │
│  3. Rate Limiting          ➜ Protects sensitive APIs     │
│  4. Email Obfuscation      ➜ Protects user contact info  │
│  5. Browser Integrity      ➜ Rejects malformed headers   │
│  6. Under Attack Mode      ➜ Emergency DDoS Mitigation   │
└─────────────────────────┬─────────────────────────────────┘
                          │ Clean Traffic Only
                          ▼
            [ Next.js Platform / Firestore ]
```

### 2.1 Module 1: Cloudflare Bot Fight Mode
* **Function:** Automatically identifies and blocks automated scrapers, headless browsers, and malicious web crawlers using Cloudflare’s global threat intelligence dataset.
* **Target Threat:** Competitors or bots scraping proprietary Sales Partner profiles and Business Owner listings.
* **Execution:** DNS-level challenge or automatic block (`403 Forbidden`).
* **Configuration:** Dashboard ➔ Security ➔ Bots ➔ Enable **Bot Fight Mode**.

### 2.2 Module 2: Custom Firewall (WAF) Rules (5 Free Custom Rules)
* **Function:** Custom filtering rules operating on request parameters (ASN, Country, Threat Score, Datacenter IP ranges).
* **Recommended Rules for Fractional Sales:**
  1. **Block Datacenter Traffic on Auth/Post Endpoints:** If incoming request is from a commercial hosting provider (e.g. AWS, DigitalOcean, Hetzner, Linode) AND targets `/api/auth/*` or `/api/posts/*`, challenge with Turnstile.
  2. **High Threat Score Challenge:** If `cf.threat_score > 10`, issue Managed Challenge.
* **Configuration:** Dashboard ➔ Security ➔ WAF ➔ Custom Rules.

### 2.3 Module 3: Edge-Level Rate Limiting
* **Function:** Tracks request counts per client IP over short time windows to prevent brute-force attacks and resource exhaustion.
* **Target Endpoints:**
  * Login/Register: Max 10 requests / minute per IP.
  * Checkout/Payment: Max 5 requests / minute per IP.
  * Post Creation: Max 10 requests / minute per IP.
* **Action:** Issue `429 Too Many Requests` or Turnstile challenge when limit is breached.

### 2.4 Module 4: Email Address Obfuscation
* **Function:** Automatically scrambles raw email addresses published in posts, bios, or comments on the rendered HTML page.
* **Mechanism:** Converts plain text email strings (e.g., `user@domain.com`) into encrypted client-side JS strings decoded only when a real human browser loads the page.
* **Target Threat:** Automated spammers harvesting Sales Partner / Business Owner emails to send unsolicited marketing or phishing scams.
* **Configuration:** Dashboard ➔ Scrape Shield ➔ Enable **Email Address Obfuscation**.

### 2.5 Module 5: Browser Integrity Check (BIC) & HSTS Enforcement
* **Function:** Evaluates incoming HTTP request headers for signatures commonly associated with low-tier spam scripts, curl abuse, or malformed tools.
* **HSTS (HTTP Strict Transport Security):** Forces browsers to load the site strictly over encrypted `HTTPS`, preventing SSL stripping attacks.
* **Configuration:** Dashboard ➔ Security ➔ Settings ➔ Enable **Browser Integrity Check**.

### 2.6 Module 6: "Under Attack Mode" (Emergency DDoS Mitigation)
* **Function:** An emergency operational mode toggled during active Distributed Denial of Service (DDoS) attacks.
* **Behavior:** Forces a 5-second invisible JavaScript challenge screen to all incoming connections before granting access.
* **Target Threat:** Sudden volumetric traffic flooding designed to crash the platform.
* **Configuration:** Dashboard ➔ Overview ➔ Quick Actions ➔ Toggle **Under Attack Mode** (Off by default, enabled only during active incidents).

---

## 3. Recommended Cloudflare Security Configuration Checklist

| Security Setting | Recommended State | Location in Cloudflare Dashboard | Purpose |
| :--- | :--- | :--- | :--- |
| **SSL/TLS Encryption** | `Full (Strict)` | SSL/TLS ➔ Overview | Encrypts end-to-end between user, Cloudflare, and server |
| **Always Use HTTPS** | `On` | SSL/TLS ➔ Edge Certificates | Redirects all HTTP requests to HTTPS |
| **Automatic HTTPS Rewrites** | `On` | SSL/TLS ➔ Edge Certificates | Fixes mixed-content security warnings |
| **Bot Fight Mode** | `On` | Security ➔ Bots | Blocks automated threat crawlers |
| **Email Obfuscation** | `On` | Scrape Shield | Stops email harvesting |
| **Browser Integrity Check** | `On` | Security ➔ Settings | Filters malformed headers |
| **Security Level** | `Medium` (Standard) | Security ➔ Settings | Baseline threat challenge threshold |

---

## 4. Maintenance, Operational Guidelines & Audit Log

### 4.1 False Positive Monitoring
* Periodically check the **Cloudflare Security Events Log** (Security ➔ Events) to ensure legitimate Sales Partners or Business Owners are not accidentally challenged or blocked.

### 4.2 Audit Log

| Date | Version | Description of Changes | Author |
| :--- | :--- | :--- | :--- |
| **02-Aug-2026** | 1.0.0 | Initial release of Cloudflare Zero-Cost Security Shield Architecture | Engineering Team |
