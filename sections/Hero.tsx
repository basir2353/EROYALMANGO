"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowRight, Clock, Leaf, MapPin } from "lucide-react";
import HeroCarousel from "@/components/hero/HeroCarousel";
import type { CmsHero } from "@/lib/api";

const defaultHero: CmsHero = {
  eyebrow: "Best Quality Products",
  title: "Bringing Multan's Finest",
  titleHighlight: "Mangoes",
  subtitle: "Fresh to Your Table",
  description: "Premium export-quality mangoes delivered directly from orchards.",
  buttonText: "Shop All Products",
  buttonLink: "/products",
  inlineStats: [
    { value: "100%", label: "Export Quality" },
    { value: "Multan", label: "Direct Origin" },
    { value: "24h", label: "Fresh Harvest" },
  ],
  isVisible: true,
};

const statIcons = [Leaf, MapPin, Clock] as const;

export default function Hero({ data }: { data?: CmsHero | null }) {
  const hero = { ...defaultHero, ...data };
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stats = statsRef.current;
    if (!stats) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".hero-stat-card-3d", {
        y: 24,
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.3,
      });
    }, stats);

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" className="hero-section relative -mt-20 overflow-hidden pt-20">
      <HeroCarousel />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-300/90 sm:text-xs">
            {hero.eyebrow}
          </p>

          <h1
            className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {hero.title}{" "}
            <span className="luxury-gradient-text italic">{hero.titleHighlight}</span>
            {hero.subtitle ? ` ${hero.subtitle}` : ""}
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
            {hero.description}
          </p>

          <div className="mt-8">
            <Link href={hero.buttonLink} className="hero-cta group inline-flex">
              <span>{hero.buttonText}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div ref={statsRef} className="hero-trust-3d mx-auto mt-10 sm:mt-12">
          <div className="hero-trust-grid">
            {(hero.inlineStats ?? defaultHero.inlineStats!).map((stat, index) => {
              const Icon = statIcons[index] ?? Leaf;
              return (
                <div
                  key={stat.label}
                  className="hero-stat-card-3d"
                  style={{ animationDelay: `${index * 0.12}s` }}
                >
                  <span className="hero-stat-card-shadow" aria-hidden="true" />
                  <div className="hero-stat-card-inner">
                    <div className={`hero-stat-icon-3d hero-stat-icon-3d-${index + 1}`}>
                      <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                    </div>
                    <p
                      className="hero-stat-card-value"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {stat.value}
                    </p>
                    <p className="hero-stat-card-label">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
