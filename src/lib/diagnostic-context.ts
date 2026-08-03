/** Contexto do Diagnostic Tester → /estimar (client-only, com expiração). */

export type DiagnosticCategory = "atendimento" | "planilhas" | "orcamentos" | "outro";

export type DiagnosticContext = {
  /** Opcional — a descrição é a fonte principal do contexto. */
  category?: DiagnosticCategory;
  description: string;
  savedAt: number;
};

const STORAGE_KEY = "dreamscraft.diagnostic.v1";
const TTL_MS = 30 * 60 * 1000;

export const DIAGNOSTIC_CATEGORY_LABELS: Record<DiagnosticCategory, string> = {
  atendimento: "Atendimento",
  planilhas: "Planilhas",
  orcamentos: "Orçamentos",
  outro: "Outro",
};

export function saveDiagnosticContext(
  input: Omit<DiagnosticContext, "savedAt">,
): DiagnosticContext {
  const payload: DiagnosticContext = {
    ...(input.category ? { category: input.category } : {}),
    description: input.description.trim(),
    savedAt: Date.now(),
  };
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // storage indisponível — search params ainda transportam o essencial
    }
  }
  return payload;
}

export function loadDiagnosticContext(): DiagnosticContext | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DiagnosticContext;
    if (!parsed || typeof parsed.description !== "string" || typeof parsed.savedAt !== "number") {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    if (parsed.category !== undefined && !parseDiagnosticCategory(parsed.category)) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    if (Date.now() - parsed.savedAt > TTL_MS) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return {
      description: parsed.description,
      savedAt: parsed.savedAt,
      ...(parsed.category ? { category: parsed.category as DiagnosticCategory } : {}),
    };
  } catch {
    return null;
  }
}

export function clearDiagnosticContext() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Search params seguros (descrição truncada para caber na URL). */
export function diagnosticToSearchParams(ctx: DiagnosticContext): {
  categoria?: DiagnosticCategory;
  descricao: string;
} {
  return {
    ...(ctx.category ? { categoria: ctx.category } : {}),
    descricao: ctx.description.slice(0, 480),
  };
}

export function parseDiagnosticCategory(value: unknown): DiagnosticCategory | undefined {
  if (
    value === "atendimento" ||
    value === "planilhas" ||
    value === "orcamentos" ||
    value === "outro"
  ) {
    return value;
  }
  return undefined;
}
