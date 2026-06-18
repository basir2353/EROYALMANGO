import type { Metadata } from "next";
import CheckoutPage from "@/components/checkout/CheckoutPage";

export const metadata: Metadata = {
  title: "Checkout | E Royal Mango",
  description:
    "Complete your E Royal Mango order — billing details, order summary, and cash on delivery.",
};

export default function CheckoutRoutePage() {
  return (
    <main>
      <CheckoutPage />
    </main>
  );
}
