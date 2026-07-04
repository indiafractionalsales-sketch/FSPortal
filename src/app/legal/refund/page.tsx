export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 py-20">
      <div className="container mx-auto px-4 max-w-4xl font-sans">
        <h1 className="font-serif font-bold text-4xl mb-2">Refund & Cancellation Policy</h1>
        <p className="text-gray-500 text-sm mb-10">
          Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        <div className="space-y-8 text-gray-700 leading-relaxed text-sm">

          {/* Preamble */}
          <section className="bg-gray-50 border-l-4 border-gray-800 p-5 rounded-r-lg">
            <p>
              This Refund and Cancellation Policy ("Policy") is published by <strong>Biztribe Trading & Consultancy India Private Limited</strong> ("Company", "We", "Us", or "Our"), operating the platform under the brand name <strong>"Fractional Sales Partner"</strong> at <strong>fractionalsales.com</strong>.
            </p>
            <p className="mt-3">
              This Policy governs all transactions made by Users ("You") on the Platform, including subscription plans, listing fees, and any other chargeable Services. This Policy is to be read in conjunction with our Terms and Conditions and Privacy Policy, all of which are incorporated herein by reference.
            </p>
            <p className="mt-3 font-semibold text-gray-800">
              By completing a payment on the Platform, you acknowledge that you have read, understood, and agreed to the terms of this Policy.
            </p>
          </section>

          {/* 1. Scope */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">1. Scope of This Policy</h2>
            <p className="mb-3">This Policy applies to the following categories of payments made on the Platform:</p>
            <div className="space-y-3">
              {[
                {
                  title: "Platform Subscription Plans",
                  desc: "Recurring or one-time subscription fees paid by Business Owners (BOs), Sales Partners (SPs), or Third Party Service Providers (TPSPs) for access to premium features on the Platform."
                },
                {
                  title: "Listing and Promotion Fees",
                  desc: "One-time fees paid to feature, boost, or highlight a Profile, business opportunity, or post on the Platform."
                },
                {
                  title: "Add-on Services",
                  desc: "Any other fee-based features, tools, or services offered by the Company directly through the Platform."
                },
              ].map(item => (
                <div key={item.title} className="border border-gray-100 rounded-lg p-4">
                  <p className="font-semibold text-gray-800 mb-1">{item.title}</p>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="font-semibold text-yellow-800 mb-1">⚠ Important Clarification</p>
              <p className="text-yellow-900 text-xs">
                This Policy <strong>does not govern</strong> any commission payments, retainer fees, or financial transactions entered into directly between a Business Owner and a Sales Partner / Service Provider as part of their independent Engagement. Such transactions are strictly between the contracting parties and are entirely outside the purview of the Company and this Policy.
              </p>
            </div>
          </section>

          {/* 2. Subscription Cancellation */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">2. Subscription Cancellation</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Users may cancel their subscription at any time by navigating to their Account Settings on the Platform or by submitting a written cancellation request to <a href="mailto:hrishikesh.pangarkar@gmail.com" className="text-indigo-600 hover:underline">hrishikesh.pangarkar@gmail.com</a>.</li>
              <li>Upon cancellation, the subscription will remain active until the <strong>end of the current billing cycle</strong> (monthly or annual, as applicable). The User will continue to have access to the subscribed features through the end of the paid period.</li>
              <li>Cancellation takes effect at the end of the current billing cycle. <strong>No partial refunds will be issued for the unused portion of a billing cycle</strong>, except as expressly provided under Section 3 of this Policy.</li>
              <li>For annual subscriptions, cancellation requests submitted within <strong>7 days of the renewal date</strong> will be processed without charge for the renewed cycle, subject to the User not having used the Platform's premium features during those 7 days.</li>
              <li>The Company will send an email confirmation to the User's registered email address upon successful processing of the cancellation request, within 2 business days.</li>
            </ul>
          </section>

          {/* 3. Refund Eligibility */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">3. Refund Eligibility</h2>
            <p className="mb-4">As a general principle, all fees paid on the Platform are <strong>non-refundable</strong>. However, the following exceptions apply:</p>

            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-800 mb-2">✓ Eligible for Full Refund</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Technical Error / Double Charge:</strong> If a User is charged more than once for the same transaction due to a technical error on the Platform or payment gateway, the duplicate amount will be fully refunded within 7 working days of confirmation of the error.</li>
                  <li><strong>Service Not Activated:</strong> If the Company fails to activate or deliver the subscribed service within 5 business days of payment, without any fault on the part of the User, the User shall be entitled to a full refund.</li>
                  <li><strong>Platform Shutdown:</strong> In the unlikely event that the Company discontinues the Platform permanently, Users with active paid subscriptions will be refunded on a pro-rata basis for the unused portion of their subscription period.</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-800 mb-2">◎ Eligible for Partial Refund (Case-by-Case)</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Annual Subscription — Early Cancellation:</strong> For annual subscription plans, if a User requests cancellation within the first <strong>30 days</strong> of a new annual subscription (not a renewal) and has used the platform for fewer than 5 days, the Company may, at its sole discretion, offer a pro-rata refund for the unused months, minus a processing fee of ₹500 or 5% of the subscription value, whichever is higher.</li>
                  <li><strong>Extenuating Circumstances:</strong> The Company may consider refund requests on a case-by-case basis for genuine extenuating circumstances (e.g., medical emergency, bereavement), upon submission of supporting documentation. Such requests must be submitted within 15 days of the payment date.</li>
                </ul>
              </div>

              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-800 mb-2">✕ Not Eligible for Refund</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Subscription fees for any period during which the User actively used the Platform's paid features.</li>
                  <li>Listing fees, promotion fees, or any one-time payment for a service that has already been rendered or activated.</li>
                  <li>Accounts suspended or terminated due to violation of the Terms and Conditions.</li>
                  <li>Subscription fees for monthly plans, regardless of usage (monthly plans are charged for the full billing cycle).</li>
                  <li>Fees paid based on a discounted or promotional offer, unless the offer's specific terms provide otherwise.</li>
                  <li>Any amounts already processed and settled to the User's account or applied as credits.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 4. Refund Process */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">4. Refund Request Process</h2>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <p className="font-semibold text-gray-800">Submit a Written Request</p>
                  <p className="mt-1">Email your refund request to <a href="mailto:hrishikesh.pangarkar@gmail.com" className="text-indigo-600 hover:underline">hrishikesh.pangarkar@gmail.com</a> with the subject line: <em>"Refund Request – [Your Registered Email] – [Transaction ID]"</em>. Your request must include: your full name, registered email address, transaction ID, date of payment, amount paid, reason for the refund request, and any supporting documentation.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <p className="font-semibold text-gray-800">Acknowledgement</p>
                  <p className="mt-1">The Company will acknowledge receipt of your refund request within <strong>48 business hours</strong>.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <p className="font-semibold text-gray-800">Review and Decision</p>
                  <p className="mt-1">The Company will review the request and communicate its decision within <strong>7 business days</strong>. Additional information or documentation may be requested during this period.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                <div>
                  <p className="font-semibold text-gray-800">Refund Processing</p>
                  <p className="mt-1">Approved refunds will be credited to the <strong>original payment method</strong> (credit card, debit card, UPI, or net banking account). Refunds cannot be redirected to a different account or payment instrument. The Company does not issue refunds via cash or cheque.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">5</div>
                <div>
                  <p className="font-semibold text-gray-800">Credit Timeline</p>
                  <p className="mt-1">Once approved and initiated by the Company, the refunded amount will reflect in your account within <strong>5 to 10 business days</strong>, depending on your bank or payment provider's processing timelines. The Company is not responsible for delays caused by the User's bank or card issuer.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. GST on Refunds */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">5. GST and Tax on Refunds</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>All platform fees are inclusive of applicable Goods and Services Tax (GST) as per the rates prescribed under Indian law.</li>
              <li>In the event of a full or partial refund, the GST component will also be refunded, subject to the Company successfully reversing the GST liability with the relevant tax authorities.</li>
              <li>Users who have availed Input Tax Credit (ITC) on an invoice from the Company are advised to consult their tax advisor on the reversal of ITC in the event of a refund, as per applicable GST regulations.</li>
              <li>The Company will issue a Credit Note to the User for any approved refund, in compliance with the provisions of the Central Goods and Services Tax Act, 2017.</li>
            </ul>
          </section>

          {/* 6. Chargebacks */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">6. Chargebacks and Payment Disputes</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Users are strongly encouraged to contact the Company directly before initiating a chargeback with their bank or card issuer. The Company will make every reasonable effort to resolve the dispute amicably and promptly.</li>
              <li>Filing a chargeback without first contacting the Company will be considered a violation of these Terms and may result in immediate suspension of the User's account pending investigation.</li>
              <li>If a chargeback is found to be fraudulent or filed in bad faith, the Company reserves the right to recover the disputed amount along with any penalties or fees levied by the payment gateway or banking institution, from the User.</li>
              <li>In cases where a chargeback is initiated and subsequently reversed in the Company's favour, the User's account may be permanently terminated at the Company's discretion.</li>
            </ul>
          </section>

          {/* 7. Changes to Policy */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">7. Amendments to This Policy</h2>
            <p>The Company reserves the right to revise this Policy at any time. Any material changes will be communicated to Users via their registered email address or through a prominent notice on the Platform, at least <strong>15 days</strong> before the revised Policy takes effect. Continued use of the Platform after the effective date of the revised Policy constitutes the User's acceptance of the changes.</p>
          </section>

          {/* 8. Grievance Redressal */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">8. Grievance Redressal</h2>
            <p className="mb-4">
              If you are dissatisfied with the outcome of your refund request or have any grievance relating to this Policy, you may escalate the matter to our designated Grievance Officer. All escalations will be addressed in accordance with the timelines and process stipulated under the Consumer Protection (E-Commerce) Rules, 2020.
            </p>
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 space-y-2">
              <p><strong>Grievance Officer:</strong> Hrishikesh Pangarkar</p>
              <p><strong>Company:</strong> Biztribe Trading & Consultancy India Private Limited</p>
              <p><strong>Address:</strong> B-1001, Kapil Akhila, Pancard Club Road, Baner, Pune – 411 045, Maharashtra, India</p>
              <p><strong>Email:</strong> <a href="mailto:hrishikesh.pangarkar@gmail.com" className="text-indigo-600 hover:underline">hrishikesh.pangarkar@gmail.com</a></p>
              <p><strong>Acknowledgement:</strong> Within 48 hours of receipt</p>
              <p><strong>Resolution Target:</strong> Within 30 business days of receipt</p>
            </div>
          </section>

          {/* 9. Governing Law */}
          <section>
            <h2 className="font-bold text-lg mb-3 text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">9. Governing Law and Jurisdiction</h2>
            <p>This Policy is governed by the laws of the Republic of India, including the Consumer Protection Act, 2019, the Consumer Protection (E-Commerce) Rules, 2020, the Payment and Settlement Systems Act, 2007, and applicable RBI guidelines. Any dispute arising out of this Policy shall be subject to the exclusive jurisdiction of the competent courts in Pune, Maharashtra, India.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
