"use client";

import AppImage from "@/components/AppImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, Heart, Trash2 } from "lucide-react";
import FloatingMango from "@/components/hero/FloatingMango";
import { useWishlist } from "@/store/WishlistContext";

function formatPrice(amount: number) {
  return `Rs ${amount.toLocaleString()}`;
}

export default function WishlistPage() {
  const router = useRouter();
  const { items, isHydrated, removeItem } = useWishlist();
  const isEmpty = isHydrated && items.length === 0;

  return (
    <section className="cart-section relative min-h-[calc(100vh-5rem)] overflow-hidden pb-24 pt-8 sm:pb-32 sm:pt-10 lg:pb-40">
      <div className="contact-section-glow pointer-events-none absolute inset-0" />
      <div
        className="contact-grid-3d pointer-events-none absolute inset-0 opacity-50"
        aria-hidden="true"
      />
      <div
        className="contact-orb contact-orb-2 pointer-events-none absolute opacity-60"
        aria-hidden="true"
      />

      <motion.div
        className="pointer-events-none absolute right-[8%] top-[22%] hidden opacity-50 lg:block"
        animate={{ y: [0, 14, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <FloatingMango size={64} />
      </motion.div>

      <div className="relative mx-auto max-w-4xl px-5 sm:px-8 lg:px-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-10 flex flex-wrap items-center gap-2 text-sm text-white/45"
        >
          <Link href="/" className="transition-colors hover:text-gold-300">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-white/25" aria-hidden="true" />
          <span className="text-gold-300/80">Wishlist</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1
            className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Wishlist
          </h1>
          {isHydrated && items.length > 0 && (
            <p className="mt-3 text-sm text-white/45">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          )}
          <div className="contact-divider mt-6" aria-hidden="true" />
        </motion.div>

        {!isHydrated ? (
          <p className="mt-12 text-center text-sm text-white/40">Loadingâ€¦</p>
        ) : isEmpty ? (
          <motion.div
            className="cart-empty-3d relative mt-12 text-center"
            initial={{ opacity: 0, y: 32, rotateX: 12 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            style={{ perspective: 1200, transformStyle: "preserve-3d" }}
          >
            <div className="cart-empty-shadow pointer-events-none absolute -bottom-6 left-[15%] right-[15%] h-12 rounded-[50%]" />

            <div className="cart-empty-panel relative overflow-hidden rounded-[1.75rem] px-6 py-14 sm:rounded-[2rem] sm:px-10 sm:py-16">
              <div
                className="contact-form-shine pointer-events-none absolute inset-0"
                aria-hidden="true"
              />

              <motion.div
                className="wishlist-heart-3d relative mx-auto flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <span
                  className="wishlist-heart-glow absolute inset-0 rounded-full"
                  aria-hidden="true"
                />
                <span
                  className="wishlist-heart-ring absolute inset-0 rounded-full"
                  aria-hidden="true"
                />
                <Heart
                  className="wishlist-heart-icon relative h-14 w-14 fill-mango-400/30 text-mango-400 sm:h-16 sm:w-16"
                  strokeWidth={1.25}
                />
              </motion.div>

              <p className="mt-8 flex items-center justify-center gap-2 text-sm text-white/55 sm:text-[15px]">
                <span className="about-bullet shrink-0" aria-hidden="true" />
                Your wishlist is currently empty.
              </p>

              <p className="mx-auto mt-3 max-w-sm text-xs text-white/40">
                Tap the heart on any product to save your favourite mangoes here.
              </p>

              <Link href="/products" className="cart-return-btn group mt-10 inline-flex">
                Browse Products
              </Link>
            </div>
          </motion.div>
        ) : (
          <ul className="mt-10 space-y-4">
            {items.map((item, index) => (
              <motion.li
                key={item.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="cart-line-item flex flex-col gap-4 sm:flex-row sm:items-center"
              >
                <Link
                  href={`/products/${item.slug}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28"
                >
                  <AppImage
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-400/65">
                    {item.category}
                  </p>
                  <Link href={`/products/${item.slug}`}>
                    <h2
                      className="mt-1 text-lg font-semibold text-white transition-colors hover:text-gold-200"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {item.name}
                    </h2>
                  </Link>
                  <p className="mt-2 text-base font-semibold text-gold-300">
                    {formatPrice(item.price)}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-3 sm:flex-col sm:items-stretch">
                  <button
                    type="button"
                    className="select-options-btn"
                    onClick={() => router.push(`/products/${item.slug}`)}
                  >
                    Select Options
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.slug)}
                    className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-xs font-medium text-white/50 transition-colors hover:border-white/20 hover:text-white/75"
                    aria-label={`Remove ${item.name} from wishlist`}
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Remove
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
