import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  size?: number;
  className?: string;
  message?: string;
  floating?: boolean;
}

export function AIOrb({ size = 220, className = "", message, floating = false }: Props) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Outer halo */}
      <motion.div
        className="absolute inset-[-30%] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--cyan-glow), transparent 60%)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Rotating ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, transparent, var(--cyan-glow), transparent, var(--fuchsia-glow), transparent)",
          mask: "radial-gradient(circle, transparent 62%, black 63%, black 70%, transparent 71%)",
          WebkitMask:
            "radial-gradient(circle, transparent 62%, black 63%, black 70%, transparent 71%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      {/* Orb body */}
      <motion.div
        className="absolute inset-[12%] rounded-full bg-orb glow-cyan"
        animate={floating ? { y: [0, -10, 0] } : {}}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="absolute inset-2 rounded-full opacity-60"
          style={{ background: "radial-gradient(circle at 35% 30%, white, transparent 40%)" }}
        />
      </motion.div>
      {/* Inner pulse */}
      <motion.div
        className="absolute inset-[35%] rounded-full bg-white/80 blur-md"
        animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {message && (
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm text-muted-foreground">
          <Typewriter text={message} />
        </div>
      )}
    </div>
  );
}

export function Typewriter({ text, speed = 30 }: { text: string; speed?: number }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return (
    <span>
      {shown}
      <span className="ml-0.5 inline-block h-3 w-[2px] animate-pulse bg-primary" />
    </span>
  );
}
