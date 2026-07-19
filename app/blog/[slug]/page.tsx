import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleBody } from "@/components/blog/article-body";
import { BookingCard } from "@/components/blog/booking-card";
import { CoverImage } from "@/components/blog/cover-image";
import { PostTags } from "@/components/blog/post-tags";
import { ReadingAside } from "@/components/blog/reading-aside";
import { RelatedPosts } from "@/components/blog/related-posts";
import { CtaBand } from "@/components/sections/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import {
  extractHeadings,
  formatPostDate,
  getPost,
  getPosts,
  readingTimeMinutes,
  toAbsoluteUrl,
} from "@/lib/blog";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/schema";
import { SITE } from "@/lib/site";

/** ISR: article HTML rebuilds at most once a minute, matching the data layer. */
export const revalidate = 60;

const RELATED_COUNT = 3;

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { data } = await getPosts({ limit: 50 });
  return data.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Story not found", robots: { index: false } };
  }

  const url = `${SITE.url}/blog/${post.slug}`;
  const description = post.metaDescription ?? post.excerpt ?? undefined;

  // og:image / twitter:image are generated per-post by ./opengraph-image.tsx.
  return {
    title: post.metaTitle ?? post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const toc = extractHeadings(post.content);
  const readMinutes = readingTimeMinutes(post.content);
  const publishedLabel = formatPostDate(post.publishedAt);
  const primaryTag = post.tags[0]?.slug;

  // Sibling stories: prefer the same topic, then fall back to recency.
  const { data: pool } = await getPosts({
    tag: primaryTag,
    limit: RELATED_COUNT + 1,
  });
  const related = pool
    .filter((p) => p.slug !== post.slug)
    .slice(0, RELATED_COUNT);

  const ogImage = toAbsoluteUrl(post.ogImageUrl ?? post.coverImageUrl);

  return (
    <>
      <JsonLd
        graph={[
          blogPostingSchema(post, ogImage),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Journal", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      {/* Full-bleed cover hero */}
      <header className="relative isolate flex min-h-[58svh] items-end overflow-hidden bg-emerald md:min-h-[68svh]">
        <CoverImage
          src={post.coverImageUrl}
          alt={post.title}
          sizes="100vw"
          priority
          className="-z-10"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-foreground/92 via-foreground/62 to-foreground/40"
        />

        <div className="main-container pb-12 pt-28 [text-shadow:0_1px_20px_#14181459] md:pb-16 md:pt-32">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-caption font-medium uppercase tracking-label text-background/80 transition-colors hover:text-background"
          >
            <ArrowLeft className="size-3.5" />
            The Journal
          </Link>

          <PostTags tags={post.tags} tone="dark" className="mt-6 text-gold" />

          <h1 className="mt-4 max-w-[20ch] font-heading text-h1 font-light text-balance text-background">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-background/80">
            {publishedLabel && (
              <time dateTime={post.publishedAt ?? undefined}>
                {publishedLabel}
              </time>
            )}
            <span aria-hidden className="text-background/40">
              ·
            </span>
            <span>{readMinutes} min read</span>
          </div>
        </div>
      </header>

      {/* Body + reading aside */}
      <div className="main-container py-16 md:py-20">
        <div className="lg:grid lg:grid-cols-[minmax(0,40rem)_17rem] lg:justify-center lg:gap-x-16 xl:gap-x-20">
          <article className="min-w-0 max-w-[40rem]">
            {post.excerpt && (
              <p className="mb-10 border-b border-border pb-10 font-heading text-lead font-light leading-relaxed text-foreground/80">
                {post.excerpt}
              </p>
            )}

            <ArticleBody content={post.content} />

            <footer className="mt-14 border-t border-border pt-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <PostTags tags={post.tags} asLinks />
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-caption font-medium uppercase tracking-label text-primary transition-colors hover:text-primary/80"
                >
                  <ArrowLeft className="size-3.5" />
                  All stories
                </Link>
              </div>
            </footer>

            {/* Inline invitation for readers without the sticky aside. */}
            <BookingCard className="mt-12 lg:hidden" />
          </article>

          <ReadingAside toc={toc} />
        </div>
      </div>

      <RelatedPosts posts={related} />

      <CtaBand
        title="Come see it for yourself."
        body="Book a private viewing and we'll walk you through the homes and amenities — on-site or live over Google Meet, at your pace."
      />
    </>
  );
}
