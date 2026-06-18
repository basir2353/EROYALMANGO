import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostDetail from "@/components/blog/BlogPostDetail";
import { getPublicBlogBySlug } from "@/lib/api";
import { fetchBlogPosts, mapApiBlogToPost } from "@/services/content";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await fetchBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const raw = await getPublicBlogBySlug(slug, { fresh: true });
  const post = raw ? mapApiBlogToPost(raw) : null;

  if (!post) {
    return { title: "Post Not Found | E Royal Mango" };
  }

  return {
    title: `${post.title} | E Royal Mango Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const raw = await getPublicBlogBySlug(slug, { fresh: true });

  if (!raw) {
    notFound();
  }

  const post = mapApiBlogToPost(raw);
  const contentHtml = String(raw.content ?? post.excerpt);
  const allPosts = await fetchBlogPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <main>
      <BlogPostDetail post={post} contentHtml={contentHtml} relatedPosts={relatedPosts} />
    </main>
  );
}
