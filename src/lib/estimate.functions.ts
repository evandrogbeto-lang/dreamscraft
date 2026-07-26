import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  description: z.string().min(10).max(4000),
  projectType: z.string().min(1).max(50),
  hasDesign: z.string().max(50),
  timeline: z.string().max(50),
  companySize: z.string().max(50),
  hasIntegration: z.string().max(50),
});

export type EstimateResult = {
  complexidade: "Baixa" | "Média" | "Alta";
  stack: { tech: string; reason: string }[];
  prazo: { min: number; max: number; unit: string };
  investimento: { min: number; max: number };
  riscos: string[];
  resumo: string;
};

/** User-facing only — never leak status codes or provider payloads to the client. */
const FRIENDLY_ESTIMATE_ERROR =
  "Não conseguimos gerar a estimativa agora. Você pode tentar de novo em instantes ou falar com a gente pelo contato.";

const SYSTEM = `Você é um arquiteto de software sênior da Dreamscraft Code, agência brasileira de engenharia digital.
Gere uma estimativa REALISTA de projeto em JSON. Tabela de preços base (BRL):
- Landing/site simples: R$ 4.000–12.000
- App mobile MVP: R$ 25.000–80.000
- Sistema web/SaaS: R$ 35.000–150.000
- Automação/Bot: R$ 8.000–35.000
- Integrações complexas: +R$ 10.000–40.000
Prazos típicos: MVP 6–14 semanas, sistema robusto 12–28 semanas.
Considere urgência (multiplica custo até 1.4x), integrações (aumenta risco), tamanho da empresa (define complexidade de governança).
Stack padrão: React, TypeScript, TanStack Start, Supabase, Tailwind, Cloudflare. Adapte se mobile (React Native/Expo).
Responda SOMENTE com JSON válido, sem markdown.`;

export const estimateProject = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    const { getRequestIP, getRequestHeader } = await import(
      "@tanstack/react-start/server"
    );
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // IP-based rate limit: 6 AI calls per IP per hour.
    const xff = getRequestHeader("x-forwarded-for");
    const ip = (xff?.split(",")[0]?.trim()) || getRequestIP() || "unknown";
    const sinceIso = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("bucket", "ai_estimate")
      .eq("key", ip)
      .gte("created_at", sinceIso);
    if ((count ?? 0) >= 6) {
      throw new Error("Limite de uso atingido. Tente novamente em 1h.");
    }
    await supabaseAdmin
      .from("rate_limits")
      .insert({ bucket: "ai_estimate", key: ip });

    const key = process.env.OPENROUTER_API_KEY;
    // Secretária.Code / n8n — Gemini Flash 2.5 on OpenRouter (override via OPENROUTER_MODEL).
    const model = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";
    if (!key) {
      console.error("estimate: OPENROUTER_API_KEY missing");
      throw new Error(FRIENDLY_ESTIMATE_ERROR);
    }

    const userPrompt = `Projeto:
- Descrição: ${data.description}
- Tipo: ${data.projectType}
- Design: ${data.hasDesign}
- Prazo desejado: ${data.timeline}
- Empresa: ${data.companySize}
- Integração com sistema existente: ${data.hasIntegration}

Responda em JSON com esta estrutura exata:
{
  "complexidade": "Baixa" | "Média" | "Alta",
  "stack": [{"tech": "string", "reason": "string curta"}],
  "prazo": {"min": number, "max": number, "unit": "semanas"},
  "investimento": {"min": number, "max": number},
  "riscos": ["string", "string", "string"],
  "resumo": "2 frases sobre o projeto"
}
Stack deve ter 4-5 itens. Investimento em BRL.`;

    let res: Response;
    try {
      res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://dreamscraftcode.com",
          "X-Title": "Dreamscraft Estimate",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
        }),
      });
    } catch (err) {
      console.error("estimate: openrouter network error", err);
      throw new Error(FRIENDLY_ESTIMATE_ERROR);
    }

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      console.error("estimate: openrouter HTTP", res.status, txt.slice(0, 300));
      if (res.status === 429) {
        throw new Error("Limite de uso atingido. Tente novamente em alguns instantes.");
      }
      throw new Error(FRIENDLY_ESTIMATE_ERROR);
    }

    try {
      const json = await res.json();
      const content = json?.choices?.[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(content) as EstimateResult;
      return parsed;
    } catch (err) {
      console.error("estimate: parse error", err);
      throw new Error(FRIENDLY_ESTIMATE_ERROR);
    }
  });
