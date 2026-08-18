"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Kicker } from "@/components/ui/kicker";
import type { Testimonial } from "@/lib/testimonials";
import { cn } from "@/lib/utils";

export function Testimonials({ items }: { items: Testimonial[] }) {
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

  // Nothing published, or the API was unreachable. Render no heading, no frame
  // and no spacing — the surrounding sections must not depend on this existing.
  if (items.length === 0) return null;

  // One quote is the expected steady state, not an edge case: a 55%-wide card
  // with dead space beside it would read as a layout bug, and paging controls
  // that cannot page would be worse.
  const isSingle = items.length === 1;

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="border-t border-border bg-background py-24 md:py-32"
    >
      <div className="main-container mb-14 flex items-end justify-between gap-6 md:mb-20">
        <div>
          <Kicker tone="gold">Testimonials</Kicker>
          <h2
            id="testimonials-heading"
            className="mt-6 font-heading text-h2 font-light text-balance text-foreground"
          >
            In their own words.
          </h2>
        </div>
        {!isSingle && (
          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={() => api?.scrollPrev()}
              className="inline-flex size-11 items-center justify-center rounded-sm border border-border text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => api?.scrollNext()}
              className="inline-flex size-11 items-center justify-center rounded-sm border border-border text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Next testimonial"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        )}
      </div>

      <div className="main-container">
        <Carousel setApi={setApi} opts={{ align: "start", loop: true }}>
          <CarouselContent className="-ml-4 md:-ml-6">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className={cn(
                  "pl-4 md:pl-6",
                  isSingle
                    ? "basis-full"
                    : "basis-[85%] md:basis-[70%] lg:basis-[55%]",
                )}
              >
                <figure
                  className={cn(
                    "flex h-full flex-col justify-between rounded-md border border-border bg-secondary/40 p-8 md:p-10 lg:p-12",
                    isSingle && "mx-auto max-w-2xl",
                  )}
                >
                  <div>
                    <span
                      aria-hidden
                      className="block font-heading text-6xl leading-none text-gold/50 select-none"
                    >
                      &ldquo;
                    </span>
                    <blockquote className="mt-4">
                      <p className="font-heading text-h4 font-light leading-snug text-foreground">
                        {item.quote}
                      </p>
                    </blockquote>
                  </div>
                  <figcaption className="mt-10 border-t border-border pt-6">
                    <cite className="not-italic">
                      <span className="block text-caption font-semibold uppercase tracking-label text-foreground">
                        {item.authorName}
                      </span>
                      {item.authorTitle && (
                        <span className="mt-1 block text-small text-muted-foreground">
                          {item.authorTitle}
                        </span>
                      )}
                    </cite>
                  </figcaption>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {!isSingle && (
          <div className="mt-8 flex items-center justify-center gap-4 md:hidden">
            <button
              type="button"
              onClick={() => api?.scrollPrev()}
              className="inline-flex size-11 items-center justify-center rounded-sm border border-border text-foreground transition-colors hover:bg-secondary"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div className="flex items-center gap-2">
              {items.map((item, index) => (
                <span
                  key={`${item.id}-dot`}
                  className={cn(
                    "h-1.5 transition-all duration-300",
                    index === current ? "w-6 bg-primary" : "w-1.5 bg-border",
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => api?.scrollNext()}
              className="inline-flex size-11 items-center justify-center rounded-sm border border-border text-foreground transition-colors hover:bg-secondary"
              aria-label="Next testimonial"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
