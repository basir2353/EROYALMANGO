"use client";

import { useCallback, useEffect, useState } from "react";
import AppImage from "@/components/AppImage";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

type Testimonial = {
  id: number;
  name: string;
  location: string;
  review: string;
  rating: number;
  photo: string;
};

const testimonials: Testimonial[] = [];

const AUTO_SLIDE_MS = 5500;

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center justify-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-mango-400 text-mango-400"
              : "fill-white/10 text-white/15"
          }`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function TestimonialSlide({ testimonial }: { testimonial: Testimonial }) {
  return (
    <motion.div
      className="testimonial-glass-card mx-auto w-full max-w-3xl px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="testimonial-shine pointer-events-none absolute inset-0" />

      <Quote
        className="relative mx-auto mb-6 h-8 w-8 text-gold-400/40 sm:mb-8"
        strokeWidth={1.25}
      />

      <p
        className="relative text-center text-base leading-relaxed text-white/80 sm:text-lg sm:leading-relaxed lg:text-[1.35rem] lg:leading-[1.7]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        &ldquo;{testimonial.review}&rdquo;
      </p>

      <div className="relative mt-8 flex flex-col items-center sm:mt-10">
        <div className="testimonial-avatar-ring relative h-16 w-16 overflow-hidden rounded-full sm:h-[4.5rem] sm:w-[4.5rem]">
          <AppImage
            src={testimonial.photo}
            alt={testimonial.name}
            fill
            sizes="72px"
            className="object-cover"
          />
        </div>

        <p className="mt-4 text-base font-semibold text-white sm:text-lg">
          {testimonial.name}
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/40">
          {testimonial.location}
        </p>

        <div className="mt-4">
          <StarRating rating={testimonial.rating} />
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialsSlider({
  testimonials: items = [],
}: {
  testimonials?: Testimonial[];
}) {
  const slides = items.length ? items : testimonials;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback((index: number) => {
    if (!slides.length) return;
    setActiveIndex((index + slides.length) % slides.length);
  }, [slides.length]);

  const goNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(goNext, AUTO_SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [isPaused, goNext]);

  if (!slides.length) return null;

  return (
    <section
      className="testimonials-section relative overflow-hidden py-24 sm:py-32 lg:py-40"
      aria-label="Customer testimonials"
    >
      <div className="testimonials-section-glow pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div
          className="mb-14 text-center sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-400/75">
            Testimonials
          </p>
          <h2
            className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            What Our{" "}
            <span className="luxury-gradient-text italic">Customers Say</span>
          </h2>
        </motion.div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          {/* Slider track */}
          <div className="relative min-h-0 sm:min-h-[380px] lg:min-h-[400px]">
            <AnimatePresence mode="wait">
              <TestimonialSlide
                key={slides[activeIndex].id}
                testimonial={slides[activeIndex]}
              />
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-center gap-4 sm:mt-10">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={goPrev}
              className="testimonial-nav-btn"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
            </button>

            <div className="flex items-center gap-2">
              {slides.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  onClick={() => goTo(index)}
                  className={`testimonial-dot ${
                    index === activeIndex ? "testimonial-dot-active" : ""
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              aria-label="Next testimonial"
              onClick={goNext}
              className="testimonial-nav-btn"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
