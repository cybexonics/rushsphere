import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Heart, ShoppingCart, Star, Truck, ArrowLeft, Eye, Share2, RotateCcw, Shield, Minus, Plus } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import ProductCard from '@/components/ProductCard';

import { useCart } from "@/context/CartProvider";
import { getData } from '@/lib/getData';
import { transformProductData } from '@/lib/transformProductData';

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const { toast } = useToast();
  const { cart, wishlist, addToCart, addToWishlist } = useCart(); // Destructure wishlist from useCart

  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [relatedProduct, setRelatedProduct] = useState([]);

  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]); // Initialize with empty array

  // Check if the current product is in the wishlist
  const isProductInWishlist = wishlist.some(
    (item) => item.product.documentId === product?.[0]?.documentId
  );

  useEffect(() => {
    const fetchProductBySlug = async () => {
      try {
        const res = await getData(`products?filters[slug][$eq]=${slug}&populate=*`);
        const catRes = await getData(`products?populate=*`); // Fetch all products for related products
        
        const fetchedProduct = res?.data;
        const products = catRes?.data;

        const transformed = transformProductData(fetchedProduct);
        const transformedRelated = transformProductData(products);

        setProduct(transformed);
        // Filter out the current product from related products and take a few
        setRelatedProduct(transformedRelated.filter((p: any) => p.documentId !== transformed[0]?.documentId).slice(0, 4));

        setReviews(transformed?.[0]?.reviews || []); // Ensure reviews is an array
        
        // Set initial selected color/size if available
        if (transformed?.[0]?.other?.color?.length > 0) {
          setSelectedColor(transformed[0].other.color[0]);
        }
        if (transformed?.[0]?.other?.size?.length > 0) {
          setSelectedSize(transformed[0].other.size[0]);
        }

      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    if (slug) fetchProductBySlug();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product || !product[0]) return;

    // Pass selected color and size along with the product
    const productToAdd = { ...product[0], selectedColor, selectedSize };
    await addToCart(productToAdd, { color: selectedColor, size: selectedSize }, quantity); // Pass additional data as the second argument
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product?.[0]?.name} added to your cart.`,
    });
  };

  const handleAddToWishlist = async () => {
    if (!product || !product[0]) return;

    await addToWishlist(product[0]);
    toast({
      title: "Added to wishlist",
      description: `${product?.[0]?.name} added to your wishlist.`,
    });
  };

  const handleQuickBuy = async () => {
    if (!product || !product[0]) return;

    // Add to cart first
    const productToBuy = { ...product[0], selectedColor, selectedSize };
    await addToCart(productToBuy, { color: selectedColor, size: selectedSize }, quantity);

    toast({
      title: "Added to cart and proceeding to checkout",
      description: `${quantity} × ${product?.[0]?.name} added to your cart.`,
    });

    // Then navigate to the checkout page (replace with your actual checkout path)
    navigate('/checkout');
  };

  if (!product || product.length === 0) {
    return <p>Loading product details...</p>; // Or a spinner/skeleton loader
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
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
                  src={product?.[0]?.images?.[selectedImage]}
                  alt={product?.[0]?.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex gap-2">
                {product?.[0]?.images?.map((img: string, index: number) => (
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
                  {product?.[0]?.discount > 0 && (
                    <Badge className="bg-red-600">Sale {product?.[0]?.discount}% OFF</Badge>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-bold mt-3">{product?.[0]?.name}</h1>

                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product?.[0]?.rating || 0)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product?.[0]?.rating || 0} ({reviews?.length} reviews)
                  </span>
                </div>

                {/* Vendor Info Box */}
                <div className="mt-4 p-3 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sold by:</span>
                    <p
                      
                      className="text-sm font-semibold text-purple-700 "
                    >
                      {product?.[0]?.vendor?.name}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-1 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Rating: </span>
                      {product?.[0]?.vendor?.rating} ★
                    </div>
                    {product?.[0]?.vendor?.place && (
                      <div>
                        <span className="font-medium">Location: </span>
                        {product?.[0]?.vendor?.place}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{product?.[0]?.price}
                  </span>
                  {product?.[0]?.old_price && (
                    <span className="ml-3 text-lg text-gray-500 line-through">
                      ₹{product?.[0]?.old_price}
                    </span>
                  )}
                </div>

                <span
                  className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded-full ${
                    product?.[0]?.availability
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <Truck className="h-4 w-4 mr-1" />
                  {product?.[0]?.availability ? "Available" : "Currently Unavailable"}
                </span>
              </div>

              <Separator />

              {/* Color Selection */}
              {product?.[0]?.other?.color?.length > 0 ? (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
                  <div className="flex gap-3">
                    {product?.[0]?.other?.color?.map((color: string) => (
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
              ) : ""}

              {/* Size Selection */}
              {product?.[0]?.other?.size?.length > 0 ? (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
                  <div className="flex gap-3">
                    {product?.[0]?.other?.size?.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1 border rounded-md ${
                          selectedSize === size
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : ""}

              {/* Quantity Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center">
                  <Button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    variant="outline"
                    size="icon"
                    className="w-8 h-8 rounded-full"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="border-t border-b border-gray-300 px-4 py-1 mx-2">
                    {quantity}
                  </span>
                  <Button
                    onClick={() => setQuantity(prev => prev + 1)}
                    variant="outline"
                    size="icon"
                    className="w-8 h-8 rounded-full"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  className="bg-gradient-to-r from-purple-600 to-blue-600 flex items-center gap-2 text-white"
                  onClick={handleAddToCart}
                  disabled={!product?.[0]?.availability}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className={`flex items-center gap-2 ${
                    isProductInWishlist
                      ? 'border-red-500 text-red-500 bg-red-50'
                      : 'border-gray-300 hover:bg-purple-50 hover:border-purple-300'
                  }`}
                  onClick={handleAddToWishlist}
                  disabled={isProductInWishlist} // Disable if already in wishlist
                >
                  <Heart className={`h-4 w-4 ${isProductInWishlist ? 'fill-red-500' : ''}`} />
                  {isProductInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>

              {/* Quick Buy Button */}
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 mt-4"
                onClick={handleQuickBuy}
                disabled={!product?.[0]?.availability}
              >
                Buy Now
              </Button>

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
                    <RotateCcw size={18} className="mr-2 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      {product?.[0]?.other?.refund ? (
  <h3 className="font-semibold text-sm">{product[0].other.refund}-Day Returns</h3>
) : (
  <h3 className="font-semibold text-sm">No Returns Available</h3>
)}
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

              {/* Social Share Buttons (Optional, if you want specific social links) */}
              {/* <div className="flex items-center">
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
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <Tabs defaultValue="description">
            <TabsList className="mb-6 w-full justify-start border-b overflow-x-auto flex-nowrap">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews?.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-6">
              <div>
                <p className="text-gray-700">{product?.[0]?.description}</p>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="space-y-4">
              <h3 className="text-lg font-medium mb-2">Technical Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product?.[0]?.features || {}).map(([key, value]: [string, any]) => (
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
                  <span className="text-5xl font-bold text-gray-900">{product?.[0]?.rating || 0}</span>
                  <span className="text-lg text-gray-500 ml-2">out of 5</span>
                </div>
                <div className="ml-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product?.[0]?.rating || 0)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-500 mt-1">Based on {reviews?.length || 0} reviews</p>
                </div>
              </div>

              <Separator />

              {/* Review List */}
              <div className="space-y-4">
                {reviews?.length ? (
                  reviews?.map((review, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i}
                            className={`h-4 w-4 ${
                              i < review?.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-800 text-sm">{review?.review}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic text-center">No reviews yet.</p>
                )}
              </div>

              <Separator />

              {/* Review Form */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Write a Review</h4>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();

                    const newReview = {
                      data: {
                        product: product?.[0]?.documentId, // Use documentId for product reference in review
                        review: reviewComment,
                        rating: reviewRating,
                      },
                    };

                    try {
                      const response = await fetch("https://rushsphere.onrender.com/api/reviews", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newReview),
                      });

                      if (!response.ok) {
                        throw new Error("Failed to submit review");
                      }

                      const result = await response.json();
                      console.log(result);
                      // Update local reviews list with the newly submitted review
                      setReviews((prev) => [...prev, result.data.attributes]); // Assuming attributes contains the review data

                      setReviewComment("");
                      setReviewRating(0);
                      toast({
                        title: "Review Submitted!",
                        description: "Your review has been successfully submitted.",
                      });
                    } catch (error) {
                      console.error("Error submitting review:", error);
                      toast({
                        title: "Review Submission Failed",
                        description: "There was an error submitting your review. Please try again.",
                        variant: "destructive"
                      });
                    }
                  }}
                  className="space-y-3"
                >
                  <textarea
                    placeholder="Your Review"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    rows="3"
                    required
                  />
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 cursor-pointer ${
                          i < reviewRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                        onClick={() => setReviewRating(i + 1)}
                      />
                    ))}
                    <span className="ml-2 text-sm">{reviewRating} / 5</span>
                  </div>
                  <Button type="submit" disabled={!reviewComment || reviewRating === 0}>Submit Review</Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProduct.map((product: any) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
