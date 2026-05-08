import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/cosmic/AppShell";
import { AIOrb } from "@/components/cosmic/AIOrb";
import { store, EMOTION_COLORS, type Memory } from "@/lib/store";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/replay")({
  head: () => ({ meta: [{ title: "Replay — Life Replay" }] }),
  component: Replay,
});

function Replay() {
  const [items, setItems] = useState<Memory[]>([]);
  const [i, setI] = useState(0);
  useEffect(() => { setItems(store.getMemories()); }, []);

  const m = items[i];
  const insight = useMemo(() => {
    if (!m) return "";
    return `You were most ${m.emotion.toLowerCase()} on this day — a thread that recurs in your story.`;
  }, [m]);

  if (!m) return null;
  const grad = EMOTION_COLORS[m.emotion];
  const prev = () => setI((i - 1 + items.length) % items.length);
  const next = () => setI((i + 1) % items.length);
  const date = new Date(m.createdAt).toLocaleDateString(undefined, {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <>
      <PageHeader eyebrow="Cinematic Replay" title="On this thread" subtitle="AI-curated moments, restaged with light." />

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div key={m.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="glass-strong relative overflow-hidden rounded-3xl p-10 md:p-16">
            <div className={`absolute -top-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br ${grad} opacity-30 blur-3xl`} />
            <div className={`absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br ${grad} opacity-20 blur-3xl`} />

            <div className="relative grid gap-12 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-primary/90">
                  <Sparkles className="h-3 w-3" /> {date}
                </div>
                <p className="font-display text-3xl md:text-5xl font-semibold leading-tight text-aurora">
                  "{m.text}"
                </p>
                <p className="mt-6 max-w-xl text-base text-muted-foreground">{m.summary}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className={`inline-block rounded-full bg-gradient-to-r ${grad} px-3 py-1 text-xs font-medium text-black/80`}>{m.emotion}</span>
                  {m.tags.map(t => (
                    <span key={t} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-muted-foreground">#{t}</span>
                  ))}
                </div>
                <div className="mt-10 glass rounded-xl p-4 text-sm text-foreground/80">
                  <span className="text-primary">AI insight: </span>{insight}
                </div>
              </div>

              <div className="flex justify-center">
                <AIOrb size={220} floating />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between">
          <button onClick={prev}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-foreground transition hover:bg-white/10">
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <div className="text-xs text-muted-foreground">{i + 1} / {items.length}</div>
          <button onClick={next}
            className="inline-flex items-center gap-2 rounded-full bg-aurora px-5 py-2 text-sm font-medium text-black/90 transition hover:scale-105">
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <h2 className="mt-16 mb-5 font-display text-2xl font-semibold tracking-tight text-aurora">Related threads</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {items.filter(x => x.emotion === m.emotion && x.id !== m.id).slice(0, 3).map(rel => (
          <button key={rel.id} onClick={() => setI(items.indexOf(rel))}
            className="glass group rounded-2xl p-5 text-left transition hover:bg-white/[0.07]">
            <div className={`mb-2 inline-block rounded-full bg-gradient-to-r ${EMOTION_COLORS[rel.emotion]} px-2.5 py-0.5 text-[10px] font-medium text-black/80`}>{rel.emotion}</div>
            <p className="text-sm text-foreground/90 line-clamp-3">{rel.text}</p>
          </button>
        ))}
      </div>
    </>
  );
}
