"use client";

import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { motion, useSpring } from "framer-motion";
import {
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import FloatingMango from "@/components/hero/FloatingMango";
import { submitContactForm } from "@/lib/api";

type ContactDetail = {
  label: string;
  value: string;
  href: string;
};

function ContactForm3D() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rotateX = useSpring(0, { stiffness: 280, damping: 28 });
  const rotateY = useSpring(0, { stiffness: 280, damping: 28 });
  const shadowX = useSpring(0, { stiffness: 280, damping: 28 });
  const shadowY = useSpring(14, { stiffness: 280, damping: 28 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    rotateY.set(x * 10);
    rotateX.set(-y * 10);
    shadowX.set(x * 20);
    shadowY.set(14 + y * 14);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    shadowX.set(0);
    shadowY.set(14);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const { data: result, error } = await submitContactForm({
      name: String(formData.get("name") ?? "Website Visitor"),
      email: String(formData.get("email")),
      subject: String(formData.get("subject")),
      message: String(formData.get("message")),
    });
    setSubmitting(false);
    if (!result) {
      setError(error ?? "Could not send your message. Please try again.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="contact-form-wrap relative" style={{ perspective: 1400 }}>
      <motion.div
        className="contact-form-shadow pointer-events-none absolute -bottom-4 left-[8%] right-[8%] h-10 rounded-[50%]"
        style={{ x: shadowX, y: shadowY }}
      />

      <motion.div
        ref={cardRef}
        className="contact-form-3d relative overflow-hidden rounded-[1.75rem] sm:rounded-[2rem]"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="contact-form-shine pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="contact-form-edge pointer-events-none absolute inset-0 rounded-[inherit]" aria-hidden="true" />

        <div className="relative p-6 sm:p-8 lg:p-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-400/80">
            Contact Us
          </p>
          <h2
            className="mt-3 text-2xl font-semibold text-white sm:text-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Send a <span className="luxury-gradient-text italic">Message</span>
          </h2>

          {submitted ? (
            <motion.p
              className="mt-8 rounded-xl border border-gold-400/25 bg-gold-500/10 px-4 py-5 text-sm leading-relaxed text-gold-200/90"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              Thank you! Your message has been received. Our team will get back to
              you shortly.
            </motion.p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {error && (
                <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </p>
              )}
              <div>
                <label htmlFor="contact-name" className="contact-field-label">
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Enter your full name"
                  className="contact-input"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="contact-field-label">
                  Your Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="Enter your email address"
                  className="contact-input"
                />
              </div>
              <div>
                <label htmlFor="contact-subject" className="contact-field-label">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  required
                  placeholder="What is this about?"
                  className="contact-input"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="contact-field-label">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Write your message here…"
                  className="contact-input contact-textarea resize-none"
                />
              </div>
              <button type="submit" className="contact-submit-btn group w-full" disabled={submitting}>
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
                {submitting ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function ContactPage({
  intro,
  contactDetails,
}: {
  intro?: string;
  contactDetails: readonly ContactDetail[];
}) {
  return (
    <section className="contact-section relative min-h-[calc(100vh-5rem)] overflow-hidden pb-24 pt-8 sm:pb-32 sm:pt-10 lg:pb-40">
      <div className="contact-section-glow pointer-events-none absolute inset-0" />
      <div className="contact-grid-3d pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="contact-orb contact-orb-1 pointer-events-none absolute" aria-hidden="true" />
      <div className="contact-orb contact-orb-2 pointer-events-none absolute" aria-hidden="true" />

      <motion.div
        className="pointer-events-none absolute left-[4%] top-[18%] hidden opacity-70 lg:block"
        animate={{ y: [0, -18, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{ transform: "translateZ(40px)" }}
      >
        <FloatingMango size={100} />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute bottom-[12%] right-[6%] hidden opacity-50 xl:block"
        animate={{ y: [0, 14, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <FloatingMango size={72} />
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-10 flex flex-wrap items-center gap-2 text-sm text-white/45"
        >
          <Link href="/" className="transition-colors hover:text-gold-300">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-white/25" aria-hidden="true" />
          <span className="text-gold-300/80">Contact</span>
        </nav>

        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1
              className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Say{" "}
              <span className="luxury-gradient-text italic">Hello.</span>
            </h1>

            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/55 sm:text-[15px]">
              {intro ??
                "We're always ready to help with questions about our mangoes, orders, or export inquiries. Reach out — we'd love to hear from you."}
            </p>

            <div className="contact-divider mt-8" aria-hidden="true" />

            <ul className="mt-8 space-y-6">
              {contactDetails.map((item, index) => {
                const Icon =
                  item.label === "Location"
                    ? MapPin
                    : item.label === "Email"
                      ? Mail
                      : Phone;
                const content = (
                  <>
                    <span className="contact-info-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
                      <Icon className="h-5 w-5 text-gold-300" strokeWidth={1.5} />
                    </span>
                    <span>
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-400/65">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-sm text-white/75 transition-colors group-hover:text-gold-200 sm:text-[15px]">
                        {item.value}
                      </span>
                    </span>
                  </>
                );

                return (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.15 + index * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <a
                      href={item.href}
                      className="contact-info-item group flex gap-4"
                      {...(item.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {content}
                    </a>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>

          <ContactForm3D />
        </div>
      </div>
    </section>
  );
}
