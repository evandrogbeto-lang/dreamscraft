/** Constantes controladas do Diagnóstico V2 — nunca confiar no modelo para estes textos. */

export const DIAGNOSTIC_SCHEMA_VERSION = 2 as const;

export const DIAGNOSTIC_SESSION_STORAGE_KEY = "dreamscraft.diagnostic.session.v2";

/** TTL da sessão no sessionStorage (30 minutos). */
export const DIAGNOSTIC_SESSION_TTL_MS = 30 * 60 * 1000;

export const DIAGNOSTIC_RATE_LIMIT_BUCKET = "ai_diagnostic_v2";

/** Máximo de chamadas interpret+synthesize por IP por hora. */
export const DIAGNOSTIC_RATE_LIMIT_PER_HOUR = 8;

export const DIAGNOSTIC_OPENROUTER_TIMEOUT_MS = 25_000;

export const DIAGNOSTIC_REPORT_MIN_CHARS = 12;
export const DIAGNOSTIC_REPORT_MAX_CHARS = 2000;
export const DIAGNOSTIC_ANSWER_MAX_CHARS = 800;
export const DIAGNOSTIC_CORRECTION_MAX_CHARS = 2000;
export const DIAGNOSTIC_MAX_QUESTIONS = 3;

/**
 * Copy comercial fixa — definida pelo servidor/constante, nunca pelo modelo.
 */
export const DIAGNOSTIC_COMMERCIAL_NOTE =
  "A faixa de investimento e o cronograma serão definidos após validarmos integrações, volume, regras e prioridade da primeira entrega.";

export const DIAGNOSTIC_UNAVAILABLE_MESSAGE =
  "Não conseguimos organizar seu diagnóstico agora. Seu relato foi preservado.";

export const DIAGNOSTIC_RATE_LIMIT_MESSAGE =
  "Limite de uso atingido. Tente novamente em cerca de 1 hora.";

export const DIAGNOSTIC_TIMEOUT_MESSAGE =
  "A organização do diagnóstico demorou mais do que o esperado. Seu relato foi preservado.";

export const DIAGNOSTIC_INVALID_INPUT_MESSAGE = "Revise o texto enviado e tente novamente.";

/** Perguntas neutras locais quando o cliente corrige/rejeita a interpretação (sem 3ª chamada). */
export const DIAGNOSTIC_NEUTRAL_QUESTIONS = [
  {
    id: "neutral_where",
    prompt: "Onde esse processo acontece hoje?",
    helpText: "Ex.: WhatsApp, e-mail, planilha, presencial, ou uma mistura.",
    required: true,
  },
  {
    id: "neutral_who",
    prompt: "Quem participa dele no dia a dia?",
    helpText: "Pessoas, papéis ou equipes envolvidas — mesmo que seja só você.",
    required: true,
  },
  {
    id: "neutral_pain",
    prompt: "O que mais causa perda, atraso ou retrabalho?",
    helpText: "Pode ser volume, falta de padrão, informação espalhada ou espera por alguém.",
    required: true,
  },
] as const;

export const DIAGNOSTIC_OPENROUTER_DEFAULT_MODEL = "google/gemini-2.5-flash";

export const DIAGNOSTIC_PUBLIC_PHASES = [
  "idle",
  "collecting_input",
  "interpreting",
  "confirm_understanding",
  "clarifying",
  "synthesizing",
  "result",
  "capture_lead",
  "done",
  "error",
  "unavailable",
] as const;

export type DiagnosticPublicPhase = (typeof DIAGNOSTIC_PUBLIC_PHASES)[number];
