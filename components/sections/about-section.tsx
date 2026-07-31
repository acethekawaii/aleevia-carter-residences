import Image from "next/image";

import { CtaLink } from "@/components/ui/cta-link";
import { Kicker } from "@/components/ui/kicker";
import { Reveal } from "@/components/ui/reveal";
import { BROCHURE_PATH, CONTACT, SITE } from "@/lib/site";

export function AboutSection() {
  return (
    <section className="main-container pt-32 pb-16 md:pt-40 md:pb-20">
      <div className="grid gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <Kicker tone="gold">The Building</Kicker>
          <h1 className="mt-8 font-heading text-h1 font-light text-balance text-foreground">
            Here's exactly what{" "}
            <span className="italic text-primary">we're building.</span>
          </h1>
          <div className="mt-12 border-t border-border pt-10 md:mt-14">
            {/* Both measures land on the same right edge — the lead's ch is
                  wider than the body's, so the counts differ deliberately. */}
            <p className="max-w-[44ch] text-lead font-light text-foreground/80">
              {SITE.name} is a seven-storey building at {CONTACT.address} —
              eighty-five one- and two-bedroom loft homes above two levels of
              parking.
            </p>
            <p className="mt-6 max-w-[62ch] text-body text-muted-foreground">
              Every number on this page comes straight from the project
              brochure. If it isn't in there, it isn't here.
            </p>
            <CtaLink href={BROCHURE_PATH} variant="link" className="mt-8">
              Read the brochure
            </CtaLink>
          </div>
        </Reveal>

        {/* The architect's sketch, mounted like a drawing rather than cropped
              like a photograph — the margin is what makes it read as paper.
              Bottom-aligned so it sits on the same baseline as the copy. */}
        <Reveal
          delay={0.12}
          className="md:col-span-4 md:col-start-9 md:self-end"
        >
          <figure>
            <div className="rounded-md border border-border bg-card p-5 md:p-6">
              <Image
                src="/assets/hero-exterior.jpg"
                alt="Architect's rendering of Aleevia Carter Residences seen from street level, a slatted facade rising against a bright sky."
                width={1000}
                height={1208}
                sizes="(min-width: 768px) 32vw, 100vw"
                className="h-auto w-full"
              />
            </div>
            <figcaption className="mt-4 text-caption text-muted-foreground">
              Architect's rendering.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
