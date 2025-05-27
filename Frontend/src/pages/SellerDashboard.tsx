import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User, TrendingUp, Package, ShoppingCart, Plus, DollarSign,
  Eye, Edit, Trash2
} from 'lucide-react';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalProducts: 45,
    totalOrders: 128,
    totalRevenue: 12450,
    pendingOrders: 8,
  };

  const products = [
    {
      id: 1, name: 'Bluetooth Headphones', price: 89.99, stock: 25, sales: 45,
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 2, name: 'Smartphone Case', price: 24.99, stock: 50, sales: 78,
      image: 'https://via.placeholder.com/150'
    }
  ];

  const Sidebar = () => (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-6">
      <div className="flex items-center mb-6">
        <User className="mr-3" />
        <div>
          <h2 className="font-semibold">Seller Panel</h2>
          <p className="text-sm text-gray-300">TechStore Inc.</p>
        </div>
      </div>

      {[
        { label: 'Overview', icon: TrendingUp, value: 'overview' },
        { label: 'Products', icon: Package, value: 'products' },
        { label: 'Add Product', icon: Plus, value: 'add-product' },
      ].map(({ label, icon: Icon, value }) => (
        <button
          key={value}
          onClick={() => setActiveTab(value)}
          className={`flex items-center w-full px-4 py-2 mb-2 rounded ${
            activeTab === value ? 'bg-green-600' : 'hover:bg-gray-700'
          }`}
        >
          <Icon size={18} className="mr-2" />
          {label}
        </button>
      ))}

      <div className="mt-8 border-t border-gray-600 pt-4">
        <Link to="/" className="text-sm text-gray-300 hover:text-white block">← Back to Marketplace</Link>
      </div>
    </aside>
  );

  const Overview = () => (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Products', value: stats.totalProducts, icon: Package },
          { label: 'Orders', value: stats.totalOrders, icon: ShoppingCart },
          { label: 'Revenue', value: `$${stats.totalRevenue}`, icon: DollarSign },
          { label: 'Pending', value: stats.pendingOrders, icon: TrendingUp },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-xl font-bold text-gray-800">{value}</p>
            </div>
            <Icon size={24} className="text-green-500" />
          </div>
        ))}
      </div>
    </section>
  );

  const Products = () => (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">My Products</h1>
        <button
          onClick={() => setActiveTab('add-product')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          <Plus size={16} className="inline mr-1" />
          Add Product
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map(product => (
          <div key={product.id} className="bg-white p-4 rounded shadow">
            <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded mb-2" />
            <h3 className="font-semibold text-gray-800">{product.name}</h3>
            <p className="text-green-600 font-bold">${product.price}</p>
            <div className="text-sm text-gray-500 mt-1">Stock: {product.stock} | Sales: {product.sales}</div>
            <div className="flex justify-between mt-3">
              <button className="text-blue-600 hover:underline text-sm flex items-center">
                <Eye size={14} className="mr-1" /> View
              </button>
              <button className="text-green-600 hover:underline text-sm flex items-center">
                <Edit size={14} className="mr-1" /> Edit
              </button>
              <button className="text-red-600 hover:underline text-sm flex items-center">
                <Trash2 size={14} className="mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const AddProduct = () => {
    const [form, setForm] = useState({ name: '', price: '', stock: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`Product added: ${form.name}`);
      setForm({ name: '', price: '', stock: '' });
    };

    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">Add Product</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4 max-w-lg">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
            className="w-full border px-4 py-2 rounded"
          />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            type="number"
            placeholder="Price"
            required
            className="w-full border px-4 py-2 rounded"
          />
          <input
            name="stock"
            value={form.stock}
            onChange={handleChange}
            type="number"
            placeholder="Stock"
            required
            className="w-full border px-4 py-2 rounded"
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Submit
          </button>
        </form>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <main className="flex-1 p-6 space-y-8 overflow-y-auto">
        {activeTab === 'overview' && <Overview />}
        {activeTab === 'products' && <Products />}
        {activeTab === 'add-product' && <AddProduct />}
      </main>
    </div>
  );
};

export default SellerDashboard;

