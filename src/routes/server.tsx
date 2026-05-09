import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/cosmic/AppShell";
import { store, type Memory } from "@/lib/store";
import { Database, RefreshCw, Server, Users } from "lucide-react";

export const Route = createFileRoute("/server")({
  head: () => ({ meta: [{ title: "Server — Life Replay" }] }),
  component: ServerPage,
});

function ServerPage() {
  const [tick, setTick] = useState(0);

  const data = useMemo(() => {
    const memories = store.getMemories();
    const user = store.getUser();

    const now = new Date();
    const meta = {
      runtime: typeof window === "undefined" ? "server" : "client",
      generatedAt: now.toISOString(),
      user: user ? { id: user.id, name: user.name, email: user.email } : null,
      counts: {
        memories: memories.length,
        emotions: Array.from(new Set(memories.map((m) => m.emotion))).length,
      },
    };

    return {
      meta,
      sampleMemories: memories.slice(0, 3) as Memory[],
    };
  }, [tick]);

  return (
    <>
      <PageHeader
        eyebrow="Server"
        title="Local-first server view"
        subtitle="This app runs without a backend. This page shows current local state (user + memory stats) as a stand-in for a real server."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="glass-strong rounded-3xl p-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-start justify-between gap-4"
          >
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-primary/90">
                <Server className="h-3.5 w-3.5" /> Status
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-aurora">Running</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Client/runtime snapshot. Use Refresh to re-read localStorage.
              </p>
            </div>

            <button
              onClick={() => setTick((t) => t + 1)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground transition hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </motion.div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Stat
              icon={Users}
              label="User"
              value={data.meta.user ? data.meta.user.name : "Guest"}
              sub={data.meta.user ? data.meta.user.email : "Not signed in"}
            />
            <Stat
              icon={Database}
              label="Memories"
              value={String(data.meta.counts.memories)}
              sub={`${data.meta.counts.emotions} emotions represented`}
            />
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
              JSON snapshot
            </div>
            <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap break-words text-xs text-foreground/90">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-strong rounded-3xl p-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary/90">
              <Server className="h-3.5 w-3.5" /> Build info
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Runtime</span>
                <span className="font-medium">{data.meta.runtime}</span>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Generated</span>
                <span className="font-medium">
                  {new Date(data.meta.generatedAt).toLocaleString()}
                </span>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Version</span>
                <span className="font-medium">dev</span>
              </li>
            </ul>
          </div>

          <div className="glass rounded-3xl p-6 text-sm text-muted-foreground">
            <p className="font-medium text-foreground/90">What this page is</p>
            <p className="mt-2 leading-relaxed">
              A debugging-friendly “server page” for this project. Since Life Replay currently uses
              localStorage, this replaces real server endpoints.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        </div>
      </div>
      <div className="mt-3 text-2xl font-semibold text-foreground">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{sub}</div>
    </div>
  );
}
