import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

type Vendor = {
  id: number;
  attributes: {
    name: string;
    email?: string;
    isApproved: boolean;
  };
};

const AdminVendorApproval = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchVendors = async () => {
    console.log('📥 Fetching unapproved vendors...');
    setLoading(true);
    setError('');

    try {
      const res = await fetch('https://rushsphere.onrender.com/api/vendors?filters[isApproved][$eq]=false');
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      console.log('✅ Vendors:', data.data);
      setVendors(data.data);
    } catch (err) {
      console.error('❌ Vendor fetch error:', err);
      setError('Could not fetch vendors.');
    } finally {
      setLoading(false);
    }
  };

  const approveVendor = async (id: number) => {
    console.log(`✅ Approving vendor ID ${id}`);
    try {
      const res = await fetch(`https://rushsphere.onrender.com/api/vendors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { isApproved: true } }),
      });

      if (!res.ok) throw new Error('Approval failed');
      setVendors(prev => prev.filter(vendor => vendor.id !== id));
      alert("Approveds")
    } catch (err) {
      console.error('❌ Vendor approval failed:', err);
      alert('Failed to approve vendor.');
    }
  };

  const rejectVendor = (id: number) => {
    console.log(`🚫 Vendor ${id} rejected (removed from view)`);
    setVendors(prev => prev.filter(v => v.id !== id));
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Pending Vendor Approvals</h2>
      {loading ? (
        <p>Loading vendors...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : vendors.length === 0 ? (
        <p className="text-gray-500">No pending vendors at the moment.</p>
      ) : (
        vendors.map(vendor => (
          <div
  key={vendor.id}
  className="bg-white shadow-md rounded-lg border p-6 space-y-3 mt-4"
>
  <h4 className="text-xl font-bold text-gray-800 mb-2">
    {vendor.businessName}
  </h4>

  <div className="text-sm text-gray-700 space-y-1">
    <p><strong>Owner:</strong> {vendor.ownerName}</p>
    <p><strong>Email:</strong> {vendor.email || 'No email provided'}</p>
    <p><strong>Address:</strong> {vendor.businessAddress.address} <br/> {vendor.businessAddress.city} {vendor.businessAddress.state} {vendor.zipCode}</p>
  </div>

  <div className="mt-3 text-sm text-gray-700 space-y-1">
    <p className="font-medium text-gray-900">Bank Details:</p>
    <p><strong>UPI ID:</strong> {vendor.bankAccount.upi}</p>
  </div>

  <div className="flex justify-end space-x-3 pt-4">
    <Button
      onClick={() => approveVendor(vendor.documentId)}
      className="bg-green-600 hover:bg-green-700 text-white"
    >
      <CheckCircle className="w-4 h-4 mr-1" /> Approve
    </Button>
    <Button onClick={() => rejectVendor(vendor.id)} variant="destructive">
      <XCircle className="w-4 h-4 mr-1" /> Reject
    </Button>
  </div>
</div>

        ))
      )}
    </div>
  );
};

export default AdminVendorApproval;

