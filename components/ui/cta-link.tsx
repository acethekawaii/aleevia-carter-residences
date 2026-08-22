import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export const ctaVariants = cva(
  "group/cta inline-flex items-center gap-3 rounded-sm font-medium uppercase tracking-label transition-[background-color,color,border-color] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:translate-y-px",
  {
    variants: {
      variant: {
        // Emerald action voice — the primary "say yes" affordance.
        solid:
          "h-12 bg-primary px-7 text-caption text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring focus-visible:ring-offset-background",
        // Quiet outline on light surfaces.
        outline:
          "h-12 border border-foreground/25 px-7 text-caption text-foreground hover:border-foreground hover:bg-foreground hover:text-background focus-visible:ring-foreground focus-visible:ring-offset-background",
        // Outline for dark sage/emerald surfaces.
        outlineLight:
          "h-12 border border-[currentColor]/40 px-7 text-caption text-emerald-foreground hover:bg-emerald-foreground hover:text-emerald focus-visible:ring-emerald-foreground focus-visible:ring-offset-emerald",
        // Inline underlined link, light surface.
        link: "gap-2 text-small text-primary underline decoration-1 underline-offset-4 hover:text-primary/80 focus-visible:ring-ring focus-visible:ring-offset-background",
        // Inline underlined link, dark surface.
        linkLight:
          "gap-2 text-small text-emerald-foreground underline decoration-1 underline-offset-4 hover:text-gold focus-visible:ring-emerald-foreground focus-visible:ring-offset-emerald",
      },
    },
    defaultVariants: { variant: "solid" },
  },
);

type CtaLinkProps = VariantProps<typeof ctaVariants> & {
  href: string;
  children: ReactNode;
  className?: string;
  /** Show the trailing arrow. Defaults to true. */
  arrow?: boolean;
  /** Force a native anchor + new tab (files, external links). Auto-detected otherwise. */
  external?: boolean;
  onClick?: () => void;
};

const isExternal = (href: string) =>
  /^(https?:|tel:|mailto:)/.test(href) || href.endsWith(".pdf");

export function CtaLink({
  href,
  children,
  className,
  variant,
  arrow = true,
  external,
  onClick,
}: CtaLinkProps) {
  const opensExternally = external ?? isExternal(href);
  const classes = cn(ctaVariants({ variant }), className);

  const inner = (
    <>
      {children}
      {arrow && (
        <ArrowUpRight
          aria-hidden
          className="size-4 transition-transform duration-500 ease-out group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover/cta:translate-x-0 motion-reduce:group-hover/cta:translate-y-0"
        />
      )}
    </>
  );

  if (opensExternally) {
    const isHttp = href.startsWith("http") || href.endsWith(".pdf");
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        {...(isHttp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} onClick={onClick}>
      {inner}
    </Link>
  );
}
