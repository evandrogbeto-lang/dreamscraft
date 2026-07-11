import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const CODE = `// hooks/useAuth.ts
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [user, setUser] = useState<{ name: string } | null>(null);

  const login = useCallback(async (email: string) => {
    // Simulação simplificada do fluxo real
    const { data } = await supabase.auth.signInWithOtp({ email });
    setUser({ name: email.split("@")[0] });
    return data;
  }, []);

  return { user, login };
}

// Demo: simular login
login("ana@dreamscraft.dev");
`;

const LINES = CODE.split("\n");
const TOTAL_LINES = LINES.length;
const TOTAL_CHARS = CODE.length;

// Cada node "acende" em um threshold de scroll progress (0..1).
// Distribuímos do início do código até quase o fim, deixando o último 10% para o "compiled".
const NODES = [
  { id: "user",     label: "User",      x: 50,  y: 40,  threshold: 0.05 },
  { id: "hook",     label: "useAuth()", x: 200, y: 40,  threshold: 0.20 },
  { id: "state",    label: "useState",  x: 200, y: 130, threshold: 0.35 },
  { id: "login",    label: "login()",   x: 200, y: 220, threshold: 0.50 },
  { id: "supabase", label: "Supabase",  x: 350, y: 220, threshold: 0.65 },
  { id: "session",  label: "Session",   x: 350, y: 130, threshold: 0.80 },
  { id: "ui",       label: "UI Update", x: 350, y: 40,  threshold: 0.88 },
];

const EDGES = [
  { from: "user", to: "hook", threshold: 0.12 },
  { from: "hook", to: "state", threshold: 0.28 },
  { from: "hook", to: "login", threshold: 0.45 },
  { from: "login", to: "supabase", threshold: 0.58 },
  { from: "supabase", to: "session", threshold: 0.73 },
  { from: "session", to: "ui", threshold: 0.84 },
];

function syntaxHighlight(src: string) {
  return src
    .replace(/(\/\/[^\n]*)/g, '<span style="color:#B8A8D4">$1</span>')
    .replace(/\b(import|export|from|function|const|return|async|await)\b/g,
      '<span style="color:#AF66F9">$1</span>')
    .replace(/\b(useState|useCallback)\b/g, '<span style="color:#6A78F6">$1</span>')
    .replace(/(['"`][^'"`\n]*['"`])/g, '<span style="color:#F0D071">$1</span>')
    .replace(/\b(null|true|false)\b/g, '<span style="color:#F0D071">$1</span>');
}

export function PinnedBuild() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Mapeia 0→0.9 do scroll em 0→TOTAL_CHARS (últimos 10% = estado "compiled")
  const charsShown = useTransform(scrollYProgress, [0, 0.9], [0, TOTAL_CHARS]);
  const [visibleCode, setVisibleCode] = useState("");
  const [progress, setProgress] = useState(0);
  const [currentLine, setCurrentLine] = useState(1);
  const [compiled, setCompiled] = useState(false);

  useMotionValueEvent(charsShown, "change", (v) => {
    const n = Math.max(0, Math.min(TOTAL_CHARS, Math.floor(v)));
    setVisibleCode(CODE.slice(0, n));
    const lineNum = CODE.slice(0, n).split("\n").length;
    setCurrentLine(Math.min(TOTAL_LINES, lineNum));
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setProgress(v);
    setCompiled(v >= 0.92);
  });

  const findNode = (id: string) => NODES.find((n) => n.id === id)!;

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: "320vh" }}
      aria-label="Build em tempo real"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-[oklch(0.17_0.08_285)] border-y border-border/50">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 border-b border-border/40 bg-background/30 backdrop-blur">
          <p className="text-[11px] uppercase tracking-[0.32em] text-primary-glow font-mono">
            // build_em_tempo_real
          </p>
          <p className="font-mono text-xs text-muted-foreground tabular-nums">
            <span className="text-soft-glow">
              linha {String(currentLine).padStart(2, "0")}
            </span>
            <span className="text-muted-foreground/60"> de {String(TOTAL_LINES).padStart(2, "0")}</span>
          </p>
        </div>

        {/* Barra vertical de progresso à esquerda */}
        <div className="absolute left-0 top-16 bottom-0 w-[3px] z-30 bg-border/30">
          <motion.div
            style={{ scaleY: scrollYProgress, transformOrigin: "50% 0%" }}
            className="h-full w-full bg-gradient-to-b from-primary to-primary-glow"
          />
        </div>

        {/* Conteúdo 2 colunas */}
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6 pt-20 pb-8 px-8 lg:px-16">
          {/* Editor */}
          <div className="relative rounded-xl border border-border/60 bg-background/80 backdrop-blur overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/50 bg-background/60">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-rosa/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-brand-amber/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-brand-amarelo/80" />
              <span className="ml-3 text-xs font-mono text-muted-foreground">useAuth.ts</span>
              <span className="ml-auto text-[10px] font-mono uppercase tracking-wider text-primary-glow">
                {Math.round(progress * 100)}%
              </span>
            </div>
            <div className="flex-1 overflow-hidden flex font-mono text-[13px] leading-[1.65]">
              {/* gutter */}
              <div className="select-none px-3 py-4 text-right text-muted-foreground/50 border-r border-border/40 bg-background/40">
                {Array.from({ length: TOTAL_LINES }).map((_, i) => (
                  <div
                    key={i}
                    className={i + 1 === currentLine ? "text-primary-glow" : ""}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                ))}
              </div>
              <pre className="flex-1 px-4 py-4 text-neutral-200 whitespace-pre overflow-hidden">
                <code
                  dangerouslySetInnerHTML={{
                    __html:
                      syntaxHighlight(visibleCode) +
                      (compiled
                        ? ""
                        : '<span class="inline-block w-[7px] h-[14px] bg-primary-glow align-middle animate-pulse"></span>'),
                  }}
                />
              </pre>
            </div>
          </div>

          {/* Diagrama */}
          <div className="relative rounded-xl border border-border/60 bg-background/60 backdrop-blur overflow-hidden p-4">
            <div className="absolute top-3 left-4 text-[10px] uppercase tracking-[0.28em] text-primary-glow font-mono">
              architecture
            </div>
            <svg viewBox="0 0 420 280" className="w-full h-full">
              <defs>
                <linearGradient id="edge" x1="0" x2="1">
                  <stop offset="0%" stopColor="#C99BFB" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#AF66F9" stopOpacity="0.5" />
                </linearGradient>
              </defs>

              {/* Edges */}
              {EDGES.map((e, i) => {
                const a = findNode(e.from);
                const b = findNode(e.to);
                const visible = progress >= e.threshold;
                return (
                  <motion.line
                    key={i}
                    x1={a.x + 30}
                    y1={a.y}
                    x2={b.x - 30}
                    y2={b.y}
                    stroke="url(#edge)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    initial={false}
                    animate={{
                      opacity: visible ? 1 : 0,
                      pathLength: visible ? 1 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                );
              })}

              {/* Nodes */}
              {NODES.map((n) => {
                const active = progress >= n.threshold;
                return (
                  <motion.g
                    key={n.id}
                    initial={false}
                    animate={{
                      opacity: active ? 1 : 0.15,
                      scale: active ? 1 : 0.85,
                    }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: `${n.x}px ${n.y}px`, transformBox: "fill-box" } as any}
                  >
                    <rect
                      x={n.x - 38}
                      y={n.y - 16}
                      width="76"
                      height="32"
                      rx="8"
                      fill="rgba(42, 26, 92, 0.9)"
                      stroke={active ? "#AF66F9" : "rgba(184, 168, 212, 0.4)"}
                      strokeWidth="1.2"
                    />
                    {active && (
                      <rect
                        x={n.x - 38}
                        y={n.y - 16}
                        width="76"
                        height="32"
                        rx="8"
                        fill="none"
                        stroke="#AF66F9"
                        strokeWidth="1"
                        opacity="0.4"
                        style={{ filter: "blur(4px)" }}
                      />
                    )}
                    <text
                      x={n.x}
                      y={n.y + 4}
                      textAnchor="middle"
                      fontSize="11"
                      fontFamily="ui-monospace, monospace"
                      fill={active ? "#EFE5FD" : "#B8A8D4"}
                    >
                      {n.label}
                    </text>
                  </motion.g>
                );
              })}
            </svg>

            {/* Overlay compiled */}
            <AnimatePresence>
              {compiled && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm"
                >
                  <div className="flex flex-col items-center gap-3">
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 240, damping: 16 }}
                      className="h-16 w-16 rounded-full bg-brand-amarelo/20 border-2 border-brand-amarelo flex items-center justify-center shadow-[0_0_40px_rgba(52,211,153,0.5)]"
                    >
                      <Check className="h-8 w-8 text-brand-amarelo" strokeWidth={3} />
                    </motion.div>
                    <p className="font-mono text-brand-amarelo text-sm uppercase tracking-[0.2em]">
                      ✓ Component compiled
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {TOTAL_LINES} linhas · 0 erros · 0 warnings
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Fade para próxima seção */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0.9, 1], [0, 1]) }}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent"
        />
      </div>
    </section>
  );
}
