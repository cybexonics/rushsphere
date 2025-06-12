import React, { useState, useEffect } from 'react';
// No need to import useRouter from 'next/router'
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { getData } from '@/lib/getData';
import { transformProductData } from '@/lib/transformProductData';

const AllProducts = () => {
  const [productsData, setProductsData] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state for better UX
  const [searchQuery, setSearchQuery] = useState(''); // State for the search input value

  // Function to extract search query from URL
  const getSearchQueryFromUrl = () => {
    if (typeof window !== 'undefined') { // Check if window is defined (client-side)
      const params = new URLSearchParams(window.location.search);
      return params.get('search') || ''; // Get the 'search' parameter
    }
    return '';
  };

  useEffect(() => {
    const currentSearch = getSearchQueryFromUrl();
    setSearchQuery(currentSearch); // Initialize search input with URL query

    const fetchData = async (query) => {
      setLoading(true); // Set loading to true when fetching starts
      setProductsData(null); // Clear previous data to show loading state

      let apiUrl = "products?populate=*";
      if (query) {
        // If a search query exists, add a filter to the API call
        // Adjust 'name' to the actual field in your Strapi/backend
        apiUrl = `products?populate=*&filters[name][$containsi]=${query}`;
      }

      try {
        const res = await getData(apiUrl);
        const fetchedProduct = res?.data;
        const transformed = transformProductData(fetchedProduct);
        setProductsData(transformed);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProductsData([]); // Set to empty array on error
      } finally {
        setLoading(false); // Set loading to false when fetching is complete
      }
    };

    // Re-fetch data whenever the URL's search parameter changes
    // This effect runs on component mount and whenever window.location.search changes
    // (though we can't directly add window.location.search to dependencies easily)
    // A simpler way to trigger re-fetch is to rely on the search bar's internal state
    // changing the URL, which will cause a re-render and re-evaluation of getSearchQueryFromUrl().
    fetchData(currentSearch);
  }, [window.location]); // Depend on window.location.search for re-fetching

  // Function to handle changes in the search input
  // If you also want to trigger search on 'Enter' key press


  if (loading) {
    return <p className="text-center">Loading products...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
        </h1>

        {/* Search Bar Section */}

        {productsData.length === 0 && !loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold mb-2">
              {searchQuery ? `No products found for "${searchQuery}"` : "No products found"}
            </h2>
            <p className="text-gray-500">
              {searchQuery
                ? "Please try a different search term."
                : "There are no products to display."}
            </p>
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
