// Local-first store for Life Replay.
// Persists to localStorage so the experience works without a backend.
// Swap with Lovable Cloud (Firestore-equivalent) later for sync + AI.

export type Emotion =
  | "Inspired" | "Happy" | "Calm" | "Emotional"
  | "Curious" | "Excited" | "Peaceful" | "Lonely";

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
    id: "s1", text: "Walked along the cliffs at sunset. The horizon felt infinite.",
    emotion: "Peaceful", tags: ["nature", "solitude", "sunset"],
    summary: "A grounding moment of solitude by the sea.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: "s2", text: "Late-night idea about a memory operating system. Couldn't sleep.",
    emotion: "Inspired", tags: ["creativity", "late-night", "ideas"],
    summary: "Creative breakthrough during deep solitude hours.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: "s3", text: "Long conversation with mom about the old house. We laughed and cried.",
    emotion: "Emotional", tags: ["family", "nostalgia", "conversation"],
    summary: "Meaningful family connection rooted in shared history.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 9,
  },
  {
    id: "s4", text: "Shipped the first prototype. The team cheered.",
    emotion: "Excited", tags: ["work", "milestone", "team"],
    summary: "Shared triumph after weeks of focused work.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
  },
  {
    id: "s5", text: "Quiet morning, coffee, rain on the window. Just being.",
    emotion: "Calm", tags: ["morning", "ritual"],
    summary: "Simple presence — a small but luminous moment.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18,
  },
];

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch { return fallback; }
}
function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const store = {
  getMemories(): Memory[] {
    const list = read<Memory[] | null>(MEM_KEY, null);
    if (!list) { write(MEM_KEY, seed); return seed; }
    return list.sort((a, b) => b.createdAt - a.createdAt);
  },
  addMemory(m: Omit<Memory, "id" | "createdAt" | "summary" | "tags">) {
    const all = read<Memory[]>(MEM_KEY, seed);
    const generated = generateInsight(m.text, m.emotion);
    const next: Memory = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      ...m,
      summary: generated.summary,
      tags: generated.tags,
    };
    const updated = [next, ...all];
    write(MEM_KEY, updated);
    return next;
  },
  getUser(): User | null { return read<User | null>(USER_KEY, null); },
  setUser(u: User | null) { u ? write(USER_KEY, u) : localStorage.removeItem(USER_KEY); },
  isOnboarded(): boolean { return read<boolean>(ONBOARD_KEY, false); },
  setOnboarded(v: boolean) { write(ONBOARD_KEY, v); },
};

// Lightweight on-device "AI" stand-in. Swap with OpenAI via edge function.
function generateInsight(text: string, emotion: Emotion): { summary: string; tags: string[] } {
  const t = text.toLowerCase();
  const tags = new Set<string>();
  const dict: Record<string, string> = {
    family: "family", mom: "family", dad: "family", friend: "friendship",
    work: "work", code: "work", build: "work", ship: "work",
    rain: "weather", sunset: "nature", ocean: "nature", walk: "nature",
    night: "late-night", late: "late-night", morning: "morning",
    idea: "ideas", dream: "dreams", love: "love", music: "music",
  };
  Object.keys(dict).forEach(k => { if (t.includes(k)) tags.add(dict[k]); });
  tags.add(emotion.toLowerCase());
  const summary =
    text.length < 80 ? text :
    `A ${emotion.toLowerCase()} moment — ${text.split(/[.!?]/)[0].trim()}.`;
  return { summary, tags: Array.from(tags).slice(0, 5) };
}

export const EMOTION_COLORS: Record<Emotion, string> = {
  Inspired:  "from-cyan-400 to-violet-500",
  Happy:     "from-yellow-300 to-pink-400",
  Calm:      "from-sky-300 to-emerald-400",
  Emotional: "from-fuchsia-400 to-rose-500",
  Curious:   "from-violet-400 to-cyan-400",
  Excited:   "from-orange-400 to-pink-500",
  Peaceful:  "from-emerald-300 to-teal-400",
  Lonely:    "from-indigo-400 to-slate-500",
};

export const EMOTIONS: Emotion[] = [
  "Inspired", "Happy", "Calm", "Emotional",
  "Curious", "Excited", "Peaceful", "Lonely",
];
