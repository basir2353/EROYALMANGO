import type { Metadata } from "next";
import BlogPage from "@/components/blog/BlogPage";
import {
  fetchCatalogProducts,
  fetchHottestDeals,
} from "@/services/catalog";
import { fetchBlogPosts } from "@/services/content";

export const metadata: Metadata = {
  title: "Blog | E Royal Mango",
  description:
    "Read stories about Chaunsa, orchard heritage, and the history of E Royal Mango — Pakistan's premium mango export brand.",
};

function buildArchives(posts: Awaited<ReturnType<typeof fetchBlogPosts>>) {
  const seen = new Set<string>();
  return posts
    .map((post) => {
      const date = new Date(post.date);
      const slug = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const label = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      return { slug, label };
    })
    .filter((entry) => {
      if (seen.has(entry.slug)) return false;
      seen.add(entry.slug);
      return true;
    });
}

export const dynamic = "force-dynamic";

export default async function BlogRoutePage() {
  const [posts, products, hottestDeals] = await Promise.all([
    fetchBlogPosts(),
    fetchCatalogProducts(),
    fetchHottestDeals(),
  ]);

  const categories = [...new Set(posts.map((post) => post.category))];

  return (
    <main>
      <BlogPage
        posts={posts}
        categories={categories.length ? categories : ["General"]}
        archives={buildArchives(posts)}
        hottestDeals={hottestDeals}
        sidebarProducts={products}
      />
    </main>
  );
}
