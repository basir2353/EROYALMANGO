"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AppImage from "@/components/AppImage";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { CmsGallery } from "@/lib/api";

type GalleryItem = {
  id: number;
  src: string;
  alt: string;
  caption: string;
  layout: "tall" | "wide" | "medium";
  objectPosition?: string;
};

function GalleryHeading({ title }: { title: string }) {
  const match = title.trim().match(/^(.+?)\s+(Gallery)$/i);
  if (match) {
    return (
      <>
        {match[1]}{" "}
        <span className="luxury-gradient-text italic">{match[2]}</span>
      </>
    );
  }
  return <>{title}</>;
}

const layoutCycle: GalleryItem["layout"][] = ["tall", "wide", "medium"];

function buildGalleryItems(data?: CmsGallery | null): GalleryItem[] {
  if (!data?.items?.length) return [];
  return data.items.map((item, index) => ({
    id: index + 1,
    src: item.image,
    alt: item.alt,
    caption: item.category,
    layout: layoutCycle[index % layoutCycle.length],
    objectPosition: index === 0 ? "center 35%" : "center center",
  }));
}

const layoutClasses: Record<GalleryItem["layout"], string> = {
  tall: "gallery-item-tall md:col-span-5 md:row-span-2",
  wide: "gallery-item-wide md:col-span-7",
  medium: "gallery-item-medium md:col-span-7",
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
      className={`gallery-orb pointer-events-none absolute rounded-full ${className ?? ""}`}
      animate={{ y: [0, -12, 0], opacity: [0.4, 0.8, 0.4] }}
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

function Lightbox({
  item,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  item: GalleryItem;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      className="gallery-lightbox fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <motion.button
        type="button"
        aria-label="Close preview"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <span className="gallery-lightbox-backdrop absolute inset-0" />
      </motion.button>

      <motion.div
        className="gallery-lightbox-panel relative z-10 w-full max-w-5xl overflow-hidden rounded-[1.75rem] sm:rounded-[2rem]"
        initial={{ scale: 0.92, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 16 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[4/3] w-full bg-orchard-950">
          <AppImage
            src={item.src}
            alt={item.alt}
            fill
            sizes="(max-width: 1280px) 95vw, 1024px"
            quality={95}
            className="object-contain object-center p-2 sm:p-4"
            style={{ objectPosition: item.objectPosition ?? "center center" }}
            priority
          />
        </div>

        <div className="gallery-lightbox-meta flex items-center justify-between gap-4 px-6 py-5 sm:px-8 sm:py-6">
          <div>
            <p className="gallery-lightbox-eyebrow text-[10px] font-semibold uppercase tracking-[0.35em] text-gold-400/70">
              {item.caption} · 0{index + 1} / 0{total}
            </p>
            <p
              className="gallery-lightbox-title mt-1 text-xl font-semibold text-white sm:text-2xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {item.alt}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="gallery-lightbox-close flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors hover:text-gold-300"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      </motion.div>

      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="gallery-lightbox-nav absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="gallery-lightbox-nav absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 sm:flex"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </>
      )}
    </motion.div>
  );
}

export default function MangoGallery({ data }: { data?: CmsGallery | null }) {
  const galleryItems = useMemo(() => buildGalleryItems(data), [data]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setActiveIndex(index);
  const closeLightbox = () => setActiveIndex(null);

  const goPrev = useCallback(() => {
    setActiveIndex((current) =>
      current === null || !galleryItems.length
        ? null
        : (current - 1 + galleryItems.length) % galleryItems.length,
    );
  }, [galleryItems.length]);

  const goNext = useCallback(() => {
    setActiveIndex((current) =>
      current === null || !galleryItems.length
        ? null
        : (current + 1) % galleryItems.length,
    );
  }, [galleryItems.length]);

  if (!galleryItems.length) return null;

  return (
    <section className="gallery-section relative overflow-hidden py-24 sm:py-32 lg:py-40">
      <FloatingOrb className="left-[8%] top-[18%] h-2 w-2" delay={0} />
      <FloatingOrb
        className="right-[12%] top-[28%] h-1.5 w-1.5"
        delay={1.2}
        duration={6}
      />
      <FloatingOrb
        className="bottom-[22%] left-[18%] h-1 w-1"
        delay={2}
        duration={4.5}
      />

      <div className="gallery-section-glow pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          className="gallery-header mb-14 text-center sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="gallery-eyebrow mb-4 text-[11px] font-semibold uppercase tracking-[0.4em] sm:text-xs">
            Premium Collection
          </p>

          <h2
            className="gallery-title text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.25rem]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <GalleryHeading title={data?.sectionTitle ?? "Mango Gallery"} />
          </h2>

          <div className="mx-auto mt-5 flex items-center justify-center gap-4">
            <span className="gallery-header-line h-px w-12 sm:w-20" aria-hidden="true" />
            <p className="gallery-subtitle-kicker text-xs font-semibold uppercase tracking-[0.45em] sm:text-sm">
              Gallery
            </p>
            <span className="gallery-header-line h-px w-12 sm:w-20" aria-hidden="true" />
          </div>

          <p className="gallery-description mx-auto mt-5 max-w-lg text-sm leading-relaxed sm:text-[15px]">
            {data?.sectionSubtitle ??
              "A glimpse of our premium harvest — handpicked varieties from Pakistan's finest orchards."}
          </p>
        </motion.div>

        <div className="gallery-masonry grid grid-cols-1 gap-5 md:grid-cols-12 md:grid-rows-2 md:gap-6 lg:gap-7">
          {galleryItems.map((item, index) => (
            <motion.button
              key={item.id}
              type="button"
              className={`gallery-item group relative col-span-1 overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 ${layoutClasses[item.layout]}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.75,
                delay: index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={() => openLightbox(index)}
              aria-label={`View ${item.caption}`}
            >
              <div className="gallery-item-frame relative h-full w-full overflow-hidden rounded-[1.25rem] sm:rounded-[1.5rem]">
                <div className="gallery-item-image-wrap relative h-full w-full overflow-hidden">
                  <AppImage
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={95}
                    className="gallery-item-image object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-focus-visible:scale-[1.02]"
                    style={{ objectPosition: item.objectPosition ?? "center center" }}
                  />
                </div>

                <div className="gallery-item-overlay pointer-events-none absolute inset-0" aria-hidden="true" />

                <div className="gallery-item-caption absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5 lg:p-6">
                  <div className="gallery-item-caption-inner">
                    <span className="gallery-item-index">0{index + 1}</span>
                    <p
                      className="gallery-item-name mt-1 text-base font-semibold sm:text-lg"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {item.caption}
                    </p>
                  </div>
                </div>

                <div
                  className="gallery-item-expand absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:right-5 sm:top-5 sm:h-10 sm:w-10"
                  aria-hidden="true"
                >
                  <Expand className="h-4 w-4" strokeWidth={1.5} />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeIndex !== null && (
          <Lightbox
            item={galleryItems[activeIndex]}
            index={activeIndex}
            total={galleryItems.length}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
