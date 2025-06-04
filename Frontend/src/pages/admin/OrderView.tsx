import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Truck, SendHorizonal, Loader2 } from 'lucide-react';
import axios from 'axios';

const AdminSingleOrderView = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);


  const fetchOrder = async () => {
    try {
      const res = await axios.get(`http://localhost:1337/api/orders?filters[orderNo][$eq]=${orderId}`);
      setOrder(res.data?.data || sampleOrder); // fallback for demo
      console.log(res.data?.data)
    } catch (err) {
      console.error('Failed to load order:', err);
      setOrder(sampleOrder); // fallback for demo
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleSendToVendor = async (product) => {
    try {
      alert(`Product "${product.product.name}" sent to ${product.product.vendor.name} (${product.product.vendor.contact_email}) - ${product.quantity}`);
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
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Order #{order?.[0]?.orderNo}</h1>

      {/* Customer Info */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Customer Info</h2>
        <p><strong>Name:</strong> {order?.[0]?.name}</p>
        <p><strong>Email:</strong> {order?.[0]?.email}</p>
        <p><strong>Phone:</strong> {order?.[0]?.phone}</p>
      </div>

      {/* Shipping Address */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Shipping Address</h2>
        <p>{order?.[0]?.shipping_address?.street}</p>
        <p>{order?.[0]?.shipping_address?.city}, {order?.[0]?.shipping_address?.state} {order?.[0]?.shipping_address?.zip}</p>
        <p>{order?.[0]?.shipping_address?.country}</p>
      </div>

      {/* Products */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Products</h2>
        <ul className="space-y-4">
          {order?.[0]?.products?.map((product) => (
            <li key={product?.id} className="border rounded px-4 py-3 bg-gray-50 flex justify-between items-center">
              <div>
                <div className="font-medium text-gray-900">{product?.product?.name}</div>
                <div className="text-sm text-gray-600">${product?.product?.price} * {product?.quantity}</div>
                <div className="text-sm text-gray-600">{product?.other ? product?.other : product?.other[0]}</div>
                <div className="text-sm text-gray-600">Vendor: {product?.product?.vendor?.name}</div>
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
        <p><strong>Status:</strong> {order?.[0]?.other?.status}</p>
        <p><strong>Total:</strong> ${order?.[0]?.other?.total.toFixed(2)}</p>
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

