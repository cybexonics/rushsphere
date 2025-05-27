import React, { useState } from 'react';
import { Button } from '@/components/ui/button'; // Adjust the import if needed
import { useNavigate } from 'react-router-dom';

const NewProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating Product:', form);
    // TODO: Call API to create product
    navigate('/vendor/products');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded"
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock Quantity"
          value={form.stock}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded"
        />
        <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white w-full">
          Create Product
        </Button>
      </form>
    </div>
  );
};

export default NewProduct;

