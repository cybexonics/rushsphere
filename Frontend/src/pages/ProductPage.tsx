
import React,{ useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Truck, ArrowLeft, Eye, Home, ChevronRight, Share2, RotateCcw, Shield, Facebook, Twitter, Instagram, Minus, Plus  } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import ProductCard from '@/components/ProductCard';

import { useCart } from "@/context/CartProvider"
import { getData } from '@/lib/getData';
import { transformProductData } from '@/lib/transformProductData';

// Mock product data
// const product = {
//   id: '1',
//   name: 'Wireless Noise Cancelling Headphones',
//   price: 129.99,
//   originalPrice: 169.99,
//   discount: 23,
//   rating: 4.7,
//   reviews: 432,
//   availability: 'In Stock',
//   vendor: 'ElectroTech',
//   vendorRating: 4.8,
//   description: 'Experience crystal clear audio with our premium wireless headphones. Features active noise cancellation, 30-hour battery life, and comfortable over-ear design for extended listening sessions.',
//   features: [
//     'Active Noise Cancellation Technology',
//     '30-hour Battery Life',
//     'Premium Sound Quality',
//     'Comfortable Over-Ear Design',
//     'Voice Assistant Compatible',
//     'Built-in Microphone'
//   ],
//   specifications: {
//     'Bluetooth Version': '5.0',
//     'Battery Life': '30 hours',
//     'Charging Time': '2 hours',
//     'Driver Size': '40mm',
//     'Frequency Response': '20Hz - 20kHz',
//     'Impedance': '32 ohms'
//   },
//   images: [
//     '/placeholder.svg',
//     '/placeholder.svg',
//     '/placeholder.svg',
//     '/placeholder.svg',
//   ],
//   colors: ['Black', 'White', 'Blue'],
//   isNew: true,
//   tags: ['electronics', 'headphones', 'wireless']
// };

// Mock related products
const relatedProducts = [
  {
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
  }
];

const ProductPage = () => {
   const { slug } = useParams();
  const { toast } = useToast();
  const { cart, addToCart } = useCart();

  
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductBySlug = async () => {
      try {
        const res = await getData(`products?filters[slug][$eq]=${slug}&populate=*`);
        const fetchedProduct = res?.data;
        const transformed = transformProductData(fetchedProduct);
        console.log(transformed)
        setProduct(transformed);

        // if (fetchedProduct?.attributes?.colors?.length > 0) {
        //   setSelectedColor(fetchedProduct.attributes.colors[0]);
        // }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    if (slug) fetchProductBySlug();
  }, [slug]);
  
  const handleAddToCart = () => {
    addToCart(product[0],selectedColor)
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your cart.`,
    });
  };
  
  const handleAddToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: `${product.name} added to your wishlist.`,
    });
  };

  if(!product) return<p>{JSON.stringify(product)}</p>

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {JSON.stringify(product[0])}
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb navigation */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Button variant="ghost" size="sm" className="mr-2 p-0 h-auto" asChild>
            <a href="/products">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to products
            </a>
          </Button>
        </div>
        
        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-md p-10 md:mx-10 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images Gallery */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                <img 
                  src={"/placeholder.svg"} 
                  alt={product?.[0]?.name} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex gap-2">
                {product?.[0]?.images?.map((img, index) => (
                  <div 
                    key={index} 
                    className={`aspect-square w-20 rounded-md overflow-hidden cursor-pointer border-2 p-1 ${
                      selectedImage === index ? 'border-purple-600' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={img} 
                      alt={`${product?.[0]?.name} view ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex gap-2 flex-wrap">
                  {product?.[0]?.isNew && (
                    <Badge className="bg-blue-600">New</Badge>
                  )}
                  {product?.discount > 0 && (
                    <Badge className="bg-red-600">Sale {product?.discount}% OFF</Badge>
                  )}
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold mt-3">{product?.[0]?.name}</h1>
                
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} 
                        className={`h-4 w-4 ${
                          i < Math.floor(product?.[0]?.rating) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product?.[0]?.rating} ({product?.[0]?.reviews} reviews)
                  </span>
                </div>
                
                <div className="mt-4">
                  <span className="text-lg text-gray-500">Sold by: </span>
                  <a href={`/vendors/${product?.vendor}`} className="text-lg font-medium text-purple-700 hover:underline">
                    {product?.[0]?.vendor?.name}
                  </a>
                  <span className="ml-2 text-sm text-gray-600">
                    ({product?.[0]?.vendor?.rating} ★)
                  </span>
                </div>
              </div>
              
              <div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">
                    ${product?.[0]?.price?.toFixed(2)}
                  </span>
                  {product?.[0]?.old_price && (
                    <span className="ml-3 text-lg text-gray-500 line-through">
                      ${product?.[0]?.old_price?.toFixed(2)}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-green-600 flex items-center mt-2">
                  <Truck className="h-4 w-4 mr-1" />
                  {product?.[0]?.availability} - Free shipping
                </p>
              </div>
              
              <Separator />
              
              {/* Color Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
                <div className="flex gap-3">
                  {product?.[0]?.tags?.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1 border rounded-md ${
                        selectedColor === color 
                          ? 'border-purple-600 bg-purple-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Quantity Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="border border-gray-300 rounded-l-md px-3 py-1 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="border-t border-b border-gray-300 px-4 py-1">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="border border-gray-300 rounded-r-md px-3 py-1 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 flex items-center gap-2 text-white"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-300 hover:bg-purple-50 hover:border-purple-300 flex items-center gap-2"
                  onClick={handleAddToWishlist}
                >
                  <Heart className="h-4 w-4" />
                  Add to Wishlist
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                <button className="flex items-center hover:text-purple-600">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </button>
                <button className="flex items-center hover:text-purple-600">
                  <Eye className="h-4 w-4 mr-1" />
                  Viewed {Math.floor(Math.random() * 100) + 10} times today
                </button>
              </div>


                <Card className="mb-6">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start">
                <Truck size={18} className="mr-2 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Free Shipping</h3>
                  <p className="text-xs text-slate-500">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-start">
                <RotateCcw size={18} className="mr-2 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">30-Day Returns</h3>
                  <p className="text-xs text-slate-500">Hassle-free returns</p>
                </div>
              </div>
              <div className="flex items-start">
                <Shield size={18} className="mr-2 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Secure Checkout</h3>
                  <p className="text-xs text-slate-500">Safe & protected shopping</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Share */}
          <div className="flex items-center">
            <span className="text-sm font-medium mr-3">Share:</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" className="w-8 h-8 p-0">
                <Facebook size={16} />
              </Button>
              <Button variant="outline" size="icon" className="w-8 h-8 p-0">
                <Twitter size={16} />
              </Button>
              <Button variant="outline" size="icon" className="w-8 h-8 p-0">
                <Instagram size={16} />
              </Button>
              <Button variant="outline" size="icon" className="w-8 h-8 p-0">
                <Share2 size={16} />
              </Button>
            </div>
          </div>



      
            </div>
          </div>
        </div>


        
        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <Tabs defaultValue="description">
            <TabsList className="mb-6 w-full justify-start border-b overflow-x-auto flex-nowrap">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product?.[0]?.reviews})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="space-y-6">
              <div>
                <p className="text-gray-700">{product?.[0]?.description}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Key Features</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {product?.[0]?.features?.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="space-y-4">
              <h3 className="text-lg font-medium mb-2">Technical Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product?.[0]?.specifications || {})?.map(([key, value]) => (
                  <div key={key} className="flex border-b pb-3">
                    <span className="font-medium text-gray-700 w-1/2">{key}:</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="space-y-6">
              <div className="flex items-center">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-gray-900">{product?.[0]?.rating}</span>
                  <span className="text-lg text-gray-500 ml-2">out of 5</span>
                </div>
                <div className="ml-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} 
                        className={`h-5 w-5 ${
                          i < Math.floor(product?.[0]?.rating) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-500 mt-1">Based on {product?.[0]?.reviews} reviews</p>
                </div>
                <div className="ml-auto">
                  <Button>Write a Review</Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-6">
                <p className="text-gray-500 italic text-center">This is where reviews would appear. In a real implementation, this would display actual user reviews from a database.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related Products */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
