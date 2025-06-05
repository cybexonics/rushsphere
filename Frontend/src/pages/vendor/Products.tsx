import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil,Ban, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getData } from '@/lib/getData';
import axios from 'axios';

const VendorProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await getData('products?populate=*');
      console.log(res)
      setProducts(res?.data || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async(id) => {
    // TODO: Add API logic
    await axios.delete(`https://rushsphere.onrender.com/api/products/${id}`)
  };

  const handleStock = async(id,state)=>{
    const res = await axios.put(`http://localhost:1337/api/products/${id}`,{
      data:{
        availability:state,
      }
    })
    console.log(res?.data)
    alert(`set Out of Stock ${state}`)
  }

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
              <th className="px-6 py-3 font-medium text-gray-500">Vendor</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Loading products...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No products found.</td>
              </tr>
            ) : (
              products.map((product) => {
                const imageUrl = product.images?.data?.[0]?.url || 'https://via.placeholder.com/80';
                return (
                  <tr key={product.id}>
                    <td className="px-6 py-4 flex items-center gap-4">
                      <img src={imageUrl} alt={product.name} className="w-12 h-12 rounded object-cover" />
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{product.category?.name || '—'}</td>
                    <td className="px-6 py-4 text-gray-700">${product.price}</td>
                    <td className="px-6 py-4 text-gray-700">{product.vendors?.[0]?.first_name || '—'}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <Link to={`/vendor/products/edit/${product.slug}`}>
                          <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(product.documentId)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {product.availability ? (
                        <Button variant="destructive" size="sm" onClick={() => handleStock(product.documentId,false)}>
                          <Ban className="h-4 w-4" /> Out of Stock
                        </Button>
                        ): (
                          <Button variant="destructive" size="sm" onClick={() => handleStock(product.documentId,true)}>
                          <Ban className="h-4 w-4" /> In Stcok
                        </Button>
                        )}
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

