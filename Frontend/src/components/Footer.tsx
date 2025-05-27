
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, User } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-blue-400 mb-4">RushSphere</h3>
            <p className="text-gray-300 mb-4">
              Your one-stop marketplace for everything you need. Connect with thousands of sellers worldwide.
            </p>
            <p className="text-gray-400 text-sm">© 2024 RushSphere. All rights reserved.</p>
          </div>
          
          {/* Customer Links */}
          <div>
            <h4 className="font-semibold mb-4">For Customers</h4>
            <div className="space-y-2">
              <Link to="/customer-login" className="block text-gray-300 hover:text-white">Login</Link>
              <Link to="/customer-register" className="block text-gray-300 hover:text-white">Sign Up</Link>
              <Link to="/help" className="block text-gray-300 hover:text-white">Help Center</Link>
              <Link to="/returns" className="block text-gray-300 hover:text-white">Returns</Link>
            </div>
          </div>
          
          {/* Seller Links */}
          <div>
            <h4 className="font-semibold mb-4">For Sellers</h4>
            <div className="space-y-2">
              <Link to="/seller-register" className="block text-gray-300 hover:text-white">Become a Seller</Link>
              <Link to="/seller-login" className="block text-gray-300 hover:text-white">Seller Login</Link>
              <Link to="/seller-guide" className="block text-gray-300 hover:text-white">Seller Guide</Link>
              <Link to="/seller-support" className="block text-gray-300 hover:text-white">Seller Support</Link>
            </div>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-center">
                <Mail size={16} className="mr-2" />
                support@rushsphere.com
              </p>
              <p>1-800-RUSH-SPH</p>
              <p>Monday - Friday: 9AM - 6PM</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
