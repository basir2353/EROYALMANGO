"use client";

import type { ReactNode } from "react";
import AppImage from "@/components/AppImage";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  formatShopPrice,
  shouldShowCompareAtPrice,
  type ShopProduct,
} from "@/services/shop-products";

export type CatalogProductCardData = {
  slug: string;
  name: string;
  category: string;
  image: string;
  alt: string;
  minPrice: number;
  maxPrice?: number;
  compareAtPrice?: number;
  onSale?: boolean;
};

function overlayLabel(name: string, category: string) {
  const first = name.split(/\s+/)[0]?.replace(/[^a-zA-Z]/g, "");
  if (first && first.length >= 3) return first.toUpperCase();
  return category.toUpperCase();
}

function formatCardPrice(product: CatalogProductCardData) {
  if (product.maxPrice && product.maxPrice !== product.minPrice) {
    return `${formatShopPrice(product.minPrice)} – ${formatShopPrice(product.maxPrice)}`;
  }
  return formatShopPrice(product.minPrice);
}

type ProductCardClassicProps = {
  product: CatalogProductCardData;
  index?: number;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  beforeCta?: ReactNode;
};

export default function ProductCardClassic({
  product,
  index = 0,
  ctaLabel = "Select options",
  ctaHref,
  onCtaClick,
  beforeCta,
}: ProductCardClassicProps) {
  const priceProduct = {
    minPrice: product.minPrice,
    compareAtPrice: product.compareAtPrice,
    onSale: product.onSale ?? false,
  } satisfies Pick<ShopProduct, "minPrice" | "compareAtPrice" | "onSale">;

  return (
    <motion.article
      className="catalog-product-card group flex h-full flex-col overflow-hidden rounded-sm border border-[#e8e8e8] bg-white shadow-[0_2px_12px_rgb(0_0_0/0.06)] transition-shadow duration-300 hover:shadow-[0_6px_24px_rgb(0_0_0/0.1)]"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="catalog-product-card-image relative block aspect-[4/3] overflow-hidden bg-[#1a1a1a]"
      >
        <AppImage
          src={product.image}
          alt={product.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/10" />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center px-3 text-center text-lg font-bold uppercase leading-tight tracking-[0.1em] text-white drop-shadow-[0_2px_8px_rgb(0_0_0/0.45)] sm:px-4 sm:text-2xl sm:tracking-[0.12em] md:text-3xl">
          {overlayLabel(product.name, product.category)}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="line-clamp-2 text-[15px] font-normal leading-snug text-[#212121] sm:text-base">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          {shouldShowCompareAtPrice(priceProduct) && (
            <span className="text-sm text-[#9e9e9e] line-through">
              {formatShopPrice(product.compareAtPrice)}
            </span>
          )}
          <p className="text-sm font-medium text-[#424242] sm:text-[15px]">
            {formatCardPrice(product)}
          </p>
        </div>

        {beforeCta}

        {onCtaClick ? (
          <button
            type="button"
            onClick={onCtaClick}
            className="catalog-product-card-cta mt-4 inline-flex w-full items-center justify-center rounded-sm bg-[#ffcc00] px-4 py-2.5 text-sm font-semibold text-[#212121] transition-colors hover:bg-[#006400] hover:text-white"
          >
            {ctaLabel}
          </button>
        ) : (
          <Link
            href={ctaHref ?? `/products/${product.slug}`}
            className="catalog-product-card-cta mt-4 inline-flex w-full items-center justify-center rounded-sm bg-[#ffcc00] px-4 py-2.5 text-sm font-semibold text-[#212121] transition-colors hover:bg-[#006400] hover:text-white"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </motion.article>
  );
}
