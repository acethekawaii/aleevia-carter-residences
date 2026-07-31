import Image from "next/image";

import { Reveal } from "@/components/ui/reveal";

/**
 * Follows the floor stack on purpose: the diagram accounts for every level,
 * and this is the one room inside it that belongs to no single home. Sized to
 * eight columns so the render's printed "Artist's perspective" badge stays
 * legible, and framed at the file's own 3382×1985 ratio so object-cover crops
 * nothing at any width.
 */
export function Reception() {
  return (
    <section
      aria-labelledby="reception-heading"
      className="main-container py-20 md:py-28"
    >
      <div className="grid gap-8 md:grid-cols-12 md:gap-12">
        <Reveal className="md:col-span-8">
          <div className="relative aspect-[3382/1985] w-full overflow-hidden rounded-md bg-muted">
            <Image
              src="/assets/interiors/reception-lounge.png"
              alt="Artist's perspective of the reception and lounge: a welcome desk, a rust-coloured sofa, timber flooring, and a staircase rising past a marble wall."
              fill
              sizes="(min-width: 768px) 66vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="md:col-span-4 md:self-end">
          <h2
            id="reception-heading"
            className="font-heading text-h4 font-normal text-foreground"
          >
            The one room that's shared.
          </h2>
          <p className="mt-5 text-body text-muted-foreground">
            Every other room on this site sits inside somebody's home. This one
            doesn't — reception and lounge seating, opening onto the building's
            admin office.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
