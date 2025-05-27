import React from 'react';
import { useParams } from 'react-router-dom';

const mockOrder = {
  id: 'ORD12345',
  customer: 'John Doe',
  date: '2025-05-24',
  items: [
    { name: 'T-shirt', qty: 2, price: '$25.00' },
    { name: 'Shoes', qty: 1, price: '$100.00' },
  ],
  total: '$150.00',
  status: 'Processing',
};

const OrderView = () => {
  const { orderId } = useParams();

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Order #{orderId}</h1>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Customer Details</h2>
        <p><strong>Name:</strong> {mockOrder.customer}</p>
        <p><strong>Date:</strong> {mockOrder.date}</p>
      </div>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Order Items</h2>
        <ul className="space-y-2">
          {mockOrder.items.map((item, idx) => (
            <li key={idx} className="flex justify-between text-sm text-gray-700">
              <span>{item.name} x {item.qty}</span>
              <span>{item.price}</span>
            </li>
          ))}
        </ul>
        <div className="text-right mt-4 font-semibold">Total: {mockOrder.total}</div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Update Status</h2>
        <select className="border rounded px-4 py-2">
          <option>Processing</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
        <button className="ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Update
        </button>
      </div>
    </div>
  );
};

export default OrderView;

