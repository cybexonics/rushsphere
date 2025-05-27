import React from 'react';
import { Link } from 'react-router-dom';

const orders = [
  {
    id: 'ORD12345',
    customer: 'John Doe',
    date: '2025-05-24',
    total: '$150.00',
    status: 'Processing',
  },
  {
    id: 'ORD12346',
    customer: 'Jane Smith',
    date: '2025-05-23',
    total: '$320.00',
    status: 'Shipped',
  },
];

const statusColors = {
  Processing: 'bg-yellow-100 text-yellow-800',
  Shipped: 'bg-blue-100 text-blue-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const OrderList = () => {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-6">Orders</h1>
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Order ID</th>
              <th className="px-6 py-3 text-left font-semibold">Customer</th>
              <th className="px-6 py-3 text-left font-semibold">Date</th>
              <th className="px-6 py-3 text-left font-semibold">Total</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
              <th className="px-6 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{order.id}</td>
                <td className="px-6 py-4">{order.customer}</td>
                <td className="px-6 py-4">{order.date}</td>
                <td className="px-6 py-4">{order.total}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link to={`/vendor/orders/${order.id}`} className="text-green-600 hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;

