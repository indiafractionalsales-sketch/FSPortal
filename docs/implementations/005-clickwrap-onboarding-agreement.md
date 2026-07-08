# Implementation Plan: Click-Wrap Onboarding Agreement

This document details the architectural design, legal context, and technical implementation plan to integrate a **Click-Wrap Onboarding Agreement** into the **Fractional Sales Partner** platform onboarding wizard.

---

## 1. Executive Summary & Rationale

During onboarding, Fractional Sales Partner requires users to agree to a standard **Platform User Agreement** (Terms of Service and Privacy Policy). Initially, an integration with Zoho Sign was proposed. However, because a Platform User Agreement applies to all users uniformly and does not involve customized negotiations, we have opted for a **Click-Wrap Agreement** architecture.

### Why Click-Wrap over Zoho Sign?
*   **Frictionless UX:** Users review and accept the agreement inline. There are no external redirects, drawing/typing signatures, or email confirmation loops.
*   **Zero Marginal Cost:** Third-party e-signature APIs charge per document sent/signed. Click-wrap is entirely self-hosted and free.
*   **Database Performance:** Instead of generating and storing millions of duplicate PDF/doc agreement copies, we store a single static version of the terms and reference it with lightweight metadata records on each user's profile.

---

## 2. Legal Validity & Industry Standards

Click-wrap agreements are the global industry standard for electronic consumer and platform agreements. They possess the same legal enforceability as paper contracts under major electronic signature legislations:

*   **United States:** The *Electronic Signatures in Global and National Commerce Act (ESIGN)* and the *Uniform Electronic Transactions Act (UETA)*.
*   **India:** The *Information Technology Act, 2000* (Section 10A explicitly recognizes and validates contracts formed through electronic means).
*   **European Union & UK:** *eIDAS Regulations* and the *Electronic Communications Act 2000*.

### Legal Enforceability Framework
To survive legal scrutiny, the click-wrap implementation enforces the following four pillars:

1.  **Conspicuous Notice:** The user is clearly notified that clicking the completion button binds them to the agreement.
2.  **Opportunity to Review:** The user is provided with a scrollable pane of the terms, or high-visibility links, to read the contract before signing.
3.  **Affirmative Assent:** Consent is obtained through an active, conscious action (ticking an unchecked box).
4.  **Verifiable Audit Trail:** The system records the precise transaction metadata at the moment of consent.

---

## 3. Architecture & Audit Trail Design

To maintain maximum efficiency, we separate **what** was agreed to from **who** agreed to it and **when**.

```
                   +--------------------------------------------------+
                   |                 TERMS VERSION                    |
                   |  (Immutable text stored in code or single doc)   |
                   |  e.g., Version: "v2.0"                           |
                   +-----------------------+--------------------------+
                                           |
                                           | referenced by
                                           v
+------------------------------------------+--------------------------+
|                        USER AUDIT PROFILE                           |
|  - uid: "user_123"                                                  |
|  - termsAccepted: true                                              |
|  - termsVersion: "v2.0"                                             |
|  - termsAcceptedDate: "2026-07-08T05:22:15Z"                        |
|  - termsIpAddress: "203.0.113.195"                                  |
|  - termsUserAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."    |
+---------------------------------------------------------------------+
```

### Data Schema
We will add the following fields to the Firestore user profile documents (`OBO_Profile`, `SP_Profile`, and `TPSP_Profile`):

*   `termsAccepted`: `boolean` (Set to `true`)
*   `termsVersion`: `string` (Current terms version, e.g., `"v2.0"`)
*   `termsAcceptedDate`: `string` (ISO 8601 UTC timestamp)
*   `termsIpAddress`: `string` (The user's public IP address at the time of signing)
*   `termsUserAgent`: `string` (User agent string specifying browser and operating system)

---

## 4. Updated Terms & Conditions (Version 2.0)

The existing Terms & Conditions (v1.0, 18 sections) published at [fractionalsalespartner.com/legal/terms](https://fractionalsalespartner.com/legal/terms) will be updated with the following **new and amended sections**. All existing sections (1–18) remain intact. The new sections are inserted as follows:

> **Numbering Note:** The existing sections 1–7 remain unchanged. Section 8 (Payments and Platform Fees) is substantially rewritten. Sections 9–18 are renumbered to 12–21. Five new sections (8A, 8B, 8C, 9, 10, 11) are inserted.

---

### SECTION 8 — PAYMENTS, PLATFORM FEES, AND PAID FEATURES (Replaces existing Section 8)

**8.1 Paid Features and Variable Pricing.**
The Platform offers certain features, tools, and services on a paid basis, including but not limited to: (a) payment processing and commission settlement services for Business Owners engaging Sales Partners; (b) AI-powered Smart Networking functionality, which provides Users with an intelligent conversational interface to query and analyse their lead database; (c) AI-powered business card and contact scanning services; and (d) any other features designated as paid features by the Company from time to time (collectively, "Paid Features"). The User acknowledges and agrees that the pricing, fee structures, and charges applicable to Paid Features are determined solely by the Company and are subject to change at any time, at the Company's absolute discretion, without prior notice. The applicable charges shall be those displayed on the Platform at the time the User accesses or utilises the relevant Paid Feature. By utilising any Paid Feature, the User irrevocably agrees to pay the charges as displayed at the time of use. It is the User's sole responsibility to review the applicable charges before initiating use of any Paid Feature.

**8.2 Non-Payment and Access Restriction.**
In the event that a User fails to make any payment due to the Company in respect of Paid Features, subscription fees, or any other charges, the Company reserves the absolute and unconditional right to: (a) immediately suspend, restrict, or permanently terminate the User's access to the Platform and all Services, without prior notice; (b) withhold, forfeit, or set off any pending settlements, commissions, or credits due to the User; and (c) pursue recovery of the outstanding amounts through all available legal remedies, including but not limited to filing a civil suit for recovery of money, initiating arbitration proceedings, and/or referring the matter to a debt recovery agency. The User shall additionally be liable for all costs of collection, including reasonable legal fees and expenses.

**8.3 Platform Fees and Commission Deductions.**
Where the Company facilitates payment processing between a Business Owner and a Sales Partner, the Company shall deduct a Platform Commission from each transaction at the rate specified on the Platform at the time of the transaction (which may include, but is not limited to, a percentage-based platform service fee). The remaining balance, after deduction of the Platform Commission and any applicable taxes, shall constitute the Sales Partner's Net Payout. The Sales Partner acknowledges and agrees that the Net Payout amount as determined by the Company shall be final and binding. The Sales Partner's sole remedy, in the event of disagreement with the Net Payout, is to decline the task or engagement prior to acceptance. Once a task or engagement is accepted by the Sales Partner, the Sales Partner shall be deemed to have irrevocably accepted the Platform Commission structure and the resulting Net Payout.

**8.4 Payment Processing Timeline.**
Payments to Sales Partners shall be processed within seven (7) business days from the date the corresponding Business Owner's payment is successfully received and cleared by the Company. In the event of any delay in payment processing, the Sales Partner may contact the Company at sales@fractionalsalespartner.com for resolution. The Company shall use commercially reasonable efforts to resolve payment delays within a further period of ten (10) business days from the date of receipt of the complaint. The Company shall not be liable for delays caused by banking systems, payment gateways, regulatory holds, or force majeure events.

**8.5 GST and Tax Compliance.**
All fees, charges, and commissions quoted on the Platform are exclusive of applicable Goods and Services Tax (GST) and any other taxes or duties levied under Indian or international tax law, unless expressly stated otherwise. All applicable taxes shall be borne by the User and shall be charged in addition to the stated fees at the prevailing statutory rate.

**8.6 Payment Gateway.**
All payments are collected through PCI-DSS compliant payment gateways. The Company does not store raw payment card numbers, UPI PINs, or net banking credentials. The Company shall not be liable for any payment failures, declines, or errors caused by third-party payment processors.

---

### SECTION 9 — DATA OWNERSHIP AND PLATFORM RIGHTS (New Section)

**9.1 Platform Data Ownership.**
All data generated, uploaded, submitted, or otherwise provided by Users on or through the Platform — including but not limited to profile information, business listings, lead databases, transaction records, engagement histories, communications, analytics, and any derivative data generated by the Platform's algorithms or AI features — shall be owned exclusively by Biztribe Trading & Consultancy India Private Limited. The User hereby irrevocably assigns, transfers, and conveys to the Company all right, title, and interest (including all intellectual property rights) in and to all such data, to the maximum extent permitted by applicable law. Where assignment is not permitted by law, the User grants the Company an irrevocable, perpetual, worldwide, royalty-free, fully sub-licensable licence to use, reproduce, modify, distribute, display, and create derivative works from such data for any purpose.

**9.2 Right to Represent, Display, and Share User Information.**
The User grants the Company an unrestricted, irrevocable, worldwide, royalty-free right and licence to: (a) represent the User and their business on the Platform and in the Company's marketing, promotional, and business development materials across all media; (b) publicly display the User's Personally Identifiable Information ("PII"), including but not limited to name, photograph, company name, logo, designation, contact details, professional experience, and any other information submitted by the User during registration or profile creation; and (c) share the User's PII with relevant Users, prospective business partners, Sales Partners, Business Owners, Third Party Service Providers, and any other parties as the Company deems necessary for the fulfilment of the Platform's commercial objectives. The User acknowledges that the foregoing rights are essential to the operation of the Platform and waives any claim for compensation, damages, or injunctive relief arising from the Company's exercise of these rights.

**9.3 Unrestricted Licence for Uploaded Brand Assets.**
By uploading, submitting, or otherwise providing any company logo, brand name, trademark, trade name, service mark, brand insignia, brand imagery, or any other brand-identifying asset (collectively, "Brand Assets") to the Platform — whether during the registration process, profile creation, listing publication, or at any other time — the User hereby grants the Company an irrevocable, perpetual, worldwide, royalty-free, fully sub-licensable, and unrestricted licence to use, reproduce, display, publish, distribute, modify, adapt, resize, reformat, and create derivative works from such Brand Assets, in any manner, in any medium, and in any context, without limitation as to placement, positioning, page, section, feature, or area of the Platform. Without limiting the generality of the foregoing, the Company may display, feature, or incorporate such Brand Assets on: (a) the User's own profile page; (b) search results, discovery feeds, recommendation engines, and partner-matching interfaces; (c) the Platform's homepage, landing pages, marketing pages, and promotional banners; (d) email communications, newsletters, and push notifications sent by the Platform; (e) social media accounts, advertisements, and external marketing campaigns operated by or on behalf of the Company; (f) investor presentations, pitch decks, business proposals, and corporate communications; and (g) any other page, interface, material, or medium as the Company deems fit in its sole discretion. The User represents and warrants that it has full authority and all necessary rights to grant the foregoing licence with respect to all Brand Assets uploaded to the Platform, and agrees to indemnify and hold harmless the Company from any claim arising from a breach of this warranty.

---

### SECTION 10 — DATA STORAGE, PROCESSING, AND CROSS-BORDER TRANSFERS (New Section)

**10.1 Server Locations and Cross-Border Processing.**
The User acknowledges and expressly consents to the storage, processing, and transmission of their personal data — including PII, financial data, and behavioural data — on servers and computing infrastructure located in multiple jurisdictions worldwide, including but not limited to: the Republic of India, the Kingdom of the Netherlands, member states of the European Union, the United States of America, and such other jurisdictions as the Company may utilise from time to time for the purpose of providing the Services.

**10.2 Applicable Data Protection Frameworks.**
The Company shall process personal data in accordance with the applicable data protection laws of the jurisdiction in which the data is processed, which may include the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023 (India), the General Data Protection Regulation (EU) 2016/679 (GDPR), the UK Data Protection Act 2018, and such other laws as may be applicable.

**10.3 User Consent to Transfers.**
By registering on the Platform and accepting these Terms, the User provides explicit, informed, and unambiguous consent to the cross-border transfer and processing of their personal data as described herein. The User acknowledges that data protection standards may vary across jurisdictions and agrees that the Company shall not be liable for any data protection standards applicable in the User's country of residence that differ from those in the jurisdiction where the data is processed.

**10.4 Disclaimer of Liability for Data Loss.**
To the maximum extent permitted by applicable law, neither Biztribe Trading & Consultancy India Private Limited, nor the brand "Fractional Sales Partner", nor any director, officer, employee, agent, contractor, consultant, or representative of the Company (collectively, "Company Parties") shall be responsible, liable, or accountable for any loss, corruption, destruction, unavailability, or unauthorised access to any data — including but not limited to User data, profile information, lead databases, transaction records, uploaded content, communications, or any other information stored on or processed through the Platform — howsoever caused, whether arising from: (a) hardware or software failures, server outages, or infrastructure malfunctions; (b) cyberattacks, hacking, ransomware, data breaches, or other security incidents; (c) acts or omissions of third-party hosting providers, cloud infrastructure providers, or payment gateway operators; (d) natural disasters, force majeure events, or governmental actions; (e) scheduled or unscheduled maintenance, system upgrades, or data migration activities; or (f) any other cause beyond the reasonable control of the Company. The User acknowledges that it is the User's sole responsibility to maintain independent backups of all critical data and that the Company provides no guarantee of data availability, persistence, recoverability, or integrity. The User expressly waives any and all claims against the Company Parties for damages, losses, or expenses arising from data loss or data unavailability.

---

### SECTION 11 — USER-GENERATED CONTENT AND COPYRIGHT LIABILITY (New Section)

**11.1 User Responsibility for Uploaded Content.**
The User represents, warrants, and undertakes that all content uploaded, published, submitted, or otherwise made available by the User on or through the Platform — including but not limited to images, photographs, audio recordings, video recordings, voice recordings, documents, text, logos, trademarks, creative works, and any other artefacts or materials (collectively, "User Content") — is either: (a) original work created by the User; or (b) used with the express, documented authorisation, licence, or consent of the rightful copyright holder, trademark owner, or other intellectual property rights holder.

**11.2 Indemnification for Copyright Infringement.**
In the event that any User Content uploaded by the User infringes upon, misappropriates, or otherwise violates the intellectual property rights, copyrights, trademarks, rights of publicity, right of privacy, moral rights, or any other proprietary rights of any third party, the User shall be solely and exclusively liable for all claims, demands, damages, losses, liabilities, penalties, costs, and expenses (including reasonable legal fees) arising therefrom. The Company expressly disclaims any and all liability, responsibility, and obligation in connection with such infringement. The User agrees to indemnify, defend, and hold harmless the Company and its directors, officers, employees, agents, and affiliates from any and all such claims.

**11.3 Platform Right to Remove Infringing Content.**
The Company reserves the right, but shall have no obligation, to review, monitor, or remove any User Content that the Company, in its sole discretion, believes to infringe upon the rights of any third party or to violate these Terms, without prior notice to the User and without liability.

---

### SECTION 12 — INTER-PARTY DISPUTES AND PLATFORM NON-LIABILITY (New Section — inserted before existing Confidentiality)

**12.1 No Platform Liability for Inter-Party Disputes.**
The User acknowledges and agrees that the Platform serves exclusively as a technology-driven marketplace and facilitator of introductions between Business Owners, Sales Partners, and Third Party Service Providers. The Company is not a party to, and shall bear no responsibility or liability whatsoever for, any commercial agreement, arrangement, understanding, commitment, representation, or promise — whether written, verbal, electronic, or implied — entered into between a Business Owner and a Sales Partner, between a Business Owner and a Third Party Service Provider, or between any Users of the Platform.

**12.2 Disclaimer of Liability for Commitments.**
Without limiting the generality of Clause 12.1, the Company shall not be responsible for: (a) any loss of payment, revenue, commission, or financial expectation arising from a dispute between parties to an Engagement; (b) any loss of reputation, goodwill, personal image, or professional standing suffered by a User as a result of the actions, omissions, or representations of another User; (c) any failure by either party to an Engagement to honour their written or verbal commitments, performance targets, delivery timelines, quality standards, or any other undertaking; or (d) any consequential, incidental, special, or punitive damages arising from the foregoing.

**12.3 Sales Partner Task Acceptance.**
Prior to accepting any task, engagement, or assignment offered through the Platform, a Sales Partner shall have the right to review the terms, compensation structure, and scope of the engagement. By accepting the task, the Sales Partner shall be deemed to have irrevocably agreed to the compensation amount and terms as finalised by the Platform or the Business Owner. The Sales Partner's sole remedy for dissatisfaction with the compensation terms is to reject the task prior to acceptance. No claim for additional compensation, adjustment, or renegotiation shall be entertained after acceptance.

---

### SECTION 13 — BRAND PROTECTION AND DEFAMATION (New Section)

**13.1 Prohibition of Defamatory Conduct.**
Any activity, conduct, statement, publication, or communication — whether online, offline, written, verbal, electronic, or through any medium — by a User or any person acting on behalf of a User, which directly or indirectly: (a) defames, disparages, maligns, tarnishes, or brings into disrepute the brand name "Fractional Sales Partner"; (b) defames, disparages, maligns, tarnishes, or brings into disrepute the corporate name, goodwill, or reputation of Biztribe Trading & Consultancy India Private Limited; or (c) defames, disparages, maligns, threatens, harasses, intimidates, or brings into disrepute any director, officer, employee, agent, contractor, or representative of either Fractional Sales Partner or Biztribe Trading & Consultancy India Private Limited, shall constitute a material breach of these Terms and shall be treated as a legal offence actionable under applicable civil and criminal law.

**13.2 Legal Consequences.**
In the event of any violation of Clause 13.1, the Company reserves the right to: (a) immediately and permanently terminate the offending User's account without notice or refund; (b) pursue civil remedies including but not limited to injunctive relief, damages (including exemplary and punitive damages), and recovery of legal costs, in the competent courts of the Republic of India (including but not limited to courts in Pune, Maharashtra), the United Kingdom, the United States of America, and/or any member state of the European Union, as deemed appropriate by the Company; and (c) initiate criminal proceedings under the applicable provisions of the Indian Penal Code, 1860 (including Sections 499 and 500 relating to defamation), the Information Technology Act, 2000 (including Section 66A and related provisions), and any other applicable law in any jurisdiction in which the defamatory conduct occurred or had its effect.

**13.3 Preservation of Evidence.**
The Company reserves the right to preserve, archive, and produce as evidence in legal proceedings any and all Platform data, communications, access logs, and transactional records related to the offending User's account and activities on the Platform.

---

### SECTION 14 — PROPRIETARY BUSINESS MODEL AND SOURCE CODE PROTECTION (New Section)

**14.1 Proprietary Nature of the Platform.**
The User acknowledges and agrees that the Platform — including but not limited to its entire source code, software architecture, system design, database schemas, application programming interfaces (APIs), algorithms, machine learning models, artificial intelligence systems, data processing pipelines, user interface designs, user experience workflows, business logic, business processes, operational methodologies, commercial strategies, revenue models, commission structures, partner matching frameworks, and the overall business model of the fractional sales marketplace (collectively, "Proprietary Assets") — constitutes confidential, proprietary, and trade-secret information exclusively owned by Biztribe Trading & Consultancy India Private Limited, protected under the Copyright Act, 1957, the Trade Marks Act, 1999, the Information Technology Act, 2000, the Indian Contract Act, 1872, and all applicable Indian and international intellectual property and trade secret laws.

**14.2 Prohibition of Duplication, Copying, and Reverse Engineering.**
The User shall not, directly or indirectly, and shall not permit, authorise, assist, encourage, or facilitate any third party to: (a) copy, reproduce, duplicate, replicate, clone, or create derivative works of any Proprietary Asset, in whole or in part; (b) reverse engineer, decompile, disassemble, decode, decrypt, or otherwise attempt to derive or extract the source code, underlying algorithms, data structures, or business logic of the Platform or any component thereof; (c) develop, design, build, launch, operate, or participate in any competing platform, application, service, or business that substantially replicates, imitates, or is derived from the business model, feature set, operational methodology, or commercial strategy of the Platform; (d) use knowledge, insights, or information gained through the use of the Platform to create a substantially similar or competing product or service; or (e) engage in any other activity that infringes upon, misappropriates, or violates the Company's intellectual property rights, trade secrets, or proprietary interests.

**14.3 Legal Consequences of Infringement.**
Any violation of Clause 14.2 shall constitute a material breach of these Terms and shall be treated as a civil and criminal offence under applicable law. In the event of any such violation, the Company shall be entitled to: (a) seek immediate injunctive and restraining relief from any competent court of law to prevent further infringement; (b) pursue civil claims for damages, including actual damages, lost profits, exemplary damages, punitive damages, and statutory damages, as applicable under the Copyright Act, 1957, the Information Technology Act, 2000, and other applicable Indian and international intellectual property statutes; (c) initiate criminal prosecution under: (i) Sections 63, 63A, and 63B of the Copyright Act, 1957 (criminal penalties for copyright infringement); (ii) Sections 43 and 66 of the Information Technology Act, 2000 (penalties for unauthorised access and computer-related offences); (iii) Sections 378, 379, and 381 of the Indian Penal Code, 1860 / Bharatiya Nyaya Sanhita, 2023 (theft of intellectual property and trade secrets); and (iv) any other applicable criminal statute in the Republic of India, the United Kingdom, the United States of America, or any member state of the European Union; and (d) claim recovery of all legal costs, attorney fees, investigative expenses, and forensic audit costs incurred in connection with the detection, investigation, and prosecution of the infringement.

**14.4 Survival.**
The obligations and restrictions set forth in this Section 14 shall survive the termination or expiry of these Terms and the User's account, and shall remain in full force and effect indefinitely.

---

### Remaining Sections (Renumbered)

All existing sections from the current T&C (Sections 9–18) shall be renumbered as Sections 15–24 respectively. No substantive changes to those sections. Section 25 is the new final section. The updated section mapping is:

| Old Section | New Section | Title |
|---|---|---|
| 9 | 15 | Confidentiality and Non-Disclosure |
| 10 | 16 | Limitation of Liability |
| 11 | 17 | Indemnity |
| 12 | 18 | Disclaimer of Warranties |
| 13 | 19 | Force Majeure |
| 14 | 20 | Termination and Suspension |
| 15 | 21 | Dispute Resolution |
| 16 | 22 | Governing Law and Jurisdiction |
| 17 | 23 | General Provisions |
| 18 | 24 | Contact Information |

---

## 5. Proposed Code Changes

### [Legal Page Update]

#### [MODIFY] [page.tsx](file:///c:/Users/Hrushikesh%20Pangarkar/OneDrive/Desktop/Fracctional%20Sales/Org/src/app/legal/terms/page.tsx)
Update the Terms & Conditions page to include the 7 new sections (8 rewrite, 9, 10, 11, 12, 13, 14) and renumber existing sections 9–18 to 15–24. Update `Last updated` date and version to `v2.0`.

---

### [Backend Route]

#### [NEW] [route.ts](file:///c:/Users/Hrushikesh%20Pangarkar/OneDrive/Desktop/Fracctional%20Sales/Org/src/app/api/ip/route.ts)
A Next.js API route handler to securely extract the client's public IP address.

---

### [Frontend Onboarding Wizard]

#### [MODIFY] [page.tsx](file:///c:/Users/Hrushikesh%20Pangarkar/OneDrive/Desktop/Fracctional%20Sales/Org/src/app/onboarding/page.tsx)
1.  **Add Agreement Step:**
    *   Extend `OBO_STEPS`, `SP_STEPS`, and `TPSP_STEPS` to include `"Agreement"` as the final step.
2.  **Add State Variables:**
    *   `termsConsent`: `boolean` (state tracking checkbox value)
3.  **Implement Terms UI:**
    *   Create a scrollable window showing a summary of key terms with a link to the full T&C page.
    *   Add a styled checkbox: *"I have read and agree to the Fractional Sales Partner Platform User Agreement (Version 2.0). I understand this action constitutes a legally binding acceptance."*
4.  **Fetch IP and Complete Saving:**
    *   In `handleComplete()`, make a fetch call to `/api/ip` to retrieve the user's IP.
    *   Inject the collected click-wrap audit parameters (`termsAccepted`, `termsVersion: "2.0"`, `termsAcceptedDate`, `termsIpAddress`, `termsUserAgent`) into the Firestore write payload.

---

## 6. Verification Plan

### Automated/Code Verification
*   Compile/Build check using `/Build Project` workflow to ensure no TypeScript compilation issues.

### Manual Verification
1.  **Terms Page:** Visit `/legal/terms` and verify all 24 sections render correctly with the new clauses.
2.  **Wizard Progression:** Navigate through the wizard and verify that the new "Agreement" step is displayed before completion.
3.  **Validation Check:** Verify that the "Finish & Go to Portal" button remains disabled until the "I Accept" checkbox is ticked.
4.  **Database Inspection:** Complete the wizard, inspect the Firestore document for the user profile, and ensure all audit fields (`termsAccepted`, `termsVersion`, `termsAcceptedDate`, `termsIpAddress`, `termsUserAgent`) are correctly populated.
