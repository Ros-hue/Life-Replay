import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AIOrb, Typewriter } from "./AIOrb";

const INSIGHTS = [
  "You are most creative during solitude.",
  "Your happiest memories involve meaningful conversations.",
  "Late nights spark your boldest ideas.",
  "Nature consistently restores your calm.",
  "Family moments anchor your strongest emotions.",
  "Your week leans inspired — keep capturing.",
];

/** Persistent AI companion docked at the bottom-right. */
export function FloatingOrb() {
  const [open, setOpen] = useState(false);
  const [insight, setInsight] = useState(INSIGHTS[0]);

  useEffect(() => {
    const id = setInterval(() => {
      setInsight(INSIGHTS[Math.floor(Math.random() * INSIGHTS.length)]);
    }, 9000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            className="glass-strong absolute bottom-24 right-0 w-72 rounded-2xl p-4 shadow-2xl"
          >
            <div className="mb-2 text-xs uppercase tracking-widest text-primary/80">
              AI Companion
            </div>
            <div className="text-sm leading-relaxed text-foreground/90">
              <Typewriter text={insight} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen((o) => !o)}
        className="group relative h-16 w-16 transition hover:scale-105"
        aria-label="AI companion"
      >
        <AIOrb size={64} />
      </button>
    </div>
  );
}
