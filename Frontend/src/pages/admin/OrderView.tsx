import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Truck, SendHorizonal, Loader2 } from 'lucide-react';
import axios from 'axios';

const AdminSingleOrderView = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // For demo: Sample fallback order
  const sampleOrder = {
    id: 1234,
    customer: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
    },
    shipping_address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
    },
    products: [
      {
        id: 1,
        name: 'Wireless Mouse',
        price: 29.99,
        vendor: { id: 101, name: 'Vendor A', email: 'vendorA@example.com' },
      },
      {
        id: 2,
        name: 'Bluetooth Keyboard',
        price: 49.99,
        vendor: { id: 102, name: 'Vendor B', email: 'vendorB@example.com' },
      },
    ],
    total_amount: 79.98,
    status: 'Pending',
    shipping_provider: '',
  };

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`https://rushsphere.onrender.com/api/orders/${id}?populate[products][populate]=vendor&populate=customer&populate=shipping_address`);
      setOrder(res.data?.data || sampleOrder); // fallback for demo
    } catch (err) {
      console.error('Failed to load order:', err);
      setOrder(sampleOrder); // fallback for demo
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleSendToVendor = async (product) => {
    try {
      // Simulate vendor notification (e.g. send email or API call)
      alert(`Product "${product.name}" sent to ${product.vendor.name} (${product.vendor.email})`);
    } catch (err) {
      console.error('Failed to notify vendor:', err);
      alert('Failed to notify vendor.');
    }
  };

  const handleRocketShip = async () => {
    try {
      // Replace this with your RocketShipping API call
      await axios.post('https://api.rocketshipping.com/ship', {
        orderId: order.id,
        provider: 'RocketShipping',
        address: order.shipping_address,
        items: order.products.map(p => ({ name: p.name, price: p.price })),
      });

      alert(`Order #${order.id} has been sent to RocketShipping.`);
    } catch (err) {
      console.error('RocketShipping failed:', err);
      alert('RocketShipping request failed.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Order #{order.id}</h1>

      {/* Customer Info */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Customer Info</h2>
        <p><strong>Name:</strong> {order.customer.first_name} {order.customer.last_name}</p>
        <p><strong>Email:</strong> {order.customer.email}</p>
        <p><strong>Phone:</strong> {order.customer.phone}</p>
      </div>

      {/* Shipping Address */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Shipping Address</h2>
        <p>{order.shipping_address.street}</p>
        <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}</p>
        <p>{order.shipping_address.country}</p>
      </div>

      {/* Products */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Products</h2>
        <ul className="space-y-4">
          {order.products.map((product) => (
            <li key={product.id} className="border rounded px-4 py-3 bg-gray-50 flex justify-between items-center">
              <div>
                <div className="font-medium text-gray-900">{product.name}</div>
                <div className="text-sm text-gray-600">${product.price}</div>
                <div className="text-sm text-gray-600">Vendor: {product.vendor?.name}</div>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleSendToVendor(product)}>
                <SendHorizonal className="h-4 w-4 mr-1" />
                Send to Vendor
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Order Summary</h2>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total:</strong> ${order.total_amount}</p>
        <p><strong>Shipping Provider:</strong> {order.shipping_provider || 'Not assigned yet'}</p>
      </div>

      {/* RocketShipping Button */}
      <div className="text-right">
        <Button variant="default" size="lg" onClick={handleRocketShip}>
          <Truck className="h-5 w-5 mr-2" />
          Ship Order with RocketShipping
        </Button>
      </div>
    </div>
  );
};

export default AdminSingleOrderView;

