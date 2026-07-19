"use client";

import { MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useId, useRef, useState } from "react";

import { ConciergePanel } from "@/components/concierge/concierge-panel";
import { CONCIERGE } from "@/lib/site";

/**
 * Concierge entry point. Without a configured API the widget stays the
 * original display-only presence badge; with one it becomes a floating
 * button that opens the live chat panel.
 */
export function ConciergeChat() {
  if (!CONCIERGE.isConfigured) return <ConciergeBadge />;
  return <ConciergeWidget />;
}

/** The pre-chat presence badge, unchanged from the original component. */
function ConciergeBadge() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 1.1 }}
      className="pointer-events-none fixed bottom-5 right-5 z-40 select-none sm:bottom-7 sm:right-7"
    >
      <div className="inline-flex items-center gap-3 rounded-sm bg-emerald px-5 py-3.5 text-emerald-foreground shadow-lg shadow-emerald/30 ring-1 ring-gold/30">
        <span className="relative flex items-center justify-center text-gold">
          <MessageCircle className="size-4" />
          <span className="absolute -right-1 -top-1 flex size-2">
            {!reduceMotion && (
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold/70" />
            )}
            <span className="relative inline-flex size-2 rounded-full bg-gold" />
          </span>
        </span>
        <span className="text-caption font-medium uppercase tracking-label">
          Concierge
        </span>
      </div>
    </motion.div>
  );
}

function ConciergeWidget() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const fabRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const close = useCallback(() => {
    setOpen(false);
    fabRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={
              reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduceMotion
                ? { opacity: 0, transition: { duration: 0.15 } }
                : {
                    opacity: 0,
                    y: 8,
                    scale: 0.98,
                    transition: { duration: 0.2 },
                  }
            }
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed bottom-[5.5rem] right-5 z-50 h-[min(32rem,calc(100dvh-8rem))] w-[min(24rem,calc(100vw-2.5rem))] sm:bottom-[6.75rem] sm:right-7"
          >
            <ConciergePanel panelId={panelId} onClose={close} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={fabRef}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close concierge chat" : "Open concierge chat"}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 1.1 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-3 rounded-sm bg-emerald px-5 py-3.5 text-emerald-foreground shadow-lg shadow-emerald/30 ring-1 ring-gold/30 transition-colors hover:bg-emerald/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:bottom-7 sm:right-7"
      >
        <span className="relative flex items-center justify-center text-gold">
          {open ? (
            <X className="size-4" aria-hidden />
          ) : (
            <MessageCircle className="size-4" aria-hidden />
          )}
          {!open && (
            <span className="absolute -right-1 -top-1 flex size-2" aria-hidden>
              {!reduceMotion && (
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold/70" />
              )}
              <span className="relative inline-flex size-2 rounded-full bg-gold" />
            </span>
          )}
        </span>
        <span className="text-caption font-medium uppercase tracking-label">
          {open ? "Close" : "Concierge"}
        </span>
      </motion.button>
    </>
  );
}
