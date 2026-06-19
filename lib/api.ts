const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://eroyal-backend-production.up.railway.app/api"
    : "http://localhost:4000/api");

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

async function parseJsonResponse<T>(res: Response): Promise<T | null> {
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  const text = await res.text();
  if (!text.trim()) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

async function fetchApi<T>(
  path: string,
  init?: RequestInit & { fresh?: boolean },
): Promise<T | null> {
  try {
    const { fresh, ...rest } = init ?? {};
    const res = await fetch(`${API_URL}${path}`, {
      ...rest,
      ...(fresh
        ? { cache: "no-store" as const }
        : rest.method
          ? {}
          : { next: { revalidate: 60 } }),
    });
    if (!res.ok) return null;

    const json = await parseJsonResponse<ApiResponse<T>>(res);
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export type ApiPostResult<T> = {
  data: T | null;
  error: string | null;
};

export async function postApi<T>(
  path: string,
  body: unknown,
): Promise<ApiPostResult<T>> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await parseJsonResponse<{
      success?: boolean;
      message?: string;
      data?: T;
    }>(res);

    if (!json) {
      return {
        data: null,
        error: "Invalid response from server. Please try again.",
      };
    }

    if (!res.ok) {
      return {
        data: null,
        error: json.message ?? "Request failed. Please try again.",
      };
    }

    return { data: json.data ?? null, error: null };
  } catch {
    return {
      data: null,
      error:
        "Could not connect to the server. Make sure the API is running on port 4000.",
    };
  }
}

export interface CmsHero {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle?: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage?: string;
  mobileBackgroundImage?: string;
  inlineStats?: { value: string; label: string }[];
  isVisible: boolean;
}

export interface CmsBenefits {
  sectionTitle?: string;
  sectionSubtitle?: string;
  heroImage?: string;
  cards: { icon?: string; image?: string; title: string; description: string; sortOrder?: number }[];
  isVisible: boolean;
}

export interface CmsGallery {
  sectionTitle?: string;
  sectionSubtitle?: string;
  items: { image: string; alt: string; category: string; sortOrder?: number }[];
  isVisible: boolean;
}

export interface CmsPromo {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage?: string;
  isVisible: boolean;
}

export interface CmsStats {
  customersCommunity: string;
  satisfactionRate: string;
  yearsInBusiness: string;
  countriesShipped: string;
  isVisible: boolean;
}

export interface CmsContactCta {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  isVisible: boolean;
}

export interface AboutContent {
  storyTitle?: string;
  storyParagraphs?: string[];
  heroImage?: string;
  services?: { title: string; description: string }[];
  exportProcess?: { title: string; points: string[] };
  packagingProcess?: { title: string; points: string[] };
  features?: string[];
  isVisible?: boolean;
}

export interface ContactPageContent {
  intro?: string;
  address?: string;
  mapEmbedUrl?: string;
  isVisible?: boolean;
}

export interface PublicCms {
  hero?: CmsHero;
  benefits?: CmsBenefits;
  gallery?: CmsGallery;
  promo?: CmsPromo;
  stats?: CmsStats;
  contactCta?: CmsContactCta;
  about?: AboutContent;
  contactPage?: ContactPageContent;
}

export interface WebsiteSettings {
  siteName: string;
  logo?: string;
  favicon?: string;
  contactPhone?: string;
  contactEmail?: string;
  whatsapp?: string;
  address?: string;
  footerContent?: string;
  copyrightText?: string;
  socialLinks?: { platform: string; url: string }[] | Record<string, string>;
}

export interface PublicSettings {
  website: WebsiteSettings;
  payments: Record<string, unknown>;
  shipping: Record<string, unknown>;
}

export type ApiProduct = Record<string, unknown>;

export async function getPublicCms(): Promise<PublicCms | null> {
  return fetchApi<PublicCms>("/public/cms");
}

export async function getPublicAbout(): Promise<AboutContent | null> {
  return fetchApi<AboutContent>("/public/about");
}

export async function getPublicSettings(): Promise<PublicSettings | null> {
  return fetchApi<PublicSettings>("/public/settings");
}

export async function getPublicProducts(params?: Record<string, string>): Promise<ApiProduct[]> {
  const qs = params ? `?${new URLSearchParams(params)}` : "";
  const data = await fetchApi<ApiProduct[]>(`/public/products${qs}`, { fresh: true });
  return data ?? [];
}

export async function getPublicProductBySlug(slug: string): Promise<ApiProduct | null> {
  return fetchApi<ApiProduct>(`/public/products/${slug}`, { fresh: true });
}

export async function getPublicCategories(): Promise<Record<string, unknown>[]> {
  const data = await fetchApi<Record<string, unknown>[]>("/public/categories");
  return data ?? [];
}

export async function getPublicFaq(): Promise<Record<string, unknown>[]> {
  const data = await fetchApi<Record<string, unknown>[]>("/public/faq");
  return data ?? [];
}

export async function getPublicBlogs(
  page = 1,
  limit = 20,
  options?: { fresh?: boolean },
) {
  const data = await fetchApi<{ items: Record<string, unknown>[]; pagination: Record<string, number> }>(
    `/public/blogs?page=${page}&limit=${limit}`,
    options?.fresh ? { fresh: true } : undefined,
  );
  return data ?? { items: [], pagination: { page, limit, total: 0 } };
}

export async function getPublicBlogBySlug(slug: string, options?: { fresh?: boolean }) {
  return fetchApi<Record<string, unknown>>(
    `/public/blogs/${slug}`,
    options?.fresh ? { fresh: true } : undefined,
  );
}

export async function getPublicTestimonials(): Promise<Record<string, unknown>[]> {
  const data = await fetchApi<Record<string, unknown>[]>("/public/testimonials");
  return data ?? [];
}

export async function submitContactForm(body: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  return postApi<Record<string, unknown>>("/public/contact", body);
}

export async function submitOrder(body: Record<string, unknown>) {
  return postApi<Record<string, unknown>>("/public/orders", body);
}
