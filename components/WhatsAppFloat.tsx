"use client";

import { useWebsiteSettings } from "@/store/SettingsContext";
import { WhatsAppIcon } from "@/lib/social-links";

const DEFAULT_MESSAGE =
  "Hello E Royal Mango! I would like help with my order or have a question about your mangoes.";

export default function WhatsAppFloat() {
  const settings = useWebsiteSettings();
  const number = (settings?.whatsapp ?? "923073970850").replace(/\D/g, "");
  const whatsappHref = `https://wa.me/${number}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <div className="whatsapp-float fixed bottom-5 right-4 z-[90] flex items-center gap-2.5 sm:bottom-6 sm:right-6">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float-link group flex items-center gap-2.5"
        aria-label="Chat with E Royal Mango on WhatsApp — Need help?"
      >
        <span className="whatsapp-float-bubble">Need Help?</span>
        <span className="whatsapp-float-btn flex h-14 w-14 shrink-0 items-center justify-center rounded-full sm:h-[3.75rem] sm:w-[3.75rem]">
          <WhatsAppIcon className="h-7 w-7 text-white sm:h-8 sm:w-8" />
        </span>
      </a>
    </div>
  );
}
