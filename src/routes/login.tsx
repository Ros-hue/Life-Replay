import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { CosmicBg } from "@/components/cosmic/CosmicBg";
import { AIOrb } from "@/components/cosmic/AIOrb";
import { store } from "@/lib/store";
import { ArrowRight, Mail, Lock } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Life Replay" }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    store.setUser({ id: crypto.randomUUID(), name: email.split("@")[0], email });
    nav({ to: "/app/timeline" });
  };
  return (
    <AuthShell title="Welcome back" subtitle="Step back into your universe.">
      <form onSubmit={submit} className="space-y-4">
        <Field icon={Mail} type="email" placeholder="you@somewhere.com" value={email} onChange={setEmail} />
        <Field icon={Lock} type="password" placeholder="Password" value={password} onChange={setPassword} />
        <button type="submit"
          className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-aurora py-3.5 text-sm font-medium text-black/90 shadow-2xl transition hover:scale-[1.02]">
          Continue <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here? <Link to="/signup" className="text-primary hover:underline">Create an account</Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <CosmicBg />
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2">
        <div className="hidden md:flex flex-col items-center text-center">
          <AIOrb size={260} floating />
          <Link to="/" className="mt-12 text-sm text-muted-foreground hover:text-foreground">← Back to Life Replay</Link>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="glass-strong mx-auto w-full max-w-md rounded-3xl p-8 shadow-2xl">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-aurora">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, ...p }: {
  icon: React.ComponentType<{ className?: string }>;
  type: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <label className="group relative block">
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition group-focus-within:text-primary" />
      <input
        type={p.type} placeholder={p.placeholder}
        value={p.value} onChange={e => p.onChange(e.target.value)}
        className="w-full rounded-full border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60
                   transition focus:border-primary/60 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}
