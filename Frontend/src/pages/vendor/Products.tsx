import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Ban, Trash2, Plus, CheckCircle, XCircle, Loader2  } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getData } from '@/lib/getData';
import axios from 'axios';
import { useAuth } from '@/context/AuthProvider'

const VendorProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // stores id of the product being modified
  const { vendor } = useAuth();

  const fetchProducts = async () => {
    try {
      const res = await getData('products?populate=*');
      setProducts(res?.data.filter(p=>p.vendor?.documentId === vendor.documentId));
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    console.log(vendor?.isApproved)
  }, []);

  const handleDelete = async (id) => {
    setActionLoading(id);
    try {
      await axios.delete(`https://rushsphere.onrender.com/api/products/${id}`);
      setProducts(prev => prev.filter(product => product.documentId !== id));
    } catch (err) {
      console.error('Failed to delete product:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleStock = async (id, state) => {
    setActionLoading(id);
    try {
      await axios.put(`https://rushsphere.onrender.com/api/products/${id}`, {
        data: {
          availability: state,
        },
      });
      setProducts(prev =>
        prev.map(product =>
          product.documentId === id ? { ...product, availability: state } : product
        )
      );
    } catch (err) {
      console.error('Failed to update stock status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <p className="text-sm text-gray-600">Manage and edit your products.</p>
        </div>
        {vendor?.isApproved && (
          <Link to="/vendor/products/new" className="bg-green-600 hover:bg-green-700 text-white mt-4 sm:mt-0 flex px-3 py-2 items-center rounded">
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Link>
          )}
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500">Product</th>
              <th className="px-6 py-3 font-medium text-gray-500">Category</th>
              <th className="px-6 py-3 font-medium text-gray-500">Price</th>
              <th className="px-6 py-3 font-medium text-gray-500">Create Date</th>
              <th className="px-6 py-3 font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const imageUrl = product.images[0] || 'https://via.placeholder.com/80';
                const isLoading = actionLoading === product.documentId;
                return (
                  <tr key={product.id}>
                    <td className="px-6 py-4 flex items-center gap-4">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{product.category?.name || '—'}</td>
                    <td className="px-6 py-4 text-gray-700">₹{product.price}</td>
                    <td className="px-6 py-4 text-gray-700">
                        {product.updatedAt ? new Date(product.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4">
  {product.isApproved ? (
    <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
      Approved
    </span>
  ) : (
    <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">
      Not Approved
    </span>
  )}
</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <Link to={`/vendor/products/edit/${product.slug}`}>
                          <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(product.documentId)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
  variant={product.availability ? 'destructive' : 'default'}
  size="sm"
  onClick={() => handleStock(product.documentId, !product.availability)}
  disabled={isLoading}
  className={`flex items-center gap-2 ${
    product.availability
      ? 'bg-red-600 hover:bg-red-700 text-white'
      : 'bg-green-600 hover:bg-green-700 text-white'
  }`}
>
  {isLoading ? (
    <Loader2 className="h-4 w-4 animate-spin" />
  ) : product.availability ? (
    <XCircle className="h-4 w-4" />
  ) : (
    <CheckCircle className="h-4 w-4" />
  )}
  {isLoading
    ? 'Processing...'
    : product.availability
    ? 'Mark Out of Stock'
    : 'Mark In Stock'}
</Button>

                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorProductList;

