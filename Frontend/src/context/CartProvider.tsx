import React, { createContext, useContext, useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  vendor?: {
    id: number;
    storeName?: string;
  };
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface WishlistItem {
  product: Product;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateCartQuantity: (productId: number, quantity: number) => Promise<void>;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  clearWishlist: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_CART_KEY = 'cart';
const LOCAL_WISHLIST_KEY = 'wishlist';

const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCart = localStorage.getItem(LOCAL_CART_KEY);
    const savedWishlist = localStorage.getItem(LOCAL_WISHLIST_KEY);

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

    setLoading(false);
  }, []);

  const saveCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(updatedCart));
  };

  const saveWishlist = (updatedWishlist: WishlistItem[]) => {
    setWishlist(updatedWishlist);
    localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(updatedWishlist));
  };

  const addToCart = async (product: Product,other :any,quantity: number = 1) => {
    const existing = cart.find((item) => item.product.id === product.id);
    const updatedCart = existing
      ? cart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      : [...cart, { product, quantity,other }];
    saveCart(updatedCart);
  };

  const removeFromCart = async (productId: number) => {
    const updatedCart = cart.filter((item) => item.product.id !== productId);
    saveCart(updatedCart);
  };

  const updateCartQuantity = async (productId: number, quantity: number) => {
  if (quantity < 1) {
    await removeFromCart(productId);
    return;
  }

  const updatedCart = cart.map((item) =>
    item.product.id === productId ? { ...item, quantity } : item
  );

  saveCart(updatedCart);
};


  const addToWishlist = async (product: Product) => {
    if (wishlist.find((item) => item.product.id === product.id)) return;
    const updatedWishlist = [...wishlist, { product }];
    saveWishlist(updatedWishlist);
  };

  const removeFromWishlist = async (productId: number) => {
    const updatedWishlist = wishlist.filter((item) => item.product.id !== productId);
    saveWishlist(updatedWishlist);
  };

  const clearCart = async () => {
    saveCart([]);
  };

  const clearWishlist = async () => {
    saveWishlist([]);
  };

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

