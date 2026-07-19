import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { CoverImage } from "@/components/blog/cover-image";
import { Reveal } from "@/components/ui/reveal";
import { formatPostDate, type PostCard } from "@/lib/blog";

type FeaturedPostProps = {
  post: PostCard;
  /** Reading-time estimate, derived from the full post on the server. */
  readMinutes?: number;
};

/**
 * The lead story: a large, editorial two-column feature so a single published
 * post still opens the Journal with confidence rather than a lonely card.
 */
export function FeaturedPost({ post, readMinutes }: FeaturedPostProps) {
  const date = formatPostDate(post.publishedAt);

  return (
    <Reveal>
      <article className="group">
        <Link
          href={`/blog/${post.slug}`}
          className="grid items-center gap-8 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-8 focus-visible:ring-offset-background md:grid-cols-2 md:gap-12 lg:gap-16"
        >
          <div className="relative order-1 aspect-4/3 w-full overflow-hidden rounded-md bg-muted md:aspect-5/4">
            <CoverImage
              src={post.coverImageUrl}
              alt={post.title}
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
              className="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>

          <div className="order-2">
            <p className="text-caption font-medium uppercase tracking-kicker text-gold">
              Latest story
            </p>

            <h2 className="mt-4 font-heading text-h3 font-light text-balance text-foreground transition-colors duration-300 group-hover:text-primary">
              {post.title}
            </h2>

            {post.excerpt && (
              <p className="mt-5 max-w-[48ch] text-body text-muted-foreground">
                {post.excerpt}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-muted-foreground">
              {date && (
                <time dateTime={post.publishedAt ?? undefined}>{date}</time>
              )}
              {date && readMinutes && (
                <span aria-hidden className="text-border">
                  ·
                </span>
              )}
              {readMinutes && <span>{readMinutes} min read</span>}
            </div>

            <span className="mt-8 inline-flex items-center gap-2 text-small font-medium uppercase tracking-label text-primary">
              Read the story
              <ArrowUpRight className="size-4 transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0" />
            </span>
          </div>
        </Link>
      </article>
    </Reveal>
  );
}
