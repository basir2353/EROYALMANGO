"use client";

import { useEffect, useState } from "react";
import AppImage from "@/components/AppImage";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/store/CartContext";
import { useWishlist, type WishlistItem } from "@/store/WishlistContext";
import { resolveMediaUrl } from "@/lib/media";
import {
  Eye,
  Heart,
  ShoppingBag,
  Star,
  X,
} from "lucide-react";
import { formatShopPrice, getSaleBadgeLabel, shouldShowCompareAtPrice, shouldShowSaleBadge } from "@/services/shop-products";

type BestSeller = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  onSale: boolean;
  saleBadge?: string;
  rating: number;
  reviewCount: number;
  image: string;
  alt: string;
  description: string;
};

function toWishlistItem(product: BestSeller): WishlistItem {
  return {
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: product.price,
    image: product.image,
    alt: product.alt,
  };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = rating >= i + 1;
        const partial = !filled && rating > i && rating < i + 1;

        return (
          <Star
            key={i}
            className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
              filled || partial
                ? "fill-mango-400 text-mango-400"
                : "fill-white/10 text-white/20"
            }`}
            strokeWidth={1.5}
            style={
              partial
                ? {
                    clipPath: `inset(0 ${100 - (rating - i) * 100}% 0 0)`,
                  }
                : undefined
            }
          />
        );
      })}
      <span className="ml-1.5 text-xs text-white/45">
        ({rating.toFixed(1)})
      </span>
    </div>
  );
}

function BestSellerCard({
  product,
  index,
  isInCart,
  onAddToCart,
  onQuickView,
}: {
  product: BestSeller;
  index: number;
  isInCart: boolean;
  onAddToCart: (product: BestSeller) => void;
  onQuickView: (product: BestSeller) => void;
}) {
  const { isInWishlist, toggleItem } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const isWishlisted = isInWishlist(product.slug);

  return (
    <motion.article
      className="bestseller-card group relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="bestseller-glass-card flex h-full flex-col overflow-hidden rounded-[1.5rem]">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden sm:aspect-square">
          <motion.div
            className="relative h-full w-full"
            animate={{ scale: isHovered ? 1.06 : 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <AppImage
              src={product.image}
              alt={product.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </motion.div>

          <div className="bestseller-image-overlay absolute inset-0" />

          {shouldShowSaleBadge(product) && (
            <span className="shop-sale-badge">{getSaleBadgeLabel(product)}</span>
          )}

          <div className="absolute left-3 top-3 z-20 flex flex-col gap-2 sm:left-4 sm:top-4">
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
              className="bestseller-icon-btn"
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

            <motion.button
              type="button"
              aria-label="Quick view"
              onClick={() => onQuickView(product)}
              className="bestseller-icon-btn"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.8,
              }}
              transition={{ duration: 0.3 }}
            >
              <Eye className="h-4 w-4 text-white/85" strokeWidth={1.75} />
            </motion.button>
          </div>

          <motion.div
            className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.35 }}
          >
            <button
              type="button"
              onClick={() => onQuickView(product)}
              className="bestseller-quickview-bar w-full"
            >
              Quick View
            </button>
          </motion.div>
        </div>

        {/* Details */}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-400/60">
            {product.category}
          </p>

          <h3
            className="mt-2 line-clamp-2 text-lg font-semibold leading-snug text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {product.name}
          </h3>

          <div className="mt-3">
            <StarRating rating={product.rating} />
            <p className="mt-1 text-[11px] text-white/35">
              {product.reviewCount.toLocaleString()} reviews
            </p>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 pt-5">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              {shouldShowCompareAtPrice({ ...product, minPrice: product.price }) && (
                <span className="text-base text-white/35 line-through sm:text-lg">
                  {formatShopPrice(product.compareAtPrice)}
                </span>
              )}
              <p className="text-lg font-semibold text-gold-300 sm:text-xl">
                {formatShopPrice(product.price)}
              </p>
            </div>

            <motion.button
              type="button"
              onClick={() => onAddToCart(product)}
              className={`bestseller-cart-btn shrink-0 ${isInCart ? "bestseller-cart-btn-added" : ""}`}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
              <span className="hidden sm:inline">
                {isInCart ? "Added" : "Add to Cart"}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function QuickViewModal({
  product,
  onClose,
}: {
  product: BestSeller;
  onClose: () => void;
}) {
  const { items, addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const isWishlisted = isInWishlist(product.slug);
  const isInCart = items.some((item) => item.slug === product.slug);

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const unitPrice = Number(product.price);
    if (!Number.isFinite(unitPrice) || unitPrice < 0) return;

    addItem({
      slug: product.slug,
      name: product.name,
      image: resolveMediaUrl(product.image),
      alt: product.alt,
      quantity: 1,
      unitPrice,
    });
  };

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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <span
        className="product-quickview-backdrop pointer-events-none absolute inset-0"
        aria-hidden="true"
      />

      <motion.div
        className="bestseller-quickview-panel relative z-10 grid w-full max-w-4xl overflow-hidden rounded-[1.75rem] sm:grid-cols-2 sm:rounded-[2rem]"
        initial={{ scale: 0.94, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 12 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view: ${product.name}`}
      >
        <div className="relative aspect-square sm:min-h-[380px]">
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

        <div className="relative z-20 flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <div className="absolute right-4 top-4 flex gap-2 sm:right-5 sm:top-5">
            <button
              type="button"
              onClick={() => toggleItem(toWishlistItem(product))}
              aria-label="Toggle wishlist"
              className="bestseller-icon-btn"
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
              className="bestseller-icon-btn"
            >
              <X className="h-4 w-4 text-white/85" strokeWidth={1.75} />
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

          <div className="mt-4">
            <StarRating rating={product.rating} />
            <p className="mt-1 text-xs text-white/40">
              {product.reviewCount.toLocaleString()} customer reviews
            </p>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-white/55 sm:text-[15px]">
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
            onClick={handleAddToCart}
            className={`bestseller-cart-btn bestseller-cart-btn-lg relative z-20 mt-8 w-full justify-center ${isInCart ? "bestseller-cart-btn-added" : ""}`}
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
            {isInCart ? "Added to Cart" : "Add to Cart"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function BestSellingProducts({
  products = [],
}: {
  products?: Array<{
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
  }>;
}) {
  const bestSellers: BestSeller[] = products.map((p) => ({
    ...p,
    onSale: p.onSale ?? false,
    rating: 4.9,
    reviewCount: 100,
  }));
  const { items, addItem } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<BestSeller | null>(
    null,
  );

  const isProductInCart = (slug: string) =>
    items.some((item) => item.slug === slug);

  const addToCart = (product: BestSeller) => {
    const unitPrice = Number(product.price);
    if (!Number.isFinite(unitPrice) || unitPrice < 0) return;

    addItem({
      slug: product.slug,
      name: product.name,
      image: resolveMediaUrl(product.image),
      alt: product.alt,
      quantity: 1,
      unitPrice,
    });
  };

  return (
    <section className="bestseller-section relative overflow-hidden py-24 sm:py-32 lg:py-40">
      <div className="bestseller-section-glow pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div
          className="mb-14 text-center sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-400/75">
            Customer Favorites
          </p>
          <h2
            className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Most Loved{" "}
            <span className="luxury-gradient-text italic">Products</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/45 sm:text-[15px]">
            Top-rated mangoes loved by thousands â€” orchard fresh, export quality,
            delivered to your door.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-4 lg:gap-8">
          {bestSellers.map((product, index) => (
            <BestSellerCard
              key={product.id}
              product={product}
              index={index}
              isInCart={isProductInCart(product.slug)}
              onAddToCart={addToCart}
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
