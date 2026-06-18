import type { Metadata } from "next";
import WishlistPage from "@/components/wishlist/WishlistPage";

export const metadata: Metadata = {
  title: "Wishlist | E Royal Mango",
  description: "Your saved mangoes — Chaunsa, Sindhri, Anwar Ratol and more at E Royal Mango.",
};

export default function WishlistRoutePage() {
  return (
    <main>
      <WishlistPage />
    </main>
  );
}
