import Link from "next/link";
import { Fragment } from "react";

import type { Tag } from "@/lib/blog";
import { cn } from "@/lib/utils";

type PostTagsProps = {
  tags: Tag[];
  /** "light" for cream/paper surfaces, "dark" for emerald/photo surfaces. */
  tone?: "light" | "dark";
  /** Render each tag as a link to the filtered Journal. Never nest inside another link. */
  asLinks?: boolean;
  className?: string;
};

/**
 * Post tags as dot-separated uppercase labels — the brochure's kicker voice,
 * deliberately not the filter-chip clutter of a listings portal.
 */
export function PostTags({
  tags,
  tone = "light",
  asLinks = false,
  className,
}: PostTagsProps) {
  if (tags.length === 0) return null;

  const dark = tone === "dark";

  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-2.5 gap-y-1 text-caption font-medium uppercase tracking-kicker",
        dark ? "text-gold" : "text-muted-foreground",
        className,
      )}
    >
      {tags.map((tag, index) => (
        <Fragment key={tag.slug}>
          {index > 0 && (
            <span
              aria-hidden
              className={dark ? "text-emerald-foreground/40" : "text-border"}
            >
              ·
            </span>
          )}
          {asLinks ? (
            <Link
              href={`/blog?tag=${tag.slug}`}
              className={cn(
                "transition-colors",
                dark ? "hover:text-emerald-foreground" : "hover:text-primary",
              )}
            >
              {tag.name}
            </Link>
          ) : (
            <span>{tag.name}</span>
          )}
        </Fragment>
      ))}
    </p>
  );
}
