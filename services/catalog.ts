import type { ApiProduct } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/media";
import {
  getPublicCategories,
  getPublicProductBySlug,
  getPublicProducts,
} from "@/lib/api";
import type { ShopProduct } from "@/services/shop-products";

type WeightOption = { weight: string; price: number; salePrice?: number };

function parseWeightOptions(raw: unknown): WeightOption[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((w): w is WeightOption => typeof w === "object" && w !== null && "weight" in w);
}

export function mapApiProductToShopProduct(raw: ApiProduct): ShopProduct {
  const images = Array.isArray(raw.images)
    ? (raw.images as { url?: string }[] | string[])
        .map((i) => resolveMediaUrl(typeof i === "string" ? i : String(i.url ?? "")))
        .filter(Boolean)
    : [];
  const primaryImage = images[0] ?? resolveMediaUrl("/images/chaunsa-premium-variety.png");
  const categoryObj = raw.category as { name?: string } | string | undefined;
  const categoryName = String(
    raw.categoryName ??
      ((typeof categoryObj === "object" && categoryObj?.name ? categoryObj.name : "") ||
        "Mango Variety"),
  );

  const weightOptions = parseWeightOptions(raw.weightOptions);
  const weights = weightOptions.map((w) => w.weight).filter((w): w is "10kg" | "5kg" => w === "10kg" || w === "5kg");
  const onSale = raw.onSale === true;
  const weightPrices: Partial<Record<"10kg" | "5kg", number>> = {};
  for (const w of weightOptions) {
    if (w.weight === "10kg" || w.weight === "5kg") {
      weightPrices[w.weight] = Number(onSale && w.salePrice != null ? w.salePrice : w.price);
    }
  }

  const regularPrice = Number(raw.regularPrice ?? 0);
  const salePrice = onSale && raw.salePrice != null ? Number(raw.salePrice) : undefined;
  const effectiveSalePrice = salePrice;
  const minPrice = effectiveSalePrice ?? regularPrice;
  const maxPrice =
    weights.length > 1
      ? Math.max(...Object.values(weightPrices).map(Number))
      : regularPrice;

  return {
    id: String(raw.id ?? raw._id ?? raw.slug),
    slug: String(raw.slug),
    name: String(raw.name),
    category: categoryName,
    image: primaryImage,
    alt: String(raw.name),
    minPrice,
    maxPrice: weights.length ? maxPrice : undefined,
    compareAtPrice:
      onSale && effectiveSalePrice != null && regularPrice > effectiveSalePrice
        ? regularPrice
        : undefined,
    onSale,
    saleBadge:
      onSale && raw.saleBadge != null && String(raw.saleBadge).trim()
        ? String(raw.saleBadge).trim()
        : undefined,
    discountPercent:
      onSale && raw.discountPercent != null
        ? Number(raw.discountPercent)
        : onSale &&
            effectiveSalePrice != null &&
            regularPrice > effectiveSalePrice
          ? Math.round((1 - effectiveSalePrice / regularPrice) * 100)
          : undefined,
    weights: weights.length ? weights : undefined,
    weightPrices: Object.keys(weightPrices).length ? weightPrices : undefined,
    action: (raw.action as "select" | "cart") ?? "select",
    shortDescription: String(raw.shortDescription ?? ""),
    descriptionTitle: String(raw.descriptionTitle ?? raw.name),
    descriptionParagraphs: Array.isArray(raw.descriptionParagraphs)
      ? (raw.descriptionParagraphs as string[])
      : String(raw.fullDescription ?? "")
          .split("\n\n")
          .filter(Boolean),
    additionalInfo: Array.isArray(raw.additionalInfo)
      ? (raw.additionalInfo as { label: string; value: string }[])
      : [],
    reviewCount: Number(raw.reviewCount ?? 0),
    freeShipping: raw.freeShipping !== false,
  };
}

export function mapToFeaturedProduct(raw: ApiProduct, index: number) {
  const shop = mapApiProductToShopProduct(raw);
  return {
    id: index + 1,
    slug: shop.slug,
    name: shop.name,
    category: shop.category,
    price: shop.minPrice,
    compareAtPrice: shop.compareAtPrice,
    onSale: shop.onSale,
    saleBadge: shop.saleBadge,
    image: shop.image,
    alt: shop.alt,
    description: shop.shortDescription,
  };
}

export async function fetchCatalogProducts(params?: Record<string, string>): Promise<ShopProduct[]> {
  const items = await getPublicProducts(params);
  return items.map(mapApiProductToShopProduct);
}

export async function fetchProductBySlug(slug: string): Promise<ShopProduct | null> {
  const raw = await getPublicProductBySlug(slug);
  return raw ? mapApiProductToShopProduct(raw) : null;
}

export async function fetchRelatedProducts(slug: string, limit = 3): Promise<ShopProduct[]> {
  const all = await fetchCatalogProducts();
  return all.filter((p) => p.slug !== slug).slice(0, limit);
}

export async function fetchCatalogCategories() {
  const cats = await getPublicCategories();
  const products = await fetchCatalogProducts();
  return cats.map((c) => ({
    name: String(c.name),
    slug: String(c.slug),
    count: products.filter((p) => p.category === c.name).length,
  }));
}

export async function fetchProductSlugs(): Promise<string[]> {
  const products = await fetchCatalogProducts();
  return products.map((p) => p.slug);
}

export async function fetchHottestDeals(): Promise<string[]> {
  const products = await fetchCatalogProducts();
  return products.filter((p) => p.onSale).slice(0, 6).map((p) => p.slug);
}
