"use client";

import Image from "next/image";
import { motion } from "motion/react";
import StackingCards, { StackingCardItem } from "@/components/fancy/blocks/stacking-cards";

const loungeImg = "/assets/amenities/lounge-area.png";
const fitnessImg = "/assets/amenities/fitness-center.png";
const poolImg = "/assets/amenities/pool-deck.png";
const lobbyImg = "/assets/amenities/lobby-entrance.png";

const amenities = [
  {
    img: loungeImg,
    title: "Rooftop Deck",
    desc: "An expansive roofdeck lounge that is as intentional as the homes themselves — take in the skyline from the outdoor terrace while unwinding in curated comfort.",
  },
  {
    img: poolImg,
    title: "Panoramic Gym",
    desc: "A state-of-the-art panoramic gym where high-end productivity meets wellness. Recharge with panoramic city views and premium fitness equipment.",
  },
  {
    img: fitnessImg,
    title: "Sports Court",
    desc: "A full-sized, floodlit court for residents who bring the same intensity to play as they do to life — purpose-built for active living.",
  },
  {
    img: lobbyImg,
    title: "Laundry Lounge",
    desc: "A warm, thoughtfully designed communal space with premium appliances, integrated sinks, and timber shelving — because even everyday moments deserve elegance.",
  },
];

export function AmenitiesSection() {
  return (
    <section className="bg-background py-28 md:py-40">
      <div className="main-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 md:mb-28"
        >
          <p className="text-[0.7rem] tracking-[0.3em] uppercase text-muted-foreground font-medium mb-4">
            Lifestyle Features
          </p>
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground max-w-3xl leading-[1.1]">
            Crafted for Limitless Living
          </h2>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            A sophisticated fusion of organic tranquility and high-utility urban living — every detail has been masterfully considered to expand your lifestyle.
          </p>
        </motion.div>
      </div>

      {/* Stacking Cards */}
      <StackingCards
        totalCards={amenities.length}
        className="main-container relative"
      >
        {amenities.map((item, index) => {
          const number = String(index + 1).padStart(2, "0");

          return (
            <StackingCardItem
              key={index}
              index={index}
              className="h-[80vh] md:h-[85vh] pb-6"
            >
              <div className="relative w-full h-full overflow-hidden bg-zinc-100">
                {/* Background Image */}
                <Image
                  src={item.img}
                  alt={item.title}
                  width={1920}
                  height={1080}
                  className="w-full h-full object-cover"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-14">
                  <div className="flex items-end justify-between gap-8">
                    <div className="max-w-xl">
                      <span className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white/20 leading-none select-none block mb-3">
                        {number}
                      </span>
                      <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-semibold text-white tracking-tight">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm md:text-base text-white/80 leading-relaxed max-w-lg">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </StackingCardItem>
          );
        })}
      </StackingCards>
    </section>
  );
}
