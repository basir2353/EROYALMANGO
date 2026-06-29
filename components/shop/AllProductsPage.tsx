"use client";

import { useMemo, useState } from "react";
import AppImage from "@/components/AppImage";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import ProductCardClassic from "@/components/product/ProductCardClassic";
import { resolveMediaUrl } from "@/lib/media";
import { useCart } from "@/store/CartContext";
import { useRouter } from "next/navigation";
import {
  formatPriceRange,
  formatShopPrice,
  getSaleBadgeLabel,
  getUnitPrice,
  shouldShowCompareAtPrice,
  shouldShowSaleBadge,
  sortProducts,
  type ShopProduct,
  type SortOption,
} from "@/services/shop-products";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "default", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

function ShopProductCard({ product, index }: { product: ShopProduct; index: number }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedWeight, setSelectedWeight] = useState(
    product.weights?.[0] ?? null,
  );

  const cardProduct = {
    slug: product.slug,
    name: product.name,
    category: product.category,
    image: product.image,
    alt: product.alt,
    minPrice: product.minPrice,
    maxPrice: product.maxPrice,
    compareAtPrice: product.compareAtPrice,
    onSale: product.onSale,
  };

  const selectHref = `/products/${product.slug}${selectedWeight ? `?weight=${selectedWeight}` : ""}`;

  return (
    <ProductCardClassic
      product={cardProduct}
      index={index}
      ctaLabel={product.action === "select" ? "Select options" : "Add to cart"}
      ctaHref={product.action === "select" ? selectHref : undefined}
      onCtaClick={
        product.action === "cart"
          ? () => {
              addItem({
                slug: product.slug,
                name: product.name,
                image: resolveMediaUrl(product.image),
                alt: product.alt,
                quantity: 1,
                unitPrice: getUnitPrice(product, selectedWeight),
                weight: selectedWeight ?? undefined,
              });
              router.push("/cart");
            }
          : undefined
      }
      beforeCta={
        <div className="mt-3 flex flex-wrap gap-2 pb-1">
          {(product.weights ?? ["10kg", "5kg"]).map((weight) => (
            <button
              key={weight}
              type="button"
              onClick={() => setSelectedWeight(weight)}
              className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors ${
                selectedWeight === weight
                  ? "border-[#ffc107] bg-[#fff8e1] text-[#f57f17]"
                  : "border-[#e0e0e0] bg-white text-[#78909c] hover:border-[#ffc107]"
              }`}
            >
              {weight}
            </button>
          ))}
        </div>
      }
    />
  );
}

function HottestDealItem({
  productId,
  products,
}: {
  productId: string;
  products: ShopProduct[];
}) {
  const product = products.find((item) => item.id === productId || item.slug === productId);
  if (!product) return null;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="shop-deal-item group flex gap-3 rounded-xl p-2 transition-colors hover:bg-white/[0.03]"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
        <AppImage
          src={product.image}
          alt={product.alt}
          fill
          sizes="64px"
          className="object-cover"
        />
        {shouldShowSaleBadge(product) && (
          <span className="shop-deal-badge absolute right-0.5 top-0.5">
            {getSaleBadgeLabel(product)}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1 py-0.5">
        <p
          className="truncate text-sm font-semibold text-white transition-colors group-hover:text-gold-300"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {product.name}
        </p>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          {shouldShowCompareAtPrice(product) && (
            <span className="text-xs text-white/35 line-through">
              {formatShopPrice(product.compareAtPrice)}
            </span>
          )}
          <span className="text-sm font-semibold text-gold-300">
            {formatPriceRange(product)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function AllProductsPage({
  products,
  categories,
  hottestDeals,
}: {
  products: ShopProduct[];
  categories: { name: string; count: number }[];
  hottestDeals: string[];
}) {
  const [sort, setSort] = useState<SortOption>("default");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sortedProducts = useMemo(
    () => sortProducts(products, sort),
    [products, sort],
  );

  return (
    <section className="shop-section relative overflow-hidden bg-white pb-24 pt-8 sm:pb-32 sm:pt-10 lg:pb-40">
      <div className="shop-section-glow pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/45"
        >
          <Link
            href="/"
            className="transition-colors hover:text-gold-300"
          >
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-white/25" aria-hidden="true" />
          <span className="text-gold-300/80">Shop</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[280px_minmax(0,1fr)]">
          {/* Main content — first on mobile */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-400/80">
                All Products
              </p>
              <h1
                className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Shop{" "}
                <span className="luxury-gradient-text italic">Mangoes</span>
              </h1>
            </motion.div>

            <div className="mt-8 flex flex-col gap-4 border-b border-white/8 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-white/45">
                Showing all {products.length} results
              </p>

              <label className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                <span className="text-xs font-medium uppercase tracking-[0.12em] text-white/40 sm:sr-only">
                  Sort products
                </span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="shop-sort-select"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
              {sortedProducts.map((product, index) => (
                <ShopProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Sidebar — collapsible on mobile */}
          <div className="order-2 lg:order-1">
            <button
              type="button"
              onClick={() => setSidebarOpen((open) => !open)}
              className="shop-sidebar-toggle mb-4 flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-semibold text-white lg:hidden"
              aria-expanded={sidebarOpen}
            >
              <span>Categories &amp; Deals</span>
              {sidebarOpen ? (
                <ChevronUp className="h-4 w-4 shrink-0 text-gold-300" />
              ) : (
                <ChevronDown className="h-4 w-4 shrink-0 text-gold-300" />
              )}
            </button>

            <aside
              className={`space-y-6 lg:sticky lg:top-28 lg:self-start ${
                sidebarOpen ? "block" : "hidden lg:block"
              }`}
            >
            <div className="shop-sidebar-panel">
              <h2
                className="text-xl font-semibold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Categories
              </h2>
              <ul className="mt-4 space-y-2">
                {categories.map((category) => (
                  <li key={category.name}>
                    <span className="shop-category-link">
                      {category.name}
                      <span className="text-white/40"> ({category.count})</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="shop-sidebar-panel">
              <h2
                className="text-xl font-semibold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Hottest Deals
              </h2>
              <div className="mt-4 space-y-1">
                {hottestDeals.map((productId) => (
                  <HottestDealItem key={productId} productId={productId} products={products} />
                ))}
              </div>
            </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
