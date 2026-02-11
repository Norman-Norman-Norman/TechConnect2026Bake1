import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  discount?: number;
  quantity: number;
  imgName: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscountSavings: () => number;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = 'octocat-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Initialize from localStorage
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse cart from localStorage:', e);
        return [];
      }
    }
    return [];
  });

  // Persist to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number) => {
    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(i => i.productId === item.productId);
      
      if (existingIndex >= 0) {
        // Update quantity if item already exists
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        // Add new item
        return [...prevItems, { ...item, quantity }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(prevItems => prevItems.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(prevItems => {
      const updated = [...prevItems];
      const index = updated.findIndex(i => i.productId === productId);
      if (index >= 0) {
        updated[index] = { ...updated[index], quantity };
      }
      return updated;
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getSubtotal = () => {
    return items.reduce((sum, item) => {
      const itemPrice = item.discount ? item.price * (1 - item.discount) : item.price;
      return sum + itemPrice * item.quantity;
    }, 0);
  };

  const getDiscountSavings = () => {
    return items.reduce((sum, item) => {
      if (item.discount) {
        return sum + item.price * item.discount * item.quantity;
      }
      return sum;
    }, 0);
  };

  const getTotal = () => {
    return getSubtotal();
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemCount,
      getSubtotal,
      getDiscountSavings,
      getTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
