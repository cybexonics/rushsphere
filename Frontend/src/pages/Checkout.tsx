
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, CreditCard, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from "@/context/CartProvider";

const Checkout = () => {
  const { toast } = useToast();
  const { cart } = useCart();
   const steps = [
    { id: 1, label: 'Cart' },
    { id: 2, label: 'Shipping' },
    { id: 3, label: 'Payment' },
    { id: 4, label: 'Confirmation' },
  ];
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'paypal' | 'apple_pay'>('credit_card');
  
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
  
  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
    window.scrollTo(0, 0);
  };
  
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirmation');
    toast({
      title: "Order placed successfully!",
      description: "Your order has been received and is being processed.",
    });
    window.scrollTo(0, 0);
  };

    const getStepStatus = (current: number) => {
    const stepOrder = ['cart', 'shipping', 'payment', 'confirmation'];
    const currentIndex = stepOrder.indexOf(step);
    return currentIndex >= current ? 'completed' : currentIndex + 1 === current ? 'active' : 'pending';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        {/* Checkout Step Tracker */}
<div className="mb-8">
  <div className="flex justify-between sm:justify-center gap-4 overflow-x-auto px-1">
    {steps.map((s, index) => {
      const status = getStepStatus(s.id);
      return (
        <div key={s.id} className="flex flex-col items-center text-center min-w-[60px]">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center 
              ${status === 'completed' ? 'bg-green-500' 
              : status === 'active' ? 'bg-blue-600' 
              : 'bg-gray-300'}`}
          >
            {status === 'completed' ? (
              <Check className="w-5 h-5 text-white" />
            ) : (
              <span className="text-white text-sm font-medium">{s.id}</span>
            )}
          </div>
          <span
            className={`mt-1 text-xs sm:text-sm font-medium 
              ${status === 'completed' || status === 'active' ? 'text-gray-800' : 'text-gray-400'}`}
          >
            {s.label}
          </span>
        </div>
      );
    })}
  </div>
</div>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Shipping Information */}
            {step === 'shipping' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
                <form onSubmit={handleContinueToPayment}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Enter your first name" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Enter your last name" required />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="Enter your email" required />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="Enter your phone number" required />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" placeholder="Enter your street address" required />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="Enter your city" required />
                    </div>
                    <div>
                      <Label htmlFor="state">State/Province</Label>
                      <Input id="state" placeholder="Enter your state/province" required />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                      <Input id="zipCode" placeholder="Enter your ZIP/postal code" required />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" placeholder="Enter your country" required />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="notes">Special Instructions (Optional)</Label>
                      <Textarea id="notes" placeholder="Add any special delivery instructions" />
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 flex items-center gap-2"
                    >
                      Continue to Payment <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Payment Information */}
            {step === 'payment' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
                <form onSubmit={handlePlaceOrder}>
                  <div className="mb-6">
                    <RadioGroup 
                      defaultValue={paymentMethod} 
                      value={paymentMethod}
                      onValueChange={(value) => setPaymentMethod(value as 'credit_card' | 'paypal' | 'apple_pay')}
                      className="grid grid-cols-1 md:grid-cols-3 gap-3"
                    >
                      <div className="flex items-center border rounded-lg p-4 hover:border-purple-400 cursor-pointer">
                        <RadioGroupItem id="credit_card" value="credit_card" />
                        <Label htmlFor="credit_card" className="flex items-center ml-3 cursor-pointer">
                          <CreditCard className="h-5 w-5 mr-2" />
                          Credit Card
                        </Label>
                      </div>
                      <div className="flex items-center border rounded-lg p-4 hover:border-purple-400 cursor-pointer">
                        <RadioGroupItem id="paypal" value="paypal" />
                        <Label htmlFor="paypal" className="cursor-pointer ml-3">PayPal</Label>
                      </div>
                      <div className="flex items-center border rounded-lg p-4 hover:border-purple-400 cursor-pointer">
                        <RadioGroupItem id="apple_pay" value="apple_pay" />
                        <Label htmlFor="apple_pay" className="cursor-pointer ml-3">Apple Pay</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {paymentMethod === 'credit_card' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input id="cardName" placeholder="Enter the name on your card" required />
                      </div>
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="xxxx xxxx xxxx xxxx" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input id="expiryDate" placeholder="MM/YY" required />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="xxx" required />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {paymentMethod === 'paypal' && (
                    <div className="bg-gray-100 p-4 rounded-md text-center">
                      <p>You will be redirected to PayPal to complete your payment after placing the order.</p>
                    </div>
                  )}
                  
                  {paymentMethod === 'apple_pay' && (
                    <div className="bg-gray-100 p-4 rounded-md text-center">
                      <p>You will be prompted to complete your payment with Apple Pay after placing the order.</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between mt-8">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep('shipping')}
                    >
                      Back to Shipping
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 flex items-center gap-2"
                    >
                      Place Order <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Order Confirmation */}
            {step === 'confirmation' && (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Thank You for Your Order!</h2>
                <p className="text-gray-600 mb-6">Your order has been received and is being processed.</p>
                
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <h3 className="font-semibold mb-2">Order Summary</h3>
                  <p className="text-sm text-gray-600">Order #: {Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
                  <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Total: ${total.toFixed(2)}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button asChild>
                    <Link to="/orders">View Order Status</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/products">Continue Shopping</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-4">
                    <img 
                      src={item.product.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{item.product.name}</h4>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium">
                        ${((item.product.discount ? item.product.price * (1 - item.product.discount / 100) : item.product.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
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
              
              {step !== 'confirmation' && (
                <div className="mt-6">
                  <p className="text-xs text-gray-500 mb-4">
                    By completing your purchase, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
