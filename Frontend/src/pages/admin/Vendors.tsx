

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Eye, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('https://rushsphere.onrender.com/api/vendors?populate=*');
      setCustomers(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

    const handleDelete = async(id) => {
    // TODO: Add API logic
    await axios.delete(`https://rushsphere.onrender.com/api/vendors/${id}`)
  };


  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Vendors</h1>
        <p className="text-sm text-gray-600">Manage your seller database.</p>
      </div>
      

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500">Name</th>
              <th className="px-6 py-3 font-medium text-gray-500">Business Name</th>
              <th className="px-6 py-3 font-medium text-gray-500">Email</th>
              <th className="px-6 py-3 font-medium text-gray-500">Phone</th>
              <th className="px-6 py-3 font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  <Loader2 className="animate-spin w-5 h-5 inline" />
                  <span className="ml-2">Loading customers...</span>
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((customer) => {
                const address = customer.address || {};
                return (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {customer.ownerName}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {customer.businessName}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{customer.email}</td>
                    <td className="px-6 py-4 text-gray-700">{customer.phone || '—'}</td>
                    <td className="px-6 py-4 text-gray-700">{customer.isApproved ? (
    <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
      Approved
    </span>
  ) : (
    <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">
      Not Approved
    </span>
  )}</td>
                    <td className="px-6 py-4 text-gray-700">
                     <div className="flex justify-center space-x-2">
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(customer.documentId)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                    
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerList;

