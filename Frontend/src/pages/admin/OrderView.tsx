import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Truck, SendHorizonal, Loader2, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const AdminSingleOrderView = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [orders,setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingStatus, setSendingStatus] = useState({}); // { vendorId: 'sent'|'sending'|'error' }

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`https://rushsphere.onrender.com/api/orders?filters[orderNo][$eq]=${orderId}`);
      const orders = await axios.get(`https://rushsphere.onrender.com/api/vendor-orders?filters[other][orderNo][$eq]=${orderId}`);
      setOrders(orders.data.data)
      console.log(orders.data)
      setOrder(res.data?.data?.[0] || null);
    } catch (err) {
      console.error('Failed to load order:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  // Group products by vendorId
  const groupProductsByVendor = () => {
    if (!order?.products) return {};
    const map = {};
    order.products.forEach(product => {
      const vendorId = product.product.vendor.vendor_id;
      if (!map[vendorId]) {
        map[vendorId] = [];
      }
      map[vendorId].push(product);
    });
    return map;
  };

  // Check if order was already sent to vendor (using vendor-orders API)
  const checkVendorOrderExists = async (vendorId) => {
    try {
      const res = await axios.get(`https://rushsphere.onrender.com/api/vendor-orders?filters[other][orderNo][$eq]=${order.orderNo}&filters[other][vendorId][$eq]=${vendorId}`);
      console.log(res)
      return res.data.data.length > 0;
    } catch (err) {
      console.error('Error checking vendor order existence:', err);
      return false;
    }
  };

  const handleSendToVendor = async (vendorId, products) => {
    setSendingStatus(prev => ({ ...prev, [vendorId]: 'sending' }));

    const alreadySent = await checkVendorOrderExists(vendorId);
    if (alreadySent) {
      setSendingStatus(prev => ({ ...prev, [vendorId]: 'already_sent' }));
      return;
    }

    try {
      const res = await axios.post('https://rushsphere.onrender.com/api/vendor-orders', {
        data: {
          products: products.map(p => p.product),
          other: {
             details: products.map(p => ({
              name: p?.name,
              other: p?.other,
            })),
            orderNo: order.orderNo,
            vendorId,
            status:"Pending",
          },
          vendor: vendorId,
        }
      });
      if (res.status === 200 || res.status === 201) {
        setSendingStatus(prev => ({ ...prev, [vendorId]: 'sent' }));
      } else {
        setSendingStatus(prev => ({ ...prev, [vendorId]: 'error' }));
      }
    } catch (err) {
      console.error('Failed to send to vendor:', err);
      setSendingStatus(prev => ({ ...prev, [vendorId]: 'error' }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    );
  }

  if (!order) {
    return <p className="text-center mt-6">Order not found</p>;
  }

  const productsByVendor = groupProductsByVendor();

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Order #{order.orderNo}</h1>

      {/* Customer Info */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Customer Info</h2>
        <p><strong>Name:</strong> {order.name}</p>
        <p><strong>Email:</strong> {order.email}</p>
        <p><strong>Phone:</strong> {order.phone}</p>
      </div>

      {/* Shipping Address */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Shipping Address</h2>
        <p>{order.address?.street}</p>
        <p>{order.address?.city}, {order.address?.state} {order.address?.zip}</p>
        <p>{order.address?.country}</p>
      </div>

      {/* Products by Vendor */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Products by Vendor</h2>

        {Object.entries(productsByVendor).map(([vendor_id, products]) => {
          const vendorName = products[0]?.product?.vendor?.name || vendor_id;
          const vendor = products[0]?.product?.vendor;
          const status = sendingStatus[vendor_id];

          return (
            <div key={vendor_id} className="mb-4 border rounded p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900">Vendor: {vendorName}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendToVendor(vendor.vendor_id, products)}
                  disabled={status === 'sending' || status === 'sent' || status === 'already_sent'}
                >
                  {status === 'sending' && <Loader2 className="animate-spin h-4 w-4 mr-1" />}
                  {status === 'sent' && <CheckCircle className="h-4 w-4 mr-1 text-green-600" />}
                  {status === 'already_sent' && <CheckCircle className="h-4 w-4 mr-1 text-blue-600" />}
                  {status === 'error' && <XCircle className="h-4 w-4 mr-1 text-red-600" />}
                  {status === 'sent' ? 'Sent' : status === 'sending' ? 'Sending...' : status === 'already_sent' ? 'Already Sent' : 'Send to Vendor'}
                </Button>
              </div>
              <ul>
                {products.map(p => (
                  <li key={p.id} className="mb-1">
                    {p.product.name} — ${p.product.price} × {p.quantity}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Order Summary</h2>
        <p><strong>Status:</strong> {order.other?.status || 'N/A'}</p>
        <p><strong>Total:</strong> ${order.other?.total?.toFixed(2) || '0.00'}</p>
        <p><strong>Shipping Provider:</strong> {order.shipping_provider || 'Not assigned yet'}</p>
      </div>

      {/* RocketShipping Button */}
      <div className="text-right">
        <Button variant="default" size="lg" onClick={() => alert('RocketShipping integration not implemented.')}>
          <Truck className="h-5 w-5 mr-2" />
          Ship Order with RocketShipping
        </Button>
      </div>
    </div>
  );
};

export default AdminSingleOrderView;

