import { useId, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { whatsappHref } from "@/lib/contact";
import {
  DIAGNOSTIC_ANSWER_MAX_CHARS,
  DIAGNOSTIC_COMMERCIAL_NOTE,
  DIAGNOSTIC_CORRECTION_MAX_CHARS,
  DIAGNOSTIC_REPORT_MAX_CHARS,
  DIAGNOSTIC_REPORT_MIN_CHARS,
} from "@/lib/diagnostic/constants";
import {
  primaryActionForError,
  SESSION_EXPIRED_MESSAGE,
  SESSION_RESTORED_MESSAGE,
} from "@/lib/diagnostic/extraordinary";
import {
  DiagnosticCtaPrimary,
  DiagnosticCtaSecondary,
  DiagnosticPhaseMotion,
} from "./ui";
import type { useDiagnosticSession } from "./use-diagnostic-session";

type Flow = ReturnType<typeof useDiagnosticSession>;

type Chapter = "entry" | "understanding" | "context" | "result" | "other";

function chapterOf(mode: Flow["mode"]): Chapter {
  if (mode === "entry_direct" || mode === "entry_home" || mode === "interpreting") {
    return "entry";
  }
  if (mode === "understanding" || mode === "correction") return "understanding";
  if (mode === "clarifying" || mode === "synthesizing") return "context";
  if (mode === "result" || mode === "capture" || mode === "success") return "result";
  return "other";
}

function whatsappMessage(report: string, resultSummary?: string): string {
  const base = report.slice(0, 280);
  if (resultSummary) {
    return `Olá, vim pelo diagnóstico inicial da Dreamscraft.\n\nContexto: ${base}\n\nDireção: ${resultSummary.slice(0, 220)}`;
  }
  return `Olá, vim pelo diagnóstico inicial da Dreamscraft.\n\nContexto: ${base}`;
}

/** Container editorial — Figma V3.13 como direção, não frame literal. */
function ChapterShell({
  tone,
  children,
  className = "",
}: {
  tone: "roxo" | "lavanda";
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`px-4 py-10 sm:px-6 sm:py-12 md:px-8 lg:px-10 lg:py-14 ${
        tone === "roxo" ? "bg-brand-roxo" : "bg-brand-branco"
      } ${className}`}
    >
      <div className="mx-auto w-full max-w-[1200px]">{children}</div>
    </section>
  );
}

/**
 * Superfície lavanda enquadrada no canvas roxo —
 * motivo + âncora + margens (nunca massa clara solta).
 */
function EditorialSurface({
  children,
  className = "",
  measure = "wide",
}: {
  children: ReactNode;
  className?: string;
  /** wide ~ report; reading ~ texto longo */
  measure?: "wide" | "reading";
}) {
  return (
    <div
      className={`
        relative mx-auto w-full
        ${measure === "reading" ? "max-w-[44rem]" : "max-w-[52rem]"}
        rounded-2xl border border-brand-branco/20 bg-brand-branco
        p-5 sm:p-7 md:p-8 lg:px-10 lg:py-9
        ${className}
      `}
    >
      {children}
    </div>
  );
}

function InlineExpand({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto" }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function DiagnosticFlow(flow: Flow) {
  const chapter = chapterOf(flow.mode);

  return (
    <DiagnosticPhaseMotion phaseKey={chapter}>
      {flow.mode === "boot" && (
        <ChapterShell tone="roxo">
          <p className="text-[12px] text-brand-rosa">// DIAGNÓSTICO INICIAL</p>
          <h1 className="mt-5 max-w-xl text-[clamp(2rem,1.4rem+2vw,3rem)] leading-tight text-brand-branco">
            Preparando seu diagnóstico.
          </h1>
          <p className="mt-4 max-w-md text-[15px] text-brand-branco/85">
            Carregando o contexto salvo, se houver.
          </p>
          <p className="sr-only" aria-live="polite">
            Preparando diagnóstico.
          </p>
        </ChapterShell>
      )}

      {chapter === "entry" && <EntryChapter flow={flow} />}
      {chapter === "understanding" && <UnderstandingChapter flow={flow} />}
      {chapter === "context" && <ContextChapter flow={flow} />}
      {chapter === "result" && <ResultChapter flow={flow} />}
    </DiagnosticPhaseMotion>
  );
}

/** Aviso discreto de sessão — enquadrado, sem página própria. */
function SessionNoticeBanner({ flow }: { flow: Flow }) {
  if (!flow.sessionNotice) return null;
  const text =
    flow.sessionNotice === "expired" ? SESSION_EXPIRED_MESSAGE : SESSION_RESTORED_MESSAGE;

  return (
    <div
      className="mb-6 flex flex-col gap-3 rounded-md border border-brand-azul/40 bg-[#29175c] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5"
      role="status"
    >
      <p className="text-[13px] leading-relaxed text-brand-branco">{text}</p>
      <div className="flex flex-wrap gap-2">
        {flow.sessionNotice === "restored" && (
          <DiagnosticCtaSecondary
            tone="light"
            className="text-[12px]"
            onClick={flow.startFresh}
          >
            Começar novamente
          </DiagnosticCtaSecondary>
        )}
        <button
          type="button"
          className="min-h-10 px-2 text-[12px] text-brand-branco/70 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa"
          onClick={flow.dismissSessionNotice}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}

/** Erro / timeout / rate limit inline no capítulo atual. */
function InlineErrorBanner({
  flow,
  host,
}: {
  flow: Flow;
  host: "entry" | "context";
}) {
  const err = flow.inlineError;
  if (!err || err.host !== host) return null;

  const wa = whatsappHref(whatsappMessage(flow.session?.originalReport ?? flow.draftReport));
  const primary = primaryActionForError(err.kind);
  const isRate = err.kind === "rate_limited";

  return (
    <div
      className="mt-6 rounded-md border border-brand-rosa/50 bg-[#29175c] px-4 py-4 sm:px-5"
      role="alert"
    >
      <p className="text-[13px] leading-relaxed text-brand-branco">{err.message}</p>
      {!isRate && (
        <p className="mt-2 text-[11px] leading-relaxed text-brand-branco/70">
          Não inventamos um diagnóstico quando a organização falha. Seu texto continua aqui.
        </p>
      )}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {primary === "whatsapp" ? (
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-[9px] bg-brand-rosa px-5 text-[13px] text-brand-roxo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-branco"
          >
            Continuar pelo WhatsApp →
          </a>
        ) : (
          <DiagnosticCtaPrimary disabled={flow.pending} onClick={() => void flow.retry()}>
            Tentar novamente
          </DiagnosticCtaPrimary>
        )}
        {primary === "retry" && (
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-[9px] border border-brand-branco/70 px-5 text-[13px] text-brand-branco focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa"
          >
            Continuar pelo WhatsApp
          </a>
        )}
        {isRate && (
          <DiagnosticCtaSecondary tone="light" onClick={flow.clearInlineError}>
            Manter contexto
          </DiagnosticCtaSecondary>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── 01 ENTRADA ───────────────────────── */

function EntryChapter({ flow }: { flow: Flow }) {
  const id = useId();
  const interpreting = flow.mode === "interpreting" || flow.pending;
  const fromHome = flow.mode === "entry_home";
  const len = flow.draftReport.trim().length;
  const ok = len >= DIAGNOSTIC_REPORT_MIN_CHARS && len <= DIAGNOSTIC_REPORT_MAX_CHARS;

  const analyze = () =>
    void flow.startAnalyze(
      flow.draftReport,
      fromHome ? (flow.session?.source === "legacy_url" ? "legacy_url" : "home") : "direct",
      flow.session?.category,
    );

  return (
    <ChapterShell tone="roxo">
      <SessionNoticeBanner flow={flow} />
      <div
        className="
          grid gap-8
          max-[1099px]:grid-cols-1
          min-[1100px]:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)]
          min-[1100px]:items-start min-[1100px]:gap-10
          min-[1280px]:gap-12
        "
      >
        <div className="min-w-0 max-[1099px]:max-w-2xl">
          <p className="text-[12px] text-brand-rosa">// DIAGNÓSTICO INICIAL</p>
          <h1 className="mt-5 text-balance text-[clamp(2rem,1.25rem+2.2vw,3.25rem)] leading-[1.15] text-brand-branco">
            Comece pelo que está acontecendo. Não pela tecnologia.
          </h1>
          <p className="mt-5 max-w-[26rem] text-[clamp(0.9375rem,0.88rem+0.35vw,1.0625rem)] leading-relaxed text-brand-branco/90">
            {fromHome
              ? "Recebemos o relato da Home. Confira se está correto antes de analisar o cenário."
              : "Descreva o cenário como ele funciona hoje. A Dreamscraft organiza o contexto antes de pensar na solução."}
          </p>
          <p className="mt-4 max-w-[26rem] text-[11px] leading-relaxed text-brand-branco/70">
            Sem stack. Sem orçamento automático. Primeiro: contexto, objetivo e gargalo.
          </p>
        </div>

        <div className="min-w-0">
          <div className="rounded-2xl border border-brand-branco/15 bg-brand-branco p-5 sm:p-6 md:p-7 lg:p-8">
            <label
              htmlFor={id}
              className="block text-[12px] uppercase tracking-wide text-brand-roxo"
            >
              Conte o que está acontecendo hoje.
            </label>

            <textarea
              id={id}
              name="diagnostic-report"
              required
              rows={7}
              maxLength={DIAGNOSTIC_REPORT_MAX_CHARS}
              value={flow.draftReport}
              onChange={(e) => flow.setDraftReport(e.target.value)}
              readOnly={interpreting}
              placeholder="Ex.: os pedidos chegam pelo WhatsApp, cada pessoa anota de um jeito e algumas pendências só aparecem quando alguém cobra."
              className="
                mt-3 w-full resize-y rounded-[10px] border border-brand-rosa bg-white
                px-4 py-4 text-[15px] leading-relaxed text-brand-roxo
                placeholder:text-brand-roxo/45
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa
                min-h-[clamp(10rem,26vh,18rem)]
                read-only:cursor-default read-only:opacity-90
                sm:text-[16px]
              "
              aria-describedby={`${id}-hint ${id}-tip`}
            />

            <p id={`${id}-hint`} className="mt-3 text-[11px] text-brand-azul">
              {DIAGNOSTIC_REPORT_MIN_CHARS}–{DIAGNOSTIC_REPORT_MAX_CHARS} caracteres · você poderá
              revisar antes de continuar
              {len > 0 ? ` · ${len}` : ""}
            </p>

            <div className="mt-6">
              <DiagnosticCtaPrimary
                className="w-full whitespace-normal text-center sm:w-auto sm:min-w-[15rem]"
                disabled={!ok || interpreting}
                onClick={analyze}
              >
                {interpreting ? "Organizando…" : "Analisar este cenário →"}
              </DiagnosticCtaPrimary>
            </div>

            <p
              id={`${id}-tip`}
              className="mt-4 text-[12px] leading-relaxed text-brand-roxo/75"
            >
              {interpreting
                ? "Seu relato permanece visível. Nenhuma decisão é tomada sem sua confirmação."
                : ok
                  ? "Fale do processo, da rotina ou do gargalo. Não precisa saber qual solução pedir."
                  : "Preencha pelo menos 12 caracteres para continuar. Não precisa saber qual solução pedir."}
            </p>
          </div>
        </div>
      </div>

      <InlineExpand open={interpreting && !flow.inlineError}>
        <div className="mt-8 rounded-xl border border-brand-rosa/80 bg-[#29175c] px-5 py-4 sm:px-6">
          <p className="text-[13px] leading-relaxed text-brand-branco" aria-live="polite">
            Organizando o que você descreveu…
          </p>
          <p className="mt-1 text-[11px] text-brand-branco/70">
            Separando contexto, problema aparente e pontos a confirmar — sem trocar de página.
          </p>
        </div>
      </InlineExpand>

      <InlineErrorBanner flow={flow} host="entry" />
    </ChapterShell>
  );
}

/* ───────────────────────── 02 ENTENDIMENTO ───────────────────────── */

function UnderstandingChapter({ flow }: { flow: Flow }) {
  const data = flow.session?.interpretation;
  const id = useId();
  const correcting = flow.correctionIntent !== null;
  if (!data) return null;

  const correctionTitle =
    flow.correctionIntent === "reject"
      ? "O que deveríamos ter entendido?"
      : "O que precisa ser ajustado?";

  return (
    <ChapterShell tone="roxo">
      <EditorialSurface measure="wide">
        <SessionNoticeBanner flow={flow} />
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="text-[12px] text-brand-rosa">// 01 · ENTENDIMENTO</p>
          <p className="text-[11px] text-brand-azul">ETAPA 1 DE 4</p>
        </div>

        <h1 className="mt-5 max-w-[36rem] text-balance text-[clamp(1.85rem,1.2rem+1.8vw,2.75rem)] leading-[1.18] text-brand-roxo">
          Antes de recomendar, queremos confirmar o que ouvimos.
        </h1>

        <div className="mt-8 grid gap-8 min-[1100px]:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] min-[1100px]:gap-10">
          <div className="min-w-0">
            <div className="relative overflow-hidden rounded-xl bg-brand-roxo p-5 sm:p-6">
              <span className="absolute inset-y-0 left-0 w-1 bg-brand-rosa" aria-hidden />
              <p className="pl-3 text-[11px] tracking-wide text-brand-branco/80">
                HIPÓTESE INICIAL · O QUE ENTENDEMOS
              </p>
              <p className="mt-3 pl-3 text-[clamp(1rem,0.92rem+0.45vw,1.2rem)] leading-snug text-brand-branco">
                {data.understanding}
              </p>
            </div>

            <div className="mt-6 border-t border-brand-azul/30 pt-5">
              <p className="text-[11px] tracking-wide text-brand-roxo">
                O QUE AINDA PRECISAMOS ENTENDER
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-brand-roxo/85 sm:text-[15px]">
                {data.uncertainties.join(" · ")}
              </p>
            </div>
          </div>

          <aside className="min-w-0 min-[1100px]:border-l min-[1100px]:border-brand-rosa/40 min-[1100px]:pl-7">
            <p className="text-[11px] tracking-wide text-brand-roxo">PROBLEMA PRINCIPAL APARENTE</p>
            <p className="mt-2 max-w-md text-[14px] leading-relaxed text-brand-roxo/85 sm:text-[15px]">
              {data.primaryProblemHypothesis}
            </p>
            <p className="mt-6 text-[11px] tracking-wide text-brand-roxo">
              DIREÇÃO QUE PODE FAZER SENTIDO
            </p>
            <p className="mt-2 max-w-md text-[14px] leading-relaxed text-brand-roxo/85 sm:text-[15px]">
              {data.possibleDirection}
            </p>

            {!correcting && (
              <>
                <p className="mt-8 text-[13px] text-brand-roxo">Isso representa bem o problema?</p>
                <div className="mt-4 flex flex-col gap-3">
                  <DiagnosticCtaPrimary
                    className="w-full max-w-[16rem]"
                    onClick={flow.confirmYes}
                  >
                    Sim, faz sentido
                  </DiagnosticCtaPrimary>
                  <DiagnosticCtaSecondary
                    tone="dark"
                    className="w-full max-w-[16rem] bg-brand-branco"
                    onClick={() => flow.openCorrection("adjust")}
                  >
                    Quero ajustar
                  </DiagnosticCtaSecondary>
                  <button
                    type="button"
                    className="min-h-11 max-w-[16rem] text-left text-[12px] text-brand-rosa underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa"
                    onClick={() => flow.openCorrection("reject")}
                  >
                    Não foi isso
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>

        <InlineExpand open={correcting}>
          <div className="mt-7 rounded-[10px] border border-brand-rosa/70 bg-white p-5 sm:p-6">
            <p className="text-[11px] tracking-wide text-brand-azul">AJUSTE INLINE</p>
            <h2 className="mt-2 text-[clamp(1.1rem,1rem+0.5vw,1.3rem)] text-brand-roxo">
              {correctionTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-brand-roxo/75">
              Sua correção passa a ser a fonte de verdade. Não chamamos o modelo de novo — seguimos
              com perguntas neutras de negócio.
            </p>
            <label htmlFor={id} className="mt-5 block text-[12px] text-brand-roxo">
              Correção
            </label>
            <textarea
              id={id}
              name="diagnostic-correction"
              rows={5}
              maxLength={DIAGNOSTIC_CORRECTION_MAX_CHARS}
              value={flow.correctionDraft}
              onChange={(e) => flow.setCorrectionDraft(e.target.value)}
              className="mt-2 w-full rounded-[10px] border-2 border-brand-roxo bg-white px-4 py-3 text-[15px] text-brand-roxo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa"
            />
            <div className="mt-5 flex flex-wrap gap-3">
              <DiagnosticCtaPrimary
                disabled={!flow.correctionDraft.trim()}
                onClick={flow.submitCorrection}
              >
                Continuar com a correção →
              </DiagnosticCtaPrimary>
              <DiagnosticCtaSecondary
                tone="dark"
                className="bg-white"
                onClick={flow.closeCorrection}
              >
                Cancelar
              </DiagnosticCtaSecondary>
            </div>
          </div>
        </InlineExpand>
      </EditorialSurface>
    </ChapterShell>
  );
}

/* ───────────────────────── 03 CONTEXTO ───────────────────────── */

function ContextChapter({ flow }: { flow: Flow }) {
  const id = useId();
  const synthesizing =
    !flow.inlineError &&
    (flow.mode === "synthesizing" || (flow.pending && flow.mode === "clarifying"));
  const q = flow.currentQuestion;
  const total = Math.min(flow.questions.length, 3) || 3;
  const n = Math.min(flow.questionIndex + 1, total);

  return (
    <ChapterShell tone="roxo">
      <SessionNoticeBanner flow={flow} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-[12px] text-brand-rosa">// 02 · CONTEXTO</p>
        <p className="text-[12px] tabular-nums text-brand-branco/90" aria-live="polite">
          {synthesizing ? "…" : `${n} / ${total}`}
        </p>
      </div>

      {synthesizing ? (
        <>
          <h1 className="mt-6 max-w-[42rem] text-balance text-[clamp(2rem,1.3rem+2vw,3rem)] leading-[1.15] text-brand-branco">
            Organizando a direção…
          </h1>
          <p className="mt-5 max-w-[40rem] text-[15px] leading-relaxed text-brand-branco/85">
            Cruzando o que você confirmou com as respostas de contexto — sem inventar preço, prazo
            ou stack.
          </p>
          <div className="mt-8 max-w-[min(100%,54rem)] rounded-[10px] border border-brand-azul/70 bg-[#29175c] px-5 py-4">
            <p className="text-[12px] leading-relaxed text-brand-branco" aria-live="polite">
              Seu relato continua preservado. Em seguida, o Resultado abre neste mesmo fluxo.
            </p>
          </div>
        </>
      ) : q ? (
        <>
          <h1 className="mt-6 max-w-[48rem] text-balance text-[clamp(2rem,1.2rem+2.4vw,3.25rem)] leading-[1.15] text-brand-branco">
            {q.prompt}
          </h1>
          <p className="mt-5 max-w-[40rem] text-[13px] leading-relaxed text-brand-branco/85 sm:text-[14px]">
            {q.helpText ??
              "Responda do seu jeito. Não precisamos de termos técnicos — queremos entender como a operação funciona hoje."}
          </p>

          <div className="mt-10 max-w-[min(100%,54rem)] rounded-2xl bg-brand-branco p-5 sm:p-6 md:p-7">
            <label htmlFor={id} className="block text-[12px] uppercase tracking-wide text-brand-roxo">
              Sua resposta
            </label>
            <textarea
              id={id}
              name={`diagnostic-answer-${q.id}`}
              rows={5}
              maxLength={DIAGNOSTIC_ANSWER_MAX_CHARS}
              value={flow.answerDraft}
              onChange={(e) => flow.setAnswerDraft(e.target.value)}
              placeholder="Ex.: quatro pessoas atendem por três números diferentes."
              disabled={flow.pending}
              className="
                mt-3 w-full resize-y rounded-[9px] border border-brand-azul bg-white
                px-4 py-4 text-[15px] leading-relaxed text-brand-roxo
                placeholder:text-brand-roxo/45
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa
                min-h-[8rem] disabled:opacity-60
              "
              aria-describedby={`${id}-hint`}
            />
            <p id={`${id}-hint`} className="mt-2 text-[11px] text-brand-azul">
              até {DIAGNOSTIC_ANSWER_MAX_CHARS} caracteres
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <DiagnosticCtaPrimary
                disabled={flow.pending || !flow.answerDraft.trim()}
                onClick={() => void flow.submitAnswer()}
              >
                Continuar →
              </DiagnosticCtaPrimary>
              <DiagnosticCtaSecondary
                tone="dark"
                className="bg-brand-branco"
                disabled={flow.pending}
                onClick={() => void flow.submitAnswer({ skipped: true })}
              >
                Não sei responder agora
              </DiagnosticCtaSecondary>
            </div>
          </div>
        </>
      ) : null}

      <InlineErrorBanner flow={flow} host="context" />
    </ChapterShell>
  );
}

/* ───────────────────────── 04 RESULTADO / 03 DIREÇÃO ───────────────────────── */

function ResultChapter({ flow }: { flow: Flow }) {
  const r = flow.session?.result;
  const emailId = useId();
  const nameId = useId();
  if (!r) return null;

  const wa = whatsappHref(
    whatsappMessage(flow.session?.originalReport ?? "", r.recommendedPath),
  );

  return (
    <ChapterShell tone="roxo" className="md:px-12 lg:px-14">
      {/*
        Superfície editorial larga (documento) ≠ medida de leitura dos parágrafos.
        Desktop: ~1100px de superfície; textos longos ~720px.
        Sem CodeRain / grafismo decorativo — nenhum pictograma oficial cabia semanticamente.
      */}
      <div
        className="
          relative mx-auto w-full
          max-w-[min(100%,1100px)]
          rounded-md border border-brand-branco/10 bg-brand-branco
          px-5 py-8
          sm:px-8 sm:py-9
          md:px-10 md:py-10
          lg:px-12 lg:py-11
        "
      >
        <SessionNoticeBanner flow={flow} />
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="text-[12px] text-brand-rosa">// 03 · DIREÇÃO</p>
          <p className="text-[11px] text-brand-azul">DIAGNÓSTICO ORGANIZADO</p>
        </div>

        <h1 className="mt-5 max-w-[40rem] text-balance text-[clamp(1.85rem,1.15rem+1.9vw,2.85rem)] leading-[1.18] text-brand-roxo">
          Uma direção possível para sair do improviso.
        </h1>

        <div className="mt-9 space-y-7">
          <section>
            <p className="text-[11px] tracking-wide text-brand-azul">01 · CONTEXTO</p>
            <p className="mt-1 text-[11px] tracking-wide text-brand-roxo">O QUE ENTENDEMOS</p>
            <p className="mt-2 max-w-[46rem] text-[15px] leading-relaxed text-brand-roxo/90 sm:text-[16px]">
              {r.understoodContext}
            </p>
          </section>

          <section className="border-t border-brand-roxo/10 pt-7">
            <p className="text-[11px] tracking-wide text-brand-azul">02 · FOCO</p>
            <p className="mt-1 text-[11px] tracking-wide text-brand-roxo">PROBLEMA PRINCIPAL</p>
            <p className="mt-2 max-w-[46rem] text-[15px] leading-relaxed text-brand-roxo/90 sm:text-[16px]">
              {r.primaryProblem}
            </p>
          </section>

          <section className="border-t border-brand-rosa/30 pt-7">
            <p className="text-[11px] tracking-wide text-brand-azul">03 · DIREÇÃO</p>
            <div className="relative mt-3 overflow-hidden rounded-md border border-brand-rosa/35 bg-brand-roxo p-5 sm:p-6 md:p-7">
              <span className="absolute inset-y-0 left-0 w-1 bg-brand-rosa" aria-hidden />
              <p className="pl-3 text-[11px] tracking-wide text-brand-rosa">CAMINHO RECOMENDADO</p>
              <p className="mt-3 max-w-[48rem] pl-3 text-[clamp(1.05rem,0.95rem+0.55vw,1.28rem)] leading-snug text-brand-branco">
                {r.recommendedPath}
              </p>
            </div>
          </section>

          <section className="grid gap-7 border-t border-brand-roxo/10 pt-7 min-[768px]:grid-cols-2 min-[768px]:gap-10">
            <div>
              <p className="text-[11px] tracking-wide text-brand-roxo">POR QUE FAZ SENTIDO</p>
              <p className="mt-2 max-w-[36rem] text-[14px] leading-relaxed text-brand-roxo/85 sm:text-[15px]">
                {r.rationale}
              </p>
            </div>
            <div>
              <p className="text-[11px] tracking-wide text-brand-roxo">PRIMEIRA ENTREGA POSSÍVEL</p>
              <p className="mt-2 max-w-[36rem] text-[14px] leading-relaxed text-brand-roxo/85 sm:text-[15px]">
                {r.firstDelivery}
              </p>
            </div>
          </section>

          <section className="border-t border-brand-roxo/10 pt-7">
            <p className="text-[11px] tracking-wide text-brand-roxo">
              O QUE AINDA PRECISA SER VALIDADO
            </p>
            <p className="mt-2 max-w-[46rem] text-[14px] leading-relaxed text-brand-roxo/85 sm:text-[15px]">
              {r.validationPoints.join(" · ")}
            </p>
          </section>

          {r.nextStep && (
            <section className="border-t border-brand-azul/20 pt-7">
              <p className="text-[11px] tracking-wide text-brand-azul">PRÓXIMO PASSO</p>
              <p className="mt-2 max-w-[46rem] text-[14px] leading-relaxed text-brand-roxo/90 sm:text-[15px]">
                {r.nextStep}
              </p>
            </section>
          )}

          <p className="max-w-[46rem] text-[12px] leading-relaxed text-brand-roxo/70">
            {r.commercialNote || DIAGNOSTIC_COMMERCIAL_NOTE}
          </p>
        </div>

        <div className="mt-9 flex flex-col gap-3 border-t border-brand-roxo/10 pt-8 sm:flex-row sm:flex-wrap">
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-[9px] bg-brand-rosa px-5 py-3.5 text-center text-[13px] text-brand-roxo transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa"
          >
            Conversar sobre este diagnóstico →
          </a>
          <DiagnosticCtaSecondary
            tone="dark"
            className="bg-brand-branco"
            onClick={flow.openEmailCapture}
          >
            Receber resumo por e-mail
          </DiagnosticCtaSecondary>
        </div>

        <InlineExpand open={flow.emailExpanded}>
          <div className="mt-6 rounded-md border border-brand-rosa/50 bg-white p-5 sm:p-6">
            <p className="text-[11px] uppercase tracking-wide text-brand-azul">
              Resumo por e-mail · abre aqui, sem trocar de página
            </p>
            <p className="mt-2 max-w-[46rem] text-[13px] leading-relaxed text-brand-roxo/80">
              O envio automático ainda não está ativo. Você pode registrar o interesse — sem
              confirmação falsa de e-mail enviado.
            </p>

            {flow.leadNote ? (
              <p className="mt-4 text-[14px] leading-relaxed text-brand-roxo" role="status">
                {flow.leadNote}
              </p>
            ) : (
              <form
                className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
                onSubmit={(e) => {
                  e.preventDefault();
                  flow.submitCaptureStub();
                }}
              >
                <div>
                  <label htmlFor={emailId} className="block text-[12px] text-brand-roxo">
                    E-mail
                  </label>
                  <input
                    id={emailId}
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={flow.captureEmail}
                    onChange={(e) => flow.setCaptureEmail(e.target.value)}
                    placeholder="voce@empresa.com"
                    className="mt-2 min-h-11 w-full rounded-[9px] border border-brand-roxo bg-white px-3 text-[14px] text-brand-roxo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa"
                  />
                </div>
                <div>
                  <label htmlFor={nameId} className="block text-[12px] text-brand-roxo">
                    Nome · opcional
                  </label>
                  <input
                    id={nameId}
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={flow.captureName}
                    onChange={(e) => flow.setCaptureName(e.target.value)}
                    placeholder="Como podemos chamar você?"
                    className="mt-2 min-h-11 w-full rounded-[9px] border border-brand-roxo bg-white px-3 text-[14px] text-brand-roxo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <DiagnosticCtaPrimary type="submit" className="w-full sm:w-auto">
                    Registrar interesse
                  </DiagnosticCtaPrimary>
                  <DiagnosticCtaSecondary
                    tone="dark"
                    className="bg-white"
                    type="button"
                    onClick={flow.closeEmailCapture}
                  >
                    Fechar
                  </DiagnosticCtaSecondary>
                </div>
              </form>
            )}
          </div>
        </InlineExpand>
      </div>
    </ChapterShell>
  );
}
