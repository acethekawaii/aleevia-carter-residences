import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { FeaturedPost } from "@/components/blog/featured-post";
import { PostCard } from "@/components/blog/post-card";
import { TagFilter } from "@/components/blog/tag-filter";
import { CtaBand } from "@/components/sections/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import { CtaLink } from "@/components/ui/cta-link";
import { Kicker } from "@/components/ui/kicker";
import { Reveal } from "@/components/ui/reveal";
import {
  getPost,
  getPosts,
  getTags,
  readingTimeMinutes,
  type Tag,
} from "@/lib/blog";
import { breadcrumbSchema } from "@/lib/schema";
import { CONTACT } from "@/lib/site";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Design notes, neighbourhood guides, and a closer look at life inside Aleevia Carter Residences.",
  alternates: { canonical: "/blog" },
};

type BlogPageProps = {
  searchParams: Promise<{ tag?: string; page?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { tag, page: pageParam } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);

  const [{ data: posts, meta }, tags] = await Promise.all([
    getPosts({ tag, page, limit: PAGE_SIZE }),
    getTags(),
  ]);

  const isDefaultView = !tag && page === 1;
  const activeTagName = tag
    ? (tags.find((t) => t.slug === tag)?.name ?? tag)
    : undefined;

  // Lead the default view with an editorial feature; grid the rest.
  const featured = isDefaultView ? posts[0] : undefined;
  const gridPosts = featured ? posts.slice(1) : posts;

  let featuredMinutes: number | undefined;
  if (featured) {
    const detail = await getPost(featured.slug);
    if (detail) featuredMinutes = readingTimeMinutes(detail.content);
  }

  return (
    <>
      <JsonLd
        graph={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Journal", path: "/blog" },
          ]),
        ]}
      />
      <section className="border-b border-border bg-secondary/40">
        <div className="main-container pt-32 pb-14 md:pt-40 md:pb-16">
          <div className="max-w-[46ch]">
            <Kicker tone="gold">The Journal</Kicker>
            <h1 className="mt-6 font-heading text-h1 font-light text-balance text-foreground">
              Stories from{" "}
              <span className="italic text-primary">Aleevia Carter.</span>
            </h1>
            <p className="mt-6 text-body text-muted-foreground">
              Design notes, neighbourhood guides, and a closer look at life
              inside the residence.
            </p>
          </div>

          {tags.length > 0 && (
            <div className="mt-10">
              <TagFilter tags={tags} active={tag} />
            </div>
          )}
        </div>
      </section>

      {posts.length === 0 ? (
        <EmptyState tags={tags} activeTagName={activeTagName} />
      ) : (
        <section className="main-container py-16 md:py-24">
          {featured && (
            <FeaturedPost post={featured} readMinutes={featuredMinutes} />
          )}

          {gridPosts.length > 0 && (
            <div
              className={cn(
                "grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3",
                featured &&
                  "mt-16 border-t border-border pt-16 md:mt-20 md:pt-20",
              )}
            >
              {gridPosts.map((post, index) => (
                <Reveal key={post.id} delay={(index % 3) * 0.08}>
                  <PostCard post={post} priority={!featured && index < 3} />
                </Reveal>
              ))}
            </div>
          )}

          <Pagination page={meta.page} lastPage={meta.lastPage} tag={tag} />
        </section>
      )}

      <CtaBand />
    </>
  );
}

function Pagination({
  page,
  lastPage,
  tag,
}: {
  page: number;
  lastPage: number;
  tag?: string;
}) {
  if (lastPage <= 1) return null;

  const hrefFor = (target: number) => {
    const params = new URLSearchParams();
    if (tag) params.set("tag", tag);
    if (target > 1) params.set("page", String(target));
    const query = params.toString();
    return query ? `/blog?${query}` : "/blog";
  };

  const linkClasses =
    "inline-flex h-11 items-center gap-2 text-caption font-medium uppercase tracking-label text-foreground transition-colors hover:text-primary";
  const disabledClasses =
    "inline-flex h-11 items-center gap-2 text-caption font-medium uppercase tracking-label text-muted-foreground/50";

  return (
    <nav
      aria-label="Pagination"
      className="mt-16 flex items-center justify-between border-t border-border pt-8"
    >
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={linkClasses} rel="prev">
          <ArrowLeft className="size-4" />
          Newer
        </Link>
      ) : (
        <span className={disabledClasses}>
          <ArrowLeft className="size-4" />
          Newer
        </span>
      )}

      <span className="text-caption text-muted-foreground">
        Page {page} of {lastPage}
      </span>

      {page < lastPage ? (
        <Link href={hrefFor(page + 1)} className={linkClasses} rel="next">
          Older
          <ArrowRight className="size-4" />
        </Link>
      ) : (
        <span className={disabledClasses}>
          Older
          <ArrowRight className="size-4" />
        </span>
      )}
    </nav>
  );
}

function EmptyState({
  tags,
  activeTagName,
}: {
  tags: Tag[];
  activeTagName?: string;
}) {
  const filtered = Boolean(activeTagName);

  return (
    <section className="main-container py-20 md:py-28">
      <div className="max-w-[52ch]">
        <span
          aria-hidden
          className="flex size-14 items-center justify-center rounded-md bg-emerald font-heading text-lg font-light uppercase tracking-monogram text-gold"
        >
          AC
        </span>
        <h2 className="mt-7 font-heading text-h3 font-normal text-foreground">
          {filtered
            ? `No stories under ${activeTagName} just yet.`
            : "New stories are on the way."}
        </h2>
        <p className="mt-5 text-body text-muted-foreground">
          {filtered
            ? "Nothing here for this topic yet. Browse the full Journal, or come see the homes in person."
            : "We're putting together our first set of articles. In the meantime, follow along on Facebook or come see the homes in person — we'd love to show you around."}
        </p>

        <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
          {filtered ? (
            <CtaLink href="/blog" variant="solid" arrow={false}>
              Back to the Journal
            </CtaLink>
          ) : (
            <CtaLink href="/contacts" variant="solid">
              Book a viewing
            </CtaLink>
          )}
          <CtaLink href={CONTACT.facebook} variant="link">
            Follow on Facebook
          </CtaLink>
        </div>

        {tags.length > 0 && filtered && (
          <div className="mt-12 border-t border-border pt-8">
            <TagFilter tags={tags} />
          </div>
        )}
      </div>
    </section>
  );
}
