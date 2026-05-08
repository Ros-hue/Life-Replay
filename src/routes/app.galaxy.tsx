import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/cosmic/AppShell";
import { store, EMOTION_COLORS, type Memory } from "@/lib/store";
import { Play, X } from "lucide-react";

export const Route = createFileRoute("/app/galaxy")({
  head: () => ({ meta: [{ title: "Memory Galaxy — Life Replay" }] }),
  component: Galaxy,
});

interface Node { m: Memory; x: number; y: number; r: number; }

function Galaxy() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [active, setActive] = useState<Memory | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMemories(store.getMemories()); }, []);

  const nodes: Node[] = useMemo(() => {
    return memories.map((m, i) => {
      const ring = Math.floor(i / 6);
      const angle = (i % 6) * (Math.PI * 2 / 6) + ring * 0.5;
      const r = 18 + ring * 14 + (i % 2) * 4;
      return {
        m,
        x: 50 + Math.cos(angle) * r,
        y: 50 + Math.sin(angle) * r * 0.85,
        r: 14 + (i % 3) * 4,
      };
    });
  }, [memories]);

  // Connections between nearby nodes
  const lines = useMemo(() => {
    const out: { a: Node; b: Node }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < 22) out.push({ a: nodes[i], b: nodes[j] });
      }
    }
    return out;
  }, [nodes]);

  return (
    <>
      <PageHeader eyebrow="Memory Galaxy" title="Your inner cosmos" subtitle="Each star is a moment. Each thread, an emotional connection." />

      <div ref={containerRef}
        className="glass relative h-[70vh] overflow-hidden rounded-3xl">
        <div className="absolute inset-0 grid-cosmic opacity-25" />
        {/* Drifting nebulae */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-30 blur-3xl animate-drift"
          style={{ background: "radial-gradient(circle, var(--cyan-glow), transparent 60%)" }} />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full opacity-30 blur-3xl animate-drift"
          style={{ background: "radial-gradient(circle, var(--fuchsia-glow), transparent 60%)", animationDelay: "-5s" }} />

        <svg className="absolute inset-0 h-full w-full">
          {lines.map((l, i) => (
            <line key={i}
              x1={`${l.a.x}%`} y1={`${l.a.y}%`} x2={`${l.b.x}%`} y2={`${l.b.y}%`}
              stroke="url(#auroraLine)" strokeWidth={0.8} opacity={0.35} />
          ))}
          <defs>
            <linearGradient id="auroraLine" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%"  stopColor="oklch(0.82 0.18 200)" />
              <stop offset="100%" stopColor="oklch(0.78 0.22 330)" />
            </linearGradient>
          </defs>
        </svg>

        {nodes.map((n, i) => (
          <motion.button
            key={n.m.id}
            onClick={() => setActive(n.m)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: [0, -8, 0] }}
            transition={{
              scale: { delay: i * 0.04, duration: 0.6 },
              y: { duration: 4 + (i % 4), repeat: Infinity, ease: "easeInOut" },
            }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br ${EMOTION_COLORS[n.m.emotion]}`}
            style={{
              left: `${n.x}%`, top: `${n.y}%`,
              width: n.r, height: n.r,
              boxShadow: `0 0 ${n.r}px oklch(0.82 0.18 200 / 0.6), 0 0 ${n.r * 2}px oklch(0.78 0.22 330 / 0.4)`,
            }}
            aria-label={n.m.summary}
          />
        ))}

        {/* Twinkling background stars */}
        {Array.from({ length: 60 }).map((_, i) => (
          <span key={i}
            className="absolute h-0.5 w-0.5 rounded-full bg-white animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-6"
            onClick={() => setActive(null)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="glass-strong relative w-full max-w-lg rounded-3xl p-8 shadow-2xl">
              <button onClick={() => setActive(null)}
                className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
              <div className={`mb-4 inline-block rounded-full bg-gradient-to-r ${EMOTION_COLORS[active.emotion]} px-3 py-1 text-xs font-medium text-black/80`}>
                {active.emotion}
              </div>
              <p className="text-lg leading-relaxed text-foreground">{active.text}</p>
              <p className="mt-4 text-sm italic text-muted-foreground">"{active.summary}"</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {active.tags.map(t => (
                  <span key={t} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-muted-foreground">#{t}</span>
                ))}
              </div>
              <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-aurora px-5 py-2 text-sm font-medium text-black/90">
                <Play className="h-4 w-4" /> Replay this moment
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
