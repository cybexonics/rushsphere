import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Package,Users, TrendingUp, DollarSign, Eye } from 'lucide-react';
import { getData } from "@/lib/getData";
import { transformProductData } from "@/lib/transformProductData";
import { useAuth } from '@/context/AuthProvider';

const VendorDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [information, setInformation] = useState({
    products: 0,
    sales: 0,
    orders: 0,
    views: 0, // Renamed 'view' to 'views' for consistency
  });
  const [loading, setLoading] = useState(true); // Add loading state
  const { vendor } = useAuth(); // Get vendor from AuthProvider

  // This state will hold the stats data, derived from `information`
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading

      if (!vendor?.documentId) {
        // If vendor is not available yet, wait or handle appropriately
        // This might happen on initial render if auth context isn't ready
        setLoading(false);
        return;
      }

      try {
        // Fetch all products, then filter by vendor on the client-side
        // Or, ideally, your API supports filtering products by vendor directly
        // Example if API supports vendor ID filter: `products?filters[vendor][documentId][$eq]=${vendor.documentId}`
        const [productRes, vendorOrdersRes] = await Promise.all([
          getData(`products?populate=vendor`), // Populate vendor to filter
          getData(`orders?populate=*&filters[products][vendor][documentId][$eq]=${vendor.documentId}`), // Filter orders by vendor's products
          // Fetch orders and populate products and their vendor details to ensure correct filtering
        ]);

        const fetchedProducts = productRes?.data || [];
        const fetchedOrders = vendorOrdersRes?.data || [];

        // Transform products and filter for the current vendor
        const transformedProducts = transformProductData(fetchedProducts);
        const vendorProducts = transformedProducts.filter(p => p.vendor?.documentId === vendor.documentId);

        
        const currentVendorOrders = fetchedOrders.filter(order => {
          const orderProducts = order.products?.data || [];
          return orderProducts.some(product => {
            return product.attributes.vendor?.data?.documentId === vendor.documentId;
          });
        });


        // Calculate total sales from currentVendorOrders
        // This assumes each product in the order has a price and quantity
        let totalSales = 0;
        currentVendorOrders.forEach(order => {
            order.products.data.forEach(product => {
                // Assuming product has a price and quantity (from the order item, if applicable)
                // You might need to adjust this based on how quantity and price are stored in your order items.
                // For simplicity, let's assume 'price' is directly on the product and 'quantity'
                // is implicitly 1 if not specified in the order item structure.
                totalSales += (product.price || 0) * (product.quantity || 1); // Add quantity if present in order items
            });
        });


        // Update information state
        setInformation(prev => ({
          ...prev,
          orders: currentVendorOrders.length,
          products: vendorProducts.length,
          sales: totalSales, // Update calculated sales
          views: 0, // Implement view tracking if available from your backend
        }));

        setOrders(currentVendorOrders); // Set filtered orders
      } catch (error) {
        console.error("Error fetching vendor dashboard data:", error);
        setOrders([]); // Set to empty array on error
        setInformation({ products: 0, sales: 0, orders: 0, views: 0 }); // Reset info on error
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData();
  }, [vendor]); // Re-run effect when vendor data from useAuth changes

  // Use a separate useEffect to set stats once 'information' and 'orders' are stable
  useEffect(() => {
    setStats([
      { label: 'Total Products', value: information.products, icon: Package, color: 'blue' },
      { label: 'Total Sales', value: information.sales.toFixed(2), icon: DollarSign, color: 'green' }, // Format sales
      { label: 'Orders This Month', value: information.orders, icon: TrendingUp, color: 'purple' }, // Assuming this is total orders
      { label: 'Store Views', value: information.views, icon: Eye, color: 'orange' } // Assuming 'information.views' will eventually be populated
    ]);
  }, [information]); // Depend on 'information' state

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  // Display a message if no vendor is logged in or if vendor data is missing
  if (!vendor?.documentId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-6">Please log in as a vendor to view this dashboard.</p>
        <Link to="/vendor-login">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Go to Vendor Login
          </Button>
        </Link>
      </div>
    );
  }

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
          {stats.map((stat, index) => (
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
                  {orders.length > 0 ? orders.map((order) => {
                    // Assuming 'order.attributes' exists from Strapi API response
                    const orderAttributes = order.attributes;
                    // Adjust this based on your actual order product structure
                    // For example, if products is a single component or relation, it might be different
                    const firstProduct = orderAttributes.products?.data?.[0]?.attributes;
                    const orderNumber = orderAttributes.orderNo || 'N/A'; // Assuming 'orderNo' is direct attribute
                    const orderStatus = orderAttributes.status || 'Pending'; // Assuming 'status' is direct attribute

                    return (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="font-medium text-gray-900">Order #{orderNumber}</p>
                              {/* Display customer name if available in order attributes */}
                              {orderAttributes.customerName && (
                                <p className="text-sm text-gray-600">Customer: {orderAttributes.customerName}</p>
                              )}
                            </div>
                            <div className="flex-1">
                              {firstProduct ? (
                                <>
                                  <p className="text-sm font-medium text-gray-900">{firstProduct.name}</p>
                                  {/* You might want to display more details like quantity, price per item etc. */}
                                  <p className="text-sm text-gray-600">Total: ${orderAttributes.totalAmount?.toFixed(2) || '0.00'}</p> {/* Assuming totalAmount is an attribute */}
                                </>
                              ) : (
                                <p className="text-sm text-gray-600">No products found for this order.</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(orderStatus)}`}>
                          {orderStatus}
                        </span>
                      </div>
                    );
                  }) : (
                    <div className="text-center text-gray-600 p-4">No recent orders found.</div>
                  )}
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
                {/* Add more quick actions here if needed */}
                <Link to="/vendor/settings" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Store Settings
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
