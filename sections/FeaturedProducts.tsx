"use client";

import { useEffect, useRef, useState } from "react";
import AppImage from "@/components/AppImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useSpring } from "framer-motion";
import { Eye, Heart, X } from "lucide-react";
import { useWishlist, type WishlistItem } from "@/store/WishlistContext";
import { formatShopPrice, getSaleBadgeLabel, hasActiveSale, shouldShowCompareAtPrice, shouldShowSaleBadge } from "@/services/shop-products";

export type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  onSale?: boolean;
  saleBadge?: string;
  image: string;
  alt: string;
  description: string;
};

type ProductCardProps = {
  product: Product;
  index: number;
  onQuickView: (product: Product) => void;
};

function toWishlistItem(product: Product): WishlistItem {
  return {
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: product.price,
    image: product.image,
    alt: product.alt,
  };
}

function ProductCard({ product, index, onQuickView }: ProductCardProps) {
  const router = useRouter();
  const { isInWishlist, toggleItem } = useWishlist();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isWishlisted = isInWishlist(product.slug);

  const rotateX = useSpring(0, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 30 });
  const shadowX = useSpring(0, { stiffness: 300, damping: 30 });
  const shadowY = useSpring(12, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    rotateY.set(x * 14);
    rotateX.set(-y * 14);
    shadowX.set(x * 24);
    shadowY.set(12 + y * 16);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    shadowX.set(0);
    shadowY.set(12);
  };

  return (
    <motion.article
      className="product-card-wrap relative"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.75,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="product-card-shadow pointer-events-none absolute -bottom-3 left-[10%] right-[10%] h-8 rounded-[50%]"
        style={{
          x: shadowX,
          y: shadowY,
          opacity: isHovered ? 0.55 : 0.3,
        }}
      />

      <div className="product-card relative flex h-full flex-col overflow-hidden rounded-[1.5rem]">
        {/* Image â€” 3D tilt only on image area */}
        <motion.div
          ref={cardRef}
          className="product-card-image relative aspect-square overflow-hidden"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
        >
          <AppImage
            src={product.image}
            alt={product.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isHovered ? "scale-105" : "scale-100"
            }`}
          />
          <div className="product-card-image-overlay pointer-events-none absolute inset-0" />

          {shouldShowSaleBadge(product) && (
            <span className="shop-sale-badge">{getSaleBadgeLabel(product)}</span>
          )}

          <button
            type="button"
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleItem(toWishlistItem(product));
            }}
            className="product-card-action absolute left-3 top-3 z-20 sm:left-4 sm:top-4"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isWishlisted
                  ? "fill-mango-400 text-mango-400"
                  : "text-white/80"
              }`}
              strokeWidth={1.75}
            />
          </button>

          <motion.button
            type="button"
            aria-label="Quick view"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className={`product-card-quickview absolute inset-x-0 bottom-0 z-20 flex items-center justify-center gap-2 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white ${
              isHovered ? "pointer-events-auto" : "pointer-events-none"
            }`}
            initial={false}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 12,
            }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Eye className="h-4 w-4" strokeWidth={1.5} />
            Quick View
          </motion.button>
        </motion.div>

        {/* Details â€” flat layer for reliable clicks */}
        <div className="relative z-20 flex flex-1 flex-col p-5 sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-400/65">
            {product.category}
          </p>

          <Link href={`/products/${product.slug}`} className="mt-2 block">
            <h3
              className="line-clamp-2 text-lg font-semibold leading-snug text-white transition-colors hover:text-gold-200 sm:text-xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {product.name}
            </h3>
          </Link>

          <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            {shouldShowCompareAtPrice({ ...product, minPrice: product.price }) && (
              <span className="text-base text-white/35 line-through sm:text-lg">
                {formatShopPrice(product.compareAtPrice)}
              </span>
            )}
            <p className="text-lg font-semibold text-gold-300 sm:text-xl">
              {formatShopPrice(product.price)}
            </p>
          </div>

          <button
            type="button"
            className="select-options-btn mt-auto pt-5"
            onClick={() => router.push(`/products/${product.slug}`)}
          >
            Select Options
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function QuickViewModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const router = useRouter();
  const { isInWishlist, toggleItem } = useWishlist();
  const isWishlisted = isInWishlist(product.slug);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      className="product-quickview fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        type="button"
        aria-label="Close quick view"
        className="absolute inset-0"
        onClick={onClose}
      >
        <span className="product-quickview-backdrop absolute inset-0" />
      </button>

      <motion.div
        className="product-quickview-panel relative z-10 grid w-full max-w-4xl overflow-hidden rounded-[1.75rem] sm:grid-cols-2 sm:rounded-[2rem]"
        initial={{ scale: 0.94, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 12 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-square sm:aspect-auto sm:min-h-[360px]">
          <AppImage
            src={product.image}
            alt={product.alt}
            fill
            sizes="(max-width: 768px) 100vw, 512px"
            className="object-cover"
          />
          {shouldShowSaleBadge(product) && (
            <span className="shop-sale-badge">{getSaleBadgeLabel(product)}</span>
          )}
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <div className="absolute right-4 top-4 flex gap-2 sm:right-5 sm:top-5">
            <button
              type="button"
              onClick={() => toggleItem(toWishlistItem(product))}
              aria-label={
                isWishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
              className="product-card-action"
            >
              <Heart
                className={`h-4 w-4 ${
                  isWishlisted
                    ? "fill-mango-400 text-mango-400"
                    : "text-white/85"
                }`}
                strokeWidth={1.75}
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="product-card-action"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-400/70">
            {product.category}
          </p>
          <h3
            className="mt-3 text-2xl font-semibold text-white sm:text-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {product.name}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-white/55 sm:text-[15px]">
            {product.description}
          </p>
          <div className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            {shouldShowCompareAtPrice({ ...product, minPrice: product.price }) && (
              <span className="text-xl text-white/35 line-through">
                {formatShopPrice(product.compareAtPrice)}
              </span>
            )}
            <p className="text-2xl font-semibold text-gold-300">
              {formatShopPrice(product.price)}
            </p>
          </div>

          <button
            type="button"
            className="select-options-btn mt-8"
            onClick={() => {
              onClose();
              router.push(`/products/${product.slug}`);
            }}
          >
            Select Options
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FeaturedProducts({
  products = [],
}: {
  products?: Product[];
}) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null,
  );

  return (
    <section
      id="products"
      className="products-section relative overflow-hidden py-24 sm:py-32 lg:py-40"
    >
      <div className="products-section-glow pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div
          className="mb-14 flex flex-col items-start justify-between gap-6 sm:mb-16 md:flex-row md:items-end lg:mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="max-w-xl">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-400/80">
              Featured Products
            </p>
            <h2
              className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Curated{" "}
              <span className="luxury-gradient-text italic">Excellence</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/50 sm:text-[15px]">
              Discover our finest mango selections â€” export quality, orchard
              fresh, delivered with royal care.
            </p>
          </div>

          <Link
            href="/products"
            className="product-view-all shrink-0 text-[13px] font-medium tracking-wide text-gold-300/80 transition-colors hover:text-gold-300"
          >
            View All Products â†’
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-4 lg:gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
