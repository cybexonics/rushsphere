import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Package, TrendingUp, Users, BarChart2, Home, LogOut
} from 'lucide-react';
import { useAuth } from "@/context/AuthProvider"

const navItems = [
  { label: 'Dashboard', to: '/vendor/', icon: Home },
  { label: 'Products', to: '/vendor/products', icon: Package },
  { label: 'Orders', to: '/vendor/orders', icon: TrendingUp },
  { label: 'Customers', to: '/vendor/customers', icon: Users },
  { label: 'Analytics', to: '/vendor/analytics', icon: BarChart2 },
];

const VendorLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vendor, vendorLogout } = useAuth();

  useEffect(()=>{
    console.log(vendor)
  },[])

  const handleLogout = () => {
    vendorLogout()
    navigate("/")
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white shadow-md border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">{vendor?.businessName}</h2>
          <p className="text-sm text-gray-500">{vendor?.ownerName}</p>
        </div>
        
        <nav className="px-4 py-6 space-y-1 flex-1">
          {navItems.map(({ label, to, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition 
                  ${isActive ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Top Navigation */}
      <div className="lg:hidden bg-white shadow-md border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div>
            <h2 className="text-base font-bold text-gray-800">{vendor?.businessName}</h2>
            <p className="text-sm text-gray-500">{vendor?.ownerName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-600 text-sm font-medium flex items-center"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </button>
        </div>
        <div className="flex overflow-x-auto border-t border-gray-100">
          {navItems.map(({ label, to, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center justify-center px-4 py-3 text-xs font-medium whitespace-nowrap
                  ${isActive ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-600'}`}
              >
                <Icon className="h-4 w-4 mb-1" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default VendorLayout;

