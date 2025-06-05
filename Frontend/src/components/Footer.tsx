import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col space-y-8 md:space-y-0 md:grid md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="text-2xl font-bold text-blue-400 mb-4">RushSphere</h3>
          <p className="text-gray-300 mb-4">
            Your one-stop marketplace for everything you need. Connect with thousands of sellers worldwide.
          </p>
        </div>

        {/* Customer Links */}
        <div>
          <h4 className="font-semibold text-white mb-4">For Customers</h4>
          <div className="space-y-2 text-gray-300 text-sm">
            <Link to="/customer-login" className="block hover:text-white">Login</Link>
            <Link to="/customer-register" className="block hover:text-white">Sign Up</Link>
            <Link to="/help" className="block hover:text-white">Help Center</Link>
            <Link to="/returns" className="block hover:text-white">Returns</Link>
          </div>
        </div>

        {/* Seller Links */}
        <div>
          <h4 className="font-semibold text-white mb-4">For Sellers</h4>
          <div className="space-y-2 text-gray-300 text-sm">
            <Link to="/seller-register" className="block hover:text-white">Become a Seller</Link>
            <Link to="/seller-login" className="block hover:text-white">Seller Login</Link>
            <Link to="/seller-guide" className="block hover:text-white">Seller Guide</Link>
            <Link to="/seller-support" className="block hover:text-white">Seller Support</Link>
          </div>
        </div>

        {/* Policies & Contact */}
        <div>
          <h4 className="font-semibold text-white mb-4">Information</h4>
          <div className="space-y-2 text-gray-300 text-sm">
            <Link to="/privacy-policy" className="block hover:text-white">Privacy Policy</Link>
            <Link to="/terms-of-service" className="block hover:text-white">Terms of Service</Link>
            <Link to="/shipping-policy" className="block hover:text-white">Shipping Policy</Link>
            <Link to="/refund-policy" className="block hover:text-white">Refund Policy</Link>
            <div className="mt-4">
              <p className="flex items-center">
                <Mail size={16} className="mr-2" />
                support@rushsphere.com
              </p>
              <p>1-800-RUSH-SPH</p>
              <p>Mon - Fri: 9AM - 6PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-gray-800 py-4 mt-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© 2024 RushSphere. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Developed by <span className="text-blue-300 font-medium">RushSphere Dev Team</span></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

