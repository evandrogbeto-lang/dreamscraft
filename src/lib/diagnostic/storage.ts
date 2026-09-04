import {
  DIAGNOSTIC_SCHEMA_VERSION,
  DIAGNOSTIC_SESSION_STORAGE_KEY,
  DIAGNOSTIC_SESSION_TTL_MS,
  DIAGNOSTIC_REPORT_MAX_CHARS,
  DIAGNOSTIC_REPORT_MIN_CHARS,
} from "./constants";
import type { DiagnosticPublicPhase } from "./constants";
import {
  DiagnosticCategorySchema,
  DiagnosticSessionV2Schema,
  type DiagnosticCategory,
  type DiagnosticSessionV2,
} from "./schemas";
import { sanitizeReport } from "./sanitize";

export type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

function defaultStorage(): StorageLike | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function createSessionId(randomUUID: () => string = () => crypto.randomUUID()): string {
  return randomUUID();
}

export function buildSessionV2(input: {
  sessionId?: string;
  phase: DiagnosticPublicPhase;
  source: DiagnosticSessionV2["source"];
  originalReport: string;
  category?: DiagnosticCategory;
  now?: number;
  ttlMs?: number;
}): DiagnosticSessionV2 {
  const now = input.now ?? Date.now();
  const ttl = input.ttlMs ?? DIAGNOSTIC_SESSION_TTL_MS;
  const report = sanitizeReport(input.originalReport);
  return DiagnosticSessionV2Schema.parse({
    schemaVersion: DIAGNOSTIC_SCHEMA_VERSION,
    sessionId: input.sessionId ?? createSessionId(),
    phase: input.phase,
    source: input.source,
    ...(input.category ? { category: input.category } : {}),
    originalReport: report,
    answers: [],
    savedAt: now,
    expiresAt: now + ttl,
  });
}

export function isSessionExpired(
  session: Pick<DiagnosticSessionV2, "expiresAt">,
  now = Date.now(),
): boolean {
  return now >= session.expiresAt;
}

export function saveDiagnosticSessionV2(
  session: DiagnosticSessionV2,
  storage: StorageLike | null = defaultStorage(),
): DiagnosticSessionV2 {
  const parsed = DiagnosticSessionV2Schema.parse(session);
  if (!storage) return parsed;
  try {
    storage.setItem(DIAGNOSTIC_SESSION_STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // quota / private mode
  }
  return parsed;
}

export function loadDiagnosticSessionV2(
  storage: StorageLike | null = defaultStorage(),
  now = Date.now(),
): DiagnosticSessionV2 | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(DIAGNOSTIC_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = DiagnosticSessionV2Schema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      storage.removeItem(DIAGNOSTIC_SESSION_STORAGE_KEY);
      return null;
    }
    if (isSessionExpired(parsed.data, now)) {
      storage.removeItem(DIAGNOSTIC_SESSION_STORAGE_KEY);
      return null;
    }
    return parsed.data;
  } catch {
    try {
      storage.removeItem(DIAGNOSTIC_SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
    return null;
  }
}

export function clearDiagnosticSessionV2(storage: StorageLike | null = defaultStorage()): void {
  if (!storage) return;
  try {
    storage.removeItem(DIAGNOSTIC_SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export type LegacySearchInput = {
  categoria?: unknown;
  descricao?: unknown;
};

export type LegacyMigrationResult = {
  migrated: boolean;
  session: DiagnosticSessionV2 | null;
  /** Query keys that should be removed from the URL. */
  keysToStrip: string[];
};

/**
 * Migra `?descricao=` (e categoria opcional) uma vez para sessionStorage V2.
 * Não altera o histórico — a UI futura deve chamar `stripLegacyDiagnosticSearchFromUrl`.
 */
export function migrateLegacyDiagnosticSearch(params: {
  search: LegacySearchInput;
  storage?: StorageLike | null;
  now?: number;
  existingSession?: DiagnosticSessionV2 | null;
}): LegacyMigrationResult {
  const storage = params.storage === undefined ? defaultStorage() : params.storage;
  const now = params.now ?? Date.now();
  const keysToStrip: string[] = [];

  const rawDesc = typeof params.search.descricao === "string" ? params.search.descricao : "";
  const cleaned = sanitizeReport(rawDesc);

  if (cleaned.length >= DIAGNOSTIC_REPORT_MIN_CHARS) {
    keysToStrip.push("descricao");
  }

  const catParsed = DiagnosticCategorySchema.safeParse(params.search.categoria);
  if (params.search.categoria !== undefined && params.search.categoria !== "") {
    keysToStrip.push("categoria");
  }

  if (cleaned.length < DIAGNOSTIC_REPORT_MIN_CHARS) {
    return { migrated: false, session: params.existingSession ?? null, keysToStrip };
  }

  // Já existe sessão válida com o mesmo relato — só limpar URL.
  const existing = params.existingSession ?? loadDiagnosticSessionV2(storage, now);
  if (existing && !isSessionExpired(existing, now) && existing.originalReport === cleaned) {
    return { migrated: true, session: existing, keysToStrip };
  }

  const session = buildSessionV2({
    phase: "collecting_input",
    source: "legacy_url",
    originalReport: cleaned.slice(0, DIAGNOSTIC_REPORT_MAX_CHARS),
    ...(catParsed.success ? { category: catParsed.data } : {}),
    now,
  });
  saveDiagnosticSessionV2(session, storage);
  return { migrated: true, session, keysToStrip };
}

/**
 * Remove descricao/categoria da URL via replaceState (sem empilhar histórico).
 * Função testável — não conectada à UI nesta etapa.
 */
export function stripLegacyDiagnosticSearchFromUrl(
  href: string,
  keys: string[] = ["descricao", "categoria"],
): { changed: boolean; href: string } {
  let url: URL;
  try {
    url = new URL(href, "https://dreamscraftcode.com");
  } catch {
    return { changed: false, href };
  }
  let changed = false;
  for (const key of keys) {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
      changed = true;
    }
  }
  const next = `${url.pathname}${url.search}${url.hash}`;
  return { changed, href: next };
}

/**
 * Helper completo para a futura UI: migra + devolve href limpo.
 * Não chama history.replaceState aqui (facilita testes).
 */
export function prepareLegacyUrlCleanup(params: {
  href: string;
  search: LegacySearchInput;
  storage?: StorageLike | null;
  now?: number;
}): {
  migrated: boolean;
  session: DiagnosticSessionV2 | null;
  cleanHref: string;
  shouldReplaceUrl: boolean;
} {
  const migration = migrateLegacyDiagnosticSearch({
    search: params.search,
    storage: params.storage,
    now: params.now,
  });
  const stripped = stripLegacyDiagnosticSearchFromUrl(
    params.href,
    migration.keysToStrip.length ? migration.keysToStrip : ["descricao", "categoria"],
  );
  return {
    migrated: migration.migrated,
    session: migration.session,
    cleanHref: stripped.href,
    shouldReplaceUrl: stripped.changed,
  };
}
