import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

function Frame({
  index,
  label,
  caption,
  children,
}: {
  index: string;
  label: string;
  caption: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <section
      className="w-full min-h-[50vh] flex items-center relative px-6 py-4"
      aria-label={label}
    >
      <div className="mx-auto max-w-6xl w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-8">
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: -30, filter: "blur(8px)" }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-30%" }}
          transition={{ duration: 0.9, ease }}
        >
          <p className="text-[11px] font-mono uppercase tracking-[0.32em] text-primary-glow">
            // frame.{index}
          </p>
          <h3 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-light text-soft-glow leading-[1.05]">
            {label}
          </h3>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-md">
            {caption}
          </p>
        </motion.div>
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 20 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-25%" }}
          transition={{ duration: 1, ease, delay: 0.15 }}
          className="relative"
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}

function WhatsAppMock() {
  const reduce = useReducedMotion();
  const bubbles = [
    { side: "in", text: "Oi, tenho uma ideia para um app de fretes...", delay: 0.4 },
    { side: "in", text: "É possível conectar motoristas e empresas em tempo real?", delay: 1.1 },
    { side: "out", text: "Sim. Vamos conversar.", delay: 1.9 },
  ] as const;
  return (
    <div className="rounded-3xl border border-primary/20 bg-[#0b141a] shadow-[0_0_60px_-20px_hsl(var(--primary)/0.4)] overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1f2c33] border-b border-black/40">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center font-mono text-xs font-bold text-primary-foreground">
          C
        </div>
        <div>
          <p className="text-sm font-medium text-white">Lead · Brasília (exemplo)</p>
          <p className="text-[10px] text-brand-amarelo font-mono">online</p>
        </div>
      </div>
      <div className="px-4 py-6 space-y-2.5 min-h-[280px]">
        {bubbles.map((b, i) => (
          <motion.div
            key={i}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.45, ease, delay: b.delay }}
            className={`flex ${b.side === "out" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[78%] text-sm px-3.5 py-2 rounded-2xl ${
                b.side === "out"
                  ? "bg-[#005c4b] text-white rounded-br-sm"
                  : "bg-[#202c33] text-zinc-100 rounded-bl-sm"
              }`}
            >
              {b.text}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ArchitectureDiagram() {
  const reduce = useReducedMotion();
  const nodes = [
    { id: "mobile", x: 60, y: 60, label: "Mobile", sub: "React Native" },
    { id: "api", x: 260, y: 60, label: "API", sub: "Node.js" },
    { id: "db", x: 460, y: 60, label: "DB", sub: "Supabase" },
    { id: "auth", x: 260, y: 220, label: "Auth", sub: "JWT · OAuth" },
  ];
  const edges = [
    ["mobile", "api"],
    ["api", "db"],
    ["api", "auth"],
    ["mobile", "auth"],
  ];
  const pos = Object.fromEntries(nodes.map((n) => [n.id, n]));
  return (
    <div className="rounded-3xl border border-primary/20 bg-[#0A0A0A] p-6 shadow-[0_0_60px_-20px_hsl(var(--primary)/0.4)]">
      <svg
        viewBox="0 0 560 320"
        className="w-full h-auto"
        role="img"
        aria-label="Diagrama de arquitetura: Mobile, API, Database, Auth"
      >
        <defs>
          <linearGradient id="edge" x1="0" x2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(var(--primary-glow))" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        {edges.map(([a, b], i) => {
          const p1 = pos[a];
          const p2 = pos[b];
          return (
            <motion.line
              key={`${a}-${b}`}
              x1={p1.x + 60}
              y1={p1.y + 30}
              x2={p2.x + 60}
              y2={p2.y + 30}
              stroke="url(#edge)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              initial={reduce ? { opacity: 1 } : { pathLength: 0, opacity: 0 }}
              whileInView={reduce ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 0.9, ease, delay: 0.4 + i * 0.15 }}
            />
          );
        })}
        {nodes.map((n, i) => (
          <motion.g
            key={n.id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.5, ease, delay: 0.2 + i * 0.12 }}
            style={{ transformOrigin: `${n.x + 60}px ${n.y + 30}px` }}
          >
            <rect
              x={n.x}
              y={n.y}
              width={120}
              height={60}
              rx={12}
              fill="hsl(var(--primary) / 0.08)"
              stroke="hsl(var(--primary) / 0.5)"
              strokeWidth={1}
            />
            <text
              x={n.x + 60}
              y={n.y + 26}
              textAnchor="middle"
              className="fill-white"
              style={{ font: "600 14px ui-monospace, monospace" }}
            >
              {n.label}
            </text>
            <text
              x={n.x + 60}
              y={n.y + 44}
              textAnchor="middle"
              className="fill-zinc-400"
              style={{ font: "11px ui-monospace, monospace" }}
            >
              {n.sub}
            </text>
          </motion.g>
        ))}
      </svg>
      <p className="mt-4 text-center text-[11px] font-mono uppercase tracking-[0.28em] text-primary-glow/80">
        spec compiled · 48h
      </p>
    </div>
  );
}

function PhoneMockup() {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col sm:flex-row items-center gap-8 justify-center">
      <div className="relative w-[240px] h-[480px] rounded-[42px] border-[10px] border-zinc-800 bg-[#0A0A0A] shadow-[0_30px_80px_-20px_hsl(var(--primary)/0.5)]">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 h-5 w-24 rounded-full bg-zinc-900" />
        <div className="absolute inset-2 top-8 rounded-[28px] bg-gradient-to-br from-[#0d1117] to-[#161b22] overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-[10px] font-mono text-primary-glow">// demo.app</p>
            <p className="text-sm font-semibold text-white mt-1">Dashboard de exemplo</p>
          </div>
          <div className="flex-1 px-3 py-2 space-y-2 overflow-hidden">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.4, ease, delay: 0.3 + i * 0.12 }}
                className="rounded-lg bg-white/5 border border-white/5 px-3 py-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-brand-amarelo">●  ativo</span>
                  <span className="text-[10px] font-mono text-zinc-500">#{2034 + i}</span>
                </div>
                <p className="mt-1 text-[11px] text-white">Brasília → Goiânia</p>
                <p className="text-[10px] text-zinc-400">12t · Caminhão truck</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 w-full sm:w-auto">
        {[
          { v: "48h", k: "ideia → spec" },
          { v: "Full-stack", k: "mobile + api + auth" },
          { v: "CI/CD", k: "deploy automatizado" },
        ].map((m, i) => (
          <motion.div
            key={m.k}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.5, ease, delay: 0.4 + i * 0.12 }}
            className="glass-card rounded-xl px-5 py-4 min-w-[180px]"
          >
            <p className="text-3xl font-bold text-gradient font-mono">{m.v}</p>
            <p className="mt-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              {m.k}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function ProjectStory() {
  return (
    <section aria-labelledby="story-heading" className="relative">
      <div className="mx-auto max-w-7xl px-6 pt-8 pb-2 text-center">
        <p className="text-[11px] uppercase tracking-[0.32em] text-primary-glow font-mono">
          // story.flow()
        </p>
        <h2
          id="story-heading"
          className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-light text-soft-glow"
        >
          ASSIM ESTRUTURAMOS UM PROJETO
        </h2>
        <p className="mt-4 text-xs font-mono text-muted-foreground">
          demonstração técnica · não é case real
        </p>
      </div>

      <div>
        <Frame index="01" label="Ideia" caption="Exemplo: uma mensagem chega. Sem briefing formal. Só um problema.">
          <WhatsAppMock />
        </Frame>
        <Frame index="02" label="Estrutura" caption="Arquitetura de referência desenhada em 48h.">
          <ArchitectureDiagram />
        </Frame>
        <Frame index="03" label="Entrega" caption="Demonstração de como fica em produção.">
          <PhoneMockup />
        </Frame>
      </div>

      <div className="flex justify-center pb-8 pt-2">
        <a
          href="#proof-of-work"
          className="btn-glow inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground font-mono uppercase tracking-wider"
        >
          → Veja o código real <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}