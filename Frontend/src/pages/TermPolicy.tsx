import React from 'react';
import Header from '@/components/Header';
import { Separator } from '@/components/ui/separator';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">Effective Date: June 5, 2025</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Welcome to Rushsphere.com</h2>
              <p>
                These Terms and Conditions govern your use of our website and services. By accessing or using our site,
                you agree to be bound by these terms.
              </p>
            </section>

            <Separator className="my-8" />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. General</h2>
              <p>
                Rushsphere.com is owned and operated by <strong>[Insert Legal Company Name]</strong>. By using this
                website, you agree to comply with and be bound by these Terms and all applicable laws and regulations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Eligibility</h2>
              <p>You must be at least 18 years old to make a purchase on Rushsphere.com.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Products and Pricing</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>We strive to ensure all product details, images, and prices are accurate.</li>
                <li>Prices are subject to change without notice.</li>
                <li>We reserve the right to limit quantities or discontinue products at any time.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Orders and Payments</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>All orders are subject to acceptance and availability.</li>
                <li>Payment must be made in full before shipment or via COD.</li>
                <li>We accept payments via Credit/Debit Card, UPI, and Net Banking.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Shipping and Delivery</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>We aim to dispatch orders within 1–2 business days.</li>
                <li>Delivery times may vary based on your location and external factors.</li>
                <li>Shipping charges, if applicable, will be shown at checkout.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Returns and Refunds</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Eligible items can be returned within 1–2 days of delivery.</li>
                <li>Items must be unused and in original packaging.</li>
                <li>Refunds are issued after inspection via the original payment method.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. User Conduct</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Use the site for unlawful purposes</li>
                <li>Distribute viruses or harmful technologies</li>
                <li>Violate the intellectual property rights of Rushsphere or others</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
              <p>
                All content on Rushsphere.com, including text, logos, images, and graphics, is the property of
                Rushsphere.com or its licensors and is protected by copyright laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
              <p>
                Rushsphere.com is not liable for indirect or consequential damages resulting from the use or inability to use our site or products.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Privacy</h2>
              <p>Your use of our site is governed by our <strong>Privacy Policy</strong>.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
              <p>
                Rushsphere.com reserves the right to update these Terms at any time without notice. Continued use of the site means you accept the updated Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
              <p>
                These Terms shall be governed by the laws of India. Disputes will be subject to the jurisdiction of courts in <strong>Gadag, Karnataka</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
              <p>
                If you have any questions about these Terms, contact us:
              </p>
              <p className="mt-4 font-medium">
                Rushsphere<br />
                Email: support@rushsphere.com<br />
                Address: Karnataka, Gadag
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer component can be added here */}
    </div>
  );
};

export default TermsOfService;

