"use client";

import { useRef } from "react";
import BlogPostImage from "@/components/blog/BlogPostImage";
import AppImage from "@/components/AppImage";
import Link from "next/link";
import { motion, useSpring } from "framer-motion";
import { ArrowLeft, Calendar, ChevronRight, Mail, Tag } from "lucide-react";
import type { BlogPost } from "@/services/blog-posts";

function formatPostDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function BlogHero3D({ post }: { post: BlogPost }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, { stiffness: 260, damping: 32 });
  const rotateY = useSpring(0, { stiffness: 260, damping: 32 });
  const shadowX = useSpring(0, { stiffness: 260, damping: 32 });
  const shadowY = useSpring(14, { stiffness: 260, damping: 32 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(x * 10);
    rotateX.set(-y * 10);
    shadowX.set(x * 20);
    shadowY.set(14 + y * 12);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    shadowX.set(0);
    shadowY.set(14);
  };

  return (
    <div className="blog-hero-3d-wrap relative" style={{ perspective: 1400 }}>
      <motion.div
        className="blog-hero-shadow pointer-events-none absolute -bottom-5 left-[8%] right-[8%] h-12 rounded-[50%]"
        style={{ x: shadowX, y: shadowY }}
      />
      <motion.div
        ref={frameRef}
        className="blog-hero-3d relative overflow-hidden rounded-[1.75rem] sm:rounded-[2rem]"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="blog-hero-shine pointer-events-none absolute inset-0 z-10" aria-hidden="true" />
        <div className="relative aspect-[16/9] sm:aspect-[21/9]">
          <BlogPostImage
            src={post.image}
            alt={post.alt}
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover"
            priority
          />
          <div className="blog-hero-image-overlay pointer-events-none absolute inset-0" />
          <div className="absolute bottom-4 left-4 z-20 flex flex-wrap gap-2 sm:bottom-6 sm:left-6">
            <span className="blog-category-pill">{post.category}</span>
            <span className="blog-date-pill inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              {formatPostDate(post.date)}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function BlogPostDetail({
  post,
  contentHtml,
  relatedPosts,
}: {
  post: BlogPost;
  contentHtml: string;
  relatedPosts: BlogPost[];
}) {
  return (
    <section className="blog-section relative overflow-hidden pb-24 pt-8 sm:pb-32 sm:pt-10 lg:pb-40">
      <div className="blog-section-glow pointer-events-none absolute inset-0" />
      <div className="blog-section-orb blog-section-orb-a pointer-events-none absolute" aria-hidden="true" />
      <div className="blog-section-orb blog-section-orb-b pointer-events-none absolute" aria-hidden="true" />

      <article className="relative mx-auto max-w-4xl px-5 sm:px-8 lg:px-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/45"
        >
          <Link href="/" className="transition-colors hover:text-gold-300">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-white/25" aria-hidden="true" />
          <Link href="/blog" className="transition-colors hover:text-gold-300">
            Blog
          </Link>
          <ChevronRight className="h-4 w-4 text-white/25" aria-hidden="true" />
          <span className="line-clamp-1 text-gold-300/80">{post.title}</span>
        </nav>

        <motion.header
          className="mb-8 sm:mb-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-400/80">
            E Royal Mango Journal
          </p>
          <h1
            className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/50">
            <span className="inline-flex items-center gap-2">
              <Tag className="h-4 w-4 text-gold-400/80" aria-hidden="true" />
              {post.category}
            </span>
            <span className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4 text-gold-400/80" aria-hidden="true" />
              <a href={`mailto:${post.authorEmail}`} className="blog-meta-link transition-colors hover:text-gold-300">
                {post.authorEmail}
              </a>
            </span>
          </div>
        </motion.header>

        <BlogHero3D post={post} />

        <motion.div
          className="blog-article-body mt-10 sm:mt-12"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="blog-prose"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </motion.div>

        <motion.div
          className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <Link href="/blog" className="blog-read-more inline-flex">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            Back to Blog
          </Link>
        </motion.div>

        {relatedPosts.length > 0 && (
          <motion.aside
            className="mt-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2
              className="mb-6 text-xl font-semibold text-white sm:text-2xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              More Stories
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="blog-related-card group block overflow-hidden rounded-2xl"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <BlogPostImage
                      src={related.image}
                      alt={related.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 320px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="blog-related-overlay absolute inset-0" />
                  </div>
                  <div className="p-4 sm:p-5">
                    <p className="text-sm font-semibold leading-snug text-white transition-colors group-hover:text-gold-200">
                      {related.title}
                    </p>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/45">
                      {related.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.aside>
        )}
      </article>
    </section>
  );
}
