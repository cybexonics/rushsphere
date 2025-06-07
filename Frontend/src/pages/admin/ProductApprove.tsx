import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminProductApproval = () => {
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch products where isApproved is false
  const fetchPendingProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://rushsphere.onrender.com/api/products?filters[isApproved][$eq]=false,null&populate=*');
      const data = await res.json();
      setPendingProducts(data.data); // Strapi v4 returns data inside `data`
      console.log(data.data[2])
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  // ✅ Approve a product
  const approveProduct = async (id: number) => {
    try {
      const res = await fetch(`https://rushsphere.onrender.com/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: { isApproved: true },
        }),
      });
      setPendingProducts(prev => prev.filter(product => product.id !== id));
      alert("Approved")
    } catch (err) {
      console.error('Approval failed', err);
    }
  };

  // ❌ Reject: (for demo, just remove from UI)
  const rejectProduct = (id: number) => {
    setPendingProducts(prev => prev.filter(product => product.id !== id));
    alert(`Product ${id} rejected.`);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Pending Product Approvals</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {pendingProducts.map(product => (
            <div
              key={product.id}
              className="bg-white shadow rounded-lg p-4 flex justify-between items-center border"
            >
              <div className="flex gap-5">
                <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                <div>
                <h4 className="text-lg font-semibold">{product?.name}</h4>
                <p className="text-sm text-gray-600">
                  Vendor: {product.vendor?.businessName || 'Unknown'} | Category:{' '}
                  {product.category.name}
                </p>
                <p className="text-sm text-gray-800">Price: ₹{product?.price}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link to={`/product/${product.slug}`}>
                   <Button
                    className="bg-white border text-black hover:bg-white"
                  >
                    View
                  </Button>
                </Link>
                <Button
                  onClick={() => approveProduct(product.documentId)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-1" /> Approve
                </Button>
                <Button onClick={() => rejectProduct(product.documentId)} variant="destructive">
                  <XCircle className="w-4 h-4 mr-1" /> Reject
                </Button>
              </div>
            </div>
          ))}
          {pendingProducts.length === 0 && (
            <p className="text-center text-gray-500">No pending products at the moment.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProductApproval;

