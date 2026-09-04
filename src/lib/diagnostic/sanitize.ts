import {
  DIAGNOSTIC_ANSWER_MAX_CHARS,
  DIAGNOSTIC_CORRECTION_MAX_CHARS,
  DIAGNOSTIC_REPORT_MAX_CHARS,
} from "./constants";

/** Remove controles (exceto \\n e \\t), normaliza espaços e limita tamanho. */
export function sanitizeUserText(input: unknown, maxChars: number): string {
  if (typeof input !== "string") return "";
  let out = "";
  for (const ch of input) {
    const code = ch.charCodeAt(0);
    if (code === 0) continue;
    if (code === 9 || code === 10) {
      out += ch;
      continue;
    }
    if (code >= 1 && code <= 31) continue;
    if (code === 127) continue;
    out += ch;
  }
  return out
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxChars);
}

export function sanitizeReport(input: unknown): string {
  return sanitizeUserText(input, DIAGNOSTIC_REPORT_MAX_CHARS);
}

export function sanitizeCorrection(input: unknown): string {
  return sanitizeUserText(input, DIAGNOSTIC_CORRECTION_MAX_CHARS);
}

export function sanitizeAnswer(input: unknown): string {
  return sanitizeUserText(input, DIAGNOSTIC_ANSWER_MAX_CHARS);
}

/**
 * Heurística leve: não bloqueia o fluxo, mas sinaliza tentativas óbvias
 * de injeção para o server tratar o texto ainda mais como dado opaco.
 */
export function looksLikePromptInjection(text: string): boolean {
  const t = text.toLowerCase();
  return (
    /ignore (all |any )?(previous|prior|above) (instructions|prompts)/i.test(t) ||
    /system prompt/i.test(t) ||
    /you are now/i.test(t) ||
    (/responda apenas com/i.test(t) && /stack|preço|prazo|json/i.test(t)) ||
    /<\/?user_data/i.test(t)
  );
}

/** Logs seguros — nunca incluir relato/PII. */
export function safeLogMeta(meta: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(meta)) {
    if (/report|description|email|name|correction|answer|prompt|content|pii/i.test(k)) {
      out[k] = typeof v === "string" ? `[redacted len=${v.length}]` : "[redacted]";
      continue;
    }
    out[k] = v;
  }
  return out;
}
