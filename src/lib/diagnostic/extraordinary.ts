import {
  DIAGNOSTIC_RATE_LIMIT_MESSAGE,
  DIAGNOSTIC_TIMEOUT_MESSAGE,
  DIAGNOSTIC_UNAVAILABLE_MESSAGE,
} from "./constants";

export type DiagnosticErrorKind =
  | "timeout"
  | "rate_limited"
  | "unavailable"
  | "invalid_input"
  | "generic";

export type ErrorHost = "entry" | "context";

export type SessionNotice = "restored" | "expired";

/** Onde o erro aparece: interpretação → Entrada; síntese → Contexto. */
export function errorHostForOperation(op: "interpret" | "synthesize"): ErrorHost {
  return op === "interpret" ? "entry" : "context";
}

export function mapErrorCode(code: string | undefined): DiagnosticErrorKind {
  if (code === "timeout") return "timeout";
  if (code === "rate_limited") return "rate_limited";
  if (code === "unavailable") return "unavailable";
  if (code === "invalid_input") return "invalid_input";
  return "generic";
}

/**
 * Copy calma e oficial para banners inline.
 * Rate limit: sem incentivar retry repetitivo.
 */
export function messageForErrorKind(
  kind: DiagnosticErrorKind,
  serverMessage?: string,
): string {
  if (kind === "rate_limited") {
    return "Você atingiu o limite temporário de diagnósticos. Seu contexto continua salvo.";
  }
  if (kind === "timeout") {
    return serverMessage?.trim() || DIAGNOSTIC_TIMEOUT_MESSAGE;
  }
  if (kind === "unavailable" || kind === "generic") {
    return serverMessage?.trim() || DIAGNOSTIC_UNAVAILABLE_MESSAGE;
  }
  return serverMessage?.trim() || DIAGNOSTIC_UNAVAILABLE_MESSAGE;
}

/** Índice de pergunta ao restaurar sessão (ex.: 2/3 → index 1). */
export function resumeQuestionIndex(answersLength: number, questionsLength: number): number {
  if (questionsLength <= 0) return 0;
  return Math.min(Math.max(0, answersLength), questionsLength - 1);
}

/** Jornada normal: no máximo 1 interpret + 1 synthesize. */
export function assertModelBudget(calls: { interpret: number; synthesize: number }): boolean {
  return calls.interpret <= 1 && calls.synthesize <= 1;
}

/** Rate limit não deve expor retry como CTA principal. */
export function primaryActionForError(kind: DiagnosticErrorKind): "whatsapp" | "retry" {
  return kind === "rate_limited" ? "whatsapp" : "retry";
}

export function rateLimitUsesOfficialConstant(): boolean {
  return DIAGNOSTIC_RATE_LIMIT_MESSAGE.length > 0;
}

export const SESSION_RESTORED_MESSAGE = "Continuamos de onde você parou.";

export const SESSION_EXPIRED_MESSAGE =
  "Sua sessão anterior expirou. Conte novamente o cenário para começar um novo diagnóstico.";
