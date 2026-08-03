import { useCallback, useId, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  type DiagnosticCategory,
  DIAGNOSTIC_CATEGORY_LABELS,
  diagnosticToSearchParams,
  saveDiagnosticContext,
} from "@/lib/diagnostic-context";

type TesterState = "idle" | "ready" | "result" | "error";

const CATEGORIES: DiagnosticCategory[] = ["atendimento", "planilhas", "orcamentos", "outro"];

const MIN_DESCRIPTION = 12;

/** Orientação por categoria — pista inicial, não diagnóstico completo. */
const CATEGORY_COPY: Record<
  DiagnosticCategory,
  { placeholder: string; initialReading: string; investigate: string }
> = {
  atendimento: {
    placeholder:
      "Ex.: as mensagens chegam por WhatsApp e Instagram, e cada pessoa responde de um jeito.",
    initialReading: "Canais, responsáveis, regras de resposta, horários e contexto.",
    investigate: "Mapear de onde as mensagens chegam e como cada atendimento é conduzido.",
  },
  planilhas: {
    placeholder:
      "Ex.: o controle depende de várias planilhas e ninguém sabe qual versão está correta.",
    initialReading: "Dados registrados, responsáveis, duplicidades, versões e dependências.",
    investigate: "Identificar o fluxo real da informação antes de centralizar ou automatizar.",
  },
  orcamentos: {
    placeholder:
      "Ex.: cada orçamento é montado manualmente e demora para ser enviado ou acompanhado.",
    initialReading: "Informações necessárias, regras de preço, aprovações e acompanhamento.",
    investigate: "Organizar as etapas entre solicitação, cálculo, envio e retorno do cliente.",
  },
  outro: {
    placeholder: "Ex.: descreva onde o processo para, se repete ou depende de alguém lembrar.",
    initialReading: "Pessoas envolvidas, ferramentas, dependências, exceções e pontos de espera.",
    investigate: "Representar o fluxo atual antes de decidir qual solução faz sentido.",
  },
};

const NEUTRAL_COPY = {
  placeholder: "Ex.: descreva onde o processo para, se repete ou depende de alguém lembrar.",
  initialReading: "Pessoas envolvidas, ferramentas, dependências, exceções e pontos de espera.",
  investigate: "Representar o fluxo atual antes de decidir qual solução faz sentido.",
};

type ResultSnapshot = {
  category: DiagnosticCategory | null;
  description: string;
};

type DiagnosticTesterProps = {
  className?: string;
};

export function DiagnosticTester({ className = "" }: DiagnosticTesterProps) {
  const navigate = useNavigate();
  const titleId = useId();
  const fieldId = useId();
  const statusId = useId();
  const errorId = useId();

  const [category, setCategory] = useState<DiagnosticCategory | null>(null);
  const [description, setDescription] = useState("");
  const [state, setState] = useState<TesterState>("idle");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [resultSnapshot, setResultSnapshot] = useState<ResultSnapshot | null>(null);

  const trimmed = description.trim();
  const canRun = trimmed.length >= MIN_DESCRIPTION;
  const placeholder = category ? CATEGORY_COPY[category].placeholder : NEUTRAL_COPY.placeholder;

  const clearResultIfStale = useCallback(() => {
    setResultSnapshot(null);
    setFieldError(null);
  }, []);

  const onSelect = useCallback(
    (id: DiagnosticCategory) => {
      setCategory(id);
      clearResultIfStale();
      setState(trimmed.length >= MIN_DESCRIPTION ? "ready" : "idle");
    },
    [clearResultIfStale, trimmed.length],
  );

  const onDescriptionChange = useCallback(
    (value: string) => {
      setDescription(value);
      clearResultIfStale();
      setState(value.trim().length >= MIN_DESCRIPTION ? "ready" : "idle");
    },
    [clearResultIfStale],
  );

  const run = useCallback(() => {
    if (trimmed.length < MIN_DESCRIPTION) {
      setFieldError("Descreva o que acontece hoje com pelo menos algumas palavras.");
      setState("error");
      return;
    }
    try {
      saveDiagnosticContext({
        ...(category ? { category } : {}),
        description: trimmed,
      });
      setResultSnapshot({ category, description: trimmed });
      setFieldError(null);
      setState("result");
    } catch {
      setFieldError("Não foi possível organizar o contexto agora.");
      setState("error");
    }
  }, [category, trimmed]);

  const goToEstimar = useCallback(() => {
    const snap = resultSnapshot;
    if (!snap || snap.description.trim().length < MIN_DESCRIPTION) return;
    const ctx = saveDiagnosticContext({
      ...(snap.category ? { category: snap.category } : {}),
      description: snap.description.trim(),
    });
    const search = diagnosticToSearchParams(ctx);
    void navigate({ to: "/estimar", search });
  }, [resultSnapshot, navigate]);

  const statusMessage =
    state === "idle"
      ? "Descreva o que acontece hoje para liberar organizar contexto. A categoria é opcional."
      : state === "ready"
        ? category
          ? `Categoria: ${DIAGNOSTIC_CATEGORY_LABELS[category]}. Descrição pronta para organizar o contexto.`
          : "Descrição pronta para organizar o contexto. Categoria opcional."
        : state === "result"
          ? "Contexto organizado a partir do que você relatou. O diagnóstico completo acontece em seguida."
          : (fieldError ?? "Revise os campos e tente novamente.");

  const resultCopy = resultSnapshot
    ? resultSnapshot.category
      ? CATEGORY_COPY[resultSnapshot.category]
      : NEUTRAL_COPY
    : null;

  return (
    <div
      className={`w-full min-w-0 overflow-hidden rounded-panel bg-brand-branco text-brand-roxo ${className}`}
      role="region"
      aria-labelledby={titleId}
    >
      <div className="bg-brand-roxo px-4 py-3 sm:px-5">
        <p id={titleId} className="text-[12px] tracking-wide text-brand-branco">
          {"// PREPARAR DIAGNÓSTICO"}
        </p>
      </div>

      <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
        <p className="text-[15px] leading-snug text-brand-roxo sm:text-base">
          O que está travando sua operação hoje?
        </p>

        <div
          className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4"
          role="radiogroup"
          aria-label="Categoria do problema (opcional)"
        >
          {CATEGORIES.map((id) => {
            const active = category === id;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onSelect(id)}
                className={`inline-flex min-h-11 items-center justify-center rounded-control px-2 text-center text-[11px] leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa focus-visible:ring-offset-2 focus-visible:ring-offset-brand-branco ${
                  active
                    ? "bg-brand-rosa text-brand-roxo"
                    : "border border-brand-azul bg-brand-branco text-brand-roxo hover:bg-brand-branco/80"
                }`}
              >
                {DIAGNOSTIC_CATEGORY_LABELS[id]}
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          <label htmlFor={fieldId} className="block text-[12px] text-brand-roxo">
            Conte o que acontece hoje.
            <span className="text-brand-rosa"> *</span>
          </label>
          <textarea
            id={fieldId}
            name="descricao"
            required
            rows={3}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder={placeholder}
            aria-invalid={Boolean(fieldError)}
            aria-describedby={fieldError ? errorId : statusId}
            className="min-h-[88px] w-full resize-y rounded-control border border-brand-roxo/20 bg-brand-branco px-3 py-2.5 text-[13px] leading-relaxed text-brand-roxo placeholder:text-brand-roxo/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa"
          />
        </div>

        <button
          type="button"
          onClick={run}
          disabled={!canRun}
          aria-disabled={!canRun}
          aria-describedby={statusId}
          className={`inline-flex min-h-11 w-full items-center justify-center rounded-button px-3 text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-azul focus-visible:ring-offset-2 focus-visible:ring-offset-brand-branco disabled:cursor-not-allowed disabled:bg-brand-roxo/45 disabled:text-brand-branco/55 disabled:opacity-100 ${
            canRun
              ? "bg-brand-rosa text-brand-roxo hover:brightness-110"
              : "bg-brand-roxo/45 text-brand-branco/55"
          }`}
        >
          Organizar contexto
        </button>

        <p className="text-[10px] leading-relaxed text-brand-roxo/65">
          A Home prepara o contexto. O diagnóstico completo acontece em seguida.
        </p>

        <p id={statusId} className="sr-only" aria-live="polite" aria-atomic="true">
          {statusMessage}
        </p>

        {fieldError && (
          <p id={errorId} className="text-[12px] text-brand-rosa" role="alert">
            {fieldError}
          </p>
        )}

        {state === "result" && resultSnapshot && resultCopy && (
          <div
            className="space-y-4 border-t border-brand-roxo/15 pt-4"
            role="status"
            aria-live="polite"
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-brand-azul">Seu relato</p>
              <p className="mt-2 text-[13px] leading-relaxed text-brand-roxo">
                {resultSnapshot.description}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-brand-azul">
                Leitura inicial
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-brand-roxo/80">
                {resultCopy.initialReading}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-brand-azul">
                O que vamos investigar
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-brand-roxo/80">
                {resultCopy.investigate}
              </p>
            </div>
            <p className="text-[11px] leading-relaxed text-brand-roxo/70">
              {resultSnapshot.category
                ? "A categoria ajuda a iniciar a conversa. A recomendação será definida a partir do seu relato."
                : "A recomendação será definida a partir do seu relato."}
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={goToEstimar}
                className="inline-flex min-h-11 items-center justify-center rounded-button bg-brand-rosa px-4 text-[12px] text-brand-roxo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-azul"
              >
                Continuar com o diagnóstico
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
