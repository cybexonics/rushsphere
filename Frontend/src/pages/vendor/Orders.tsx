import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface Order {
  id: number;
  customer: string;
  total: string;
  status: string;
  date: string;
}

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('https://rushsphere.onrender.com/api/vendor-orders?populate=*');
        // Adapt this depending on your Strapi response structure
        const formattedOrders = res.data.data
        setOrders(formattedOrders);
      } catch (err: any) {
        setError('Failed to load orders.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

const handleDelete = async(id) => {
    // TODO: Add API logic
    await axios.delete(`https://rushsphere.onrender.com/api/vendor-orders/${id}`)
  };
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">All Orders</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500 mt-6">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg border">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Order ID</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Product</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Total</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Date</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-t">
                  <td className="px-6 py-4 font-medium">#{order.order.orderNo}</td>
                  <td className="px-6 py-4">{order?.products?.map(product => {return product?.product?.name})}</td>
                  <td className="px-6 py-4">{order.products.map((p)=>{
                    return p?.product?.price *( p?.quantity || 1)
                  })}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-sm rounded-full font-medium ${getStatusColor(order.other.status)}`}>
                      {order.order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{order.createdAt}</td>
                  <td className="px-6 py-4">
                   <div className="flex justify-center space-x-2">
                        <Link to={`/vendor/orders/${order.documentId}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(order.documentId)}
                          
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;

