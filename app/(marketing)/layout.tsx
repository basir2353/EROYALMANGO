import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="site-page">
      <SiteHeader />
      {children}
      <Footer />
    </div>
  );
}
