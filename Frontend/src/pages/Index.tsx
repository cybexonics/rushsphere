
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Mail } from 'lucide-react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { Card } from '@/components/ui/card';

const Index = () => {
  // Mock product data
  const featuredProducts = [
    {
      id: '1',
      name: 'Wireless Bluetooth Headphones',
      price: 89.99,
      originalPrice: 129.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&crop=center',
      rating: 4.5,
      seller: 'TechStore'
    },
    {
      id: '2',
      name: 'Smartphone Protective Case',
      price: 24.99,
      originalPrice: 39.99,
      image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=400&h=300&fit=crop&crop=center',
      rating: 4.2,
      seller: 'CaseWorld'
    },
    {
      id: '3',
      name: 'Premium Coffee Beans',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop&crop=center',
      rating: 4.8,
      seller: 'CoffeeMasters'
    },
    {
      id: '4',
      name: 'Yoga Mat with Carrying Strap',
      price: 35.99,
      originalPrice: 49.99,
      image: 'https://images.unsplash.com/photo-1506629905851-b1906cb22c59?w=400&h=300&fit=crop&crop=center',
      rating: 4.3,
      seller: 'FitLife'
    },
    {
      id: '5',
      name: 'Minimalist Desk Lamp',
      price: 45.99,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center',
      rating: 4.6,
      seller: 'HomeDesign'
    },
    {
      id: '6',
      name: 'Organic Skincare Set',
      price: 67.99,
      originalPrice: 89.99,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop&crop=center',
      rating: 4.7,
      seller: 'NaturalBeauty'
    }
  ];

  const categories = [
    {
      name: 'Electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop&crop=center',
      count: '1,234 products'
    },
    {
      name: 'Fashion',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop&crop=center',
      count: '2,567 products'
    },
    {
      name: 'Home & Garden',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop&crop=center',
      count: '1,890 products'
    },
    {
      name: 'Sports',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop&crop=center',
      count: '756 products'
    }
  ];

  // Banner items for the main shopping categories
  const bannerItems = [
    {
      name: "Footwear",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=400&fit=crop&crop=center",
      link: "/category/footwear"
    },
    {
      name: "Men's Wear",
      image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800&h=400&fit=crop&crop=center",
      link: "/category/mens-wear"
    },
    {
      name: "Ladies' Wear",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=400&fit=crop&crop=center",
      link: "/category/ladies-wear"
    },
    {
      name: "Watches",
      image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&h=400&fit=crop&crop=center",
      link: "/category/watches"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <Hero />

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">
            Popular Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-slate-900/20 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                      <p className="text-sm">{category.count}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          <div className="text-center mt-10">
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 bg-indigo-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">
            Why Choose RushSphere?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Easy to Find</h3>
              <p className="text-slate-600">
                Search millions of products from thousands of sellers with our advanced search technology.
              </p>
            </div>
            
            <div className="text-center bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Trusted Sellers</h3>
              <p className="text-slate-600">
                All our sellers are verified and approved to ensure you get authentic products and great service.
              </p>
            </div>
            
            <div className="text-center bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">24/7 Support</h3>
              <p className="text-slate-600">
                Our dedicated support team is always ready to help you with any questions or concerns.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
