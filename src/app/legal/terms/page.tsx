export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 py-20">
      <div className="container mx-auto px-4 max-w-4xl font-sans">
        <h1 className="font-serif font-bold text-4xl mb-4">Terms and Conditions</h1>
        <div className="space-y-6 text-gray-700 leading-relaxed text-sm">
          <p className="mb-8 font-semibold">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="font-bold text-lg mb-2 text-gray-900 uppercase tracking-wider">1. Scope of Agreement</h2>
            <p>This Agreement is made for using the Fractional Sales Partner platform (the "Website") managed by Biztribe Trading & Consultancy India Private limited. The Website acts as a marketplace to connect Overseas Business Owners ("OBOs") with Sales Partners ("SPs") and Third Party Service Providers ("TPSPs"). This Agreement governs your registration and use of the Services.</p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2 text-gray-900 uppercase tracking-wider">2. Registration on Website</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To use the Services, users must open an account on the Website. Users must complete all details in the registration/onboarding form accurately.</li>
              <li>An Account can only be created by a person aged 18 years or above representing a valid legal entity or operating as an independent consultant.</li>
              <li>Any person creating the Account on behalf of an OBO or TPSP binds that entity to these terms and conditions.</li>
              <li>All information provided shall be current, complete, and accurate. The user must keep it updated at all times.</li>
              <li>Users shall not use the Website for unlawful, prohibited, defamatory, obscene, or fraudulent activities.</li>
              <li>We reserve the right to refuse or cancel Registration without giving any reason.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2 text-gray-900 uppercase tracking-wider">3. Services and Arrangements</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Once an Account is created, OBOs can view and engage with Sales Partners or Service Providers listed on the Website.</li>
              <li>Users shall make their own independent enquiries and background checks before entering into any professional engagement.</li>
              <li>Any financial or professional arrangement, including commission structures or retainer fees, is a separate contract solely between the OBO and the SP/TPSP. Biztribe Trading & Consultancy India Pvt Ltd is not a party to these independent arrangements.</li>
              <li>We do not guarantee the performance, sales targets, or quality of the Sales Partners and shall not be responsible for underperformance or breach of agreement between the parties.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2 text-gray-900 uppercase tracking-wider">4. Covenants of Users</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Users acknowledge that we only provide the Website as a discovery and matching platform. We shall not be held responsible for low sales volumes or business losses.</li>
              <li>Any communication, legal commitments, or agreements between OBOs and SPs are their internal matters.</li>
              <li>Users shall keep all necessary permissions, licenses, and certifications updated as required for their specific business operations.</li>
              <li>Users shall use their own copyrighted material. We shall not be held responsible for claims arising from unauthorized use of third-party intellectual property uploaded on the Website.</li>
              <li>Users shall indemnify and keep indemnified Biztribe Trading & Consultancy India Pvt Ltd against all losses, liabilities, costs, and risks arising from their covenants.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2 text-gray-900 uppercase tracking-wider">5. Payments</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Any platform fees, subscription charges, or matching fees payable to the Website will be collected via our secure payment gateway.</li>
              <li>Taxes (such as GST), if applicable, will be borne by the user as per Indian tax regulations.</li>
              <li>Settlement of accounts or refunds for platform services will be governed strictly by our Refund Policy. We do not intermediate commission payouts between OBOs and SPs unless explicitly contracted otherwise.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2 text-gray-900 uppercase tracking-wider">6. Intellectual Property</h2>
            <p>Unless indicated otherwise, all content, databases, and materials on the Website are owned or licensed by Biztribe Trading & Consultancy India Pvt Ltd. Users agree not to infringe these rights or copy/republish the Website's intellectual property without written consent.</p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2 text-gray-900 uppercase tracking-wider">7. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Biztribe Trading & Consultancy India Pvt Ltd and its directors/officers will not be liable for any direct, indirect, special, or consequential loss (including loss of business or reputation) arising out of the use of the Website. Our maximum liability for all claims shall not exceed the amount received by us from you under this Agreement.</p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2 text-gray-900 uppercase tracking-wider">8. Indemnity</h2>
            <p>You shall indemnify, defend and hold harmless Biztribe Trading & Consultancy India Pvt Ltd from claims, demands, losses, and damages arising out of your breach of this Agreement, breach of any arrangement with another user, or violation of any applicable law.</p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2 text-gray-900 uppercase tracking-wider">9. Disclaimer and Force Majeure</h2>
            <p>The Website is provided on an 'as is' and 'as available' basis. We do not guarantee continuous or error-free access. Neither party shall be liable for failure or delay in performance due to causes beyond reasonable control (Force Majeure), such as acts of God, pandemics, or government actions.</p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2 text-gray-900 uppercase tracking-wider">10. Termination</h2>
            <p>We reserve the right to suspend or terminate your Account at any time if you breach this Agreement, misuse the Services, or expose us to legal risk. Users may also terminate their account at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2 text-gray-900 uppercase tracking-wider">11. Dispute Resolution & Governing Law</h2>
            <p>Any disputes shall be raised within 15 days of arising via email. Both parties will attempt to resolve the dispute via negotiation. This Agreement is governed by the laws of India, and the courts of Pune, Maharashtra shall have exclusive jurisdiction.</p>
            <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
              <p><strong>Company:</strong> Biztribe Trading & Consultancy India Private limited</p>
              <p><strong>Address:</strong> B-1001, Kapil Akhila, Pancard Club Road, Baner, Pune 411045, India</p>
              <p><strong>Contact Email:</strong> <a href="mailto:hrishikesh.pangarkar@gmail.com" className="text-indigo-600 hover:underline">hrishikesh.pangarkar@gmail.com</a></p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
