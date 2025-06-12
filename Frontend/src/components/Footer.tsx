import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Company Info */}
        <div>
          <h3 className="text-2xl font-bold text-blue-400 mb-4">RushSphere</h3>
          <p className="text-gray-300">
            Your one-stop marketplace for everything you need. Connect with thousands of sellers worldwide.
          </p>
          <Link to="/about" className="mt-4 inline-block text-blue-300 hover:underline">
            Learn more about us →
          </Link>
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
            <Link to="/vendor-register" className="block hover:text-white">Become a Seller</Link>
            <Link to="/vendor-login" className="block hover:text-white">Seller Login</Link>
            <Link to="/contact" className="block hover:text-white">Seller Support</Link>
          </div>
        </div>

        {/* Contact & Policies */}
        <div>
          <h4 className="font-semibold text-white mb-4">Contact & Info</h4>
          <div className="space-y-2 text-gray-300 text-sm">
            <Link to="/privacy-policy" className="block hover:text-white">Privacy Policy</Link>
            <Link to="/terms-of-service" className="block hover:text-white">Terms of Service</Link>
            <Link to="/shipping-policy" className="block hover:text-white">Shipping Policy</Link>
            <Link to="/refund-policy" className="block hover:text-white">Refund Policy</Link>
          </div>
        </div>
         <div>
         <h4 className="font-semibold text-white mb-4">Registered Office:</h4>
              <p className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1 text-blue-400" />
                <span>
                  RushSphere,<br />
                  Gadag, 582101
                </span>
              </p>
              <p className="flex items-center">
                <Phone size={16} className="mr-2 text-blue-400" />
                1-800-RUSH-SPH
              </p>
              <p className="flex items-center">
                <Mail size={16} className="mr-2 text-blue-400" />
                support@rushsphere.com
              </p>
              <p className="text-sm text-gray-400">Mon - Fri: 9AM - 6PM</p>
            </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} RushSphere. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            Developed by <span className="text-blue-300 font-medium">YourTeamName</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

