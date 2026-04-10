"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section id="contact" className="relative py-20 sm:py-28 md:py-36 bg-zinc-50 text-foreground overflow-hidden">
      {/* Subtle warm ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[700px] h-[500px] md:h-[700px] bg-zinc-200/40 rounded-full blur-[120px] md:blur-[140px]" />
      </div>

      <div className="relative z-10 main-container text-center flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[0.65rem] sm:text-[0.7rem] tracking-[0.3em] uppercase text-muted-foreground font-medium mb-5 sm:mb-6"
        >
          Begin Your Journey
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] max-w-3xl"
        >
          A Place with No Limits
          <br />
          <span className="font-normal italic text-muted-foreground">
            and No Compromises.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg text-muted-foreground font-light max-w-xl leading-relaxed"
        >
          Step inside to discover a home where thoughtful design meets total
          comfort. Schedule a private viewing or browse our brochure.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 sm:mt-14 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center w-full sm:w-auto"
        >
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-3 bg-zinc-900 text-white w-full sm:w-auto px-8 py-4 text-sm font-medium tracking-wide hover:bg-zinc-800 transition-colors"
          >
            Schedule a Viewing
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#brochure"
            className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 text-sm font-medium tracking-wide border border-zinc-300 text-foreground hover:border-zinc-500 hover:bg-zinc-100 transition-all"
          >
            View Brochure
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
