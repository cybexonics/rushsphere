
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Mail, User, Lock as LockIcon } from 'lucide-react';
import { useAuth } from "../context/AuthProvider"

const SellerLogin = () => {
  const { vendorLogin, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    vendorLogin(formData.email,formData.password);    
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="text-green-600" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Seller Login</h2>
            <p className="text-gray-600 mt-2">Access your seller dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your business email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/seller-forgot-password" className="text-sm text-green-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              New to selling on RushSphere?{' '}
              <Link to="/vendor-register" className="text-green-600 hover:underline font-semibold">
                Apply to become a seller
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-gray-500 mb-2">Are you a customer?</p>
            <Link 
              to="/login" 
              className="text-blue-600 hover:underline font-semibold"
            >
              Customer Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;
