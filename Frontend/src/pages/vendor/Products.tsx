import React from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Adjust path based on your project

const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: '$89.99',
    stock: 24,
    category: 'Electronics',
    imageUrl: 'https://via.placeholder.com/80',
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: '$199.99',
    stock: 12,
    category: 'Accessories',
    imageUrl: 'https://via.placeholder.com/80',
  },
  {
    id: 3,
    name: 'Bluetooth Speaker',
    price: '$79.99',
    stock: 8,
    category: 'Audio',
    imageUrl: 'https://via.placeholder.com/80',
  },
];

const VendorProductList = () => {
  const handleDelete = (id: number) => {
    // Logic to delete product (e.g., API call)
    alert(`Delete product with ID: ${id}`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <p className="text-sm text-gray-600">Manage and edit your products.</p>
        </div>
        <Link to="/vendor/products/new">
          <Button className="bg-green-600 hover:bg-green-700 text-white mt-4 sm:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500">Product</th>
              <th className="px-6 py-3 font-medium text-gray-500">Category</th>
              <th className="px-6 py-3 font-medium text-gray-500">Price</th>
              <th className="px-6 py-3 font-medium text-gray-500">Stock</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 flex items-center gap-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">{product.category}</td>
                <td className="px-6 py-4 text-gray-700">{product.price}</td>
                <td className="px-6 py-4 text-gray-700">{product.stock}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center space-x-2">
                    <Link to={`/vendor/products/edit/${product.id}`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorProductList;

