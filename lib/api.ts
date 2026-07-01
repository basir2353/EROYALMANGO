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
  init?: RequestInit & { fresh?: boolean; revalidate?: number },
): Promise<T | null> {
  try {
    const { fresh, revalidate, ...rest } = init ?? {};
    const res = await fetch(`${API_URL}${path}`, {
      ...rest,
      ...(fresh
        ? { cache: "no-store" as const }
        : rest.method
          ? {}
          : { next: { revalidate: revalidate ?? 60 } }),
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

export interface CarouselSlide {
  id: string;
  image: string;
  alt: string;
  link: string;
  sortOrder: number;
  isActive: boolean;
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
  slides?: CarouselSlide[];
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
  announcementBarEnabled?: boolean;
  announcementMessages?: string[];
}

export interface PublicSettings {
  website: WebsiteSettings;
  payments: PublicPaymentSettings;
  shipping: Record<string, unknown>;
}

export interface PublicPaymentSettings {
  cashOnDelivery?: boolean;
  easyPaisa?: boolean;
  jazzCash?: boolean;
  bankTransfer?: boolean;
  jazzCashAccount?: string;
  easyPaisaAccount?: string;
  bankName?: string;
  bankAccountTitle?: string;
  bankAccountNumber?: string;
  bankIban?: string;
  bankDetails?: string;
  paymentInstructions?: string;
}

export type ApiProduct = Record<string, unknown>;

export async function getPublicCms(options?: { fresh?: boolean }): Promise<PublicCms | null> {
  const fresh = options?.fresh ?? process.env.NODE_ENV === "development";
  return fetchApi<PublicCms>("/public/cms", fresh ? { fresh: true } : { revalidate: 5 });
}

export async function fetchPublicCmsFresh(): Promise<PublicCms | null> {
  return fetchApi<PublicCms>("/public/cms", { fresh: true });
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
  return postApi<Record<string, unknown> & {
    id?: string;
    orderNumber?: string;
    emailConfirmationSent?: boolean;
    requiresPaymentReceipt?: boolean;
    total?: number;
  }>("/public/orders", body);
}

export async function uploadPaymentReceipt(
  orderId: string,
  email: string,
  file: File,
): Promise<ApiPostResult<Record<string, unknown> & { emailConfirmationSent?: boolean }>> {
  try {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("receipt", file);

    const res = await fetch(`${API_URL}/public/orders/${orderId}/payment-receipt`, {
      method: "POST",
      body: formData,
    });

    const json = await parseJsonResponse<{
      success?: boolean;
      message?: string;
      data?: Record<string, unknown> & { emailConfirmationSent?: boolean };
    }>(res);

    if (!json) {
      return { data: null, error: "Invalid response from server. Please try again." };
    }

    if (!res.ok) {
      return { data: null, error: json.message ?? "Could not upload receipt." };
    }

    return { data: json.data ?? null, error: null };
  } catch {
    return {
      data: null,
      error: "Could not connect to the server. Make sure the API is running on port 4000.",
    };
  }
}
