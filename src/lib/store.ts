// Local-first store for Life Replay.
// Persists to localStorage so the experience works without a backend.
// Swap with Lovable Cloud (Firestore-equivalent) later for sync + AI.

export type Emotion =
  | "Inspired"
  | "Happy"
  | "Calm"
  | "Emotional"
  | "Curious"
  | "Excited"
  | "Peaceful"
  | "Lonely";

export interface Memory {
  id: string;
  text: string;
  emotion: Emotion;
  tags: string[];
  summary: string;
  createdAt: number;
  imageUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

const MEM_KEY = "lr.memories";
const USER_KEY = "lr.user";
const ONBOARD_KEY = "lr.onboarded";

const seed: Memory[] = [
  {
    id: "s1",
    text: "Walked along the cliffs at sunset. The horizon felt infinite.",
    emotion: "Peaceful",
    tags: ["nature", "solitude", "sunset"],
    summary: "A grounding moment of solitude by the sea.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: "s2",
    text: "Late-night idea about a memory operating system. Couldn't sleep.",
    emotion: "Inspired",
    tags: ["creativity", "late-night", "ideas"],
    summary: "Creative breakthrough during deep solitude hours.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: "s3",
    text: "Long conversation with mom about the old house. We laughed and cried.",
    emotion: "Emotional",
    tags: ["family", "nostalgia", "conversation"],
    summary: "Meaningful family connection rooted in shared history.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 9,
  },
  {
    id: "s4",
    text: "Shipped the first prototype. The team cheered.",
    emotion: "Excited",
    tags: ["work", "milestone", "team"],
    summary: "Shared triumph after weeks of focused work.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
  },
  {
    id: "s5",
    text: "Quiet morning, coffee, rain on the window. Just being.",
    emotion: "Calm",
    tags: ["morning", "ritual"],
    summary: "Simple presence — a small but luminous moment.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18,
  },
];

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function safeRandomId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `m_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function normalizeEmotion(v: unknown): Emotion {
  const all = new Set<Emotion>(EMOTIONS);
  if (typeof v === "string" && all.has(v as Emotion)) return v as Emotion;
  return "Inspired";
}

type UnknownRecord = Record<string, unknown>;

function normalizeMemory(raw: unknown): Memory {
  const r = (raw ?? {}) as Partial<UnknownRecord>;

  const emotion = normalizeEmotion(r.emotion);
  const createdAt = typeof r.createdAt === "number" ? r.createdAt : Date.now();
  const text = typeof r.text === "string" ? r.text : "";

  const tags = Array.isArray(r.tags)
    ? r.tags.filter((t) => typeof t === "string").slice(0, 10) // eslint-safe: filter type
    : [];

  const summaryRaw = typeof r.summary === "string" ? r.summary.trim() : "";
  const generated = !summaryRaw ? generateInsight(text || "", emotion) : null;

  const summary = summaryRaw || generated?.summary || "";

  return {
    id: typeof r.id === "string" && r.id ? r.id : safeRandomId(),
    text,
    emotion,
    tags: tags.length ? tags : (generated?.tags ?? [emotion.toLowerCase()]),
    summary,
    createdAt,
    imageUrl: typeof r.imageUrl === "string" ? r.imageUrl : undefined,
  };
}

function normalizeMemoryList(list: unknown): Memory[] {
  if (!Array.isArray(list)) return [];
  return list.map((x) => normalizeMemory(x));
}

let cache: { memories: Memory[] } | null = null;
let cacheKeyStamp: string | null = null;

function currentStorageStamp(): string {
  if (typeof window === "undefined") return "ssr";
  return `${MEM_KEY}:${localStorage.getItem(MEM_KEY) ?? ""}`;
}

const listeners = {
  memories: new Set<(memories: Memory[]) => void>(),
  user: new Set<(user: User | null) => void>(),
  onboarded: new Set<(v: boolean) => void>(),
};

export const store = {
  getMemories(opts?: { forceRefresh?: boolean }): Memory[] {
    if (typeof window === "undefined") return [...seed].sort((a, b) => b.createdAt - a.createdAt);

    const stamp = currentStorageStamp();
    if (!opts?.forceRefresh && cache && cacheKeyStamp === stamp) return cache.memories;

    const raw = read<unknown>(MEM_KEY, null);
    const list = raw ? normalizeMemoryList(raw) : seed;
    const sorted = list.sort((a, b) => b.createdAt - a.createdAt);

    if (!raw) write(MEM_KEY, seed);

    cacheKeyStamp = stamp;
    cache = { memories: sorted };
    return sorted;
  },

  addMemory(m: Omit<Memory, "id" | "createdAt" | "summary" | "tags">) {
    const all = this.getMemories();
    const generated = generateInsight(m.text, m.emotion);

    const next: Memory = {
      id: safeRandomId(),
      createdAt: Date.now(),
      ...m,
      summary: generated.summary,
      tags: generated.tags,
    };

    const updated = [next, ...all];
    write(MEM_KEY, updated);

    cache = { memories: updated.sort((a, b) => b.createdAt - a.createdAt) };
    cacheKeyStamp = currentStorageStamp();
    listeners.memories.forEach((fn) => fn(cache!.memories));

    return next;
  },

  updateMemory(id: string, patch: Partial<Omit<Memory, "id" | "createdAt">>) {
    const all = this.getMemories();
    const idx = all.findIndex((m) => m.id === id);
    if (idx === -1) return null;

    const current = all[idx];

    const nextText =
      patch.text !== undefined
        ? typeof patch.text === "string"
          ? patch.text
          : current.text
        : current.text;
    const nextEmotion =
      patch.emotion !== undefined ? normalizeEmotion(patch.emotion) : current.emotion;

    const regen = patch.text !== undefined || patch.emotion !== undefined;

    const generated = regen ? generateInsight(nextText, nextEmotion) : null;

    const next: Memory = {
      ...current,
      ...patch,
      text: nextText,
      emotion: nextEmotion,
      summary: generated?.summary ?? current.summary,
      tags: generated?.tags ?? current.tags,
    };

    const updated = [...all];
    updated[idx] = next;
    const sorted = updated.sort((a, b) => b.createdAt - a.createdAt);

    write(MEM_KEY, sorted);
    cache = { memories: sorted };
    cacheKeyStamp = currentStorageStamp();
    listeners.memories.forEach((fn) => fn(sorted));

    return next;
  },

  deleteMemory(id: string) {
    const all = this.getMemories();
    const updated = all.filter((m) => m.id !== id);
    if (updated.length === all.length) return false;

    write(MEM_KEY, updated);
    cache = { memories: updated };
    cacheKeyStamp = currentStorageStamp();
    listeners.memories.forEach((fn) => fn(updated));

    return true;
  },

  clearMemories() {
    write(MEM_KEY, []);
    cache = { memories: [] };
    cacheKeyStamp = currentStorageStamp();
    listeners.memories.forEach((fn) => fn([]));
  },

  clearAll() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(MEM_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(ONBOARD_KEY);
    }
    cache = null;
    cacheKeyStamp = null;

    listeners.memories.forEach((fn) => fn(this.getMemories({ forceRefresh: true })));
    listeners.user.forEach((fn) => fn(null));
    listeners.onboarded.forEach((fn) => fn(false));
  },

  getUser(): User | null {
    return read<User | null>(USER_KEY, null);
  },

  setUser(u: User | null) {
    if (typeof window === "undefined") return;
    if (u) {
      write(USER_KEY, u);
      listeners.user.forEach((fn) => fn(u));
    } else {
      localStorage.removeItem(USER_KEY);
      listeners.user.forEach((fn) => fn(null));
    }
  },

  isOnboarded(): boolean {
    return read<boolean>(ONBOARD_KEY, false);
  },

  setOnboarded(v: boolean) {
    write(ONBOARD_KEY, v);
    listeners.onboarded.forEach((fn) => fn(v));
  },

  subscribeMemory(fn: (memories: Memory[]) => void) {
    listeners.memories.add(fn);
    return () => listeners.memories.delete(fn);
  },

  subscribeUser(fn: (user: User | null) => void) {
    listeners.user.add(fn);
    return () => listeners.user.delete(fn);
  },

  subscribeOnboarded(fn: (v: boolean) => void) {
    listeners.onboarded.add(fn);
    return () => listeners.onboarded.delete(fn);
  },
};

// Lightweight on-device "AI" stand-in. Swap with OpenAI via edge function.
function generateInsight(text: string, emotion: Emotion): { summary: string; tags: string[] } {
  const t = text.toLowerCase();
  const tags = new Set<string>();
  const dict: Record<string, string> = {
    family: "family",
    mom: "family",
    dad: "family",
    friend: "friendship",
    work: "work",
    code: "work",
    build: "work",
    ship: "work",
    rain: "weather",
    sunset: "nature",
    ocean: "nature",
    walk: "nature",
    night: "late-night",
    late: "late-night",
    morning: "morning",
    idea: "ideas",
    dream: "dreams",
    love: "love",
    music: "music",
  };
  for (const k of Object.keys(dict)) {
    if (t.includes(k)) tags.add(dict[k]);
  }

  tags.add(emotion.toLowerCase());

  const summary =
    text.length < 80
      ? text
      : `A ${emotion.toLowerCase()} moment — ${text.split(/[.!?]/)[0].trim()}.`;

  return { summary, tags: Array.from(tags).slice(0, 5) };
}

export const EMOTION_COLORS: Record<Emotion, string> = {
  Inspired: "from-cyan-400 to-violet-500",
  Happy: "from-yellow-300 to-pink-400",
  Calm: "from-sky-300 to-emerald-400",
  Emotional: "from-fuchsia-400 to-rose-500",
  Curious: "from-violet-400 to-cyan-400",
  Excited: "from-orange-400 to-pink-500",
  Peaceful: "from-emerald-300 to-teal-400",
  Lonely: "from-indigo-400 to-slate-500",
};

export const EMOTIONS: Emotion[] = [
  "Inspired",
  "Happy",
  "Calm",
  "Emotional",
  "Curious",
  "Excited",
  "Peaceful",
  "Lonely",
];
