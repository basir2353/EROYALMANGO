"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AppImage from "@/components/AppImage";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PRODUCTS_HREF = "/products";
const AUTO_PLAY_MS = 5500;

const slides = [
  {
    src: "/images/hero-carousel/slide-1-keep-calm.png",
    alt: "Keep Calm and Eat Aam — E Royal Mango",
    width: 1024,
    height: 320,
  },
  {
    src: "/images/hero-carousel/slide-2-mango-magic.png",
    alt: "Create Mango Magic — E Royal Mango",
    width: 1024,
    height: 320,
  },
  {
    src: "/images/hero-carousel/slide-3-royal-bliss.png?v=10",
    alt: "E Royal Mango — Royal Mango Bliss",
    width: 1024,
    height: 320,
  },
  {
    src: "/images/hero-carousel/slide-4-exquisite-variety.png?v=3",
    alt: "Explore our Exquisite Mango Variety — E Royal Mango",
    width: 1024,
    height: 319,
  },
] as const;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((nextIndex: number) => {
    setIndex((nextIndex + slides.length) % slides.length);
  }, []);

  const next = useCallback(() => {
    setIndex((current) => (current + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setIndex((current) => (current - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, AUTO_PLAY_MS);
    return () => clearInterval(timer);
  }, [paused]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    (e.currentTarget as HTMLElement).dataset.touchX = String(touch.clientX);
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const startX = Number((e.currentTarget as HTMLElement).dataset.touchX);
      const endX = e.changedTouches[0]?.clientX;
      if (!startX || endX === undefined) return;
      const delta = endX - startX;
      if (Math.abs(delta) < 40) return;
      if (delta > 0) prev();
      else next();
    },
    [next, prev],
  );

  const slide = slides[index];

  return (
    <div
      className="hero-carousel w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="E Royal Mango promotional banners"
    >
      <div
        className="hero-carousel-stage relative w-full overflow-hidden bg-[#1a1a1a]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.src}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <Link
              href={PRODUCTS_HREF}
              className="hero-carousel-slide block h-full w-full cursor-pointer"
              aria-label={`${slide.alt}. View all products.`}
            >
              <AppImage
                src={slide.src}
                alt={slide.alt}
                width={slide.width}
                height={slide.height}
                priority={index === 0}
                unoptimized
                sizes="100vw"
                className="h-full w-full object-contain object-center"
              />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 bg-[#142414] px-4 py-3 sm:gap-4">
        <button
          type="button"
          onClick={prev}
          className="hero-carousel-nav flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.25} />
        </button>

        <div
          className="flex items-center gap-2"
          role="tablist"
          aria-label="Carousel slides"
        >
          {slides.map((item, dotIndex) => (
            <button
              key={item.src}
              type="button"
              role="tab"
              aria-selected={dotIndex === index}
              aria-label={`Go to slide ${dotIndex + 1}`}
              onClick={() => goTo(dotIndex)}
              className={`hero-carousel-dot h-2 rounded-full transition-all duration-300 ${
                dotIndex === index
                  ? "w-6 bg-[#ffcc00]"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          className="hero-carousel-nav flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}
