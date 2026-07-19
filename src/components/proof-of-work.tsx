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
  budget: 5000,
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
  { key: "useAuth",    label: "Login ao vivo",     code: CODE_AUTH,     badge: "mexa e rode" },
  { key: "roast",      label: "FYNK · copiloto",   code: CODE_ROAST,    badge: "produto próprio" },
  { key: "estimateAI", label: "Estimador",         code: CODE_ESTIMATE, badge: "abre o real" },
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
  const goal = sample?.goalSave ?? 1000;
  const budget = sample?.budget ?? 5000;
  const overBudget = sample ? sample.monthTotal - budget : 0;
  const mode =
    !sample
      ? "empty"
      : sample.monthTotal === 0
        ? "zero"
        : sample.topCategory.amount === 0
          ? "noCategory"
          : sample.monthTotal <= budget
            ? "onTrack"
            : "overspent";

  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-glow">
        <Flame className="h-3.5 w-3.5" />
        FYNK · copiloto sarcástico
      </div>

      <p className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground/80">
        <PencilLine className="h-3 w-3 shrink-0" />
        Edite <span className="text-primary-glow">monthTotal</span>,{" "}
        <span className="text-primary-glow">amount</span> ou a meta em{" "}
        <span className="text-primary-glow">goal</span> — o preview reage na hora.
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
            key={`${sample.monthTotal}-${sample.topCategory.amount}-${goal}-${mode}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-4"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary-glow mb-2">
              // roast → você
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {mode === "zero" && (
                <>
                  R$ 0 no mês. Ou você virou monge, ou esqueceu de importar a fatura.
                  Meta de guardar R$ {goal.toLocaleString("pt-BR")} continua de pé —
                  sem gasto não tem roast, tem suspeita.
                </>
              )}
              {mode === "noCategory" && (
                <>
                  Mês em R$ {sample.monthTotal.toLocaleString("pt-BR")}, mas a categoria
                  top está em R$ 0. Ou categorizou tudo como “outros”, ou está me testando.
                </>
              )}
              {mode === "overspent" && (
                <>
                  R$ {sample.monthTotal.toLocaleString("pt-BR")} no mês e{" "}
                  <span className="text-brand-rosa">
                    R$ {sample.topCategory.amount.toLocaleString("pt-BR")} em{" "}
                    {sample.topCategory.name}
                  </span>
                  . Orçamento era R$ {budget.toLocaleString("pt-BR")} (meta: guardar R${" "}
                  {goal.toLocaleString("pt-BR")}) e você estourou em R${" "}
                  {Math.max(0, overBudget).toLocaleString("pt-BR")}. Boa sorte pedindo a
                  reserva emprestada pro entregador.
                </>
              )}
              {mode === "onTrack" && (
                <>
                  R$ {sample.monthTotal.toLocaleString("pt-BR")} no mês
                  {sample.topCategory.amount > 0 && (
                    <>
                      {" "}
                      (maior fatia:{" "}
                      <span className="text-brand-rosa">
                        R$ {sample.topCategory.amount.toLocaleString("pt-BR")} em{" "}
                        {sample.topCategory.name}
                      </span>
                      )
                    </>
                  )}
                  . Dentro do orçamento de R$ {budget.toLocaleString("pt-BR")} e a meta de
                  guardar R$ {goal.toLocaleString("pt-BR")} ainda respira. Não acostuma —
                  eu ainda estou de olho.
                </>
              )}
            </p>
            <p className="mt-3 font-mono text-[11px] text-brand-amarelo">
              {mode === "zero" && "→ ação: importa o extrato ou admite o jejum."}
              {mode === "noCategory" && "→ ação: categoriza direito antes do próximo roast."}
              {mode === "onTrack" &&
                `→ ação: mantém ${sample.topCategory.name} no limite e fecha a meta.`}
              {mode === "overspent" &&
                `→ ação: corta ${sample.topCategory.name} pela metade na próxima semana.`}
            </p>
          </motion.div>
        </>
      )}
    </div>
  );
}

function EstimatePreview() {
  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-brand-azul">
        <Sparkles className="h-3.5 w-3.5" />
        Estimador de projeto
      </div>
      <p className="text-sm text-foreground/90 leading-relaxed">
        À esquerda está um trecho do código que alimenta nosso estimador.
        O preview aqui é ilustrativo — o fluxo de verdade é um terminal em que você
        descreve a ideia e recebe faixa de prazo e investimento.
      </p>
      <div className="rounded-xl border border-border/60 bg-[#0A0620] p-4 font-mono text-xs space-y-2">
        <p className="text-muted-foreground">// exemplo de saída (não é orçamento final)</p>
        <p className="text-brand-amarelo">faixa · R$ 12k–28k</p>
        <p className="text-brand-azul">prazo · 3–7 semanas</p>
        <p className="text-foreground/80">escopo · MVP web com auth + 1 integração</p>
      </div>
      <Link
        to="/estimar"
        className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2.5 text-xs font-mono font-semibold text-primary-glow uppercase tracking-wider transition hover:bg-primary/20"
      >
        Descrever minha ideia <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function parseRoastSample(code: string) {
  const total = code.match(/monthTotal:\s*(\d+)/);
  const amount = code.match(/amount:\s*(\d+)/);
  const name = code.match(/name:\s*["']([^"']+)["']/);
  const budgetMatch = code.match(/budget:\s*(\d+)/);
  const goalMatch = code.match(/Guardar\s*R\$\s*([\d.]+)/i);
  if (!total || !amount || !name) return null;
  const goalRaw = goalMatch?.[1]?.replace(/\./g, "") ?? "1000";
  return {
    monthTotal: Number(total[1]),
    topCategory: { name: name[1], amount: Number(amount[1]) },
    budget: budgetMatch ? Number(budgetMatch[1]) : 5000,
    goalSave: Number(goalRaw) || 1000,
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
        <p className="text-[11px] uppercase tracking-[0.32em] text-brand-azul font-mono">
          // prova.de.trabalho
        </p>
        <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-light text-soft-glow">
          Código rodando <span className="font-mono text-primary">ao vivo</span>
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Três demos do que a gente constrói: um login que você executa, o copiloto
          do FYNK (produto nosso) e o caminho para estimar o seu projeto.
        </p>
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
        Código de verdade, escrito por nós — o estimador em{" "}
        <Link to="/estimar" className="text-primary-glow underline-offset-2 hover:underline">
          /estimar
        </Link>{" "}
        roda em produção neste site.
      </motion.p>
    </section>
  );
}
