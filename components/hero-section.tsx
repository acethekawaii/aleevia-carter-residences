"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import Floating, { FloatingElement } from "@/components/fancy/image/parallax-floating";

function scrollToResidences(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  const target = document.getElementById("residences");
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function HeroSection() {
  return (
    <section className="relative min-h-svh w-full flex items-center justify-center overflow-hidden bg-white">
      {/* Floating Images Layer — hidden on small mobile, progressively shown */}
      <Floating
        className="absolute inset-0 z-0 hidden md:block"
        sensitivity={1}
        easingFactor={0.04}
      >
        {/* Main building — large, top-right */}
        <FloatingElement
          depth={1}
          className="top-[4%] right-[4%]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="relative w-[280px] h-[370px] lg:w-[360px] lg:h-[470px] xl:w-[400px] xl:h-[520px] shadow-2xl shadow-zinc-300/50"
          >
            <Image
              src="/assets/hero-exterior.jpg"
              alt="Aleevia Carter Residences — Architectural exterior"
              width={800}
              height={1040}
              className="w-full h-full object-cover object-center"
              priority
            />
          </motion.div>
        </FloatingElement>

        {/* Pool deck — medium, bottom-left */}
        <FloatingElement
          depth={2.5}
          className="bottom-[10%] left-[5%]"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative w-[240px] h-[165px] lg:w-[300px] lg:h-[200px] shadow-xl shadow-zinc-300/40"
          >
            <Image
              src="/assets/amenities/pool-deck.png"
              alt="Pool deck with panoramic views"
              width={600}
              height={400}
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </FloatingElement>

        {/* Lounge — smaller, top-left */}
        <FloatingElement
          depth={3}
          className="top-[8%] left-[6%]"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="relative w-[200px] h-[145px] lg:w-[250px] lg:h-[175px] shadow-xl shadow-zinc-300/40"
          >
            <Image
              src="/assets/amenities/fitness-center.png"
              alt="Curated lounge area"
              width={500}
              height={350}
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </FloatingElement>

        {/* Lobby — small accent, bottom-right */}
        <FloatingElement
          depth={1.5}
          className="bottom-[12%] right-[8%]"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9 }}
            className="relative w-[210px] h-[155px] lg:w-[260px] lg:h-[185px] shadow-xl shadow-zinc-300/40"
          >
            <Image
              src="/assets/interior/unit-7/living-room.png"
              alt="Grand lobby entrance"
              width={520}
              height={370}
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </FloatingElement>

        {/* Reception — small, mid-left area */}
        <FloatingElement
          depth={2}
          className="top-[45%] left-[2%] -translate-y-1/2"
        >
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 1.1 }}
            className="relative w-[160px] h-[215px] lg:w-[190px] lg:h-[255px] shadow-xl shadow-zinc-300/40"
          >
            <Image
              src="/assets/interior/reception.png"
              alt="Warm interior reception"
              width={380}
              height={510}
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </FloatingElement>
      </Floating>

      {/* Mobile: Static image collage behind text — visible only on small screens */}
      <div className="absolute inset-0 z-0 md:hidden">
        <div className="absolute top-[6%] right-[4%] w-[140px] h-[190px] shadow-lg shadow-zinc-200/50">
          <Image
            src="/assets/hero-exterior.jpg"
            alt="Aleevia Carter Residences"
            width={280}
            height={380}
            className="w-full h-full object-cover"
            priority
          />
        </div>
        <div className="absolute bottom-[12%] left-[4%] w-[120px] h-[85px] shadow-lg shadow-zinc-200/50">
          <Image
            src="/assets/amenities/pool-deck.png"
            alt="Pool deck"
            width={240}
            height={170}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-[12%] left-[5%] w-[100px] h-[72px] shadow-lg shadow-zinc-200/50">
          <Image
            src="/assets/amenities/lounge-area.png"
            alt="Lounge area"
            width={200}
            height={144}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-[18%] right-[6%] w-[110px] h-[80px] shadow-lg shadow-zinc-200/50">
          <Image
            src="/assets/amenities/lobby-entrance.png"
            alt="Lobby entrance"
            width={220}
            height={160}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Center Text Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 sm:px-8 max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-[0.65rem] sm:text-[0.7rem] tracking-[0.3em] uppercase text-muted-foreground font-medium mb-6 sm:mb-8"
        >
          Premium Residences · Pasay City
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-heading text-[2.5rem] sm:text-5xl md:text-6xl xl:text-7xl font-semibold tracking-tight text-foreground leading-[1.08]"
        >
          Living, without
          <br />
          <span className="text-muted-foreground font-normal italic">
            boundaries.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-md"
        >
          A new standard for easy, sophisticated living — where every detail is
          intentional and every space is designed for you.
        </motion.p>

        <motion.a
          href="#residences"
          onClick={scrollToResidences}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="inline-flex items-center gap-3 mt-10 sm:mt-12 text-sm tracking-[0.15em] uppercase text-foreground font-medium group"
        >
          Explore Residences
          <span className="inline-flex items-center justify-center w-11 h-11 border border-zinc-300 transition-all duration-300 group-hover:bg-foreground group-hover:text-white group-hover:border-foreground">
            <ArrowDown className="w-4 h-4" />
          </span>
        </motion.a>
      </div>
    </section>
  );
}
