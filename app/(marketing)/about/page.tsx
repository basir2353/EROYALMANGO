import type { Metadata } from "next";
import AboutPage from "@/components/about/AboutPage";
import { getPublicAbout } from "@/lib/api";
import { mapAboutContent } from "@/services/content";

export const metadata: Metadata = {
  title: "About Us | E Royal Mango",
  description:
    "Learn about E Royal Mango — Pakistan's premium mango export brand. Orchard-fresh Chaunsa, Sindhri, and more delivered with royal care.",
};

export default async function AboutRoutePage() {
  const about = await getPublicAbout();

  return (
    <main>
      <AboutPage content={mapAboutContent(about)} />
    </main>
  );
}
