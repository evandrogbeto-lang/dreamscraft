import { describe, expect, it } from "vitest";
import {
  buildSessionV2,
  clearDiagnosticSessionV2,
  isSessionExpired,
  loadDiagnosticSessionV2,
  migrateLegacyDiagnosticSearch,
  prepareLegacyUrlCleanup,
  saveDiagnosticSessionV2,
  stripLegacyDiagnosticSearchFromUrl,
  type StorageLike,
} from "./storage";

function memoryStorage(seed: Record<string, string> = {}): StorageLike {
  const map = new Map(Object.entries(seed));
  return {
    getItem: (k) => (map.has(k) ? map.get(k)! : null),
    setItem: (k, v) => {
      map.set(k, v);
    },
    removeItem: (k) => {
      map.delete(k);
    },
  };
}

describe("diagnostic storage v2", () => {
  it("saves and loads a valid session within TTL", () => {
    const storage = memoryStorage();
    const now = 1_700_000_000_000;
    const session = buildSessionV2({
      phase: "collecting_input",
      source: "home",
      originalReport: "Relato válido da Home para diagnóstico.",
      now,
      ttlMs: 60_000,
    });
    saveDiagnosticSessionV2(session, storage);
    const loaded = loadDiagnosticSessionV2(storage, now + 1_000);
    expect(loaded?.originalReport).toBe(session.originalReport);
    expect(loaded?.schemaVersion).toBe(2);
  });

  it("drops expired sessions", () => {
    const storage = memoryStorage();
    const now = 1_700_000_000_000;
    const session = buildSessionV2({
      phase: "collecting_input",
      source: "direct",
      originalReport: "Relato válido da Home para diagnóstico.",
      now,
      ttlMs: 1_000,
    });
    saveDiagnosticSessionV2(session, storage);
    expect(isSessionExpired(session, now + 2_000)).toBe(true);
    expect(loadDiagnosticSessionV2(storage, now + 2_000)).toBeNull();
  });

  it("migrates legacy URL description into session storage", () => {
    const storage = memoryStorage();
    const result = migrateLegacyDiagnosticSearch({
      search: {
        descricao: "Texto legado longo o bastante para migrar ao storage v2.",
        categoria: "atendimento",
      },
      storage,
      now: 1_700_000_000_000,
    });
    expect(result.migrated).toBe(true);
    expect(result.session?.source).toBe("legacy_url");
    expect(result.session?.category).toBe("atendimento");
    expect(result.keysToStrip).toEqual(expect.arrayContaining(["descricao", "categoria"]));
    expect(loadDiagnosticSessionV2(storage, 1_700_000_000_000)?.originalReport).toContain(
      "Texto legado",
    );
  });

  it("strips description from URL without keeping it in the returned href", () => {
    const stripped = stripLegacyDiagnosticSearchFromUrl(
      "https://dreamscraftcode.com/estimar?descricao=segredo%20longo&categoria=outro&x=1",
    );
    expect(stripped.changed).toBe(true);
    expect(stripped.href).not.toContain("descricao=");
    expect(stripped.href).not.toContain("segredo");
    expect(stripped.href).toContain("x=1");
  });

  it("prepareLegacyUrlCleanup migrates and returns clean href", () => {
    const storage = memoryStorage();
    const prepared = prepareLegacyUrlCleanup({
      href: "/estimar?descricao=Relato%20legado%20suficientemente%20longo%20para%20migrar&categoria=planilhas",
      search: {
        descricao: "Relato legado suficientemente longo para migrar",
        categoria: "planilhas",
      },
      storage,
      now: 1_700_000_000_000,
    });
    expect(prepared.migrated).toBe(true);
    expect(prepared.shouldReplaceUrl).toBe(true);
    expect(prepared.cleanHref).toBe("/estimar");
    expect(prepared.session?.category).toBe("planilhas");
  });

  it("clear removes the session key", () => {
    const storage = memoryStorage();
    const session = buildSessionV2({
      phase: "idle",
      source: "direct",
      originalReport: "Relato válido da Home para diagnóstico.",
    });
    saveDiagnosticSessionV2(session, storage);
    clearDiagnosticSessionV2(storage);
    expect(loadDiagnosticSessionV2(storage)).toBeNull();
  });
});
