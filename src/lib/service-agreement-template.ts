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

export interface ServiceAgreementData {
  agreementRef: string;
  date: string;
  clientName: string;
  companyName?: string;
  clientEmail: string;
  spName: string;
  spEmail?: string;
  packageName: string;
  totalAmount: number;
  currency: string;
  lineItems: Array<{ description: string; cost: number | string }>;
  eventName?: string;
  paymentTxnId?: string;
  paymentTimestamp?: string;
  userIp?: string;
}

export const STANDARD_PACKAGE_INCLUSIONS = [
  "A dedicated sales partner to talk to visitors about your product/service – including a video call with you and status updates (Instagram posts / WhatsApp images sent every 2 hours).",
  "A 6x3 ft. standee, 500 pamphlets, and a GDPR-compliant system to capture leads on your behalf.",
  "Product display space to showcase your samples so that visitors/prospects can taste/view them.",
  "Local storage & transportation logistics.",
  "3-day paid Instagram/Facebook marketing campaign targeted in and around the event venue location.",
  "A pre-event alignment call with your sales partner one week prior, so you can brief them on how you'd like your products exhibited on the day.",
];

export function getServiceAgreementDetails(data: ServiceAgreementData) {
  const companyName = "Biztribe Trading & Consultancy India Private Limited";
  const companyAddress = "B-1001, Kapil Akhila, Pancard Club Road, Baner, Pune – 411 045, Maharashtra, India";
  const platformName = "Fractional Sales Partner";
  const website = "fractionalsales.com";

  // Prioritize Company Name over Personal Name for Client / Payee
  const cleanCompanyName = data.companyName?.trim();
  const cleanClientName = data.clientName?.trim();

  let effectiveClientDisplayName = "Client / Business Owner";
  if (cleanCompanyName && cleanCompanyName.length > 0) {
    if (cleanClientName && cleanClientName.length > 0 && cleanClientName.toLowerCase() !== cleanCompanyName.toLowerCase()) {
      effectiveClientDisplayName = `${cleanCompanyName} (rep. by ${cleanClientName})`;
    } else {
      effectiveClientDisplayName = cleanCompanyName;
    }
  } else if (cleanClientName && cleanClientName.length > 0) {
    effectiveClientDisplayName = cleanClientName;
  }

  return {
    title: "FRACTIONAL SALES PARTNER — SERVICE AGREEMENT",
    refNo: data.agreementRef,
    date: data.date,
    company: {
      name: companyName,
      brand: platformName,
      address: companyAddress,
      website: website,
      email: "sales@fractionalsalespartner.com",
    },
    client: {
      name: effectiveClientDisplayName,
      email: data.clientEmail || "N/A",
    },
    salesPartner: {
      name: data.spName || "Assigned Sales Partner",
      email: data.spEmail || "N/A",
    },
    engagement: {
      packageName: data.packageName || "Representation Package",
      eventName: data.eventName || "Event Representation",
      totalAmount: data.totalAmount,
      currency: data.currency || "INR",
      lineItems: data.lineItems && data.lineItems.length > 0 ? data.lineItems : [{ description: "Representation Fees", cost: data.totalAmount }],
      inclusions: STANDARD_PACKAGE_INCLUSIONS,
    },
    auditTrail: {
      txnId: data.paymentTxnId || "PRE-PAYMENT PENDING",
      timestamp: data.paymentTimestamp || new Date().toISOString(),
      userIp: data.userIp || "Recorded via Web App Session",
    },
    legalSections: [
      {
        heading: "1. PREAMBLE & CORPORATE AUTHORITY",
        content: `a. OPERATIVE PARTIES: This Service Agreement ("Agreement") is made and entered into on ${data.date} between Biztribe Trading & Consultancy India Private Limited ("Company", "We", "Us", operating the brand name "Fractional Sales Partner" at fractionalsales.com) having its registered address at B-1001, Kapil Akhila, Pancard Club Road, Baner, Pune – 411 045, Maharashtra, India, and ${effectiveClientDisplayName} ("Client", "Business Owner", "Payee").

b. CORPORATE AUTHORITY & PERSONAL LIABILITY WARRANTY: Any individual executing this Agreement on behalf of a company or legal entity represents and warrants full corporate authority to bind such entity. If executed without authorization, or with false association data, such individual shall be personally liable for all financial and legal obligations. Misrepresentation or impersonation constitutes an actionable offense punishable under civil and criminal law (including the Bharatiya Nyaya Sanhita, 2023, the Information Technology Act, 2000, and applicable international laws).`,
      },
      {
        heading: "2. SCOPE OF SERVICES & DELIVERABLES",
        content: `a. FACILITATED DELIVERABLES: The Company facilitates representation services through the Fractional Sales Partner marketplace for "${data.eventName || "Event Representation"}". Included deliverables in ${data.packageName} are:
  1. Dedicated Sales Partner visitor engagement, video call briefing, and status updates (Instagram posts / WhatsApp images sent every 2 hours).
  2. 6x3 ft. standee, 500 promotional pamphlets, and a GDPR-compliant lead capture system.
  3. Dedicated product display space for sample exhibition/tasting.
  4. Local storage & transportation logistics handling.
  5. 3-day paid targeted Instagram/Facebook marketing campaigns in and around the event venue location.
  6. Pre-event alignment call with the assigned Sales Partner 1 week prior to event date.

b. BRIEFING & COLLATERAL OBLIGATIONS: The Business Owner must conduct an alignment meeting prior to the event, convey marketing schemes, share product specifications, and submit standee artwork and flyers on time.`,
      },
      {
        heading: "3. MARKETPLACE NATURE, MEDIATOR STATUS & REPRESENTATION OBLIGATIONS",
        content: `a. MARKETPLACE NATURE & DISCLAIMER: The Platform operates strictly as a neutral marketplace. Selecting the Sales Partner rests solely with the Business Owner. The Platform does not guarantee sales volumes, conversion rates, or performance results.

b. MEDIATOR STATUS & LEADS VS. ORDERS: The Platform acts solely as a mediator passing captured leads to the Business Owner. Captured inquiries do not constitute confirmed sales orders; converting leads remains the Business Owner's responsibility.

c. LEAD EXCLUSIVITY & AFFILIATE MARKETING RIGHTS: Captured lead data shall be shared exclusively with the Business Owner and will not be resold to direct commercial competitors. However, the Business Owner grants the Platform a perpetual, worldwide, non-exclusive license to use lead data for generic marketing of products/services operated directly by Biztribe Trading & Consultancy India Private Limited, its corporate affiliates, or equity portfolio ventures.

d. GENUINE BRAND REPRESENTATION & 50% MISREPRESENTATION PENALTY: The Sales Partner must represent brand pricing and schemes strictly as briefed. Material misrepresentation by the Sales Partner shall subject them to a financial penalty of up to 50% of their payout consideration, set off or refunded at the Company's discretion.`,
      },
      {
        heading: "4. EXPORT COMPLIANCE, CUSTOMS & SHIPPING LOGISTICS",
        content: `a. OVERSEAS COMPLIANCE & LEGAL DOCUMENTS: Preparing all statutory export documents, customs declarations, and health permits for the target country rests entirely on the Business Owner. Neither the Platform nor the Sales Partner can exhibit or sell without valid statutory permissions.

b. CUSTOMS DUTIES & BORDER CLEARANCES: The Business Owner is exclusively responsible for all customs duties, tariffs, VAT/GST, and clearance paperwork. Fees paid remain non-refundable if samples are detained, seized, or destroyed by border authorities.

c. SHIPPING CUTOFFS & TRANSIT HOLDS: Physical samples must be dispatched by mandatory cutoff dates. If samples arrive late due to client delays or transit holds, representation will proceed using digital brochures and verbal briefings without fee reduction.`,
      },
      {
        heading: "5. PRODUCT LIABILITY, VENUE SAFETY & INTELLECTUAL PROPERTY",
        content: `a. PRODUCT HARM HOLD HARMLESS: Biztribe Trading & Consultancy India Private Limited, its officers, and the Sales Partner shall bear no liability for any loss, harm, injury, illness, or allergic reaction caused by the product, ingredients, or sample testing. All product liability rests exclusively with the Business Owner.

b. VENUE SAFETY & PERISHABLES: The Business Owner warrants product compliance with venue health and safety laws. Confiscation or restriction of products by venue authorities shall not entitle the client to refunds.

c. INTELLECTUAL PROPERTY INDEMNITY: The Business Owner warrants that its brand assets, artwork, and packaging do not infringe third-party IP rights and agrees to fully indemnify the Company and Sales Partner against infringement claims.

d. SALES PARTNER IP BREACH & TRADE SECRET DISCLAIMER: Any IP misappropriation or trade secret breach by the Sales Partner shall be the sole legal responsibility of that individual under local country laws. Sharing confidential manufacturing formulas or trade secrets is performed entirely at the Business Owner's own risk.`,
      },
      {
        heading: "6. LOGISTICS, MATERIAL HANDLING & SAMPLE RETURNS",
        content: `a. MATERIAL LOSS DISCLAIMER: Any physical loss, theft, corruption, or damage to standees, marketing collateral, or samples during handling, storage, or transport is outside the liability of the Company.

b. SAMPLE RETURNS & BACKWARD LOGISTICS: Display samples will not be returned to origin countries by default. Upon written request and advance payment of return courier charges, the Company may assist in returning samples as a voluntary gesture.`,
      },
      {
        heading: "7. COMMERCIAL TERMS, REFUND POLICY & FORCE MAJEURE",
        content: `a. PAYMENTS, BOOTH BOOKINGS & UNFULFILLED REPRESENTATION REFUND: Payment must be made in full in advance before booth/stall booking. Booking is non-cancellable by the Business Owner. All payments made are non-refundable, EXCEPT in the event that no Sales Partner is available or assigned, or if the assigned Sales Partner fails to present themselves at the venue on the event date to represent and showcase the Business Owner's products. In such unfulfilled representation scenarios (where no person represents or showcases your products on the event date), or if booth allocations become fully booked prior to receiving payment, the Company shall issue a 100% full refund of the package consideration paid by the Business Owner.

b. ORGANISER CANCELLATION: If the event is cancelled directly by the Event Organiser, the Company will refund payments minus non-recoverable incurred collateral expenses.

c. FORCE MAJEURE & VENUE MISHAPS: The Company is not liable for loss of value or goods due to fire, flood, theft, natural disasters, or force majeure events at the venue. Payments remain non-refundable.`,
      },
      {
        heading: "8. PLATFORM ETHOS, NON-CIRCUMVENTION & GOVERNANCE",
        content: `a. NON-CIRCUMVENTION: The Business Owner agrees not to directly solicit, engage, or pay the Sales Partner off-platform for 24 months, subject to liquidated damages equal to twice the package fee.

b. PLATFORM ETHOS & SP RIGHT TO REJECT: Built on mutual growth, the Sales Partner maintains the unconditional right to refuse any instruction or marketing claim that violates local laws, venue rules, or ethical standards without penalty.

c. EMERGENCY RE-ASSIGNMENT: The Company reserves the right to substitute a qualified alternative Sales Partner during emergencies.

d. BRAND AUTHORIZATION & PRIVACY: Business Owner grants license to represent brand assets. Post-event lead quality and GDPR/DPDP access shall follow platform privacy policies.`,
      },
      {
        heading: "9. CONFIDENTIALITY, LIABILITY CAP & ARBITRATION",
        content: `a. CONFIDENTIALITY: Both parties agree to maintain commercial data and pricing confidential for two (2) years following the event.

b. FINANCIAL LIABILITY CAP: Total aggregate financial liability of Biztribe Trading & Consultancy India Private Limited is strictly capped at the total amount paid by the Business Owner for the package.

c. DISPUTE RESOLUTION & BOARD TRUSTEE DETERMINATION: In inter-party disputes, the Platform acts as a neutral Trustee holding escrow funds. The Board of Directors' administrative determination shall be final and binding between parties prior to judicial escalation.

d. GOVERNING LAW & JURISDICTION: Governed by the laws of India; subject to the exclusive jurisdiction of competent courts in Pune, Maharashtra, India.

e. ELECTRONIC EXECUTION: Executed pursuant to Section 10A of the Information Technology Act, 2000. By checking the acceptance box and clicking "Pay to Confirm", the Client irrevocably accepts and binds itself to this Agreement.`,
      }
    ]
  };
}
