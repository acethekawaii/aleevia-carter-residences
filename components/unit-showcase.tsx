"use client"
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const u1Entry = "/assets/interior/unit-1/entryway.png";
const u1Study = "/assets/interior/unit-1/study-area.png";
const u1Bed = "/assets/interior/unit-1/master-bedroom.png";
const u1Level1 = "/assets/floor-plan/unit-1-level-1.png";
const u1Mezz = "/assets/floor-plan/unit-1-mezzanine.png";

const u7Liv = "/assets/interior/unit-7/living-room.png";
const u7Kit = "/assets/interior/unit-7/kitchen.png";
const u7Bed = "/assets/interior/unit-7/bedroom.png";
const u7Bath = "/assets/interior/unit-7/bathroom.png";
const u7Balc = "/assets/interior/unit-7/balcony.png";
const u7Level1 = "/assets/floor-plan/unit-7-level-1.png";
const u7Mezz = "/assets/floor-plan/unit-7-mezzanine.png";
const units = {
  "the-mezzanine": {
    name: "The 1-Bedroom Unit",
    subtitle: "Your Seamless Live-Work Experience",
    specs: "1 Bed  ·  1 Bath  ·  40 sqm",
    desc: "Step into a space designed for the modern professional, where productivity and relaxation coexist without compromise. On Level 1, you'll find a dedicated and expansive Work Area featuring a built-in desk positioned perfectly near the window ledge. When the day is done, retreat to the Mezzanine — your private Owner's Sanctuary.",
    images: [u1Entry, u1Study, u1Bed],
    floorPlans: [
      { label: "Level 1", img: u1Level1 },
      { label: "Mezzanine", img: u1Mezz },
    ],
  },
  "the-panorama": {
    name: "The 2-Bedroom Unit",
    subtitle: "Designed to Be the Heart of Your Story",
    specs: "2 Bed  ·  1 Bath  ·  60 sqm",
    desc: "For those who love to host, this unit offers an open-concept layout that turns every gathering into an event. Level 1 is built for entertaining, centered around a large, welcoming L-shaped sofa and a defined four-seater dining area. The experience continues on the Mezzanine — home to a versatile Entertainment Loft.",
    images: [u7Liv, u7Kit, u7Bed, u7Bath, u7Balc],
    floorPlans: [
      { label: "Level 1", img: u7Level1 },
      { label: "Mezzanine", img: u7Mezz },
    ],
  }
}

function UnitCarousel({ images, unitName }: { images: string[]; unitName: string }) {
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
    return () => { api.off("select", onSelect); };
  }, [api, onSelect]);
  function scrollPrev() { api?.scrollPrev(); }
  function scrollNext() { api?.scrollNext(); }
  function scrollTo(idx: number) { api?.scrollTo(idx); }
  return (
    <Carousel className="w-full" setApi={setApi}>
      <CarouselContent>
        {images.map((img, idx) => (
          <CarouselItem key={idx}>
            <div className="relative aspect-[4/3] md:aspect-[16/11] w-full overflow-hidden">
              <Image
                src={img}
                alt={`${unitName} interior ${idx + 1}`}
                width={1600}
                height={1100}
                className="w-full h-full object-cover"
                priority={idx === 0}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* Navigation: Arrow ← | Dots | Arrow → */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <button
          onClick={scrollPrev}
          className="w-12 h-12 border border-zinc-300 flex items-center justify-center hover:bg-zinc-100 transition-colors"
          aria-label="Previous slide"
        >
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <div className="flex items-center gap-2.5">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={`transition-all duration-300 ${
                idx === current
                  ? "w-8 h-2 bg-foreground"
                  : "w-2 h-2 bg-zinc-300 hover:bg-zinc-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <button
          onClick={scrollNext}
          className="w-12 h-12 border border-zinc-300 flex items-center justify-center hover:bg-zinc-100 transition-colors"
          aria-label="Next slide"
        >
          <ArrowRight className="w-4 h-4 text-foreground" />
        </button>
      </div>
    </Carousel>
  );
}

export function UnitShowcase() {
  return (
    <section id="residences" className="bg-zinc-50 py-28 md:py-40 border-t border-zinc-200">
      <div className="main-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 md:mb-24 text-center"
        >
          <p className="text-[0.7rem] tracking-[0.3em] uppercase text-muted-foreground font-medium mb-4">
            The Concept
          </p>
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1]">
            Small Details, Big Differences
          </h2>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We believe that luxury is found in the intentionality of design. Each space is engineered to maximize light and provide a refined, relaxed sanctuary.
          </p>
        </motion.div>
        <Tabs defaultValue="the-mezzanine" className="w-full">
          {/* Tab Triggers */}
          <div className="flex justify-center mb-16 md:mb-20">
            <TabsList className="bg-white border border-zinc-200 p-1.5 shadow-sm h-auto flex gap-1 w-full max-w-md justify-between">
              <TabsTrigger
                value="the-mezzanine"
                className="px-6 md:px-8 py-3 text-sm md:text-base grow data-[state=active]:bg-zinc-900 data-[state=active]:text-white transition-all font-medium tracking-wide"
              >
                1-Bedroom
              </TabsTrigger>
              <TabsTrigger
                value="the-panorama"
                className="px-6 md:px-8 py-3 text-sm md:text-base grow data-[state=active]:bg-zinc-900 data-[state=active]:text-white transition-all font-medium tracking-wide"
              >
                2-Bedroom
              </TabsTrigger>
            </TabsList>
          </div>
          {Object.entries(units).map(([key, unit]) => (
            <TabsContent key={key} value={key} className="mt-0 outline-none">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start"
              >
                {/* Left: Info & Floor Plans */}
                <div className="flex flex-col order-2 lg:order-1 lg:col-span-5 pt-2">
                  <p className="text-[0.7rem] tracking-[0.3em] uppercase text-muted-foreground font-medium mb-3">
                    {unit.subtitle}
                  </p>
                  <h3 className="font-heading text-3xl md:text-4xl font-semibold text-foreground tracking-tight">
                    {unit.name}
                  </h3>
                  <p className="mt-3 text-sm font-medium tracking-[0.15em] text-muted-foreground uppercase">
                    {unit.specs}
                  </p>
                  <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
                    {unit.desc}
                  </p>
                  {/* Side-by-side Floor Plans */}
                  <div className="mt-12">
                    <p className="text-[0.7rem] tracking-[0.3em] uppercase text-muted-foreground font-medium mb-5">
                      Floor Plans
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {unit.floorPlans.map((plan) => (
                        <div key={plan.label} className="bg-white border border-zinc-200 p-4 md:p-5">
                          <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-medium mb-3">
                            {plan.label}
                          </p>
                          <div className="relative w-full">
                            <Image
                              src={plan.img}
                              alt={`${unit.name} — ${plan.label} Floor Plan`}
                              width={600}
                              height={600}
                              className="w-full h-auto object-contain"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Right: Images Carousel */}
                <div className="order-1 lg:order-2 lg:col-span-7">
                  <UnitCarousel images={unit.images} unitName={unit.name} />
                </div>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}