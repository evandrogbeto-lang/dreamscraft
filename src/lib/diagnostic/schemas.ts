import { z } from "zod";
import {
  DIAGNOSTIC_ANSWER_MAX_CHARS,
  DIAGNOSTIC_COMMERCIAL_NOTE,
  DIAGNOSTIC_CORRECTION_MAX_CHARS,
  DIAGNOSTIC_MAX_QUESTIONS,
  DIAGNOSTIC_PUBLIC_PHASES,
  DIAGNOSTIC_REPORT_MAX_CHARS,
  DIAGNOSTIC_REPORT_MIN_CHARS,
  DIAGNOSTIC_SCHEMA_VERSION,
} from "./constants";

/** Categorias opcionais vindas da Home. */
export const DiagnosticCategorySchema = z.enum(["atendimento", "planilhas", "orcamentos", "outro"]);

export type DiagnosticCategory = z.infer<typeof DiagnosticCategorySchema>;

export const CategoryFitSchema = z.enum(["aligned", "mismatch", "unknown"]);

/** Metadado interno — nunca exibir na UI, e-mail do visitante ou WhatsApp. */
export const ComplexityHintSchema = z.enum(["enxuto", "intermediario", "maior"]);

export const ClarifyingQuestionSchema = z.object({
  id: z.string().trim().min(1).max(64),
  prompt: z.string().trim().min(1).max(280),
  helpText: z.string().trim().max(280).optional(),
  required: z.boolean(),
});

export type ClarifyingQuestion = z.infer<typeof ClarifyingQuestionSchema>;

const ForbiddenCommercialKeys = [
  "investimento",
  "investment",
  "preco",
  "price",
  "prazo",
  "timeline",
  "deadline",
  "stack",
  "framework",
  "frameworks",
  "urgenciaMultiplier",
  "urgencyMultiplier",
] as const;

/**
 * Rejeita payloads que tentem reintroduzir preço/prazo/stack no nível raiz.
 * Campos internos permitidos ficam só em `internal`.
 */
function rejectForbiddenRootKeys(value: unknown, ctx: z.RefinementCtx) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  const obj = value as Record<string, unknown>;
  for (const key of ForbiddenCommercialKeys) {
    if (key in obj) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Campo proibido no diagnóstico público: ${key}`,
        path: [key],
      });
    }
  }
}

/** Resposta bruta do modelo na interpretação (pode incluir internal). */
export const InterpretationModelSchema = z
  .object({
    understanding: z.string().trim().min(1).max(1200),
    primaryProblemHypothesis: z.string().trim().min(1).max(800),
    possibleDirection: z.string().trim().min(1).max(800),
    rationale: z.string().trim().min(1).max(1200),
    uncertainties: z.array(z.string().trim().min(1).max(400)).max(8),
    clarifyingQuestions: z.array(ClarifyingQuestionSchema).min(1).max(DIAGNOSTIC_MAX_QUESTIONS),
    categoryFit: CategoryFitSchema.optional(),
    internal: z
      .object({
        complexityHint: ComplexityHintSchema.optional(),
      })
      .strict()
      .optional(),
  })
  .strict()
  .superRefine(rejectForbiddenRootKeys);

/** Forma pública da interpretação — sem complexityHint. */
export const InterpretationPublicSchema = z
  .object({
    understanding: z.string().trim().min(1).max(1200),
    primaryProblemHypothesis: z.string().trim().min(1).max(800),
    possibleDirection: z.string().trim().min(1).max(800),
    rationale: z.string().trim().min(1).max(1200),
    uncertainties: z.array(z.string().trim().min(1).max(400)).max(8),
    clarifyingQuestions: z.array(ClarifyingQuestionSchema).min(1).max(DIAGNOSTIC_MAX_QUESTIONS),
    categoryFit: CategoryFitSchema.optional(),
  })
  .strict()
  .superRefine(rejectForbiddenRootKeys);

export type InterpretationPublic = z.infer<typeof InterpretationPublicSchema>;

export const SynthesisModelSchema = z
  .object({
    understoodContext: z.string().trim().min(1).max(1600),
    primaryProblem: z.string().trim().min(1).max(800),
    recommendedPath: z.string().trim().min(1).max(800),
    rationale: z.string().trim().min(1).max(1200),
    firstDelivery: z.string().trim().min(1).max(800),
    validationPoints: z.array(z.string().trim().min(1).max(400)).min(1).max(8),
    nextStep: z.string().trim().min(1).max(600),
    commercialNote: z.string().trim().max(500).optional(),
    internal: z
      .object({
        complexityHint: ComplexityHintSchema.optional(),
      })
      .strict()
      .optional(),
  })
  .strict()
  .superRefine(rejectForbiddenRootKeys);

export const SynthesisPublicSchema = z
  .object({
    understoodContext: z.string().trim().min(1).max(1600),
    primaryProblem: z.string().trim().min(1).max(800),
    recommendedPath: z.string().trim().min(1).max(800),
    rationale: z.string().trim().min(1).max(1200),
    firstDelivery: z.string().trim().min(1).max(800),
    validationPoints: z.array(z.string().trim().min(1).max(400)).min(1).max(8),
    nextStep: z.string().trim().min(1).max(600),
    commercialNote: z.literal(DIAGNOSTIC_COMMERCIAL_NOTE),
  })
  .strict()
  .superRefine(rejectForbiddenRootKeys);

export type SynthesisPublic = z.infer<typeof SynthesisPublicSchema>;

export const DiagnosticAnswerSchema = z.object({
  questionId: z.string().trim().min(1).max(64),
  answer: z.string().trim().max(DIAGNOSTIC_ANSWER_MAX_CHARS),
  skipped: z.boolean().optional(),
});

export type DiagnosticAnswer = z.infer<typeof DiagnosticAnswerSchema>;

export const InterpretInputSchema = z.object({
  requestId: z.string().uuid(),
  originalReport: z
    .string()
    .trim()
    .min(DIAGNOSTIC_REPORT_MIN_CHARS)
    .max(DIAGNOSTIC_REPORT_MAX_CHARS),
  category: DiagnosticCategorySchema.optional(),
  /** Correção do entendimento — se presente, perguntas do modelo são descartadas. */
  userCorrection: z.string().trim().min(1).max(DIAGNOSTIC_CORRECTION_MAX_CHARS).optional(),
  /** Se true, não chama o modelo de novo: aplica perguntas neutras locais. */
  useNeutralQuestionsOnly: z.boolean().optional(),
});

export type InterpretInput = z.infer<typeof InterpretInputSchema>;

export const SynthesizeInputSchema = z.object({
  requestId: z.string().uuid(),
  originalReport: z
    .string()
    .trim()
    .min(DIAGNOSTIC_REPORT_MIN_CHARS)
    .max(DIAGNOSTIC_REPORT_MAX_CHARS),
  category: DiagnosticCategorySchema.optional(),
  userCorrection: z.string().trim().min(1).max(DIAGNOSTIC_CORRECTION_MAX_CHARS).optional(),
  interpretation: InterpretationPublicSchema,
  answers: z.array(DiagnosticAnswerSchema).max(DIAGNOSTIC_MAX_QUESTIONS),
});

export type SynthesizeInput = z.infer<typeof SynthesizeInputSchema>;

export const DiagnosticErrorCodeSchema = z.enum([
  "invalid_input",
  "rate_limited",
  "timeout",
  "unavailable",
  "invalid_model_output",
]);

export type DiagnosticErrorCode = z.infer<typeof DiagnosticErrorCodeSchema>;

export const InterpretSuccessSchema = z.object({
  ok: z.literal(true),
  data: InterpretationPublicSchema,
  /** Perguntas efetivas (modelo ou neutras após correção). */
  questionsSource: z.enum(["model", "neutral_local"]),
});

export const SynthesizeSuccessSchema = z.object({
  ok: z.literal(true),
  data: SynthesisPublicSchema,
});

export const DiagnosticFailureSchema = z.object({
  ok: z.literal(false),
  code: DiagnosticErrorCodeSchema,
  message: z.string(),
});

export type InterpretResult =
  | z.infer<typeof InterpretSuccessSchema>
  | z.infer<typeof DiagnosticFailureSchema>;

export type SynthesizeResult =
  | z.infer<typeof SynthesizeSuccessSchema>
  | z.infer<typeof DiagnosticFailureSchema>;

export const DiagnosticSessionPhaseSchema = z.enum(DIAGNOSTIC_PUBLIC_PHASES);

export const DiagnosticSessionV2Schema = z.object({
  schemaVersion: z.literal(DIAGNOSTIC_SCHEMA_VERSION),
  sessionId: z.string().uuid(),
  phase: DiagnosticSessionPhaseSchema,
  source: z.enum(["home", "direct", "legacy_url"]),
  category: DiagnosticCategorySchema.optional(),
  originalReport: z.string().trim().min(1).max(DIAGNOSTIC_REPORT_MAX_CHARS),
  userCorrection: z.string().trim().max(DIAGNOSTIC_CORRECTION_MAX_CHARS).optional(),
  interpretation: InterpretationPublicSchema.optional(),
  answers: z.array(DiagnosticAnswerSchema).default([]),
  result: SynthesisPublicSchema.optional(),
  questionsSource: z.enum(["model", "neutral_local"]).optional(),
  savedAt: z.number().int().positive(),
  expiresAt: z.number().int().positive(),
});

export type DiagnosticSessionV2 = z.infer<typeof DiagnosticSessionV2Schema>;

/** Planejamento futuro de leads.estimate_json — não grava ainda. */
export const LeadEstimateJsonV2Schema = z.object({
  schemaVersion: z.literal(2),
  source: z.literal("diagnostic_v2"),
  interpretation: InterpretationPublicSchema.optional(),
  answers: z.array(DiagnosticAnswerSchema).optional(),
  result: SynthesisPublicSchema.optional(),
});

export function toPublicInterpretation(
  raw: z.infer<typeof InterpretationModelSchema>,
): InterpretationPublic {
  const { internal: _internal, ...publicFields } = raw;
  return InterpretationPublicSchema.parse(publicFields);
}

export function toPublicSynthesis(raw: z.infer<typeof SynthesisModelSchema>): SynthesisPublic {
  const { internal: _internal, commercialNote: _ignored, ...rest } = raw;
  return SynthesisPublicSchema.parse({
    ...rest,
    commercialNote: DIAGNOSTIC_COMMERCIAL_NOTE,
  });
}

export function clampQuestions(questions: ClarifyingQuestion[]): ClarifyingQuestion[] {
  return questions.slice(0, DIAGNOSTIC_MAX_QUESTIONS);
}
