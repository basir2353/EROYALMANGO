import type { BlogPost } from "@/services/blog-posts";

export function formatPostDate(date: string, style: "short" | "long" = "short") {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    month: style === "long" ? "long" : "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Estimate reading time from excerpt (~200 wpm). */
export function estimateReadingTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export function getAuthorLabel(_post: BlogPost) {
  return "E Royal Mango";
}

/** Hide placeholder categories on cards and hero badges. */
export function formatCategoryLabel(category: string | undefined | null) {
  if (!category) return null;
  const normalized = category.trim().toLowerCase();
  if (normalized === "uncategorized" || normalized === "general") return null;
  return category;
}

export function countPostsByCategory(posts: BlogPost[]) {
  const counts = new Map<string, number>();
  for (const post of posts) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function filterPosts(
  posts: BlogPost[],
  options: {
    query: string;
    category: string;
    archiveSlug: string | null;
  },
) {
  const q = options.query.trim().toLowerCase();
  return posts.filter((post) => {
    if (options.category !== "all" && post.category !== options.category) return false;
    if (options.archiveSlug) {
      const d = new Date(post.date);
      const slug = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (slug !== options.archiveSlug) return false;
    }
    if (!q) return true;

    const haystack = [
      post.title,
      post.excerpt,
      post.category,
      post.slug.replace(/-/g, " "),
      getAuthorLabel(post),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}
