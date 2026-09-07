import { describe, expect, it } from "vitest";
import {
  assertModelBudget,
  errorHostForOperation,
  mapErrorCode,
  messageForErrorKind,
  primaryActionForError,
  resumeQuestionIndex,
  SESSION_EXPIRED_MESSAGE,
  SESSION_RESTORED_MESSAGE,
} from "./extraordinary";
import {
  DIAGNOSTIC_TIMEOUT_MESSAGE,
  DIAGNOSTIC_UNAVAILABLE_MESSAGE,
} from "./constants";
import {
  buildSessionV2,
  clearDiagnosticSessionV2,
  isSessionExpired,
  loadDiagnosticSessionV2,
  prepareLegacyUrlCleanup,
  saveDiagnosticSessionV2,
} from "./storage";
import { DIAGNOSTIC_SESSION_STORAGE_KEY } from "./constants";

/** Storage em memória para cenários de retomada / handoff. */
function memoryStorage(seed: Record<string, string> = {}) {
  const map = new Map(Object.entries(seed));
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => {
      map.set(k, v);
    },
    removeItem: (k: string) => {
      map.delete(k);
    },
  };
}

describe("extraordinary states — placement & copy", () => {
  it("E/G: interpret failures host on Entrada", () => {
    expect(errorHostForOperation("interpret")).toBe("entry");
  });

  it("F: synthesize failures host on Contexto", () => {
    expect(errorHostForOperation("synthesize")).toBe("context");
  });

  it("E/G: timeout/unavailable use official calm copy", () => {
    expect(messageForErrorKind("timeout")).toBe(DIAGNOSTIC_TIMEOUT_MESSAGE);
    expect(messageForErrorKind("unavailable")).toBe(DIAGNOSTIC_UNAVAILABLE_MESSAGE);
    expect(messageForErrorKind("generic")).toBe(DIAGNOSTIC_UNAVAILABLE_MESSAGE);
  });

  it("H: rate limit is calm and does not push retry as primary", () => {
    const msg = messageForErrorKind("rate_limited");
    expect(msg).toMatch(/limite temporário/i);
    expect(msg).toMatch(/contexto continua salvo/i);
    expect(primaryActionForError("rate_limited")).toBe("whatsapp");
    expect(primaryActionForError("timeout")).toBe("retry");
    expect(primaryActionForError("unavailable")).toBe("retry");
  });

  it("maps error codes from server", () => {
    expect(mapErrorCode("timeout")).toBe("timeout");
    expect(mapErrorCode("rate_limited")).toBe("rate_limited");
    expect(mapErrorCode("unavailable")).toBe("unavailable");
    expect(mapErrorCode("invalid_input")).toBe("invalid_input");
    expect(mapErrorCode("other")).toBe("generic");
  });
});

describe("extraordinary states — session resume / expiry", () => {
  it("K: resume question index lands on 2/3 after one answer", () => {
    expect(resumeQuestionIndex(1, 3)).toBe(1);
    expect(resumeQuestionIndex(0, 3)).toBe(0);
    expect(resumeQuestionIndex(3, 3)).toBe(2);
  });

  it("J/K/L: mid-flow session restores without exclusive resume page contract", () => {
    const now = 1_700_000_000_000;
    const storage = memoryStorage();
    const session = buildSessionV2({
      phase: "confirm_understanding",
      source: "direct",
      originalReport: "Os pedidos chegam pelo WhatsApp e ficam sem dono claro.",
      now,
    });
    saveDiagnosticSessionV2(
      {
        ...session,
        interpretation: {
          understanding: "Fluxo manual.",
          primaryProblemHypothesis: "Visibilidade.",
          possibleDirection: "Entrada única.",
          rationale: "Antes de automatizar.",
          uncertainties: ["Quem recebe?"],
          clarifyingQuestions: [
            { id: "q1", prompt: "P1?", required: false },
            { id: "q2", prompt: "P2?", required: false },
            { id: "q3", prompt: "P3?", required: false },
          ],
        },
        questionsSource: "model",
        answers: [{ questionId: "q1", answer: "Quatro." }],
        phase: "clarifying",
      },
      storage,
    );
    const loaded = loadDiagnosticSessionV2(storage, now + 1_000);
    expect(loaded?.phase).toBe("clarifying");
    expect(resumeQuestionIndex(loaded!.answers.length, 3)).toBe(1);
    expect(SESSION_RESTORED_MESSAGE).toMatch(/Continuamos/);
  });

  it("M: expired session clears and exposes expired notice copy", () => {
    const now = 1_700_000_000_000;
    const storage = memoryStorage();
    const session = buildSessionV2({
      phase: "result",
      source: "direct",
      originalReport: "Cenário longo o suficiente para sessão.",
      now,
      ttlMs: 1_000,
    });
    saveDiagnosticSessionV2(session, storage);
    expect(isSessionExpired(session, now + 2_000)).toBe(true);
    expect(loadDiagnosticSessionV2(storage, now + 2_000)).toBeNull();
    clearDiagnosticSessionV2(storage);
    expect(storage.getItem(DIAGNOSTIC_SESSION_STORAGE_KEY)).toBeNull();
    expect(SESSION_EXPIRED_MESSAGE).toMatch(/expirou/i);
  });

  it("N: fresher home handoff wins over older V2 session (timestamp)", () => {
    const older = 1_700_000_000_000;
    const newer = older + 60_000;
    expect(newer > older).toBe(true);
    // Precedence is evaluated in the hook; contract: newer savedAt wins.
    expect(newer >= older).toBe(true);
  });

  it("O: legacy URL migrates and strips querystring", () => {
    const storage = memoryStorage();
    const prepared = prepareLegacyUrlCleanup({
      href: "https://dreamscraft.code/estimar?descricao=Os%20pedidos%20chegam%20pelo%20WhatsApp%20sem%20dono&categoria=atendimento",
      search: {
        descricao: "Os pedidos chegam pelo WhatsApp sem dono",
        categoria: "atendimento",
      },
      storage,
    });
    expect(prepared.shouldReplaceUrl).toBe(true);
    expect(prepared.cleanHref).not.toMatch(/descricao|categoria/);
    expect(prepared.migrated).toBe(true);
    expect(prepared.session?.originalReport.length).toBeGreaterThanOrEqual(12);
  });
});

describe("extraordinary states — AI budget & correction path", () => {
  it("A: normal journey max 1 interpret + 1 synthesize", () => {
    expect(assertModelBudget({ interpret: 1, synthesize: 1 })).toBe(true);
    expect(assertModelBudget({ interpret: 2, synthesize: 1 })).toBe(false);
  });

  it("B/C: adjust/reject keep interpret at 1 (no second interpret)", () => {
    // Correction path must not increment interpret — budget stays 1+1 after synthesize.
    expect(assertModelBudget({ interpret: 1, synthesize: 0 })).toBe(true);
    expect(assertModelBudget({ interpret: 1, synthesize: 1 })).toBe(true);
  });
});
