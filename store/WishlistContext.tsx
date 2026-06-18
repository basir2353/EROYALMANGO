"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type WishlistItem = {
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string;
  alt: string;
};

type WishlistContextValue = {
  items: WishlistItem[];
  itemCount: number;
  isHydrated: boolean;
  isInWishlist: (slug: string) => boolean;
  toggleItem: (item: WishlistItem) => void;
  removeItem: (slug: string) => void;
  clearWishlist: () => void;
};

const STORAGE_KEY = "e-royal-mango-wishlist";

const WishlistContext = createContext<WishlistContextValue | null>(null);

function loadStoredWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WishlistItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setItems(loadStoredWishlist());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const isInWishlist = useCallback(
    (slug: string) => items.some((item) => item.slug === slug),
    [items],
  );

  const toggleItem = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((entry) => entry.slug === item.slug);
      if (exists) {
        return prev.filter((entry) => entry.slug !== item.slug);
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((item) => item.slug !== slug));
  }, []);

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.length;

  const value = useMemo(
    () => ({
      items,
      itemCount,
      isHydrated,
      isInWishlist,
      toggleItem,
      removeItem,
      clearWishlist,
    }),
    [
      items,
      itemCount,
      isHydrated,
      isInWishlist,
      toggleItem,
      removeItem,
      clearWishlist,
    ],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
