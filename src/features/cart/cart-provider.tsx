"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CART_STORAGE_KEY,
  addCartLine,
  cartItemCount,
  parseStoredCart,
  setCartLineQuantity,
} from "./model";
import type { AddCartItem, CartLine } from "./types";

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  hydrated: boolean;
  notice: string | null;
  addItem: (item: AddCartItem) => void;
  removeItem: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  dismissNotice: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setLines(parseStoredCart(window.localStorage.getItem(CART_STORAGE_KEY)));
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (hydrated)
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
  }, [hydrated, lines]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const addItem = useCallback((item: AddCartItem) => {
    setLines((current) => addCartLine(current, item));
    setNotice(`${item.product.name} added to cart`);
  }, []);
  const removeItem = useCallback((lineId: string) => {
    setLines((current) => current.filter((line) => line.lineId !== lineId));
  }, []);
  const setQuantity = useCallback((lineId: string, quantity: number) => {
    setLines((current) => setCartLineQuantity(current, lineId, quantity));
  }, []);
  const clearCart = useCallback(() => setLines([]), []);
  const dismissNotice = useCallback(() => setNotice(null), []);

  const value = useMemo(
    () => ({
      lines,
      itemCount: cartItemCount(lines),
      hydrated,
      notice,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      dismissNotice,
    }),
    [
      lines,
      hydrated,
      notice,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      dismissNotice,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {notice && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 bottom-40 left-4 z-[90] flex items-center justify-between gap-4 rounded-[10px] bg-[#24251f] px-4 py-3 text-sm text-[#fbf8f0] shadow-[0_10px_30px_rgba(0,0,0,.28)] sm:right-48 sm:bottom-5 sm:left-auto sm:max-w-sm"
        >
          <span>{notice}</span>
          <button
            type="button"
            onClick={dismissNotice}
            className="min-h-10 border-l border-white/15 pl-4 text-[10px] font-bold tracking-[.12em] text-[color:var(--gold)] uppercase"
          >
            Dismiss
          </button>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}
