import { termToast } from "@/lib/term-toast";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Linkedin, MapPin, Send, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { CodeRainBackground } from "@/components/code-rain-background";
import { submitLead } from "@/lib/leads.functions";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Dreamscraft Code" },
      {
        name: "description",
        content: "Fale com a Dreamscraft Code. Conte sobre seu projeto e receba um orçamento.",
      },
      { property: "og:title", content: "Contato — Dreamscraft Code" },
      {
        property: "og:description",
        content: "Fale com a Dreamscraft Code. Conte sobre seu projeto e receba um orçamento.",
      },
      { property: "og:url", content: "https://dreamscraftcode.com.br/contato" },
    ],
  }),
  component: ContatoPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  type: z.enum(["app", "web", "automacao", "consultoria", "outro"]),
  message: z.string().trim().min(10, "Conte um pouco mais").max(2000),
});

function ContatoPage() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const send = useServerFn(submitLead);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const result = schema.safeParse(data);
    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) errs[issue.path[0] as string] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await send({
        data: {
          email: result.data.email,
          name: result.data.name,
          project_type: result.data.type,
          description: result.data.message,
          estimate_json: result.data.phone ? { phone: result.data.phone } : null,
        },
      });
      setSent(true);
      termToast.success("mensagem enviada");
    } catch {
      termToast.error("falha ao enviar. tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <section className="relative overflow-hidden mx-auto max-w-7xl px-6 pt-20 pb-12">
        <CodeRainBackground seed={8} className="opacity-30" />
        <p className="text-sm text-primary font-medium">Contato</p>
        <h1 className="mt-2 text-5xl sm:text-6xl font-light tracking-[-0.03em] max-w-3xl text-gradient">
          Vamos conversar sobre seu projeto
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          Preencha o formulário ou fale direto com a gente. Respondemos em até 1 dia útil.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3 rounded-3xl border border-border bg-surface/60 p-8 lg:p-10"
        >
          {sent ? (
            <div className="flex flex-col items-center text-center py-16">
              <CheckCircle2 className="h-14 w-14 text-primary" />
              <h2 className="mt-6 text-2xl font-light tracking-[-0.03em]">Mensagem enviada!</h2>
              <p className="mt-3 text-muted-foreground max-w-sm">
                Recebemos sua mensagem. Nossa equipe vai entrar em contato em até 1 dia útil.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <Field label="Nome" name="name" autoComplete="name" error={errors.name} />
              <Field label="Email" name="email" type="email" autoComplete="email" error={errors.email} />
              <Field label="Telefone (opcional)" name="phone" type="tel" autoComplete="tel" error={errors.phone} />

              <div>
                <label className="text-sm font-medium">Tipo de projeto</label>
                <select
                  name="type"
                  autoComplete="off"
                  defaultValue="app"
                  className="mt-2 w-full rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="app">App mobile</option>
                  <option value="web">Sistema web / SaaS</option>
                  <option value="automacao">Automação com IA</option>
                  <option value="consultoria">Consultoria</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Mensagem</label>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Conta um pouco sobre o que você quer construir..."
                  className="mt-2 w-full rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition glow-ring disabled:opacity-60"
              >
                {submitting ? "Enviando..." : "Enviar"} <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </motion.div>

        {/* Canais */}
        <div className="lg:col-span-2 space-y-4">
          <Channel
            icon={Mail}
            title="Email"
            value="contato@dreamscraftcode.com.br"
            href="mailto:contato@dreamscraftcode.com.br"
          />
          <Channel
            icon={MessageCircle}
            title="WhatsApp"
            value="(61) 99174-8651"
            href="https://wa.me/5561991748651"
          />
          <Channel
            icon={Linkedin}
            title="LinkedIn"
            value="@dreamscraftcode"
            href="#"
          />
          <Channel
            icon={MapPin}
            title="Localização"
            value="Brasília/DF 🇧🇷 — atendemos remoto"
            href="#"
          />
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Channel({
  icon: Icon,
  title,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="block rounded-2xl border border-border bg-surface/60 p-6 hover:bg-surface-elevated transition"
    >
      <div className="flex items-start gap-4">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-primary-glow/10 border border-border">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="mt-1 font-medium">{value}</p>
        </div>
      </div>
    </a>
  );
}
