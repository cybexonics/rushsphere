
import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Package,
  Users,
  Layers,
  List,
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate()
  const stats = [
    { label: 'All Products', value: 0, icon: Package, color: 'blue' },
    { label: 'All Vendors', value: '120', icon: Users, color: 'green' },
    { label: 'Categories', value: '15', icon: Layers, color: 'purple' },
    { label: 'Subcategories', value: '45', icon: List, color: 'orange' }
  ];

  const pendingApprovals = [
    { label: 'Pending Products', link: '/admin/products/pending', icon: Clock },
    { label: 'Pending Vendors', link: '/admin/vendors/pending', icon: Clock }
  ];

  
  useEffect(()=>{
    const isAdmin =  localStorage.getItem('admin');
    if(isAdmin){
      navigate('/admin');
    }else{
      navigate('/admin/login')
    }
  },[])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Monitor and manage all platform activities.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Approvals and Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pending Approvals */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Pending Approvals</h2>
              </div>
              <div className="p-6 space-y-4">
                {pendingApprovals.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <item.icon className="h-5 w-5 text-yellow-500" />
                      <p className="font-medium text-gray-900">{item.label}</p>
                    </div>
                    <Link to={item.link}>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full font-medium">
                        View
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Admin Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Admin Actions</h3>
              <div className="space-y-3">
                <Link to="/admin/products" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    Manage Products
                  </Button>
                </Link>
                <Link to="/admin/vendors" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Vendors
                  </Button>
                </Link>
                <Link to="/admin/category" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Layers className="h-4 w-4 mr-2" />
                    Manage Categories
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

export default AdminDashboard;

