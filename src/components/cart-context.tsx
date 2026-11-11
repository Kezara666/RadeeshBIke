"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { getProductById, type Product } from "@/data/catalog";

export type CartItem = { productId: string; qty: number };

type CartContextValue = {
  items: CartItem[];
  /** Resolved line items, with product data attached. Unknown products are dropped. */
  lines: { product: Product; qty: number }[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "radeeshbike-cart-v1";
const MAX_QTY = 10;
const MAX_LINES = 100;
const EMPTY = "[]";

const CartContext = createContext<CartContextValue | null>(null);

/* ---------- External store ----------
 * The cart lives in a tiny store read through useSyncExternalStore. That keeps
 * server render and first client render identical (empty cart) and avoids
 * setState-in-effect hydration. A module-level cache also keeps the cart working
 * when localStorage is blocked, for the rest of the session. */

let cache: string | null = null; // serialised cart; null = not loaded yet
const listeners = new Set<() => void>();

function parse(raw: string): CartItem[] {
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data
      .filter(
        (i): i is CartItem =>
          typeof i?.productId === "string" && Number.isInteger(i?.qty) && i.qty > 0 && i.qty <= MAX_QTY,
      )
      .slice(0, MAX_LINES);
  } catch {
    return [];
  }
}

function getSnapshot(): string {
  if (cache === null) {
    try {
      cache = window.localStorage.getItem(STORAGE_KEY) ?? EMPTY;
    } catch {
      cache = EMPTY;
    }
  }
  return cache;
}

function getServerSnapshot(): string {
  return EMPTY;
}

function writeCart(items: CartItem[]) {
  const raw = JSON.stringify(items);
  cache = raw;
  try {
    window.localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    // Storage blocked (private mode, disabled). The in-memory cart still works.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Pick up changes made in other tabs.
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const noopSubscribe = () => () => {};
const readyOnClient = () => true;
const readyOnServer = () => false;

/* ---------- Provider ---------- */

export function CartProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(noopSubscribe, readyOnClient, readyOnServer);
  const items = useMemo(() => parse(raw), [raw]);

  const add = useCallback((productId: string, qty = 1) => {
    const prev = parse(getSnapshot());
    const existing = prev.find((i) => i.productId === productId);
    const next = existing
      ? prev.map((i) => (i.productId === productId ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) } : i))
      : [...prev, { productId, qty: Math.min(MAX_QTY, qty) }].slice(0, MAX_LINES);
    writeCart(next);
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    const next = Math.min(MAX_QTY, Math.max(1, Math.floor(qty)));
    writeCart(parse(getSnapshot()).map((i) => (i.productId === productId ? { ...i, qty: next } : i)));
  }, []);

  const remove = useCallback((productId: string) => {
    writeCart(parse(getSnapshot()).filter((i) => i.productId !== productId));
  }, []);

  const clear = useCallback(() => writeCart([]), []);

  const value = useMemo<CartContextValue>(() => {
    const lines = items
      .map((i) => {
        const product = getProductById(i.productId);
        return product ? { product, qty: i.qty } : null;
      })
      .filter((l): l is { product: Product; qty: number } => l !== null);

    return {
      items,
      lines,
      count: lines.reduce((sum, l) => sum + l.qty, 0),
      subtotal: lines.reduce((sum, l) => sum + l.product.price * l.qty, 0),
      ready,
      add,
      setQty,
      remove,
      clear,
    };
  }, [items, ready, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
