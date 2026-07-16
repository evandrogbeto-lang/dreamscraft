import { lazy, Suspense, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ClientOnly, Link } from "@tanstack/react-router";
import { Play, CheckCircle2, User, Flame, Sparkles, PencilLine, ArrowRight } from "lucide-react";

const MonacoEditor = lazy(() => import("@monaco-editor/react"));

// ---------- Code samples ----------

const CODE_AUTH = `// hooks/useAuth.ts
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

const CODE_ROAST = `// src/lib/fynk/roast.ts (FYNK · produto próprio)
export const ROAST_SYSTEM = \`
Você é o copiloto financeiro do FYNK. Personalidade: sarcástico,
direto, sem paciência para desculpa. Nunca xinga. Sempre confronta
o gasto com a meta declarada do usuário. Fecha com uma ação de 1 linha.
\`;

// Dados de um usuário-teste para o preview
export const sample = {
  monthTotal: 6420,
  topCategory: { name: "iFood",   amount: 1180 },
  goal:        "Guardar R$ 1.000 por mês para reserva de emergência",
};
`;

const CODE_ESTIMATE = `// lib/estimate.functions.ts (trecho)
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  description: z.string().min(20).max(2000),
  scope: z.enum(["mvp", "v1", "enterprise"]),
});

export const estimateProject = createServerFn({ method: "POST" })
  .inputValidator((data) => Input.parse(data))
  .handler(async ({ data }) => {
    const base = data.scope === "mvp" ? 12000 : data.scope === "v1" ? 28000 : 65000;
    const weeks = data.scope === "mvp" ? 3 : data.scope === "v1" ? 7 : 14;
    return {
      priceBRL: base,
      weeks,
      confidence: 0.86,
      breakdown: ["Discovery", "Arquitetura", "Build", "QA", "Deploy"],
    };
  });
`;

type TabKey = "useAuth" | "roast" | "estimateAI";

const TABS: { key: TabKey; label: string; code: string; badge: string }[] = [
  { key: "useAuth",    label: "useAuth.ts",    code: CODE_AUTH,     badge: "demo interativa" },
  { key: "roast",      label: "fynk/roast.ts", code: CODE_ROAST,    badge: "produto próprio" },
  { key: "estimateAI", label: "estimateAI.ts", code: CODE_ESTIMATE, badge: "trecho deste site" },
];

// ---------- Previews ----------

function AuthPreview({
  running,
  user,
  logs,
}: {
  running: boolean;
  user: { name: string; email: string } | null;
  logs: string[];
}) {
  if (!user && !running && logs.length === 0) {
    return (
      <div className="text-center space-y-3">
        <p className="font-mono text-sm text-muted-foreground">
          Clique em <span className="text-primary">▶ Executar</span> para rodar o hook.
        </p>
        <p className="font-mono text-xs text-muted-foreground/70 flex items-center justify-center gap-1.5">
          <PencilLine className="h-3 w-3" />
          Dica: troque o e-mail em <span className="text-primary-glow">login(...)</span> no editor e rode de novo.
        </p>
      </div>
    );
  }
  return (
    <div className="w-full max-w-sm space-y-4">
      {/* log de execução */}
      <div className="rounded-xl border border-border/60 bg-background/60 p-4 font-mono text-xs space-y-1.5">
        {logs.map((line, i) => (
          <motion.div
            key={`${i}-${line}`}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className={line.startsWith("✓") ? "text-brand-amarelo" : "text-muted-foreground"}
          >
            {line}
          </motion.div>
        ))}
        {running && (
          <span className="inline-block w-2 h-3.5 bg-primary-glow animate-pulse align-middle" />
        )}
      </div>
      {user && <AuthSessionCard user={user} />}
    </div>
  );
}

function AuthSessionCard({ user }: { user: { name: string; email: string } }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-sm rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6"
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40">
          <User className="h-6 w-6 text-primary-glow" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary-glow">
            sessão ativa
          </p>
          <p className="mt-1 text-lg font-semibold text-soft-glow truncate">
            Usuário logado: {user.name}
          </p>
          <p className="font-mono text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>
      <div className="mt-5 pt-5 border-t border-border/60 flex items-center gap-2 font-mono text-xs text-brand-amarelo">
        <CheckCircle2 className="h-4 w-4" />
        Autenticado em 312ms
      </div>
    </motion.div>
  );
}

function RoastPreview({ code }: { code: string }) {
  const sample = parseRoastSample(code);
  const gap = sample ? Math.max(0, sample.monthTotal - 5000) : 0;
  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-glow">
        <Flame className="h-3.5 w-3.5" />
        FYNK · copiloto sarcástico
      </div>

      <p className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground/80">
        <PencilLine className="h-3 w-3 shrink-0" />
        Edite <span className="text-primary-glow">monthTotal</span> ou{" "}
        <span className="text-primary-glow">amount</span> no editor — o preview reage na hora.
      </p>

      {!sample && (
        <div className="rounded-xl border border-border/60 bg-card/60 p-4 font-mono text-xs text-muted-foreground">
          // ajuste os valores em `sample` no editor para gerar um novo roast
        </div>
      )}

      {sample && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-border/60 bg-card/60 p-3">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">gasto no mês</p>
              <p className="mt-1 font-mono text-lg text-foreground tabular-nums">
                R$ {sample.monthTotal.toLocaleString("pt-BR")}
              </p>
            </div>
            <div className="rounded-xl border border-brand-rosa/30 bg-brand-rosa/5 p-3">
              <p className="text-[10px] font-mono uppercase tracking-wider text-brand-rosa/80">top categoria</p>
              <p className="mt-1 font-mono text-sm text-foreground">{sample.topCategory.name}</p>
              <p className="font-mono text-xs text-muted-foreground tabular-nums">
                R$ {sample.topCategory.amount.toLocaleString("pt-BR")}
              </p>
            </div>
          </div>

          <motion.div
            key={`${sample.monthTotal}-${sample.topCategory.amount}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-4"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary-glow mb-2">
              // roast → você
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              R$ {sample.monthTotal.toLocaleString("pt-BR")} no mês e{" "}
              <span className="text-brand-rosa">
                R$ {sample.topCategory.amount.toLocaleString("pt-BR")} em {sample.topCategory.name}
              </span>
              . Sua meta era guardar R$ 1.000 e você estourou o orçamento em R$ {gap.toLocaleString("pt-BR")}.
              Boa sorte pedindo a reserva emprestada pro entregador.
            </p>
            <p className="mt-3 font-mono text-[11px] text-brand-amarelo">
              → ação: corta {sample.topCategory.name} pela metade na próxima semana.
            </p>
          </motion.div>
        </>
      )}
    </div>
  );
}

function EstimatePreview() {
  const lines = [
    { sign: "+", text: 'priceBRL: 28000,' },
    { sign: "+", text: 'weeks: 7,' },
    { sign: "+", text: 'confidence: 0.86,' },
    { sign: "+", text: 'breakdown: ["Discovery", "Arquitetura", "Build", "QA", "Deploy"],' },
    { sign: "-", text: '// previous: priceBRL: 32000, weeks: 9' },
  ];
  return (
    <div className="w-full max-w-md">
      <div className="flex items-center gap-2 mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-glow">
        <Sparkles className="h-3.5 w-3.5" />
        estimateProject() → output
      </div>
      <div className="rounded-xl border border-border/60 bg-[#0A0620] font-mono text-[12.5px] overflow-hidden">
        {lines.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`flex gap-3 px-4 py-1.5 ${
              l.sign === "+"
                ? "bg-brand-amarelo/[0.06] text-brand-amarelo"
                : "bg-brand-rosa/[0.05] text-brand-rosa/70 line-through"
            }`}
          >
            <span className="w-3 select-none opacity-60">{l.sign}</span>
            <span className="whitespace-pre">{l.text}</span>
          </motion.div>
        ))}
      </div>
      <p className="mt-3 font-mono text-[11px] text-muted-foreground">
        // resposta gerada em 1.2s · servidor TanStack + Lovable AI
      </p>
      <Link
        to="/estimar"
        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2.5 text-xs font-mono font-semibold text-primary-glow uppercase tracking-wider transition hover:bg-primary/20"
      >
        Testar o estimador de verdade <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function parseRoastSample(code: string) {
  const total = code.match(/monthTotal:\s*(\d+)/);
  const catName = code.match(/name:\s*"([^"]+)"/);
  const catAmt = code.match(/amount:\s*(\d+)/);
  if (!total || !catName || !catAmt) return null;
  return {
    monthTotal: Number(total[1]),
    topCategory: { name: catName[1], amount: Number(catAmt[1]) },
  };
}

// ---------- Component ----------

export function ProofOfWork() {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<TabKey>("useAuth");
  const [codeByTab, setCodeByTab] = useState<Record<TabKey, string>>({
    useAuth: CODE_AUTH,
    roast: CODE_ROAST,
    estimateAI: CODE_ESTIMATE,
  });
  const [running, setRunning] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const runTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const currentCode = codeByTab[tab];
  const currentTab = TABS.find((t) => t.key === tab)!;
  const currentLabel = currentTab.label;

  // O e-mail é lido do código no editor — editar o login(...) muda o resultado.
  const handleRun = () => {
    runTimers.current.forEach(clearTimeout);
    runTimers.current = [];
    setRunning(true);
    setUser(null);
    setLogs([]);

    const match = currentCode.match(/login\(\s*["']([^"']+)["']/);
    const email = match?.[1] ?? "ana@dreamscraft.dev";
    const name = email.split("@")[0].replace(/^./, (c) => c.toUpperCase());
    const steps = [
      `> useAuth().login("${email}")`,
      "→ supabase.auth.signInWithOtp(...)",
      "→ sessão criada · token emitido",
      "✓ autenticado em 312ms",
    ];

    if (reduce) {
      setLogs(steps);
      setUser({ name, email });
      setRunning(false);
      return;
    }

    steps.forEach((s, i) => {
      runTimers.current.push(
        setTimeout(() => setLogs((prev) => [...prev, s]), 320 * (i + 1)),
      );
    });
    runTimers.current.push(
      setTimeout(() => {
        setUser({ name, email });
        setRunning(false);
      }, 320 * steps.length + 350),
    );
  };

  return (
    <section
      id="live-demo"
      className="mx-auto max-w-7xl px-6 py-12 lg:py-16 scroll-mt-24"
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10"
      >
        <p className="text-[11px] uppercase tracking-[0.32em] text-primary-glow font-mono">
          // live_demo
        </p>
        <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-light text-soft-glow">
          Proof of Work <span className="font-mono text-primary">(live)</span>
        </h2>
      </motion.div>

      {/* Tabs */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {TABS.map((t) => {
          const active = t.key === tab;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`group relative inline-flex items-center gap-2 rounded-t-lg border px-3.5 py-2 font-mono text-xs transition ${
                active
                  ? "border-primary/40 bg-[#0A0A0A] text-primary-glow"
                  : "border-border/60 bg-card/30 text-muted-foreground hover:text-foreground hover:bg-card/60"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  active ? "bg-brand-amarelo" : "bg-muted-foreground/40"
                }`}
              />
              {t.label}
              <span
                className={`ml-1 text-[9px] uppercase tracking-[0.18em] px-1.5 py-0.5 rounded border ${
                  active
                    ? "border-brand-amarelo/40 text-brand-amarelo bg-brand-amarelo/10"
                    : "border-border/60 text-muted-foreground"
                }`}
              >
                {t.badge}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* EDITOR */}
        <motion.div
          initial={reduce ? false : { opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl overflow-hidden border border-border bg-[#0A0A0A]"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2C2C2C] bg-[#0A0A0A]">
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
              <span className="ml-3">{currentLabel}</span>
            </div>
            {tab === "useAuth" ? (
              <button
                type="button"
                onClick={handleRun}
                disabled={running}
                aria-label="Executar código"
                className="group inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-mono text-primary-glow transition hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5" />
                {running ? "Executando..." : "Executar"}
              </button>
            ) : (
              <span className="inline-flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                <PencilLine className="h-3.5 w-3.5" />
                editável — o preview reage
              </span>
            )}
          </div>

          <ClientOnly
            fallback={
              <div className="h-[420px] flex items-center justify-center font-mono text-xs text-muted-foreground">
                Carregando editor...
              </div>
            }
          >
            <Suspense
              fallback={
                <div className="h-[420px] flex items-center justify-center font-mono text-xs text-muted-foreground">
                  Carregando editor...
                </div>
              }
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MonacoEditor
                    height="420px"
                    defaultLanguage="typescript"
                    path={`${tab}.ts`}
                    value={currentCode}
                    onChange={(v) =>
                      setCodeByTab((prev) => ({ ...prev, [tab]: v ?? "" }))
                    }
                    theme="vs-dark"
                    options={{
                      fontFamily: "'Cascadia Code', monospace",
                      fontSize: 13,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      padding: { top: 16, bottom: 16 },
                      lineNumbers: "on",
                      renderLineHighlight: "none",
                      smoothScrolling: true,
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </ClientOnly>
        </motion.div>

        {/* PREVIEW */}
        <motion.div
          initial={reduce ? false : { opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-border bg-card/40 backdrop-blur p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              // preview · {currentLabel}
            </span>
            <span className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
              <span
                className={`h-2 w-2 rounded-full ${
                  running
                    ? "bg-brand-amber animate-pulse"
                    : tab === "useAuth"
                      ? user
                        ? "bg-brand-amarelo"
                        : "bg-muted"
                      : "bg-brand-amarelo"
                }`}
              />
              {running ? "running" : "ready"}
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center rounded-xl bg-[#0A0A0A] border border-[#2C2C2C] p-8 min-h-[360px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="w-full flex items-center justify-center"
              >
                {tab === "useAuth" && <AuthPreview running={running} user={user} logs={logs} />}
                {tab === "roast" && <RoastPreview code={currentCode} />}
                {tab === "estimateAI" && <EstimatePreview />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <motion.p
        initial={reduce ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-10 text-center text-base sm:text-lg text-muted-foreground"
      >
        Código de verdade, escrito por nós — o estimador desta página{" "}
        <span className="text-primary-glow font-medium">roda em produção neste site</span>.
      </motion.p>
    </section>
  );
}
