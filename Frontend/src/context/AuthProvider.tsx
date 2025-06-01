import React, { createContext, useContext, useState, useEffect } from 'react';
import { getData } from "@/lib/getData"
import { useNavigate } from 'react-router-dom';


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
    const userData = await getData(`customers?filters[email][$eq]=${identifier}&filters[password][$eq]=${password}`)
   const data = userData?.data[0]
   console.log(data)
    setUser(data)
    localStorage.setItem("user",JSON.stringify(data))
    console.log("user set")
      // await fetchUser();
    } catch (err) {
      throw new Error('Invalid credentials. Please check your email/username and password.');
      console.log(err)
    }
  };

const vendorLogin = async (identifier: string, password: string) => {
    try {
   const userData = await getData(`vendors?filters[email][$eq]=${identifier}&filters[password][$eq]=${password}`)
   const data = userData?.data[0]
   console.log(data)
    setVendor(data)
    setIsVendor(true)
    localStorage.setItem("vendor",JSON.stringify(data))
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
