import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Server-side admin gate. Throws "Forbidden" if the caller is not an admin.
 * Use from a route's `beforeLoad` so unauthenticated/non-admin requests
 * never reach the component.
 */
export const requireAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error) throw new Error("Falha ao verificar permissão");
    if (!data) throw new Error("Forbidden: admin role required");
    return { userId: context.userId, isAdmin: true as const };
  });
