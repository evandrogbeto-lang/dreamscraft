-- Restrict has_role execution to server roles (service_role); revoke from anon/authenticated.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

-- Lock down rate_limits: enable RLS with no policies (deny all via Data API); only service_role via GRANT.
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.rate_limits FROM anon, authenticated, PUBLIC;
GRANT ALL ON public.rate_limits TO service_role;