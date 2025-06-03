

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

const AdminProductApproval = () => {
  const [pendingProducts, setPendingProducts] = useState([
    {
      id: 'P001',
      name: 'Wireless Mouse',
      vendor: 'TechZone',
      category: 'Accessories',
      price: '$25.00',
    },
    {
      id: 'P002',
      name: 'Smart Watch',
      vendor: 'GearHub',
      category: 'Wearables',
      price: '$129.99',
    },
  ]);

  const approveProduct = (id: string) => {
    setPendingProducts(prev => prev.filter(product => product.id !== id));
    alert(`Product ${id} approved.`);
  };

  const rejectProduct = (id: string) => {
    setPendingProducts(prev => prev.filter(product => product.id !== id));
    alert(`Product ${id} rejected.`);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Pending Product Approvals</h2>
      <div className="space-y-4">
        {pendingProducts.map(product => (
          <div key={product.id} className="bg-white shadow rounded-lg p-4 flex justify-between items-center border">
            <div>
              <h4 className="text-lg font-semibold">{product.name}</h4>
              <p className="text-sm text-gray-600">Vendor: {product.vendor} | Category: {product.category}</p>
              <p className="text-sm text-gray-800">Price: {product.price}</p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={() => approveProduct(product.id)} className="bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle className="w-4 h-4 mr-1" /> Approve
              </Button>
              <Button onClick={() => rejectProduct(product.id)} variant="destructive">
                <XCircle className="w-4 h-4 mr-1" /> Reject
              </Button>
            </div>
          </div>
        ))}
        {pendingProducts.length === 0 && (
          <p className="text-center text-gray-500">No pending products at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default AdminProductApproval;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

const AdminProductApproval = () => {
  const [pendingProducts, setPendingProducts] = useState([
    {
      id: 'P001',
      name: 'Wireless Mouse',
      vendor: 'TechZone',
      category: 'Accessories',
      price: '$25.00',
    },
    {
      id: 'P002',
      name: 'Smart Watch',
      vendor: 'GearHub',
      category: 'Wearables',
      price: '$129.99',
    },
  ]);

  const approveProduct = (id: string) => {
    setPendingProducts(prev => prev.filter(product => product.id !== id));
    alert(`Product ${id} approved.`);
  };

  const rejectProduct = (id: string) => {
    setPendingProducts(prev => prev.filter(product => product.id !== id));
    alert(`Product ${id} rejected.`);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Pending Product Approvals</h2>
      <div className="space-y-4">
        {pendingProducts.map(product => (
          <div key={product.id} className="bg-white shadow rounded-lg p-4 flex justify-between items-center border">
            <div>
              <h4 className="text-lg font-semibold">{product.name}</h4>
              <p className="text-sm text-gray-600">Vendor: {product.vendor} | Category: {product.category}</p>
              <p className="text-sm text-gray-800">Price: {product.price}</p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={() => approveProduct(product.id)} className="bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle className="w-4 h-4 mr-1" /> Approve
              </Button>
              <Button onClick={() => rejectProduct(product.id)} variant="destructive">
                <XCircle className="w-4 h-4 mr-1" /> Reject
              </Button>
            </div>
          </div>
        ))}
        {pendingProducts.length === 0 && (
          <p className="text-center text-gray-500">No pending products at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default AdminProductApproval;

