export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 py-20">
      <div className="container mx-auto px-4 max-w-4xl font-sans">
        <h1 className="font-serif font-bold text-4xl mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <section>
            <h2 className="font-bold text-xl mb-3 text-gray-900">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.</p>
          </section>
          <section>
            <h2 className="font-bold text-xl mb-3 text-gray-900">2. Use of Information</h2>
            <p>We may use the information we collect about you to provide, maintain, and improve our services, including facilitating payments and sending receipts.</p>
          </section>
          <section>
            <h2 className="font-bold text-xl mb-3 text-gray-900">3. Data Security</h2>
            <p>We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
