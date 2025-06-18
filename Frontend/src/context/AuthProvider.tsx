import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getData } from "@/lib/getData";
import { useNavigate } from 'react-router-dom';

interface UserData {
  documentId: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: any[];
  wishlist?: any[];
  orders?: any[];
}

interface VendorData {
  documentId: string;
  id?: string;
  name: string;
  email: string;
  isApproved: boolean;
  // Add other vendor fields
}

interface AuthContextType {
  user: UserData | null;
  vendor: VendorData | null;
  isVendor: boolean;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (payload: any) => Promise<void>;
  vendorLogin: (identifier: string, password: string) => Promise<void>;
  vendorSignup: (payload: any) => Promise<void>;
  vendorLogout: () => void;
  restoreSession: () => void;
  updateUser: (updatedFields: Partial<UserData>) => Promise<void>;
  updateVendor: (updatedFields: Partial<VendorData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BASE_API_URL = 'https://rushsphere.onrender.com/api';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserData | null>(null);
  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [isVendor, setIsVendor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error,setError] = useState('')

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const storedUserId = localStorage.getItem('user');
      const storedVendorId = localStorage.getItem('vendor');

      if (storedUserId) {
        const userData = await getData(`customers/${storedUserId}?populate=*`);
        if (userData?.data) setUser(userData.data ? { ...userData.data, documentId: userData.data.id } : userData.data);
      }

      if (storedVendorId) {
        const vendorData = await getData(`vendors/${storedVendorId}?populate=*`);
        if (vendorData?.data) {
          if (!vendorData.data.isApproved) {
            navigate(`/not-approved`);
          }
          setVendor(vendorData.data ? { ...vendorData.data, documentId: vendorData.data.id } : vendorData.data);
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

  const login = async (identifier: string, password: string) => {
    setLoading(true);
    try {
      const res = await getData(`customers?filters[email][$eq]=${identifier}&filters[password][$eq]=${password}&populate=*`);
      const data = res?.data?.[0];

      if (!data) throw new Error('Invalid credentials');

      const userDataWithId = { ...data, documentId: data.documentId };
      setUser(userDataWithId);
      localStorage.setItem('user', data.documentId);
      navigate(`/profile`);
    } catch (err: any) {
      throw new Error(err.message || 'Invalid credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const vendorLogin = async (identifier: string, password: string) => {
    setLoading(true);
    try {
      const res = await getData(`vendors?filters[email][$eq]=${identifier}&filters[password][$eq]=${password}&populate=*`);
      const data = res?.data?.[0];

      if (!data) throw new Error('Invalid credentials');
      if (!data.isApproved) navigate(`/not-approved`);

      const vendorDataWithId = { ...data, documentId: data.documentId };
      setVendor(vendorDataWithId);
      setIsVendor(true);
      localStorage.setItem('vendor', data.documentId);
      navigate(`/vendor`);
    } catch (err: any) {
      alert(err.message || 'Invalid credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (payload: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_API_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: payload }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || 'Signup failed');
      
      const customerId = json.data.documentId;
      const customerData = await getData(`customers/${customerId}?populate=*`);
      const customerDataWithId = { ...customerData.data, documentId: customerData.data.documentId };

      setUser(customerDataWithId);
      localStorage.setItem('user', customerId);
      navigate(`/profile`);
    } catch (err: any) {
      console.error('Signup error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const vendorSignup = async (payload: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_API_URL}/vendors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: payload }),
      });

     const json = await res.json()
    if (!res.ok) {
      let alertMessage = `Signup failed (Status: ${res.status})`;

      if (json.error) {
        alertMessage = json.error.message || alertMessage; // Main error message from Strapi

        // Check for the 'details.errors' array which holds field-specific validation errors
        if (json.error.details && Array.isArray(json.error.details.errors)) {
          const fieldErrors = json.error.details.errors.map(err => {
            const field = err.path && err.path.length > 0 ? err.path.join('.') : 'unknown field';
            return `- ${field}: ${err.message}`;
          }).join('\n');
          alertMessage += `\n\nDetails:\n${fieldErrors}`;
        }
      }
      setError(alertMessage);
      navigate('/failed');
      return;
    }

    // If res.ok is true, it's a success
    alert('Success', 'Signup successful!');
    navigate('/success');

      const vendorId = json.data.documentIds;
      const vendorData = await getData(`vendors/${vendorId}?populate=*`);
      const vendorDataWithId = { ...vendorData.data, documentId: vendorData.data.documentId };
      
      setVendor(vendorDataWithId);
      setIsVendor(true);
      localStorage.setItem('vendor', vendorId);
      navigate(`/vendor`);
    } catch (err: any) {
      console.error('Vendor signup error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const vendorLogout = () => {
    localStorage.removeItem('vendor');
    setVendor(null);
    setIsVendor(false);
  };

  const updateUser = async (updatedFields: Partial<UserData>) => {
    if (!user?.documentId) {
      throw new Error("User not logged in or ID missing for update.");
    }

    try {
      const response = await fetch(`${BASE_API_URL}/customers/${user.documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: updatedFields,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update user on server.');
      }

      const responseData = await response.json();
      const updatedServerUserData = { ...responseData.data, documentId: responseData.data.id };
      
      setUser(updatedServerUserData);
      localStorage.setItem('user', JSON.stringify(updatedServerUserData));

    } catch (error) {
      console.error("Error updating user data:", error);
      throw error;
    }
  };

  const updateVendor = async (updatedFields: Partial<VendorData>) => {
    if (!vendor?.documentId) {
      throw new Error("Vendor not logged in or ID missing for update.");
    }

    try {
      const response = await fetch(`${BASE_API_URL}/vendors/${vendor.documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: updatedFields,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update vendor on server.');
      }

      const responseData = await response.json();
      const updatedServerVendorData = { ...responseData.data, documentId: responseData.data.id };

      setVendor(updatedServerVendorData);
      localStorage.setItem('vendor', JSON.stringify(updatedServerVendorData));

    } catch (error) {
      console.error("Error updating vendor data:", error);
      throw error;
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        vendor,
        isVendor,
        loading,
        error,
        login,
        logout,
        signup,
        vendorLogin,
        vendorSignup,
        vendorLogout,
        restoreSession,
        updateUser,
        updateVendor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthProvider;
