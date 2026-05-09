import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/cosmic/AppShell";
import { AIOrb } from "@/components/cosmic/AIOrb";
import { store, EMOTIONS, EMOTION_COLORS, type Emotion } from "@/lib/store";
import { Mic, Image as ImageIcon, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/capture")({
  head: () => ({ meta: [{ title: "Capture — Life Replay" }] }),
  component: Capture,
});

function Capture() {
  const nav = useNavigate();
  const [text, setText] = useState("");
  const [emotion, setEmotion] = useState<Emotion>("Inspired");
  const [recording, setRecording] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const save = () => {
    if (!text.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      store.addMemory({ text: text.trim(), emotion });
      nav({ to: "/app/timeline" });
    }, 1600);
  };

  return (
    <>
      <PageHeader
        eyebrow="New moment"
        title="Capture a memory"
        subtitle="Type, speak, or drop an image. The AI takes it from there."
      />

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="glass-strong rounded-3xl p-7">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What just happened? What did it feel like?"
            rows={7}
            className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-5 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setRecording((r) => !r)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition
                ${recording ? "border-fuchsia-400/60 bg-fuchsia-400/10 text-fuchsia-300" : "border-white/15 bg-white/5 text-muted-foreground hover:text-foreground"}`}
            >
              <Mic className="h-4 w-4" /> {recording ? "Listening…" : "Voice"}
            </button>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground">
              <ImageIcon className="h-4 w-4" /> Image
              <input type="file" accept="image/*" className="hidden" />
            </label>
            {recording && <Waveform />}
          </div>

          <div className="mt-7">
            <div className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
              How did it feel?
            </div>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map((em) => {
                const active = em === emotion;
                return (
                  <button
                    key={em}
                    onClick={() => setEmotion(em)}
                    className={`group relative overflow-hidden rounded-full px-4 py-2 text-sm transition
                      ${active ? "text-black/85" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {active && (
                      <span className={`absolute inset-0 bg-gradient-to-r ${EMOTION_COLORS[em]}`} />
                    )}
                    {!active && (
                      <span className="absolute inset-0 border border-white/10 bg-white/[0.04] rounded-full" />
                    )}
                    <span className="relative">{em}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={save}
            disabled={!text.trim() || analyzing}
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-aurora px-7 py-3 text-sm font-medium text-black/90 shadow-2xl transition hover:scale-[1.02] disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            {analyzing ? "AI weaving your memory…" : "Save to your universe"}
          </button>
        </div>

        <div className="flex flex-col items-center text-center">
          <AIOrb
            size={200}
            floating
            message={analyzing ? "Reading the feeling…" : "I'm listening."}
          />
        </div>
      </div>

      <AnimatePresence>
        {analyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center text-center"
            >
              <AIOrb size={220} />
              <p className="mt-10 font-display text-2xl text-aurora">Encoding the moment…</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Detecting themes, emotions, and connections.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Waveform() {
  return (
    <div className="flex items-end gap-1 px-3 py-1">
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.span
          key={i}
          className="block w-1 rounded-full bg-fuchsia-400"
          animate={{ height: ["6px", "22px", "6px"] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
