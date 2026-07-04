export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 py-20">
      <div className="container mx-auto px-4 max-w-4xl font-sans">
        <h1 className="font-serif font-bold text-4xl mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>

        <div className="space-y-8 text-gray-700 leading-relaxed text-sm">

          {/* Preamble */}
          <section className="bg-gray-50 border-l-4 border-gray-800 p-5 rounded-r-lg">
            <p>
              This Privacy Policy ("Policy") is published by <strong>Biztribe Trading & Consultancy India Private Limited</strong> ("Company", "We", "Us", or "Our"), a company incorporated under the Companies Act, 2013, having its registered office at B-1001, Kapil Akhila, Pancard Club Road, Baner, Pune – 411 045, Maharashtra, India.
            </p>
            <p className="mt-3">
              This Policy governs the collection, receipt, possession, storage, handling, usage, processing, disclosure, transfer, and protection of Personal Data ("Personal Data") of all individuals ("Data Principals") who access or use the platform operating at <strong>fractionalsales.com</strong> ("Platform") or any associated mobile applications, APIs, or services (collectively, "Services").
            </p>
            <p className="mt-3">
              This Policy is compliant with the <strong>Digital Personal Data Protection Act, 2023 ("DPDPA 2023")</strong>, the <strong>Information Technology Act, 2000</strong> and its associated Rules, including the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 ("SPDI Rules"), and all other applicable Indian laws. This Policy is to be read in conjunction with our Terms and Conditions.
            </p>
            <p className="mt-3 font-semibold">By using our Services, you consent to the collection and use of your information as described in this Policy.</p>
          </section>

          {/* 1. Definitions */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">1. Definitions</h2>
            <p className="mb-2">For the purpose of this Policy, unless the context otherwise requires:</p>
            <ul className="space-y-2 pl-0">
              {[
                ["Data Fiduciary", "means the Company, which determines the purpose and means of processing Personal Data."],
                ["Data Principal", "means the natural person to whom the Personal Data relates. In the context of a minor, the term includes the parent or lawful guardian."],
                ["Personal Data", "means any data about an individual who is identifiable by or in relation to such data. This includes but is not limited to name, email address, phone number, employment details, and financial information."],
                ["Sensitive Personal Data or Information (SPDI)", "means Personal Data consisting of passwords, financial information (bank account, credit/debit card), physical, physiological, and mental health conditions, biometric data, and any detail relating to the above as provided to the Company."],
                ["Processing", "means any automated or manual operation or set of operations performed upon Personal Data, including collection, recording, storage, use, disclosure, or erasure."],
                ["Consent", "means a free, specific, informed, unconditional, and unambiguous indication of the Data Principal's wishes by a clear affirmative action."],
              ].map(([term, def]) => (
                <li key={term} className="flex gap-3 py-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-800 min-w-[180px]">{term}:</span>
                  <span>{def}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 2. Data Infrastructure & Localisation */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">2. Data Infrastructure and Data Localisation</h2>
            <p className="mb-3">
              The Company is fully committed to the data localisation principles embedded in Indian data protection law. Our infrastructure is architected as follows:
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2 mb-4">
              <p className="font-semibold text-green-800">🇮🇳 India-First Data Architecture</p>
              <ul className="list-disc pl-5 space-y-2 text-green-900">
                <li><strong>Primary User Data Store:</strong> All Personal Data of Indian users is stored in Google Cloud Firestore databases hosted within <strong>data centres physically located in Mumbai, India (asia-south1 region)</strong>. This ensures your data never leaves Indian sovereign territory for primary storage.</li>
                <li><strong>Regional Isolation:</strong> User profiles, engagement data, business listings, and all identifiable information are segregated into region-specific databases. Data created and managed by Indian Business Owners and Sales Partners remains within the Indian boundary.</li>
                <li><strong>Service Infrastructure:</strong> The Company uses Google Cloud Platform, which has committed to compliance with Indian data protection regulations.</li>
              </ul>
            </div>
            <p>
              For any Personal Data that may be accessed or processed outside India (e.g., by an Overseas Business Owner interacting with an Indian Sales Partner's profile), such access is governed by appropriate contractual safeguards and the explicit consent of the Data Principal. We do not sell or transfer Indian residents' Personal Data to foreign entities for independent processing.
            </p>
          </section>

          {/* 3. What We Collect */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">3. Categories of Personal Data Collected</h2>
            <p className="mb-3">We collect the following categories of Personal Data only to the extent necessary for the specified purpose ("Purpose Limitation Principle"):</p>
            <div className="space-y-4">
              {[
                {
                  title: "A. Identity and Contact Data",
                  items: ["Full name", "Email address", "Mobile number", "City / State / Country of residence", "Profile photograph"]
                },
                {
                  title: "B. Professional and Business Data",
                  items: ["Years of professional experience", "Current industry and sector", "Business name and description", "Company website / LinkedIn profile", "Service offerings and areas of expertise"]
                },
                {
                  title: "C. Account Data",
                  items: ["Account login credentials (securely hashed; never stored in plain text)", "User role (Business Owner / Sales Partner / Service Provider)", "Onboarding responses and preferences"]
                },
                {
                  title: "D. User-Generated Content",
                  items: ["Posts, comments, and engagements published on the platform feed", "Interests expressed in Business Listings", "Profile cover images and banner images uploaded by users"]
                },
                {
                  title: "E. Technical and Usage Data",
                  items: ["IP address and approximate geolocation", "Browser type and device information", "Pages visited and time spent on the Platform", "Referring URLs and session activity logs"]
                },
                {
                  title: "F. Payment Data (When Applicable)",
                  items: ["Transaction IDs and payment status", "We do NOT store raw card numbers, CVV, UPI PINs, or net banking credentials. All payment processing is handled by our PCI-DSS compliant payment gateway."]
                }
              ].map(cat => (
                <div key={cat.title} className="border border-gray-100 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{cat.title}</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {cat.items.map(i => <li key={i}>{i}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Lawful Basis */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">4. Lawful Basis for Processing</h2>
            <p className="mb-3">We process your Personal Data only where we have a valid lawful basis under applicable Indian law:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Consent:</strong> Where you have provided a free, specific, informed, and unambiguous consent (e.g., during account creation or onboarding). You may withdraw consent at any time by contacting us, subject to applicable legal or contractual obligations.</li>
              <li><strong>Contractual Necessity:</strong> Where processing is necessary to perform the contract of services entered into with you (i.e., our Terms and Conditions).</li>
              <li><strong>Legal Obligation:</strong> Where processing is necessary for compliance with a legal obligation to which the Company is subject, including obligations under the Companies Act, Income Tax Act, GST laws, and regulations of RBI.</li>
              <li><strong>Legitimate Interests:</strong> Where processing is necessary for our legitimate business interests (e.g., fraud prevention, platform security, analytics to improve services), provided such interests are not overridden by your rights as a Data Principal.</li>
            </ul>
          </section>

          {/* 5. Purpose of Processing */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">5. Purpose of Processing Personal Data</h2>
            <p className="mb-3">The Company processes Personal Data strictly for the following identified purposes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To facilitate registration, onboarding, and account management on the Platform.</li>
              <li>To enable matching between Business Owners and Sales Partners / Service Providers.</li>
              <li>To display user profiles, posts, business listings, and engagement activity on the Platform feed.</li>
              <li>To process payments for platform subscriptions or services fees.</li>
              <li>To send transactional communications such as account confirmations, password resets, and payment receipts.</li>
              <li>To send promotional or marketing communications, only where explicit consent has been obtained and subject to the right to opt-out at any time.</li>
              <li>To monitor, analyse, and improve the performance, security, and user experience of the Platform.</li>
              <li>To comply with applicable law, court orders, or statutory requirements.</li>
            </ul>
            <p className="mt-3">We shall not use your Personal Data for any purpose beyond what is stated herein without obtaining fresh consent.</p>
          </section>

          {/* 6. Data Sharing */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">6. Disclosure and Sharing of Personal Data</h2>
            <p className="mb-3">We do not sell, rent, or trade your Personal Data. We may share your data only in the following limited circumstances:</p>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>With Other Platform Users:</strong> Certain profile information (name, professional background, city, profile photo, posts) is visible to other registered users on the Platform as part of the core service. You control what you make public through your profile settings.</li>
              <li><strong>With Data Processors / Technology Service Providers:</strong> We engage vetted third-party service providers who process data on our behalf under binding data processing agreements, including Google Cloud Platform (infrastructure), Firebase Authentication (user authentication), and our payment gateway partner. These processors are contractually prohibited from using your data for their own purposes.</li>
              <li><strong>For Legal Compliance:</strong> We may disclose Personal Data to government agencies, law enforcement authorities, or regulatory bodies as required by applicable Indian law, court orders, or governmental mandates.</li>
              <li><strong>In Business Transfers:</strong> In the event of a merger, acquisition, or sale of substantially all of the Company's assets, Personal Data may be transferred to the acquiring entity, subject to the same privacy protections. We shall notify Data Principals of such a transfer.</li>
            </ul>
          </section>

          {/* 7. Data Retention */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">7. Data Retention</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Personal Data is retained for as long as your account remains active or as necessary to provide our Services.</li>
              <li>Upon account deletion, Personal Data will be erased or anonymised within <strong>90 days</strong>, except where retention is required by applicable law.</li>
              <li>Financial transaction data and payment records shall be retained for a minimum period of <strong>8 years</strong> from the date of the transaction, in compliance with applicable Indian taxation and accounting laws.</li>
              <li>Technical logs (access logs, security logs) may be retained for up to <strong>1 year</strong> for security and fraud detection purposes.</li>
            </ul>
          </section>

          {/* 8. Rights of Data Principal */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">8. Rights of Data Principals under DPDPA 2023</h2>
            <p className="mb-3">As a Data Principal, you have the following rights under the Digital Personal Data Protection Act, 2023, which we are fully committed to upholding:</p>
            <div className="space-y-3">
              {[
                ["Right to Access", "You have the right to obtain a summary of your Personal Data being processed by us and the processing activities undertaken."],
                ["Right to Correction and Erasure", "You may request correction of inaccurate or incomplete Personal Data, and erasure of Personal Data that is no longer necessary for the purpose for which it was collected."],
                ["Right to Grievance Redressal", "You have the right to have your grievances addressed by us expeditiously and in a manner prescribed under applicable law."],
                ["Right to Nominate", "You have the right to nominate another individual who shall exercise your rights in the event of your death or incapacity."],
                ["Right to Withdraw Consent", "You may withdraw your consent to processing at any time. Such withdrawal shall not affect the lawfulness of processing based on consent before its withdrawal."],
              ].map(([right, desc]) => (
                <div key={right} className="border border-gray-100 rounded-lg p-4">
                  <p className="font-semibold text-gray-800 mb-1">{right}</p>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4">To exercise any of the above rights, please contact our Data Protection Officer at <a href="mailto:hrishikesh.pangarkar@gmail.com" className="text-indigo-600 hover:underline">hrishikesh.pangarkar@gmail.com</a>. We shall respond to all verifiable requests within <strong>30 days</strong>.</p>
          </section>

          {/* 9. Security */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">9. Security Measures</h2>
            <p className="mb-3">The Company implements appropriate technical and organisational security measures in accordance with the SPDI Rules, 2011 and DPDPA 2023 to protect Personal Data from unauthorised access, disclosure, alteration, or destruction, including:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Transport Layer Security (TLS/HTTPS) encryption for all data transmitted between your browser and our servers.</li>
              <li>Firestore Security Rules enforcing row-level access controls ensuring users can only access their own data.</li>
              <li>Firebase Authentication with industry-standard credential hashing for all user accounts.</li>
              <li>Role-based access controls (RBAC) for internal personnel, ensuring minimum necessary access to production data.</li>
              <li>Regular review and audit of security access controls and policies.</li>
            </ul>
            <p className="mt-3">In the event of a Personal Data breach that is likely to result in a risk to the rights and freedoms of Data Principals, we shall notify the affected individuals and the Data Protection Board of India within the timeline stipulated by applicable law.</p>
          </section>

          {/* 10. Cookies */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">10. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar tracking technologies to maintain your session, remember your preferences, and analyse how you use the Platform. You can control the use of cookies through your browser settings. Disabling cookies may affect the functionality of certain parts of the Platform.</p>
          </section>

          {/* 11. Minors */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">11. Minors</h2>
            <p>Our Services are not directed to children below the age of 18 years. We do not knowingly collect Personal Data from minors without verifiable parental or guardian consent as required under DPDPA 2023. If we become aware that a minor has provided us with Personal Data without such consent, we will take immediate steps to delete such information.</p>
          </section>

          {/* 12. Grievance Officer */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">12. Grievance Officer / Data Protection Officer</h2>
            <p className="mb-4">In accordance with the Information Technology Act, 2000, IT (Amendment) Act, 2008, SPDI Rules, 2011, and the DPDPA 2023, the Company has designated a Grievance Officer. Any grievances, complaints, or requests regarding this Policy or processing of your Personal Data may be addressed to:</p>
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 space-y-2">
              <p><strong>Name:</strong> Hrishikesh Pangarkar</p>
              <p><strong>Designation:</strong> Grievance Officer / Data Protection Officer</p>
              <p><strong>Company:</strong> Biztribe Trading & Consultancy India Private Limited</p>
              <p><strong>Address:</strong> B-1001, Kapil Akhila, Pancard Club Road, Baner, Pune – 411 045, Maharashtra, India</p>
              <p><strong>Email:</strong> <a href="mailto:hrishikesh.pangarkar@gmail.com" className="text-indigo-600 hover:underline">hrishikesh.pangarkar@gmail.com</a></p>
              <p><strong>Response Time:</strong> We shall acknowledge your grievance within 48 hours and endeavour to resolve it within 30 days of receipt.</p>
            </div>
          </section>

          {/* 13. Amendments */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">13. Amendments to this Policy</h2>
            <p>The Company reserves the right to update or modify this Policy at any time. Any material changes will be notified to you via email or through a prominent notice on the Platform at least 15 days before such changes take effect. Your continued use of the Platform after the effective date of the revised Policy constitutes your acceptance of the changes. We encourage you to review this Policy periodically.</p>
          </section>

          {/* 14. Governing Law */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">14. Governing Law and Jurisdiction</h2>
            <p>This Policy is governed by and construed in accordance with the laws of the Republic of India. Any dispute arising out of or in connection with this Policy shall be subject to the exclusive jurisdiction of the competent courts located in Pune, Maharashtra, India.</p>
          </section>

        </div>
      </div>
    </div>
  );
}

