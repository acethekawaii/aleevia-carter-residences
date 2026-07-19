import Link from "next/link";

import type { Tag } from "@/lib/blog";
import { cn } from "@/lib/utils";

type TagFilterProps = {
  tags: Tag[];
  /** Currently-active tag slug, or undefined for "All". */
  active?: string;
};

/**
 * Topic filter for the Journal. Understated gold-underline toggles that echo the
 * site navigation — deliberately not the filter-rail chips of a listings portal.
 */
export function TagFilter({ tags, active }: TagFilterProps) {
  if (tags.length === 0) return null;

  const items: { name: string; slug?: string }[] = [
    { name: "All" },
    ...tags.map((tag) => ({ name: tag.name, slug: tag.slug })),
  ];

  return (
    <nav
      aria-label="Filter by topic"
      className="flex flex-wrap items-center gap-x-6 gap-y-3"
    >
      {items.map((item) => {
        const isActive = (item.slug ?? undefined) === active;
        return (
          <Link
            key={item.name}
            href={item.slug ? `/blog?tag=${item.slug}` : "/blog"}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "text-caption font-medium uppercase tracking-label transition-colors focus-visible:outline-none focus-visible:text-foreground",
              isActive
                ? "text-foreground underline decoration-gold decoration-2 underline-offset-[6px]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
