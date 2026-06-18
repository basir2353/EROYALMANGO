export type ShopProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  alt: string;
  minPrice: number;
  maxPrice?: number;
  compareAtPrice?: number;
  onSale: boolean;
  saleBadge?: string;
  discountPercent?: number;
  weights?: ("10kg" | "5kg")[];
  weightPrices?: Partial<Record<"10kg" | "5kg", number>>;
  action: "select" | "cart";
  shortDescription: string;
  descriptionTitle: string;
  descriptionParagraphs: string[];
  additionalInfo: { label: string; value: string }[];
  reviewCount: number;
  freeShipping: boolean;
};

export function hasActiveSale(product: { onSale?: boolean }): boolean {
  return product.onSale === true;
}

export function shouldShowCompareAtPrice(
  product: Pick<ShopProduct, "compareAtPrice" | "minPrice"> & { onSale?: boolean },
): boolean {
  return (
    hasActiveSale(product) &&
    product.compareAtPrice != null &&
    product.compareAtPrice > product.minPrice
  );
}

export function shouldShowSaleBadge(product: { onSale?: boolean; saleBadge?: string }): boolean {
  return hasActiveSale(product) && Boolean(product.saleBadge?.trim());
}

export function getSaleBadgeLabel(product: { onSale?: boolean; saleBadge?: string }) {
  if (!shouldShowSaleBadge(product)) return "";
  return product.saleBadge!.trim();
}

export function getUnitPrice(
  product: ShopProduct,
  weight?: "10kg" | "5kg" | null,
): number {
  if (weight && product.weightPrices?.[weight] != null) {
    return product.weightPrices[weight]!;
  }
  if (weight === "10kg" && product.maxPrice) {
    return product.maxPrice;
  }
  if (weight === "5kg") {
    return product.minPrice;
  }
  return Number.isFinite(product.minPrice) ? product.minPrice : 0;
}

export function formatShopPrice(amount: number | null | undefined) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "₨0";
  return `₨${value.toLocaleString("en-PK")}`;
}

export function formatPriceRange(product: ShopProduct) {
  if (product.maxPrice && product.maxPrice !== product.minPrice) {
    return `${formatShopPrice(product.minPrice)} – ${formatShopPrice(product.maxPrice)}`;
  }
  return formatShopPrice(product.minPrice);
}

export type SortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

export function sortProducts(products: ShopProduct[], sort: SortOption): ShopProduct[] {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.minPrice - b.minPrice);
    case "price-desc":
      return list.sort((a, b) => b.minPrice - a.minPrice);
    case "name-asc":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return list.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return list;
  }
}

export {
  fetchCatalogProducts,
  fetchCatalogCategories,
  fetchHottestDeals,
  fetchProductBySlug,
  fetchProductSlugs,
  fetchRelatedProducts,
  mapToFeaturedProduct,
} from "@/services/catalog";
