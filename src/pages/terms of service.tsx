import React from "react";

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-gray-200 px-6 py-12 flex justify-center">
      <div className="max-w-4xl bg-zinc-900 rounded-2xl shadow-xl p-8 md:p-12 border border-yellow-600/30">
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-500 mb-6 text-center">
          Terms of Service
        </h1>

        <p className="mb-6 text-sm text-gray-400 text-center">
          Last updated: January 2026
        </p>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-yellow-400 mb-2">1. Acceptance of Terms</h2>
            <p className="text-gray-300">
              By accessing or using our website and services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-400 mb-2">2. Services</h2>
            <p className="text-gray-300">
              We provide professional grooming, barbering, and spa-related services. All services are subject to availability and may be modified or discontinued at any time without notice.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-400 mb-2">3. Appointments & Payments</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Appointments should be booked in advance.</li>
              <li>Payments must be made in full after service delivery.</li>
              <li>Late arrivals may result in reduced service time.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-400 mb-2">4. User Responsibilities</h2>
            <p className="text-gray-300">
              You agree to provide accurate information and to behave respectfully while using our services. Any misuse, abuse, or illegal activity may result in refusal of service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-400 mb-2">5. Cancellations & Refunds</h2>
            <p className="text-gray-300">
              Cancellations should be made at least 24 hours in advance. Refunds are issued at our discretion depending on the circumstances.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-400 mb-2">6. Limitation of Liability</h2>
            <p className="text-gray-300">
              We are not liable for any indirect, incidental, or consequential damages arising from the use of our services or website.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-400 mb-2">7. Intellectual Property</h2>
            <p className="text-gray-300">
              All content on this website, including text, graphics, logos, and designs, is the property of the business and may not be used without written permission.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-400 mb-2">8. Changes to Terms</h2>
            <p className="text-gray-300">
              We reserve the right to update these Terms of Service at any time. Continued use of the website constitutes acceptance of the revised terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-400 mb-2">9. Contact Information</h2>
            <p className="text-gray-300">
              If you have any questions regarding these Terms, please contact us through our official communication channels.
            </p>
          </div>
        </section>

        <div className="mt-10 text-center">
          <p className="text-xs text-gray-500">
            © 2026 Tripple Kay Cutts & Spa. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;