import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="site-page">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
