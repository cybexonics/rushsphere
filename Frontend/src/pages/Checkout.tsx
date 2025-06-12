import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, CreditCard, Wallet, ArrowRight, Home, PlusCircle } from 'lucide-react'; // Added Home and PlusCircle icons
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from "@/context/CartProvider";
import { getData } from "@/lib/getData";
import { Checkbox } from '@/components/ui/checkbox'; // Assuming you have this component

const steps = [
  { id: 1, label: 'Cart' },
  { id: 2, label: 'Shipping' },
  { id: 3, label: 'Payment' },
  { id: 4, label: 'Confirmation' },
];

// Define a type for address to ensure consistency (optional, but good for TypeScript)
type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

const Checkout = () => {
  const { toast } = useToast();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState('shipping');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null); // Type this more specifically if possible
  const [shippingInfo, setShippingInfo] = useState<Address & { name: string; email: string; phone: string; notes: string; }>({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    notes: ''
  });
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null); // Index for selected saved address
  const [saveNewAddress, setSaveNewAddress] = useState(true); // Control to save new address

  // --- Utility Functions ---

  const calculateTotals = useCallback(() => {
    const sub = cart.reduce((total, item) => {
      const price = item.product.discount ?
        item.product.price * (1 - item.product.discount / 100) :
        parseFloat(item.product.price); // Ensure price is a number
      return total + (price * item.quantity);
    }, 0);

    const ship = 0; // Assuming free shipping for now
    const tax = sub * 0; // Assuming 0% tax for now
    const totalAmount = sub + ship + tax;
    return { subtotal: sub, shipping: ship, tax: tax, total: totalAmount };
  }, [cart]);

  const { subtotal, shipping, tax, total } = calculateTotals();

  
    const getStepStatus = useCallback((current) => {
    const stepOrder = ['cart', 'shipping', 'payment', 'confirmation'];
    const currentIndex = stepOrder.indexOf(step);
    return currentIndex >= current ? 'completed' : currentIndex + 1 === current ? 'active' : 'pending';
  }, [step]);

  const loadRazorpay = useCallback(async () => {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  // --- Effects ---

  // Load user data and pre-fill shipping info on component mount
  useEffect(() => {
    const getUserAndAddresses = async () => {
      const storedUserId = localStorage.getItem('user');
      if (storedUserId) {
        try {
          const userData = await getData(`customers/${storedUserId}`);
          if (userData && userData.data) {
            setUser(userData.data);
            if (userData.data.address && userData.data.address.length > 0) {
              // Pre-fill with the first saved address by default
              const defaultAddress = userData.data.address[0];
              setShippingInfo(prev => ({
                ...prev,
                name: userData.data.name || "",
                email: userData.data.email || "",
                phone: userData.data.phone || "",
                street: defaultAddress.street || "",
                city: defaultAddress.city || "",
                state: defaultAddress.state || "",
                zip: defaultAddress.zip || ""
              }));
              setSelectedAddressIndex(0); // Select the first address
            } else {
              // If no addresses, just fill name, email, phone
              setShippingInfo(prev => ({
                ...prev,
                name: userData.data.name || "",
                email: userData.data.email || "",
                phone: userData.data.phone || "",
              }));
            }
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          toast({
            title: "Error",
            description: "Failed to load user information.",
            variant: "destructive"
          });
        }
      }
    };
    getUserAndAddresses();
  }, [toast]);


  // --- API Interactions ---

  const createOrder = async () => {
    const orderPayload = {
      name: shippingInfo.name,
      email: shippingInfo.email,
      phone: shippingInfo.phone,
      address: {
        street: shippingInfo.street,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zip: shippingInfo.zip
      },
      products: cart.map(item => ({
        product: { id: item.product.id, documentId: item.product.documentId }, // Only send necessary product info
        quantity: item.quantity,
        other: item.other || null // Include other if it exists
      })),
      payment: {
        method: paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'unpaid'
      },
      other: {
        total,
        notes: shippingInfo.notes,
        status: 'processing'
      }
    };

    try {
      const response = await fetch('https://rushsphere.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: orderPayload })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create order');
      }
      const result = await response.json();
      return result.data;
    } catch (error: any) {
      console.error('Order creation failed:', error);
      throw new Error(error.message || 'Order creation failed.');
    }
  };

  const updateOrderStatus = async (orderDocumentId: string, paymentStatus: 'confirmed' | 'processing' | 'pending') => {
    try {
      const updatedPaymentStatus = { status: paymentStatus, method: paymentMethod };
      const res = await fetch(`https://rushsphere.onrender.com/api/orders/${orderDocumentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { payment: updatedPaymentStatus } })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || 'Failed to update order status');
      }

      const json = await res.json();
      const newOrder = json.data;

      // Update user's orders and potentially addresses if logged in and saving new address
      if (user && user.documentId) {
        const updatedOrders = Array.isArray(user.orders) ? [newOrder, ...user.orders.filter(Boolean)] : [newOrder]; // Ensure valid array, filter nulls
        let updatedAddresses = Array.isArray(user.address) ? [...user.address] : []; // Ensure valid array

        // Add new address if checked and it's truly new
        const currentAddress = {
          street: shippingInfo.street,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zip: shippingInfo.zip
        };

        const isAddressNew = !updatedAddresses.some(
          (addr: Address) =>
            addr.street === currentAddress.street &&
            addr.city === currentAddress.city &&
            addr.state === currentAddress.state &&
            addr.zip === currentAddress.zip
        );

        if (saveNewAddress && isAddressNew) {
          updatedAddresses.push(currentAddress);
        }

        await fetch(`https://rushsphere.onrender.com/api/customers/${user.documentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: {
              address: updatedAddresses,
              orders: updatedOrders,
            }
          })
        });
        // Optionally, update the local user state
        setUser((prev: any) => ({
          ...prev,
          orders: updatedOrders,
          address: updatedAddresses,
        }));
      }
    } catch (error: any) {
      console.error('Failed to update order or customer data:', error);
      throw new Error(error.message || 'Failed to update order status or customer data.');
    }
  };

  // --- Handlers ---

  const handleInputChange = (field: keyof typeof shippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
    setSelectedAddressIndex(null); // Deselect any saved address if user manually edits
  };

  const handleSelectAddress = (index: number) => {
    if (user && user.address && user.address[index]) {
      const selectedAddr = user.address[index];
      setShippingInfo(prev => ({
        ...prev,
        street: selectedAddr.street || "",
        city: selectedAddr.city || "",
        state: selectedAddr.state || "",
        zip: selectedAddr.zip || ""
      }));
      setSelectedAddressIndex(index);
    }
  };


  const handleContinueToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic form validation for shipping info
      if (!shippingInfo.name || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.street || !shippingInfo.city || !shippingInfo.state || !shippingInfo.zip) {
        throw new Error('Please fill in all required shipping fields.');
      }

      setStep('payment');
      window.scrollTo(0, 0);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const initiateRazorpayPayment = async (order: any) => {
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      throw new Error('Payment gateway failed to load. Please try again.');
    }

    const options = {
      key: "rzp_test_7ebkajsun", // Replace with your actual Razorpay Key ID
      amount: total * 100, // Convert to paise
      currency: 'INR',
      name: "RushPhere",
      description: `Order Payment for Order #${order.orderNo}`,
      handler: async (response: any) => {
        try {
          // Verify payment on your backend if necessary for production
          await updateOrderStatus(order.documentId, 'confirmed'); // Mark as confirmed after successful payment
          setStep('confirmation');
          clearCart();
          toast({
            title: "Payment Successful!",
            description: `Your order #${order.orderNo} has been placed successfully.`,
          });
        } catch (error) {
          toast({
            title: "Payment Error",
            description: "Payment verification failed or order update issue. Please contact support.",
            variant: "destructive"
          });
          console.error("Razorpay handler error:", error);
        }
      },
      prefill: {
        name: shippingInfo.name,
        email: shippingInfo.email,
        contact: shippingInfo.phone
      },
      theme: {
        color: "#3B82F6"
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create the order in database
      const order = await createOrder();
      setOrderId(order.orderNo); // Use order.orderNo from the backend response

      // 2. Process payment based on method
      if (paymentMethod === 'razorpay') {
        await initiateRazorpayPayment(order);
      } else {
        // For COD, just confirm the order and update status to pending
        await updateOrderStatus(order.documentId, 'pending');
        setStep('confirmation');
        clearCart();
        toast({
          title: "Order Placed!",
          description: `Your order #${order.orderNo} has been received and will be processed.`,
        });
      }
    } catch (error: any) {
      console.error("Place Order Error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // --- Render Logic ---

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Checkout Step Tracker */}
        <div className="mb-8">
          <div className="flex justify-between sm:justify-center gap-4 overflow-x-auto px-1">
            {steps.map((s) => {
              const status = getStepStatus(s.id);
              return (
                <div key={s.id} className="flex flex-col items-center text-center min-w-[60px]">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center
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
                  <span className={`mt-1 text-xs sm:text-sm font-medium
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
            {step === 'shipping' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>

                {/* Saved Addresses Section */}
                {user && user.address && user.address.length > 0 && (
                  <div className="mb-6 border-b pb-4">
                    <h3 className="text-lg font-medium mb-3">Select a Saved Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.address.filter(Boolean).map((addr: Address, index: number) => ( // Filter out nulls
                        <div
                          key={index}
                          className={`border rounded-lg p-4 cursor-pointer flex items-start space-x-3
                            ${selectedAddressIndex === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:border-blue-400'}`}
                          onClick={() => handleSelectAddress(index)}
                        >
                          <Home className="h-5 w-5 text-gray-500 mt-1" />
                          <div>
                            <p className="font-medium text-sm">{addr.street}</p>
                            <p className="text-gray-600 text-sm">{addr.city}, {addr.state} - {addr.zip}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-6" />
                    <h3 className="text-lg font-medium mb-3">Or Enter New Address</h3>
                  </div>
                )}

                <form onSubmit={handleContinueToPayment}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={shippingInfo.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="street">Street Address *</Label>
                      <Input
                        id="street"
                        value={shippingInfo.street}
                        onChange={(e) => handleInputChange("street", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={shippingInfo.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP Code *</Label>
                      <Input
                        id="zip"
                        value={shippingInfo.zip}
                        onChange={(e) => handleInputChange("zip", e.target.value)}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={shippingInfo.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                      />
                    </div>
                  </div>

                  {user && ( // Only show if user is logged in
                    <div className="flex items-center space-x-2 mt-6">
                      <Checkbox
                        id="saveNewAddress"
                        checked={saveNewAddress}
                        onCheckedChange={(checked: boolean) => setSaveNewAddress(checked)}
                      />
                      <Label htmlFor="saveNewAddress">Save this address for future orders</Label>
                    </div>
                  )}

                  <div className="flex justify-end mt-6">
                    <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600" disabled={loading}>
                      Continue to Payment <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {step === 'payment' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
                <form onSubmit={handlePlaceOrder}>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6"
                  >
                    <div className="flex items-center border rounded-lg p-4 hover:border-purple-400 cursor-pointer">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center ml-3 cursor-pointer">
                        <Wallet className="h-5 w-5 mr-2" />
                        Cash on Delivery
                      </Label>
                    </div>
                    <div className="flex items-center border rounded-lg p-4 hover:border-purple-400 cursor-pointer">
                      <RadioGroupItem value="razorpay" id="razorpay" />
                      <Label htmlFor="razorpay" className="flex items-center ml-3 cursor-pointer">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Pay Online (Razorpay)
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === 'razorpay' && (
                    <div className="bg-blue-50 p-4 rounded-md mb-6">
                      <p className="text-blue-800">You'll be redirected to Razorpay's secure payment page to complete your transaction.</p>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="bg-gray-50 p-4 rounded-md mb-6">
                      <p>Pay with cash when your order is delivered.</p>
                    </div>
                  )}

                  <div className="flex justify-between mt-8">
                    <Button type="button" variant="outline" onClick={() => setStep('shipping')}>
                      Back to Shipping
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600" disabled={loading}>
                      {loading ? (paymentMethod === 'cod' ? 'Placing Order...' : 'Redirecting...') : (paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Payment')}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {step === 'confirmation' && (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Order Confirmed!</h2>
                <p className="text-gray-600 mb-6">
                  {paymentMethod === 'cod'
                    ? 'Your order has been received and will be processed.'
                    : 'Your payment was successful and your order is being processed.'}
                </p>

                <div className="bg-gray-50 p-4 rounded-md mb-6 text-left max-w-md mx-auto">
                  <h3 className="font-semibold mb-2">Order Details</h3>
                  <p className="text-sm text-gray-600">Order #: {orderId || '---'}</p>
                  <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString('en-IN')}</p>
                  <p className="text-sm text-gray-600">Total: ₹{total.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Payment Method: {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button asChild>
                    <Link to={`/orders/${orderId}`}>View Order Details</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/products">Continue Shopping</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center">Your cart is empty.</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-4">
                      <img
                        src={item.product.images?.[0] || 'placeholder-image-url.jpg'} // Fallback image
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{item.product.name}</h4>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">
                          ₹{((item.product.discount ? parseFloat(item.product.price) * (1 - item.product.discount / 100) : parseFloat(item.product.price)) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <Separator className="my-4" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">₹{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {step !== 'confirmation' && (
                <div className="mt-6">
                  <p className="text-xs text-gray-500">
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
