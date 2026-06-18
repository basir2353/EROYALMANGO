import type { Metadata } from "next";
import AllProductsPage from "@/components/shop/AllProductsPage";
import {
  fetchCatalogCategories,
  fetchCatalogProducts,
  fetchHottestDeals,
} from "@/services/catalog";

export const metadata: Metadata = {
  title: "All Products | E Royal Mango",
  description:
    "Browse our full mango collection — Anwar Ratol, Chaunsa, Sindhri, Dussehri, Langra, and more. Export quality, orchard fresh.",
};

export default async function ProductsPage() {
  const [products, categories, hottestDeals] = await Promise.all([
    fetchCatalogProducts(),
    fetchCatalogCategories(),
    fetchHottestDeals(),
  ]);

  return (
    <main>
      <AllProductsPage
        products={products}
        categories={categories}
        hottestDeals={hottestDeals}
      />
    </main>
  );
}
