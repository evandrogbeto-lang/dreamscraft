import { describe, expect, it } from "vitest";
import { DIAGNOSTIC_COMMERCIAL_NOTE, DIAGNOSTIC_MAX_QUESTIONS } from "./constants";
import {
  ClarifyingQuestionSchema,
  InterpretationModelSchema,
  InterpretationPublicSchema,
  SynthesisModelSchema,
  toPublicInterpretation,
  toPublicSynthesis,
} from "./schemas";

const baseQuestion = {
  id: "q1",
  prompt: "Onde esse processo acontece hoje?",
  required: true,
};

const validInterpretation = {
  understanding: "Há gargalo no atendimento e nas planilhas paralelas.",
  primaryProblemHypothesis: "Falta um fluxo único de acompanhamento.",
  possibleDirection: "Triagem das mensagens e centralização do acompanhamento.",
  rationale: "O relato aponta retrabalho e informação espalhada.",
  uncertainties: ["Volume aproximado", "Ferramentas que precisam permanecer"],
  clarifyingQuestions: [baseQuestion, { ...baseQuestion, id: "q2" }, { ...baseQuestion, id: "q3" }],
};

describe("diagnostic schemas", () => {
  it("accepts a valid interpretation", () => {
    const parsed = InterpretationPublicSchema.safeParse(validInterpretation);
    expect(parsed.success).toBe(true);
  });

  it("rejects more than 3 clarifying questions", () => {
    const parsed = InterpretationModelSchema.safeParse({
      ...validInterpretation,
      clarifyingQuestions: [
        baseQuestion,
        { ...baseQuestion, id: "q2" },
        { ...baseQuestion, id: "q3" },
        { ...baseQuestion, id: "q4" },
      ],
    });
    expect(parsed.success).toBe(false);
  });

  it("enforces max questions constant", () => {
    expect(DIAGNOSTIC_MAX_QUESTIONS).toBe(3);
    const tooMany = Array.from({ length: 4 }, (_, i) =>
      ClarifyingQuestionSchema.parse({ ...baseQuestion, id: `q${i}` }),
    );
    expect(tooMany.length).toBe(4);
    const model = InterpretationModelSchema.safeParse({
      ...validInterpretation,
      clarifyingQuestions: tooMany,
    });
    expect(model.success).toBe(false);
  });

  it("rejects stack/price/prazo at the root", () => {
    for (const forbidden of ["stack", "investimento", "prazo", "price", "timeline"]) {
      const parsed = InterpretationPublicSchema.safeParse({
        ...validInterpretation,
        [forbidden]: forbidden === "stack" ? [{ tech: "React" }] : 10,
      });
      expect(parsed.success).toBe(false);
    }
  });

  it("strips internal complexity from public interpretation", () => {
    const publicData = toPublicInterpretation(
      InterpretationModelSchema.parse({
        ...validInterpretation,
        internal: { complexityHint: "intermediario" },
      }),
    );
    expect(publicData).not.toHaveProperty("internal");
    expect(JSON.stringify(publicData)).not.toMatch(/enxuto|intermediario|maior/);
  });

  it("forces commercialNote on public synthesis", () => {
    const publicData = toPublicSynthesis(
      SynthesisModelSchema.parse({
        understoodContext: "Operação manual no atendimento.",
        primaryProblem: "Falta de padrão nas respostas.",
        recommendedPath: "Automação de atendimento + painel simples.",
        rationale: "Reduz retrabalho sem exigir stack do cliente.",
        firstDelivery: "Mapear canais e regras de resposta.",
        validationPoints: ["Volume", "Integrações necessárias"],
        nextStep: "Conversar com a Dreamscraft para validar a primeira entrega.",
        commercialNote: "Preço inventado pelo modelo",
        internal: { complexityHint: "enxuto" },
      }),
    );
    expect(publicData.commercialNote).toBe(DIAGNOSTIC_COMMERCIAL_NOTE);
    expect(publicData).not.toHaveProperty("internal");
  });

  it("rejects synthesis with investment field", () => {
    const parsed = SynthesisModelSchema.safeParse({
      understoodContext: "x",
      primaryProblem: "y",
      recommendedPath: "z",
      rationale: "r",
      firstDelivery: "f",
      validationPoints: ["a"],
      nextStep: "n",
      investimento: { min: 1, max: 2 },
    });
    expect(parsed.success).toBe(false);
  });
});
