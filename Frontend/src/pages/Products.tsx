import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronDown, Search, X } from 'lucide-react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { getData } from '@/lib/getData';
import { transformProductData } from '@/lib/transformProductData';

// Mock categories data
const categories = [
  { id: 'electronics', name: 'Electronics', count: 124 },
  { id: 'fashion', name: 'Fashion', count: 98 },
  { id: 'men-s', name: "Men's", count: 56 },
  { id: 'sports', name: 'Sports & Outdoors', count: 43 },
  { id: 'books', name: 'Books', count: 87 },
  { id: 'beauty', name: 'Beauty & Personal Care', count: 65 },
  { id: 'toys', name: 'Toys & Games', count: 32 },
];

// Mock brands data
const brands = [
  { id: 'apple', name: 'Apple', count: 34 },
  { id: 'samsung', name: 'Samsung', count: 28 },
  { id: 'nike', name: 'Nike', count: 42 },
  { id: 'adidas', name: 'Adidas', count: 36 },
  { id: 'sony', name: 'Sony', count: 19 },
  { id: 'lg', name: 'LG', count: 22 },
  { id: 'dell', name: 'Dell', count: 17 },
];

// Mock product data
// const productsData = Array(24).fill(null).map((_, index) => ({
//   id: `product-${index + 1}`,
//   name: [
//     'Wireless Bluetooth Headphones',
//     'Smart Watch Series 5',
//     'Ultra HD 4K TV',
//     'Portable Bluetooth Speaker',
//     'Gaming Laptop',
//     'Wireless Charging Pad',
//     'Professional DSLR Camera',
//     'Ergonomic Office Chair',
//   ][index % 8],
//   price: Math.floor(Math.random() * 90000 + 1000) / 100,
//   originalPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 120000 + 15000) / 100 : undefined,
//   rating: (Math.random() * 2 + 3).toFixed(1),
//   image: '/placeholder.svg',
//   vendor: [
//     'ElectroTech',
//     'GadgetWorld',
//     'FashionNova',
//     'HomeEssentials',
//     'SportsPro',
//     'BookHaven',
//   ][index % 6],
//   category: Object.values(categories)[index % categories.length].id,
//   brand: Object.values(brands)[index % brands.length].id,
//   isNew: Math.random() > 0.8,
//   discount: Math.random() > 0.7 ? Math.floor(Math.random() * 40) + 5 : undefined,
// }));

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Best Rating', value: 'rating' },
];

const AllProducts = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [productsData,setProductsData] = useState(null);
  
  // Get filter values from URL parameters
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const minPrice = Number(searchParams.get('minPrice') || 0);
  const maxPrice = Number(searchParams.get('maxPrice') || 10000);
  const sort = searchParams.get('sort') || 'featured';
  const query = searchParams.get('q') || '';
  const newOnly = searchParams.get('new') === 'true';
  const onSale = searchParams.get('sale') === 'true';
  useEffect(()=>{
    const fetchData = async() =>{
      const res = await getData("products?populate=*");
      const fetchedProduct = res?.data;
      const transformed = transformProductData(fetchedProduct);
      setProductsData(transformed);
      console.log(res)
    }

    fetchData();
  },[])

  if (productsData === null) return <p className="text-center">Loading....</p>
  
  // Filter and sort products
  const filteredProducts = productsData.filter(product => {
    // Filter by search query
    if (query && !product.name.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (category && product?.category?.slug !== category) {
      return false;
    }
    
    
    // Filter by price range
    if (product.price < minPrice || product.price > maxPrice) {
      return false;
    }
    
    // Filter by "new" flag
    if (newOnly && !product.isNew) {
      return false;
    }
    
    // Filter by "on sale" (has discount)
    if (onSale && !product.old_price) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    switch (sort) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'newest':
        return Number(b.id.split('-')[1]) - Number(a.id.split('-')[1]);
      case 'rating':
        return parseFloat(b.rating) - parseFloat(a.rating);
      default:
        // featured - keep original order
        return 0;
    }
  });
  
  // Handle filter changes
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    setSearchParams(params);
  };
  
  const toggleFilter = (key: string, value: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, 'true');
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };
  
  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    setSearchParams(params);
  };
  
  // Count active filters
  const activeFilterCount = [
    category,
    brand,
    minPrice > 0,
    maxPrice < 10000,
    newOnly,
    onSale
  ].filter(Boolean).length;
  
  // Render filter sidebar
  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Price Range Filter */}
      <div>
        <h3 className="font-medium mb-4">Price Range</h3>
        <Slider
          defaultValue={[minPrice, maxPrice]}
          min={0}
          max={10000}
          step={100}
          value={[minPrice, maxPrice]}
          onValueChange={(values) => {
            updateFilter('minPrice', values[0].toString());
            updateFilter('maxPrice', values[1].toString());
          }}
          className="mb-6"
        />
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="min-price">Min</Label>
            <Input
              id="min-price"
              type="number"
              value={minPrice}
              onChange={(e) => updateFilter('minPrice', e.target.value)}
              className="w-24"
            />
          </div>
          <div>
            <Label htmlFor="max-price">Max</Label>
            <Input
              id="max-price"
              type="number"
              value={maxPrice}
              onChange={(e) => updateFilter('maxPrice', e.target.value)}
              className="w-24"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Category Filter */}
      <div>
        <h3 className="font-medium mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center">
              <Checkbox
                id={`category-${cat.id}`}
                checked={category === cat.id}
                onCheckedChange={() => updateFilter('category', category === cat.id ? '' : cat.id)}
              />
              <label
                htmlFor={`category-${cat.id}`}
                className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex justify-between w-full"
              >
                <span>{cat.name}</span>
                <span className="text-gray-500">({cat.count})</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Brand Filter */}
      <div>
        <h3 className="font-medium mb-4">Brands</h3>
        <div className="space-y-2">
          {brands.map((b) => (
            <div key={b.id} className="flex items-center">
              <Checkbox
                id={`brand-${b.id}`}
                checked={brand === b.id}
                onCheckedChange={() => updateFilter('brand', brand === b.id ? '' : b.id)}
              />
              <label
                htmlFor={`brand-${b.id}`}
                className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex justify-between w-full"
              >
                <span>{b.name}</span>
                <span className="text-gray-500">({b.count})</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Other Filters */}
      <div>
        <h3 className="font-medium mb-4">Other Filters</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <Checkbox
              id="filter-new"
              checked={newOnly}
              onCheckedChange={(checked) => toggleFilter('new', checked as boolean)}
            />
            <label
              htmlFor="filter-new"
              className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              New Arrivals
            </label>
          </div>
          <div className="flex items-center">
            <Checkbox
              id="filter-sale"
              checked={onSale}
              onCheckedChange={(checked) => toggleFilter('sale', checked as boolean)}
            />
            <label
              htmlFor="filter-sale"
              className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              On Sale
            </label>
          </div>
        </div>
      </div>

      <Separator />
      
      {/* Clear Filters Button */}
      {activeFilterCount > 0 && (
        <Button
          variant="outline"
          className="w-full"
          onClick={clearAllFilters}
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );
  
  // Search handler
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('search') as string;
    
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set('q', searchQuery);
    } else {
      params.delete('q');
    }
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">
            {category ? categories.find(c => c.id === category)?.name : 'All Products'}
            {query && <span className="text-gray-500"> - Search: "{query}"</span>}
          </h1>
          
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select 
              value={sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="border rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Sidebar - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <FilterSidebar />
          </div>
          
          {/* Products Grid & Mobile Controls */}
          <div className="flex-1">
            {/* Mobile Search & Filters */}
            <div className="block md:hidden mb-6 space-y-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="relative">
                <Input
                  name="search"
                  placeholder="Search products..."
                  defaultValue={query}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7">
                  Search
                </Button>
              </form>
              
              <div className="flex justify-between">
                {/* Sort Dropdown - Mobile */}
                <div className="relative inline-block">
                  <select
                    value={sort}
                    onChange={(e) => updateFilter('sort', e.target.value)}
                    className="appearance-none border rounded-md py-2 pl-4 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
                
                {/* Filter Button - Mobile */}
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                      {activeFilterCount > 0 && (
                        <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                    <h2 className="text-xl font-bold mb-6 flex justify-between items-center">
                      Filters
                      {activeFilterCount > 0 && (
                        <Badge className="ml-1">
                          {activeFilterCount} active
                        </Badge>
                      )}
                    </h2>
                    <FilterSidebar />
                  </SheetContent>
                </Sheet>
              </div>
              
              {/* Active Filters - Mobile */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2">
                  {category && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Category: {categories.find(c => c.id === category)?.name}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('category', '')} />
                    </Badge>
                  )}
                  {brand && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Brand: {brands.find(b => b.id === brand)?.name}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('brand', '')} />
                    </Badge>
                  )}
                  {(minPrice > 0 || maxPrice < 10000) && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Price: ${minPrice} - ${maxPrice}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => {
                        updateFilter('minPrice', '0');
                        updateFilter('maxPrice', '10000');
                      }} />
                    </Badge>
                  )}
                  {newOnly && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      New Only
                      <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFilter('new', false)} />
                    </Badge>
                  )}
                  {onSale && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      On Sale
                      <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFilter('sale', false)} />
                    </Badge>
                  )}
                </div>
              )}
            </div>
            
            {/* Products Count */}
            <p className="text-gray-500 mb-6">{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found</p>
            {/*JSON.stringify(productsData)*/}
            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                    <Filter className="w-10 h-10 text-gray-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-semibold mb-2">No products found</h2>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search query.</p>
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// Simple label component to avoid shadcn import conflicts
const Label = ({ htmlFor, children, className = '' }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium mb-1 ${className}`}>
    {children}
  </label>
);

export default AllProducts;
