import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Check, Clock, Package, Truck, MapPin } from 'lucide-react';

// Mock API fetch
const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      const data = await fetch(`https://rushsphere.onrender.com/api/orders?filters[orderNo][$eq]=${orderId}`);
      const json = await data.json();
      console.log(json.data[0])
      if (json.data) {
        setOrderDetails(json.data[0]);
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
                  <CardTitle>Order NO : #{orderDetails?.orderNo}</CardTitle>
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
                    <p>{Date(orderDetails?.createdAt).toLocaleString()} </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tracking ID</p>
                    <p>{orderDetails?.trackingNumber || "Pending"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Delivery</p>
                    <p>{orderDetails?.other?.delivery || "Pending"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p>₹{orderDetails?.other?.total}</p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <p className="text-sm text-gray-500">Shipping To</p>
                  <p>{orderDetails.name}</p>
                   <p>{orderDetails.address?.street}</p>
        <p>{orderDetails.address?.city}, {orderDetails.address?.state} {orderDetails.address?.zip}</p>
        <p>{orderDetails.address?.country || "India"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {orderDetails.products.map(p=>(
                    <div key={p.product.id} className="border rounded-lg overflow-hidden">
                          <div className="h-40">
                            <img src={p.product.images[0]} alt={p.product.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium">{p.product.name}</h3>
                            <p className="font-bold">₹{p.product.price}</p>
                            <div>
                              Quantity: {p.quantity}
                            </div>
                          </div>
                        </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Tracking Timeline 
            <Card>
              <CardHeader><CardTitle>Tracking Timeline</CardTitle></CardHeader>
              <CardContent>
                <div className="relative">
                  {orderDetails?.other?.tracking?.map((step: any, index: number) => (
                    <div key={index} className="mb-8 flex">
                      <div className="flex-shrink-0 relative">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                          {step?.completed ? <Check className="h-5 w-5" /> : renderTrackingIcon(step?.status)}
                        </div>
                        {index < orderDetails?.other?.tracking?.length - 1 && (
                          <div className={`absolute top-10 left-1/2 w-0.5 h-12 -translate-x-1/2
                              ${orderDetails.trackingSteps[index + 1].completed ? 'bg-green-400' : 'bg-gray-200'}`} >Test</div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-medium">{step?.status}</h3>
                        <p className="text-sm text-gray-500">{step?.location}</p>
                        <p className="text-sm text-gray-400">{step?.date || 'Pending'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            */}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderTrackingPage;

