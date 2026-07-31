"use client";

import { motion } from "motion/react";
import Image from "next/image";

import StackingCards, {
  StackingCardItem,
} from "@/components/fancy/blocks/stacking-cards";
import { Kicker } from "@/components/ui/kicker";

type Amenity = {
  eyebrow: string;
  title: string;
  desc: string;
  img: string;
  alt: string;
};

const AMENITIES: Amenity[] = [
  {
    eyebrow: "Elevated Vitality",
    title: "Panoramic Gym",
    desc: "A bright, energising fitness centre with professional-grade equipment and a warm wood-slatted ceiling — push your limits with the horizon in view.",
    img: "/assets/amenities/gym.png",
    alt: "The panoramic gym at Aleevia Carter, wood-slatted ceiling and equipment beside floor-to-ceiling windows.",
  },
  {
    eyebrow: "The Spirit of Play",
    title: "Rooftop Sports Court",
    desc: "An open-air, multi-purpose court on the roof — a friendly match or a morning shoot-around under the wide city sky.",
    img: "/assets/amenities/sports-court.png",
    alt: "The rooftop multi-purpose sports court under an open sky.",
  },
  {
    eyebrow: "Sunset Socials",
    title: "Roofdeck Lounge",
    desc: "An expansive rooftop lounge with plush seating and architectural umbrellas — the vantage point for golden-hour gatherings and quiet evenings.",
    img: "/assets/amenities/roof-deck-lounge.png",
    alt: "The roofdeck lounge with timber decking, lounge seating, and parasols at dusk.",
  },
  {
    eyebrow: "Effortless Convenience",
    title: "Laundry Suite",
    desc: "A high-end laundry suite with modern appliances and ample timber cabinetry — everyday home management, made to feel light.",
    img: "/assets/amenities/laundry-room.png",
    alt: "The shared laundry suite with stacked machines and warm wood shelving.",
  },
];

export function Amenities() {
  return (
    <section id="amenities" className="scroll-mt-24 py-24 md:py-32">
      <div className="main-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <Kicker tone="gold">Lifestyle Features</Kicker>
          <h2 className="mt-6 font-heading text-h2 font-light text-balance text-foreground">
            Crafted for limitless living.
          </h2>
          <p className="mt-6 max-w-[52ch] text-body text-muted-foreground">
            Amenities as considered as the homes themselves — a Japandi
            sanctuary that blurs the line between quiet focus and easy play.
          </p>
        </motion.div>
      </div>

      <StackingCards totalCards={AMENITIES.length} className="main-container">
        {AMENITIES.map((item, index) => (
          <StackingCardItem
            key={item.title}
            index={index}
            className="h-[78vh] pb-6 md:h-[82vh]"
          >
            <div className="relative h-full w-full overflow-hidden rounded-md bg-muted">
              <Image
                src={item.img}
                alt={item.alt}
                fill
                sizes="(min-width: 1280px) 80vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/25 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 lg:p-16">
                <div className="max-w-2xl">
                  <span
                    aria-hidden
                    className="block font-heading text-6xl font-light leading-none text-gold md:text-7xl"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-4 text-caption font-medium uppercase tracking-kicker text-background/80">
                    {item.eyebrow}
                  </p>
                  <h3 className="mt-2 font-heading text-h3 font-normal text-background">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-lg text-body text-background/85">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          </StackingCardItem>
        ))}
      </StackingCards>
    </section>
  );
}
