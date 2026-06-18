"use client";

import { useEffect, useRef } from "react";
import AppImage from "@/components/AppImage";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import FloatingMango from "@/components/hero/FloatingMango";
import type { CmsPromo } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

const defaultPromo: CmsPromo = {
  title: "Pakistan's Glory: The King of Fruits",
  subtitle: "Export Quality Mangoes",
  buttonText: "Shop Now",
  buttonLink: "/products",
  backgroundImage: "/images/dasheri-mango.png",
  isVisible: true,
};

export default function PromoBanner({ data }: { data?: CmsPromo | null }) {
  const promo = { ...defaultPromo, ...data };
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const mango1Ref = useRef<HTMLDivElement>(null);
  const mango2Ref = useRef<HTMLDivElement>(null);
  const mango3Ref = useRef<HTMLDivElement>(null);
  const mango4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let onMouseMove: ((e: MouseEvent) => void) | null = null;

    const ctx = gsap.context(() => {
      const entryTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power3.out" },
      });

      entryTl
        .from(eyebrowRef.current, { y: 28, opacity: 0, duration: 0.8 })
        .from(
          headingRef.current,
          { y: 40, opacity: 0, duration: 1 },
          "-=0.5",
        )
        .from(ctaRef.current, { y: 24, opacity: 0, duration: 0.7 }, "-=0.55")
        .from(
          [
            mango1Ref.current,
            mango2Ref.current,
            mango3Ref.current,
            mango4Ref.current,
          ],
          {
            scale: 0.5,
            opacity: 0,
            duration: 1,
            stagger: 0.12,
            ease: "back.out(1.5)",
          },
          "-=0.6",
        );

      if (!prefersReducedMotion) {
        gsap.to(mango1Ref.current, {
          y: "-=16",
          rotation: 6,
          duration: 4.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(mango2Ref.current, {
          y: "-=22",
          rotation: -5,
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.5,
        });

        gsap.to(mango3Ref.current, {
          y: "-=12",
          rotation: 4,
          duration: 3.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1,
        });

        ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.set(bgRef.current, { y: p * 120 - 60 });
            gsap.set(overlayRef.current, { opacity: 0.85 + p * 0.05 });
            gsap.set(contentRef.current, { y: p * -40 });
            gsap.set(mango1Ref.current, { y: p * -80 });
            gsap.set(mango2Ref.current, { y: p * -120 });
            gsap.set(mango3Ref.current, { y: p * -60 });
            gsap.set(mango4Ref.current, { y: p * -50 });
          },
        });

        onMouseMove = (e: MouseEvent) => {
          const rect = section.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;

          gsap.to(bgRef.current, {
            x: x * 30,
            duration: 1.2,
            ease: "power2.out",
          });
          gsap.to(mango1Ref.current, {
            x: x * 50,
            y: y * 25,
            duration: 1,
          });
          gsap.to(mango2Ref.current, {
            x: x * 70,
            y: y * 35,
            duration: 1.1,
          });
          gsap.to(mango3Ref.current, {
            x: x * 40,
            y: y * 20,
            duration: 0.9,
          });
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
      className="promo-banner relative w-full overflow-hidden"
      aria-label="Export quality mangoes promotion"
    >
      {/* Parallax Background */}
      <div
        ref={bgRef}
        className="promo-banner-bg absolute inset-0 will-change-transform"
      >
        <AppImage
          src={promo.backgroundImage ?? "/images/dasheri-mango.png"}
          alt={promo.subtitle}
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority={false}
        />
      </div>

      {/* Premium Overlay */}
      <div
        ref={overlayRef}
        className="promo-banner-overlay absolute inset-0"
        aria-hidden="true"
      />

      {/* Floating Mangoes */}
      <FloatingMango
        ref={mango1Ref}
        size={110}
        className="absolute left-[6%] top-[20%] z-[2] hidden opacity-90 sm:block lg:left-[10%]"
      />
      <FloatingMango
        ref={mango2Ref}
        size={160}
        className="absolute -right-[4%] bottom-[15%] z-[2] hidden opacity-95 md:block lg:right-[6%] lg:bottom-[20%]"
      />
      <FloatingMango
        ref={mango3Ref}
        size={75}
        className="absolute right-[8%] top-[18%] z-[2] hidden opacity-85 lg:block"
      />
      <FloatingMango
        ref={mango4Ref}
        size={65}
        className="absolute right-[5%] bottom-[25%] z-[2] opacity-90 sm:hidden"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[min(85vh,720px)] max-w-7xl items-center px-5 py-24 sm:min-h-[min(78vh,680px)] sm:px-8 sm:py-32 lg:px-12">
        <div ref={contentRef} className="max-w-3xl">
          <p
            ref={eyebrowRef}
            className="mb-5 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-300/90 sm:text-xs"
          >
            <span className="promo-banner-accent h-px w-10 sm:w-14" />
            {promo.subtitle}
          </p>

          <h2
            ref={headingRef}
            className="text-[2rem] font-semibold leading-[1.12] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4rem] lg:leading-[1.08]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {promo.title}
          </h2>

          <div ref={ctaRef} className="mt-10 sm:mt-12">
            <Link href={promo.buttonLink} className="promo-glass-btn group inline-flex">
              <span>{promo.buttonText}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
