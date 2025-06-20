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
      const res = await axios.get(`https://rushsphere.onrender.com/api/vendor-orders/${orderId}`);
      setOrder(res.data?.data); // fallback for demo
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
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Order #{order?.other.orderNo}</h1>

      {/* Shipping Address */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Shipping Address</h2>
        <p>RushSphere Head Office,</p>
        <p>Gadag,Karnatak,582101</p>
        <p>India</p>
      </div>

      {/* Products */}
      <div className="mb-6">
  <h2 className="text-lg font-semibold text-gray-800 mb-4">Products</h2>
  <ul className="space-y-4">
    {order?.products?.map((product, index) => (
      <li
        key={product?.id || index}
        className="border rounded px-4 py-3 bg-gray-50 flex justify-between items-center"
      >
        <div>
          <div className="font-medium text-gray-900">
            {product?.product?.name || 'Unnamed Product'}
          </div>
          <div className="text-sm text-gray-600">
            ₹{product?.product?.price || '0.00'} * {product?.quantity || '0.00'} 
          </div>
          <div className="text-sm text-gray-600">
            {order?.other?.details?.map((i,index)=>{
              <div>
                <b>{i.name}</b>:{i.other[0]}
              </div>
            })}
          </div>
        </div>
      </li>
    ))}
  </ul>
</div>


      {/* Summary */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Order Summary</h2>
        <p><strong>Status:</strong> {order?.order?.status}</p>
        <p><strong>Total:</strong> ₹{order?.products.map((p)=>{return p?.product?.price * p?.quantity})}</p>
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

