import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User, Package, Heart, MapPin, Settings, LogOut, XCircle, ShoppingCart, Trash2
} from 'lucide-react';
import { useCart } from "@/context/CartProvider";
import { useAuth } from "@/context/AuthProvider";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast'; // Import useToast
import ProductCard from '@/components/ProductCard'; // Assuming you want to reuse ProductCard for wishlist items

const Profile = () => {
  const { user, logout,updateUser,restoreSession } = useAuth(); // Assuming updateUser exists in AuthProvider
  const { addToCart, removeFromWishlist } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast(); // Initialize toast

  const [userName, setUserName] = useState(user?.name || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [userPhone, setUserPhone] = useState(user?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State for addresses (assuming you might want to add/edit them later)
  // For now, we'll just display from user.address
  const [addresses, setAddresses] = useState(user?.address || []);

  useEffect(() => {
    const storedUserId = localStorage.getItem('user');
    if (!storedUserId) {
      navigate('/login');
    }
    restoreSession()
    if (user) {
      setUserName(user.name || '');
      setUserEmail(user.email || '');
      setUserPhone(user.phone || '');
      setAddresses(user.address || []);
    }
  }, [user, navigate]);

  if (!user) return null; // Render nothing if user is not loaded yet

  const handleLogout = () => {
    logout();
    navigate("/");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

const BASE_API_URL = 'https://rushsphere.onrender.com/api'; // Example base URL

const handleUpdateAccount = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // Send data to your backend API using fetch
    const response = await fetch(`${BASE_API_URL}/customers/${user.documentId}`, { // Adjust endpoint as needed
      method: 'PUT', // or 'PATCH' depending on your API
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      data:{
        name: userName,
        email: userEmail,
        phone: userPhone,
        }
      }),
    });

    if (!response.ok) {
      // Attempt to read error message from backend if available
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update account');
    }

    const updatedUserData = await response.json(); // Assuming backend returns updated user data

    // If you have an updateUser function in your AuthProvider, update local state:
    if (updateUser) {
      // Use the data returned from the backend or the local state
      updateUser({ ...user, name: userName, email: userEmail, phone: userPhone });
      // Alternatively, if backend returns the full updated user object:
      // updateUser(updatedUserData);
    }

    toast({
      title: "Account Updated",
      description: "Your account information has been updated.",
    });
  } catch (error: any) { // Explicitly type error as 'any' for simpler handling
    console.error("Error updating account:", error);
    toast({
      title: "Update Failed",
      description: error.message || "There was an error updating your account.",
      variant: "destructive"
    });
  }
};


const handleChangePassword = async (e: React.FormEvent) => {
  e.preventDefault();

  if (newPassword !== confirmPassword) {
    toast({
      title: "Password Mismatch",
      description: "New password and confirm password do not match.",
      variant: "destructive"
    });
    return;
  }

  try {
    // Send currentPassword and newPassword to your backend
    const response = await fetch(`${BASE_API_URL}/customers/${user.documentId}`, { // Adjust endpoint as needed
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      data:{
        password: newPassword,
        }
      }),
    });

    if (!response.ok) {
      // Attempt to read error message from backend if available
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to change password');
    }

    // Assuming a successful response from the backend
    toast({
      title: "Password Changed",
      description: "Your password has been successfully updated.",
    });

    // Clear password fields after successful change
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  } catch (error: any) { // Explicitly type error as 'any' for simpler handling
    console.error("Error changing password:", error);
    toast({
      title: "Password Change Failed",
      description: error.message || "There was an error changing your password. Please check your current password.",
      variant: "destructive"
    });
  }
};

const handleRemoveAddress = async (indexToRemove: number) => {
  try {
    const updatedAddresses = addresses.filter((_, index) => index !== indexToRemove);
    if (!user || !user.documentId) {
      console.error("User ID not available to update address on server.");
      toast({
        title: "Error",
        description: "Could not identify user to remove address on server.",
        variant: "destructive"
      });
      return;
    }
    const response = await fetch(`${BASE_API_URL}/customers/${user.documentId}`, {
      method: 'PUT', // or 'PATCH' depending on how your Strapi API is configured for updates
      headers: {
        'Content-Type': 'application/json',
        
      },
      body: JSON.stringify({
        data: {
          address: updatedAddresses, 
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to remove address from server.');
    }

    // 3. Update local state only AFTER successful API call
    setAddresses(updatedAddresses);

    if (updateUser) {
      updateUser({ ...user, address: updatedAddresses });
    }

    toast({
      title: "Address Removed",
      description: "The address has been successfully removed.",
    });

  } catch (error: any) {
    console.error("Error removing address:", error);
    toast({
      title: "Removal Failed",
      description: error.message || "There was an error removing the address. Please try again.",
      variant: "destructive"
    });
  }
};

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
    toast({
      title: "Removed from Wishlist",
      description: "The item has been removed from your wishlist.",
    });
  };

  const handleMoveToCart = (item: any) => {
    addToCart(item.product, { color: item.color, size: item.size }, item.quantity);
    removeFromWishlist(item.product.documentId); // Assuming documentId is the correct ID for removal
    toast({
      title: "Moved to Cart",
      description: `${item.product.name} has been moved to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="account" className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <Card className="shadow-lg border-primary/20">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-28 w-28 mb-4 border-2 border-primary">
                      <AvatarImage src={user?.image} alt={user?.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                        {user?.name ? user.name[0].toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-bold text-center">{user?.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">{user?.email}</p>

                    <Separator className="mb-6 bg-gray-200 dark:bg-gray-700" />

                    <nav className="w-full space-y-1">
                      <TabsList className="flex flex-col w-full h-auto bg-transparent space-y-1">
                        <TabsTrigger value="account" className="w-full justify-start gap-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10 transition-colors">
                          <User className="h-5 w-5" /> Account
                        </TabsTrigger>
                        <TabsTrigger value="orders" className="w-full justify-start gap-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10 transition-colors">
                          <Package className="h-5 w-5" /> Orders
                        </TabsTrigger>
                        <TabsTrigger value="wishlist" className="w-full justify-start gap-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10 transition-colors">
                          <Heart className="h-5 w-5" /> Wishlist ({user?.wishlist?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="addresses" className="w-full justify-start gap-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10 transition-colors">
                          <MapPin className="h-5 w-5" /> Addresses ({addresses?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="w-full justify-start gap-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10 transition-colors">
                          <Settings className="h-5 w-5" /> Settings
                        </TabsTrigger>
                      </TabsList>
                    </nav>

                    <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />

                    <Button variant="outline" className="w-full gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors" onClick={handleLogout}>
                      <LogOut className="h-5 w-5" />
                      Log Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main content */}
            <div className="md:w-3/4 space-y-6">
              {/* Account */}
              <TabsContent value="account">
                <Card className="shadow-lg border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-primary">Account Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateAccount} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                          <Input
                            id="name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 focus:border-primary focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 focus:border-primary focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Phone</Label>
                          <Input
                            id="phone"
                            value={userPhone}
                            onChange={(e) => setUserPhone(e.target.value)}
                            className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 focus:border-primary focus:ring-primary"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">Save Changes</Button>
                      </div>
                    </form>

                    <Separator className="my-8 bg-gray-200 dark:bg-gray-700" />

                    <h3 className="font-bold text-lg text-primary mb-4">Change Password</h3>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="current-password" className="text-gray-700 dark:text-gray-300">Current Password</Label>
                          <Input
                            id="current-password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 focus:border-primary focus:ring-primary"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password" className="text-gray-700 dark:text-gray-300">New Password</Label>
                          <Input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 focus:border-primary focus:ring-primary"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password" className="text-gray-700 dark:text-gray-300">Confirm Password</Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 focus:border-primary focus:ring-primary"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">Change Password</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders */}
              <TabsContent value="orders">
                <Card className="shadow-lg border-primary/20">
                  <CardHeader><CardTitle className="text-2xl font-bold text-primary">Order History</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {user.orders && user.orders.length > 0 ? (
                        user.orders.map(order => (
                          <div key={order?.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                              <div>
                                <p className="font-semibold text-lg text-primary">Order #{order?.orderNo}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Ordered on {new Date(order?.createdAt).toLocaleDateString()} </p>
                              </div>
                              <div className="flex flex-col items-end mt-2 sm:mt-0">
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                  order?.other?.status === 'Delivered'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                    : order?.other?.status === 'Shipped'
                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                                      : 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100'
                                }`}>
                                  {order?.other?.status}
                                </span>
                                <span className="font-bold text-lg mt-1">₹{order?.other?.total?.toFixed(2)}</span>
                              </div>
                            </div>
                            <Separator className="my-3 bg-gray-200 dark:bg-gray-700" />
                            <div className="flex flex-wrap justify-between items-center">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {order?.products?.length} {order?.products?.length === 1 ? 'item' : 'items'}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-primary text-primary hover:bg-primary/10 transition-colors"
                                onClick={() => navigate(`/orders/${order?.orderNo}`)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">You haven&apos;t placed any orders yet.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Wishlist */}
              <TabsContent value="wishlist">
                <Card className="shadow-lg border-primary/20">
                  <CardHeader><CardTitle className="text-2xl font-bold text-primary">My Wishlist</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {user.wishlist && user.wishlist.length > 0 ? (
                        user.wishlist.map(item => (
                          <Card key={item.product.documentId} className="group overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 relative">
                            
                            <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                              <img
                                src={item.product.images[0]} // Assuming images is an array and taking the first one
                                alt={item.product.name}
                                className="h-full w-full object-contain p-4"
                              />
                            </div>
                            <CardContent className="p-4 space-y-2">
                              <h3 className="font-semibold text-lg line-clamp-2">{item.product.name}</h3>
                              <p className="text-primary font-bold text-xl">₹{item.product.price}</p>
                              <div className="flex flex-col gap-2 mt-4">
                                <Button
                                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                                  onClick={() => handleMoveToCart(item)}
                                >
                                  <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                                </Button>
                                <Button
                                  variant="outline"
                                  className="w-full border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleRemoveFromWishlist(item.product.documentId)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" /> Remove
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <p className="col-span-full text-gray-500 dark:text-gray-400 text-center py-4">Your wishlist is empty. Start adding some favorites!</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Addresses */}
              <TabsContent value="addresses">
                <Card className="shadow-lg border-primary/20">
                  <CardHeader><CardTitle className="text-2xl font-bold text-primary">Saved Addresses</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Manage your shipping and billing addresses.</p>
                    <div className="space-y-4">
                      {addresses && addresses.length > 0 ? (
                        addresses.map((addr, index) => (
                          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center relative">
                            <div>
                              <p className="font-semibold text-lg text-gray-900 dark:text-gray-50">{addr?.title || `Address ${index + 1}`}</p>
                              <p className="text-gray-700 dark:text-gray-300">{addr?.street}</p>
                              <p className="text-gray-700 dark:text-gray-300">{addr?.city}, {addr?.state} {addr?.zip}</p>
                              <p className="text-gray-700 dark:text-gray-300">{addr?.country || 'India'}</p>
                            </div>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 sm:static sm:ml-4 mt-2 sm:mt-0 rounded-full"
                              onClick={() => handleRemoveAddress(index)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No addresses saved yet.</p>
                      )}
                    </div>
                    {/* Add new address button (optional) */}
                    {/* <Button className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">Add New Address</Button> */}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings */}
              <TabsContent value="settings">
                <Card className="shadow-lg border-primary/20">
                  <CardHeader><CardTitle className="text-2xl font-bold text-primary">Account Settings</CardTitle></CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                          <div>
                            <h3 className="font-medium text-lg text-gray-900 dark:text-gray-50">Email Notifications</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates about your account, orders, and promotions.</p>
                          </div>
                          <label htmlFor="email-notifications" className="flex items-center cursor-pointer">
                            <div className="relative">
                              <input type="checkbox" id="email-notifications" className="sr-only peer" defaultChecked />
                              <div className="block h-8 w-14 rounded-full bg-gray-300 dark:bg-gray-700 peer-checked:bg-primary transition-colors"></div>
                              <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform peer-checked:translate-x-full peer-checked:bg-white"></div>
                            </div>
                          </label>
                        </div>
                        {/* Add more settings options here */}
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">Save Preferences</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
