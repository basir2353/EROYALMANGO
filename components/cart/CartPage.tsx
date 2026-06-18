"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/store/CartContext";
import { formatShopPrice } from "@/services/shop-products";
import FloatingMango from "@/components/hero/FloatingMango";
import { CartItemImage } from "@/components/cart/CartItemImage";

export default function CartPage() {
  const { items, subtotal, itemCount, updateQuantity, removeItem, clearCart, isHydrated } =
    useCart();

  const isEmpty = isHydrated && items.length === 0;

  return (
    <section className="cart-section relative min-h-[calc(100vh-5rem)] overflow-hidden pb-24 pt-8 sm:pb-32 sm:pt-10 lg:pb-40">
      <div className="contact-section-glow pointer-events-none absolute inset-0" />
      <div className="contact-grid-3d pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />

      <motion.div
        className="pointer-events-none absolute left-[6%] top-[20%] hidden opacity-50 lg:block"
        animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <FloatingMango size={72} />
      </motion.div>

      <div className="cart-content-3d relative mx-auto max-w-4xl px-5 sm:px-8 lg:px-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-10 flex flex-wrap items-center gap-2 text-sm text-white/45"
        >
          <Link href="/" className="transition-colors hover:text-gold-300">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-white/25" aria-hidden="true" />
          <span className="text-gold-300/80">Cart</span>
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
            Cart
            {itemCount > 0 && (
              <span className="ml-3 text-lg font-normal text-white/40 sm:text-xl">
                ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
            )}
          </h1>
          <div className="contact-divider mt-6" aria-hidden="true" />
        </motion.div>

        {!isHydrated ? (
          <p className="mt-12 text-center text-sm text-white/40">Loading cart...</p>
        ) : isEmpty ? (
          <motion.div
            className="cart-empty-3d relative mt-12 text-center"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="cart-empty-shadow pointer-events-none absolute -bottom-6 left-[15%] right-[15%] h-12 rounded-[50%]" />
            <div className="cart-empty-panel relative overflow-hidden rounded-[1.75rem] px-6 py-14 sm:rounded-[2rem] sm:px-10 sm:py-16">
              <motion.div
                className="cart-icon-3d relative mx-auto flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="cart-icon-ring absolute inset-0 rounded-full" aria-hidden="true" />
                <ShoppingBag
                  className="relative h-12 w-12 text-gold-300 sm:h-14 sm:w-14"
                  strokeWidth={1.25}
                />
              </motion.div>
              <p className="mt-8 text-sm text-white/55 sm:text-[15px]">
                Your cart is currently empty.
              </p>
              <Link href="/products" className="cart-return-btn group mt-10 inline-flex">
                Return to Shop
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="cart-filled-3d mt-10 space-y-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-white/50">
                Review your mangoes before checkout
              </p>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Remove all items from your cart?")) clearCart();
                }}
                className="cart-clear-all-btn flex items-center gap-1.5"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                Remove all
              </button>
            </div>

            <div className="cart-items-panel rounded-[1.75rem] p-4 sm:rounded-[2rem] sm:p-6">
              <ul className="space-y-4">
                {items.map((item, index) => (
                  <motion.li
                    key={item.lineId}
                    className="cart-line-item"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                  >
                    <CartItemImage src={item.image} alt={item.alt} />

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${item.slug}`}
                        className="cart-item-title text-lg font-semibold text-white transition-colors hover:text-gold-300 sm:text-xl"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {item.name}
                      </Link>
                      {item.weight && (
                        <p className="mt-1 text-sm font-medium text-gold-400/80">
                          {item.weight}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-white/45">
                        {formatShopPrice(item.unitPrice)} each
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-4">
                        <div className="product-detail-qty flex items-center rounded-full">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                            className="product-detail-qty-btn"
                          >
                            <Minus className="h-4 w-4" strokeWidth={1.75} />
                          </button>
                          <span className="product-detail-qty-value min-w-[2.5rem] text-center text-sm font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                            className="product-detail-qty-btn"
                          >
                            <Plus className="h-4 w-4" strokeWidth={1.75} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.lineId)}
                          className="cart-clear-all-btn flex items-center gap-1.5"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                          Remove
                        </button>
                      </div>
                    </div>

                    <p className="cart-item-line-total shrink-0 text-lg font-semibold text-gold-300 sm:text-xl">
                      {formatShopPrice(item.unitPrice * item.quantity)}
                    </p>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="cart-summary">
              <div className="flex items-center justify-between border-b border-white/8 pb-4">
                <span className="text-sm uppercase tracking-[0.2em] text-white/45">
                  Subtotal
                </span>
                <span className="cart-summary-total text-2xl font-semibold text-gold-300">
                  {formatShopPrice(subtotal)}
                </span>
              </div>
              <p className="mt-3 text-sm text-white/40">Shipping calculated at checkout.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/products" className="product-card-cta flex-1 text-center">
                  Continue Shopping
                </Link>
                <Link
                  href="/checkout"
                  className="cart-return-btn flex-1 justify-center text-center"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
