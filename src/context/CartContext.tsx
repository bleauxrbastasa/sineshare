import React, { createContext, useContext, useState, useCallback } from "react";
import { CartItem, GearItem } from "@/lib/types";

interface CartContextType {
  items: CartItem[];
  addItem: (gear: GearItem, quantity: number, pickup: Date, returnDate: Date) => void;
  removeItem: (gearId: string) => void;
  updateQuantity: (gearId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((gear: GearItem, quantity: number, pickup: Date, returnDate: Date) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.gear.id === gear.id);
      if (existing) {
        return prev.map((i) =>
          i.gear.id === gear.id
            ? { ...i, quantity: i.quantity + quantity, pickup_date: pickup, return_date: returnDate }
            : i
        );
      }
      return [...prev, { gear, quantity, pickup_date: pickup, return_date: returnDate }];
    });
  }, []);

  const removeItem = useCallback((gearId: string) => {
    setItems((prev) => prev.filter((i) => i.gear.id !== gearId));
  }, []);

  const updateQuantity = useCallback((gearId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.gear.id !== gearId));
    } else {
      setItems((prev) => prev.map((i) => (i.gear.id === gearId ? { ...i, quantity } : i)));
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
