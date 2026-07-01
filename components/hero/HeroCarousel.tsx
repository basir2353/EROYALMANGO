"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  CAROUSEL_BANNER_ASPECT_RATIO,
  CAROUSEL_BANNER_HEIGHT,
  CAROUSEL_BANNER_WIDTH,
} from "@/lib/carousel-banner";
import { resolveMediaUrl } from "@/lib/media";
import { fetchPublicCmsFresh, type CarouselSlide } from "@/lib/api";

const AUTO_PLAY_MS = 5500;
export { CAROUSEL_BANNER_WIDTH, CAROUSEL_BANNER_HEIGHT };

const FALLBACK_SLIDES: CarouselSlide[] = [
  {
    id: "slide-1-keep-calm",
    image: "/images/hero-carousel/slide-1-keep-calm.png",
    alt: "Keep Calm and Eat Aam — E Royal Mango",
    link: "/products",
    sortOrder: 0,
    isActive: true,
  },
  {
    id: "slide-2-mango-magic",
    image: "/images/hero-carousel/slide-2-mango-magic.png",
    alt: "Create Mango Magic — E Royal Mango",
    link: "/products",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "slide-3-royal-bliss",
    image: "/images/hero-carousel/slide-3-royal-bliss.png",
    alt: "E Royal Mango — Royal Mango Bliss",
    link: "/products",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "slide-4-exquisite-variety",
    image: "/images/hero-carousel/slide-4-exquisite-variety.png",
    alt: "Explore our Exquisite Mango Variety — E Royal Mango",
    link: "/products",
    sortOrder: 3,
    isActive: true,
  },
];

type HeroCarouselProps = {
  slides?: CarouselSlide[] | null;
};

function normalizeSlides(raw?: CarouselSlide[] | null): CarouselSlide[] {
  if (raw === null || raw === undefined) return FALLBACK_SLIDES;

  const cmsSlides = raw
    .filter((slide) => slide.isActive !== false && slide.image?.trim())
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((slide, index) => ({
      ...slide,
      sortOrder: index,
      link: slide.link?.trim() || "/products",
    }));

  return cmsSlides;
}

function buildCarouselImageSources(url: string): { src: string; srcSet?: string; sizes: string } {
  const src = resolveMediaUrl(url);
  const sizes =
    "(max-width: 639px) 100vw, (max-width: 1023px) 100vw, min(100vw, 1920px)";

  try {
    const parsed = new URL(src, "http://localhost");
    if (parsed.hostname.includes("images.unsplash.com")) {
      const base = src.split("?")[0];
      const params = new URLSearchParams(parsed.search);
      params.set("auto", "format");
      params.set("q", "85");
      const mk = (w: number) => {
        params.set("w", String(w));
        params.set("h", String(Math.round(w / CAROUSEL_BANNER_ASPECT_RATIO)));
        params.set("fit", "crop");
        return `${base}?${params.toString()}`;
      };
      return {
        src: mk(1280),
        srcSet: `${mk(480)} 480w, ${mk(768)} 768w, ${mk(1024)} 1024w, ${mk(1280)} 1280w, ${mk(1920)} 1920w`,
        sizes,
      };
    }

  } catch {
    /* use single src */
  }

  return { src, sizes };
}

function CarouselBannerImage({
  slide,
  priority,
}: {
  slide: CarouselSlide;
  priority?: boolean;
}) {
  const sources = useMemo(
    () => buildCarouselImageSources(slide.image),
    [slide.image],
  );
  const [src, setSrc] = useState(sources.src);

  useEffect(() => {
    setSrc(sources.src);
  }, [sources.src]);

  return (
    <div className="hero-carousel-media">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        srcSet={sources.srcSet}
        sizes={sources.sizes}
        alt={slide.alt}
        width={CAROUSEL_BANNER_WIDTH}
        height={CAROUSEL_BANNER_HEIGHT}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        draggable={false}
        referrerPolicy="no-referrer"
        className="hero-carousel-image"
        onError={() => {
          const raw = slide.image.trim();
          if (raw && src !== raw && /^https?:\/\//i.test(raw)) {
            setSrc(raw);
          }
        }}
      />
    </div>
  );
}

export default function HeroCarousel({ slides: initialSlides }: HeroCarouselProps) {
  const [cmsSlides, setCmsSlides] = useState<CarouselSlide[] | null | undefined>(initialSlides);
  const slides = useMemo(() => normalizeSlides(cmsSlides), [cmsSlides]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let active = true;

    fetchPublicCmsFresh()
      .then((cms) => {
        if (!active) return;
        if (cms?.hero && Array.isArray(cms.hero.slides)) {
          setCmsSlides(cms.hero.slides);
        }
      })
      .catch(() => {
        /* keep server-rendered slides */
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setIndex((current) => {
      if (!slides.length) return 0;
      return current >= slides.length ? 0 : current;
    });
  }, [slides]);

  const slideIds = useMemo(() => slides.map((s) => s.id).join(","), [slides]);

  const goTo = useCallback(
    (nextIndex: number) => {
      if (!slides.length) return;
      setIndex((nextIndex + slides.length) % slides.length);
    },
    [slides.length],
  );

  const next = useCallback(() => {
    setIndex((current) => (current + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setIndex((current) => (current - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, AUTO_PLAY_MS);
    return () => clearInterval(timer);
  }, [paused, slides.length, slideIds]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setPaused(true);
    const touch = e.touches[0];
    (e.currentTarget as HTMLElement).dataset.touchX = String(touch.clientX);
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const startX = Number((e.currentTarget as HTMLElement).dataset.touchX);
      const endX = e.changedTouches[0]?.clientX;
      if (startX && endX !== undefined) {
        const delta = endX - startX;
        if (Math.abs(delta) >= 40) {
          if (delta > 0) prev();
          else next();
        }
      }
      setPaused(false);
    },
    [next, prev],
  );

  if (!slides.length) return null;

  const slide = slides[index];
  const showControls = slides.length > 1;

  return (
    <div
      className="hero-carousel group w-full max-w-[100vw]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="E Royal Mango promotional banners"
    >
      <div
        className="hero-carousel-stage relative w-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.id}
            className="hero-carousel-frame absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            style={{ willChange: "opacity" }}
          >
            <Link
              href={slide.link || "/products"}
              className="hero-carousel-slide block h-full w-full cursor-pointer"
              aria-label={`${slide.alt}. View linked page.`}
            >
              <CarouselBannerImage slide={slide} priority={index === 0} />
            </Link>
          </motion.div>
        </AnimatePresence>

        {showControls && (
          <>
            <button
              type="button"
              onClick={prev}
              className="hero-carousel-nav hero-carousel-nav-prev"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2.25} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={next}
              className="hero-carousel-nav hero-carousel-nav-next"
              aria-label="Next slide"
            >
              <ChevronRight className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2.25} aria-hidden="true" />
            </button>

            <div className="hero-carousel-dots-overlay pointer-events-none absolute inset-x-0 bottom-0 z-10">
              <div
                className="hero-carousel-dots flex max-w-full items-center justify-center gap-2 overflow-x-auto px-4 pb-3 pt-6 sm:pb-3.5"
                role="tablist"
                aria-label={`Carousel slides, ${slides.length} total`}
              >
                {slides.map((item, dotIndex) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={dotIndex === index}
                    aria-label={`Go to slide ${dotIndex + 1} of ${slides.length}`}
                    onClick={() => goTo(dotIndex)}
                    className={`hero-carousel-dot pointer-events-auto shrink-0 rounded-full border-0 transition-all duration-300 ${
                      dotIndex === index
                        ? "hero-carousel-dot-active h-2.5 w-2.5 scale-110"
                        : "h-2 w-2 bg-white/90 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
