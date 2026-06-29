import type { AboutContent, ContactPageContent } from "@/lib/api";
import { getPublicBlogs, getPublicFaq, getPublicSettings } from "@/lib/api";
import { resolveBlogMediaUrl } from "@/lib/media";
import type { BlogPost } from "@/services/blog-posts";
import type { FaqCategory } from "@/services/faq-data";

const CATEGORY_IMAGES: Record<string, string> = {
  Shipping: "/images/dasheri-mango.png",
  Returns: "/images/chaunsa-premium-variety.png",
  Products: "/images/anwar-ratol-mango.png",
  General: "/images/chaunsa-mango-premium.png",
  Warranty: "/images/chaunsa-premium-variety.png",
  "Returns & Exchanges": "/images/dasheri-mango.png",
};

export function mapApiFaqsToCategories(raw: Record<string, unknown>[]): FaqCategory[] {
  const grouped = new Map<string, FaqCategory>();

  for (const item of raw) {
    const categoryName = String(item.category ?? "General");
    const id = String(item._id ?? item.id ?? item.question);
    const faqItem = {
      id,
      question: String(item.question ?? ""),
      answer: String(item.answer ?? ""),
    };

    if (!grouped.has(categoryName)) {
      grouped.set(categoryName, {
        id: categoryName.toLowerCase().replace(/\s+/g, "-"),
        title: categoryName,
        image: CATEGORY_IMAGES[categoryName] ?? "/images/chaunsa-premium-variety.png",
        alt: `${categoryName} — FAQ`,
        defaultOpenId: id,
        items: [],
      });
    }

    grouped.get(categoryName)!.items.push(faqItem);
  }

  return Array.from(grouped.values());
}

export function mapApiBlogToPost(raw: Record<string, unknown>): BlogPost {
  const publishedAt = raw.publishedAt ? new Date(String(raw.publishedAt)) : null;
  const createdAt = raw.createdAt ? new Date(String(raw.createdAt)) : new Date();
  const displayDate = publishedAt && !Number.isNaN(publishedAt.getTime()) ? publishedAt : createdAt;

  return {
    id: String(raw._id ?? raw.id ?? raw.slug),
    slug: String(raw.slug),
    title: String(raw.title ?? ""),
    excerpt: String(raw.excerpt ?? ""),
    image: resolveBlogMediaUrl(
      raw.featuredImage != null ? String(raw.featuredImage) : "",
    ),
    alt: String(raw.title ?? "Blog post"),
    category: String(raw.category ?? raw.categoryName ?? "General"),
    authorEmail: String(raw.authorEmail ?? "info@eroyalmango.com"),
    date: displayDate.toISOString().slice(0, 10),
  };
}

export async function fetchBlogPosts(limit = 20): Promise<BlogPost[]> {
  const data = await getPublicBlogs(1, limit, { fresh: true });
  return (data.items ?? []).map(mapApiBlogToPost);
}

export async function fetchFaqCategories(): Promise<FaqCategory[]> {
  const raw = await getPublicFaq();
  return mapApiFaqsToCategories(raw);
}

export function buildContactDetails(settings: Awaited<ReturnType<typeof getPublicSettings>>) {
  const website = settings?.website;
  const phone = website?.contactPhone ?? "+92 307 3970850";
  const email = website?.contactEmail ?? "info@eroyalmango.com";
  const address = website?.address ?? "Multan, Punjab, Pakistan";
  const phoneDigits = phone.replace(/\D/g, "");

  return [
    {
      label: "Email",
      value: email,
      href: `mailto:${email}`,
    },
    {
      label: "Phone",
      value: phone,
      href: `https://wa.me/${phoneDigits}`,
    },
    {
      label: "Origin",
      value: address,
      href: `https://maps.google.com/?q=${encodeURIComponent(address)}`,
    },
  ] as const;
}

export type AboutPageContent = AboutContent & {
  planningPoints?: { title: string; description: string }[];
};

export function mapAboutContent(raw: AboutContent | null): AboutPageContent {
  const features = raw?.features ?? [];
  return {
    ...raw,
    planningPoints:
      features.length >= 2
        ? features.slice(0, 2).map((f, i) => ({
            title: f,
            description:
              i === 0
                ? "We use secure checkout and trusted payment partners so your information stays protected."
                : "Seasonal promotions and bundle offers reward our loyal mango lovers every harvest.",
          }))
        : undefined,
  };
}

export type ContactPageProps = {
  intro?: string;
  mapEmbedUrl?: string;
  contactDetails: ReturnType<typeof buildContactDetails>;
  pageContent?: ContactPageContent | null;
};

export async function fetchContactPageProps(): Promise<ContactPageProps> {
  const settings = await getPublicSettings();
  return {
    intro: settings?.website?.footerContent,
    contactDetails: buildContactDetails(settings),
    pageContent: null,
  };
}
