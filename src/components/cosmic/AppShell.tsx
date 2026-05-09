import { Link, useLocation, useNavigate, Outlet } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CosmicBg } from "./CosmicBg";
import { FloatingOrb } from "./FloatingOrb";
import { store } from "@/lib/store";
import { Sparkles, Clock, Orbit, Search, Play, LogOut, Plus } from "lucide-react";
import { useEffect, useState } from "react";

const NAV = [
  { to: "/app/timeline", label: "Timeline", icon: Clock },
  { to: "/app/capture", label: "Capture", icon: Plus },
  { to: "/app/galaxy", label: "Galaxy", icon: Orbit },
  { to: "/app/search", label: "Search", icon: Search },
  { to: "/app/replay", label: "Replay", icon: Play },
  { to: "/app/server", label: "Server", icon: Sparkles },
];

export function AppShell() {
  const loc = useLocation();
  const nav = useNavigate();
  const [user, setUser] = useState<ReturnType<typeof store.getUser>>(null);

  useEffect(() => {
    const u = store.getUser();
    if (!u) {
      nav({ to: "/login" });
      return;
    }
    setUser(u);
  }, [nav]);

  const logout = () => {
    store.setUser(null);
    nav({ to: "/" });
  };

  return (
    <div className="min-h-screen">
      <CosmicBg />
      {/* Top bar */}
      <header className="sticky top-0 z-30 glass-strong border-b border-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link to="/app/timeline" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-orb glow-cyan" />
            <span className="font-display text-lg font-semibold tracking-tight">Life Replay</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(({ to, label, icon: Icon }) => {
              const active = loc.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition
                    ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {active && (
                    <motion.span
                      layoutId="navpill"
                      className="absolute inset-0 rounded-full bg-white/5 ring-glow"
                    />
                  )}
                  <Icon className="relative h-4 w-4" />
                  <span className="relative">{label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-muted-foreground">
              {user?.name || "Traveler"}
            </span>
            <button
              onClick={logout}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
        {/* Mobile nav */}
        <nav className="md:hidden flex items-center justify-around border-t border-white/5 px-2 py-1">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = loc.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px]
                  ${active ? "text-primary" : "text-muted-foreground"}`}
              >
                <Icon className="h-4 w-4" /> {label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <Outlet />
      </main>
      <FloatingOrb />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-10">
      {eyebrow && (
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-primary/90">
          <Sparkles className="h-3 w-3" /> {eyebrow}
        </div>
      )}
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-aurora">{title}</h1>
      {subtitle && <p className="mt-3 max-w-2xl text-base text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
