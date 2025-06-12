import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Assuming you have a utility for making API calls, similar to getData
// For this example, I'll create a dummy API call utility.

interface Product {
  id: number;
  documentId: string; // Assuming products have a documentId for backend reference
  name: string;
  price: string; // Price can be string from API, convert to number if needed
  images?: string[]; // Add images for display
  discount?: number; // Add discount for calculations
  sku?: string; // Add SKU for consistency
  // Add other relevant product properties you might need
}

interface CartItem {
  product: Product;
  quantity: number;
  other?: any; // To allow for additional data if passed
}

interface WishlistItem {
  product: Product;
  // If your backend stores additional data for wishlist items, add it here
}

interface CartContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  addToCart: (product: Product, other?: any, quantity?: number) => Promise<void>;
  removeFromCart: (productSku: string) => Promise<void>; // Changed to productSku for consistency with cart logic
  updateCartQuantity: (productSku: string, quantity: number) => Promise<void>; // Changed to productSku
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productDocumentId: string) => Promise<void>; // Changed to productDocumentId for server
  clearCart: () => Promise<void>;
  clearWishlist: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_CART_KEY = 'cart';
const LOCAL_WISHLIST_KEY = 'wishlist'; // This will now primarily be for initial load/fallback
const LOCAL_USER_KEY = 'user'; // Key for stored user ID

// Dummy API utility for demonstration purposes. Replace with your actual API calls.
// In a real app, these would typically be in a separate `api.ts` or `http.ts` file.
const BASE_URL = 'https://rushsphere.onrender.com/api'; // Your backend base URL

const api = {
  get: async (path: string) => {
    const response = await fetch(`${BASE_URL}${path}`);
    if (!response.ok) throw new Error(`API GET error: ${response.statusText}`);
    return response.json();
  },
  post: async (path: string, data: any) => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API POST error: ${response.statusText}`);
    return response.json();
  },
  put: async (path: string, data: any) => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API PUT error: ${response.statusText}`);
    return response.json();
  },
  delete: async (path: string) => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`API DELETE error: ${response.statusText}`);
    return response.json();
  },
};


const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // --- Utility Functions for Local Storage ---
  const saveCartLocally = useCallback((updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(updatedCart));
  }, []);

  const saveWishlistLocally = useCallback((updatedWishlist: WishlistItem[]) => {
    setWishlist(updatedWishlist);
    localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(updatedWishlist));
  }, []);

  // --- Effects ---

  // Load user ID from local storage and initial cart/wishlist
  useEffect(() => {
    const storedUserId = localStorage.getItem(LOCAL_USER_KEY);
    if (storedUserId) {
      setUserId(storedUserId);
    }

    const savedCart = localStorage.getItem(LOCAL_CART_KEY);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    // Wishlist will be loaded from server if user is logged in
    setLoading(false);
  }, []);

  // Fetch wishlist from server when userId changes
  useEffect(() => {
    const fetchWishlist = async () => {
      if (userId) {
        setLoading(true);
        try {
          // Assuming your backend stores wishlist as part of the customer's data
          const userData = await api.get(`/customers/${userId}`);
          if (userData?.data?.wishlist) {
            setWishlist(userData.data.wishlist.filter(Boolean)); // Filter out any nulls
            localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(userData.data.wishlist.filter(Boolean)));
          } else {
            setWishlist([]);
            localStorage.removeItem(LOCAL_WISHLIST_KEY);
          }
        } catch (error) {
          console.error("Failed to fetch wishlist from server:", error);
          // Fallback to local storage if server fetch fails
          const savedWishlist = localStorage.getItem(LOCAL_WISHLIST_KEY);
          if (savedWishlist) {
            setWishlist(JSON.parse(savedWishlist));
          } else {
            setWishlist([]);
          }
        } finally {
          setLoading(false);
        }
      } else {
        // If no user, load wishlist from local storage only
        const savedWishlist = localStorage.getItem(LOCAL_WISHLIST_KEY);
        if (savedWishlist) {
          setWishlist(JSON.parse(savedWishlist));
        } else {
          setWishlist([]);
        }
      }
    };
    fetchWishlist();
  }, [userId]); // Depend on userId to re-fetch when user logs in/out


  // --- Cart Operations ---
  const addToCart = useCallback(async (product: Product, other: any, quantity: number = 1) => {
    setCart(prevCart => {
      const existing = prevCart.find((item) => item.product.sku === product.sku);
      const updatedCart = existing
        ? prevCart.map((item) =>
          item.product.sku === product.sku ? { ...item, quantity: item.quantity + quantity } : item
        )
        : [...prevCart, { product, quantity, other }];
      saveCartLocally(updatedCart);
      return updatedCart;
    });
  }, [saveCartLocally]);

  const removeFromCart = useCallback(async (productSku: string) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter((item) => item.product.sku !== productSku);
      saveCartLocally(updatedCart);
      return updatedCart;
    });
  }, [saveCartLocally]);

  const updateCartQuantity = useCallback(async (productSku: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(productSku);
      return;
    }
    setCart(prevCart => {
      const updatedCart = prevCart.map((item) =>
        item.product.sku === productSku ? { ...item, quantity } : item
      );
      saveCartLocally(updatedCart);
      return updatedCart;
    });
  }, [removeFromCart, saveCartLocally]);

  const clearCart = useCallback(async () => {
    saveCartLocally([]);
  }, [saveCartLocally]);

  // --- Wishlist Operations ---
  const addToWishlist = useCallback(async (product: Product) => {
    if (wishlist.some((item) => item.product.documentId === product.documentId)) {
      console.log("Product already in wishlist.");
      return; // Already in wishlist, do nothing
    }

    try {
      if (userId) {
        // Assume customer's wishlist is an array of product objects on the server
        // First, fetch current user data to get existing wishlist
        const userData = await api.get(`/customers/${userId}`);
        const currentWishlist = Array.isArray(userData?.data?.wishlist) ? userData.data.wishlist.filter(Boolean) : [];
        const updatedServerWishlist = [...currentWishlist, { product }];

        // Update wishlist on the server
        await api.put(`/customers/${userId}`, {
          data: { wishlist: updatedServerWishlist.map((item:any) => ({ product:item.product })) }
           // Send only necessary product info (id, documentId)
        });

        // Update local state and local storage after successful server update
        const newLocalWishlist = [...wishlist, { product }];
        saveWishlistLocally(newLocalWishlist);
        console.log("Added to server wishlist and local state:", product.name);
      } else {
        // If not logged in, only save to local storage
        const updatedWishlist = [...wishlist, { product }];
        saveWishlistLocally(updatedWishlist);
        console.log("Added to local wishlist (user not logged in):", product.name);
      }
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      // Optionally, show a toast notification for the error
    }
  }, [wishlist, userId, saveWishlistLocally]);

  const removeFromWishlist = useCallback(async (productDocumentId: string) => {
    try {
      if (userId) {
        // Fetch current wishlist from server
        const userData = await api.get(`/customers/${userId}`);
        const currentWishlist = Array.isArray(userData?.data?.wishlist) ? userData.data.wishlist.filter(Boolean) : [];

        const updatedServerWishlist = currentWishlist.filter(
          (item: any) => item.product.documentId !== productDocumentId
        );

        // Update wishlist on the server
        await api.put(`/customers/${userId}`, {
          data: { wishlist: updatedServerWishlist.map((item:any) => ({ product: { id: item.product.id, documentId: item.product.documentId } })) }
        });

        // Update local state and local storage after successful server update
        const newLocalWishlist = wishlist.filter((item) => item.product.documentId !== productDocumentId);
        saveWishlistLocally(newLocalWishlist);
        console.log("Removed from server wishlist and local state:", productDocumentId);
      } else {
        // If not logged in, only remove from local storage
        const updatedWishlist = wishlist.filter((item) => item.product.documentId !== productDocumentId);
        saveWishlistLocally(updatedWishlist);
        console.log("Removed from local wishlist (user not logged in):", productDocumentId);
      }
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      // Optionally, show a toast notification for the error
    }
  }, [wishlist, userId, saveWishlistLocally]);

  const clearWishlist = useCallback(async () => {
    try {
      if (userId) {
        // Clear wishlist on the server
        await api.put(`/customers/${userId}`, { data: { wishlist: [] } });
        console.log("Cleared server wishlist.");
      }
      saveWishlistLocally([]); // Clear local state and local storage
    } catch (error) {
      console.error("Failed to clear wishlist:", error);
    }
  }, [userId, saveWishlistLocally]);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        addToWishlist,
        removeFromWishlist,
        clearCart,
        clearWishlist,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartProvider;
