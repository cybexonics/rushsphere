import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { getData } from '@/lib/getData';
import { transformProductData } from '@/lib/transformProductData';

const AllProducts = () => {
  const [productsData, setProductsData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getData("products?populate=*");
      const fetchedProduct = res?.data;
      const transformed = transformProductData(fetchedProduct);
      setProductsData(transformed);
    };

    fetchData();
  }, []);

  if (productsData === null) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">All Products</h1>

        {productsData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold mb-2">No products found</h2>
            <p className="text-gray-500">There are no products to display.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productsData.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllProducts;

