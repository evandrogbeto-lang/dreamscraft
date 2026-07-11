-- has_role is used inside RLS policies (e.g. user_roles, leads) — authenticated
-- role needs EXECUTE for those policies to evaluate. Keep anon revoked.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;