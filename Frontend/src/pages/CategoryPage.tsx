import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getData } from '@/lib/getData';
import { transformProductData } from '@/lib/transformProductData';

const CategoryPage = () => {
  const { categoryName, subcategoryName } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        let filters = `filters[category][slug][$eq]=${categoryName}`;

        if (subcategoryName) {
          filters += `&filters[subcategory][slug][$eq]=${subcategoryName}`;
        }

        const res = await getData(`products?populate=*&${filters}`);
        const fetchedProducts = res?.data || [];
        const transformed = transformProductData(fetchedProducts);
        setProducts(transformed);
      } catch (error) {
        console.error('Error fetching category products:', error);
      }
    };

    fetchCategoryProducts();
  }, [categoryName, subcategoryName]);

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Products in {categoryName} {subcategoryName ? ` > ${subcategoryName}` : ''}
        </h1>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((item, index) => (
              <ProductCard key={index} {...item} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No products found.</p>
        )}

        <div className="text-center mt-8">
          <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;

