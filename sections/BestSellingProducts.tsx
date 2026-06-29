"use client";

import { motion } from "framer-motion";
import ProductCardClassic, {
  type CatalogProductCardData,
} from "@/components/product/ProductCardClassic";

export default function BestSellingProducts({
  products = [],
}: {
  products?: Array<
    CatalogProductCardData & {
      id: number;
      description?: string;
    }
  >;
}) {
  if (products.length === 0) return null;

  return (
    <section className="bestseller-section relative overflow-hidden bg-[#f8f8f8] py-16 sm:py-20 lg:py-24">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div
          className="mb-10 text-center sm:mb-12 lg:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#78909c]">
            Customer Favorites
          </p>
          <h2
            className="text-3xl font-semibold tracking-tight text-[#263238] sm:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Most Loved Products
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#607d8b] sm:text-base">
            Top-rated mangoes loved by thousands — orchard fresh, export quality,
            delivered to your door.
          </p>
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
