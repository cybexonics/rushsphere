
import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

import { useCart } from "@/context/CartProvider"


const Cart = () => {
  const { cart,removeFromCart,updateCartQuantity } = useCart()
  const { toast } = useToast();

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartQuantity(id,newQuantity)
   
  };

  const removeItem = (id: number) => {
    removeFromCart(id)
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart",
    });
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const price = item.product.discount ? 
        item.product.price * (1 - item.product.discount / 100) : 
        item.product.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = 5.99;
  const tax = subtotal * 0.10; // 10% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-10 h-10 text-gray-400" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven&apos;t added any items to your cart yet.</p>
            <Link to="/products">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                {/* Headers */}
                <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b text-sm font-medium text-gray-500">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                {/* Cart items */}
                {cart.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 py-6 border-b last:border-0 items-center">
                    {/* Product image and info */}
                    <div className="col-span-12 md:col-span-6">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={item.product.image} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div>
                          <h3 className="font-medium text-gray-800">{item.product.name}</h3>
                          <p className="text-sm text-gray-500">Vendor: {item.product.vendor.name}</p>
                          {item.old_price && (
                            <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded mt-1">
                              {item.product.old_price}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity controls */}
                   <div className="col-span-5 md:col-span-2 flex items-center justify-center">
  <div className="flex items-center border rounded-md">
    <button 
      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
      className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
      aria-label="Decrease quantity"
      disabled={item.quantity <= 1}
    >
      <Minus className="w-4 h-4" />
    </button>
    <span className="px-3 py-1 border-x">{item.quantity}</span>
    <button 
      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
      className="px-3 py-1 hover:bg-gray-100"
      aria-label="Increase quantity"
    >
      <Plus className="w-4 h-4" />
    </button>
  </div>
</div>

                    {/* Price */}
                    <div className="col-span-3 md:col-span-2 text-right">
                      {item.product.old_price ? (
                        <div>
                          <span className="line-through text-gray-400 text-sm">${item.product.old_price}</span>
                          <span className="text-gray-800 font-medium ml-2">
                            ${item.product.price}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-800 font-medium">${item.product.price}</span>
                      )}
                    </div>

                    {/* Total price */}
                    <div className="col-span-3 md:col-span-1 text-right">
                      <div className="flex flex-col text-gray-800 font-medium">
                        ${((item.product.old_price ? item.product.price : item.product.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>

                    {/* Remove button */}
                    <div className="col-span-1 text-right">
                      <button 
                        onClick={() => removeItem(item.product.id)} 
                        className="text-gray-400 hover:text-red-500"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link to="/checkout">
                  <Button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center gap-2">
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                
                <Link to="/products">
                  <Button variant="outline" className="w-full mt-4">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
