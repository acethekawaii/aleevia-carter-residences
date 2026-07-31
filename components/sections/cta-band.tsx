import Image from "next/image";

import { CtaLink } from "@/components/ui/cta-link";
import { Reveal } from "@/components/ui/reveal";
import { BROCHURE_PATH, PRIMARY_CTA } from "@/lib/site";

type CtaBandProps = {
  title?: string;
  body?: string;
  image?: string;
  imageAlt?: string;
};

export function CtaBand({
  title = "Come see if it feels like home.",
  body = "Book a private viewing and we'll walk you through it, no pressure. Or browse the brochure and take your time.",
  image = "/assets/amenities/roof-deck-lounge.png",
  imageAlt = "The Aleevia Carter roofdeck lounge at golden hour, parasols and lounge seating against the skyline.",
}: CtaBandProps) {
  return (
    <section
      aria-labelledby="cta-band-heading"
      className="relative isolate flex min-h-[60svh] items-center overflow-hidden bg-emerald py-24 md:py-32"
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-foreground/90 via-foreground/55 to-foreground/35"
      />

      <div className="main-container">
        <Reveal className="max-w-[40rem]">
          <h2
            id="cta-band-heading"
            className="font-heading text-h1 font-light text-balance text-background"
          >
            {title}
          </h2>
          <p className="mt-6 max-w-[46ch] text-lead font-light text-background/90">
            {body}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <CtaLink href={PRIMARY_CTA.href} variant="solid">
              {PRIMARY_CTA.label}
            </CtaLink>
            <CtaLink href={BROCHURE_PATH} variant="outlineLight">
              View the brochure
            </CtaLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
