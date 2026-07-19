"use client";

import { useEffect, useState } from "react";

import type { TocItem } from "@/lib/blog";
import { cn } from "@/lib/utils";

/**
 * In-article table of contents with scroll-spy. Highlights the section nearest
 * the top of the viewport as the reader moves through the post. Anchor jumps
 * rely on each heading's scroll-margin to clear the sticky header.
 */
export function ArticleToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | undefined>(items[0]?.id);

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const firstVisible = items.find((item) => visible.has(item.id));
        if (firstVisible) setActiveId(firstVisible.id);
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav aria-label="In this article">
      <p className="text-caption font-medium uppercase tracking-kicker text-muted-foreground">
        In this article
      </p>
      <ul className="mt-4 space-y-1">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "group flex items-center gap-3 py-1.5 text-small transition-colors",
                  item.level === 3 && "pl-4",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "h-4 w-0.5 shrink-0 rounded-full transition-colors",
                    isActive
                      ? "bg-gold"
                      : "bg-border group-hover:bg-muted-foreground",
                  )}
                />
                <span className="text-balance">{item.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
