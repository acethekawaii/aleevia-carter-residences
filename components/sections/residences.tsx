"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useId, useState } from "react";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { CtaLink } from "@/components/ui/cta-link";
import { Kicker } from "@/components/ui/kicker";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type Unit = {
  key: string;
  tab: string;
  name: string;
  subtitle: string;
  specs: string;
  body: string;
  images: { src: string; alt: string }[];
  floorPlans: { label: string; src: string }[];
};

const UNITS: Unit[] = [
  {
    key: "aleevia-one",
    tab: "1-Bedroom",
    name: "1-Bedroom Loft",
    subtitle: "A seamless live-work home",
    specs: "1 Bed · 1 Bath · 40 sqm · Loft",
    body: "Forty square metres that live larger than they measure. Level one opens into a wide living area with a built-in work desk set by the window; upstairs, the mezzanine becomes a private owner's suite with a queen bed, a long vanity, and an en-suite bath. The hidden kitchen joinery keeps everything calm and uncluttered — a flexible, open home you can make your own.",
    images: [
      {
        src: "/assets/interiors/unit-1/bedroom-front-view.png",
        alt: "Wide view of the 1-Bedroom Loft bedroom with sage bedding, warm timber, and built-in wardrobes.",
      },
      {
        src: "/assets/interiors/unit-1/entry-corridor.png",
        alt: "The 1-Bedroom Loft entry corridor with pale joinery, a console desk, and built-in storage.",
      },
      {
        src: "/assets/interiors/unit-1/built-in-workspace.png",
        alt: "The 1-Bedroom Loft built-in two-seat workspace with sage cabinetry and warm timber slats.",
      },
    ],
    floorPlans: [
      { label: "Level 1", src: "/assets/floor-plans/unit-1-level-1.png" },
      { label: "Mezzanine", src: "/assets/floor-plans/unit-1-mezzanine.png" },
    ],
  },
  {
    key: "aleevia-two",
    tab: "2-Bedroom",
    name: "2-Bedroom Loft",
    subtitle: "Made to be the heart of your story",
    specs: "2 Bed · 1 Bath · 60 sqm · Loft",
    body: "Built for people who love to host. Level one is an open plan centred on a generous L-shaped sofa and a four-seater dining table; the mezzanine adds an entertainment loft that can become a media room, a guest lounge, or a quiet office nook with built-in shelving. Sixty square metres with a clear line between the busy day and the restful evening.",
    images: [
      {
        src: "/assets/interiors/unit-7/open-plan-living-area.png",
        alt: "The 2-Bedroom Loft open-plan living area with kitchen joinery, dining space, and a forest-green feature wall.",
      },
      {
        src: "/assets/interiors/unit-7/under-stair-workspace.png",
        alt: "The 2-Bedroom Loft workspace tucked beneath the staircase beside a forest-green feature wall.",
      },
      {
        src: "/assets/interiors/unit-7/bedroom-wide-view.png",
        alt: "Wide view of the 2-Bedroom Loft bedroom in soft sage and linen with a low timber bed.",
      },
      {
        src: "/assets/interiors/unit-7/bedroom-front-view.png",
        alt: "Front view of the 2-Bedroom Loft bedroom with a timber headboard and teal bedding.",
      },
      {
        src: "/assets/interiors/unit-7/bedroom-workspace.png",
        alt: "The 2-Bedroom Loft bedroom workspace beside built-in storage and a wide window.",
      },
    ],
    floorPlans: [
      { label: "Level 1", src: "/assets/floor-plans/unit-7-level-1.png" },
      { label: "Mezzanine", src: "/assets/floor-plans/unit-7-mezzanine.png" },
    ],
  },
];

function UnitCarousel({ unit }: { unit: Unit }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <div>
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
        <CarouselContent className="-ml-0">
          {unit.images.map((image) => (
            <CarouselItem key={image.src} className="pl-0">
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-md bg-muted md:aspect-[16/11]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="mt-6 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => api?.scrollPrev()}
          className="inline-flex size-11 items-center justify-center rounded-sm border border-border text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Previous photo"
        >
          <ArrowLeft className="size-4" />
        </button>
        <div className="flex items-center gap-2.5">
          {unit.images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to photo ${index + 1}`}
              aria-current={index === current}
              className={cn(
                "h-2 transition-all duration-300",
                index === current
                  ? "w-8 bg-primary"
                  : "w-2 bg-border hover:bg-muted-foreground",
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => api?.scrollNext()}
          className="inline-flex size-11 items-center justify-center rounded-sm border border-border text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Next photo"
        >
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

export function Residences() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const baseId = useId();

  const onTabKey = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setActive((i) => (i + 1) % UNITS.length);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      setActive((i) => (i - 1 + UNITS.length) % UNITS.length);
    }
  };

  const unit = UNITS[active];

  return (
    <section
      id="residences"
      aria-labelledby="residences-heading"
      className="scroll-mt-24 bg-secondary/40 py-24 md:py-32"
    >
      <div className="main-container">
        <Reveal className="mx-auto max-w-[52ch] text-center">
          <Kicker tone="gold" className="justify-center">
            The Residences
          </Kicker>
          <h2
            id="residences-heading"
            className="mt-6 font-heading text-h2 font-light text-balance text-foreground"
          >
            Two homes. One careful idea.
          </h2>
          <p className="mt-6 text-body text-muted-foreground">
            Forty- and sixty-square-metre lofts that share a single DNA: warm
            materials, honest proportions, and light wherever it can reach.
          </p>
        </Reveal>

        <Reveal className="mt-12 flex justify-center md:mt-16">
          <div
            role="tablist"
            aria-label="Choose a residence"
            onKeyDown={onTabKey}
            className="inline-flex gap-1 rounded-md border border-border bg-card p-1.5"
          >
            {UNITS.map((u, index) => (
              <button
                key={u.key}
                role="tab"
                type="button"
                id={`${baseId}-tab-${index}`}
                aria-selected={active === index}
                aria-controls={`${baseId}-panel-${index}`}
                tabIndex={active === index ? 0 : -1}
                onClick={() => setActive(index)}
                className={cn(
                  "relative px-6 py-3 text-caption font-medium uppercase tracking-label transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-10",
                  active === index
                    ? "text-primary-foreground"
                    : "text-foreground/70 hover:text-foreground",
                )}
              >
                {active === index && (
                  <motion.span
                    layoutId="residence-tab-indicator"
                    aria-hidden
                    transition={{
                      duration: reduceMotion ? 0 : 0.3,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute inset-0 rounded-sm bg-primary"
                  />
                )}
                <span className="relative z-10">{u.tab}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <div
          role="tabpanel"
          id={`${baseId}-panel-${active}`}
          aria-labelledby={`${baseId}-tab-${active}`}
          className="mt-14"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={unit.key}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16"
            >
              <div className="order-2 lg:order-1 lg:col-span-5">
                <Kicker tone="gold">{unit.subtitle}</Kicker>
                <h3 className="mt-4 font-heading text-h3 font-normal text-foreground">
                  {unit.name}
                </h3>
                <p className="mt-3 text-caption font-medium uppercase tracking-label text-foreground/65">
                  {unit.specs}
                </p>
                <p className="mt-6 max-w-[48ch] text-body text-muted-foreground">
                  {unit.body}
                </p>

                <div className="mt-10">
                  <p className="text-caption font-medium uppercase tracking-label text-muted-foreground">
                    Floor plans
                  </p>
                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {unit.floorPlans.map((plan) => (
                      <figure
                        key={plan.label}
                        className="rounded-md border border-border bg-card p-4"
                      >
                        <figcaption className="mb-3 text-caption font-medium uppercase tracking-label text-muted-foreground">
                          {plan.label}
                        </figcaption>
                        <Image
                          src={plan.src}
                          alt={`${unit.name} — ${plan.label} floor plan`}
                          width={600}
                          height={600}
                          className="h-auto w-full object-contain"
                        />
                      </figure>
                    ))}
                  </div>
                </div>

                <CtaLink href="/contacts" variant="link" className="mt-8">
                  Ask about the {unit.name}
                </CtaLink>
              </div>

              <div className="order-1 lg:order-2 lg:col-span-7">
                <UnitCarousel unit={unit} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
