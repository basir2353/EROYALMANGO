"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Award, Calendar, Globe, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CmsStats } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

type StatItem = {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: LucideIcon;
  gradient: string;
};

function parseStatValue(raw: string): { value: number; suffix: string } {
  const match = raw.match(/^([\d,]+)(.*)$/);
  if (!match) return { value: 0, suffix: raw };
  return { value: Number(match[1].replace(/,/g, "")), suffix: match[2] || "" };
}

function buildStats(data?: CmsStats | null): StatItem[] {
  const defaults = {
    customersCommunity: "10,000+",
    satisfactionRate: "98%",
    yearsInBusiness: "15+",
    countriesShipped: "12+",
  };
  const s = { ...defaults, ...data };
  const entries = [
    { id: "customers", label: "Customers Community", raw: s.customersCommunity, icon: Users, gradient: "stats-gradient-1" },
    { id: "satisfaction", label: "Satisfaction Rate", raw: s.satisfactionRate, icon: Award, gradient: "stats-gradient-2" },
    { id: "years", label: "Years In Business", raw: s.yearsInBusiness, icon: Calendar, gradient: "stats-gradient-3" },
    { id: "countries", label: "Countries We Ship To", raw: s.countriesShipped, icon: Globe, gradient: "stats-gradient-4" },
  ];
  return entries.map((e) => {
    const parsed = parseStatValue(e.raw);
    return { id: e.id, label: e.label, value: parsed.value, suffix: parsed.suffix, icon: e.icon, gradient: e.gradient };
  });
}

function StatCard({
  stat,
  index,
  onNumberRef,
}: {
  stat: StatItem;
  index: number;
  onNumberRef: (el: HTMLSpanElement | null) => void;
}) {
  const Icon = stat.icon;

  return (
    <motion.div
      className={`stats-card ${stat.gradient} relative overflow-hidden rounded-[1.5rem] p-6 sm:p-8`}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.75,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="stats-card-shine pointer-events-none absolute inset-0" />

      <div className="relative flex flex-col items-center text-center">
        <div className="stats-icon-wrap mb-5 flex h-14 w-14 items-center justify-center rounded-2xl sm:h-16 sm:w-16">
          <Icon className="h-6 w-6 text-gold-300 sm:h-7 sm:w-7" strokeWidth={1.5} />
        </div>

        <p className="stats-counter luxury-gradient-text text-4xl font-semibold tabular-nums sm:text-5xl lg:text-[3.25rem]">
          <span ref={onNumberRef}>0{stat.suffix}</span>
        </p>

        <p
          className="mt-3 text-sm font-medium leading-snug text-white/55 sm:text-[15px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {stat.label}
        </p>
      </div>
    </motion.div>
  );
}

export default function StatsSection({ data }: { data?: CmsStats | null }) {
  const stats = useMemo(() => buildStats(data), [data]);
  const sectionRef = useRef<HTMLElement>(null);
  const numberElementsRef = useRef<Record<string, HTMLSpanElement | null>>({});

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      stats.forEach((stat) => {
        const el = numberElementsRef.current[stat.id];
        if (!el) return;

        if (prefersReducedMotion) {
          el.textContent =
            stat.suffix === "%"
              ? `${stat.value}${stat.suffix}`
              : `${stat.value.toLocaleString()}${stat.suffix}`;
          return;
        }

        const counter = { value: 0 };

        gsap.to(counter, {
          value: stat.value,
          duration: 2.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            once: true,
          },
          onUpdate: () => {
            el.textContent =
              stat.suffix === "%"
                ? `${Math.round(counter.value)}${stat.suffix}`
                : `${Math.floor(counter.value).toLocaleString()}${stat.suffix}`;
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, [stats]);

  return (
    <section
      ref={sectionRef}
      className="stats-section relative overflow-hidden py-24 sm:py-32 lg:py-36"
      aria-label="Company statistics"
    >
      <div className="stats-section-bg pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div
          className="mb-14 text-center sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-400/75">
            Our Impact
          </p>
          <h2
            className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Trusted by{" "}
            <span className="luxury-gradient-text italic">Thousands Worldwide</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-7">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.id}
              stat={stat}
              index={index}
              onNumberRef={(el) => {
                numberElementsRef.current[stat.id] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
