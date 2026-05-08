import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CosmicBg } from "@/components/cosmic/CosmicBg";
import { AIOrb } from "@/components/cosmic/AIOrb";
import { store } from "@/lib/store";
import { ArrowRight, Brain, Orbit, Sparkles } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Begin — Life Replay" }] }),
  component: Onboarding,
});

const STEPS = [
  { icon: Sparkles, title: "Welcome to Life Replay",
    body: "An emotionally intelligent operating system for everything you'll want to remember." },
  { icon: Brain, title: "Capture any moment",
    body: "Type a thought. Speak it. Drop in an image. Choose how it felt. The AI does the rest." },
  { icon: Orbit, title: "An AI that understands you",
    body: "Themes, moods, and threads emerge — your inner life made visible." },
  { icon: Sparkles, title: "Replay your life",
    body: "Search naturally, revisit cinematically, and discover patterns you never noticed." },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const nav = useNavigate();
  const Step = STEPS[i];
  const last = i === STEPS.length - 1;

  const next = () => {
    if (last) { store.setOnboarded(true); nav({ to: "/signup" }); return; }
    setI(i + 1);
  };

  return (
    <div className="relative min-h-screen">
      <CosmicBg dense />
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <AIOrb size={200} floating />
        <AnimatePresence mode="wait">
          <motion.div key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-primary/90">
              <Step.icon className="h-3 w-3" /> Step {i + 1} of {STEPS.length}
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight text-aurora">{Step.title}</h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">{Step.body}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex items-center gap-2">
          {STEPS.map((_, idx) => (
            <div key={idx}
              className={`h-1 rounded-full transition-all ${idx === i ? "w-10 bg-aurora" : "w-4 bg-white/10"}`} />
          ))}
        </div>

        <div className="mt-10 flex items-center gap-3">
          {i > 0 && (
            <button onClick={() => setI(i - 1)}
              className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-foreground transition hover:bg-white/10">
              Back
            </button>
          )}
          <button onClick={next}
            className="group inline-flex items-center gap-2 rounded-full bg-aurora px-7 py-3 text-sm font-medium text-black/90 shadow-2xl transition hover:scale-105">
            {last ? "Create your account" : "Continue"}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
