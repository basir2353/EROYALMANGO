"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ProductCardClassic, {
  type CatalogProductCardData,
} from "@/components/product/ProductCardClassic";

export type Product = CatalogProductCardData & {
  id: number;
  description?: string;
};

export default function FeaturedProducts({
  products = [],
}: {
  products?: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <section
      id="products"
      className="products-section relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div
          className="mb-10 flex flex-col items-start justify-between gap-6 sm:mb-12 md:flex-row md:items-end lg:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#78909c]">
              Featured Products
            </p>
            <h2
              className="text-3xl font-semibold tracking-tight text-[#263238] sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Curated Excellence
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#607d8b] sm:text-base">
              Discover our finest mango selections — export quality, orchard fresh,
              delivered to your door.
            </p>
          </div>

          <Link
            href="/products"
            className="shrink-0 text-sm font-medium text-[#0288d1] transition-colors hover:text-[#0277bd]"
          >
            View All Products →
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {products.map((product, index) => (
            <ProductCardClassic key={product.slug} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
