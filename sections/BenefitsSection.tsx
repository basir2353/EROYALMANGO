"use client";

import AppImage from "@/components/AppImage";
import { BENEFITS_HERO_IMAGE, resolveMediaUrl } from "@/lib/media";
import { motion } from "framer-motion";
import { Leaf, Shield, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CmsBenefits } from "@/lib/api";

type Benefit = {
  title: string;
  description: string;
  icon: LucideIcon;
  delay: number;
};

const ICON_MAP: Record<string, LucideIcon> = { Sparkles, Leaf, Shield };

function buildBenefits(data?: CmsBenefits | null): Benefit[] {
  if (data?.cards?.length) {
    return data.cards.map((card, i) => ({
      title: card.title,
      description: card.description,
      icon: ICON_MAP[card.icon ?? ""] ?? Sparkles,
      delay: 0.1 * (i + 1),
    }));
  }
  return [];
}

function FloatingIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <motion.div
      className="benefit-icon-wrap flex h-14 w-14 items-center justify-center rounded-2xl"
      animate={{ y: [0, -6, 0] }}
      transition={{
        duration: 3.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Icon className="h-6 w-6 text-gold-300" strokeWidth={1.5} />
    </motion.div>
  );
}

function BenefitCard({ benefit, index }: { benefit: Benefit; index: number }) {
  const Icon = benefit.icon;

  return (
    <motion.article
      className="benefit-glass-card group relative overflow-hidden rounded-3xl p-7 sm:p-8"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay: benefit.delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8 }}
    >
      <div className="benefit-card-shine pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex items-start gap-5">
        <FloatingIcon icon={Icon} />

        <div className="min-w-0 flex-1 pt-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-400/60">
            0{index + 1}
          </span>
          <h3
            className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-[1.65rem]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {benefit.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-white/55 sm:text-[15px]">
            {benefit.description}
          </p>
        </div>
      </div>

      <div className="benefit-card-accent absolute bottom-0 left-8 right-8 h-px" />
    </motion.article>
  );
}

export default function BenefitsSection({ data }: { data?: CmsBenefits | null }) {
  const benefits = buildBenefits(data);
  const heroImage = resolveMediaUrl(data?.heroImage ?? BENEFITS_HERO_IMAGE);
  const sectionTitle = data?.sectionTitle ?? "Nature's Finest, Crafted for Wellness";
  return (
    <section className="benefits-section relative overflow-hidden py-24 sm:py-32 lg:py-40">
      <div className="benefits-glow pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mb-16 max-w-xl sm:mb-20">
          <motion.p
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-400/80 sm:text-xs"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why Choose Us
          </motion.p>
          <motion.h2
            className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Nature&apos;s Finest,{" "}
            <span className="luxury-gradient-text italic">{sectionTitle.includes(",") ? sectionTitle.split(",").pop()?.trim() : "Crafted for Wellness"}</span>
          </motion.h2>
        </div>

        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20 xl:gap-24">
          {/* Left â€” Premium Chaunsa Mango */}
          <motion.div
            className="relative mx-auto w-full max-w-lg lg:max-w-none"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="benefit-mango-glow absolute inset-0 scale-90 rounded-full" />

            <div className="benefit-mango-frame relative overflow-hidden rounded-[2rem] p-3 sm:rounded-[2.5rem] sm:p-4">
              <div className="benefit-mango-image-box benefit-mango-image-box-photo relative aspect-[4/5] overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
                <AppImage
                  src={heroImage}
                  alt="Premium Chaunsa mango hand-picked fresh from Multan orchards"
                  fill
                  sizes="(max-width: 1024px) 90vw, (max-width: 1280px) 50vw, 640px"
                  quality={95}
                  className="benefit-mango-photo object-cover object-[center_35%] transition-transform duration-700 hover:scale-[1.03]"
                  priority
                />
              </div>

              <div className="absolute bottom-8 left-8 right-8 sm:bottom-10 sm:left-10 sm:right-10">
                <div className="benefit-mango-badge inline-flex flex-col gap-1 rounded-2xl px-5 py-4">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-300/80">
                    Premium Variety
                  </span>
                  <span
                    className="text-2xl font-semibold text-white sm:text-3xl"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Chaunsa Mango
                  </span>
                  <span className="text-sm text-white/50">
                    Multan&apos;s crown jewel of flavor
                  </span>
                </div>
              </div>
            </div>

            <motion.div
              className="benefit-mango-accent absolute -right-4 top-8 hidden h-24 w-24 rounded-full border border-gold-400/20 lg:block"
              animate={{ rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          {/* Right â€” Benefit Cards */}
          <div className="flex flex-col gap-5 sm:gap-6">
            {benefits.map((benefit, index) => (
              <BenefitCard key={benefit.title} benefit={benefit} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
