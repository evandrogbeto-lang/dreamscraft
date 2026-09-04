import {
  DIAGNOSTIC_ANSWER_MAX_CHARS,
  DIAGNOSTIC_CORRECTION_MAX_CHARS,
  DIAGNOSTIC_INVALID_INPUT_MESSAGE,
  DIAGNOSTIC_NEUTRAL_QUESTIONS,
  DIAGNOSTIC_RATE_LIMIT_MESSAGE,
  DIAGNOSTIC_REPORT_MAX_CHARS,
  DIAGNOSTIC_TIMEOUT_MESSAGE,
  DIAGNOSTIC_UNAVAILABLE_MESSAGE,
} from "./constants";
import {
  buildInterpretUserPrompt,
  buildSynthesizeUserPrompt,
  INTERPRET_SYSTEM_PROMPT,
  SYNTHESIZE_SYSTEM_PROMPT,
} from "./prompts";
import { fetchOpenRouterJson, type OpenRouterDeps } from "./openrouter";
import {
  ClarifyingQuestionSchema,
  InterpretationModelSchema,
  InterpretInputSchema,
  SynthesisModelSchema,
  SynthesizeInputSchema,
  toPublicInterpretation,
  toPublicSynthesis,
  type InterpretInput,
  type InterpretResult,
  type SynthesizeInput,
  type SynthesizeResult,
} from "./schemas";
import {
  looksLikePromptInjection,
  sanitizeAnswer,
  sanitizeCorrection,
  sanitizeReport,
  safeLogMeta,
} from "./sanitize";

export type RateLimitPort = {
  check(ip: string): Promise<"ok" | "limited">;
  record(ip: string): Promise<void>;
};

export type IdempotencyPort = {
  /**
   * Executa `run` no máximo uma vez por requestId.
   * Chamadas concorrentes/repetidas reutilizam a mesma Promise.
   */
  run<T>(requestId: string, run: () => Promise<T>): Promise<T>;
};

export type DiagnosticCoreDeps = {
  openRouter: OpenRouterDeps;
  rateLimit: RateLimitPort;
  idempotency: IdempotencyPort;
  getClientIp: () => string;
  signal?: AbortSignal;
  log?: (msg: string, meta?: Record<string, unknown>) => void;
};

function failure(
  code: Extract<InterpretResult, { ok: false }>["code"],
  message: string,
): Extract<InterpretResult, { ok: false }> {
  return { ok: false, code, message };
}

function mapOpenRouterError(
  code: "timeout" | "rate_limited" | "unavailable" | "invalid_json",
): Extract<InterpretResult, { ok: false }> {
  if (code === "timeout") return failure("timeout", DIAGNOSTIC_TIMEOUT_MESSAGE);
  if (code === "rate_limited") return failure("rate_limited", DIAGNOSTIC_RATE_LIMIT_MESSAGE);
  if (code === "invalid_json") {
    return failure("unavailable", DIAGNOSTIC_UNAVAILABLE_MESSAGE);
  }
  return failure("unavailable", DIAGNOSTIC_UNAVAILABLE_MESSAGE);
}

function normalizeInterpretInput(raw: unknown): InterpretInput | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const reportRaw = typeof obj.originalReport === "string" ? obj.originalReport.trim() : "";
  if (reportRaw.length > DIAGNOSTIC_REPORT_MAX_CHARS) return null;
  const correctionRaw =
    typeof obj.userCorrection === "string" ? obj.userCorrection.trim() : undefined;
  if (correctionRaw && correctionRaw.length > DIAGNOSTIC_CORRECTION_MAX_CHARS) return null;

  const normalized = {
    ...obj,
    originalReport: sanitizeReport(reportRaw),
    ...(correctionRaw !== undefined ? { userCorrection: sanitizeCorrection(correctionRaw) } : {}),
  };
  const parsed = InterpretInputSchema.safeParse(normalized);
  return parsed.success ? parsed.data : null;
}

function normalizeSynthesizeInput(raw: unknown): SynthesizeInput | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const reportRaw = typeof obj.originalReport === "string" ? obj.originalReport.trim() : "";
  if (reportRaw.length > DIAGNOSTIC_REPORT_MAX_CHARS) return null;

  const answers = Array.isArray(obj.answers)
    ? obj.answers.map((a) => {
        if (!a || typeof a !== "object") return a;
        const row = a as Record<string, unknown>;
        const answerRaw = typeof row.answer === "string" ? row.answer : "";
        if (answerRaw.trim().length > DIAGNOSTIC_ANSWER_MAX_CHARS) {
          return { ...row, answer: answerRaw.trim() };
        }
        return {
          ...row,
          answer: sanitizeAnswer(row.answer),
        };
      })
    : obj.answers;

  if (
    Array.isArray(answers) &&
    answers.some((a) => {
      if (!a || typeof a !== "object") return false;
      const ans = (a as { answer?: unknown }).answer;
      return typeof ans === "string" && ans.length > DIAGNOSTIC_ANSWER_MAX_CHARS;
    })
  ) {
    return null;
  }

  const correctionRaw =
    typeof obj.userCorrection === "string" ? obj.userCorrection.trim() : undefined;
  if (correctionRaw && correctionRaw.length > DIAGNOSTIC_CORRECTION_MAX_CHARS) return null;

  const normalized = {
    ...obj,
    originalReport: sanitizeReport(reportRaw),
    ...(correctionRaw !== undefined ? { userCorrection: sanitizeCorrection(correctionRaw) } : {}),
    answers,
  };
  const parsed = SynthesizeInputSchema.safeParse(normalized);
  return parsed.success ? parsed.data : null;
}

function neutralQuestions() {
  return DIAGNOSTIC_NEUTRAL_QUESTIONS.map((q) => ClarifyingQuestionSchema.parse(q));
}

/**
 * Interpretação sem terceira chamada:
 * - useNeutralQuestionsOnly / userCorrection forte → perguntas neutras locais
 * - caso contrário → 1 chamada de modelo (+ retry JSON)
 */
export async function runInterpretDiagnostic(
  rawInput: unknown,
  deps: DiagnosticCoreDeps,
): Promise<InterpretResult> {
  const log = deps.log ?? ((msg, meta) => console.error(msg, safeLogMeta(meta ?? {})));
  const input = normalizeInterpretInput(rawInput);
  if (!input) return failure("invalid_input", DIAGNOSTIC_INVALID_INPUT_MESSAGE);

  // Sinaliza injeção mas continua — o prompt já isola USER_DATA.
  if (looksLikePromptInjection(input.originalReport)) {
    log("diagnostic: injection heuristic", { requestId: input.requestId });
  }

  return deps.idempotency.run(input.requestId, async () => {
    // Correção/rejeição: perguntas neutras locais, sem 3ª chamada ao modelo
    // e sem consumir ai_diagnostic_v2 (não há OpenRouter neste caminho).
    if (input.useNeutralQuestionsOnly) {
      const understanding = input.userCorrection?.trim()
        ? `Você ajustou o entendimento. Consideramos principalmente: ${input.userCorrection.trim()}`
        : `Partimos do seu relato para continuar o diagnóstico, sem fixar uma leitura automática.`;
      return {
        ok: true,
        questionsSource: "neutral_local",
        data: {
          understanding,
          primaryProblemHypothesis:
            "Ainda precisamos confirmar o problema principal com as próximas respostas.",
          possibleDirection: "A direção será definida após esclarecermos o fluxo real com você.",
          rationale:
            "Como o entendimento anterior não representava bem o problema, seguimos com perguntas neutras — sem forçar uma leitura automática.",
          uncertainties: [
            "Onde o processo acontece hoje",
            "Quem participa",
            "O que mais gera atraso ou retrabalho",
          ],
          clarifyingQuestions: neutralQuestions(),
          ...(input.category ? { categoryFit: "unknown" as const } : {}),
        },
      };
    }

    const ip = deps.getClientIp();
    if ((await deps.rateLimit.check(ip)) === "limited") {
      return failure("rate_limited", DIAGNOSTIC_RATE_LIMIT_MESSAGE);
    }

    await deps.rateLimit.record(ip);

    const result = await fetchOpenRouterJson({
      system: INTERPRET_SYSTEM_PROMPT,
      user: buildInterpretUserPrompt(input),
      deps: deps.openRouter,
      signal: deps.signal,
      parse: (raw) => {
        try {
          const json = JSON.parse(raw) as unknown;
          const model = InterpretationModelSchema.safeParse(json);
          if (!model.success) return { success: false };
          return { success: true, data: model.data };
        } catch {
          return { success: false };
        }
      },
    });

    if (!result.ok) return mapOpenRouterError(result.code);

    try {
      const publicData = toPublicInterpretation(
        result.data as Parameters<typeof toPublicInterpretation>[0],
      );
      // Se o cliente já mandou correção nesta chamada "normal", ainda usamos o modelo
      // uma vez (é a interpretação a partir da correção) — não é 3ª chamada.
      return { ok: true, data: publicData, questionsSource: "model" };
    } catch {
      return failure("unavailable", DIAGNOSTIC_UNAVAILABLE_MESSAGE);
    }
  });
}

export async function runSynthesizeDiagnostic(
  rawInput: unknown,
  deps: DiagnosticCoreDeps,
): Promise<SynthesizeResult> {
  const log = deps.log ?? ((msg, meta) => console.error(msg, safeLogMeta(meta ?? {})));
  const input = normalizeSynthesizeInput(rawInput);
  if (!input) {
    return {
      ok: false,
      code: "invalid_input",
      message: DIAGNOSTIC_INVALID_INPUT_MESSAGE,
    };
  }

  if (looksLikePromptInjection(input.originalReport)) {
    log("diagnostic: injection heuristic", { requestId: input.requestId });
  }

  return deps.idempotency.run(input.requestId, async () => {
    const ip = deps.getClientIp();
    if ((await deps.rateLimit.check(ip)) === "limited") {
      return {
        ok: false,
        code: "rate_limited",
        message: DIAGNOSTIC_RATE_LIMIT_MESSAGE,
      };
    }
    await deps.rateLimit.record(ip);

    const result = await fetchOpenRouterJson({
      system: SYNTHESIZE_SYSTEM_PROMPT,
      user: buildSynthesizeUserPrompt({
        originalReport: input.originalReport,
        category: input.category,
        userCorrection: input.userCorrection,
        interpretationJson: JSON.stringify(input.interpretation),
        answersJson: JSON.stringify(input.answers),
      }),
      deps: deps.openRouter,
      signal: deps.signal,
      parse: (raw) => {
        try {
          const json = JSON.parse(raw) as unknown;
          const model = SynthesisModelSchema.safeParse(json);
          if (!model.success) return { success: false };
          return { success: true, data: model.data };
        } catch {
          return { success: false };
        }
      },
    });

    if (!result.ok) {
      const mapped = mapOpenRouterError(result.code);
      return mapped;
    }

    try {
      const publicData = toPublicSynthesis(result.data as Parameters<typeof toPublicSynthesis>[0]);
      return { ok: true, data: publicData };
    } catch {
      return {
        ok: false,
        code: "unavailable",
        message: DIAGNOSTIC_UNAVAILABLE_MESSAGE,
      };
    }
  });
}

/**
 * Idempotência best-effort em memória do isolate (Cloudflare Worker / Node).
 *
 * Limitações (não é idempotência distribuída):
 * - só deduplica o mesmo `requestId` dentro do MESMO isolate;
 * - o mapa é perdido quando o isolate reinicia/esfria;
 * - isolates distintos podem processar o mesmo `requestId` em paralelo.
 * Não usa KV, Durable Object nem banco para persistir esse estado.
 */
export function createMemoryIdempotency(ttlMs = 10 * 60 * 1000): IdempotencyPort {
  const map = new Map<string, { expires: number; promise: Promise<unknown> }>();
  return {
    async run<T>(requestId: string, run: () => Promise<T>): Promise<T> {
      const now = Date.now();
      const hit = map.get(requestId);
      if (hit && hit.expires > now) {
        return hit.promise as Promise<T>;
      }
      const promise: Promise<T> = (async () => run())();
      map.set(requestId, { expires: now + ttlMs, promise: promise as Promise<unknown> });
      for (const [k, v] of map) {
        if (v.expires <= now) map.delete(k);
      }
      return promise;
    },
  };
}
