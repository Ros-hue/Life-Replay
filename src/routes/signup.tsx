import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "./login";
import { store } from "@/lib/store";
import { ArrowRight, Mail, Lock, User } from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create your account — Life Replay" }] }),
  component: Signup,
});

function Signup() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    store.setUser({ id: crypto.randomUUID(), name: name || email.split("@")[0], email });
    nav({ to: "/app/timeline" });
  };
  return (
    <AuthShell title="Begin your universe" subtitle="A few seconds to set the cosmos in motion.">
      <form onSubmit={submit} className="space-y-4">
        <Field icon={User} type="text" placeholder="Your name" value={name} onChange={setName} />
        <Field
          icon={Mail}
          type="email"
          placeholder="you@somewhere.com"
          value={email}
          onChange={setEmail}
        />
        <Field
          icon={Lock}
          type="password"
          placeholder="Choose a password"
          value={password}
          onChange={setPassword}
        />
        <button
          type="submit"
          className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-aurora py-3.5 text-sm font-medium text-black/90 shadow-2xl transition hover:scale-[1.02]"
        >
          Create account <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already orbiting?{" "}
        <Link to="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}

function Field({
  icon: Icon,
  ...p
}: {
  icon: React.ComponentType<{ className?: string }>;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="group relative block">
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition group-focus-within:text-primary" />
      <input
        type={p.type}
        placeholder={p.placeholder}
        value={p.value}
        onChange={(e) => p.onChange(e.target.value)}
        className="w-full rounded-full border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60
                   transition focus:border-primary/60 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}
