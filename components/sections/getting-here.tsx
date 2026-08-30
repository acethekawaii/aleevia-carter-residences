import { Clock3, MapPin, Navigation } from "lucide-react";

import { CtaLink } from "@/components/ui/cta-link";
import { Reveal } from "@/components/ui/reveal";
import { CONTACT, LOCATION, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The pinpoint, straight after the neighbourhood tour: the address written out
 * in full, a live map centred on the door, and one tap to start navigating in
 * whichever app the visitor already has open.
 *
 * The address and the two navigation buttons come first in the source, so a
 * phone shows them above the map rather than below 20rem of it. Google Maps
 * and Waze are deliberately the same weight; which one a driver in Metro
 * Manila trusts is their choice, not ours, and neither should borrow the
 * emerald that belongs to the viewing CTA.
 *
 * The pale sage band is the About page's tonal step. A page that already
 * ends on sage passes `className` to retone it rather than stacking two
 * identical surfaces.
 */
export function GettingHere({ className }: { className?: string }) {
  return (
    <section
      id="getting-here"
      aria-labelledby="getting-here-heading"
      className={cn(
        "scroll-mt-24 border-t border-border bg-secondary/40 py-20 md:py-28",
        className,
      )}
    >
      <div className="main-container">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5 xl:col-span-4">
            <h2
              id="getting-here-heading"
              className="font-heading text-h3 font-light text-balance text-foreground"
            >
              Find the <span className="italic text-primary">front door.</span>
            </h2>

            <p className="mt-8 text-caption font-medium uppercase tracking-label text-muted-foreground">
              Address
            </p>
            <address className="mt-3 text-lead font-light text-foreground not-italic">
              {CONTACT.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>

            <p className="mt-6 max-w-[44ch] text-body text-muted-foreground">
              Look for the blue, cream, and burgundy façade on E. Rodriguez
              Street. Metro Pasay Hospital and Bible Baptist Church of Pasay are
              the nearest landmarks, both under a kilometre away.
            </p>

            <p className="mt-10 text-caption font-medium uppercase tracking-label text-muted-foreground">
              Start navigation
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CtaLink
                href={LOCATION.directionsUrl}
                variant="outline"
                arrow={false}
                className="justify-center"
              >
                <MapPin aria-hidden className="size-4" />
                Google Maps
              </CtaLink>
              <CtaLink
                href={LOCATION.wazeUrl}
                variant="outline"
                arrow={false}
                className="justify-center"
              >
                <Navigation aria-hidden className="size-4" />
                Waze
              </CtaLink>
            </div>

            <p className="mt-8 flex items-start gap-2.5 text-small text-muted-foreground">
              <Clock3
                aria-hidden
                className="mt-0.5 size-4 shrink-0 text-primary"
              />
              Open {CONTACT.hours}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7 xl:col-span-8">
            <div className="overflow-hidden rounded-md border border-border bg-card">
              <iframe
                src={LOCATION.embedUrl}
                title={`Map showing ${SITE.name} at ${CONTACT.addressFull}`}
                className="block h-[20rem] w-full sm:h-[26rem] lg:h-[30rem]"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
