export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 py-20">
      <div className="container mx-auto px-4 max-w-4xl font-sans">
        <h1 className="font-serif font-bold text-4xl mb-8">Refund & Cancellation Policy</h1>
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <section>
            <h2 className="font-bold text-xl mb-3 text-gray-900">1. Subscription Cancellations</h2>
            <p>You may cancel your subscription at any time. Cancellation will take effect at the end of the current billing cycle. You will continue to have access to the service through the end of your current billing period.</p>
          </section>
          <section>
            <h2 className="font-bold text-xl mb-3 text-gray-900">2. Refunds</h2>
            <p>Payments are non-refundable and there are no refunds or credits for partially used billing periods. Exceptions may apply on a case-by-case basis under the sole discretion of Fractional Sales Partner management.</p>
          </section>
          <section>
            <h2 className="font-bold text-xl mb-3 text-gray-900">3. Dispute Resolution</h2>
            <p>If you believe you have been billed in error, please contact our support team immediately for assistance before disputing the charge with your bank.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
