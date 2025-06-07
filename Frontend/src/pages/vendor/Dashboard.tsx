
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Package, TrendingUp, Users, DollarSign, Eye } from 'lucide-react';
import { getData } from "@/lib/getData"
import { transformProductData } from "@/lib/transformProductData"
import { useAuth } from '@/context/AuthProvider'

const VendorDashboard = () => {
const [orders,setOrders] = useState([])
const [information,setInformation] = useState({
  products:0,
  sales:0,
  orders:0,
  view:0,
})

const { vendor } = useAuth();
  useEffect(()=>{
  const storedVendorId = localStorage.getItem('vendor');
     async function fetchData() {
      try {
        const [productRes, vendorOrders, categoriesRes, subcategoriesRes] = await Promise.all([
          getData(`products`),
          getData('vendor-orders'),
          getData('categories'),
          getData('subcategories?populate=*'),
        ]);

        const fetchedProduct = productRes?.data;
        const order = vendorOrders?.data
        const transformed = transformProductData(fetchedProduct);
        setInformation(prev => ({
          ...prev,
          orders:order.length,
          products:transformed.filter(p=>p.vendor?.documentId === vendor.documentId).length
        }))
        console.log(order)
        setOrders(order)
        }catch(error){
          console.log(error)
        }
    }
    fetchData();
  },[])
  const stats = [
    { label: 'Total Products', value:  information.products, icon: Package, color: 'blue' },
    { label: 'Total Sales', value:orders.length, icon: DollarSign, color: 'green' },
    { label: 'Orders This Month', value: orders.length, icon: TrendingUp, color: 'purple' },
    { label: 'Store Views', value: orders.length, icon: Eye, color: 'orange' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
          </div>
          <Link to="/vendor/products/new">
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              <Plus className="h-5 w-5 mr-2" />
              Add New Product
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats?.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                  <Link to="/vendor/orders" className="text-green-600 hover:text-green-700 text-sm font-medium">
                    View All
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {orders ? orders?.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium text-gray-900">{order?.other?.orderNo}</p>
                            
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{order?.products.name}</p>
                            <p className="text-sm text-gray-600">{order?.other.other}</p>
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order?.other?.status || "Pendding")}`}>
                        {order?.other?.status || "Padding"}
                      </span>
                    </div>
                  )) : <div className="text-center">No Order Found</div>}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/vendor/products" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    Manage Products
                  </Button>
                </Link>
                <Link to="/vendor/orders" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Orders
                  </Button>
                </Link>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
