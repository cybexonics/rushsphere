import React, { createContext, useContext, useState, useEffect } from 'react';
import { getData } from "@/lib/getData";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(undefined);

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [isVendor, setIsVendor] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Restore auth state on mount
  useEffect(() => {
    const restoreSession = async () => {
  try {
    const storedUserId = localStorage.getItem('user');
    const storedVendorId = localStorage.getItem('vendor');

    if (storedUserId) {
      const userData = await getData(`customers/${storedUserId}`);
      if (userData) setUser(userData.data);
    }

    if (storedVendorId) {
      const vendorData = await getData(`vendors/${storedVendorId}`);
      if (vendorData) {
      if(!vendorData.data.isApproved) {
         navigate(`/not-approved`);
      }
        setVendor(vendorData.data);
        setIsVendor(true);
      }
    }
  } catch (err) {
    console.error('Failed to restore session:', err);
    localStorage.clear();
  } finally {
    setLoading(false);
  }
};
  

    restoreSession();
  }, []);

  // ✅ Customer Login
  const login = async (identifier, password) => {
    setLoading(true);
    try {
      const res = await getData(`customers?filters[email][$eq]=${identifier}&filters[password][$eq]=${password}&populate=*`);
      const data = res?.data[0];

      if (!data) throw new Error('Invalid credentials');

      setUser(data);
      console.log(data)
      localStorage.setItem('user', data.documentId);
    } catch (err) {
      throw new Error('Invalid credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Vendor Login
  const vendorLogin = async (identifier, password) => {
    setLoading(true);
    try {
      const res = await getData(`vendors?filters[email][$eq]=${identifier}&filters[password][$eq]=${password}`);
      const data = res?.data[0];

      if (!data) throw new Error('Invalid credentials');
      if(!data.isApproved) navigate(`/not-approved`);
      setVendor(data);
      setIsVendor(true);
      localStorage.setItem('vendor', data.documentId);
      navigate(`/vendor`);
    } catch (err) {
      alert('Invalid credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Customer Signup
  const signup = async (payload) => {
    setLoading(true);
    try {
      const res = await fetch(`https://rushsphere.onrender.com/api/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: payload }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || 'Signup failed');
      const customerId = json.data.documentId;
      const customerData = await getData(`customers/${customerId}`);
      
      setUser(customerData);
      localStorage.setItem('user', customerId);
      navigate(`/profile`);
    } catch (err) {
      console.error('Signup error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Vendor Signup
  const vendorSignup = async (payload) => {
    setLoading(true);
    try {
      const res = await fetch(`https://rushsphere.onrender.com/api/vendors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: payload }),
      });

      const json = await res.json();
      console.log(json)
      if (!res.ok){
        console.log(json?.error?.message || 'Signup failed');
        navigate(`/failed`);
      }

      const vendorId = json.data.id;
      const vendorData = await getData(`vendors/${vendorId}`);
      console.log(vendorData,json)
      setVendor(vendorData);
      setIsVendor(true);
      localStorage.setItem('vendor', vendorId);
      navigate(`/vendor`);
    } catch (err) {
      console.error('Vendor signup error:', err);
      console.log(err)
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout Functions
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const vendorLogout = () => {
    localStorage.removeItem('vendor');
    setVendor(null);
    setIsVendor(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        vendor,
        isVendor,
        loading,
        login,
        logout,
        signup,
        vendorLogin,
        vendorSignup,
        vendorLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthProvider;

