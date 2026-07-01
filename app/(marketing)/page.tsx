import Hero from "@/sections/Hero";
import BenefitsSection from "@/sections/BenefitsSection";
import MangoGallery from "@/sections/MangoGallery";
import FeaturedProducts from "@/sections/FeaturedProducts";
import BestSellingProducts from "@/sections/BestSellingProducts";
import StatsSection from "@/sections/StatsSection";
import TestimonialsSlider from "@/sections/TestimonialsSlider";
import CallToAction from "@/sections/CallToAction";
import PromoBanner from "@/sections/PromoBanner";
import { getPublicCms, getPublicTestimonials } from "@/lib/api";
import { fetchCatalogProducts } from "@/services/catalog";

export const revalidate = 5;

export default async function Home() {
  const [cms, featuredRaw, mostLovedRaw, testimonialsRaw] = await Promise.all([
    getPublicCms({ fresh: true }),
    fetchCatalogProducts({ featured: "true" }),
    fetchCatalogProducts({ mostLoved: "true" }),
    getPublicTestimonials(),
  ]);

  const featuredProducts = featuredRaw.map((p, i) => ({
    id: i + 1,
    slug: p.slug,
    name: p.name,
    category: p.category,
    minPrice: p.minPrice,
    maxPrice: p.maxPrice,
    compareAtPrice: p.compareAtPrice,
    onSale: p.onSale,
    saleBadge: p.saleBadge,
    image: p.image,
    alt: p.alt,
    description: p.shortDescription,
  }));
  const mostLovedProducts = mostLovedRaw.map((p, i) => ({
    id: i + 1,
    slug: p.slug,
    name: p.name,
    category: p.category,
    minPrice: p.minPrice,
    maxPrice: p.maxPrice,
    compareAtPrice: p.compareAtPrice,
    onSale: p.onSale,
    saleBadge: p.saleBadge,
    image: p.image,
    alt: p.alt,
    description: p.shortDescription,
  }));

  const testimonials = testimonialsRaw.map((t, i) => ({
    id: i + 1,
    name: String(t.customerName ?? ""),
    location: String(t.location ?? "Pakistan"),
    review: String(t.review ?? ""),
    rating: Number(t.rating ?? 5),
    photo: String(t.customerImage ?? "/images/chaunsa-premium-variety.png"),
  }));

  return (
    <main>
      {(!cms?.hero || cms.hero.isVisible) && <Hero data={cms?.hero} />}
      <FeaturedProducts products={featuredProducts} />
      <BestSellingProducts products={mostLovedProducts} />
      {(!cms?.benefits || cms.benefits.isVisible) && <BenefitsSection data={cms?.benefits} />}
      {(!cms?.gallery || cms.gallery.isVisible) && <MangoGallery data={cms?.gallery} />}
      {(!cms?.promo || cms.promo.isVisible) && <PromoBanner data={cms?.promo} />}
      {(!cms?.stats || cms.stats.isVisible) && <StatsSection data={cms?.stats} />}
      <TestimonialsSlider testimonials={testimonials} />
      {(!cms?.contactCta || cms.contactCta.isVisible) && <CallToAction data={cms?.contactCta} />}
    </main>
  );
}
