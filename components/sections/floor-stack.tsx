"use client";

import { motion, useReducedMotion } from "motion/react";

import { Kicker } from "@/components/ui/kicker";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type Floor = {
  level: string;
  use: string;
  count: string;
  /** Usable floor area in sqm, from the brochure's site breakdown (4,155 sqm total). */
  area: number;
  residential: boolean;
};

/**
 * The building read as a section, top down. Every figure comes from the
 * brochure's site table and project summary (see /public/brochure.pdf):
 * five residential levels of 17 homes each = 85, over two parking levels
 * of 19 slots each = 38.
 */
const FLOORS: Floor[] = [
  {
    level: "7F",
    use: "Residences",
    count: "17 homes",
    area: 800,
    residential: true,
  },
  {
    level: "6F",
    use: "Residences",
    count: "17 homes",
    area: 720,
    residential: true,
  },
  {
    level: "5F",
    use: "Residences",
    count: "17 homes",
    area: 720,
    residential: true,
  },
  {
    level: "4F",
    use: "Residences",
    count: "17 homes",
    area: 720,
    residential: true,
  },
  {
    level: "3F",
    use: "Residences",
    count: "17 homes",
    area: 720,
    residential: true,
  },
  {
    level: "2F",
    use: "Parking",
    count: "19 slots",
    area: 237.5,
    residential: false,
  },
  {
    level: "GF",
    use: "Parking",
    count: "19 slots",
    area: 237.5,
    residential: false,
  },
];

const TOTALS = [
  { label: "Residences", value: "85" },
  { label: "Parking slots", value: "38" },
  { label: "Home sizes", value: "40–60 sqm" },
];

/** The widest plate, so every bar reads as a share of the building's largest level. */
const WIDEST_FLOOR = Math.max(...FLOORS.map((floor) => floor.area));

const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;
const BAR_STAGGER_SECONDS = 0.07;

const areaFormat = new Intl.NumberFormat("en-PH", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/**
 * The bars are drawn to scale, so the podium really does read as a third of
 * the residential plates above it — the diagram is the building's massing,
 * not decoration. They fill from the ground up as the section arrives.
 */
export function FloorStack() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="stack-heading"
      className="bg-emerald py-20 text-emerald-foreground md:py-28"
    >
      <div className="main-container grid gap-12 md:grid-cols-12 md:gap-x-12">
        <Reveal className="md:col-span-4 md:self-center">
          <Kicker tone="light">The Stack</Kicker>
          <h2
            id="stack-heading"
            className="mt-6 font-heading text-h3 font-light text-balance"
          >
            The building,{" "}
            <span className="italic text-gold">floor by floor.</span>
          </h2>
          <p className="mt-6 text-body text-emerald-foreground/75">
            Two levels of parking below, five levels of homes above — seventeen
            on each.
          </p>

          <dl className="mt-10">
            {TOTALS.map((total) => (
              <div
                key={total.label}
                className="flex items-baseline justify-between gap-6 border-t border-emerald-foreground/15 py-3"
              >
                <dt className="text-caption uppercase tracking-label text-emerald-foreground/70">
                  {total.label}
                </dt>
                <dd className="text-small tabular-nums">{total.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-caption text-emerald-foreground/60">
            Figures from the project brochure.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="md:col-span-7 md:col-start-6">
          {/* The closing rule is the ground line of the section drawing. */}
          <ol className="border-b border-emerald-foreground/25">
            {FLOORS.map((floor, index) => (
              <li key={floor.level} className="py-4 md:py-5">
                <div className="flex items-baseline gap-4 md:gap-6">
                  <span className="w-8 shrink-0 text-caption font-medium uppercase tracking-label tabular-nums">
                    {floor.level}
                  </span>
                  <span className="min-w-0 flex-1 text-small">{floor.use}</span>
                  <span className="w-20 shrink-0 text-right text-small tabular-nums text-emerald-foreground/75 md:w-24">
                    {floor.count}
                  </span>
                  <span className="w-22 shrink-0 text-right text-small tabular-nums text-emerald-foreground/75 md:w-26">
                    {areaFormat.format(floor.area)} sqm
                  </span>
                </div>
                <div
                  aria-hidden
                  className="mt-3"
                  style={{ width: `${(floor.area / WIDEST_FLOOR) * 100}%` }}
                >
                  <motion.div
                    className={cn(
                      "h-3 origin-left rounded-[2px] md:h-3.5",
                      floor.residential
                        ? "bg-gold"
                        : "bg-emerald-foreground/25",
                    )}
                    initial={reduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                    transition={{
                      duration: 0.9,
                      ease: EASE_OUT_QUINT,
                      // Bottom row first, so the building rises out of the ground.
                      delay: reduceMotion
                        ? 0
                        : (FLOORS.length - 1 - index) * BAR_STAGGER_SECONDS,
                    }}
                  />
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
