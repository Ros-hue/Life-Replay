import { motion } from "framer-motion";
import type { Memory } from "@/lib/store";
import { EMOTION_COLORS } from "@/lib/store";
import { Play, Sparkles } from "lucide-react";

export function MemoryCard({ memory, onReplay, index = 0 }: {
  memory: Memory; onReplay?: (m: Memory) => void; index?: number;
}) {
  const grad = EMOTION_COLORS[memory.emotion];
  const date = new Date(memory.createdAt).toLocaleDateString(undefined, {
    month: "short", day: "numeric", year: "numeric",
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="glass group relative overflow-hidden rounded-2xl p-6 transition"
    >
      {/* Glow accent */}
      <div className={`absolute -top-20 -right-20 h-48 w-48 rounded-full bg-gradient-to-br ${grad} opacity-20 blur-3xl transition group-hover:opacity-40`} />
      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${grad} px-3 py-1 text-xs font-medium text-black/80`}>
            <Sparkles className="h-3 w-3" /> {memory.emotion}
          </span>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
        <p className="mb-4 text-base leading-relaxed text-foreground/90">{memory.text}</p>
        <p className="mb-4 text-sm italic text-muted-foreground">"{memory.summary}"</p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {memory.tags.map(t => (
              <span key={t} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-muted-foreground">
                #{t}
              </span>
            ))}
          </div>
          {onReplay && (
            <button
              onClick={() => onReplay(memory)}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition hover:bg-primary/20"
            >
              <Play className="h-3 w-3" /> Replay
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
