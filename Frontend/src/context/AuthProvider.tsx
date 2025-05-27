import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_URL = 'http://localhost:1337/api'; // Update to your Strapi backend URL


const AuthContext = createContext(undefined);

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVendor, setIsVendor] = useState(false);
  const [vendor,setVendor] = useState(null)

  
useEffect(() => {
  const storedUser = localStorage.getItem('user');
  const storedVendor = localStorage.getItem('vendor');

  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      localStorage.removeItem('user'); // Clean corrupted data
    }
  }else if (storedVendor) {
    try {
      const parsedUser = JSON.parse(storedVendor);
      setVendor(parsedUser);
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      localStorage.removeItem('vendor'); // Clean corrupted data
    }
  }

  setLoading(false);
}, []);
  const login = async (identifier: string, password: string) => {
    try {
    const userData = {
      id:12345,
      first_name:"Sanskar",
      last_Name:"Bandgar",
      email:"mr.sanskar19@gmail.com",
      phone:"1234567890",
      image:"/placholder.svg",
      orders:[
  { id: 'ORD-12345', date: '2025-05-10', status: 'Delivered', total: 129.99, items: 2 },
  { id: 'ORD-12346', date: '2025-04-28', status: 'Processing', total: 79.50, items: 1 },
  { id: 'ORD-12347', date: '2025-04-15', status: 'Shipped', total: 249.99, items: 3 }
],
wishlistItems : [
  { id: '1', name: 'Wireless Earbuds', price: 89.99, image: '/placeholder.svg' },
  { id: '2', name: 'Smart Watch', price: 199.99, image: '/placeholder.svg' },
  { id: '3', name: 'Bluetooth Speaker', price: 59.99, image: '/placeholder.svg' }
]
    }
    setUser(userData)
    localStorage.setItem("user",JSON.stringify(userData))
    console.log("user set")
      // await fetchUser();
    } catch (err) {
      throw new Error('Invalid credentials. Please check your email/username and password.');
      console.log(err)
    }
  };

const vendorLogin = async (identifier: string, password: string) => {
    try {
    const userData = {
      id:12345,
      first_name:"Sanskar",
      last_Name:"Bandgar",
      email:"mr.sanskar19@gmail.com",
      phone:"1234567890",
      image:"/placholder.svg",
      shop_name:"Print Studio",
      orders:[
  { id: 'ORD-12345', date: '2025-05-10', status: 'Delivered', total: 129.99, items: 2 },
  { id: 'ORD-12346', date: '2025-04-28', status: 'Processing', total: 79.50, items: 1 },
  { id: 'ORD-12347', date: '2025-04-15', status: 'Shipped', total: 249.99, items: 3 }
]
    }
    setVendor(userData)
    setIsVendor(true)
    localStorage.setItem("vendor",JSON.stringify(userData))
    navigate(`/vendor`)
      // await fetchUser();
    } catch (err) {
      throw new Error('Invalid credentials. Please check your email/username and password.');
      console.log(err)
    }
  };

  const vendorLogout = () =>{
  localStorage.removeItem('vendor');
    setVendor(null);
    setIsVendor(false);
  }
  

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsVendor(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login,vendor,vendorLogout, logout, isVendor,vendorLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth =() => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
