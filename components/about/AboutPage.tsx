"use client";

import AppImage from "@/components/AppImage";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Award,
  ChevronRight,
  Globe,
  Lock,
  Tag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AboutPageContent } from "@/services/content";

const SERVICE_ICONS: LucideIcon[] = [Globe, Award, Tag, Lock];

const services: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Worldwide Shipping",
    description:
      "We deliver premium Pakistani mangoes across the globe with export-grade packaging and royal care.",
    icon: Globe,
  },
  {
    title: "Best Quality",
    description:
      "Every mango is hand-selected from trusted orchards — Chaunsa, Sindhri, Anwar Ratol, and more.",
    icon: Award,
  },
  {
    title: "Best Offers",
    description:
      "Enjoy seasonal discounts, gift bundles, and exclusive coupons for our loyal customers.",
    icon: Tag,
  },
  {
    title: "Secure Payments",
    description:
      "Your payment is safe and secured with encrypted checkout and trusted payment gateways.",
    icon: Lock,
  },
];

const planningPoints = [
  {
    title: "Your Payment Is Safe And Secured",
    description:
      "We use SSL encryption and secure payment processing so your personal and financial information stays protected at every step.",
  },
  {
    title: "We Offer Discounts And Coupons",
    description:
      "From seasonal sales to gift hamper deals, we reward mango lovers with special offers throughout the harvest season.",
  },
];

export default function AboutPage({ content }: { content?: AboutPageContent | null }) {
  const storyParagraphs = content?.storyParagraphs ?? [
    "E Royal Mango brings the finest harvest from Pakistan's legendary orchards to your doorstep. From the honey-sweet Chaunsa of Multan to the golden Sindhri of Sindh, we curate only the most premium varieties for export and gifting.",
    "Our mission is simple: deliver orchard-fresh mangoes with royal care, transparent sourcing, and packaging that meets international export standards.",
    "We partner with trusted growers, follow eco-friendly practices, and hand-select each mango so you receive nothing less than excellence.",
  ];
  const heroImage = content?.heroImage ?? "/images/chaunsa-premium-variety.png";
  const storyTitle =
    content?.storyTitle ?? "Pakistan's Glory: The King of Fruits";
  const pageServices =
    content?.services?.map((service, index) => ({
      ...service,
      icon: SERVICE_ICONS[index % SERVICE_ICONS.length],
    })) ?? services;
  const pagePlanning =
    content?.exportProcess && content?.packagingProcess
      ? [
          {
            title: content.exportProcess.title,
            description: content.exportProcess.points.join(" • "),
          },
          {
            title: content.packagingProcess.title,
            description: content.packagingProcess.points.join(" • "),
          },
        ]
      : planningPoints;

  return (
    <>
      <section className="shop-section relative overflow-hidden pb-16 pt-8 sm:pb-20 sm:pt-10">
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
            <span className="text-gold-300/80">About</span>
          </nav>

          <motion.div
            className="about-hero-panel mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-400/80">
              About Us
            </p>
            <h1
              className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              About{" "}
              <span className="luxury-gradient-text italic">Us</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/55 sm:text-[15px]">
              {storyParagraphs[0]}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pakistan's Glory */}
      <section className="about-section relative overflow-hidden py-16 sm:py-24 lg:py-28">
        <div className="about-section-glow pointer-events-none absolute inset-0" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12 xl:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2
              className="text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {storyTitle.split(":")[0]}
              {storyTitle.includes(":") ? ":" : ""}{" "}
              <span className="luxury-gradient-text italic">
                {storyTitle.includes(":") ? storyTitle.split(":")[1]?.trim() : storyTitle}
              </span>
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-relaxed text-white/55 sm:text-[15px]">
              {storyParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative mx-auto w-full max-w-md lg:max-w-none"
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="benefit-mango-glow absolute inset-0 scale-90 rounded-full" />
            <div className="benefit-mango-frame about-story-image-frame relative overflow-hidden rounded-[2rem] p-3 sm:p-4">
              <div className="benefit-mango-image-box benefit-mango-image-box-photo about-story-image relative aspect-[4/5] overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
                <AppImage
                  src={heroImage}
                  alt="Premium Chaunsa mangoes — Pakistan's king of fruits"
                  fill
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  quality={95}
                  className="object-cover object-center"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Planning & trust card */}
      <section className="about-section relative overflow-hidden py-16 sm:py-24 lg:py-28">
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12 xl:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2
              className="text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              We work through every aspect at the{" "}
              <span className="luxury-gradient-text italic">planning</span>
            </h2>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-gold-400/70">
              We do it for you with love
            </p>
          </motion.div>

          <motion.div
            className="about-feature-card"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="space-y-8">
              {pagePlanning.map((point) => (
                <li key={point.title} className="flex gap-4">
                  <span className="about-bullet mt-1.5 shrink-0" aria-hidden="true" />
                  <div>
                    <h3
                      className="text-lg font-semibold text-gold-300 sm:text-xl"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {point.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55 sm:text-[15px]">
                      {point.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Services grid */}
      <section className="about-services relative overflow-hidden py-16 sm:py-24 lg:py-28">
        <div className="about-services-glow pointer-events-none absolute inset-0" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {pageServices.map((service, index) => {
              const Icon = service.icon;

              return (
                <motion.article
                  key={service.title}
                  className="about-service-card text-center"
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.65,
                    delay: index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="about-service-icon mx-auto flex h-14 w-14 items-center justify-center rounded-2xl">
                    <Icon className="h-6 w-6 text-gold-300" strokeWidth={1.5} />
                  </div>
                  <h3
                    className="mt-5 text-xl font-semibold text-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/50">
                    {service.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
