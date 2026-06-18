import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailPage from "@/components/product/ProductDetailPage";
import {
  fetchProductBySlug,
  fetchProductSlugs,
  fetchRelatedProducts,
} from "@/services/catalog";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ weight?: string }>;
};

function parseInitialWeight(
  weight: string | undefined,
  options: readonly ("10kg" | "5kg")[] | undefined,
): "10kg" | "5kg" | null {
  if (!weight || !options?.length) return options?.[0] ?? null;
  return options.includes(weight as "10kg" | "5kg")
    ? (weight as "10kg" | "5kg")
    : options[0];
}

export async function generateStaticParams() {
  const slugs = await fetchProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found | E Royal Mango" };
  }

  return {
    title: `${product.name} | E Royal Mango`,
    description: product.shortDescription,
  };
}

export default async function ProductSlugPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { weight } = await searchParams;
  const [product, relatedProducts] = await Promise.all([
    fetchProductBySlug(slug),
    fetchRelatedProducts(slug, 3),
  ]);

  if (!product) {
    notFound();
  }

  const initialWeight = parseInitialWeight(weight, product.weights);

  return (
    <main>
      <ProductDetailPage
        product={product}
        initialWeight={initialWeight}
        relatedProducts={relatedProducts}
      />
    </main>
  );
}
