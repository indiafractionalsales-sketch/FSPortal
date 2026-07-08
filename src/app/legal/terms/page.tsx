export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 py-20">
      <div className="container mx-auto px-4 max-w-4xl font-sans">
        <h1 className="font-serif font-bold text-4xl mb-2">Terms and Conditions</h1>
        <p className="text-gray-500 text-sm mb-1">
          Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        <p className="text-gray-400 text-xs mb-10">Version 2.0</p>

        <div className="space-y-8 text-gray-700 leading-relaxed text-sm">

          {/* Preamble */}
          <section className="bg-gray-50 border-l-4 border-gray-800 p-5 rounded-r-lg">
            <p>
              These Terms and Conditions (&quot;Agreement&quot; or &quot;Terms&quot;) constitute a legally binding contract between <strong>Biztribe Trading &amp; Consultancy India Private Limited</strong> (&quot;Company&quot;, &quot;We&quot;, &quot;Us&quot;, or &quot;Our&quot;), a company incorporated under the Companies Act, 2013, having its registered office at B-1001, Kapil Akhila, Pancard Club Road, Baner, Pune – 411 045, Maharashtra, India, and any individual or legal entity (&quot;User&quot;, &quot;You&quot;, or &quot;Your&quot;) who registers on, accesses, or uses the platform operating under the brand name <strong>&quot;Fractional Sales Partner&quot;</strong> at <strong>fractionalsales.com</strong> (&quot;Platform&quot;) or any associated web application, mobile application, API, or service (collectively, &quot;Services&quot;).
            </p>
            <p className="mt-3">
              By clicking &quot;I Agree&quot;, registering an account, or by accessing or using any part of the Services, you confirm that you have read, understood, and irrevocably agree to be bound by these Terms and our Privacy Policy and Refund Policy, which are incorporated herein by reference. <strong>If you do not agree to these Terms, you must immediately cease use of the Platform.</strong>
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
                ["Paid Features", "Features, tools, and services offered on a paid basis, including but not limited to payment processing, AI-powered Smart Networking, AI-powered business card scanning, and any other features designated as paid by the Company from time to time."],
                ["Brand Assets", "Any company logo, brand name, trademark, trade name, service mark, brand insignia, brand imagery, or any other brand-identifying asset uploaded by the User to the Platform."],
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
              <li>Each User is solely responsible for maintaining the confidentiality and security of their account credentials. Any activity that occurs under a User{"'"}s account is deemed to be the act of that User.</li>
              <li>Users must immediately notify the Company of any suspected unauthorised access to or breach of their account at <a href="mailto:sales@fractionalsalespartner.com" className="text-indigo-600 hover:underline">sales@fractionalsalespartner.com</a>.</li>
              <li>The Company reserves the right to refuse, suspend, or permanently revoke registration of any User, without assigning any reason, if the Company determines that the User{"'"}s presence poses a risk to the Platform, other Users, or the Company{"'"}s reputation.</li>
            </ul>
          </section>

          {/* 4. Responsibilities of Business Owners */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">4. Responsibilities of Business Owners</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>BOs shall conduct their own independent due diligence on any SP or TPSP before entering into an Engagement. The Platform{"'"}s search and discovery tools are provided for convenience only and do not constitute an endorsement or background verification of any listed SP or TPSP.</li>
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
              <li>SPs are independent contractors, not employees or agents of the Company. The Company shall not be liable for any tax obligations (including income tax or GST), statutory compliances, or professional liabilities arising from an SP{"'"}s activities.</li>
              <li>SPs shall conduct themselves with professional integrity and shall not engage in any conduct that is misleading, fraudulent, or harmful to a BO{"'"}s business interests.</li>
              <li>SPs acknowledge that their <strong>performance, results, and work quality</strong> in any Engagement are their sole professional responsibility and that the Company cannot be held accountable for any shortfall in their service delivery.</li>
              <li>SPs shall not, directly or indirectly, solicit or poach other SPs, BOs, or TPSPs from the Platform for purposes that circumvent or bypass the Platform{"'"}s Services, for a period of <strong>12 months</strong> after the termination of their account.</li>
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
              <li>All software, algorithms, UI/UX design, graphics, logos, text, and databases underlying or constituting the Platform are the exclusive intellectual property of Biztribe Trading &amp; Consultancy India Private Limited, protected under the Copyright Act, 1957, the Trade Marks Act, 1999, and applicable Indian and international intellectual property law.</li>
              <li>Users are granted a limited, non-exclusive, non-transferable, revocable licence to access and use the Platform solely for the purposes described in these Terms. No other rights are granted.</li>
              <li>By uploading or publishing any content (Profile information, posts, images, documents) on the Platform, Users grant the Company a worldwide, royalty-free, non-exclusive licence to host, display, reproduce, and distribute such content solely for the purpose of operating the Platform and providing the Services.</li>
              <li>Users represent and warrant that they own or have the necessary licences and rights to all content they upload on the Platform, and that such content does not infringe any third-party intellectual property rights.</li>
              <li>Users hereby grant the Company permission to use their name, company name, and logo for the purpose of identifying them as a current or past user on the Platform and in the Company{"'"}s marketing materials, unless the User objects to such use in writing.</li>
            </ul>
          </section>

          {/* 8. Payments, Platform Fees, and Paid Features */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">8. Payments, Platform Fees, and Paid Features</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">8.1 Paid Features and Variable Pricing</h3>
                <p>The Platform offers certain features, tools, and services on a paid basis, including but not limited to: (a) payment processing and commission settlement services for Business Owners engaging Sales Partners; (b) AI-powered Smart Networking functionality, which provides Users with an intelligent conversational interface to query and analyse their lead database; (c) AI-powered business card and contact scanning services; and (d) any other features designated as paid features by the Company from time to time (collectively, {'"'}Paid Features{'"'}). The User acknowledges and agrees that the pricing, fee structures, and charges applicable to Paid Features are determined solely by the Company and are subject to change at any time, at the Company{"'"}s absolute discretion, without prior notice. The applicable charges shall be those displayed on the Platform at the time the User accesses or utilises the relevant Paid Feature. By utilising any Paid Feature, the User irrevocably agrees to pay the charges as displayed at the time of use. It is the User{"'"}s sole responsibility to review the applicable charges before initiating use of any Paid Feature.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">8.2 Non-Payment and Access Restriction</h3>
                <p>In the event that a User fails to make any payment due to the Company in respect of Paid Features, subscription fees, or any other charges, the Company reserves the absolute and unconditional right to: (a) immediately suspend, restrict, or permanently terminate the User{"'"}s access to the Platform and all Services, without prior notice; (b) withhold, forfeit, or set off any pending settlements, commissions, or credits due to the User; and (c) pursue recovery of the outstanding amounts through all available legal remedies, including but not limited to filing a civil suit for recovery of money, initiating arbitration proceedings, and/or referring the matter to a debt recovery agency. The User shall additionally be liable for all costs of collection, including reasonable legal fees and expenses.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">8.3 Platform Fees and Commission Deductions</h3>
                <p>Where the Company facilitates payment processing between a Business Owner and a Sales Partner, the Company shall deduct a Platform Commission from each transaction at the rate specified on the Platform at the time of the transaction (which may include, but is not limited to, a percentage-based platform service fee). The remaining balance, after deduction of the Platform Commission and any applicable taxes, shall constitute the Sales Partner{"'"}s Net Payout. The Sales Partner acknowledges and agrees that the Net Payout amount as determined by the Company shall be final and binding. The Sales Partner{"'"}s sole remedy, in the event of disagreement with the Net Payout, is to decline the task or engagement prior to acceptance. Once a task or engagement is accepted by the Sales Partner, the Sales Partner shall be deemed to have irrevocably accepted the Platform Commission structure and the resulting Net Payout.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">8.4 Payment Processing Timeline</h3>
                <p>Payments to Sales Partners shall be processed within seven (7) business days from the date the corresponding Business Owner{"'"}s payment is successfully received and cleared by the Company. In the event of any delay in payment processing, the Sales Partner may contact the Company at <a href="mailto:sales@fractionalsalespartner.com" className="text-indigo-600 hover:underline">sales@fractionalsalespartner.com</a> for resolution. The Company shall use commercially reasonable efforts to resolve payment delays within a further period of ten (10) business days from the date of receipt of the complaint. The Company shall not be liable for delays caused by banking systems, payment gateways, regulatory holds, or force majeure events.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">8.5 GST and Tax Compliance</h3>
                <p>All fees, charges, and commissions quoted on the Platform are exclusive of applicable Goods and Services Tax (GST) and any other taxes or duties levied under Indian or international tax law, unless expressly stated otherwise. All applicable taxes shall be borne by the User and shall be charged in addition to the stated fees at the prevailing statutory rate.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">8.6 Payment Gateway</h3>
                <p>All payments are collected through PCI-DSS compliant payment gateways. The Company does not store raw payment card numbers, UPI PINs, or net banking credentials. The Company shall not be liable for any payment failures, declines, or errors caused by third-party payment processors.</p>
              </div>
            </div>
          </section>

          {/* 9. Data Ownership and Platform Rights */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">9. Data Ownership and Platform Rights</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">9.1 Platform Data Ownership</h3>
                <p>All data generated, uploaded, submitted, or otherwise provided by Users on or through the Platform — including but not limited to profile information, business listings, lead databases, transaction records, engagement histories, communications, analytics, and any derivative data generated by the Platform{"'"}s algorithms or AI features — shall be owned exclusively by Biztribe Trading &amp; Consultancy India Private Limited. The User hereby irrevocably assigns, transfers, and conveys to the Company all right, title, and interest (including all intellectual property rights) in and to all such data, to the maximum extent permitted by applicable law. Where assignment is not permitted by law, the User grants the Company an irrevocable, perpetual, worldwide, royalty-free, fully sub-licensable licence to use, reproduce, modify, distribute, display, and create derivative works from such data for any purpose.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">9.2 Right to Represent, Display, and Share User Information</h3>
                <p>The User grants the Company an unrestricted, irrevocable, worldwide, royalty-free right and licence to: (a) represent the User and their business on the Platform and in the Company{"'"}s marketing, promotional, and business development materials across all media; (b) publicly display the User{"'"}s Personally Identifiable Information ({'"'}PII{'"'}), including but not limited to name, photograph, company name, logo, designation, contact details, professional experience, and any other information submitted by the User during registration or profile creation; and (c) share the User{"'"}s PII with relevant Users, prospective business partners, Sales Partners, Business Owners, Third Party Service Providers, and any other parties as the Company deems necessary for the fulfilment of the Platform{"'"}s commercial objectives. The User acknowledges that the foregoing rights are essential to the operation of the Platform and waives any claim for compensation, damages, or injunctive relief arising from the Company{"'"}s exercise of these rights.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">9.3 Unrestricted Licence for Uploaded Brand Assets</h3>
                <p>By uploading, submitting, or otherwise providing any company logo, brand name, trademark, trade name, service mark, brand insignia, brand imagery, or any other brand-identifying asset (collectively, {'"'}Brand Assets{'"'}) to the Platform — whether during the registration process, profile creation, listing publication, or at any other time — the User hereby grants the Company an irrevocable, perpetual, worldwide, royalty-free, fully sub-licensable, and unrestricted licence to use, reproduce, display, publish, distribute, modify, adapt, resize, reformat, and create derivative works from such Brand Assets, in any manner, in any medium, and in any context, without limitation as to placement, positioning, page, section, feature, or area of the Platform. Without limiting the generality of the foregoing, the Company may display, feature, or incorporate such Brand Assets on: (a) the User{"'"}s own profile page; (b) search results, discovery feeds, recommendation engines, and partner-matching interfaces; (c) the Platform{"'"}s homepage, landing pages, marketing pages, and promotional banners; (d) email communications, newsletters, and push notifications sent by the Platform; (e) social media accounts, advertisements, and external marketing campaigns operated by or on behalf of the Company; (f) investor presentations, pitch decks, business proposals, and corporate communications; and (g) any other page, interface, material, or medium as the Company deems fit in its sole discretion. The User represents and warrants that it has full authority and all necessary rights to grant the foregoing licence with respect to all Brand Assets uploaded to the Platform, and agrees to indemnify and hold harmless the Company from any claim arising from a breach of this warranty.</p>
              </div>
            </div>
          </section>

          {/* 10. Data Storage, Processing, and Cross-Border Transfers */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">10. Data Storage, Processing, and Cross-Border Transfers</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">10.1 Server Locations and Cross-Border Processing</h3>
                <p>The User acknowledges and expressly consents to the storage, processing, and transmission of their personal data — including PII, financial data, and behavioural data — on servers and computing infrastructure located in multiple jurisdictions worldwide, including but not limited to: the Republic of India, the Kingdom of the Netherlands, member states of the European Union, the United States of America, and such other jurisdictions as the Company may utilise from time to time for the purpose of providing the Services.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">10.2 Applicable Data Protection Frameworks</h3>
                <p>The Company shall process personal data in accordance with the applicable data protection laws of the jurisdiction in which the data is processed, which may include the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023 (India), the General Data Protection Regulation (EU) 2016/679 (GDPR), the UK Data Protection Act 2018, and such other laws as may be applicable.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">10.3 User Consent to Transfers</h3>
                <p>By registering on the Platform and accepting these Terms, the User provides explicit, informed, and unambiguous consent to the cross-border transfer and processing of their personal data as described herein. The User acknowledges that data protection standards may vary across jurisdictions and agrees that the Company shall not be liable for any data protection standards applicable in the User{"'"}s country of residence that differ from those in the jurisdiction where the data is processed.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">10.4 Disclaimer of Liability for Data Loss</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
                  <p className="font-semibold text-yellow-800 mb-1">⚠ Important Notice on Data Loss</p>
                  <p className="text-yellow-900 text-xs">Please read this section carefully as it limits the Company{"'"}s obligations regarding data preservation.</p>
                </div>
                <p>To the maximum extent permitted by applicable law, neither Biztribe Trading &amp; Consultancy India Private Limited, nor the brand {'"'}Fractional Sales Partner{'"'}, nor any director, officer, employee, agent, contractor, consultant, or representative of the Company (collectively, {'"'}Company Parties{'"'}) shall be responsible, liable, or accountable for any loss, corruption, destruction, unavailability, or unauthorised access to any data — including but not limited to User data, profile information, lead databases, transaction records, uploaded content, communications, or any other information stored on or processed through the Platform — howsoever caused, whether arising from: (a) hardware or software failures, server outages, or infrastructure malfunctions; (b) cyberattacks, hacking, ransomware, data breaches, or other security incidents; (c) acts or omissions of third-party hosting providers, cloud infrastructure providers, or payment gateway operators; (d) natural disasters, force majeure events, or governmental actions; (e) scheduled or unscheduled maintenance, system upgrades, or data migration activities; or (f) any other cause beyond the reasonable control of the Company. The User acknowledges that it is the User{"'"}s sole responsibility to maintain independent backups of all critical data and that the Company provides no guarantee of data availability, persistence, recoverability, or integrity. The User expressly waives any and all claims against the Company Parties for damages, losses, or expenses arising from data loss or data unavailability.</p>
              </div>
            </div>
          </section>

          {/* 11. User-Generated Content and Copyright Liability */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">11. User-Generated Content and Copyright Liability</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">11.1 User Responsibility for Uploaded Content</h3>
                <p>The User represents, warrants, and undertakes that all content uploaded, published, submitted, or otherwise made available by the User on or through the Platform — including but not limited to images, photographs, audio recordings, video recordings, voice recordings, documents, text, logos, trademarks, creative works, and any other artefacts or materials (collectively, {'"'}User Content{'"'}) — is either: (a) original work created by the User; or (b) used with the express, documented authorisation, licence, or consent of the rightful copyright holder, trademark owner, or other intellectual property rights holder.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">11.2 Indemnification for Copyright Infringement</h3>
                <p>In the event that any User Content uploaded by the User infringes upon, misappropriates, or otherwise violates the intellectual property rights, copyrights, trademarks, rights of publicity, right of privacy, moral rights, or any other proprietary rights of any third party, the User shall be solely and exclusively liable for all claims, demands, damages, losses, liabilities, penalties, costs, and expenses (including reasonable legal fees) arising therefrom. The Company expressly disclaims any and all liability, responsibility, and obligation in connection with such infringement. The User agrees to indemnify, defend, and hold harmless the Company and its directors, officers, employees, agents, and affiliates from any and all such claims.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">11.3 Platform Right to Remove Infringing Content</h3>
                <p>The Company reserves the right, but shall have no obligation, to review, monitor, or remove any User Content that the Company, in its sole discretion, believes to infringe upon the rights of any third party or to violate these Terms, without prior notice to the User and without liability.</p>
              </div>
            </div>
          </section>

          {/* 12. Inter-Party Disputes and Platform Non-Liability */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">12. Inter-Party Disputes and Platform Non-Liability</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">12.1 No Platform Liability for Inter-Party Disputes</h3>
                <p>The User acknowledges and agrees that the Platform serves exclusively as a technology-driven marketplace and facilitator of introductions between Business Owners, Sales Partners, and Third Party Service Providers. The Company is not a party to, and shall bear no responsibility or liability whatsoever for, any commercial agreement, arrangement, understanding, commitment, representation, or promise — whether written, verbal, electronic, or implied — entered into between a Business Owner and a Sales Partner, between a Business Owner and a Third Party Service Provider, or between any Users of the Platform.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">12.2 Disclaimer of Liability for Commitments</h3>
                <p>Without limiting the generality of Clause 12.1, the Company shall not be responsible for: (a) any loss of payment, revenue, commission, or financial expectation arising from a dispute between parties to an Engagement; (b) any loss of reputation, goodwill, personal image, or professional standing suffered by a User as a result of the actions, omissions, or representations of another User; (c) any failure by either party to an Engagement to honour their written or verbal commitments, performance targets, delivery timelines, quality standards, or any other undertaking; or (d) any consequential, incidental, special, or punitive damages arising from the foregoing.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">12.3 Sales Partner Task Acceptance</h3>
                <p>Prior to accepting any task, engagement, or assignment offered through the Platform, a Sales Partner shall have the right to review the terms, compensation structure, and scope of the engagement. By accepting the task, the Sales Partner shall be deemed to have irrevocably agreed to the compensation amount and terms as finalised by the Platform or the Business Owner. The Sales Partner{"'"}s sole remedy for dissatisfaction with the compensation terms is to reject the task prior to acceptance. No claim for additional compensation, adjustment, or renegotiation shall be entertained after acceptance.</p>
              </div>
            </div>
          </section>

          {/* 13. Brand Protection and Defamation */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">13. Brand Protection and Defamation</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">13.1 Prohibition of Defamatory Conduct</h3>
                <p>Any activity, conduct, statement, publication, or communication — whether online, offline, written, verbal, electronic, or through any medium — by a User or any person acting on behalf of a User, which directly or indirectly: (a) defames, disparages, maligns, tarnishes, or brings into disrepute the brand name {'"'}Fractional Sales Partner{'"'}; (b) defames, disparages, maligns, tarnishes, or brings into disrepute the corporate name, goodwill, or reputation of Biztribe Trading &amp; Consultancy India Private Limited; or (c) defames, disparages, maligns, threatens, harasses, intimidates, or brings into disrepute any director, officer, employee, agent, contractor, or representative of either Fractional Sales Partner or Biztribe Trading &amp; Consultancy India Private Limited, shall constitute a material breach of these Terms and shall be treated as a legal offence actionable under applicable civil and criminal law.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">13.2 Legal Consequences</h3>
                <p>In the event of any violation of Clause 13.1, the Company reserves the right to: (a) immediately and permanently terminate the offending User{"'"}s account without notice or refund; (b) pursue civil remedies including but not limited to injunctive relief, damages (including exemplary and punitive damages), and recovery of legal costs, in the competent courts of the Republic of India (including but not limited to courts in Pune, Maharashtra), the United Kingdom, the United States of America, and/or any member state of the European Union, as deemed appropriate by the Company; and (c) initiate criminal proceedings under the applicable provisions of the Indian Penal Code, 1860 (including Sections 499 and 500 relating to defamation), the Information Technology Act, 2000 (including Section 66A and related provisions), and any other applicable law in any jurisdiction in which the defamatory conduct occurred or had its effect.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">13.3 Preservation of Evidence</h3>
                <p>The Company reserves the right to preserve, archive, and produce as evidence in legal proceedings any and all Platform data, communications, access logs, and transactional records related to the offending User{"'"}s account and activities on the Platform.</p>
              </div>
            </div>
          </section>

          {/* 14. Proprietary Business Model and Source Code Protection */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">14. Proprietary Business Model and Source Code Protection</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
              <p className="font-semibold text-yellow-800 mb-1">⚠ Important Notice on Intellectual Property</p>
              <p className="text-yellow-900 text-xs">Please read this section carefully. Violation of this section constitutes a criminal offence.</p>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">14.1 Proprietary Nature of the Platform</h3>
                <p>The User acknowledges and agrees that the Platform — including but not limited to its entire source code, software architecture, system design, database schemas, application programming interfaces (APIs), algorithms, machine learning models, artificial intelligence systems, data processing pipelines, user interface designs, user experience workflows, business logic, business processes, operational methodologies, commercial strategies, revenue models, commission structures, partner matching frameworks, and the overall business model of the fractional sales marketplace (collectively, {'"'}Proprietary Assets{'"'}) — constitutes confidential, proprietary, and trade-secret information exclusively owned by Biztribe Trading &amp; Consultancy India Private Limited, protected under the Copyright Act, 1957, the Trade Marks Act, 1999, the Information Technology Act, 2000, the Indian Contract Act, 1872, and all applicable Indian and international intellectual property and trade secret laws.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">14.2 Prohibition of Duplication, Copying, and Reverse Engineering</h3>
                <p>The User shall not, directly or indirectly, and shall not permit, authorise, assist, encourage, or facilitate any third party to: (a) copy, reproduce, duplicate, replicate, clone, or create derivative works of any Proprietary Asset, in whole or in part; (b) reverse engineer, decompile, disassemble, decode, decrypt, or otherwise attempt to derive or extract the source code, underlying algorithms, data structures, or business logic of the Platform or any component thereof; (c) develop, design, build, launch, operate, or participate in any competing platform, application, service, or business that substantially replicates, imitates, or is derived from the business model, feature set, operational methodology, or commercial strategy of the Platform; (d) use knowledge, insights, or information gained through the use of the Platform to create a substantially similar or competing product or service; or (e) engage in any other activity that infringes upon, misappropriates, or violates the Company{"'"}s intellectual property rights, trade secrets, or proprietary interests.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">14.3 Legal Consequences of Infringement</h3>
                <p>Any violation of Clause 14.2 shall constitute a material breach of these Terms and shall be treated as a civil and criminal offence under applicable law. In the event of any such violation, the Company shall be entitled to: (a) seek immediate injunctive and restraining relief from any competent court of law to prevent further infringement; (b) pursue civil claims for damages, including actual damages, lost profits, exemplary damages, punitive damages, and statutory damages, as applicable under the Copyright Act, 1957, the Information Technology Act, 2000, and other applicable Indian and international intellectual property statutes; (c) initiate criminal prosecution under: (i) Sections 63, 63A, and 63B of the Copyright Act, 1957 (criminal penalties for copyright infringement); (ii) Sections 43 and 66 of the Information Technology Act, 2000 (penalties for unauthorised access and computer-related offences); (iii) Sections 378, 379, and 381 of the Indian Penal Code, 1860 / Bharatiya Nyaya Sanhita, 2023 (theft of intellectual property and trade secrets); and (iv) any other applicable criminal statute in the Republic of India, the United Kingdom, the United States of America, or any member state of the European Union; and (d) claim recovery of all legal costs, attorney fees, investigative expenses, and forensic audit costs incurred in connection with the detection, investigation, and prosecution of the infringement.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">14.4 Survival</h3>
                <p>The obligations and restrictions set forth in this Section 14 shall survive the termination or expiry of these Terms and the User{"'"}s account, and shall remain in full force and effect indefinitely.</p>
              </div>
            </div>
          </section>

          {/* 15. Confidentiality */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">15. Confidentiality and Non-Disclosure</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Users acknowledge that in the course of using the Platform, they may receive or be exposed to Confidential Information of other Users. Users agree to treat all such Confidential Information with strict confidentiality and not to disclose or use it for any purpose beyond the Engagement for which it was shared.</li>
              <li>This confidentiality obligation shall survive the termination of any Engagement or account for a period of <strong>two (2) years</strong> from the date of such termination.</li>
              <li>Confidential Information shall not include information that is already in the public domain, independently developed by the recipient without reference to the disclosing party{"'"}s information, or required to be disclosed by law or court order.</li>
            </ul>
          </section>

          {/* 16. Limitation of Liability */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">16. Limitation of Liability</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
              <p className="font-semibold text-yellow-800 mb-1">⚠ Important Notice on Liability</p>
              <p className="text-yellow-900 text-xs">Please read this section carefully as it significantly limits the Company{"'"}s obligations to you.</p>
            </div>
            <ul className="list-disc pl-5 space-y-2">
              <li>To the maximum extent permitted by applicable Indian law, the Company, its directors, officers, employees, affiliates, and agents shall not be liable for any <strong>direct, indirect, incidental, special, consequential, exemplary, or punitive damages</strong>, including but not limited to loss of revenue, loss of business opportunity, loss of profits, loss of goodwill, loss of data, or reputational harm, arising out of or in connection with the use of the Platform or the Services.</li>
              <li>The Company shall not be liable for the conduct, actions, omissions, or representations of any BO, SP, or TPSP, or for any failure by either party to an Engagement to honour the commercial terms of their independent agreement.</li>
              <li>The Company shall not be held responsible for technical failures, server outages, data loss, or service interruptions caused by factors beyond its reasonable control, including force majeure events.</li>
              <li>In any event, the aggregate liability of the Company arising under or in connection with these Terms shall not exceed the <strong>total amount of platform fees actually paid by the User to the Company</strong> in the twelve (12) months preceding the event giving rise to the claim.</li>
            </ul>
          </section>

          {/* 17. Indemnity */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">17. Indemnity</h2>
            <p>You agree to indemnify, defend, and hold harmless Biztribe Trading &amp; Consultancy India Private Limited, its directors, officers, employees, agents, successors, and assigns from and against any and all claims, demands, losses, liabilities, damages, fines, penalties, costs, and expenses (including reasonable legal fees) arising out of or relating to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Your breach of any provision of these Terms;</li>
              <li>Your violation of any applicable law, regulation, or third-party right, including intellectual property rights or privacy rights;</li>
              <li>Any content you upload, publish, or otherwise make available on the Platform;</li>
              <li>Any dispute, claim, or cause of action arising from your Engagement with another User;</li>
              <li>Any misrepresentation made by you in your Profile or in any communication with another User or with the Company.</li>
            </ul>
          </section>

          {/* 18. Disclaimers */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">18. Disclaimer of Warranties</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>The Platform and all Services are provided on an <strong>&quot;as is&quot;</strong> and <strong>&quot;as available&quot;</strong> basis, without any express or implied warranties of any kind, including but not limited to implied warranties of merchantability, fitness for a particular purpose, non-infringement, or uninterrupted access.</li>
              <li>The Company does not warrant that the Platform will always be available, free from errors or viruses, or that any particular feature will function without interruption.</li>
              <li>The Company makes no representation or warranty regarding the accuracy, completeness, or reliability of any Profile information, Post, or Listing published by any User on the Platform.</li>
            </ul>
          </section>

          {/* 19. Force Majeure */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">19. Force Majeure</h2>
            <p>Neither party shall be liable for any failure or delay in performance of its obligations under these Terms (other than payment obligations already due) where such failure or delay results from causes entirely beyond its reasonable control, including but not limited to acts of God, natural disasters, pandemics, epidemics, declared national emergencies, civil unrest, war, government-imposed restrictions, nationwide internet outages, or regulatory actions of the Government of India or any State Government. The affected party shall promptly notify the other party of the Force Majeure event and shall use commercially reasonable efforts to resume performance as soon as practicable.</p>
          </section>

          {/* 20. Termination */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">20. Termination and Suspension</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">A. Termination by the Company</h3>
                <p className="mb-2">The Company reserves the right to immediately suspend or permanently terminate any User{"'"}s account, with or without prior notice, if the User:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Breaches any provision of these Terms or any applicable law;</li>
                  <li>Provides false, misleading, or fraudulent information during registration or subsequently;</li>
                  <li>Engages in conduct that, in the Company{"'"}s sole judgment, is harmful to other Users, third parties, or the reputation of the Platform;</li>
                  <li>Uses the Platform for purposes that are illegal, unethical, or contrary to public policy;</li>
                  <li>Fails to pay any applicable platform fees when due.</li>
                </ul>
                <p className="mt-2">Upon termination by the Company, the Company shall not be liable for any loss, damage, or inconvenience suffered by the User as a result of such termination.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">B. Termination by the User</h3>
                <p>A User may terminate their account at any time by submitting a written request to <a href="mailto:sales@fractionalsalespartner.com" className="text-indigo-600 hover:underline">sales@fractionalsalespartner.com</a>. Termination shall take effect within 10 business days of receipt of the request. Termination does not relieve the User of any outstanding obligations, including payment obligations or indemnification duties arising from events prior to termination.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">C. Survival of Obligations</h3>
                <p>Clauses 7 (Intellectual Property), 9 (Data Ownership), 14 (Proprietary Business Model), 15 (Confidentiality), 16 (Limitation of Liability), 17 (Indemnity), 21 (Dispute Resolution), and 22 (Governing Law) shall survive the termination or expiry of these Terms and continue to bind the parties.</p>
              </div>
            </div>
          </section>

          {/* 21. Dispute Resolution */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">21. Dispute Resolution</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>In the event of any dispute, difference, or claim arising out of or in connection with these Terms, or the breach, termination, or validity thereof ({'"'}Dispute{'"'}), the aggrieved party shall first issue a written notice of the Dispute to the other party within <strong>45 days</strong> of the Dispute arising.</li>
              <li>Upon receipt of the notice, both parties shall, in good faith, attempt to resolve the Dispute amicably through negotiation for a period of <strong>30 days</strong> from the date of the notice.</li>
              <li>If the Dispute is not resolved within the said 30-day period, either party may refer the Dispute to a mutually agreed upon sole arbitrator, to be conducted in accordance with the <strong>Arbitration and Conciliation Act, 1996</strong>, as amended. The seat and venue of arbitration shall be Pune, Maharashtra. The language of arbitration shall be English.</li>
              <li>The arbitrator{"'"}s award shall be final and binding on both parties. Nothing in this clause shall preclude either party from seeking urgent interim or injunctive relief from a competent court.</li>
            </ul>
          </section>

          {/* 22. Governing Law */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">22. Governing Law and Jurisdiction</h2>
            <p>These Terms shall be governed by, and construed in accordance with, the laws of the Republic of India, without regard to any conflict of law principles. Subject to the arbitration clause above, the parties irrevocably submit to the exclusive jurisdiction of the courts of Pune, Maharashtra, India, for any matter arising out of or in connection with these Terms that is not subject to arbitration.</p>
          </section>

          {/* 23. General Provisions */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">23. General Provisions</h2>
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

          {/* 24. Contact */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">24. Contact Information</h2>
            <p className="mb-4">For any questions, concerns, or grievances relating to these Terms, please contact:</p>
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 space-y-2">
              <p><strong>Company:</strong> Biztribe Trading &amp; Consultancy India Private Limited</p>
              <p><strong>Brand:</strong> Fractional Sales Partner</p>
              <p><strong>Registered Address:</strong> B-1001, Kapil Akhila, Pancard Club Road, Baner, Pune – 411 045, Maharashtra, India</p>
              <p><strong>Grievance Contact:</strong> Hrishikesh Pangarkar</p>
              <p><strong>Email:</strong> <a href="mailto:sales@fractionalsalespartner.com" className="text-indigo-600 hover:underline">sales@fractionalsalespartner.com</a></p>
              <p><strong>Response Time:</strong> We shall acknowledge all written queries within 48 hours and aim to resolve grievances within 30 business days.</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
