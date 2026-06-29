const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://eroyal-backend-production.up.railway.app/api"
    : "http://localhost:4000/api")
).replace(/\/api\/?$/, "");

/** Local catalog images in /public/images (reliable — no external CDN). */
const CATALOG_IMAGE_FALLBACKS: Record<string, string> = {
  "chaunsa-premium-variety.png": "/images/chaunsa-premium-variety.jpg",
  "chaunsa-premium-variety.jpg": "/images/chaunsa-premium-variety.jpg",
  "chaunsa-mango-premium.png": "/images/chaunsa-mango-premium.jpg",
  "chaunsa-mango-premium.jpg": "/images/chaunsa-mango-premium.jpg",
  "dasheri-mango.png": "/images/dasheri-mango.jpg",
  "dasheri-mango.jpg": "/images/dasheri-mango.jpg",
  "anwar-ratol-mango.png": "/images/anwar-ratol-mango.jpg",
  "anwar-ratol-mango.jpg": "/images/anwar-ratol-mango.jpg",
  "chaunsa-hand-picked.png": "/images/chaunsa-hand-picked.jpg",
  "chaunsa-hand-picked.jpg": "/images/chaunsa-hand-picked.jpg",
  "e-royal-mango-logo.png": "/images/e-royal-mango-logo.png",
};

/** Benefits hero — local Chaunsa photo. */
export const BENEFITS_HERO_IMAGE = CATALOG_IMAGE_FALLBACKS["chaunsa-premium-variety.png"];

export const DEFAULT_PRODUCT_IMAGE = BENEFITS_HERO_IMAGE;

/** Resolve product/media URLs for display (uploads, catalog paths, remote). */
export function resolveMediaUrl(url: string): string {
  if (!url || !url.trim()) return DEFAULT_PRODUCT_IMAGE;
  if (/^https?:\/\//i.test(url)) {
    try {
      const parsed = new URL(url);
      if (parsed.pathname.startsWith("/images/")) {
        const file = parsed.pathname.split("/").pop() ?? "";
        if (CATALOG_IMAGE_FALLBACKS[file]) return CATALOG_IMAGE_FALLBACKS[file];
        return parsed.pathname;
      }
      if (parsed.pathname.startsWith("/uploads/")) {
        return `${API_ORIGIN}${parsed.pathname}`;
      }
    } catch {
      /* use full URL as-is */
    }
    return url;
  }
  if (url.startsWith("/uploads/")) return `${API_ORIGIN}${url}`;
  if (url.startsWith("/images/")) {
    const file = url.split("/").pop() ?? "";
    if (CATALOG_IMAGE_FALLBACKS[file]) return CATALOG_IMAGE_FALLBACKS[file];
    return url;
  }
  if (url.startsWith("/")) return url;
  return url;
}

/**
 * Blog featured images must match the admin selection exactly — no catalog remapping
 * or default product placeholders.
 */
export function resolveBlogMediaUrl(url: string | null | undefined): string {
  if (!url?.trim()) return "";

  const trimmed = url.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if (parsed.pathname.startsWith("/uploads/")) {
        return `${API_ORIGIN}${parsed.pathname}`;
      }
    } catch {
      /* use full URL as-is */
    }
    return trimmed;
  }

  if (trimmed.startsWith("/uploads/")) return `${API_ORIGIN}${trimmed}`;
  if (trimmed.startsWith("/images/")) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;

  return trimmed;
}
