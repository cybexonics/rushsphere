import React from 'react';
import Header from '@/components/Header';
import { Separator } from '@/components/ui/separator';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">Last updated: June 5, 2025</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Personal Information:</strong> Name, email address, phone number, billing and shipping address.</li>
                <li><strong>Payment Information:</strong> Credit/debit card details (processed via secure payment gateways).</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system, and browsing behavior.</li>
                <li><strong>Order Information:</strong> Products viewed, added to cart, purchased, etc.</li>
              </ul>
            </section>

            <Separator className="my-8" />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Process and fulfill your orders.</li>
                <li>Communicate with you about your order or account.</li>
                <li>Send promotional emails and updates (you can opt out at any time).</li>
                <li>Improve our website and services.</li>
                <li>Detect and prevent fraud or misuse.</li>
              </ul>
            </section>

            <Separator className="my-8" />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Sharing Your Information</h2>
              <p>We do not sell your personal information. We may share it with:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Service Providers:</strong> For payment processing, shipping, and customer service.</li>
                <li><strong>Legal Authorities:</strong> When required by law or to protect our rights.</li>
                <li><strong>Analytics Tools:</strong> Like Google Analytics to understand website traffic and improve user experience.</li>
              </ul>
            </section>

            <Separator className="my-8" />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
              <p>
                Rushsphere.com uses cookies to enhance your browsing experience. Cookies help us remember your preferences and track site usage.
                You can disable cookies in your browser settings.
              </p>
            </section>

            <Separator className="my-8" />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <Separator className="my-8" />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Access the personal data we hold about you.</li>
                <li>Request correction or deletion of your data.</li>
                <li>Opt-out of marketing communications.</li>
              </ul>
            </section>

            <Separator className="my-8" />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Third-Party Links</h2>
              <p>
                Our website may contain links to other websites. We are not responsible for their privacy practices.
              </p>
            </section>

            <Separator className="my-8" />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. The latest version will always be posted on our website.
              </p>
            </section>

            <Separator className="my-8" />

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p>
                If you have any questions or concerns about this policy, contact us at:
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
    </div>
  );
};

export default PrivacyPolicy;

