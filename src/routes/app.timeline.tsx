import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/cosmic/AppShell";
import { MemoryCard } from "@/components/cosmic/MemoryCard";
import { store, type Memory } from "@/lib/store";

export const Route = createFileRoute("/app/timeline")({
  head: () => ({ meta: [{ title: "Timeline — Life Replay" }] }),
  component: Timeline,
});

function Timeline() {
  const nav = useNavigate();
  const [items, setItems] = useState<Memory[]>([]);
  useEffect(() => { setItems(store.getMemories()); }, []);

  return (
    <>
      <PageHeader
        eyebrow="Your timeline"
        title="A vertical replay of you"
        subtitle="AI-organized moments, woven by emotion and meaning."
      />

      <div className="relative">
        {/* Glowing spine */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/60 to-transparent" />
        <div className="space-y-10">
          {items.map((m, i) => {
            const left = i % 2 === 0;
            return (
              <div key={m.id} className="relative md:grid md:grid-cols-2 md:gap-12">
                {/* Node */}
                <motion.div
                  initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="absolute left-4 md:left-1/2 top-6 -translate-x-1/2 h-3 w-3 rounded-full bg-aurora glow-cyan" />
                <div className={`pl-12 md:pl-0 ${left ? "md:pr-12" : "md:order-2 md:pl-12"}`}>
                  <MemoryCard memory={m} index={i} onReplay={() => nav({ to: "/app/replay" })} />
                </div>
                <div className={left ? "hidden md:block" : "hidden md:block md:order-1"} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
