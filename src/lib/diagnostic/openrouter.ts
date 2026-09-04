import { DIAGNOSTIC_OPENROUTER_DEFAULT_MODEL, DIAGNOSTIC_OPENROUTER_TIMEOUT_MS } from "./constants";
import { JSON_REPAIR_SYSTEM_PROMPT } from "./prompts";
import { safeLogMeta } from "./sanitize";

export type OpenRouterDeps = {
  fetchImpl?: typeof fetch;
  apiKey: string;
  model?: string;
  timeoutMs?: number;
  log?: (msg: string, meta?: Record<string, unknown>) => void;
};

export type OpenRouterOk = { ok: true; content: string };
export type OpenRouterErr = {
  ok: false;
  code: "timeout" | "rate_limited" | "unavailable" | "invalid_json";
};
export type OpenRouterCallResult = OpenRouterOk | OpenRouterErr;

function extractJsonObject(content: string): string {
  const trimmed = content.trim();
  if (trimmed.startsWith("{")) return trimmed;
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence?.[1]) return fence[1].trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1);
  return trimmed;
}

async function postChat(
  deps: OpenRouterDeps,
  messages: { role: string; content: string }[],
  externalSignal?: AbortSignal,
): Promise<OpenRouterCallResult> {
  const fetchImpl = deps.fetchImpl ?? fetch;
  const timeoutMs = deps.timeoutMs ?? DIAGNOSTIC_OPENROUTER_TIMEOUT_MS;
  const log = deps.log ?? ((msg, meta) => console.error(msg, safeLogMeta(meta ?? {})));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const onAbort = () => controller.abort();
  externalSignal?.addEventListener("abort", onAbort);

  try {
    const res = await fetchImpl("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${deps.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://dreamscraftcode.com",
        "X-Title": "Dreamscraft Diagnostic V2",
      },
      body: JSON.stringify({
        model: deps.model ?? DIAGNOSTIC_OPENROUTER_DEFAULT_MODEL,
        messages,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    if (res.status === 429) {
      return { ok: false, code: "rate_limited" };
    }
    if (!res.ok) {
      log("diagnostic: openrouter HTTP", { status: res.status });
      return { ok: false, code: "unavailable" };
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      return { ok: false, code: "invalid_json" };
    }
    return { ok: true, content: extractJsonObject(content) };
  } catch (err) {
    const aborted =
      (err instanceof Error && err.name === "AbortError") ||
      externalSignal?.aborted ||
      controller.signal.aborted;
    if (aborted) return { ok: false, code: "timeout" };
    log("diagnostic: openrouter network", { name: err instanceof Error ? err.name : "error" });
    return { ok: false, code: "unavailable" };
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener("abort", onAbort);
  }
}

/**
 * Uma chamada (+ no máximo 1 retry só para reparar JSON inválido de parse).
 */
export async function fetchOpenRouterJson(params: {
  system: string;
  user: string;
  deps: OpenRouterDeps;
  signal?: AbortSignal;
  parse: (raw: string) => { success: true; data: unknown } | { success: false };
}): Promise<OpenRouterCallResult & { data?: unknown }> {
  const first = await postChat(
    params.deps,
    [
      { role: "system", content: params.system },
      { role: "user", content: params.user },
    ],
    params.signal,
  );
  if (!first.ok) return first;

  const parsed = params.parse(first.content);
  if (parsed.success) return { ok: true, content: first.content, data: parsed.data };

  const repair = await postChat(
    params.deps,
    [
      { role: "system", content: JSON_REPAIR_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Schema esperado já foi definido. JSON inválido:\n${first.content.slice(0, 4000)}`,
      },
    ],
    params.signal,
  );
  if (!repair.ok) {
    return repair.code === "invalid_json" ? { ok: false, code: "invalid_json" } : repair;
  }

  const repaired = params.parse(repair.content);
  if (!repaired.success) return { ok: false, code: "invalid_json" };
  return { ok: true, content: repair.content, data: repaired.data };
}
