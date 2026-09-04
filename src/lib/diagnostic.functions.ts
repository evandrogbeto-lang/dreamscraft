import { createServerFn } from "@tanstack/react-start";
import {
  DIAGNOSTIC_OPENROUTER_DEFAULT_MODEL,
  DIAGNOSTIC_OPENROUTER_TIMEOUT_MS,
  DIAGNOSTIC_RATE_LIMIT_BUCKET,
  DIAGNOSTIC_RATE_LIMIT_PER_HOUR,
} from "./diagnostic/constants";
import {
  createMemoryIdempotency,
  runInterpretDiagnostic,
  runSynthesizeDiagnostic,
  type RateLimitPort,
} from "./diagnostic/core";
import { InterpretInputSchema, SynthesizeInputSchema } from "./diagnostic/schemas";
import { safeLogMeta } from "./diagnostic/sanitize";

const idempotency = createMemoryIdempotency();

async function createSupabaseRateLimit(): Promise<RateLimitPort> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return {
    async check(ip: string) {
      const sinceIso = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { count } = await supabaseAdmin
        .from("rate_limits")
        .select("*", { count: "exact", head: true })
        .eq("bucket", DIAGNOSTIC_RATE_LIMIT_BUCKET)
        .eq("key", ip)
        .gte("created_at", sinceIso);
      return (count ?? 0) >= DIAGNOSTIC_RATE_LIMIT_PER_HOUR ? "limited" : "ok";
    },
    async record(ip: string) {
      await supabaseAdmin.from("rate_limits").insert({
        bucket: DIAGNOSTIC_RATE_LIMIT_BUCKET,
        key: ip,
      });
    },
  };
}

function clientIpFromRequest(
  getRequestHeader: (name: string) => string | undefined,
  getRequestIP: () => string | undefined,
): string {
  const xff = getRequestHeader("x-forwarded-for");
  return xff?.split(",")[0]?.trim() || getRequestIP() || "unknown";
}

/**
 * Interpretação inicial do Diagnóstico V2.
 * Ainda NÃO conectada à rota /estimar.
 */
export const interpretDiagnostic = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InterpretInputSchema.parse(d))
  .handler(async ({ data }) => {
    const { getRequestIP, getRequestHeader } = await import("@tanstack/react-start/server");
    const key = process.env.OPENROUTER_API_KEY;
    if (!key) {
      console.error("diagnostic: OPENROUTER_API_KEY missing", safeLogMeta({}));
      return {
        ok: false as const,
        code: "unavailable" as const,
        message: "Não conseguimos organizar seu diagnóstico agora. Seu relato foi preservado.",
      };
    }

    const rateLimit = await createSupabaseRateLimit();
    return runInterpretDiagnostic(data, {
      openRouter: {
        apiKey: key,
        model: process.env.OPENROUTER_MODEL || DIAGNOSTIC_OPENROUTER_DEFAULT_MODEL,
        timeoutMs: DIAGNOSTIC_OPENROUTER_TIMEOUT_MS,
        log: (msg, meta) => console.error(msg, safeLogMeta(meta ?? {})),
      },
      rateLimit,
      idempotency,
      getClientIp: () => clientIpFromRequest(getRequestHeader, getRequestIP),
    });
  });

/**
 * Síntese final do Diagnóstico V2.
 * Ainda NÃO conectada à rota /estimar.
 */
export const synthesizeDiagnostic = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SynthesizeInputSchema.parse(d))
  .handler(async ({ data }) => {
    const { getRequestIP, getRequestHeader } = await import("@tanstack/react-start/server");
    const key = process.env.OPENROUTER_API_KEY;
    if (!key) {
      console.error("diagnostic: OPENROUTER_API_KEY missing", safeLogMeta({}));
      return {
        ok: false as const,
        code: "unavailable" as const,
        message: "Não conseguimos organizar seu diagnóstico agora. Seu relato foi preservado.",
      };
    }

    const rateLimit = await createSupabaseRateLimit();
    return runSynthesizeDiagnostic(data, {
      openRouter: {
        apiKey: key,
        model: process.env.OPENROUTER_MODEL || DIAGNOSTIC_OPENROUTER_DEFAULT_MODEL,
        timeoutMs: DIAGNOSTIC_OPENROUTER_TIMEOUT_MS,
        log: (msg, meta) => console.error(msg, safeLogMeta(meta ?? {})),
      },
      rateLimit,
      idempotency,
      getClientIp: () => clientIpFromRequest(getRequestHeader, getRequestIP),
    });
  });
