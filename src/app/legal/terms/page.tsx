export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 py-20">
      <div className="container mx-auto px-4 max-w-4xl font-sans">
        <h1 className="font-serif font-bold text-4xl mb-2">Terms and Conditions</h1>
        <p className="text-gray-500 text-sm mb-10">
          Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        <div className="space-y-8 text-gray-700 leading-relaxed text-sm">

          {/* Preamble */}
          <section className="bg-gray-50 border-l-4 border-gray-800 p-5 rounded-r-lg">
            <p>
              These Terms and Conditions ("Agreement" or "Terms") constitute a legally binding contract between <strong>Biztribe Trading & Consultancy India Private Limited</strong> ("Company", "We", "Us", or "Our"), a company incorporated under the Companies Act, 2013, having its registered office at B-1001, Kapil Akhila, Pancard Club Road, Baner, Pune – 411 045, Maharashtra, India, and any individual or legal entity ("User", "You", or "Your") who registers on, accesses, or uses the platform operating under the brand name <strong>"Fractional Sales Partner"</strong> at <strong>fractionalsales.com</strong> ("Platform") or any associated web application, mobile application, API, or service (collectively, "Services").
            </p>
            <p className="mt-3">
              By clicking "I Agree", registering an account, or by accessing or using any part of the Services, you confirm that you have read, understood, and irrevocably agree to be bound by these Terms and our Privacy Policy and Refund Policy, which are incorporated herein by reference. <strong>If you do not agree to these Terms, you must immediately cease use of the Platform.</strong>
            </p>
            <p className="mt-3 font-semibold text-gray-800">
              These Terms are governed by the laws of the Republic of India. All disputes are subject to the exclusive jurisdiction of competent courts in Pune, Maharashtra.
            </p>
          </section>

          {/* 1. Definitions */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">1. Definitions</h2>
            <p className="mb-3">For the purpose of this Agreement, the following terms shall have the meanings ascribed to them below:</p>
            <ul className="space-y-0 pl-0">
              {[
                ["Platform", "The web-based and/or mobile-based marketplace operated under the brand name \"Fractional Sales Partner\" by Biztribe Trading & Consultancy India Private Limited."],
                ["Business Owner (BO)", "Any individual, sole proprietor, partnership, LLP, private limited company, or any other legal entity that registers on the Platform with the intent to discover, engage, and contract with Sales Partners or Service Providers for business development and sales augmentation purposes."],
                ["Sales Partner (SP)", "Any individual, freelance professional, or entity registered on the Platform who offers fractional, part-time, or project-based sales, business development, or market outreach services to Business Owners."],
                ["Third Party Service Provider (TPSP)", "Any entity registered on the Platform that offers ancillary professional services to BOs or SPs, including but not limited to legal, financial, HR, marketing, technology, or consulting services."],
                ["Engagement", "A confirmed professional arrangement, whether paid or unpaid, entered into between a BO and an SP/TPSP, facilitated through or originated from the Platform."],
                ["Profile", "The publicly or partially publicly visible professional page created and maintained by each User on the Platform, containing their bio, experience, offerings, and preferences."],
                ["Post / Listing", "Any content — including business opportunity listings, service advertisements, or general activity feed posts — created and published by a User on the Platform."],
                ["Confidential Information", "Any non-public information disclosed by one User to another during an Engagement that is designated as confidential or ought reasonably to be treated as confidential."],
                ["Services", "All features, tools, functions, and capabilities made available by the Company through the Platform, including but not limited to profile creation, search and discovery, direct messaging, interest expression, posting, and payment processing."],
              ].map(([term, def]) => (
                <li key={term} className="flex gap-3 py-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-800 min-w-[220px] shrink-0">{term}:</span>
                  <span>{def}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 2. Scope and Nature of Services */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">2. Scope and Nature of Services</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>The Company operates the Platform as a <strong>neutral, technology-driven marketplace</strong> that enables Business Owners to discover and connect with Sales Partners and Third Party Service Providers.</li>
              <li>The Company is strictly a <strong>facilitator of introductions and connections</strong>. It is not, under any circumstance, a party to any Engagement, commercial contract, retainer, commission arrangement, or service agreement entered into between a BO and an SP/TPSP.</li>
              <li>The Company does not employ, sub-contract, supervise, or control any Sales Partner or Service Provider listed on the Platform. All SPs and TPSPs are independent professionals or entities operating on their own account.</li>
              <li>The Company makes no warranty, express or implied, regarding the quality of service, revenue outcomes, sales performance, business results, or any other commercial outcome arising from an Engagement facilitated through the Platform.</li>
              <li>The Company reserves the right, at its sole discretion, to modify, suspend, or discontinue any aspect of the Services, with or without notice, and shall not be liable to Users for any such modification or discontinuation.</li>
            </ul>
          </section>

          {/* 3. User Registration and Eligibility */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">3. User Registration and Eligibility</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To access the Services, Users must complete the registration and onboarding process on the Platform, providing all mandatory information truthfully and completely.</li>
              <li>Eligibility to register is restricted to individuals who are at least <strong>18 years of age</strong> and legally capable of entering into binding contracts under applicable Indian law.</li>
              <li>Any person registering on behalf of a company, LLP, firm, or other legal entity represents and warrants that they have full authority to bind that entity to these Terms.</li>
              <li>Users must maintain accurate, current, and complete information in their Profile at all times. The Company reserves the right to suspend or terminate accounts found to contain false, misleading, or incomplete information.</li>
              <li>Each User is solely responsible for maintaining the confidentiality and security of their account credentials. Any activity that occurs under a User's account is deemed to be the act of that User.</li>
              <li>Users must immediately notify the Company of any suspected unauthorised access to or breach of their account at <a href="mailto:hrishikesh.pangarkar@gmail.com" className="text-indigo-600 hover:underline">hrishikesh.pangarkar@gmail.com</a>.</li>
              <li>The Company reserves the right to refuse, suspend, or permanently revoke registration of any User, without assigning any reason, if the Company determines that the User's presence poses a risk to the Platform, other Users, or the Company's reputation.</li>
            </ul>
          </section>

          {/* 4. Responsibilities of Business Owners */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">4. Responsibilities of Business Owners</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>BOs shall conduct their own independent due diligence on any SP or TPSP before entering into an Engagement. The Platform's search and discovery tools are provided for convenience only and do not constitute an endorsement or background verification of any listed SP or TPSP.</li>
              <li>BOs are solely responsible for negotiating, drafting, and executing any separate commercial agreements with SPs or TPSPs, including but not limited to retainer contracts, commission structures, non-disclosure agreements, and intellectual property assignments.</li>
              <li>BOs acknowledge that the Company <strong>cannot guarantee any specific sales volumes, revenue outcomes, or lead generation results</strong> from any Engagement facilitated through the Platform.</li>
              <li>BOs shall ensure that all business listings, opportunity posts, and any content they publish on the Platform are truthful, lawful, and do not misrepresent the nature, scale, or commercial terms of any opportunity.</li>
              <li>BOs shall not use the Platform to solicit SPs or TPSPs for purposes that are unlawful, unethical, or contrary to applicable law, including but not limited to multi-level marketing, pyramid schemes, or illegal financial instruments.</li>
              <li>BOs shall comply with all applicable laws, including labour laws, GST regulations, and foreign exchange laws (if engaging with overseas SPs), in relation to any Engagement.</li>
            </ul>
          </section>

          {/* 5. Responsibilities of Sales Partners */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">5. Responsibilities of Sales Partners</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>SPs shall maintain a truthful, accurate, and up-to-date Profile, including accurate representation of their experience, geographic coverage, industry specialisation, and availability.</li>
              <li>SPs are independent contractors, not employees or agents of the Company. The Company shall not be liable for any tax obligations (including income tax or GST), statutory compliances, or professional liabilities arising from an SP's activities.</li>
              <li>SPs shall conduct themselves with professional integrity and shall not engage in any conduct that is misleading, fraudulent, or harmful to a BO's business interests.</li>
              <li>SPs acknowledge that their <strong>performance, results, and work quality</strong> in any Engagement are their sole professional responsibility and that the Company cannot be held accountable for any shortfall in their service delivery.</li>
              <li>SPs shall not, directly or indirectly, solicit or poach other SPs, BOs, or TPSPs from the Platform for purposes that circumvent or bypass the Platform's Services, for a period of <strong>12 months</strong> after the termination of their account.</li>
            </ul>
          </section>

          {/* 6. Prohibited Conduct */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">6. Prohibited Conduct</h2>
            <p className="mb-3">All Users are strictly prohibited from engaging in the following conduct on or through the Platform:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Publishing false, misleading, defamatory, obscene, or fraudulent content",
                "Impersonating any person, entity, or brand on the Platform",
                "Using the Platform for pyramid schemes, MLM, or fraudulent investment solicitations",
                "Scraping, crawling, or harvesting any data from the Platform without prior written consent",
                "Reverse engineering, decompiling, or attempting to extract the source code of the Platform",
                "Uploading or transmitting viruses, malware, or any other disruptive or harmful code",
                "Using the Platform to solicit or conduct any activity that is illegal under Indian law",
                "Circumventing the Platform's fee structure by taking discussions entirely off-platform after initial discovery",
                "Posting content that infringes upon any third party's intellectual property, trade secrets, or privacy rights",
                "Engaging in any conduct that may harm, disrupt, or overburden the Platform's technical infrastructure",
              ].map((item) => (
                <div key={item} className="flex gap-2 items-start p-3 bg-red-50 border border-red-100 rounded-lg">
                  <span className="text-red-400 text-base mt-0.5 shrink-0">✕</span>
                  <span className="text-xs">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-3">Violation of any of the above prohibitions may result in immediate account suspension or termination, forfeiture of any credits or pending settlements, and legal action as deemed appropriate by the Company.</p>
          </section>

          {/* 7. Platform Content and Intellectual Property */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">7. Platform Content and Intellectual Property</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>All software, algorithms, UI/UX design, graphics, logos, text, and databases underlying or constituting the Platform are the exclusive intellectual property of Biztribe Trading & Consultancy India Private Limited, protected under the Copyright Act, 1957, the Trade Marks Act, 1999, and applicable Indian and international intellectual property law.</li>
              <li>Users are granted a limited, non-exclusive, non-transferable, revocable licence to access and use the Platform solely for the purposes described in these Terms. No other rights are granted.</li>
              <li>By uploading or publishing any content (Profile information, posts, images, documents) on the Platform, Users grant the Company a worldwide, royalty-free, non-exclusive licence to host, display, reproduce, and distribute such content solely for the purpose of operating the Platform and providing the Services.</li>
              <li>Users represent and warrant that they own or have the necessary licences and rights to all content they upload on the Platform, and that such content does not infringe any third-party intellectual property rights.</li>
              <li>Users hereby grant the Company permission to use their name, company name, and logo for the purpose of identifying them as a current or past user on the Platform and in the Company's marketing materials, unless the User objects to such use in writing.</li>
            </ul>
          </section>

          {/* 8. Payments and Platform Fees */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">8. Payments and Platform Fees</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access to certain features of the Platform may be subject to subscription fees, listing fees, or transaction-based charges as specified in the Company's published pricing schedule, which may be updated from time to time.</li>
              <li>All platform fees are collected through a PCI-DSS compliant payment gateway. The Company does not store raw payment card numbers, UPI PINs, or net banking credentials.</li>
              <li>Applicable Goods and Services Tax (GST) as per Indian tax law shall be levied on all platform fees and shall be borne by the User.</li>
              <li>The Company acts strictly as a technology platform and does <strong>not</strong> facilitate, process, hold in escrow, or settle any commission payments between BOs and SPs. All such financial transactions are the exclusive responsibility of the contracting parties.</li>
              <li>Subscription fees are payable in advance and are subject to the Company's Refund and Cancellation Policy, which is published separately and incorporated herein by reference.</li>
            </ul>
          </section>

          {/* 9. Confidentiality */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">9. Confidentiality and Non-Disclosure</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Users acknowledge that in the course of using the Platform, they may receive or be exposed to Confidential Information of other Users. Users agree to treat all such Confidential Information with strict confidentiality and not to disclose or use it for any purpose beyond the Engagement for which it was shared.</li>
              <li>This confidentiality obligation shall survive the termination of any Engagement or account for a period of <strong>two (2) years</strong> from the date of such termination.</li>
              <li>Confidential Information shall not include information that is already in the public domain, independently developed by the recipient without reference to the disclosing party's information, or required to be disclosed by law or court order.</li>
            </ul>
          </section>

          {/* 10. Limitation of Liability */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">10. Limitation of Liability</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
              <p className="font-semibold text-yellow-800 mb-1">⚠ Important Notice on Liability</p>
              <p className="text-yellow-900 text-xs">Please read this section carefully as it significantly limits the Company's obligations to you.</p>
            </div>
            <ul className="list-disc pl-5 space-y-2">
              <li>To the maximum extent permitted by applicable Indian law, the Company, its directors, officers, employees, affiliates, and agents shall not be liable for any <strong>direct, indirect, incidental, special, consequential, exemplary, or punitive damages</strong>, including but not limited to loss of revenue, loss of business opportunity, loss of profits, loss of goodwill, loss of data, or reputational harm, arising out of or in connection with the use of the Platform or the Services.</li>
              <li>The Company shall not be liable for the conduct, actions, omissions, or representations of any BO, SP, or TPSP, or for any failure by either party to an Engagement to honour the commercial terms of their independent agreement.</li>
              <li>The Company shall not be held responsible for technical failures, server outages, data loss, or service interruptions caused by factors beyond its reasonable control, including force majeure events.</li>
              <li>In any event, the aggregate liability of the Company arising under or in connection with these Terms shall not exceed the <strong>total amount of platform fees actually paid by the User to the Company</strong> in the twelve (12) months preceding the event giving rise to the claim.</li>
            </ul>
          </section>

          {/* 11. Indemnity */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">11. Indemnity</h2>
            <p>You agree to indemnify, defend, and hold harmless Biztribe Trading & Consultancy India Private Limited, its directors, officers, employees, agents, successors, and assigns from and against any and all claims, demands, losses, liabilities, damages, fines, penalties, costs, and expenses (including reasonable legal fees) arising out of or relating to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Your breach of any provision of these Terms;</li>
              <li>Your violation of any applicable law, regulation, or third-party right, including intellectual property rights or privacy rights;</li>
              <li>Any content you upload, publish, or otherwise make available on the Platform;</li>
              <li>Any dispute, claim, or cause of action arising from your Engagement with another User;</li>
              <li>Any misrepresentation made by you in your Profile or in any communication with another User or with the Company.</li>
            </ul>
          </section>

          {/* 12. Disclaimers */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">12. Disclaimer of Warranties</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>The Platform and all Services are provided on an <strong>"as is"</strong> and <strong>"as available"</strong> basis, without any express or implied warranties of any kind, including but not limited to implied warranties of merchantability, fitness for a particular purpose, non-infringement, or uninterrupted access.</li>
              <li>The Company does not warrant that the Platform will always be available, free from errors or viruses, or that any particular feature will function without interruption.</li>
              <li>The Company makes no representation or warranty regarding the accuracy, completeness, or reliability of any Profile information, Post, or Listing published by any User on the Platform.</li>
            </ul>
          </section>

          {/* 13. Force Majeure */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">13. Force Majeure</h2>
            <p>Neither party shall be liable for any failure or delay in performance of its obligations under these Terms (other than payment obligations already due) where such failure or delay results from causes entirely beyond its reasonable control, including but not limited to acts of God, natural disasters, pandemics, epidemics, declared national emergencies, civil unrest, war, government-imposed restrictions, nationwide internet outages, or regulatory actions of the Government of India or any State Government. The affected party shall promptly notify the other party of the Force Majeure event and shall use commercially reasonable efforts to resume performance as soon as practicable.</p>
          </section>

          {/* 14. Termination */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">14. Termination and Suspension</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">A. Termination by the Company</h3>
                <p className="mb-2">The Company reserves the right to immediately suspend or permanently terminate any User's account, with or without prior notice, if the User:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Breaches any provision of these Terms or any applicable law;</li>
                  <li>Provides false, misleading, or fraudulent information during registration or subsequently;</li>
                  <li>Engages in conduct that, in the Company's sole judgment, is harmful to other Users, third parties, or the reputation of the Platform;</li>
                  <li>Uses the Platform for purposes that are illegal, unethical, or contrary to public policy;</li>
                  <li>Fails to pay any applicable platform fees when due.</li>
                </ul>
                <p className="mt-2">Upon termination by the Company, the Company shall not be liable for any loss, damage, or inconvenience suffered by the User as a result of such termination.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">B. Termination by the User</h3>
                <p>A User may terminate their account at any time by submitting a written request to <a href="mailto:hrishikesh.pangarkar@gmail.com" className="text-indigo-600 hover:underline">hrishikesh.pangarkar@gmail.com</a>. Termination shall take effect within 10 business days of receipt of the request. Termination does not relieve the User of any outstanding obligations, including payment obligations or indemnification duties arising from events prior to termination.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">C. Survival of Obligations</h3>
                <p>Clauses 7 (Intellectual Property), 9 (Confidentiality), 10 (Limitation of Liability), 11 (Indemnity), 15 (Dispute Resolution), and 16 (Governing Law) shall survive the termination or expiry of these Terms and continue to bind the parties.</p>
              </div>
            </div>
          </section>

          {/* 15. Dispute Resolution */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">15. Dispute Resolution</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>In the event of any dispute, difference, or claim arising out of or in connection with these Terms, or the breach, termination, or validity thereof ("Dispute"), the aggrieved party shall first issue a written notice of the Dispute to the other party within <strong>45 days</strong> of the Dispute arising.</li>
              <li>Upon receipt of the notice, both parties shall, in good faith, attempt to resolve the Dispute amicably through negotiation for a period of <strong>30 days</strong> from the date of the notice.</li>
              <li>If the Dispute is not resolved within the said 30-day period, either party may refer the Dispute to a mutually agreed upon sole arbitrator, to be conducted in accordance with the <strong>Arbitration and Conciliation Act, 1996</strong>, as amended. The seat and venue of arbitration shall be Pune, Maharashtra. The language of arbitration shall be English.</li>
              <li>The arbitrator's award shall be final and binding on both parties. Nothing in this clause shall preclude either party from seeking urgent interim or injunctive relief from a competent court.</li>
            </ul>
          </section>

          {/* 16. Governing Law */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">16. Governing Law and Jurisdiction</h2>
            <p>These Terms shall be governed by, and construed in accordance with, the laws of the Republic of India, without regard to any conflict of law principles. Subject to the arbitration clause above, the parties irrevocably submit to the exclusive jurisdiction of the courts of Pune, Maharashtra, India, for any matter arising out of or in connection with these Terms that is not subject to arbitration.</p>
          </section>

          {/* 17. General Provisions */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">17. General Provisions</h2>
            <div className="space-y-3">
              {[
                ["Entire Agreement", "These Terms, together with the Privacy Policy and Refund Policy, constitute the entire agreement between the User and the Company and supersede all prior negotiations, representations, or agreements relating to the subject matter hereof."],
                ["Severability", "If any provision of these Terms is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect."],
                ["No Waiver", "The failure of the Company to enforce any right or provision of these Terms shall not constitute a waiver of that right or provision. Any waiver must be in writing and signed by an authorised representative of the Company."],
                ["No Assignment", "Users may not assign, transfer, or sub-licence their rights or obligations under these Terms without the prior written consent of the Company. The Company may freely assign its rights and obligations to a successor entity in a merger or acquisition."],
                ["Notices", "All formal notices under these Terms must be in writing and sent to the Company's registered office address or to the email address specified in these Terms. Notices to Users will be sent to their registered email address on the Platform."],
                ["Amendments", "The Company reserves the right to modify these Terms at any time. Amendments will be notified via email or a prominent notice on the Platform at least 15 days before taking effect. Continued use of the Platform after the effective date of the amended Terms constitutes acceptance."],
              ].map(([title, desc]) => (
                <div key={title} className="border border-gray-100 rounded-lg p-4">
                  <p className="font-semibold text-gray-800 mb-1">{title}</p>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">18. Contact Information</h2>
            <p className="mb-4">For any questions, concerns, or grievances relating to these Terms, please contact:</p>
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 space-y-2">
              <p><strong>Company:</strong> Biztribe Trading & Consultancy India Private Limited</p>
              <p><strong>Brand:</strong> Fractional Sales Partner</p>
              <p><strong>Registered Address:</strong> B-1001, Kapil Akhila, Pancard Club Road, Baner, Pune – 411 045, Maharashtra, India</p>
              <p><strong>Grievance Contact:</strong> Hrishikesh Pangarkar</p>
              <p><strong>Email:</strong> <a href="mailto:hrishikesh.pangarkar@gmail.com" className="text-indigo-600 hover:underline">hrishikesh.pangarkar@gmail.com</a></p>
              <p><strong>Response Time:</strong> We shall acknowledge all written queries within 48 hours and aim to resolve grievances within 30 business days.</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
