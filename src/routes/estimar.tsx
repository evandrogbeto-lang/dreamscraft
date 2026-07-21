import { termToast } from "@/lib/term-toast";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { estimateProject, type EstimateResult } from "@/lib/estimate.functions";
import { submitLead } from "@/lib/leads.functions";
import { CodeRainBackground } from "@/components/code-rain-background";

export const Route = createFileRoute("/estimar")({
  head: () => {
    const title = "Estimar projeto · Dreamscraft Code";
    const description =
      "Terminal interativo: descreva sua ideia e receba escopo, stack, prazo e investimento.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: EstimarPage,
});

// ─────────────────────────────────────────────────────────────
// Typewriter
function Typewriter({
  text,
  speed = 18,
  onDone,
}: {
  text: string;
  speed?: number;
  onDone?: () => void;
}) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);
  return <span>{shown}</span>;
}

// ─────────────────────────────────────────────────────────────
// Types

type ProjectType = "Web" | "App" | "API" | "Automação";
type Timeline = "urgente (1-2 sem)" | "normal (4-6 sem)" | "flexível";

type Phase =
  | "intro"
  | "ask_desc"
  | "ask_type"
  | "ask_timeline"
  | "compiling"
  | "result"
  | "error";

// ─────────────────────────────────────────────────────────────
function EstimarPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState<ProjectType | "">("");
  const [timeline, setTimeline] = useState<Timeline | "">("");
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [compileLog, setCompileLog] = useState<string[]>([]);

  const estimate = useServerFn(estimateProject);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [phase, description, projectType, timeline, compileLog, result, error]);

  // Compile sequence
  useEffect(() => {
    if (phase !== "compiling") return;
    const lines = [
      "→ parsing input...",
      "→ tokenizing requirements...",
      "→ resolving stack dependencies...",
      "→ invoking gemini-2.5-pro...",
      "→ estimating complexity matrix...",
      "→ compiling diff...",
    ];
    setCompileLog([]);
    let i = 0;
    const id = setInterval(() => {
      setCompileLog((prev) => [...prev, lines[i]]);
      i++;
      if (i >= lines.length) clearInterval(id);
    }, 380);

    const run = async () => {
      try {
        const minDelay = new Promise((r) => setTimeout(r, lines.length * 380 + 400));
        const [res] = await Promise.all([
          estimate({
            data: {
              description,
              projectType,
              hasDesign: "",
              timeline,
              companySize: "",
              hasIntegration: "",
            },
          }),
          minDelay,
        ]);
        setResult(res);
        setPhase("result");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro desconhecido");
        setPhase("error");
      }
    };
    run();

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const reset = () => {
    setDescription("");
    setProjectType("");
    setTimeline("");
    setResult(null);
    setError(null);
    setCompileLog([]);
    setPhase("intro");
  };

  return (
    <div className="relative min-h-screen bg-background pt-20 pb-24 px-4 overflow-hidden">
      <CodeRainBackground seed={11} palette="rosa-azul" className="opacity-25" />
      <div className="relative mx-auto max-w-3xl">
        {/* Terminal frame */}
        <div className="rounded-lg border border-border bg-card/40 backdrop-blur-sm shadow-2xl overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/40 border-b border-border">
            <span className="h-3 w-3 rounded-full bg-brand-rosa/70" />
            <span className="h-3 w-3 rounded-full bg-brand-amber/70" />
            <span className="h-3 w-3 rounded-full bg-brand-amarelo/70" />
            <span className="ml-3 font-mono text-xs text-muted-foreground">
              ~/dreamscraft — zsh — estimate
            </span>
          </div>

          {/* Body */}
          <div
            ref={scrollRef}
            className="font-mono text-sm p-6 sm:p-8 min-h-[520px] max-h-[75vh] overflow-y-auto space-y-4 leading-relaxed"
          >
            {/* Intro */}
            <Line prompt="$">
              <span className="text-primary">
                <Typewriter
                  text="dreamscraft estimate --interactive"
                  onDone={() => phase === "intro" && setTimeout(() => setPhase("ask_desc"), 350)}
                />
              </span>
            </Line>

            {phase !== "intro" && (
              <div className="text-muted-foreground pl-4 border-l border-border/60 ml-1">
                Dreamscraft Estimate CLI v1.0 · powered by gemini-2.5-pro
                <br />
                Conversa rápida. Sem formulário. Responda 3 perguntas.
              </div>
            )}

            {/* Q1: description */}
            {phase === "ask_desc" || ["ask_type", "ask_timeline", "compiling", "result", "error"].includes(phase) ? (
              <QuestionDesc
                value={description}
                setValue={setDescription}
                locked={phase !== "ask_desc"}
                onSubmit={() => setPhase("ask_type")}
              />
            ) : null}

            {/* Q2: type */}
            {["ask_type", "ask_timeline", "compiling", "result", "error"].includes(phase) && (
              <QuestionType
                value={projectType}
                setValue={(v) => {
                  setProjectType(v);
                  setTimeout(() => setPhase("ask_timeline"), 250);
                }}
                locked={phase !== "ask_type"}
              />
            )}

            {/* Q3: timeline */}
            {["ask_timeline", "compiling", "result", "error"].includes(phase) && (
              <QuestionTimeline
                value={timeline}
                setValue={(v) => {
                  setTimeline(v);
                  setTimeout(() => setPhase("compiling"), 250);
                }}
                locked={phase !== "ask_timeline"}
              />
            )}

            {/* Compiling */}
            {(phase === "compiling" || phase === "result" || phase === "error") && (
              <div className="pl-1 space-y-1 text-muted-foreground">
                <div className="text-primary">$ compile --scope</div>
                {compileLog.map((l) => (
                  <div key={l}>{l}</div>
                ))}
                {phase === "compiling" && (
                  <div className="text-primary animate-pulse">█</div>
                )}
              </div>
            )}

            {/* Result diff */}
            {phase === "result" && result && (
              <ResultDiff
                result={result}
                description={description}
                projectType={projectType as ProjectType}
                timeline={timeline as Timeline}
              />
            )}

            {/* Error */}
            {phase === "error" && (
              <div className="space-y-2">
                <div className="text-brand-rosa">✗ erro: {error}</div>
                <button
                  onClick={reset}
                  className="text-primary hover:underline"
                >
                  → tentar novamente
                </button>
              </div>
            )}

            {phase === "result" && (
              <button
                onClick={reset}
                className="mt-6 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                $ reset --new-estimate
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function Line({ prompt, children }: { prompt: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="text-primary select-none">{prompt}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function QuestionDesc({
  value,
  setValue,
  locked,
  onSubmit,
}: {
  value: string;
  setValue: (v: string) => void;
  locked: boolean;
  onSubmit: () => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (!locked) ref.current?.focus();
  }, [locked]);

  const tooShort = value.trim().length > 0 && value.trim().length < 50;
  const ok = value.trim().length >= 50;

  return (
    <div className="space-y-2">
      <Line prompt="?">
        <span className="text-foreground">
          Descreva sua ideia em até 200 caracteres:
        </span>
      </Line>
      <div className="pl-4">
        {locked ? (
          <div className="text-muted-foreground italic break-words">"{value}"</div>
        ) : (
          <>
            <textarea
              ref={ref}
              value={value}
              maxLength={200}
              rows={3}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && ok) {
                  e.preventDefault();
                  onSubmit();
                }
              }}
              placeholder="ex: app para conectar caminhoneiros a embarcadores..."
              className="w-full bg-transparent border border-border rounded px-3 py-2 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary resize-none font-mono text-sm"
            />
            <div className="flex items-center justify-between text-xs mt-1.5">
              <span className={tooShort ? "text-brand-amarelo" : "text-muted-foreground"}>
                {tooShort
                  ? `⚠ mín. 50 caracteres (faltam ${50 - value.trim().length})`
                  : `${value.length}/200`}
              </span>
              <button
                disabled={!ok}
                onClick={onSubmit}
                className="text-primary disabled:text-muted-foreground disabled:cursor-not-allowed hover:underline"
              >
                [enter] continuar →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function QuestionType({
  value,
  setValue,
  locked,
}: {
  value: ProjectType | "";
  setValue: (v: ProjectType) => void;
  locked: boolean;
}) {
  const opts: ProjectType[] = ["Web", "App", "API", "Automação"];
  return (
    <div className="space-y-2">
      <Line prompt="?">
        <span className="text-foreground">Tipo de projeto:</span>
      </Line>
      <div className="pl-4 flex flex-wrap gap-2">
        {opts.map((o) => {
          const selected = value === o;
          const dim = locked && !selected;
          return (
            <button
              key={o}
              disabled={locked}
              onClick={() => setValue(o)}
              className={[
                "inline-flex items-center min-h-11 px-4 py-2.5 rounded border font-mono text-sm transition-all",
                selected
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary",
                dim && "opacity-40",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              [{o}]
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function QuestionTimeline({
  value,
  setValue,
  locked,
}: {
  value: Timeline | "";
  setValue: (v: Timeline) => void;
  locked: boolean;
}) {
  const opts: Timeline[] = ["urgente (1-2 sem)", "normal (4-6 sem)", "flexível"];
  return (
    <div className="space-y-2">
      <Line prompt="?">
        <span className="text-foreground">Prazo desejado:</span>
      </Line>
      <div className="pl-4 flex flex-wrap gap-2">
        {opts.map((o) => {
          const selected = value === o;
          const dim = locked && !selected;
          return (
            <button
              key={o}
              disabled={locked}
              onClick={() => setValue(o)}
              className={[
                "inline-flex items-center min-h-11 px-4 py-2.5 rounded border font-mono text-sm transition-all",
                selected
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary",
                dim && "opacity-40",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              [{o}]
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function ResultDiff({
  result,
  description,
  projectType,
  timeline,
}: {
  result: EstimateResult;
  description: string;
  projectType: ProjectType;
  timeline: Timeline;
}) {
  const fmt = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

  const waMsg = encodeURIComponent(
    `Olá! Acabei de gerar uma estimativa no site.\n\n` +
      `Projeto: ${projectType}\n` +
      `Prazo: ${timeline}\n` +
      `Descrição: ${description}\n\n` +
      `Estimativa IA:\n` +
      `- Complexidade: ${result.complexidade}\n` +
      `- Prazo: ${result.prazo.min}–${result.prazo.max} ${result.prazo.unit}\n` +
      `- Investimento: ${fmt(result.investimento.min)} – ${fmt(result.investimento.max)}\n\n` +
      `Quero conversar sobre os próximos passos.`,
  );

  return (
    <div className="mt-4 space-y-4">
      <div className="text-primary">$ git diff scope.estimate</div>

      <div className="rounded border border-border bg-background/60 overflow-hidden">
        {/* Header */}
        <div className="px-3 py-1.5 bg-muted/40 border-b border-border text-xs text-muted-foreground flex items-center justify-between">
          <span>diff --estimate</span>
          <span>complexidade: {result.complexidade}</span>
        </div>

        <div className="p-3 space-y-0.5 text-xs sm:text-sm">
          {/* Context */}
          <DiffRow type="ctx">@@ resumo @@</DiffRow>
          <DiffRow type="ctx" className="text-foreground/80">
            {result.resumo}
          </DiffRow>

          <div className="h-2" />

          {/* Additions: stack */}
          <DiffRow type="ctx">@@ stack recomendada @@</DiffRow>
          {result.stack.map((s) => (
            <DiffRow key={s.tech} type="add">
              <span className="font-semibold">{s.tech}</span>
              <span className="text-brand-amarelo/70"> — {s.reason}</span>
            </DiffRow>
          ))}

          <div className="h-2" />

          {/* Additions: investment + prazo */}
          <DiffRow type="ctx">@@ entrega @@</DiffRow>
          <DiffRow type="add">
            prazo: {result.prazo.min}–{result.prazo.max} {result.prazo.unit}
          </DiffRow>
          <DiffRow type="add">
            investimento: {fmt(result.investimento.min)} – {fmt(result.investimento.max)}
          </DiffRow>

          <div className="h-2" />

          {/* Removals: risks */}
          <DiffRow type="ctx">@@ riscos a mitigar @@</DiffRow>
          {result.riscos.map((r, i) => (
            <DiffRow key={i} type="del">
              {r}
            </DiffRow>
          ))}
        </div>
      </div>

      {/* Lead capture */}
      <LeadCapture
        result={result}
        description={description}
        projectType={projectType}
        timeline={timeline}
      />

      {/* CTA */}
      <div className="pt-2 space-y-2">
        <div className="text-brand-amarelo">
          ✅ Esse escopo está dentro do nosso perfil.
        </div>
        <div className="text-muted-foreground text-xs select-none">── ou ──</div>
        <a
          href={`https://wa.me/5561991748651?text=${waMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded border border-primary bg-primary/15 text-primary hover:bg-primary/25 transition-colors font-mono text-sm"
        >
          → Iniciar conversa no WhatsApp
        </a>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function LeadCapture({
  result,
  description,
  projectType,
  timeline,
}: {
  result: EstimateResult;
  description: string;
  projectType: ProjectType;
  timeline: Timeline;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const save = useServerFn(submitLead);

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading" || status === "success") return;
    if (!emailRe.test(email.trim())) {
      setErrorMsg("✗ email inválido");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg(null);
    try {
      await save({
        data: {
          email: email.trim(),
          name: name.trim() || null,
          project_type: projectType,
          timeline,
          description,
          estimate_json: JSON.parse(JSON.stringify(result)),
        },
      });
      setStatus("success");
      termToast.success("estimativa salva");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Falha ao enviar";
      setErrorMsg(`✗ ${msg}`);
      setStatus("error");
      termToast.error(msg);
    }
  };

  if (status === "success") {
    return (
      <div className="pt-2 space-y-1 text-sm">
        <div className="text-brand-amarelo">
          ✓ estimate.saved → enviando para contato@dreamscraftcode.com
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="pt-2 space-y-2 text-sm">
      <div className="text-primary">$ save.estimate --send-to-email</div>
      <div className="grid sm:grid-cols-2 gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          maxLength={320}
          disabled={status === "loading"}
          className="bg-background/60 border border-border rounded px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome (opcional)"
          maxLength={200}
          disabled={status === "loading"}
          className="bg-background/60 border border-border rounded px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        />
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center gap-2 px-4 py-2 rounded border border-primary bg-primary/15 text-primary hover:bg-primary/25 transition-colors font-mono text-sm disabled:opacity-60"
        >
          [enter] Receber por email →
        </button>
        {status === "loading" && (
          <span className="text-muted-foreground animate-pulse">
            → saving lead...
          </span>
        )}
        {status === "error" && errorMsg && (
          <span className="text-brand-rosa">{errorMsg}</span>
        )}
      </div>
    </form>
  );
}

function DiffRow({
  type,
  children,
  className,
}: {
  type: "add" | "del" | "ctx";
  children: React.ReactNode;
  className?: string;
}) {
  const styles =
    type === "add"
      ? "bg-brand-amarelo/10 text-brand-amarelo border-l-2 border-brand-amarelo"
      : type === "del"
      ? "bg-brand-rosa/10 text-brand-rosa border-l-2 border-brand-rosa"
      : "text-muted-foreground border-l-2 border-transparent";
  const sign = type === "add" ? "+" : type === "del" ? "-" : " ";
  return (
    <div className={`flex gap-2 px-2 py-0.5 ${styles} ${className ?? ""}`}>
      <span className="select-none opacity-70 w-3">{sign}</span>
      <span className="flex-1 break-words">{children}</span>
    </div>
  );
}
