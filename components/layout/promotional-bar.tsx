import { ArrowRight, Mail, Phone } from "lucide-react";
import Link from "next/link";

import type { Announcement, AnnouncementVariant } from "@/lib/announcement";
import { cn } from "@/lib/utils";

/**
 * The four surfaces the CMS can choose between, resolved to real design tokens.
 *
 * Colour lives here rather than in the database: the API stores an intent
 * (`GOLD`), never a hex, so a palette change is one edit in this file and
 * nothing off-brand or unreadable can be published from the admin panel.
 *
 * `accent` and `hover` are tuned per surface because a single choice cannot
 * work on all four — gold-on-gold is invisible, so that one borrows emerald.
 */
const VARIANTS: Record<
  AnnouncementVariant,
  { surface: string; accent: string; hover: string }
> = {
  EMERALD: {
    surface: "bg-emerald text-emerald-foreground",
    accent: "text-gold",
    hover: "hover:text-gold",
  },
  GOLD: {
    surface: "bg-gold text-gold-foreground",
    accent: "text-gold-foreground/45",
    hover: "hover:text-emerald",
  },
  SAGE: {
    surface: "bg-sage text-sage-foreground",
    accent: "text-gold",
    hover: "hover:text-gold",
  },
  INK: {
    surface: "bg-foreground text-background",
    accent: "text-gold",
    hover: "hover:text-gold",
  },
};

/**
 * The icon is derived from the link, not stored alongside it. A `tel:` is always
 * a phone and a `mailto:` is always an envelope, so asking an author to pick one
 * would only create a way to get it wrong.
 */
function iconFor(href: string) {
  if (href.startsWith("tel:")) return Phone;
  if (href.startsWith("mailto:")) return Mail;
  return ArrowRight;
}

export function PromotionalBar({
  announcement,
}: {
  announcement: Announcement | null;
}) {
  // Everything unpublished is a deliberate state, not an error: render nothing
  // and let the navbar sit at the top of the page.
  if (!announcement) return null;

  const { message, linkLabel, linkHref, variant } = announcement;
  const theme = VARIANTS[variant] ?? VARIANTS.EMERALD;
  const Icon = linkHref ? iconFor(linkHref) : null;
  const isInternal = linkHref?.startsWith("/") ?? false;

  const link =
    linkHref && linkLabel ? (
      <span
        className={cn(
          "inline-flex items-center gap-2 font-medium transition-colors",
          theme.hover,
        )}
      >
        {Icon ? <Icon aria-hidden className="size-3 shrink-0" /> : null}
        {linkLabel}
      </span>
    ) : null;

  return (
    <aside
      aria-label="Site announcement"
      className={cn("surface-plaster", theme.surface)}
    >
      {/* Stacked and centred on a phone, a single line from `sm` up. The
          separator dot only exists in the one-line layout: below it, the two
          rows already read as separate and a trailing dot would look like a
          typo. */}
      <div
        className={cn(
          "main-container flex min-h-9 flex-col items-center justify-center gap-y-0.5 py-1.5",
          "text-[0.75rem] tracking-[0.12em] sm:flex-row sm:gap-x-3 sm:py-0",
          "sm:text-caption sm:tracking-label",
        )}
      >
        <span className="text-balance text-center opacity-80">{message}</span>

        {link ? (
          <>
            <span aria-hidden className={cn("hidden sm:inline", theme.accent)}>
              ·
            </span>
            {isInternal ? (
              <Link href={linkHref as string}>{link}</Link>
            ) : (
              <a
                href={linkHref as string}
                // `tel:` and `mailto:` hand off to another app rather than
                // navigating, so only real web links get a new tab.
                {...(linkHref?.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {link}
              </a>
            )}
          </>
        ) : null}
      </div>
    </aside>
  );
}
