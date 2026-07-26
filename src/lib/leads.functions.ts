import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getRequestIP, getRequestHeader } from "@tanstack/react-start/server";

const LeadSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .min(3)
    .max(320),
  name: z.string().trim().max(200).optional().nullable(),
  project_type: z.string().trim().max(100).optional().nullable(),
  timeline: z.string().trim().max(100).optional().nullable(),
  description: z.string().trim().max(5000).optional().nullable(),
  estimate_json: z.record(z.string(), z.unknown()).optional().nullable(),
});

function clientKey(): string {
  const xff = getRequestHeader("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return getRequestIP() ?? "unknown";
}

async function notifyLeadEmail(lead: {
  email: string;
  name: string | null;
  project_type: string | null;
  timeline: string | null;
  description: string | null;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("lead notify: RESEND_API_KEY missing — skipping email");
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const who = lead.name?.trim() || lead.email;
  const lines = [
    `Nome: ${lead.name?.trim() || "—"}`,
    `Email: ${lead.email}`,
    `Tipo: ${lead.project_type?.trim() || "—"}`,
    `Prazo: ${lead.timeline?.trim() || "—"}`,
    "",
    "Descrição:",
    lead.description?.trim() || "—",
  ];

  // Requires dreamscraftcode.com verified on Resend before production send works.
  const { error } = await resend.emails.send({
    from: "Dreamscraft <contato@dreamscraftcode.com>",
    to: ["contato@dreamscraftcode.com"],
    replyTo: lead.email,
    subject: `Novo lead · ${who}`,
    text: lines.join("\n"),
  });

  if (error) {
    console.error("lead notify: resend error", error);
  }
}

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => LeadSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Rate limit: max 5 lead submissions per IP per hour.
    const ip = clientKey();
    const sinceIso = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("bucket", "lead_submit")
      .eq("key", ip)
      .gte("created_at", sinceIso);
    if ((count ?? 0) >= 5) {
      throw new Error("Muitas requisições. Tente novamente em 1h.");
    }
    await supabaseAdmin
      .from("rate_limits")
      .insert({ bucket: "lead_submit", key: ip });

    const row = {
      email: data.email,
      name: data.name ?? null,
      project_type: data.project_type ?? null,
      timeline: data.timeline ?? null,
      description: data.description ?? null,
      estimate_json: (data.estimate_json ?? null) as never,
    };

    const { error } = await supabaseAdmin.from("leads").insert(row);
    if (error) throw new Error("Falha ao salvar lead.");

    // Email must not break the happy path — lead is already persisted.
    try {
      await notifyLeadEmail({
        email: row.email,
        name: row.name,
        project_type: row.project_type,
        timeline: row.timeline,
        description: row.description,
      });
    } catch (err) {
      console.error("lead notify: unexpected", err);
    }

    return { ok: true as const };
  });
