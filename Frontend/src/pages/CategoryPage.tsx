import React,{ useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { getData } from '@/lib/getData';

const products = [{
    id: '2',
    name: 'Bluetooth Wireless Earbuds',
    price: 79.99,
    rating: 4.5,
    image: '/placeholder.svg',
    vendor: 'AudioTech'
  },
  {
    id: '3',
    name: 'Premium Wired Headphones',
    price: 149.99,
    rating: 4.8,
    image: '/placeholder.svg',
    vendor: 'SoundMaster'
  },
  {
    id: '4',
    name: 'Portable Bluetooth Speaker',
    price: 89.99,
    originalPrice: 109.99,
    rating: 4.6,
    image: '/placeholder.svg',
    vendor: 'ElectroTech'
  },
  {
    id: '5',
    name: 'Noise Cancelling Earbuds',
    price: 119.99,
    rating: 4.4,
    image: '/placeholder.svg',
    vendor: 'SoundPro'
  }]

const CategoryPage = () => {
  const { categoryName, subcategoryName } = useParams();
  // const [products,setProducts] = useState([])
 useEffect(()=>{
  const fetchData = async() =>{
    const res = await getData('products')
    console.log(res)
    // setProducts(res?.data)
  }
  fetchData();
 },[])
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      {/*{JSON.stringify(products)} */}
     

      {/* Category Title */}
      <h1 className="text-3xl font-bold text-slate-800 mb-2">
        {subcategoryName
          ? subcategoryName?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          : categoryName?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        }
      </h1>
      <p className="text-slate-600 mb-6">
        Showing {products.length} products
      </p>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <Card className="sticky top-32">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <SlidersHorizontal size={18} />
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Price Range</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-slate-300 mr-2" />
                      <span className="text-sm">Under $25</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-slate-300 mr-2" />
                      <span className="text-sm">$25 - $50</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-slate-300 mr-2" />
                      <span className="text-sm">$50 - $100</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-slate-300 mr-2" />
                      <span className="text-sm">$100 - $200</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-slate-300 mr-2" />
                      <span className="text-sm">$200 & Above</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Brand</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-slate-300 mr-2" />
                      <span className="text-sm">Brand A</span>
                    </label>
                                        <label className="flex items-center">
                      <input type="checkbox" className="rounded border-slate-300 mr-2" />
                      <span className="text-sm">Brand B</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-slate-300 mr-2" />
                      <span className="text-sm">Brand C</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Rating</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-slate-300 mr-2" />
                      <span className="text-sm">4 Stars & Above</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-slate-300 mr-2" />
                      <span className="text-sm">3 Stars & Above</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-slate-300 mr-2" />
                      <span className="text-sm">2 Stars & Above</span>
                    </label>
                  </div>
                </div>

                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Apply Filters</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;

 

