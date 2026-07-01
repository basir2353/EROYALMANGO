"use client";

import { FormEvent, Suspense, useMemo, useRef, useState, type ComponentType } from "react";
import BlogPostImage from "@/components/blog/BlogPostImage";
import AppImage from "@/components/AppImage";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, useSpring } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  Filter,
  Mail,
  Search,
  Sparkles,
  Star,
  Tag,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { DEFAULT_SOCIAL_LINKS, SocialLinkIcon } from "@/lib/social-links";
import type { BlogPost } from "@/services/blog-posts";
import {
  countPostsByCategory,
  estimateReadingTime,
  filterPosts,
  formatPostDate,
  formatCategoryLabel,
  getAuthorLabel,
} from "@/components/blog/blog-utils";
import {
  formatPriceRange,
  formatShopPrice,
  getSaleBadgeLabel,
  hasActiveSale,
  shouldShowCompareAtPrice,
  shouldShowSaleBadge,
  type ShopProduct,
} from "@/services/shop-products";

const SOCIAL_LINKS = DEFAULT_SOCIAL_LINKS;

function PostMeta({
  post,
  className = "",
  variant = "default",
}: {
  post: BlogPost;
  className?: string;
  variant?: "default" | "hero";
}) {
  const metaClass =
    variant === "hero"
      ? "blog-hero-meta text-[var(--site-text-muted)]"
      : "text-white/55";

  return (
    <div className={`blog-post-meta-row flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm ${className}`}>
      <span className={`inline-flex items-center gap-1.5 ${metaClass}`}>
        <User className="h-3.5 w-3.5 text-gold-400/90" aria-hidden="true" />
        {getAuthorLabel(post)}
      </span>
      <span className={variant === "hero" ? "text-black/15" : "text-white/20"} aria-hidden="true">
        •
      </span>
      <span className={`inline-flex items-center gap-1.5 ${metaClass}`}>
        <Calendar className="h-3.5 w-3.5 text-gold-400/90" aria-hidden="true" />
        {formatPostDate(post.date)}
      </span>
      <span className={variant === "hero" ? "text-black/15" : "text-white/20"} aria-hidden="true">
        •
      </span>
      <span className={`inline-flex items-center gap-1.5 ${metaClass}`}>
        <Clock className="h-3.5 w-3.5 text-gold-400/90" aria-hidden="true" />
        {estimateReadingTime(post.excerpt)}
      </span>
    </div>
  );
}

function MagazineHero({ post }: { post: BlogPost }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, { stiffness: 220, damping: 34 });
  const rotateY = useSpring(0, { stiffness: 220, damping: 34 });
  const categoryLabel = formatCategoryLabel(post.category);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(x * 4);
    rotateX.set(-y * 4);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.section
      className="blog-magazine-hero relative mb-12 sm:mb-16"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        ref={frameRef}
        className="blog-magazine-hero-frame relative overflow-hidden rounded-[1.75rem] sm:rounded-[2rem]"
        style={{ perspective: 1600 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="blog-magazine-hero-split grid min-h-[360px] sm:min-h-[420px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:min-h-[520px]"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
          <div className="blog-magazine-hero-content order-2 flex flex-col justify-center p-6 sm:p-8 lg:order-1 lg:p-10 xl:p-12">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="blog-editorial-badge inline-flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5" aria-hidden="true" />
                Featured Story
              </span>
              {categoryLabel ? <span className="blog-category-pill">{categoryLabel}</span> : null}
            </div>

            <p className="blog-hero-kicker mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-500">
              E Royal Mango Journal
            </p>
            <h1
              className="blog-hero-title text-3xl font-semibold capitalize leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {post.title}
            </h1>
            <p className="blog-hero-excerpt mt-4 line-clamp-4 text-sm leading-relaxed sm:text-base sm:leading-relaxed">
              {post.excerpt}
            </p>
            <PostMeta post={post} variant="hero" className="mt-5" />
            <Link href={`/blog/${post.slug}`} className="blog-cta-btn mt-6 inline-flex w-fit">
              Read Featured Article
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          </div>

          <div className="blog-magazine-hero-media relative order-1 min-h-[280px] overflow-hidden sm:min-h-[360px] lg:order-2 lg:min-h-full">
            <BlogPostImage
              src={post.image}
              alt={post.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority
              quality={95}
              className="blog-magazine-hero-image object-cover object-center transition-transform duration-700 ease-out"
            />
            <div className="blog-magazine-hero-media-edge pointer-events-none absolute inset-0" aria-hidden="true" />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function FeaturedCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.article
      className="blog-featured-card group relative overflow-hidden rounded-2xl"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <BlogPostImage
            src={post.image}
            alt={post.alt}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="blog-featured-card-overlay absolute inset-0" />
          <span className="blog-category-pill absolute left-4 top-4">{post.category}</span>
        </div>
        <div className="blog-featured-card-body p-5 sm:p-6">
          <h3
            className="text-lg font-semibold leading-snug text-white transition-colors group-hover:text-gold-200 sm:text-xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {post.title}
          </h3>
          <PostMeta post={post} className="mt-3" />
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/50">{post.excerpt}</p>
          <span className="blog-read-more mt-4 inline-flex">
            Read Article
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

function TrendingCard({ post, rank }: { post: BlogPost; rank: number }) {
  return (
    <Link href={`/blog/${post.slug}`} className="blog-trending-card group flex min-w-[260px] gap-4 sm:min-w-[300px]">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28">
        <BlogPostImage
          src={post.image}
          alt={post.alt}
          fill
          sizes="112px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="blog-trending-rank absolute left-2 top-2">{rank}</span>
      </div>
      <div className="min-w-0 flex-1 py-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-400/80">{post.category}</p>
        <h4
          className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-white group-hover:text-gold-200 sm:text-base"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {post.title}
        </h4>
        <p className="mt-2 text-xs text-white/45">{estimateReadingTime(post.excerpt)}</p>
      </div>
    </Link>
  );
}

function MagazineGridCard({ post, index }: { post: BlogPost; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const rotateX = useSpring(0, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(x * 8);
    rotateX.set(-y * 8);
  };

  const resetTilt = () => {
    setHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.article
      className="blog-card-wrap relative"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1200 }}
    >
      <div className="blog-post-card group overflow-hidden">
        <motion.div
          ref={cardRef}
          className="blog-post-image-wrap relative"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={resetTilt}
        >
          <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10" aria-label={post.title}>
            <span className="sr-only">{post.title}</span>
          </Link>
          <BlogPostImage
            src={post.image}
            alt={post.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-transform duration-700 ${hovered ? "scale-[1.06]" : "scale-100"}`}
          />
          <div className="blog-post-image-overlay pointer-events-none absolute inset-0" />
          <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2">
            <span className="blog-category-pill">{post.category}</span>
          </div>
        </motion.div>
        <div className="relative p-5 sm:p-6">
          <h2
            className="text-xl font-semibold leading-snug text-white transition-colors group-hover:text-gold-200 sm:text-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h2>
          <PostMeta post={post} className="mt-3" />
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-white/55">{post.excerpt}</p>
          <Link href={`/blog/${post.slug}`} className="blog-cta-btn blog-cta-btn-outline mt-5 inline-flex">
            Continue Reading
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function SidebarPanel({
  title,
  icon: Icon,
  children,
  delay = 0,
}: {
  title: string;
  icon?: ComponentType<{ className?: string }>;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      className="blog-sidebar-panel"
      initial={{ opacity: 0, x: 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="blog-sidebar-panel-shine pointer-events-none absolute inset-0 rounded-[inherit]" aria-hidden="true" />
      <h2
        className="relative flex items-center gap-2 text-base font-semibold text-white sm:text-lg"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {Icon && <Icon className="h-4 w-4 text-gold-400/90" aria-hidden="true" />}
        {title}
      </h2>
      <div className="relative mt-4">{children}</div>
    </motion.div>
  );
}

function FeaturedProductCard({ product }: { product: ShopProduct }) {
  return (
    <Link href={`/products/${product.slug}`} className="blog-product-mini group flex gap-3 rounded-xl p-2 transition-colors hover:bg-white/[0.03]">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
        <AppImage
          src={product.image}
          alt={product.alt}
          fill
          sizes="64px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {shouldShowSaleBadge(product) && (
          <span className="shop-deal-badge absolute right-0.5 top-0.5 text-[9px]">
            {getSaleBadgeLabel(product)}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white group-hover:text-gold-200">{product.name}</p>
        <p className="mt-0.5 text-xs text-white/45">
          {shouldShowCompareAtPrice(product) && (
            <span className="mr-1.5 line-through">{formatShopPrice(product.compareAtPrice)}</span>
          )}
          {formatPriceRange(product)}
        </p>
      </div>
    </Link>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className="rounded-xl border border-gold-400/25 bg-gold-400/10 px-4 py-3 text-sm text-gold-200">
        Thank you for subscribing. Orchard updates are on the way.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm leading-relaxed text-white/50">
        Get seasonal offers, harvest updates, and premium mango stories in your inbox.
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="blog-search-input"
        aria-label="Email for newsletter"
      />
      <button type="submit" className="blog-search-btn">
        <Mail className="h-4 w-4" />
        Subscribe
      </button>
    </form>
  );
}

export default function BlogPage(props: {
  posts: BlogPost[];
  categories: string[];
  archives: { label: string; slug: string }[];
  hottestDeals: string[];
  sidebarProducts: ShopProduct[];
}) {
  return (
    <Suspense
      fallback={
        <div className="blog-section flex min-h-[50vh] items-center justify-center px-5 py-24">
          <p className="text-sm text-white/50">Loading blog…</p>
        </div>
      }
    >
      <BlogPageContent {...props} />
    </Suspense>
  );
}

function BlogPageContent({
  posts,
  categories,
  archives,
  hottestDeals,
  sidebarProducts,
}: {
  posts: BlogPost[];
  categories: string[];
  archives: { label: string; slug: string }[];
  hottestDeals: string[];
  sidebarProducts: ShopProduct[];
}) {
  const searchParams = useSearchParams();
  const archiveSlug = searchParams.get("archive");

  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [categoryFilter, setCategoryFilter] = useState(
    () => searchParams.get("category") ?? "all",
  );

  const clearFilters = () => {
    setQuery("");
    setCategoryFilter("all");
  };

  const popularCategories = useMemo(() => countPostsByCategory(posts), [posts]);

  const filteredPosts = useMemo(
    () => filterPosts(posts, { query, category: categoryFilter, archiveSlug }),
    [posts, query, categoryFilter, archiveSlug],
  );

  const isFiltering = Boolean(query.trim() || categoryFilter !== "all" || archiveSlug);

  const featuredPost = posts[0] ?? null;
  const featuredGridPosts = posts.slice(1, 4);
  const trendingPosts = useMemo(
    () => [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4),
    [posts],
  );

  const heroFeaturedIds = new Set([
    ...(featuredPost ? [featuredPost.id] : []),
    ...featuredGridPosts.map((p) => p.id),
  ]);
  const gridPosts = isFiltering
    ? filteredPosts
    : filteredPosts.filter((p) => !heroFeaturedIds.has(p.id));

  const sidebarRecentPosts = isFiltering ? filteredPosts.slice(0, 5) : posts.slice(0, 5);

  const featuredProducts = useMemo(() => {
    const bySlug = new Map(sidebarProducts.map((p) => [p.slug, p]));
    const fromDeals = hottestDeals.map((id) => bySlug.get(id)).filter(Boolean) as ShopProduct[];
    const extras = sidebarProducts.filter((p) => !fromDeals.some((d) => d.slug === p.slug)).slice(0, 2);
    return [...fromDeals, ...extras].slice(0, 4);
  }, [hottestDeals, sidebarProducts]);

  const showHero = !isFiltering && featuredPost && filteredPosts.some((p) => p.id === featuredPost.id);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section className="blog-section relative overflow-hidden pb-24 pt-8 sm:pb-32 sm:pt-10 lg:pb-40">
      <div className="blog-section-glow pointer-events-none absolute inset-0" />
      <div className="blog-section-orb blog-section-orb-a pointer-events-none absolute" aria-hidden="true" />
      <div className="blog-section-orb blog-section-orb-b pointer-events-none absolute" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/45"
        >
          <Link href="/" className="transition-colors hover:text-gold-300">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-white/25" aria-hidden="true" />
          <span className="text-gold-300/80">Blog</span>
        </nav>

        {showHero && featuredPost && (
          <MagazineHero post={featuredPost} />
        )}

        {/* Search & filters */}
        <motion.form
          className="blog-toolbar mb-10 rounded-2xl p-4 sm:p-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={handleSearchSubmit}
          role="search"
          aria-label="Search blog articles"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="blog-search-icon pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, topics, categories..."
                className="blog-search-input blog-search-input-lg pl-11 pr-10"
                aria-label="Search blog articles"
              />
              {query.trim() ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="blog-search-clear absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="blog-toolbar-label inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
                <Filter className="h-3.5 w-3.5" aria-hidden="true" />
                Filter
              </span>
              <button
                type="button"
                onClick={() => setCategoryFilter("all")}
                className={`blog-filter-chip ${categoryFilter === "all" ? "blog-filter-chip-active" : ""}`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`blog-filter-chip ${categoryFilter === cat ? "blog-filter-chip-active" : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          {(archiveSlug || isFiltering) && (
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              {isFiltering ? (
                <p className="text-gold-300/80">
                  {filteredPosts.length} result{filteredPosts.length === 1 ? "" : "s"}
                  {query.trim() ? ` for “${query.trim()}”` : ""}
                  {categoryFilter !== "all" ? ` in ${categoryFilter}` : ""}
                </p>
              ) : null}
              {archiveSlug ? (
                <p className="text-gold-300/80">
                  Archive: {archives.find((a) => a.slug === archiveSlug)?.label ?? archiveSlug}
                </p>
              ) : null}
              {isFiltering ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="font-medium text-gold-400 underline underline-offset-2 hover:text-gold-300"
                >
                  Clear all filters
                </button>
              ) : null}
            </div>
          )}
        </motion.form>

        {/* Popular categories */}
        {popularCategories.length > 0 && !isFiltering && (
          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-400/80">Explore</p>
                <h2
                  className="mt-1 text-2xl font-semibold text-white sm:text-3xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Popular Categories
                </h2>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {popularCategories.map(({ name, count }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setCategoryFilter(name)}
                  className={`blog-category-highlight ${categoryFilter === name ? "blog-category-highlight-active" : ""}`}
                >
                  <span>{name}</span>
                  <span className="blog-category-count">{count}</span>
                </button>
              ))}
            </div>
          </motion.section>
        )}

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-12">
          <div className="min-w-0 space-y-12 sm:space-y-14">
            {/* Featured articles */}
            {featuredGridPosts.length > 0 && !isFiltering && (
              <section>
                <div className="mb-6 flex items-center gap-2">
                  <Star className="h-5 w-5 text-gold-400" aria-hidden="true" />
                  <h2
                    className="text-2xl font-semibold text-white sm:text-3xl"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Featured Articles
                  </h2>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {featuredGridPosts.map((post, index) => (
                    <FeaturedCard key={post.id} post={post} index={index} />
                  ))}
                </div>
              </section>
            )}

            {/* Trending */}
            {trendingPosts.length > 0 && !isFiltering && (
              <section>
                <div className="mb-5 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-gold-400" aria-hidden="true" />
                  <h2
                    className="text-2xl font-semibold text-white sm:text-3xl"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Trending Posts
                  </h2>
                </div>
                <div className="blog-trending-track flex gap-4 overflow-x-auto pb-2">
                  {trendingPosts.map((post, i) => (
                    <TrendingCard key={post.id} post={post} rank={i + 1} />
                  ))}
                </div>
              </section>
            )}

            {/* Main grid */}
            <section>
              <div className="mb-6 flex items-center justify-between gap-4">
                <h2
                  className="text-2xl font-semibold text-white sm:text-3xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {isFiltering ? "Search Results" : "Latest Articles"}
                </h2>
                <span className="text-sm text-white/40">{filteredPosts.length} results</span>
              </div>

              {filteredPosts.length === 0 ? (
                <div className="blog-empty-state rounded-2xl px-6 py-16 text-center">
                  <BookOpen className="mx-auto h-10 w-10 text-gold-400/60" aria-hidden="true" />
                  <p className="mt-4 text-lg font-medium text-white">No articles found</p>
                  <p className="mt-2 text-sm text-white/45">Try adjusting your search or filters.</p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="blog-cta-btn mt-6 inline-flex"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {gridPosts.map((post, index) => (
                    <MagazineGridCard key={post.id} post={post} index={index} />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <SidebarPanel title="Recent Posts" icon={BookOpen} delay={0.05}>
              <ul className="space-y-3">
                {sidebarRecentPosts.map((post) => (
                  <li key={post.id}>
                    <Link href={`/blog/${post.slug}`} className="blog-sidebar-link group block">
                      <span className="line-clamp-2 group-hover:text-gold-300">{post.title}</span>
                      <span className="mt-1 block text-[11px] text-white/35">{formatPostDate(post.date)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </SidebarPanel>

            <SidebarPanel title="Categories" icon={Tag} delay={0.1}>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      type="button"
                      onClick={() => setCategoryFilter(category)}
                      className="blog-sidebar-link w-full text-left"
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </SidebarPanel>

            <SidebarPanel title="Archives" icon={Calendar} delay={0.15}>
              <ul className="space-y-2">
                {archives.map((archive) => (
                  <li key={archive.slug}>
                    <Link href={`/blog?archive=${archive.slug}`} className="blog-sidebar-link">
                      {archive.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </SidebarPanel>

            <SidebarPanel title="Featured Products" icon={Sparkles} delay={0.2}>
              <div className="space-y-1">
                {featuredProducts.map((product) => (
                  <FeaturedProductCard key={product.slug} product={product} />
                ))}
              </div>
              <Link href="/shop" className="blog-read-more mt-4 inline-flex text-xs">
                View all products
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
              </Link>
            </SidebarPanel>

            <SidebarPanel title="Newsletter" icon={Mail} delay={0.25}>
              <NewsletterForm />
            </SidebarPanel>

            <SidebarPanel title="Follow Us" delay={0.3}>
              <div className="flex flex-wrap gap-2">
                {SOCIAL_LINKS.map(({ href, label, icon, filled }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="blog-social-btn"
                    aria-label={label}
                  >
                    <SocialLinkIcon icon={icon} filled={filled} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </SidebarPanel>
          </aside>
        </div>
      </div>
    </section>
  );
}
