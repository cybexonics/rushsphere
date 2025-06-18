// VendorNotApproved.jsx

import React from 'react';

const VendorNotApproved = () => {
  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center px-4">
      <div className="bg-white border border-red-300 p-8 rounded-lg shadow-md text-center max-w-md">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">
          Vendor Approval Pending
        </h1>
        <p className="text-gray-700 text-lg">
          Thank you for registering as a vendor. Your account is currently under review.
        </p>
        <p className="text-gray-700 text-lg mt-2">
          Approvals typically take <span className="font-semibold">3 to 4 business days</span>.
        </p>
        <p className="text-gray-600 text-sm mt-6">
          You’ll be notified by email once your account is approved.
        </p>
      </div>
    </div>
  );
};

export default VendorNotApproved;

