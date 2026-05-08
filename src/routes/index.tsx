import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CosmicBg } from "@/components/cosmic/CosmicBg";
import { AIOrb } from "@/components/cosmic/AIOrb";
import { MemoryCard } from "@/components/cosmic/MemoryCard";
import { store } from "@/lib/store";
import { ArrowRight, Brain, Orbit, Sparkles, Play, Search, Heart, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Life Replay — The AI Memory Operating System" },
      { name: "description", content: "Capture, replay, and understand your life with an AI that remembers what matters." },
      { property: "og:title", content: "Life Replay — The AI Memory Operating System" },
      { property: "og:description", content: "Capture, replay, and understand your life with an AI that remembers what matters." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const memories = store.getMemories().slice(0, 3);
  return (
    <div className="relative">
      <CosmicBg dense />
      <Header />
      <Hero />
      <Features />
      <ReplayPreview memories={memories} />
      <GalaxyPreview />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 glass border-b border-white/5">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-orb glow-cyan" />
          <span className="font-display text-lg font-semibold">Life Replay</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">Sign in</Link>
          <Link to="/onboarding"
            className="inline-flex items-center gap-1.5 rounded-full bg-aurora px-4 py-2 text-sm font-medium text-black/90 shadow-lg transition hover:scale-105">
            Begin <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pt-20 md:pt-32 pb-32 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-widest text-primary/90">
        <Sparkles className="h-3 w-3" /> The AI Memory Operating System
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1 }}
        className="mx-auto mt-8 max-w-5xl font-display text-5xl md:text-7xl lg:text-8xl font-semibold leading-[1.05] tracking-tight">
        <span className="text-aurora glow-text-cyan">Replay your life.</span><br />
        <span className="text-foreground/95">Understand who you became.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}
        className="mx-auto mt-8 max-w-2xl text-lg md:text-xl text-muted-foreground">
        Capture moments, feelings, and ideas. An emotionally intelligent AI weaves them into
        a living universe you can search, replay, and feel — forever.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link to="/onboarding"
          className="group inline-flex items-center gap-2 rounded-full bg-aurora px-7 py-3.5 text-base font-medium text-black/90 shadow-2xl transition hover:scale-105">
          Enter your universe <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
        <Link to="/login"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-base text-foreground backdrop-blur-md transition hover:bg-white/10">
          Sign in
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 1.2 }}
        className="relative mx-auto mt-24 flex items-center justify-center">
        <AIOrb size={320} floating />
      </motion.div>
    </section>
  );
}

const FEATURES = [
  { icon: Brain,    title: "Emotionally Intelligent",  body: "Your memories are read with empathy. The AI surfaces themes, moods, and the threads connecting them." },
  { icon: Orbit,    title: "A Living Memory Galaxy",   body: "Watch your life form constellations. Moments cluster, glow, and orbit by emotion and meaning." },
  { icon: Search,   title: "Search Like You Think",    body: "Ask in natural language: 'late-night ideas', 'when I felt brave', 'conversations that mattered.'" },
  { icon: Play,     title: "Cinematic Replay",         body: "Re-experience curated moments. On This Day, this mood, this person — wrapped in light." },
  { icon: Heart,    title: "Private by Design",        body: "Your memories belong to you. End-to-end care, on-device first, encrypted in transit." },
  { icon: Zap,      title: "Effortless Capture",       body: "Type, speak, or upload an image. The AI handles tags, summaries, and connections." },
];

function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-16 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-primary/90">
          <Sparkles className="h-3 w-3" /> Features
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-aurora">A new way to remember</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div key={f.title}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.6 }}
            className="glass group relative overflow-hidden rounded-2xl p-7 transition hover:bg-white/[0.07]">
            <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-aurora opacity-15 blur-3xl transition group-hover:opacity-30" />
            <div className="relative">
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary glow-cyan">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ReplayPreview({ memories }: { memories: ReturnType<typeof store.getMemories> }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-12 text-center">
        <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-aurora">A glimpse of your replay</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Preview of what your weeks will feel like.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {memories.map((m, i) => <MemoryCard key={m.id} memory={m} index={i} />)}
      </div>
    </section>
  );
}

function GalaxyPreview() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24">
      <div className="glass relative overflow-hidden rounded-3xl p-10 md:p-16">
        <div className="absolute inset-0 grid-cosmic opacity-30" />
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-aurora opacity-30 blur-3xl" />
        <div className="relative grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-aurora">Your Memory Galaxy</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Every moment is a star. Every emotion, a constellation. The AI maps the
              gravitational pull between your experiences — so the shape of your inner life
              becomes visible.
            </p>
            <Link to="/onboarding"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-6 py-3 text-sm font-medium text-primary transition hover:bg-primary/20">
              Explore the galaxy <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative aspect-square">
            {/* Mini galaxy preview */}
            <div className="absolute inset-0 animate-spin-slow">
              {Array.from({ length: 18 }).map((_, i) => {
                const angle = (i / 18) * Math.PI * 2;
                const r = 35 + (i % 3) * 12;
                const x = 50 + Math.cos(angle) * r;
                const y = 50 + Math.sin(angle) * r;
                const colors = ["var(--cyan-glow)", "var(--fuchsia-glow)", "var(--violet-glow)"];
                const c = colors[i % 3];
                return (
                  <div key={i}
                    className="absolute h-2 w-2 rounded-full animate-twinkle"
                    style={{
                      left: `${x}%`, top: `${y}%`,
                      background: c,
                      boxShadow: `0 0 12px ${c}, 0 0 24px ${c}`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                );
              })}
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <AIOrb size={140} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  { name: "Aria N.",  role: "Designer",   quote: "It's the first product that made my own life feel cinematic." },
  { name: "Kenji R.", role: "Founder",    quote: "I searched 'when I felt brave' and watched my year reframe itself." },
  { name: "Mira S.",  role: "Writer",     quote: "Like a journal that finally listens — and remembers like a friend." },
];
function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.div key={t.name}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="glass rounded-2xl p-7">
            <p className="mb-5 text-lg leading-relaxed text-foreground/90">"{t.quote}"</p>
            <div className="text-sm">
              <div className="font-medium text-foreground">{t.name}</div>
              <div className="text-muted-foreground">{t.role}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24 text-center">
      <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight text-aurora">
        Begin your replay.
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
        Free to start. Your memories, your universe — built one moment at a time.
      </p>
      <Link to="/onboarding"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-aurora px-8 py-4 text-base font-medium text-black/90 shadow-2xl transition hover:scale-105">
        Enter Life Replay <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-10 text-center text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-orb" />
          <span className="font-display text-foreground">Life Replay</span>
        </div>
        <div>© {new Date().getFullYear()} — The future of human memory.</div>
      </div>
    </footer>
  );
}
