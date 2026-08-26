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

export interface SPServiceAgreementData {
  spName: string;
  spEmail?: string;
  eventName: string;
  venue?: string;
  city?: string;
  country?: string;
  date?: string;
  currency?: string;
  packages?: Array<{
    name: string;
    items: Array<{ description: string; cost: string }>;
  }>;
}

export function getSPServiceAgreementDetails(data: SPServiceAgreementData) {
  const timestamp = Date.now();
  const refNo = `SP-AGR-${timestamp.toString().slice(-8)}`;

  return {
    refNo,
    createdDate: new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    company: {
      name: "Biztribe Trading & Consultancy India Private Limited",
      brand: "Fractional Sales Partner / tellmewhatuwant",
      ukEntity: "Biztribe Limited (UK)",
      address: "Office 402, Quantum Towers, F.C. Road, Shivajinagar, Pune, Maharashtra 411005",
      cin: "U74999PN2026PTC228194",
      website: "https://fractionalsalespartner.com",
    },
    partner: {
      name: data.spName || "Sales Partner",
      email: data.spEmail || "Registered Partner Email",
    },
    event: {
      name: data.eventName || "Sales Representation Event",
      venue: data.venue || "Designated Event Venue",
      location: `${data.city || ""}, ${data.country || ""}`.trim() || "Event Location",
      date: data.date || "Scheduled Event Date",
      currency: data.currency || "INR",
    },
    legalSections: [
      {
        heading: "CLAUSE 1. PLATFORM FEES AND COMMISSION DEDUCTION",
        content: `1.1 The Sales Partner hereby explicitly agrees and acknowledges that Biztribe Trading & Consultancy India Private Limited (hereinafter referred to as "the Platform Company", operating fractionalsalespartner.com and tellmewhatuwant) shall be entitled to deduct up to twenty-five percent (25%) of the total gross consideration value of any package, quote, or booking executed through the Platform as platform facilitation, escrow handling, software licensing, and administrative service fees.\n1.2 All quoted package fees shall be inclusive of applicable statutory taxes, including Goods and Services Tax (GST), unless specified otherwise.`
      },
      {
        heading: "CLAUSE 2. CODE OF CONDUCT, DECORUM, AND DISCIPLINARY TERMINATION",
        content: `2.1 The Sales Partner covenants to maintain the highest standards of professional decorum, integrity, and ethical conduct while physically present at event venues or communicating with clients.\n2.2 The Platform Company reserves the unreserved right to immediately suspend, de-list, or permanently terminate the Sales Partner's account and cancel active representation listings, without prior notice, upon the occurrence of any event of default including: (a) Failure to maintain professional decorum at the venue; (b) Fraud, misrepresentation, cheating, or willful deceit; (c) Falsification of event metrics, footfall numbers, or credential documentation; (d) Any conduct bringing disrepute or commercial harm to the Platform Company or its clients.`
      },
      {
        heading: "CLAUSE 3. CONDITIONS PRECEDENT TO PAYMENT DISBURSEMENT AND RIGHT OF FORFEITURE",
        content: `3.1 The Sales Partner explicitly agrees that the release of representation fees by the Platform Company is strictly contingent upon the complete, uncompromised fulfillment of all operational obligations set forth herein.\n3.2 The Platform Company shall possess the absolute legal right to withhold, freeze, set off, or permanently forfeit the disbursement of representation charges in their entirety upon the occurrence of any one or more of the following defaults:\n  (a) Default of Punctuality & Attendance: Failure of the Sales Partner to arrive and check in at the event venue at the agreed time;\n  (b) Brand Malignment & Misinformation: Any act of spreading misinformation, misrepresenting product specifications, or making defamatory statements that malign the brand image, goodwill, or commercial reputation of tellmewhatuwant, fractionalsalespartner.com, the Platform Company, or the represented Business Owner;\n  (c) Geolocation Check-in Non-Compliance: Failure of the Sales Partner to complete mandatory mobile application check-in utilizing GPS geolocation tracking upon physical arrival at the venue;\n  (d) Live Stream Default: Failure to initiate, maintain, and complete a mandatory minimum of two (2) hours of continuous live video streaming to the represented Business Owner or customer during active event operational hours;\n  (e) Social Media Coverage Default: Failure to record and publish venue video clips/updates to designated Instagram or Facebook social channels at minimum intervals of every two (2) hours throughout the duration of the event;\n  (f) Unauthorized Commercial Activity & Scope Creep: Engaging in unauthorized sale, promotion, solicitation, or distribution of any third-party goods, services, or merchandise not explicitly agreed upon and committed in the executed written quote provided to the Business Owner.`
      },
      {
        heading: "CLAUSE 4. SETTLEMENT TIMELINE AND COMMUTING CHARGES CLASSIFICATION",
        content: `4.1 Subject to full compliance with Clause 3 herein, representation charges quoted separately by the Sales Partner in the package breakdown shall be disbursed to the Sales Partner's designated, verified bank account within seven (7) business days (1 week) following the successful conclusion of the event and completion of post-event audit verification.\n4.2 Commuting & Travel Charges Inclusion: The Sales Partner explicitly agrees that any commuting charges, local transport expenses, travel allowances, or travel reimbursements—even if itemized or displayed as separate line items in the quotation—shall legally be deemed and treated as an integral component of the total representation charges, and shall be subject to platform fee deductions, escrow rules, and the 7-day post-event audit settlement schedule.`
      },
      {
        heading: "CLAUSE 5. INTELLECTUAL PROPERTY AND PROPRIETARY LEAD DATA OWNERSHIP",
        content: `5.1 The Sales Partner agrees and declares that all attendee contact details, business cards, visitor logs, inquiry forms, lead data, and commercial inquiries collected, generated, or processed during the event or while representing the business via tellmewhatuwant / fractionalsalespartner.com are the sole, exclusive, and unencumbered intellectual property of Biztribe Trading & Consultancy India Private Limited and the assigned Business Owner.\n5.2 The Sales Partner is strictly prohibited from copying, storing, harvesting, utilizing, selling, or disclosing any such lead data for personal benefit, third-party solicitation, or post-event commercial exploitation. Any breach of this Clause shall constitute a criminal breach of trust under the Indian Penal Code / Bharatiya Nyaya Sanhita and Section 72 of the Information Technology Act, 2000.`
      },
      {
        heading: "CLAUSE 6. NON-CIRCUMVENTION, NON-COMPETITION, AND CONFIDENTIALITY OF TRADE SECRETS",
        content: `6.1 Non-Circumvention: The Sales Partner shall not, directly or indirectly, solicit, negotiate with, enter into agreements with, or accept direct payments from any Business Owner or client introduced through the Platform, outside of the Platform's designated payment gateways.\n6.2 Non-Competition: The Sales Partner agrees that during the active listing term and for a period of twelve (12) months following termination thereof, the Sales Partner shall not establish, operate, or participate in any competing business entity that directly solicits clients introduced via the Platform.\n6.3 Protection of Client Trade Secrets and IP: The Sales Partner explicitly agrees that any trade secrets, proprietary technology, manufacturing processes, pricing strategies, technical designs, commercial methodologies, customer lists, or intellectual property values received or accessed from the Business Owner, their employees, officers, or associates—whether disclosed in writing, orally, physically, or via digital channels—shall be held in strict, perpetual confidence and shall NOT be copied, shared, disclosed, broadcast, or exploited for any external or personal purpose.`
      },
      {
        heading: "CLAUSE 7. MEDIA COPYRIGHT DISCLAIMER AND SALES PARTNER INDEMNITY",
        content: `7.1 The Sales Partner represents and warrants that all images, graphics, event photos, media files, and descriptive content uploaded to the Platform are original or properly licensed to the Sales Partner.\n7.2 The Platform Company assumes zero legal or financial liability for any media content uploaded by the Sales Partner. In the event that any uploaded image or content infringes third-party copyrights, trademarks, or proprietary rights under the Copyright Act, 1957, the Sales Partner assumes sole and exclusive legal and financial liability, and agrees to fully indemnify the Platform Company for any legal expenses, settlements, or damages incurred.`
      },
      {
        heading: "CLAUSE 8. PUBLIC LIABILITY INSURANCE DEDUCTION",
        content: `8.1 The Sales Partner acknowledges that public liability insurance coverage is mandatory for event venue representation.\n8.2 The Platform Company reserves the right to deduct applicable subscription or premium charges for Public Liability Insurance directly from the Sales Partner's final payout disbursement prior to bank transfer.`
      },
      {
        heading: "CLAUSE 9. PROHIBITION OF CHILD LABOUR, RACIAL DISCRIMINATION, HARASSMENT, AND HATE SPEECH",
        content: `9.1 Zero Tolerance on Child Labour: The Sales Partner explicitly warrants that it strictly complies with the Child Labour (Prohibition and Regulation) Amendment Act, 2016 and International Labour Organization (ILO) standards. The Sales Partner shall not employ, engage, or deploy any person under the age of eighteen (18) years for event representation, stall management, or promotional activities.\n9.2 Prohibition of On-the-Ground Discrimination & Racial Slurs: The Sales Partner agrees to maintain strict zero-tolerance policies regarding racial slurs, caste-based discrimination, religious bias, gender discrimination, sexual harassment, or verbal/physical abuse against event attendees, clients, or platform staff, under the Protection of Civil Rights Act, 1955, Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989, and applicable penal codes.\n9.3 Any breach of this Clause shall result in immediate account termination, forfeiture of earnings, permanent platform ban, and potential referral to law enforcement authorities.`
      },
      {
        heading: "CLAUSE 10. MEDIA LICENSE AND MARKETING USAGE AUTHORIZATION",
        content: `10.1 The Sales Partner hereby grants an irrevocable, perpetual, worldwide, royalty-free, non-exclusive license to Biztribe Trading & Consultancy India Private Limited, Biztribe Limited (UK), fractionalsalespartner.com, tellmewhatuwant, and their associate/partner entities to utilize, publish, broadcast, and edit any photographs, event videos, live stream clips, and promotional content featuring the Sales Partner or created during venue representation.\n10.2 Such content may be utilized for marketing, advertising, public relations, platform promotional campaigns, and social media broadcasting across global jurisdictions without requirement for additional consent or compensation.`
      },
      {
        heading: "CLAUSE 11. PROHIBITION ON UNAUTHORIZED RE-USE OF BUSINESS OWNER MEDIA AND PRODUCT ASSETS",
        content: `11.1 The Sales Partner explicitly agrees and covenants that any photographs, video recordings, digital assets, marketing collateral, or brand materials depicting the Business Owner, the Business Owner's customers, or their respective products and services—whether accessed via fractionalsalespartner.com, tellmewhatuwant, or provided by any means by Biztribe Trading & Consultancy India Private Limited—shall NOT be published, broadcast, shared, reproduced, or utilized by the Sales Partner for personal portfolio marketing, third-party promotion, or any external purpose, without the explicit, prior written consent of Biztribe Trading & Consultancy India Private Limited.\n11.2 Any unauthorized publication or exploitation of client or product media shall constitute an immediate breach of confidentiality and intellectual property rights under the Copyright Act, 1957, exposing the Sales Partner to statutory damages, immediate platform termination, and injunctive relief.`
      },
      {
        heading: "CLAUSE 12. PROHIBITION OF DEFAMATION AND NOTICE OF LEGAL PROSECTORIAL ACTION",
        content: `12.1 The Sales Partner covenants that it shall not, directly or indirectly, make, publish, post, broadcast, or circulate any oral, written, or electronic statement, review, post, or communication that is false, defamatory, disparaging, libelous, or slanderous towards fractionalsalespartner.com, tellmewhatuwant, Biztribe Limited (UK), Biztribe Trading & Consultancy India Private Limited, or their respective directors, officers, employees, partners, and associates.\n12.2 The Sales Partner acknowledges that any defamatory statement published on social media, public forums, or messaging platforms shall invite immediate civil suit for liquidated damages and criminal prosecution under Sections 356/356(2) of the Bharatiya Nyaya Sanhita (Section 499/500 IPC), Section 66A/43 of the Information Technology Act 2000, and the UK Defamation Act 2013 across Indian and UK jurisdictions.`
      },
      {
        heading: "CLAUSE 13. CRIMINAL BREACH OF TRUST AND THEFT OF SAMPLES, MERCHANDISE, OR MARKETING MATERIALS",
        content: `13.1 The Sales Partner acknowledges that any product samples, inventory for sale, display merchandise, promotional banners, stands, digital tablets, or marketing collateral entrusted to the Sales Partner by the Business Owner or Platform Company are held in strict legal custody and bailment.\n13.2 Any theft, conversion, unauthorized retention, failure to return, or misappropriation of sample goods, sale inventory, or marketing materials shall constitute Criminal Breach of Trust (Section 316 of Bharatiya Nyaya Sanhita / Section 405/406 IPC) and Theft (Section 303 BNS / Section 378/379 IPC).\n13.3 Upon the occurrence of any inventory default, the Platform Company reserves the immediate legal right to: (a) Freeze and permanently forfeit all pending representation payouts; (b) File an official police First Information Report (FIR) for criminal theft and breach of trust; (c) Initiate civil recovery proceedings for full market replacement cost plus punitive damages and legal expenses.`
      },
      {
        heading: "CLAUSE 14. EVENT CANCELLATION AND FORCE MAJEURE",
        content: `14.1 Organizer Cancellation: If an event/expo is officially cancelled or postponed by venue authorities due to natural disasters, acts of God, or governmental restrictions (Force Majeure), the SP shall immediately inform the Platform Company. Any unearned advance deposits shall be refunded or rolled over to the rescheduled date.\n14.2 SP Voluntary Cancellation Default: If the Sales Partner voluntarily cancels attendance or fails to appear within seven (7) days of the event start date without certified medical or Force Majeure proof, the SP agrees to forfeit all payout rights and reimburse the Platform Company for emergency replacement costs.`
      },
      {
        heading: "CLAUSE 15. SCOPE BINDING ACROSS MULTIPLE PACKAGES AND QUOTATIONS",
        content: `15.1 The execution of this Agreement shall legally bind the Sales Partner across all tier packages (e.g., Bronze, Silver, Gold) and any custom quotations or addenda issued under the event listing ID.`
      },
      {
        heading: "CLAUSE 16. RE-CONFIRMATION UPON MATERIAL EDITS",
        content: `16.1 If the Sales Partner updates package pricing, deliverables, or event location details post-creation, the SP must re-confirm adherence to the Agreement prior to saving updates. The audit log (spAgreementAcceptedAt) shall record each update timestamp.`
      },
      {
        heading: "CLAUSE 17. DISPUTE RESOLUTION AND CONCLUSIVE EVIDENTIARY PROOF",
        content: `17.1 In the event of a commercial dispute between a Business Owner and a Sales Partner, the automated server logs of the Platform Company (including GPS check-in timestamps, livestream duration logs, and social upload records) shall constitute conclusive and binding evidentiary proof of compliance or default.\n17.2 Jurisdiction for any legal proceedings shall lie exclusively with the competent courts in Pune/Mumbai, Maharashtra, India.`
      },
      {
        heading: "CLAUSE 18. INDEMNIFICATION AND VENUE LIABILITIES",
        content: `18.1 The Sales Partner agrees to defend, indemnify, and hold harmless the Platform Company and the represented Business Owner against any third-party claims, venue property damage, fines, or IP infringement liabilities caused by the acts or omissions of the Sales Partner at the event.`
      }
    ]
  };
}
