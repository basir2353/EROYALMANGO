"use client";

import { useMemo, useRef, useState } from "react";
import AppImage from "@/components/AppImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useSpring } from "framer-motion";
import { useCart } from "@/store/CartContext";
import { resolveMediaUrl } from "@/lib/media";
import {
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  ZoomIn,
} from "lucide-react";
import {
  formatPriceRange,
  formatShopPrice,
  getSaleBadgeLabel,
  getUnitPrice,
  hasActiveSale,
  shouldShowCompareAtPrice,
  shouldShowSaleBadge,
  type ShopProduct,
} from "@/services/shop-products";

type TabId = "description" | "additional" | "reviews";

function RelatedProductCard({ product }: { product: ShopProduct }) {
  const productHref = `/products/${product.slug}`;

  return (
    <article className="shop-product-card group flex flex-col">
      <Link href={productHref} className="shop-product-image-wrap">
        <AppImage
          src={product.image}
          alt={product.alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="shop-product-image-overlay" />
        {shouldShowSaleBadge(product) && (
          <span className="product-sale-badge">{getSaleBadgeLabel(product)}</span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-400/60">
          {product.category}
        </p>
        <Link href={productHref}>
          <h3
            className="mt-2 text-lg font-semibold text-white transition-colors group-hover:text-gold-200"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 text-base font-semibold text-gold-300">
          {formatPriceRange(product)}
        </p>
        <Link href={productHref} className="select-options-btn mt-4">
          Select Options
        </Link>
      </div>
    </article>
  );
}

export default function ProductDetailPage({
  product,
  initialWeight,
  relatedProducts = [],
}: {
  product: ShopProduct;
  initialWeight: "10kg" | "5kg" | null;
  relatedProducts?: ShopProduct[];
}) {
  const router = useRouter();
  const { addItem } = useCart();

  const [selectedWeight, setSelectedWeight] = useState<"10kg" | "5kg" | null>(
    initialWeight,
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabId>("description");
  const [added, setAdded] = useState(false);

  const unitPrice = useMemo(
    () => getUnitPrice(product, selectedWeight),
    [product, selectedWeight],
  );

  const lineTotal = unitPrice * quantity;

  const imageRef = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, { stiffness: 260, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 260, damping: 30 });

  const related = relatedProducts;

  const handleImageMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = imageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(x * 6);
    rotateX.set(-y * 6);
  };

  const handleImageLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const handleAddToCart = () => {
    if (product.weights && !selectedWeight) return;

    addItem({
      slug: product.slug,
      name: product.name,
      image: resolveMediaUrl(product.image),
      alt: product.alt,
      weight: selectedWeight ?? undefined,
      quantity,
      unitPrice,
    });

    setAdded(true);
    setTimeout(() => {
      router.push("/cart");
    }, 600);
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: "description", label: "Description" },
    { id: "additional", label: "Additional information" },
    { id: "reviews", label: `Reviews (${product.reviewCount})` },
  ];

  return (
    <div className="product-detail-page">
      <section className="shop-section relative overflow-hidden pb-12 pt-8 sm:pb-16 sm:pt-10">
        <div className="shop-section-glow pointer-events-none absolute inset-0" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <nav
            aria-label="Breadcrumb"
            className="mb-10 flex flex-wrap items-center gap-2 text-sm text-white/45"
          >
            <Link href="/" className="transition-colors hover:text-gold-300">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-white/25" aria-hidden="true" />
            <Link href="/products" className="transition-colors hover:text-gold-300">
              Products
            </Link>
            <ChevronRight className="h-4 w-4 text-white/25" aria-hidden="true" />
            <span className="text-gold-300/80">{product.name}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="product-detail-image-wrap"
              style={{ perspective: 1200 }}
            >
              <motion.div
                ref={imageRef}
                className="product-detail-image-3d relative overflow-hidden rounded-[1.75rem]"
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                onMouseMove={handleImageMove}
                onMouseLeave={handleImageLeave}
              >
                <div className="relative aspect-square">
                  <AppImage
                    src={product.image}
                    alt={product.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                  <div className="shop-product-image-overlay" />
                  {shouldShowSaleBadge(product) && (
                    <span className="product-sale-badge">{getSaleBadgeLabel(product)}</span>
                  )}
                  <span className="product-detail-zoom absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full">
                    <ZoomIn className="h-4 w-4 text-white/80" strokeWidth={1.5} />
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="product-detail-info"
            >
              <h1
                className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {product.name}
              </h1>

              <div className="mt-4">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  {shouldShowCompareAtPrice(product) && (
                    <p className="text-xl font-medium text-white/35 line-through sm:text-2xl">
                      {formatShopPrice(product.compareAtPrice)}
                    </p>
                  )}
                  <p className="text-2xl font-semibold text-gold-300 sm:text-3xl">
                    {formatShopPrice(unitPrice)}
                    {product.weights && selectedWeight && (
                      <span className="ml-2 text-base font-medium text-white/40">
                        / {selectedWeight}
                      </span>
                    )}
                  </p>
                </div>
                {!product.weights && (
                  <p className="mt-1 text-sm text-white/40">
                    {formatPriceRange(product)}
                  </p>
                )}
                {hasActiveSale(product) && product.discountPercent != null && product.discountPercent > 0 && (
                  <p className="mt-1 text-sm font-medium text-gold-400/80">
                    {product.discountPercent}% off
                  </p>
                )}
                <p className="mt-3 text-lg font-semibold text-white/80">
                  Total:{" "}
                  <span className="text-gold-300">{formatShopPrice(lineTotal)}</span>
                  {quantity > 1 && (
                    <span className="text-sm font-normal text-white/40">
                      {" "}
                      ({quantity} Ã— {formatShopPrice(unitPrice)})
                    </span>
                  )}
                </p>
              </div>

              {product.freeShipping && (
                <p className="mt-2 text-sm font-medium text-white/45">
                  Free Shipping
                </p>
              )}

              <p className="mt-6 text-sm leading-relaxed text-white/55 sm:text-[15px]">
                {product.shortDescription}
              </p>

              {product.weights && (
                <div className="mt-8">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-400/70">
                    Select Weight
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {product.weights.map((weight) => (
                      <button
                        key={weight}
                        type="button"
                        onClick={() => setSelectedWeight(weight)}
                        className={`shop-weight-btn px-5 py-2.5 text-sm ${
                          selectedWeight === weight ? "shop-weight-btn-active" : ""
                        }`}
                      >
                        {weight}
                        <span className="ml-2 text-white/40">
                          {formatShopPrice(getUnitPrice(product, weight))}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="product-detail-qty flex items-center rounded-full">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="product-detail-qty-btn"
                  >
                    <Minus className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                  <span className="product-detail-qty-value min-w-[2.5rem] text-center text-sm font-semibold text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="product-detail-qty-btn"
                  >
                    <Plus className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`product-detail-add-cart flex flex-1 items-center justify-center gap-2 sm:flex-none sm:min-w-[220px] ${
                    added ? "product-detail-add-cart-added" : ""
                  }`}
                >
                  <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
                  {added ? "Added to Cart" : "Add to Cart"}
                </button>
              </div>

              <div className="mt-8 space-y-2 border-t border-white/8 pt-6 text-sm text-white/45">
                <p>
                  <span className="text-white/35">SKU:</span>{" "}
                  <span className="text-white/60">ERM-{product.id.toUpperCase()}</span>
                </p>
                <p>
                  <span className="text-white/35">Category:</span>{" "}
                  <Link
                    href="/products"
                    className="text-gold-400 transition-colors hover:text-gold-300"
                  >
                    {product.category}
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="relative border-t border-white/6 pb-16 sm:pb-24">
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="product-detail-tabs flex flex-wrap gap-1 border-b border-white/8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`product-detail-tab px-5 py-4 text-sm font-semibold transition-colors ${
                  activeTab === tab.id ? "product-detail-tab-active" : ""
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="product-detail-tab-panel mt-8">
            {activeTab === "description" && (
              <div className="max-w-3xl">
                <h2
                  className="text-xl font-semibold text-white sm:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {product.descriptionTitle}
                </h2>
                <div className="mt-5 space-y-4 text-sm leading-relaxed text-white/55 sm:text-[15px]">
                  {product.descriptionParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "additional" && (
              <table className="product-detail-table w-full max-w-xl text-sm">
                <tbody>
                  {product.additionalInfo.map((row) => (
                    <tr key={row.label} className="border-b border-white/6">
                      <th className="py-3 pr-6 text-left font-semibold text-gold-400/80">
                        {row.label}
                      </th>
                      <td className="py-3 text-white/55">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "reviews" && (
              <p className="text-sm text-white/45">
                There are no reviews yet. Be the first to review{" "}
                <span className="text-gold-300">{product.name}</span> after your
                purchase.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="relative overflow-hidden pb-24 sm:pb-32">
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <h2
              className="mb-8 text-2xl font-semibold text-white sm:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Related <span className="luxury-gradient-text italic">products</span>
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {related.map((item) => (
                <RelatedProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
