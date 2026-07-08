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

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 py-20">
      <div className="container mx-auto px-4 max-w-4xl font-sans">
        <h1 className="font-serif font-bold text-4xl mb-8">Contact Us</h1>
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="font-bold text-xl mb-3 text-gray-900">Get in Touch</h2>
            <p>If you have any questions or concerns regarding our platform, payments, or your account, please reach out to us through the details below.</p>
          </section>
          
          <section className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <h3 className="font-bold text-lg mb-4 text-gray-900">Contact Information</h3>
            <ul className="space-y-3">
              <li>
                <strong>Email Support:</strong> <a href="mailto:support@fractionalsales.com" className="text-indigo-600 hover:underline">support@fractionalsales.com</a>
              </li>
              <li>
                <strong>Phone Support:</strong> +91 98765 43210 (Mon-Fri, 9am - 5pm IST)
              </li>
              <li className="pt-3 border-t border-gray-200">
                <strong>Registered Office Address:</strong><br />
                Fractional Sales Partner Technologies Pvt Ltd.<br />
                123 Business Avenue, Tech Park Phase 2,<br />
                Hinjewadi, Pune, Maharashtra 411057, India
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
