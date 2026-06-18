import type { Metadata } from "next";
import { getPublicSettings } from "@/lib/api";
import Providers from "@/components/Providers";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { SettingsProvider } from "@/store/SettingsContext";
import "@/styles/globals.css";
import "@/styles/theme-eroyal.css";
import { Cormorant_Garamond, Inter } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "E Royal Mango | Premium Organic Mangoes",
  description:
    "Luxury organic mangoes crafted with royal heritage and modern elegance.",
  icons: {
    icon: "/images/e-royal-mango-logo.png",
    apple: "/images/e-royal-mango-logo.png",
  },
  openGraph: {
    title: "E Royal Mango | Premium Organic Mangoes",
    description:
      "Luxury organic mangoes crafted with royal heritage and modern elegance.",
    images: ["/images/e-royal-mango-logo.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getPublicSettings();

  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <Providers>
          <SettingsProvider settings={settings?.website ?? null}>
            {children}
            <WhatsAppFloat />
          </SettingsProvider>
        </Providers>
      </body>
    </html>
  );
}
