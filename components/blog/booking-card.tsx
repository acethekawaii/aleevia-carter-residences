import { CtaLink } from "@/components/ui/cta-link";
import { BROCHURE_PATH, PRIMARY_CTA } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The always-nearby invitation. Sits in the reading aside on desktop and inline
 * on smaller screens, so a low-friction way to say yes is never more than a
 * glance away — the whole point of the site.
 *
 * The aside is narrow (~17rem), so both actions are kept on a single line
 * (`whitespace-nowrap`) to avoid a broken two-line button label.
 */
export function BookingCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-md bg-secondary/70 p-6 md:p-7", className)}>
      <p className="font-heading text-h4 font-light text-balance text-foreground">
        Come see it in person.
      </p>
      <p className="mt-3 text-small leading-relaxed text-muted-foreground">
        Tour the homes and amenities on-site or over Google Meet — no pressure,
        we'd just love to show you around.
      </p>
      <CtaLink
        href={PRIMARY_CTA.href}
        variant="solid"
        arrow={false}
        className="mt-6 h-12 w-full justify-center whitespace-nowrap"
      >
        {PRIMARY_CTA.label}
      </CtaLink>
      <CtaLink
        href={BROCHURE_PATH}
        variant="link"
        arrow={false}
        className="mt-5 flex w-full justify-center whitespace-nowrap text-caption"
      >
        View the brochure
      </CtaLink>
    </div>
  );
}
