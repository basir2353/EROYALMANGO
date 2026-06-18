"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { resolveMediaUrl } from "@/lib/media";

export type CartItem = {
  lineId: string;
  slug: string;
  name: string;
  image: string;
  alt: string;
  weight?: "10kg" | "5kg";
  quantity: number;
  unitPrice: number;
};

type AddCartInput = {
  slug: string;
  name: string;
  image: string;
  alt: string;
  weight?: "10kg" | "5kg";
  quantity: number;
  unitPrice: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isHydrated: boolean;
  addItem: (input: AddCartInput) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "e-royal-mango-cart";

const CartContext = createContext<CartContextValue | null>(null);

function makeLineId(slug: string, weight?: "10kg" | "5kg") {
  return weight ? `${slug}__${weight}` : slug;
}

function normalizeCartItem(raw: unknown): CartItem | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as Record<string, unknown>;
  const slug = String(item.slug ?? "").trim();
  if (!slug) return null;

  const quantity = Number(item.quantity ?? 1);
  const unitPrice = Number(item.unitPrice ?? item.price ?? 0);
  if (!Number.isFinite(quantity) || quantity < 1) return null;

  const weight = item.weight;
  const normalizedWeight =
    weight === "10kg" || weight === "5kg" ? weight : undefined;

  return {
    lineId: String(item.lineId ?? makeLineId(slug, normalizedWeight)),
    slug,
    name: String(item.name ?? slug),
    image: resolveMediaUrl(String(item.image ?? "")),
    alt: String(item.alt ?? item.name ?? slug),
    weight: normalizedWeight,
    quantity,
    unitPrice: Number.isFinite(unitPrice) ? unitPrice : 0,
  };
}

function loadStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(normalizeCartItem)
      .filter((item): item is CartItem => item !== null);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setItems((prev) => (prev.length > 0 ? prev : loadStoredCart()));
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const addItem = useCallback((input: AddCartInput) => {
    const lineId = makeLineId(input.slug, input.weight);
    const unitPrice = Number(input.unitPrice);
    const quantity = Number(input.quantity);
    if (!Number.isFinite(unitPrice) || unitPrice < 0 || !Number.isFinite(quantity) || quantity < 1) {
      return;
    }

    setItems((prev) => {
      const existing = prev.find((item) => item.lineId === lineId);
      const image = resolveMediaUrl(input.image);
      if (existing) {
        return prev.map((item) =>
          item.lineId === lineId
            ? {
                ...item,
                quantity: item.quantity + quantity,
                image: item.image ? item.image : image,
                unitPrice: unitPrice > 0 ? unitPrice : item.unitPrice,
              }
            : item,
        );
      }
      return [
        ...prev,
        {
          lineId,
          slug: input.slug,
          name: input.name,
          image,
          alt: input.alt,
          weight: input.weight,
          quantity,
          unitPrice,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((item) => item.lineId !== lineId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.lineId === lineId ? { ...item, quantity } : item,
      ),
    );
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((item) => item.lineId !== lineId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (Number(item.unitPrice) || 0) * (Number(item.quantity) || 0),
        0,
      ),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      isHydrated,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [
      items,
      itemCount,
      subtotal,
      isHydrated,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    ],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
