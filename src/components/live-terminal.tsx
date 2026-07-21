import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const COMMAND = "./deploy --env=production --stack=react,supabase";
const RESULTS = [
  "✓ Build successful in 2.3s",
  "✓ 42 modules compiled",
  "✓ LCP: 0.9s | CLS: 0.00",
];

type Phase = "typing" | "progress" | "results" | "done";

export function LiveTerminal() {
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState(reduce ? COMMAND : "");
  const [phase, setPhase] = useState<Phase>(reduce ? "done" : "typing");
  const [progress, setProgress] = useState(reduce ? 100 : 0);
  const [shownResults, setShownResults] = useState<number>(reduce ? RESULTS.length : 0);

  // Typewriter
  useEffect(() => {
    if (phase !== "typing") return;
    if (typed.length >= COMMAND.length) {
      const t = setTimeout(() => setPhase("progress"), 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setTyped(COMMAND.slice(0, typed.length + 1)), 50);
    return () => clearTimeout(t);
  }, [typed, phase]);

  // Progress
  useEffect(() => {
    if (phase !== "progress") return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(100, ((now - start) / 1500) * 100);
      setProgress(p);
      if (p < 100) raf = requestAnimationFrame(tick);
      else setPhase("results");
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // Results
  useEffect(() => {
    if (phase !== "results") return;
    if (shownResults >= RESULTS.length) {
      const t = setTimeout(() => setPhase("done"), 200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShownResults((n) => n + 1), 260);
    return () => clearTimeout(t);
  }, [phase, shownResults]);

  return (
    <div
      className="mx-auto w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl font-mono text-left"
      style={{ background: "#0A0A0A", border: "1px solid #2C2C2C" }}
      role="img"
      aria-label="Terminal mostrando deploy de produção bem-sucedido"
    >
      {/* chrome */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-2.5 border-b text-[11px] sm:text-xs text-neutral-400"
        style={{ borderColor: "#2C2C2C", background: "#0A0A0A" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-rosa/70 shrink-0" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-amarelo/70 shrink-0" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-azul/70 shrink-0" />
          <span className="ml-3 truncate">dreamscraft@build:~/site$</span>
        </div>
        <span className="inline-flex items-center gap-1.5 shrink-0 text-[10px] uppercase tracking-wider text-neutral-500">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-rosa/80" aria-hidden />
          online
        </span>
      </div>

      {/* body */}
      <div className="p-3 sm:p-6 text-[11px] sm:text-[13.5px] leading-relaxed overflow-x-hidden">
        <div className="flex items-start text-neutral-100 min-w-0">
          <span className="text-primary-glow mr-2 select-none shrink-0">&gt;</span>
          <span className="break-all min-w-0">
            {typed}
            {phase === "typing" && (
              <span className="inline-block w-2 h-4 -mb-0.5 ml-0.5 bg-primary-glow animate-pulse" />
            )}
          </span>
        </div>

        {/* progress */}
        {(phase === "progress" || phase === "results" || phase === "done") && (
          <div className="mt-4">
            <div
              className="h-1.5 w-full rounded-full overflow-hidden"
              style={{ background: "#1a1a1a", border: "1px solid #2C2C2C" }}
            >
              <div
                className="h-full bg-primary transition-[width] duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1.5 text-[10px] sm:text-[11px] text-neutral-500">
              {progress < 100 ? `compiling… ${Math.round(progress)}%` : "compiled"}
            </p>
          </div>
        )}

        {/* results */}
        {(phase === "results" || phase === "done") && (
          <div className="mt-4 space-y-1">
            {RESULTS.slice(0, shownResults).map((line) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className="text-brand-amarelo"
              >
                {line}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
