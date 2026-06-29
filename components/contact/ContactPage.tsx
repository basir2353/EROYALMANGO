"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { submitContactForm } from "@/lib/api";
import {
  ChevronRight,
  HandHelping,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

type ContactDetail = {
  label: string;
  value: string;
  href: string;
};

const DEFAULT_INTRO =
  "If you have any questions or concerns about E Royal Mango or our products, we are here to help. You can contact us in the following ways.";

const SUPPORT_TEXT =
  "Our customer support team is available to assist you with orders, delivery, export inquiries, and product questions. We aim to respond as quickly as possible during business hours.";

function detailIcon(label: string) {
  if (label === "Email") return Mail;
  if (label === "Origin") return MapPin;
  return Phone;
}

export default function ContactPage({
  intro,
  contactDetails,
}: {
  intro?: string;
  contactDetails: readonly ContactDetail[];
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const { data: result, error: submitError } = await submitContactForm({
      name: String(formData.get("name") ?? "Website Visitor"),
      email: String(formData.get("email")),
      subject: String(formData.get("subject") ?? "Contact form"),
      message: [
        String(formData.get("message")),
        formData.get("phone")
          ? `\n\nPhone: ${String(formData.get("phone"))}`
          : "",
      ].join(""),
    });
    setSubmitting(false);
    if (!result) {
      setError(submitError ?? "Could not send your message. Please try again.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="contact-classic-page bg-white">
      <div className="border-b border-[#e8e8e8] bg-[#f5f5f5] py-2.5">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-[#546e7a]"
          >
            <Link href="/" className="transition-colors hover:text-[#263238]">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-[#90a4ae]" aria-hidden="true" />
            <span className="font-medium text-[#263238]">Contact Us</span>
          </nav>
        </div>
      </div>

      <div className="contact-classic-hero border-b border-[#f0d040] bg-[#ffcc00] px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <BrandLogo href="/" className="brand-logo--contact" />
          <h1
            className="mt-6 text-3xl font-bold tracking-tight text-[#212121] sm:text-4xl md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Contact Us
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#424242] sm:text-base">
            {intro ?? DEFAULT_INTRO}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="contact-classic-form-card rounded-lg border border-[#eeeeee] bg-white p-6 shadow-[0_4px_24px_rgb(0_0_0/0.06)] sm:p-8">
            {submitted ? (
              <div className="rounded-md border border-[#c8e6c9] bg-[#e8f5e9] px-4 py-5 text-sm leading-relaxed text-[#2e7d32]">
                Thank you! Your message has been received. Our team will get back to
                you shortly.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <p className="rounded-md border border-[#ffcdd2] bg-[#ffebee] px-4 py-3 text-sm text-[#c62828]">
                    {error}
                  </p>
                )}

                <div>
                  <label htmlFor="contact-name" className="contact-classic-label">
                    Full Name <span className="text-[#e53935]">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    autoComplete="name"
                    className="contact-classic-input"
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className="contact-classic-label">
                    Phone
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    className="contact-classic-input"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="contact-classic-label">
                    Email Address <span className="text-[#e53935]">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    className="contact-classic-input"
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="contact-classic-label">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    className="contact-classic-input"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="contact-classic-label">
                    Message <span className="text-[#e53935]">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    className="contact-classic-input contact-classic-textarea resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="contact-classic-submit w-full sm:w-auto"
                >
                  {submitting ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>

          <aside className="space-y-6">
            <ul className="space-y-5">
              {contactDetails.map((item) => {
                const Icon = detailIcon(item.label);
                const displayLabel =
                  item.label === "Phone" ? "WhatsApp / Phone" : item.label;

                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="contact-classic-info group flex gap-4"
                      {...(item.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      <span className="contact-classic-info-icon">
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-[#263238]">
                          {displayLabel}
                        </span>
                        <span className="mt-1 block text-sm text-[#546e7a] transition-colors group-hover:text-[#212121]">
                          {item.value}
                        </span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="contact-classic-info flex gap-4 border-t border-[#eeeeee] pt-6">
              <span className="contact-classic-info-icon">
                <HandHelping className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div>
                <span className="block text-sm font-semibold text-[#263238]">
                  Customer Support
                </span>
                <p className="mt-2 text-sm leading-relaxed text-[#607d8b]">
                  {SUPPORT_TEXT}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
