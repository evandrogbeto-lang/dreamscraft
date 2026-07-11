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

    const { error } = await supabaseAdmin.from("leads").insert({
      email: data.email,
      name: data.name ?? null,
      project_type: data.project_type ?? null,
      timeline: data.timeline ?? null,
      description: data.description ?? null,
      estimate_json: (data.estimate_json ?? null) as never,
    });
    if (error) throw new Error("Falha ao salvar lead.");
    return { ok: true as const };
  });
