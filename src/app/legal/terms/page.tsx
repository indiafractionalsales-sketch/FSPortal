export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 py-20">
      <div className="container mx-auto px-4 max-w-4xl font-sans">
        <h1 className="font-serif font-bold text-4xl mb-8">Terms and Conditions</h1>
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <section>
            <h2 className="font-bold text-xl mb-3 text-gray-900">1. Introduction</h2>
            <p>Welcome to Fractional Sales Partner. By accessing our website, you agree to these terms and conditions.</p>
          </section>
          <section>
            <h2 className="font-bold text-xl mb-3 text-gray-900">2. Services</h2>
            <p>We provide a platform connecting Overseas Business Owners with Sales Partners. Our services are subject to continuous updates and improvements.</p>
          </section>
          <section>
            <h2 className="font-bold text-xl mb-3 text-gray-900">3. User Responsibilities</h2>
            <p>Users are responsible for maintaining the confidentiality of their accounts and ensuring all provided information is accurate and legal.</p>
          </section>
          <section>
            <h2 className="font-bold text-xl mb-3 text-gray-900">4. Payments</h2>
            <p>All payments made on the platform are securely processed. Users agree to provide valid payment information when requested.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
