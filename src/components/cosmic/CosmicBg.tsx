import { useEffect, useRef } from "react";

/** Animated cosmic background: drifting nebulae, particle field, subtle grid. */
export function CosmicBg({ dense = false }: { dense?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const stars: { x: number; y: number; r: number; a: number; s: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      stars.length = 0;
      const count = dense ? 220 : 140;
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.4 * dpr + 0.3,
          a: Math.random(),
          s: Math.random() * 0.4 + 0.05,
        });
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        const tw = 0.5 + 0.5 * Math.sin(t * 0.001 * s.s + s.a * 10);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 240, 255, ${0.15 + tw * 0.55})`;
        ctx.fill();
        s.y -= s.s * 0.3;
        if (s.y < 0) s.y = canvas.height;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [dense]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Nebulae blobs */}
      <div className="absolute -top-40 -left-40 h-[40rem] w-[40rem] rounded-full opacity-40 blur-3xl animate-drift"
           style={{ background: "radial-gradient(circle, var(--cyan-glow), transparent 60%)" }} />
      <div className="absolute top-1/3 -right-40 h-[36rem] w-[36rem] rounded-full opacity-30 blur-3xl animate-drift"
           style={{ background: "radial-gradient(circle, var(--fuchsia-glow), transparent 60%)", animationDelay: "-6s" }} />
      <div className="absolute bottom-0 left-1/4 h-[30rem] w-[30rem] rounded-full opacity-25 blur-3xl animate-drift"
           style={{ background: "radial-gradient(circle, var(--violet-glow), transparent 60%)", animationDelay: "-3s" }} />
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-cosmic opacity-[0.35]" style={{
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
      }} />
      {/* Stars */}
      <canvas ref={canvasRef} className="absolute inset-0" />
      {/* Vignette */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at center, transparent 50%, oklch(0.04 0.01 270 / 0.7) 100%)",
      }} />
    </div>
  );
}
