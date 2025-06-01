import React, { useState } from 'react';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User, Package, Heart, CreditCard, MapPin, Settings, LogOut
} from 'lucide-react';

import { useCart } from "@/context/CartProvider";
import { useAuth } from "@/context/AuthProvider";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user,logout } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login'); // or use /login
    }
  }, [user]);

  if (!user) return null; 

  const handleLogout = () =>{
    logout();
    navigate("/")
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="account" className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={user?.image} alt={user?.name} />
                      <AvatarFallback>{user?.name[0]}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold">{user?.name}</h2>
                    <p className="text-gray-500 mb-6">{user?.email}</p>

                    <Separator className="mb-6" />

                    <nav className="w-full space-y-1">
                      <TabsList className="flex flex-col w-full h-auto bg-transparent space-y-1">
                        <TabsTrigger value="account" className="w-full justify-start gap-2">
                          <User className="h-4 w-4" /> Account
                        </TabsTrigger>
                        <TabsTrigger value="orders" className="w-full justify-start gap-2">
                          <Package className="h-4 w-4" /> Orders
                        </TabsTrigger>
                        <TabsTrigger value="wishlist" className="w-full justify-start gap-2">
                          <Heart className="h-4 w-4" /> Wishlist
                        </TabsTrigger>
                        <TabsTrigger value="payment" className="w-full justify-start gap-2">
                          <CreditCard className="h-4 w-4" /> Payment Methods
                        </TabsTrigger>
                        <TabsTrigger value="addresses" className="w-full justify-start gap-2">
                          <MapPin className="h-4 w-4" /> Addresses
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="w-full justify-start gap-2">
                          <Settings className="h-4 w-4" /> Settings
                        </TabsTrigger>
                      </TabsList>
                    </nav>

                    <Separator className="my-6" />

                    <Button variant="outline" className="w-full gap-2" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" />
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
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" defaultValue={user?.name} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue={user?.email} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" defaultValue={user?.phone} />
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="font-medium">Change Password</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input id="current-password" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input id="confirm-password" type="password" />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader><CardTitle>Order History</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {user.orders ? user.orders.map(order => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex flex-wrap justify-between items-center">
                            <div>
                              <p className="font-medium">{order.id}</p>
                              <p className="text-sm text-gray-500">Ordered on {order.date}</p>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === 'Delivered' 
                                  ? 'bg-green-100 text-green-800' 
                                  : order.status === 'Shipped' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {order.status}
                              </span>
                              <span className="font-medium mt-1">${order.total.toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-between">
                            <span className="text-sm text-gray-500">
                              {order.items} {order.items === 1 ? 'item' : 'items'}
                            </span>
                            <Button variant="outline" size="sm" onClick={()=>navigate(`/orders/${order.id}`)}>View Details</Button>
                          </div>
                        </div>
                      )) : <p>No Orders</p>}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Wishlist */}
              <TabsContent value="wishlist">
                <Card>
                  <CardHeader><CardTitle>My Wishlist</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      { user.wishlist ?  user.wishlist.map(item => (
                        <div key={item.id} className="border rounded-lg overflow-hidden">
                          <div className="h-40">
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="font-bold">${item.price.toFixed(2)}</p>
                            <div className="flex gap-2 mt-4">
                              <Button size="sm">Add to Cart</Button>
                              <Button size="sm" variant="outline">Remove</Button>
                            </div>
                          </div>
                        </div>
                      )) : <p>no Wishlist</p>}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Payment Methods */}
              <TabsContent value="payment">
                <Card>
                  <CardHeader><CardTitle>Payment Methods</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-gray-500 mb-4">Manage your saved payment methods</p>
                    <Button>Add New Payment Method</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Addresses */}
              <TabsContent value="addresses">
                <Card>
                  <CardHeader><CardTitle>Saved Addresses</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-gray-500 mb-4">Manage your shipping and billing addresses</p>
                    <Button>Add New Address</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings */}
              <TabsContent value="settings">
                <Card>
                  <CardHeader><CardTitle>Account Settings</CardTitle></CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Email Notifications</h3>
                            <p className="text-sm text-gray-500">Receive updates about your account</p>
                          </div>
                          <div>
                            <input type="checkbox" id="email-notifications" className="sr-only" defaultChecked />
                            <label htmlFor="email-notifications" className="block h-6 w-10 rounded-full bg-green-600 relative cursor-pointer">
                              <span className="block h-5 w-5 mt-0.5 ml-0.5 bg-white rounded-full transition-transform transform translate-x-4"></span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit">Save Preferences</Button>
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

