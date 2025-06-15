import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import VendorLayout from "./components/VendorLayout";
import Index from "./pages/Index";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerRegister from "./pages/CustomerRegister";
import SellerLogin from "./pages/SellerLogin";
import SellerRegister from "./pages/SellerRegister";
import VendorDashboard from "./pages/vendor/Dashboard";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import OrderTracking from "./pages/OrderTracking";
import About from "./pages/About"
import Contact from "./pages/Contact"

import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermPolicy from "./pages/TermPolicy";

import Products from "./pages/Products";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword"
import ForgotPasswordVendor from "./pages/ForgotPasswordVendor"

import VendorProducts from "./pages/vendor/Products";
import CreateProduct from "./pages/vendor/CreateProduct";
import EditProduct from "./pages/vendor/EditProduct";
import VendorOrders from "./pages/vendor/Orders";
import VendorOrderView from "./pages/vendor/OrderView";

import AdminLayout from "./components/AdminLayout";
import Admin from "./pages/admin/Admin";
import AdminOrderView from "./pages/admin/OrderView";
import AdminLogin from "./pages/admin/login";
import AdminProductApproval from './pages/admin/ProductApprove'
import AdminProducts from './pages/admin/Products';
import AdminOrdersPage from './pages/admin/Orders'
import AdminCustomer from './pages/admin/Customers'
import AdminVendors from './pages/admin/Vendors'
import AdminCategory from './pages/admin/Category'
import VendorApprove from './pages/admin/VendorApprove'

import AuthProvider from "./context/AuthProvider";
import CartProvider from "./context/CartProvider";




//VendorApprove

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
            
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<CustomerLogin />} />
                <Route path="/register" element={<CustomerRegister />} />
                <Route path="/about" element={<About/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/vendor-login" element={<SellerLogin />} />
                <Route path="/vendor-register" element={<SellerRegister />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/products" element={<Products />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermPolicy />} />
                <Route path="/shipping-policy" element={<TermPolicy />} />
                <Route path="/refund-policy" element={<TermPolicy />} />
                <Route path="/orders/:orderId" element={<OrderTracking />} />
                <Route
                  path="/category/:categoryName"
                  element={<CategoryPage />}
                />
                <Route
                  path="/category/:categoryName/:subcategoryName"
                  element={<CategoryPage />}
                />
                <Route path="/product/:slug" element={<ProductPage />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/forgot-password" element={<ForgotPassword/>}/>
                <Route path="/forgot-password-vendor" element={<ForgotPasswordVendor/>}/>
                
                <Route path="/vendor" element={<VendorLayout />}>
                  <Route index path="/vendor" element={<VendorDashboard />} />
                  <Route path="/vendor/products" element={<VendorProducts />} />
                  <Route
                    path="/vendor/products/new"
                    element={<CreateProduct />}
                  />
                  <Route
                    path="/vendor/products/edit/:slug"
                    element={<EditProduct />}
                  />
                  <Route path="/vendor/orders" element={<VendorOrders />} />
                  <Route
                    path="/vendor/orders/:orderId"
                    element={<VendorOrderView />}
                  />
                </Route>
                <Route path="/admin/login" element={<AdminLogin/>}/>
                <Route path="/admin" element={<AdminLayout/>}>
                  <Route path="/admin" element={<Admin/>}/>
                  <Route path="/admin/order/:orderId" element={<AdminOrderView/>}/>
                  <Route path="/admin/products/pending" element={<AdminProductApproval />} />
                  <Route path="/admin/vendors/pending" element={<VendorApprove />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/orders" element={<AdminOrdersPage />} />
                  <Route path="/admin/customers" element={<AdminCustomer/>}/>
                  <Route path="/admin/vendors" element={<AdminVendors/>}/>
                  <Route path="/admin/category" element={<AdminCategory/>}/>
                </Route>
              </Route>
            </Routes>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
