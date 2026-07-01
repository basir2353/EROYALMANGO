"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import BrandLogo from "@/components/BrandLogo";
import { useWebsiteSettings } from "@/store/SettingsContext";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "All Products" },
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const SOCIAL_ICON_MAP: Record<string, typeof Instagram> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
};

function FooterLogo() {
  return <BrandLogo variant="footer" />;
}

export default function Footer() {
  const settings = useWebsiteSettings();
  const phone = settings?.contactPhone ?? "+92 307 3970850";
  const email = settings?.contactEmail ?? "info@eroyalmango.com";
  const address = settings?.address ?? "Multan, Punjab, Pakistan";
  const aboutText =
    settings?.footerContent ??
    "E Royal Mango delivers Pakistan's finest export-quality mangoes — handpicked from Multan's legendary orchards with royal care, luxury presentation, and worldwide shipping.";
  const copyright =
    settings?.copyrightText ?? "Copyright © 2026 E Royal Mango. All rights reserved.";

  const socialLinks = Array.isArray(settings?.socialLinks)
    ? settings.socialLinks.map((link) => ({
        href: link.url,
        label: link.platform,
        icon: SOCIAL_ICON_MAP[link.platform.toLowerCase()] ?? Instagram,
      }))
    : settings?.socialLinks && typeof settings.socialLinks === "object"
      ? Object.entries(settings.socialLinks).map(([platform, url]) => ({
          href: String(url),
          label: platform,
          icon: SOCIAL_ICON_MAP[platform.toLowerCase()] ?? Instagram,
        }))
      : [
          { href: "https://instagram.com", label: "Instagram", icon: Instagram },
          { href: "https://facebook.com", label: "Facebook", icon: Facebook },
          { href: "https://youtube.com", label: "YouTube", icon: Youtube },
        ];

  const phoneDigits = phone.replace(/\D/g, "");

  return (
    <footer className="footer relative overflow-hidden">
      <div className="footer-bg pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="footer-top-glow pointer-events-none absolute inset-x-0 top-0 h-px" />

      <div className="footer-glass relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="grid gap-10 sm:gap-14 lg:grid-cols-12 lg:gap-10 xl:gap-12">
          {/* Logo + About */}
          <div className="flex flex-col items-center text-center lg:col-span-4 lg:items-start lg:text-left xl:col-span-5">
            <FooterLogo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/45 sm:mt-6 sm:text-[15px] lg:mx-0 mx-auto">
              {aboutText}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center text-center lg:col-span-2 lg:items-start lg:text-left">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="mt-5 flex flex-col items-center space-y-3 lg:items-start">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link group">
                    <span className="footer-link-dot" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex w-full flex-col items-start text-left lg:col-span-3">
            <h3 className="footer-heading w-full text-center lg:text-left">Contact Information</h3>
            <ul className="mt-5 w-full space-y-4">
              <li>
                <a
                  href={`tel:+${phoneDigits}`}
                  className="footer-contact-item group"
                >
                  <span className="footer-contact-icon">
                    <Phone className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-white/35">
                      Phone
                    </span>
                    <span className="mt-0.5 block text-sm text-white/75 transition-colors group-hover:text-gold-300">
                      {phone}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="footer-contact-item group"
                >
                  <span className="footer-contact-icon">
                    <Mail className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-white/35">
                      Email
                    </span>
                    <span className="mt-0.5 block break-all text-sm text-white/75 transition-colors group-hover:text-gold-300">
                      {email}
                    </span>
                  </span>
                </a>
              </li>
              <li className="footer-contact-item">
                <span className="footer-contact-icon">
                  <MapPin className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-white/35">
                    Origin
                  </span>
                  <span className="mt-0.5 block text-sm text-white/55">
                    {address}
                  </span>
                </span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="flex flex-col items-center text-center lg:col-span-3 lg:items-start lg:text-left xl:col-span-2">
            <h3 className="footer-heading">Follow Us</h3>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/40 lg:max-w-none">
              Join our community for seasonal harvests, exclusive offers, and
              mango inspiration.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="footer-social-btn"
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom relative border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 sm:flex-row sm:px-8 lg:px-12">
          <p className="text-center text-xs text-white/35 sm:text-left">
            {copyright}
          </p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold-400/40">
            Premium Export Quality Mangoes
          </p>
        </div>
      </div>
    </footer>
  );
}
