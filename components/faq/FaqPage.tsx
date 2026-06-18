"use client";

import { useRef, useState } from "react";
import AppImage from "@/components/AppImage";
import Link from "next/link";
import { AnimatePresence, motion, useSpring } from "framer-motion";
import { ChevronDown, ChevronRight, Phone } from "lucide-react";
import FloatingMango from "@/components/hero/FloatingMango";
import type { FaqCategory, FaqItem } from "@/services/faq-data";

function FaqImage3D({
  image,
  alt,
  reverse = false,
}: {
  image: string;
  alt: string;
  reverse?: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, { stiffness: 260, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 260, damping: 30 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const dir = reverse ? -1 : 1;
    rotateY.set(x * 8 * dir);
    rotateX.set(-y * 8);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div className="faq-image-wrap relative" style={{ perspective: 1200 }}>
      <motion.div
        ref={frameRef}
        className="faq-image-3d relative overflow-hidden rounded-[1.5rem] sm:rounded-[1.75rem]"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 28 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative aspect-[4/3] sm:aspect-[5/4]">
          <AppImage
            src={image}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            quality={95}
            className="object-cover object-center"
          />
        </div>
      </motion.div>
    </div>
  );
}

function FaqAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`faq-accordion-item ${isOpen ? "faq-accordion-item-open" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        className="faq-accordion-trigger flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
        aria-expanded={isOpen}
      >
        <span
          className="text-base font-semibold text-white sm:text-lg"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {item.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="faq-accordion-chevron shrink-0"
        >
          <ChevronDown className="h-5 w-5 text-gold-300" strokeWidth={1.75} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="faq-accordion-panel px-5 pb-5 sm:px-6 sm:pb-6">
              <p className="text-sm leading-relaxed text-white/55 sm:text-[15px]">
                {item.answer}
              </p>
              {item.bullets && (
                <ul className="mt-4 space-y-2">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-sm text-white/55">
                      <span className="about-bullet mt-2 shrink-0" aria-hidden="true" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FaqCategorySection({
  category,
  index,
}: {
  category: FaqCategory;
  index: number;
}) {
  const [openId, setOpenId] = useState<string | null>(
    category.defaultOpenId ?? category.items[0]?.id ?? null,
  );
  const reverse = index % 2 === 1;

  return (
    <motion.section
      className="faq-category-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2
        className="mb-6 text-2xl font-semibold text-white sm:text-3xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <span className="luxury-gradient-text italic">{category.title}</span>
      </h2>

      <div
        className={`grid items-start gap-8 lg:grid-cols-2 lg:gap-12 ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div className="faq-accordion-stack space-y-3">
          {category.items.map((item) => (
            <FaqAccordionItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() =>
                setOpenId((prev) => (prev === item.id ? null : item.id))
              }
            />
          ))}
        </div>

        <FaqImage3D image={category.image} alt={category.alt} reverse={reverse} />
      </div>
    </motion.section>
  );
}

export default function FaqPage({
  intro,
  categories,
  emergencyPhone = "+92 307 3970850",
  emergencyPhoneHref = "tel:+923073970850",
}: {
  intro: string;
  categories: FaqCategory[];
  emergencyPhone?: string;
  emergencyPhoneHref?: string;
}) {
  return (
    <>
      {/* Hero */}
      <section className="faq-hero relative overflow-hidden">
        <div className="faq-hero-image absolute inset-0">
          <AppImage
            src="/images/dasheri-mango.png"
            alt="Premium mangoes — FAQ Help Center"
            fill
            priority
            sizes="100vw"
            quality={95}
            className="object-cover object-center"
          />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-5 py-20 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-28 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-300/90">
              Help Center
            </p>
            <h1
              className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              FAQ Help Center
            </h1>
          </motion.div>

          <motion.a
            href={emergencyPhoneHref}
            className="faq-emergency-card group inline-flex items-center gap-4 self-start sm:self-center"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
          >
            <span className="faq-emergency-icon flex h-14 w-14 items-center justify-center rounded-full">
              <Phone className="faq-emergency-icon-phone h-6 w-6" strokeWidth={1.75} />
            </span>
            <span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70">
                Emergency Call — 24/7
              </span>
              <span className="mt-1 block text-xl font-semibold text-gold-300 transition-colors group-hover:text-gold-200 sm:text-2xl">
                {emergencyPhone}
              </span>
            </span>
          </motion.a>
        </div>
      </section>

      {/* FAQ body */}
      <section className="contact-section relative overflow-hidden pb-16 pt-12 sm:pb-24 sm:pt-16 lg:pb-28">
        <div className="contact-section-glow pointer-events-none absolute inset-0" />
        <div className="contact-grid-3d pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />

        <motion.div
          className="pointer-events-none absolute right-[8%] top-[12%] hidden opacity-40 lg:block"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <FloatingMango size={80} />
        </motion.div>

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <nav
            aria-label="Breadcrumb"
            className="mb-10 flex flex-wrap items-center gap-2 text-sm text-white/45"
          >
            <Link href="/" className="transition-colors hover:text-gold-300">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-white/25" aria-hidden="true" />
            <span className="text-gold-300/80">FAQ</span>
          </nav>

          <motion.div
            className="about-hero-panel mb-14 max-w-3xl sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <h2
              className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Frequently Asked{" "}
              <span className="luxury-gradient-text italic">Questions</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/55 sm:text-[15px]">
              {intro}
            </p>
          </motion.div>

          <div className="space-y-16 sm:space-y-20 lg:space-y-24">
            {categories.map((category, index) => (
              <FaqCategorySection
                key={category.id}
                category={category}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Service CTA */}
      <section className="faq-cta relative overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="faq-cta-image relative min-h-[280px] lg:min-h-[360px]">
            <AppImage
              src="/images/chaunsa-premium-variety.png"
              alt="Fresh Chaunsa mangoes"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={95}
              className="object-cover object-center"
            />
            <div className="faq-cta-image-overlay absolute inset-0" />
          </div>

          <motion.div
            className="faq-cta-panel relative flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20"
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="faq-cta-panel-depth pointer-events-none absolute inset-0" aria-hidden="true" />
            <h2
              className="relative text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Quick Service On Emergency Call — 24/7
            </h2>
            <p className="relative mt-4 max-w-md text-sm leading-relaxed text-white/75 sm:text-[15px]">
              Need urgent help with your order, delivery, or refund? Our mango
              specialists are one call away.
            </p>
            <a
              href={emergencyPhoneHref}
              className="faq-cta-phone relative mt-8 inline-flex items-center gap-3 text-xl font-semibold text-gold-200 transition-colors hover:text-white sm:text-2xl"
            >
              <span className="faq-cta-phone-icon flex h-12 w-12 items-center justify-center rounded-full">
                <Phone className="h-5 w-5" strokeWidth={1.75} />
              </span>
              {emergencyPhone}
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
