"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useRef } from "react";

import { CtaLink } from "@/components/ui/cta-link";
import { BROCHURE_PATH, PRIMARY_CTA } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

const FACTS = [
  "Seven storeys",
  "85 residences",
  "1 & 2-bedroom lofts",
  "Pasay City",
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);

  return (
    <section
      ref={ref}
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-[640px] w-full items-end overflow-hidden bg-emerald md:h-[calc(100svh-3.25rem)]"
    >
      <motion.div
        aria-hidden
        style={reduceMotion ? undefined : { y: imageY }}
        className="absolute inset-0 -z-10 scale-110"
      >
        <Image
          src="/assets/interiors/unit-7/open-plan-living-area.png"
          alt="A warm living and dining space at Aleevia Carter: forest-green feature wall, oak joinery, and soft afternoon light."
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Warm scrims: gentle at top for the header, deeper at the base for type. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-foreground/45 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-foreground/85 via-foreground/35 to-transparent"
      />

      <div className="main-container relative z-10 pb-12 pt-28 md:pb-20">
        <div className="max-w-[46rem]">
          <motion.p
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            className="text-caption font-medium uppercase tracking-kicker text-gold"
          >
            Pasay City · Now welcoming viewings
          </motion.p>

          <motion.h1
            id="hero-heading"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.22 }}
            className="mt-6 font-heading text-display font-light text-balance text-background"
          >
            Your haven in the{" "}
            <span className="italic text-gold">heart of the city.</span>
          </motion.h1>

          <motion.p
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.38 }}
            className="mt-7 max-w-[46ch] text-lead font-light text-background/90"
          >
            A small Japandi residence on E. Rodriguez Street — one- and
            two-bedroom loft homes built for a life without limits.
          </motion.p>

          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.54 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <CtaLink href={PRIMARY_CTA.href} variant="solid">
              {PRIMARY_CTA.label}
            </CtaLink>
            <CtaLink href={BROCHURE_PATH} variant="outlineLight">
              View the brochure
            </CtaLink>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.8 }}
            className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-background/20 pt-6 text-caption font-medium uppercase tracking-label text-background/80"
          >
            {FACTS.map((fact, index) => (
              <li key={fact} className="flex items-center gap-5">
                {index > 0 && (
                  <span aria-hidden className="text-gold">
                    ·
                  </span>
                )}
                {fact}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
