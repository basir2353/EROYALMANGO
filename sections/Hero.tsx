"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Clock, Leaf, MapPin } from "lucide-react";
import FloatingMango from "@/components/hero/FloatingMango";
import ParticleField from "@/components/hero/ParticleField";
import type { CmsHero } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

const defaultHero: CmsHero = {
  eyebrow: "Best Quality Products",
  title: "Bringing Multan's Finest",
  titleHighlight: "Mangoes",
  subtitle: "Fresh to Your Table",
  description: "Premium export-quality mangoes delivered directly from orchards.",
  buttonText: "Get Started",
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
  const sectionRef = useRef<HTMLElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const hillsRef = useRef<HTMLDivElement>(null);
  const orchardRef = useRef<HTMLDivElement>(null);
  const mistRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const mango1Ref = useRef<HTMLDivElement>(null);
  const mango2Ref = useRef<HTMLDivElement>(null);
  const mango3Ref = useRef<HTMLDivElement>(null);
  const mango4Ref = useRef<HTMLDivElement>(null);
  const mobileMango1Ref = useRef<HTMLDivElement>(null);
  const mobileMango2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const mangoNodes = [
      mango1Ref.current,
      mango2Ref.current,
      mango3Ref.current,
      mango4Ref.current,
      mobileMango1Ref.current,
      mobileMango2Ref.current,
    ].filter(Boolean);

    let onMouseMove: ((e: MouseEvent) => void) | null = null;

    const ctx = gsap.context(() => {
      const entryTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      entryTl
        .from(skyRef.current, { opacity: 0, duration: 1.2 })
        .from(
          sunRef.current,
          { scale: 0.6, opacity: 0, duration: 1.4, ease: "power2.out" },
          "-=0.8",
        )
        .from(
          [hillsRef.current, orchardRef.current],
          { y: 60, opacity: 0, duration: 1.2, stagger: 0.15 },
          "-=0.9",
        )
        .from(mistRef.current, { opacity: 0, duration: 1 }, "-=0.6")
        .from(
          eyebrowRef.current,
          { y: 24, opacity: 0, duration: 0.8 },
          "-=0.4",
        )
        .from(headingRef.current, { y: 36, opacity: 0, duration: 1 }, "-=0.5")
        .from(descRef.current, { y: 24, opacity: 0, duration: 0.8 }, "-=0.6")
        .from(ctaRef.current, { y: 20, opacity: 0, duration: 0.7 }, "-=0.5")
        .from(
          ".hero-stat-card-3d",
          {
            y: 28,
            opacity: 0,
            duration: 0.85,
            stagger: 0.12,
            ease: "back.out(1.2)",
          },
          "-=0.45",
        )
        .from(
          mangoNodes,
          {
            scale: 0.4,
            opacity: 0,
            duration: 1.2,
            stagger: 0.12,
            ease: "back.out(1.4)",
          },
          "-=0.8",
        );

      if (!prefersReducedMotion) {
        gsap.to(mango1Ref.current, {
          y: "-=18",
          rotation: 8,
          duration: 4.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(mango2Ref.current, {
          y: "-=24",
          rotation: -6,
          duration: 5.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.6,
        });

        gsap.to(mango3Ref.current, {
          y: "-=14",
          rotation: 5,
          duration: 3.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.1,
        });

        gsap.to(mobileMango1Ref.current, {
          y: "-=16",
          rotation: 6,
          duration: 4.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(mobileMango2Ref.current, {
          y: "-=20",
          rotation: -5,
          duration: 4.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.5,
        });

        gsap.to(sunRef.current, {
          scale: 1.06,
          opacity: 0.92,
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(mistRef.current, {
          x: 30,
          opacity: 0.7,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(
          mangoNodes,
          {
            rotateY: "+=360",
            duration: 28,
            repeat: -1,
            ease: "none",
            stagger: { each: 3.5 },
          },
        );

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.set(skyRef.current, { y: p * 80 });
            gsap.set(sunRef.current, { y: p * 120, scale: 1 - p * 0.15 });
            gsap.set(hillsRef.current, { y: p * 140 });
            gsap.set(orchardRef.current, { y: p * 180 });
            gsap.set(mistRef.current, { y: p * 100, opacity: 1 - p * 0.5 });
            gsap.set(contentRef.current, {
              y: p * 60,
              opacity: 1 - p * 0.35,
            });
            gsap.set(mango1Ref.current, { y: p * -100 });
            gsap.set(mango2Ref.current, { y: p * -160 });
            gsap.set(mango3Ref.current, { y: p * -80 });
            gsap.set(mango4Ref.current, { y: p * -60 });
            gsap.set(mobileMango1Ref.current, { y: p * -90 });
            gsap.set(mobileMango2Ref.current, { y: p * -120 });
          },
        });

        onMouseMove = (e: MouseEvent) => {
          const rect = section.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;

          gsap.to(skyRef.current, { x: x * 20, y: y * 10, duration: 1.2 });
          gsap.to(sunRef.current, { x: x * 35, y: y * 20, duration: 1.4 });
          gsap.to(hillsRef.current, { x: x * -30, duration: 1.2 });
          gsap.to(orchardRef.current, { x: x * -50, duration: 1.3 });
          gsap.to(mistRef.current, { x: x * 25, duration: 1.5 });
          gsap.to(mango1Ref.current, { x: x * 60, y: y * 30, duration: 1.1 });
          gsap.to(mango2Ref.current, { x: x * 80, y: y * 40, duration: 1.2 });
          gsap.to(mango3Ref.current, { x: x * 45, y: y * 25, duration: 1 });
          gsap.to(mango4Ref.current, { x: x * 35, y: y * 20, duration: 1 });
        };

        section.addEventListener("mousemove", onMouseMove);
      }
    }, section);

    return () => {
      if (onMouseMove) {
        section.removeEventListener("mousemove", onMouseMove);
      }
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="hero-section relative -mt-20 min-h-screen overflow-hidden pt-20"
    >
      {/* Parallax Background Layers */}
      <div ref={skyRef} className="hero-sky absolute inset-0" aria-hidden="true">
        <div
          ref={sunRef}
          className="hero-sun absolute right-[2%] top-[6%] h-[min(36vw,140px)] w-[min(36vw,140px)] rounded-full sm:right-[8%] sm:top-[10%] sm:h-[min(40vw,220px)] sm:w-[min(40vw,220px)] md:right-[12%] md:top-[8%] md:h-[min(42vw,420px)] md:w-[min(42vw,420px)]"
        />
      </div>

      <div
        ref={hillsRef}
        className="hero-hills absolute inset-x-0 bottom-0 h-[55%]"
        aria-hidden="true"
      />

      <div
        ref={orchardRef}
        className="hero-landscape-3d absolute inset-x-0 bottom-0 h-[42%]"
        aria-hidden="true"
      >
        <div className="hero-hill-layer hero-hill-back" />
        <div className="hero-hill-layer hero-hill-mid" />
        <div className="hero-hill-layer hero-hill-front" />
      </div>

      <div
        ref={mistRef}
        className="hero-mist absolute inset-0"
        aria-hidden="true"
      />

      <ParticleField />

      {/* Mobile 3D mango showcase */}
      <div className="hero-mobile-visual pointer-events-none lg:hidden" aria-hidden="true">
        <div ref={mobileMango1Ref} className="hero-mango-wrap hero-mango-wrap--mobile-lead">
          <FloatingMango size={132} />
        </div>
        <div ref={mobileMango2Ref} className="hero-mango-wrap hero-mango-wrap--mobile-secondary">
          <FloatingMango size={92} />
        </div>
      </div>

      {/* Desktop floating 3D mangoes */}
      <div ref={mango1Ref} className="hero-mango-wrap hero-mango-wrap--desktop-1 hidden lg:block">
        <FloatingMango size={140} />
      </div>
      <div ref={mango2Ref} className="hero-mango-wrap hero-mango-wrap--desktop-2 hidden lg:block">
        <FloatingMango size={200} />
      </div>
      <div ref={mango3Ref} className="hero-mango-wrap hero-mango-wrap--desktop-3 hidden lg:block">
        <FloatingMango size={90} />
      </div>
      <div ref={mango4Ref} className="hero-mango-wrap hero-mango-wrap--desktop-4 hidden lg:block">
        <FloatingMango size={70} />
      </div>

      {/* Vignette & depth overlay */}
      <div className="hero-vignette pointer-events-none absolute inset-0 z-[5]" />

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-16 lg:px-12">
        <div
          ref={contentRef}
          className="flex w-full max-w-3xl min-h-[calc(100dvh-7rem)] flex-col justify-center pt-2 pb-12 max-lg:max-w-none max-lg:pr-[30%] sm:min-h-[calc(100dvh-9rem)] sm:pt-4 sm:pb-20 sm:max-lg:pr-[34%] lg:max-w-3xl lg:pr-0"
        >
          <p
            ref={eyebrowRef}
            className="mb-5 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-300/90 sm:text-xs"
          >
            <span className="h-px w-8 bg-gradient-to-r from-gold-400/80 to-transparent" />
            {hero.eyebrow}
          </p>

          <h1
            ref={headingRef}
            className="text-[1.85rem] font-semibold leading-[1.12] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.25rem] lg:leading-[1.08]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {hero.title}{" "}
            <span className="luxury-gradient-text italic">{hero.titleHighlight}</span>
            {hero.subtitle ? ` ${hero.subtitle}` : ""}
          </h1>

          <p
            ref={descRef}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/65 sm:mt-8 sm:text-lg md:text-xl"
          >
            {hero.description}
          </p>

          <div ref={ctaRef} className="mt-8 sm:mt-10">
            <Link href={hero.buttonLink} className="hero-cta group inline-flex">
              <span>{hero.buttonText}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="hero-trust-3d mt-10 sm:mt-12">
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
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
          Scroll
        </span>
        <div className="hero-scroll-line h-10 w-px" />
      </div>
    </section>
  );
}
