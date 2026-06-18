"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import BrandLogo from "@/components/BrandLogo";
import { useCart } from "@/store/CartContext";
import { useWishlist } from "@/store/WishlistContext";
import {
  Heart,
  Menu,
  ShoppingBag,
  X,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "All Products" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

function Logo() {
  return <BrandLogo />;
}

function NavLink({
  href,
  label,
  isActive,
  onClick,
}: {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group relative px-1 py-2"
    >
      <span
        className={`relative z-10 text-[13px] font-medium tracking-wide transition-colors duration-300 ${
          isActive
            ? "text-gold-300"
            : "text-white/70 group-hover:text-white"
        }`}
      >
        {label}
      </span>

      {isActive && (
        <motion.span
          layoutId="activeNavIndicator"
          className="absolute -bottom-0.5 left-0 right-0 mx-auto h-[2px] w-full max-w-[24px] rounded-full nav-link-underline"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}

      <span className="absolute inset-x-0 -bottom-0.5 mx-auto h-[2px] w-0 max-w-[24px] rounded-full nav-link-underline opacity-0 transition-all duration-300 group-hover:w-full group-hover:opacity-40" />
    </Link>
  );
}

function IconButton({
  children,
  label,
  badge,
  href,
}: {
  children: React.ReactNode;
  label: string;
  badge?: number;
  href?: string;
}) {
  const className =
    "relative flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/5 hover:text-gold-300";

  const content = (
    <>
      {children}
      {badge !== undefined && badge > 0 ? (
        <span className="nav-cart-badge absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-br from-mango-400 to-gold-500 px-1 text-[10px] font-semibold text-royal-950">
          {badge > 99 ? "99+" : badge}
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
        <Link href={href} aria-label={label} className={className}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type="button"
      aria-label={label}
      className={className}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
    >
      {content}
    </motion.button>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const { itemCount, subtotal, isHydrated } = useCart();
  const { itemCount: wishlistCount, isHydrated: wishlistHydrated } =
    useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartTotal = isHydrated ? subtotal : 0;
  const cartBadge = isHydrated ? itemCount : 0;
  const wishlistBadge = wishlistHydrated ? wishlistCount : 0;

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 40);
  });

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 h-16 overflow-hidden glass-nav transition-colors duration-500 ${
          isScrolled ? "glass-nav-scrolled" : ""
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left — Logo */}
          <div className="flex shrink-0 items-center">
            <Logo />
          </div>

          {/* Center — Desktop Navigation */}
          <div className="hidden flex-1 items-center justify-center lg:flex">
            <ul className="flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <NavLink
                    href={link.href}
                    label={link.label}
                    isActive={isActive(link.href)}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Right — Actions */}
          <div className="flex min-w-[140px] items-center justify-end gap-1 sm:gap-2">
            <IconButton href="/wishlist" label="Wishlist" badge={wishlistBadge}>
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </IconButton>

            <IconButton href="/cart" label="Cart" badge={cartBadge}>
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </IconButton>

            <motion.span
              className="nav-cart-total hidden rounded-full bg-gradient-to-r from-gold-500/10 to-mango-400/10 px-3 py-1.5 text-[13px] font-semibold text-gold-300 ring-1 ring-gold-400/20 sm:inline-block"
              animate={{ scale: isScrolled ? 0.95 : 1 }}
              transition={{ duration: 0.3 }}
            >
              ₨{cartTotal.toLocaleString()}
            </motion.span>

            {/* Mobile Hamburger */}
            <motion.button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/5 hover:text-gold-300 lg:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
              whileTap={{ scale: 0.92 }}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="mobile-nav-backdrop fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              className="mobile-nav-panel fixed inset-x-4 top-16 z-50 overflow-hidden rounded-2xl border border-white/10 lg:hidden"
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
                <Logo />
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold-400/60">
                  Menu
                </p>
              </div>

              <ul className="px-3 py-3">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-medium transition-all duration-300 ${
                        isActive(link.href)
                          ? "bg-gradient-to-r from-gold-500/10 to-mango-400/5 text-gold-300"
                          : "text-white/75 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {link.label}
                      {isActive(link.href) && (
                        <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-gold-400 to-mango-400" />
                      )}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="border-t border-white/5 px-5 py-4">
                <div className="flex items-center justify-end">
                  <span className="nav-cart-total rounded-full bg-gradient-to-r from-gold-500/10 to-mango-400/10 px-3 py-1.5 text-sm font-semibold text-gold-300 ring-1 ring-gold-400/20">
                    ₨{cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-16 shrink-0" aria-hidden="true" />
    </>
  );
}
