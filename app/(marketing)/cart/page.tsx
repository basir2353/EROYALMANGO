import type { Metadata } from "next";
import CartPage from "@/components/cart/CartPage";

export const metadata: Metadata = {
  title: "Cart | E Royal Mango",
  description: "View your shopping cart — premium Pakistani mangoes from E Royal Mango.",
};

export default function CartRoutePage() {
  return (
    <main>
      <CartPage />
    </main>
  );
}
