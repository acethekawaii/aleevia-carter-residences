import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { CoverImage } from "@/components/blog/cover-image";
import { PostTags } from "@/components/blog/post-tags";
import { formatPostDate, type PostCard as PostCardType } from "@/lib/blog";

type PostCardProps = {
  post: PostCardType;
  /** First cards above the fold should load their cover eagerly. */
  priority?: boolean;
};

/**
 * A single Journal entry in the grid. The whole card is one link, so tags are
 * plain labels here (never nested links) and the title/arrow signal the target.
 */
export function PostCard({ post, priority = false }: PostCardProps) {
  const date = formatPostDate(post.publishedAt);

  return (
    <article className="group h-full">
      <Link
        href={`/blog/${post.slug}`}
        className="flex h-full flex-col rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-md bg-muted">
          <CoverImage
            src={post.coverImageUrl}
            alt={post.title}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            priority={priority}
            className="transition-transform duration-[900ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>

        <div className="flex flex-1 flex-col pt-5">
          <PostTags tags={post.tags} />

          <h3 className="mt-3 font-heading text-h4 font-normal text-balance text-foreground transition-colors duration-300 group-hover:text-primary">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="mt-3 line-clamp-2 text-small text-muted-foreground">
              {post.excerpt}
            </p>
          )}

          <div className="mt-5 flex items-center justify-between gap-4 pt-1">
            {date && (
              <time
                dateTime={post.publishedAt ?? undefined}
                className="text-caption text-muted-foreground"
              >
                {date}
              </time>
            )}
            <span
              aria-hidden
              className="inline-flex items-center gap-1.5 text-caption font-medium uppercase tracking-label text-primary"
            >
              Read
              <ArrowUpRight className="size-3.5 transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
