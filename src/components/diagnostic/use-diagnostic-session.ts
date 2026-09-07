import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  DIAGNOSTIC_COMMERCIAL_NOTE,
  DIAGNOSTIC_NEUTRAL_QUESTIONS,
  DIAGNOSTIC_REPORT_MAX_CHARS,
  DIAGNOSTIC_REPORT_MIN_CHARS,
  DIAGNOSTIC_SESSION_TTL_MS,
  DIAGNOSTIC_UNAVAILABLE_MESSAGE,
  type DiagnosticPublicPhase,
} from "@/lib/diagnostic/constants";
import {
  errorHostForOperation,
  mapErrorCode,
  messageForErrorKind,
  resumeQuestionIndex,
  type DiagnosticErrorKind,
  type ErrorHost,
  type SessionNotice,
} from "@/lib/diagnostic/extraordinary";
import {
  interpretDiagnostic,
  synthesizeDiagnostic,
} from "@/lib/diagnostic.functions";
import type {
  ClarifyingQuestion,
  DiagnosticAnswer,
  DiagnosticCategory,
  DiagnosticSessionV2,
  InterpretationPublic,
  SynthesisPublic,
} from "@/lib/diagnostic/schemas";
import {
  buildSessionV2,
  clearDiagnosticSessionV2,
  isSessionExpired,
  loadDiagnosticSessionV2,
  prepareLegacyUrlCleanup,
  saveDiagnosticSessionV2,
} from "@/lib/diagnostic/storage";
import {
  clearDiagnosticContext,
  loadDiagnosticContext,
} from "@/lib/diagnostic-context";

export type DiagnosticUiMode =
  | "boot"
  | "entry_direct"
  | "entry_home"
  | "interpreting"
  | "understanding"
  | "correction"
  | "clarifying"
  | "synthesizing"
  | "result"
  | "capture"
  | "success";

export type CorrectionIntent = "adjust" | "reject";

export type { DiagnosticErrorKind, ErrorHost, SessionNotice };

export type InlineErrorState = {
  host: ErrorHost;
  kind: DiagnosticErrorKind;
  message: string;
};

type SearchInput = {
  categoria?: unknown;
  descricao?: unknown;
};

function newRequestId(): string {
  return crypto.randomUUID();
}

function persist(session: DiagnosticSessionV2): DiagnosticSessionV2 {
  const now = Date.now();
  return saveDiagnosticSessionV2({
    ...session,
    savedAt: now,
    expiresAt: now + DIAGNOSTIC_SESSION_TTL_MS,
  });
}

function phaseToMode(phase: DiagnosticPublicPhase): DiagnosticUiMode {
  switch (phase) {
    case "collecting_input":
      return "entry_direct";
    case "interpreting":
      return "interpreting";
    case "confirm_understanding":
      return "understanding";
    case "clarifying":
      return "clarifying";
    case "synthesizing":
      return "synthesizing";
    case "result":
    case "capture_lead":
    case "done":
      return "result";
    case "error":
    case "unavailable":
      // Erro fica inline no capítulo — modo base de coleta se não houver contexto.
      return "entry_direct";
    default:
      return "entry_direct";
  }
}

function entryModeForSource(source: DiagnosticSessionV2["source"]): DiagnosticUiMode {
  return source === "home" || source === "legacy_url" ? "entry_home" : "entry_direct";
}

function neutralAsQuestions(): ClarifyingQuestion[] {
  return DIAGNOSTIC_NEUTRAL_QUESTIONS.map((q) => ({
    id: q.id,
    prompt: q.prompt,
    helpText: q.helpText,
    required: q.required,
  }));
}

function hydrateFromSession(existing: DiagnosticSessionV2): {
  mode: DiagnosticUiMode;
  questionIndex: number;
  emailExpanded: boolean;
  leadNote: string | null;
} {
  const qs = existing.interpretation?.clarifyingQuestions ?? [];
  const mode = phaseToMode(existing.phase);
  // Se a sessão parou em erro sem interpretação, Entrada; com interpretação, Contexto.
  if (existing.phase === "error" || existing.phase === "unavailable") {
    if (existing.interpretation) {
      return {
        mode: "clarifying",
        questionIndex: resumeQuestionIndex(existing.answers.length, qs.length),
        emailExpanded: false,
        leadNote: null,
      };
    }
    return {
      mode: entryModeForSource(existing.source),
      questionIndex: 0,
      emailExpanded: false,
      leadNote: null,
    };
  }

  return {
    mode,
    questionIndex: resumeQuestionIndex(existing.answers.length, qs.length),
    emailExpanded: existing.phase === "capture_lead" || existing.phase === "done",
    leadNote:
      existing.phase === "done"
        ? "O envio automático do resumo por e-mail ainda não está ativo. Você pode continuar pelo WhatsApp com o contexto organizado."
        : null,
  };
}

export function useDiagnosticSession(search: SearchInput) {
  const interpret = useServerFn(interpretDiagnostic);
  const synthesize = useServerFn(synthesizeDiagnostic);

  const [mode, setMode] = useState<DiagnosticUiMode>("boot");
  const [session, setSession] = useState<DiagnosticSessionV2 | null>(null);
  const [draftReport, setDraftReport] = useState("");
  const [correctionDraft, setCorrectionDraft] = useState("");
  const [correctionIntent, setCorrectionIntent] = useState<CorrectionIntent | null>(null);
  const [answerDraft, setAnswerDraft] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [pending, setPending] = useState(false);
  const [inlineError, setInlineError] = useState<InlineErrorState | null>(null);
  const [sessionNotice, setSessionNotice] = useState<SessionNotice | null>(null);
  const [modelCalls, setModelCalls] = useState({ interpret: 0, synthesize: 0 });
  const [captureEmail, setCaptureEmail] = useState("");
  const [captureName, setCaptureName] = useState("");
  const [leadNote, setLeadNote] = useState<string | null>(null);
  const [emailExpanded, setEmailExpanded] = useState(false);

  const bootDone = useRef(false);
  const lastRetry = useRef<"interpret" | "synthesize" | null>(null);

  const applySession = useCallback((next: DiagnosticSessionV2, nextMode?: DiagnosticUiMode) => {
    const saved = persist(next);
    setSession(saved);
    if (nextMode) setMode(nextMode);
    else setMode(phaseToMode(saved.phase));
  }, []);

  const clearInlineError = useCallback(() => setInlineError(null), []);

  const dismissSessionNotice = useCallback(() => setSessionNotice(null), []);

  // Boot: precedence — fresh home/URL over existing V2
  useEffect(() => {
    if (bootDone.current) return;
    bootDone.current = true;

    const now = Date.now();
    const existing = loadDiagnosticSessionV2(undefined, now);
    const home = loadDiagnosticContext();

    const href = typeof window !== "undefined" ? window.location.href : "/estimar";
    const legacy = prepareLegacyUrlCleanup({
      href,
      search: { descricao: search.descricao, categoria: search.categoria },
    });

    if (legacy.shouldReplaceUrl && typeof window !== "undefined") {
      window.history.replaceState(null, "", legacy.cleanHref);
    }

    const homeFresh =
      home &&
      home.description.trim().length >= DIAGNOSTIC_REPORT_MIN_CHARS &&
      (!existing || home.savedAt >= existing.savedAt);

    const legacyFresh =
      legacy.migrated &&
      legacy.session &&
      (!existing || legacy.session.savedAt >= existing.savedAt);

    if (homeFresh && home) {
      const report = home.description.trim().slice(0, DIAGNOSTIC_REPORT_MAX_CHARS);
      const built = buildSessionV2({
        phase: "collecting_input",
        source: "home",
        originalReport: report,
        ...(home.category ? { category: home.category } : {}),
        now,
      });
      clearDiagnosticContext();
      const saved = persist(built);
      setSession(saved);
      setDraftReport(report);
      setMode("entry_home");
      return;
    }

    if (legacyFresh && legacy.session) {
      const saved = persist({ ...legacy.session, source: "legacy_url", phase: "collecting_input" });
      setSession(saved);
      setDraftReport(saved.originalReport);
      setMode("entry_home");
      return;
    }

    if (existing && !isSessionExpired(existing, now)) {
      if (existing.phase === "collecting_input" && !existing.interpretation) {
        setSession(existing);
        setDraftReport(existing.originalReport);
        setMode(entryModeForSource(existing.source));
        return;
      }

      // Retomada automática — sem página exclusiva.
      const hydrated = hydrateFromSession(existing);
      setSession(existing);
      setDraftReport(existing.originalReport);
      setQuestionIndex(hydrated.questionIndex);
      setEmailExpanded(hydrated.emailExpanded);
      setLeadNote(hydrated.leadNote);
      setMode(hydrated.mode);
      setSessionNotice("restored");
      return;
    }

    if (existing && isSessionExpired(existing, now)) {
      clearDiagnosticSessionV2();
      setSession(null);
      setDraftReport("");
      setMode("entry_direct");
      setSessionNotice("expired");
      return;
    }

    setMode("entry_direct");
  }, [search.categoria, search.descricao]);

  const questions: ClarifyingQuestion[] =
    session?.interpretation?.clarifyingQuestions ??
    (session?.questionsSource === "neutral_local" ? neutralAsQuestions() : []);

  const currentQuestion = questions[questionIndex] ?? null;

  const startAnalyze = useCallback(
    async (report: string, source: DiagnosticSessionV2["source"], category?: DiagnosticCategory) => {
      const trimmed = report.trim().slice(0, DIAGNOSTIC_REPORT_MAX_CHARS);
      if (trimmed.length < DIAGNOSTIC_REPORT_MIN_CHARS) return;

      const base =
        session && session.originalReport === trimmed
          ? session
          : buildSessionV2({
              phase: "interpreting",
              source,
              originalReport: trimmed,
              ...(category ? { category } : {}),
              sessionId: session?.sessionId,
            });

      const next: DiagnosticSessionV2 = {
        ...base,
        phase: "interpreting",
        originalReport: trimmed,
        answers: [],
        interpretation: undefined,
        result: undefined,
        userCorrection: undefined,
        questionsSource: undefined,
      };
      setInlineError(null);
      applySession(next, "interpreting");
      setPending(true);
      lastRetry.current = "interpret";

      const requestId = newRequestId();
      try {
        const result = await interpret({
          data: {
            requestId,
            originalReport: trimmed,
            ...(category ? { category } : {}),
          },
        });
        setModelCalls((c) => ({ ...c, interpret: c.interpret + 1 }));

        if (!result.ok) {
          const kind = mapErrorCode(result.code);
          setInlineError({
            host: errorHostForOperation("interpret"),
            kind,
            message: messageForErrorKind(kind, result.message),
          });
          applySession(
            { ...next, phase: result.code === "rate_limited" ? "unavailable" : "error" },
            entryModeForSource(source),
          );
          return;
        }

        applySession(
          {
            ...next,
            phase: "confirm_understanding",
            interpretation: result.data,
            questionsSource: result.questionsSource,
          },
          "understanding",
        );
      } catch {
        setInlineError({
          host: "entry",
          kind: "unavailable",
          message: messageForErrorKind("unavailable", DIAGNOSTIC_UNAVAILABLE_MESSAGE),
        });
        applySession({ ...next, phase: "error" }, entryModeForSource(source));
      } finally {
        setPending(false);
      }
    },
    [applySession, interpret, session],
  );

  const confirmYes = useCallback(() => {
    if (!session?.interpretation) return;
    setQuestionIndex(0);
    setAnswerDraft("");
    setInlineError(null);
    applySession(
      {
        ...session,
        phase: "clarifying",
        questionsSource: session.questionsSource ?? "model",
      },
      "clarifying",
    );
  }, [applySession, session]);

  const openCorrection = useCallback((intent: CorrectionIntent) => {
    setCorrectionIntent(intent);
    setCorrectionDraft("");
    setMode("understanding");
  }, []);

  const closeCorrection = useCallback(() => {
    setCorrectionIntent(null);
    setCorrectionDraft("");
    setMode("understanding");
  }, []);

  const submitCorrection = useCallback(() => {
    if (!session?.interpretation) return;
    const correction = correctionDraft.trim();
    if (!correction) return;

    const localUnderstanding: InterpretationPublic = {
      ...session.interpretation,
      understanding: `Você ajustou o entendimento. Consideramos principalmente: ${correction}`,
      clarifyingQuestions: neutralAsQuestions(),
      rationale:
        "Como o entendimento anterior não representava bem o problema, seguimos com perguntas neutras — sem forçar uma leitura automática.",
    };

    setQuestionIndex(0);
    setAnswerDraft("");
    setCorrectionIntent(null);
    setInlineError(null);
    applySession(
      {
        ...session,
        phase: "clarifying",
        userCorrection: correction,
        interpretation: localUnderstanding,
        questionsSource: "neutral_local",
      },
      "clarifying",
    );
  }, [applySession, correctionDraft, session]);

  const runSynthesize = useCallback(
    async (base: DiagnosticSessionV2, answers: DiagnosticAnswer[]) => {
      if (!base.interpretation) return;
      const synthesizing: DiagnosticSessionV2 = {
        ...base,
        answers,
        phase: "synthesizing",
      };
      setInlineError(null);
      applySession(synthesizing, "synthesizing");
      setPending(true);
      lastRetry.current = "synthesize";

      const requestId = newRequestId();
      try {
        const result = await synthesize({
          data: {
            requestId,
            originalReport: base.originalReport,
            ...(base.category ? { category: base.category } : {}),
            ...(base.userCorrection ? { userCorrection: base.userCorrection } : {}),
            interpretation: base.interpretation,
            answers,
          },
        });
        setModelCalls((c) => ({ ...c, synthesize: c.synthesize + 1 }));

        if (!result.ok) {
          const kind = mapErrorCode(result.code);
          setInlineError({
            host: errorHostForOperation("synthesize"),
            kind,
            message: messageForErrorKind(kind, result.message),
          });
          applySession(
            { ...synthesizing, phase: result.code === "rate_limited" ? "unavailable" : "error" },
            "clarifying",
          );
          return;
        }

        const data: SynthesisPublic = {
          ...result.data,
          commercialNote: DIAGNOSTIC_COMMERCIAL_NOTE,
        };
        applySession({ ...synthesizing, phase: "result", result: data }, "result");
      } catch {
        setInlineError({
          host: "context",
          kind: "unavailable",
          message: messageForErrorKind("unavailable", DIAGNOSTIC_UNAVAILABLE_MESSAGE),
        });
        applySession({ ...synthesizing, phase: "error" }, "clarifying");
      } finally {
        setPending(false);
      }
    },
    [applySession, synthesize],
  );

  const submitAnswer = useCallback(
    async (opts: { skipped?: boolean } = {}) => {
      if (!session?.interpretation || !currentQuestion) return;
      const skipped = Boolean(opts.skipped);
      const answer = skipped ? "" : answerDraft.trim();
      if (!skipped && !answer) return;

      const entry: DiagnosticAnswer = {
        questionId: currentQuestion.id,
        answer,
        ...(skipped ? { skipped: true } : {}),
      };
      const answers = [...session.answers.filter((a) => a.questionId !== entry.questionId), entry];
      const nextIndex = questionIndex + 1;

      if (nextIndex < questions.length) {
        setQuestionIndex(nextIndex);
        setAnswerDraft("");
        setInlineError(null);
        applySession({ ...session, answers, phase: "clarifying" }, "clarifying");
        return;
      }

      await runSynthesize(session, answers);
    },
    [
      answerDraft,
      applySession,
      currentQuestion,
      questionIndex,
      questions.length,
      runSynthesize,
      session,
    ],
  );

  const retry = useCallback(async () => {
    if (!session) return;
    setInlineError(null);
    if (lastRetry.current === "synthesize" && session.interpretation) {
      await runSynthesize(session, session.answers);
      return;
    }
    await startAnalyze(session.originalReport, session.source, session.category);
  }, [runSynthesize, session, startAnalyze]);

  const startFresh = useCallback(() => {
    clearDiagnosticSessionV2();
    setSession(null);
    setDraftReport("");
    setAnswerDraft("");
    setCorrectionDraft("");
    setCorrectionIntent(null);
    setQuestionIndex(0);
    setLeadNote(null);
    setEmailExpanded(false);
    setInlineError(null);
    setSessionNotice(null);
    setModelCalls({ interpret: 0, synthesize: 0 });
    setMode("entry_direct");
  }, []);

  const openEmailCapture = useCallback(() => {
    if (!session) return;
    setEmailExpanded(true);
    setLeadNote(null);
    applySession({ ...session, phase: "capture_lead" }, "result");
  }, [applySession, session]);

  const closeEmailCapture = useCallback(() => {
    setEmailExpanded(false);
    if (!session?.result) return;
    applySession({ ...session, phase: "result" }, "result");
  }, [applySession, session]);

  const submitCaptureStub = useCallback(() => {
    setLeadNote(
      "O envio automático do resumo por e-mail ainda não está ativo. Registramos só o interesse nesta sessão — você pode continuar pelo WhatsApp com o contexto organizado.",
    );
    setEmailExpanded(true);
    if (!session) return;
    applySession({ ...session, phase: "done" }, "result");
  }, [applySession, session]);

  // Aliases legados (UI não usa mais páginas de retomada)
  const continueResume = startFresh;
  const discardResume = startFresh;

  return {
    mode,
    session,
    draftReport,
    setDraftReport,
    correctionDraft,
    setCorrectionDraft,
    correctionIntent,
    answerDraft,
    setAnswerDraft,
    questionIndex,
    questions,
    currentQuestion,
    pending,
    inlineError,
    sessionNotice,
    /** @deprecated use inlineError */
    errorKind: inlineError?.kind ?? ("generic" as DiagnosticErrorKind),
    /** @deprecated use inlineError */
    errorMessage: inlineError?.message ?? DIAGNOSTIC_UNAVAILABLE_MESSAGE,
    resumeSession: null as DiagnosticSessionV2 | null,
    modelCalls,
    captureEmail,
    setCaptureEmail,
    captureName,
    setCaptureName,
    leadNote,
    emailExpanded,
    startAnalyze,
    confirmYes,
    openCorrection,
    closeCorrection,
    submitCorrection,
    submitAnswer,
    retry,
    continueResume,
    discardResume,
    openEmailCapture,
    closeEmailCapture,
    submitCaptureStub,
    startFresh,
    clearInlineError,
    dismissSessionNotice,
    setMode,
  };
}
