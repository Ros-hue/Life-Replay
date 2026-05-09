import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/cosmic/AppShell";
import { MemoryCard } from "@/components/cosmic/MemoryCard";
import { store, type Memory } from "@/lib/store";
import { Search as SearchIcon, Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "moments I felt happy",
  "creative thoughts",
  "late night ideas",
  "important conversations",
  "when I felt peaceful",
];

export const Route = createFileRoute("/app/search")({
  head: () => ({ meta: [{ title: "Search — Life Replay" }] }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const [all, setAll] = useState<Memory[]>([]);
  useEffect(() => {
    setAll(store.getMemories());
  }, []);

  const results = useMemo(() => {
    if (!q.trim()) return all;
    const t = q.toLowerCase();
    return all
      .map((m) => {
        let score = 0;
        if (m.text.toLowerCase().includes(t)) score += 5;
        if (m.summary.toLowerCase().includes(t)) score += 3;
        if (m.emotion.toLowerCase().includes(t)) score += 4;
        if (m.tags.some((g) => t.includes(g) || g.includes(t))) score += 4;
        // semantic-ish keyword expansion
        const map: Record<string, string[]> = {
          happy: ["happy", "excited", "inspired"],
          sad: ["lonely", "emotional"],
          calm: ["calm", "peaceful"],
          creative: ["inspired", "ideas", "late-night"],
          night: ["late-night"],
          conversation: ["family", "friendship", "conversation"],
        };
        for (const [k, v] of Object.entries(map)) {
          if (t.includes(k) && v.some((x) => m.tags.includes(x) || m.emotion.toLowerCase() === x))
            score += 3;
        }
        return { m, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.m);
  }, [q, all]);

  return (
    <>
      <PageHeader
        eyebrow="AI Search"
        title="Ask your life a question"
        subtitle="Search how it felt, not just what was said."
      />

      <div className="glass-strong relative mb-6 rounded-2xl p-2">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
          <SearchIcon className="h-4 w-4 text-primary" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder='Try: "moments I felt brave"'
            className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          />
        </div>
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3" /> Try
        </span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setQ(s)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>

      {results.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">
          No constellations match that yet. Try another phrase.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {results.map((m, i) => (
            <MemoryCard key={m.id} memory={m} index={i} />
          ))}
        </div>
      )}
    </>
  );
}
