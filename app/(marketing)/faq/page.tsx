import type { Metadata } from "next";
import FaqPage from "@/components/faq/FaqPage";
import { getPublicSettings } from "@/lib/api";
import { fetchFaqCategories } from "@/services/content";

export const metadata: Metadata = {
  title: "FAQ | E Royal Mango",
  description:
    "Frequently asked questions about warranty, returns, shipping, and mango refund policy at E Royal Mango.",
};

export default async function FaqRoutePage() {
  const [categories, settings] = await Promise.all([
    fetchFaqCategories(),
    getPublicSettings(),
  ]);

  const phone = settings?.website?.contactPhone ?? "+92 307 3970850";
  const phoneDigits = phone.replace(/\D/g, "");

  return (
    <main>
      <FaqPage
        intro="Find answers about our warranty, returns, shipping, and mango refund policy. If you need more help, our team is available around the clock."
        categories={categories}
        emergencyPhone={phone}
        emergencyPhoneHref={`tel:+${phoneDigits}`}
      />
    </main>
  );
}
