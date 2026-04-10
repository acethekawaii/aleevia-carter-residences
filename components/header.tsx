"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "About Us", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-zinc-200/50 py-3 md:py-3.5 shadow-sm shadow-zinc-100/50"
            : "bg-transparent py-4 md:py-5 lg:py-6"
        )}
      >
        <div className="main-container flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="font-heading text-[0.7rem] sm:text-[0.75rem] md:text-[0.8rem] font-semibold tracking-[0.3em] uppercase text-foreground transition-colors duration-500"
            aria-label="Aleevia Carter Residences — Home"
          >
            Aleevia Carter
          </a>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-7 lg:gap-10"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative text-[0.75rem] tracking-[0.14em] uppercase text-foreground/70 transition-colors duration-300 hover:text-foreground after:absolute after:bottom-[-3px] after:left-0 after:w-0 after:h-[1px] after:bg-foreground after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="text-[0.75rem] tracking-[0.14em] uppercase transition-all duration-400 px-5 lg:px-6 py-2.5 border border-foreground/20 text-foreground hover:bg-foreground hover:text-white hover:border-foreground"
            >
              Schedule Viewing
            </a>
          </nav>

          {/* Mobile Toggle — 44px touch target */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-11 h-11 flex flex-col items-center justify-center gap-1.5 text-foreground -mr-1.5"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span
              className={cn(
                "block w-6 h-[1.5px] bg-current transition-all duration-300 origin-center",
                mobileOpen && "rotate-45 translate-y-[4.5px]"
              )}
            />
            <span
              className={cn(
                "block w-6 h-[1.5px] bg-current transition-all duration-300 origin-center",
                mobileOpen && "-rotate-45 -translate-y-[4.5px]"
              )}
            />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center md:hidden"
          >
            <nav className="flex flex-col items-center gap-7" aria-label="Mobile navigation">
              {NAV_LINKS.map((link, idx) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.08, duration: 0.4 }}
                  className="font-heading text-xl sm:text-2xl font-medium tracking-wide text-foreground py-1"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mt-4 px-8 py-3.5 border border-foreground text-foreground text-sm tracking-[0.12em] uppercase hover:bg-foreground hover:text-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Schedule Viewing
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
