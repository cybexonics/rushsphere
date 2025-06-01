

import React from 'react';

const orders = [
  { id: '#1001', customer: 'John Doe', total: '$199.99', status: 'Shipped', date: '2025-05-28' },
  { id: '#1002', customer: 'Jane Smith', total: '$89.00', status: 'Pending', date: '2025-05-30' },
  { id: '#1003', customer: 'Paul Walker', total: '$300.00', status: 'Delivered', date: '2025-05-27' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Shipped':
      return 'bg-blue-100 text-blue-800';
    case 'Delivered':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const AdminOrdersPage = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">All Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg border">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Order ID</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Customer</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Total</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Status</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-t">
                <td className="px-6 py-4 font-medium">{order.id}</td>
                <td className="px-6 py-4">{order.customer}</td>
                <td className="px-6 py-4">{order.total}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-sm rounded-full font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;

