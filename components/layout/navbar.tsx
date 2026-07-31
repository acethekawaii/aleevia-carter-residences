"use client";

import { ChevronDown, Menu } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { CtaLink } from "@/components/ui/cta-link";
import { Kicker } from "@/components/ui/kicker";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Announcement } from "@/lib/announcement";
import {
  NAV,
  type NavEntry,
  type NavGroup,
  PRIMARY_CTA,
  SITE,
} from "@/lib/site";
import { cn } from "@/lib/utils";

import { PromotionalBar } from "./promotional-bar";

function hasMenu(
  entry: NavEntry,
): entry is { label: string; menu: NavGroup[] } {
  return "menu" in entry;
}

function useIsActive() {
  const pathname = usePathname();
  return (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
}

const LINK_CLASSES =
  "text-[0.75rem] font-medium uppercase tracking-label text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground";

/**
 * `announcement` is fetched by the root layout and passed down rather than
 * loaded here: this is a client component, so it cannot await anything itself.
 */
export function Navbar({
  announcement,
}: {
  announcement: Announcement | null;
}) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [financingOpen, setFinancingOpen] = React.useState(false);
  const headerRef = React.useRef<HTMLElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const isActive = useIsActive();
  const financingActive = pathname.startsWith("/financing");

  const financing = NAV.find(hasMenu) as
    | { label: string; menu: NavGroup[] }
    | undefined;

  // Close the mega-menu on navigation.
  // biome-ignore lint/correctness/useExhaustiveDependencies: close whenever route changes
  React.useEffect(() => {
    setFinancingOpen(false);
  }, [pathname]);

  // Escape closes and returns focus; outside-click closes.
  React.useEffect(() => {
    if (!financingOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFinancingOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setFinancingOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onClick);
    };
  }, [financingOpen]);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: hover-close is a mouse-only enhancement; keyboard users close via Escape and outside-click (handled above)
    <header
      ref={headerRef}
      onMouseLeave={() => setFinancingOpen(false)}
      className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/75"
    >
      <PromotionalBar announcement={announcement} />

      <div className="main-container flex h-14 items-center justify-between gap-6 md:h-16">
        {/* Left: wordmark only */}
        <Link
          href="/"
          className="font-heading text-base font-medium uppercase tracking-monogram text-foreground"
          aria-label={`${SITE.name}, home`}
        >
          {SITE.shortName}
        </Link>

        {/* Right: links + CTA + mobile trigger */}
        <div className="flex items-center gap-7">
          <nav
            aria-label="Primary"
            className="hidden items-center gap-7 lg:flex"
          >
            {NAV.map((entry) =>
              hasMenu(entry) ? (
                <button
                  key={entry.label}
                  ref={triggerRef}
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={financingOpen}
                  aria-controls="financing-menu"
                  onMouseEnter={() => setFinancingOpen(true)}
                  onClick={() => setFinancingOpen((v) => !v)}
                  className={cn(
                    LINK_CLASSES,
                    "inline-flex items-center gap-1.5",
                    (financingActive || financingOpen) && "text-foreground",
                    financingActive &&
                      "underline decoration-gold decoration-2 underline-offset-[6px]",
                  )}
                >
                  {entry.label}
                  <ChevronDown
                    aria-hidden
                    className={cn(
                      "size-3.5 transition-transform duration-300",
                      financingOpen && "rotate-180",
                    )}
                  />
                </button>
              ) : (
                <Link
                  key={entry.label}
                  href={entry.href}
                  aria-current={isActive(entry.href) ? "page" : undefined}
                  onMouseEnter={() => setFinancingOpen(false)}
                  className={cn(
                    LINK_CLASSES,
                    isActive(entry.href) &&
                      "text-foreground underline decoration-gold decoration-2 underline-offset-[6px]",
                  )}
                >
                  {entry.label}
                </Link>
              ),
            )}
          </nav>

          <CtaLink
            href={PRIMARY_CTA.href}
            variant="solid"
            arrow={false}
            className="hidden h-10 px-6 md:inline-flex"
          >
            {PRIMARY_CTA.label}
          </CtaLink>
          <MobileNav />
        </div>
      </div>

      {/* Full-width financing mega-menu */}
      <AnimatePresence>
        {financing && financingOpen && (
          <motion.div
            id="financing-menu"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full border-b border-border bg-popover shadow-lg"
          >
            <div className="main-container grid gap-10 py-10 lg:grid-cols-12 lg:gap-12 lg:py-12">
              <div className="lg:col-span-4 lg:border-r lg:border-border lg:pr-12">
                <Kicker tone="gold">Financing</Kicker>
                <p className="mt-5 font-heading text-h4 font-light text-foreground">
                  Owning a home here, made simple.
                </p>
                <p className="mt-4 max-w-[34ch] text-small text-muted-foreground">
                  Plan your purchase with Pag-IBIG or our accredited bank
                  partner — we'll guide you through every step.
                </p>
              </div>

              {financing.menu.map((group) => (
                <div key={group.category} className="lg:col-span-4">
                  <p className="text-caption font-medium uppercase tracking-label text-muted-foreground">
                    {group.category}
                  </p>
                  <ul className="mt-5 space-y-4">
                    {group.links.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="group/mega block"
                          onClick={() => setFinancingOpen(false)}
                        >
                          <span className="font-heading text-lead font-normal text-foreground transition-colors group-hover/mega:text-primary">
                            {item.label}
                          </span>
                          {item.description && (
                            <span className="mt-1 block text-small text-muted-foreground">
                              {item.description}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open menu"
        className="inline-flex h-11 w-11 items-center justify-center text-foreground/80 transition-colors hover:text-foreground lg:hidden"
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent className="flex w-3/4 flex-col p-0 sm:max-w-sm">
        <div className="border-b border-border/60 px-8 py-6">
          <SheetTitle>Menu</SheetTitle>
        </div>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-8 py-2">
          {NAV.map((entry) =>
            hasMenu(entry) ? (
              <details
                key={entry.label}
                className="group border-b border-border/60 py-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-caption font-medium uppercase tracking-label text-foreground">
                  {entry.label}
                  <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="mt-4 space-y-4 pl-1">
                  {entry.menu.map((group) => (
                    <div key={group.category}>
                      <p className="text-caption uppercase tracking-label text-muted-foreground">
                        {group.category}
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {group.links.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={close}
                              className="block py-1 text-small text-foreground/80 transition-colors hover:text-primary"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </details>
            ) : (
              <Link
                key={entry.label}
                href={entry.href}
                onClick={close}
                className="block border-b border-border/60 py-5 text-caption font-medium uppercase tracking-label text-foreground transition-colors hover:text-primary"
              >
                {entry.label}
              </Link>
            ),
          )}
        </nav>
        <div className="border-t border-border/60 p-8">
          <CtaLink
            href={PRIMARY_CTA.href}
            variant="solid"
            arrow={false}
            className="h-11 w-full justify-center"
            onClick={close}
          >
            {PRIMARY_CTA.label}
          </CtaLink>
        </div>
      </SheetContent>
    </Sheet>
  );
}
