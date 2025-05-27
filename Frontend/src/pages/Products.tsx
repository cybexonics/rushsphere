import React,{ useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getData } from  '@/lib/getData';



const Products = () => {
  const [products,setProducts] = useState([])
 useEffect(()=>{
  const fetchData = async() =>{
    const res = await getData('/products')
    console.log(res)
    setProducts(res)
  }
 },[])

  return (
    <div className="min-h-screen bg-white">
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">All Products</h1>
       {JSON.stringify(products)}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item,index) => (
            <ProductCard key={index} {...item} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
        </div>
      </main>
    </div>
  );
};

export default Products;
