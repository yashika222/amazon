"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import API from "../lib/api";

interface CartContextProps {
  cartCount: number;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextProps>({
  cartCount: 0,
  refreshCart: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = async () => {
    try {
      const res = await API.get("/cart");
      const items = res.data?.items || [];
      const count = items.reduce((acc: number, item: any) => acc + item.quantity, 0);
      setCartCount(count);
    } catch (error) {
      console.error("Failed to fetch cart context total", error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
