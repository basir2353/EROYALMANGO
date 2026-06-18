"use client";

import { CartProvider } from "@/store/CartContext";
import { WishlistProvider } from "@/store/WishlistContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </CartProvider>
  );
}
