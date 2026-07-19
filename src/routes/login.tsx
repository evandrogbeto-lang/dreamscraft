import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Dreamscraft Code" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, loading, isAdmin } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Só redireciona quem é admin de verdade — evita loop /login ↔ /admin
  // quando há sessão presa ou conta sem permissão.
  useEffect(() => {
    if (!loading && user && isAdmin) navigate({ to: "/admin" });
  }, [user, loading, isAdmin, navigate]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setError(null);
  }

  const loggedInNotAdmin = !loading && user && !isAdmin;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error: signupError } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (signupError) throw signupError;
      } else {
        const { error: signinError } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        if (signinError) throw signinError;
      }
      navigate({ to: "/admin" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      // Friendly errors
      if (message.includes("Invalid login")) {
        setError("Email ou senha incorretos.");
      } else if (message.includes("already registered") || message.includes("already exists")) {
        setError("Email já cadastrado — use 'Entrar' em vez de criar conta.");
      } else if (message.toLowerCase().includes("password")) {
        setError("Senha inválida — use no mínimo 6 caracteres.");
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-foreground">
          {mode === "signin" ? "Entrar no Painel" : "Criar Conta"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Acesso restrito aos sócios da Dreamscraft Code."
            : "Apenas emails autorizados podem criar conta."}
        </p>

        {loggedInNotAdmin && (
          <div className="mt-4 rounded-md border border-brand-amber/30 bg-brand-amber/10 p-3 text-sm">
            <p className="text-foreground">
              Você está logada como <strong>{user!.email}</strong>, mas esta conta
              ainda não tem acesso de administrador.
            </p>
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-2 font-medium text-primary hover:underline"
            >
              Sair desta conta
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <div>
              <label className="mb-1.5 block text-sm font-medium">Nome</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Seu nome"
              />
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="voce@dreamscraftcode.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Senha</label>
            <input
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? "Enviando..." : mode === "signin" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {mode === "signin" ? (
            <>
              Primeira vez?{" "}
              <button
                onClick={() => { setMode("signup"); setError(null); }}
                className="font-medium text-primary hover:underline"
              >
                Criar conta
              </button>
            </>
          ) : (
            <>
              Já tem conta?{" "}
              <button
                onClick={() => { setMode("signin"); setError(null); }}
                className="font-medium text-primary hover:underline"
              >
                Entrar
              </button>
            </>
          )}
        </div>

        <div className="mt-6 border-t border-border pt-4 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
            ← Voltar ao site
          </Link>
        </div>
      </div>
    </div>
  );
}
