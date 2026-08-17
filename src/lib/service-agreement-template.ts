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
  "3-day paid Instagram/Facebook marketing campaign targeted in and around Sutton, London.",
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
        heading: "1. PREAMBLE & OPERATIVE PARTIES",
        content: `This Service Agreement ("Agreement") is made and entered into on ${data.date} between Biztribe Trading & Consultancy India Private Limited ("Company", "We", "Us", operating the brand name "Fractional Sales Partner" at fractionalsales.com) having its registered address at B-1001, Kapil Akhila, Pancard Club Road, Baner, Pune – 411 045, Maharashtra, India, and ${effectiveClientDisplayName} ("Client", "Business Owner", "Payee").`
      },
      {
        heading: "2. CORPORATE AUTHORITY, ANTI-IMPERSONATION & PERSONAL LIABILITY WARRANTY",
        content: `Any individual entering into, accepting, or executing this Agreement on behalf of a company, LLP, firm, sole proprietorship, or legal entity represents and warrants that they possess full legal authority, corporate power, and valid authorization to bind such entity to all terms, obligations, and financial commitments set forth herein. If an individual executes this Agreement without requisite authorization, or provides false, fraudulent, or misleading information regarding their association with, designation in, or authorization by the stated company, such individual shall be personally and individually liable for all financial considerations, damages, and legal liabilities arising under this Agreement. Furthermore, any fraudulent misrepresentation, impersonation, or unauthorized corporate representation constitutes a material breach and an actionable offense punishable under civil and criminal law (including the Indian Penal Code / Bharatiya Nyaya Sanhita, 2023, the Information Technology Act, 2000, and local laws of the target jurisdiction).`
      },
      {
        heading: "3. SCOPE OF SERVICES & DELIVERABLES",
        content: `Under this Agreement, the Company facilitates representation services through the Fractional Sales Partner marketplace for "${data.eventName || "Event Representation"}". The scope of services included in ${data.packageName} comprises:
1. Dedicated Sales Partner visitor engagement, video call briefing, and status updates (Instagram posts / WhatsApp images sent every 2 hours).
2. 6x3 ft. standee, 500 promotional pamphlets, and a GDPR-compliant lead capture system.
3. Dedicated product display space for sample exhibition/tasting.
4. Local storage & transportation logistics handling.
5. 3-day paid targeted Instagram/Facebook marketing campaigns in Sutton, London.
6. Pre-event alignment call with the assigned Sales Partner 1 week prior to event date.`,
      },
      {
        heading: "4. MARKETPLACE NATURE & SALES PARTNER PERFORMANCE DISCLAIMER",
        content: `The platform (fractionalsalespartner.com / Biztribe Trading & Consultancy India Private Limited) operates strictly as a neutral technology marketplace. Selecting the right marketer, exhibitor, or Sales Partner is the complete and sole responsibility of the Business Owner. The Platform does not guarantee sales volumes, revenue outcomes, conversion rates, or performance results of the Sales Partner.`,
      },
      {
        heading: "5. MEDIATOR STATUS & LEADS VS. ORDERS DISCLAIMER",
        content: `The Platform acts solely as a mediator that passes leads received during the event to the Business Owner. Captured leads constitute raw prospect contacts/inquiries only and shall not be construed as confirmed sales orders. The Business Owner bears sole responsibility for following up on, nurturing, and converting leads into customers.`,
      },
      {
        heading: "6. EXPORT COMPLIANCE & LEGAL DOCUMENTATION",
        content: `Biztribe Trading & Consultancy India Private Limited provides no guarantee or warranty regarding product compliance, import/export regulations, or statutory approvals for overseas markets. Preparing all necessary legal documentation, customs declarations, health permits, and statutory compliance required for exhibiting and selling in the target country rests entirely on the Business Owner. Neither the Platform nor the Exhibitor/Sales Partner can sell products without the Business Owner having appropriate legal documentation to sell in the respective market.`,
      },
      {
        heading: "7. CUSTOMS DUTIES, TARIFFS & BORDER CLEARANCE",
        content: `The Business Owner is solely and exclusively responsible for all customs duties, tariffs, import taxes, VAT/GST, and clearance paperwork required for shipping samples or collateral into the destination country. If samples are detained, delayed, seized, or destroyed by border control or customs authorities, Biztribe Trading & Consultancy India Private Limited and the Sales Partner shall bear no liability, and fees paid remain non-refundable.`,
      },
      {
        heading: "8. DELAYED CLIENT SHIPPING & COURIER TRANSIT HOLDS",
        content: `The Business Owner must dispatch physical samples and materials by the mandatory cutoff dates specified by the Company. If samples arrive late at the venue due to client dispatch delays or courier transit holds, the Sales Partner will conduct representation using available digital brochures and verbal briefings, and no refund or fee reduction shall be granted.`,
      },
      {
        heading: "9. PRODUCT LIABILITY & HARM HOLD HARMLESS",
        content: `Biztribe Trading & Consultancy India Private Limited, Biztribe Limited, its affiliates, officers, employees, and the assigned Sales Partner shall not be responsible or liable for any type of loss, harm, injury, illness, allergic reaction, or adverse impact caused by the product, its ingredients, or its quality to any potential customer, visitor, or attendee during testing, sampling, demo, or display. All product liability rests exclusively with the Business Owner.`,
      },
      {
        heading: "10. VENUE PROHIBITED ITEMS, PERISHABLES & SAFETY",
        content: `The Business Owner warrants that its products comply with all venue regulations, health standards, and safety laws. If an event organizer or venue authority restricts, confiscates, or bans the display or sampling of the product due to safety, health, or policy violations, the Company and Sales Partner shall not be liable, and no refund shall apply.`,
      },
      {
        heading: "11. INTELLECTUAL PROPERTY & INDEMNITY",
        content: `The Business Owner represents and warrants that its products, brand names, logos, artwork, and packaging do not infringe upon any third-party patent, copyright, trademark, or trade secret. The Business Owner agrees to indemnify, defend, and hold harmless Biztribe Trading & Consultancy India Private Limited, its directors, and the Sales Partner against any third-party IP infringement claims or legal disputes.`,
      },
      {
        heading: "12. SALES PARTNER IP BREACH & TRADE SECRET DISCLAIMER",
        content: `If the Sales Partner breaches, misappropriates, or infringes upon any Intellectual Property (IP), trade secrets, patents, manufacturing formulas, or proprietary designs belonging to the Business Owner, such breach shall be the sole, direct, and exclusive legal responsibility of the individual Sales Partner. The Sales Partner shall be liable under applicable civil and criminal laws of the land in the country or jurisdiction where the representation takes place. The Platform (Biztribe Trading & Consultancy India Private Limited / fractionalsalespartner.com) does not encourage, request, or require the Business Owner to share confidential manufacturing formulas, trade secrets, or unpatented proprietary technical data with either the Platform or the Sales Partner. Any sharing of sensitive confidential information or trade secrets by the Business Owner is performed entirely at the Business Owner's own risk, and the Platform disclaims all liability for any inter-party IP breaches.`,
      },
      {
        heading: "13. NON-CIRCUMVENTION & OFF-PLATFORM ENGAGEMENT",
        content: `The Business Owner agrees not to directly solicit, engage, hire, or pay the assigned Sales Partner outside the Fractional Sales Partner platform for a period of twenty-four (24) months from the event date. Any breach of this clause shall entitle the Company to liquidated damages equal to twice the applicable platform package fee.`,
      },
      {
        heading: "14. LOGISTICS & MATERIAL HANDLING LOSS DISCLAIMER",
        content: `Any loss, theft, corruption, or physical damage to display-purpose materials, standees, marketing collateral, or product samples while handling or during local storage and transportation is strictly outside the responsibility and liability of Biztribe Trading & Consultancy India Private Limited (fractionalsalespartner.com).`,
      },
      {
        heading: "15. RETURN OF DISPLAY SAMPLES & BACKWARD LOGISTICS",
        content: `Biztribe Trading & Consultancy India Private Limited will not bring display-purpose samples back to India or the origin country by default. Upon written request and full advance payment of return courier charges by the Business Owner, the Company may assist in shipping samples back; however, this shall be treated as a voluntary gesture of assistance rather than a contractual commitment.`,
      },
      {
        heading: "16. BRAND & LOGO REPRESENTATION AUTHORIZATION",
        content: `The Business Owner grants Biztribe Trading & Consultancy India Private Limited and the assigned Sales Partner full authority and license to use, display, and represent their brand name, logo, trademarks, and media across digital and non-digital media, and authorizes the chosen Sales Partner to represent them in the specified target country.`,
      },
      {
        heading: "17. LEAD DATA QUALITY & PRIVACY DISCLAIMER",
        content: `While the Sales Partner captures visitor inquiries in good faith using GDPR-compliant systems, the Company makes no representation regarding the accuracy, completeness, or responsiveness of visitor contact details. Any post-event data access or deletion requests under GDPR/DPDP Act shall be governed in accordance with platform privacy policies.`,
      },
      {
        heading: "18. LEAD EXCLUSIVITY, COMPANY MARKETING & AFFILIATE USAGE RIGHTS",
        content: `All lead data, contact details, and visitor inquiries captured at the event booth shall be shared exclusively with the Business Owner and shall not be resold or transferred by the Platform to competing third-party businesses. However, the Business Owner acknowledges and agrees that the Platform (Biztribe Trading & Consultancy India Private Limited) retains a perpetual, worldwide, royalty-free, non-exclusive right and license to utilize captured lead data for generic marketing campaigns, promotional advertisements, newsletters, and digital outreach relating to products, services, and commercial offerings provided directly by Biztribe Trading & Consultancy India Private Limited or its corporate affiliates, group companies, portfolio ventures (wherein the Company holds equity investment), and formal strategic partner entities.`,
      },
      {
        heading: "19. PAYMENTS, BOOTH BOOKINGS & REFUND POLICY",
        content: `Payment must be made in full and in advance before booth/stall booking. Booking is non-cancellable by the Business Owner. Payments made are non-refundable, unless the Sales Partner fails to present themselves at the venue on the event day. If booth allocations become fully booked prior to receiving payment, a 100% full refund will be issued.`,
      },
      {
        heading: "20. ORGANISER EVENT CANCELLATION & SAMPLES",
        content: `If the event is cancelled directly by the Event Organiser, the Company will issue a full refund minus non-recoverable incurred expenses (such as standee printing, pamphlet production, etc.). In such event cancellation scenarios, shipped samples will not be sent back by default, but can be dispatched upon request and payment of return courier fees.`,
      },
      {
        heading: "21. FORCE MAJEURE & VENUE MISHAPS",
        content: `Biztribe Trading & Consultancy India Private Limited and its overseas appointed team shall not be responsible for loss of value or goods due to mishaps such as fire, flood, theft, or natural disasters at the venue. Payments remain non-refundable in such mishap or force majeure situations.`,
      },
      {
        heading: "22. EMERGENCY SALES PARTNER RE-ASSIGNMENT",
        content: `In cases of emergency or unforeseen unavailability, Biztribe Trading & Consultancy India Private Limited reserves the right to assign an alternative qualified Sales Partner, and the Business Owner hereby grants explicit permission to fractionalsalespartner.com for such substitution.`,
      },
      {
        heading: "23. BRIEFING MEETING & COLLATERAL SUBMISSION OBLIGATIONS",
        content: `The Business Owner must conduct an alignment meeting with the Sales Partner prior to the event date. It is the Business Owner's responsibility to connect, convey marketing schemes, share product details, and submit standee images, flyers, and promotional artwork to the Sales Partner on time.`,
      },
      {
        heading: "24. GENUINE BRAND & PRICING REPRESENTATION OBLIGATION & MISREPRESENTATION PENALTY",
        content: `The Sales Partner is strictly expected and required to represent the Business Owner's brand, product specifications, commercial pricing points, promotional schemes, and terms genuinely, accurately, and strictly as communicated by the Business Owner during pre-event briefings. In the event that the Sales Partner misrepresents the brand, quotes unauthorized pricing, promises unauthorized discounts/schemes, or provides false product information to prospective clients or event visitors, the Sales Partner shall bear sole professional liability for such misrepresentation. Furthermore, upon verification of material misrepresentation by the Platform or Board, the Sales Partner shall be subject to a financial penalty of up to fifty percent (50%) of their specified payout consideration for the engagement, which amount may be withheld, set off, or refunded to the Business Owner at the sole discretion of the Company.`,
      },
      {
        heading: "25. PLATFORM ETHOS, MUTUAL GROWTH, ANTI-POACHING & SP RIGHT TO REJECT UNETHICAL / ILLEGAL INSTRUCTIONS",
        content: `The Platform is established on the foundational principles of mutual professional growth, trust, and ethical business collaboration. All Users agree to utilize the Platform strictly for legitimate business development and collaborative representation, rather than predatory, anti-competitive, or poaching activities. Furthermore, the Sales Partner maintains the absolute and unconditional right to refuse, decline, or reject any request, instruction, marketing claim, or task specified by the Business Owner if such request violates the statutory legal boundaries, local health/safety regulations, venue policies, or ethical standards of the target country. The Company shall not penalize or sanction any Sales Partner for refusing to execute instructions or claims that are unlawful, fraudulent, or unethical under the laws of the land.`,
      },
      {
        heading: "26. CONFIDENTIALITY & NON-DISCLOSURE",
        content: `Both parties agree to hold all non-public commercial data, proprietary pricing structures, supplier lists, and business strategies disclosed during the engagement in strict confidence for a period of two (2) years following the event date.`,
      },
      {
        heading: "27. LIMITATION OF FINANCIAL LIABILITY (LIABILITY CAP)",
        content: `To the maximum extent permitted under applicable law, the total aggregate financial liability of Biztribe Trading & Consultancy India Private Limited, its directors, and officers for any and all claims arising out of or related to this Agreement shall be strictly capped at the total amount actually paid by the Business Owner for the relevant Service Package.`,
      },
      {
        heading: "28. INTER-PARTY DISPUTE RESOLUTION, BOARD ARBITRATION & TRUSTEE PAYMENT DETERMINATION",
        content: `In the event of any commercial disagreement, service delivery dispute, or payout controversy arising between the Business Owner and the Sales Partner regarding event performance, lead delivery, or fee release, the Platform (Biztribe Trading & Consultancy India Private Limited / fractionalsalespartner.com) shall act in the capacity of a neutral Trustee holding escrow/payment funds. The Board of Directors of Biztribe Trading & Consultancy India Private Limited (or its designated internal dispute resolution panel) shall review the submitted evidence and render an administrative determination regarding the release, withholding, refund, or distribution of contested payment funds. Both the Business Owner and the Sales Partner irrevocably agree to abide by and be bound by the Board's payment determination as final and binding between the parties, unless and until the dispute escalates into formal judicial proceedings before a competent court of law.`,
      },
      {
        heading: "29. GOVERNING LAW & JURISDICTION",
        content: `This Agreement shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the competent courts in Pune, Maharashtra, India.`,
      },
      {
        heading: "30. ELECTRONIC ACCEPTANCE & VERIFICATION STAMP",
        content: `This document is electronically executed pursuant to Section 10A of the Information Technology Act, 2000. By checking the acceptance box and clicking "Pay to Confirm" on the Fractional Sales Partner platform, the Client irrevocably accepts and binds itself to this Service Agreement.`,
      }
    ]
  };
}
