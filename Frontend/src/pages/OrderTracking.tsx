import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Check, Clock, Package, Truck, MapPin } from 'lucide-react';

// Mock API fetch
const mockFetchOrder = async (orderId: string) => {
  await new Promise(res => setTimeout(res, 800));

  if (orderId === 'ORD-12345') {
    return {
      id: 'ORD-12345',
      date: '2025-05-10',
      total: 129.99,
      estimatedDelivery: '2025-05-15',
      trackingNumber: 'TRK7890123456',
      customer: {
        name: 'John Doe',
        address: '123 Main St, Apt 4B, New York, NY 10001'
      },
      items: [
        {
          id: '1',
          name: 'Wireless Noise Cancelling Headphones',
          price: 129.99,
          quantity: 1,
          image: '/placeholder.svg'
        }
      ],
      trackingSteps: [
        { status: 'Order Placed', date: '2025-05-10 09:30 AM', location: 'Online', completed: true },
        { status: 'Order Processed', date: '2025-05-11 11:45 AM', location: 'Warehouse, CA', completed: true },
        { status: 'Shipped', date: '2025-05-12 03:20 PM', location: 'Distribution Center, Chicago', completed: false },
        { status: 'In Transit', date: '2025-05-13 10:15 AM', location: 'Sorting Facility, Columbus', completed: false },
        { status: 'Out for Delivery', date: null, location: 'Local Carrier Facility, New York', completed: false },
        { status: 'Delivered', date: null, location: 'New York, NY 10001', completed: false }
      ]
    };
  }

  return null;
};

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      const data = await mockFetchOrder(orderId || '');
      if (data) {
        setOrderDetails(data);
        setError('');
      } else {
        setError('Order not found.');
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  function getOrderStatus(trackingSteps: any): string {
  if (!Array.isArray(trackingSteps)) return 'Pending';

  const lastCompleted = [...trackingSteps].reverse().find(step => step.completed);
  return lastCompleted ? lastCompleted.status : 'Pending';
}

  const renderTrackingIcon = (status: string) => {
    switch (status) {
      case 'Order Placed': return <Clock className="h-6 w-6" />;
      case 'Order Processed': return <Package className="h-6 w-6" />;
      case 'Shipped':
      case 'In Transit': return <Truck className="h-6 w-6" />;
      case 'Out for Delivery':
      case 'Delivered': return <MapPin className="h-6 w-6" />;
      default: return <Clock className="h-6 w-6" />;
    }
  };

  const orderStatus = getOrderStatus(orderDetails?.trackingSteps);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Order Tracking</h1>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Order Summary */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Order {orderDetails.id}</CardTitle>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium
                    ${orderStatus === 'Delivered'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'}`}>
                    {orderStatus}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p>{orderDetails.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tracking #</p>
                    <p>{orderDetails.trackingNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Delivery</p>
                    <p>{orderDetails.estimatedDelivery}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p>${orderDetails.total.toFixed(2)}</p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <p className="text-sm text-gray-500">Shipping To</p>
                  <p>{orderDetails.customer.name}</p>
                  <p>{orderDetails.customer.address}</p>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card>
              <CardHeader><CardTitle>Tracking Timeline</CardTitle></CardHeader>
              <CardContent>
                <div className="relative">
                  {orderDetails.trackingSteps.map((step: any, index: number) => (
                    <div key={index} className="mb-8 flex">
                      <div className="flex-shrink-0 relative">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center
                          ${step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                          {step.completed ? <Check className="h-5 w-5" /> : renderTrackingIcon(step.status)}
                        </div>
                        {index < orderDetails.trackingSteps.length - 1 && (
                          <div className={`absolute top-10 left-1/2 w-0.5 h-12 -translate-x-1/2
                            ${orderDetails.trackingSteps[index + 1].completed ? 'bg-green-400' : 'bg-gray-200'}`} />
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-medium">{step.status}</h3>
                        <p className="text-sm text-gray-500">{step.location}</p>
                        <p className="text-sm text-gray-400">{step.date || 'Pending'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderTrackingPage;

