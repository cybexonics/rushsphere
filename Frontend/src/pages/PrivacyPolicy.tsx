
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
            <p className="text-gray-600 mb-6">
              Last updated: May 22, 2025
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="mb-4">
                VendorVerse ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by VendorVerse when you use our website, mobile application, and services (collectively, the "Services").
              </p>
              <p>
                By accessing or using our Services, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy.
              </p>
            </section>
            
            <Separator className="my-8" />
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-medium mb-3">Information You Provide to Us</h3>
              <p className="mb-4">
                We collect information that you voluntarily provide to us when you register for an account, express an interest in obtaining information about us or our products and Services, participate in activities on the Services, or otherwise contact us.
              </p>
              
              <h4 className="text-lg font-medium mb-2">Personal Information</h4>
              <p className="mb-4">
                The personal information we collect may include:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Name, email address, and contact details</li>
                <li>Billing information and payment details</li>
                <li>Shipping address</li>
                <li>Account credentials</li>
                <li>Profile information</li>
                <li>Product preferences and shopping history</li>
                <li>Vendor business information (for sellers)</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-3">Information Automatically Collected</h3>
              <p className="mb-4">
                When you access or use our Services, we automatically collect certain information, including:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Device information (such as your IP address, browser type, and operating system)</li>
                <li>Usage information (such as pages visited, time spent, and links clicked)</li>
                <li>Location information</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>
            
            <Separator className="my-8" />
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <p className="mb-4">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>To provide, maintain, and improve our Services</li>
                <li>To process transactions and fulfill orders</li>
                <li>To communicate with you about your account, orders, and services</li>
                <li>To send you marketing communications</li>
                <li>To personalize your experience</li>
                <li>To respond to your inquiries and customer service requests</li>
                <li>To monitor and analyze usage trends</li>
                <li>To detect, prevent, and address technical issues</li>
                <li>To protect the security and integrity of our Services</li>
              </ul>
            </section>
            
            <Separator className="my-8" />
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Sharing of Your Information</h2>
              <p className="mb-4">
                We may share your information with:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Vendors and service providers who perform services on our behalf</li>
                <li>Vendors on our platform (when you place an order with them)</li>
                <li>Business partners with whom we jointly offer products or services</li>
                <li>Other users when you make public posts</li>
                <li>Third parties in connection with a company transaction, such as a merger or sale</li>
                <li>Law enforcement or other third parties as required by law</li>
              </ul>
            </section>
            
            <Separator className="my-8" />
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Your Choices and Rights</h2>
              <p className="mb-4">
                You have certain choices and rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Account Information: You can update or correct your account information at any time by logging into your account.</li>
                <li>Marketing Communications: You can opt out of receiving marketing emails by following the unsubscribe instructions in the emails.</li>
                <li>Cookies: You can set your browser to refuse all or some browser cookies or to alert you when cookies are being sent.</li>
                <li>Do Not Track: We currently do not respond to "Do Not Track" signals.</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-3">Data Protection Rights</h3>
              <p className="mb-4">
                Depending on your location, you may have the right to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of your personal information</li>
                <li>Request deletion of your personal information</li>
                <li>Object to processing of your personal information</li>
                <li>Request restriction of processing your personal information</li>
                <li>Request transfer of your personal information</li>
                <li>Withdraw consent</li>
              </ul>
            </section>
            
            <Separator className="my-8" />
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p>
                We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk.
              </p>
            </section>
            
            <Separator className="my-8" />
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
              <p>
                Our Services are not intended for individuals under the age of 16. We do not knowingly collect personal information from children under 16. If we learn we have collected personal information from a child under 16, we will delete that information as quickly as possible. If you believe that a child under 16 may have provided us with personal information, please contact us.
              </p>
            </section>
            
            <Separator className="my-8" />
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last updated" date and the updated version will be effective as soon as it is accessible. We encourage you to review this Privacy Policy frequently to be informed of how we are protecting your information.
              </p>
            </section>
            
            <Separator className="my-8" />
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p>
                If you have questions or comments about this Privacy Policy, please contact us at:
              </p>
              <p className="mt-4 font-medium">
                VendorVerse<br />
                Email: privacy@vendorverse.com<br />
                Address: 123 E-Commerce Street, Suite 100, Digital City, DC 12345
              </p>
            </section>
          </div>
        </div>
      </main>
      
      {/* Footer would be here, same as Index page */}
    </div>
  );
};

export default PrivacyPolicy;
