import type { Metadata } from "next";
import ContactPage from "@/components/contact/ContactPage";
import { getPublicCms, getPublicSettings } from "@/lib/api";
import { buildContactDetails } from "@/services/content";

export const metadata: Metadata = {
  title: "Contact Us | E Royal Mango",
  description:
    "Get in touch with E Royal Mango — Multan, Pakistan. Questions about orders, exports, or premium mangoes.",
};

export default async function ContactRoutePage() {
  const [settings, cms] = await Promise.all([getPublicSettings(), getPublicCms()]);

  return (
    <main>
      <ContactPage
        intro={cms?.contactPage?.intro ?? settings?.website?.footerContent}
        contactDetails={buildContactDetails(settings)}
      />
    </main>
  );
}
