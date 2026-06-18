"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import FloatingMango from "@/components/hero/FloatingMango";
import type { CmsContactCta } from "@/lib/api";

const defaultCta: CmsContactCta = {
  title: "Have a Question?",
  description:
    "Our team is ready to assist with orders, delivery, and product recommendations. Get a response within 24 hours.",
  buttonText: "Contact Us",
  buttonLink: "/contact",
  isVisible: true,
};

function FloatingOrb({
  className,
  delay = 0,
  duration = 5,
}: {
  className?: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.span
      className={`cta-orb pointer-events-none absolute rounded-full ${className ?? ""}`}
      animate={{ y: [0, -14, 0], opacity: [0.35, 0.75, 0.35] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      aria-hidden="true"
    />
  );
}

export default function CallToAction({ data }: { data?: CmsContactCta | null }) {
  const cta = { ...defaultCta, ...data };

  return (
    <section
      id="contact"
      className="cta-section relative overflow-hidden py-24 sm:py-28 lg:py-32"
      aria-label="Contact call to action"
    >
      <div className="cta-section-bg absolute inset-0" aria-hidden="true" />
      <div className="cta-section-glow absolute inset-0" aria-hidden="true" />

      <FloatingOrb className="left-[10%] top-[20%] h-2 w-2" delay={0} />
      <FloatingOrb
        className="right-[15%] top-[30%] h-1.5 w-1.5"
        delay={1.5}
        duration={6}
      />
      <FloatingOrb
        className="bottom-[25%] left-[20%] h-1 w-1"
        delay={2.5}
        duration={4.5}
      />

      <motion.div
        className="pointer-events-none absolute left-[4%] top-[15%] z-[1] hidden opacity-80 sm:block"
        animate={{ y: [0, -18, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <FloatingMango size={80} />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute -right-[2%] bottom-[10%] z-[1] hidden opacity-90 md:block"
        animate={{ y: [0, -22, 0], rotate: [0, -5, 0] }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8,
        }}
      >
        <FloatingMango size={120} />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-4xl px-5 text-center sm:px-8">
        <motion.div
          className="cta-glass-panel mx-auto rounded-[2rem] px-6 py-12 sm:rounded-[2.5rem] sm:px-12 sm:py-14 lg:px-16 lg:py-16"
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="cta-icon-wrap mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl sm:mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <MessageCircle
              className="h-6 w-6 text-gold-300"
              strokeWidth={1.5}
            />
          </motion.div>

          <motion.p
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-400/75"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We&apos;re Here to Help
          </motion.p>

          <motion.h2
            className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            {cta.title}
          </motion.h2>

          <motion.p
            className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-white/50 sm:mt-6 sm:text-[15px]"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            {cta.description}
          </motion.p>

          <motion.div
            className="mt-9 sm:mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            <Link href={cta.buttonLink} className="cta-glow-btn group inline-flex">
              <span className="cta-glow-btn-inner inline-flex items-center gap-2.5">
                {cta.buttonText}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
