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

const SYSTEM = `Você é um arquiteto de software sênior da Dreamscraft Code, agência brasileira de engenharia digital.
Gere uma estimativa REALISTA de projeto em JSON. Tabela de preços base (BRL):
- Landing/site simples: R$ 4.000–12.000
- App mobile MVP: R$ 25.000–80.000
- Sistema web/SaaS: R$ 35.000–150.000
- Automação/Bot: R$ 8.000–35.000
- Integrações complexas: +R$ 10.000–40.000
Prazos típicos: MVP 6–14 semanas, sistema robusto 12–28 semanas.
Considere urgência (multiplica custo até 1.4x), integrações (aumenta risco), tamanho da empresa (define complexidade de governança).
Stack padrão: React, TypeScript, TanStack Start, Supabase, Tailwind, Lovable AI. Adapte se mobile (React Native/Expo).
Responda SOMENTE com JSON válido, sem markdown.`;

export const estimateProject = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    const { getRequestIP, getRequestHeader } = await import(
      "@tanstack/react-start/server"
    );
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // IP-based rate limit: 6 AI calls per IP per hour. Protects the
    // unauthenticated public endpoint from credit-exhaustion abuse.
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

    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY não configurada");

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

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      if (res.status === 429) throw new Error("Limite de uso atingido. Tente novamente em alguns instantes.");
      if (res.status === 402) throw new Error("Créditos esgotados. Contate o suporte.");
      throw new Error(`Falha na IA: ${res.status} ${txt.slice(0, 200)}`);
    }

    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content) as EstimateResult;
    return parsed;
  });

const LeadSchema = z.object({
  nome: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  telefone: z.string().trim().min(6).max(40),
  contexto: z.string().max(4000).optional(),
});

export const submitEstimateLead = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => LeadSchema.parse(d))
  .handler(async ({ data }) => {
    // Do not log PII (name/email/phone/context). Lead persistence should
    // happen via the `leads` table (RLS-protected) instead of server logs.
    void data;
    return { ok: true };
  });