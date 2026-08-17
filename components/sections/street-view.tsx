import Image from "next/image";

import { Reveal } from "@/components/ui/reveal";
import { CONTACT } from "@/lib/site";

export function StreetView() {
  return (
    <section
      aria-labelledby="street-view-heading"
      className="overflow-hidden bg-emerald py-20 md:py-24 lg:py-32"
    >
      <div className="main-container">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-12">
          <Reveal className="lg:col-span-4 xl:col-span-3 xl:col-start-2">
            <h2
              id="street-view-heading"
              className="font-heading text-h2 font-light text-balance text-emerald-foreground"
            >
              From the <span className="italic text-gold">street.</span>
            </h2>
            <p className="mt-8 max-w-[32ch] text-lead font-light text-emerald-foreground">
              This is the building as you'd meet it on E. Rodriguez Street.
            </p>
            <p className="mt-5 max-w-[48ch] text-body text-emerald-foreground/75">
              A real street-level view — the blue façade, the entrance, and the
              homes rising above it.
            </p>
          </Reveal>

          <Reveal
            delay={0.1}
            className="lg:col-span-7 lg:col-start-6 xl:col-span-6"
          >
            <figure>
              <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-muted">
                <Image
                  src="/assets/exterior-raw.png"
                  alt="Street-level photograph looking up at Aleevia Carter Residences, showing its blue, cream, and burgundy facade above the building entrance."
                  fill
                  sizes="(min-width: 1280px) 700px, (min-width: 1024px) 55vw, calc(100vw - 48px)"
                  className="origin-top-left scale-110 object-cover"
                />
              </div>
              <figcaption className="mt-4 text-caption text-emerald-foreground/70">
                {CONTACT.address}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
