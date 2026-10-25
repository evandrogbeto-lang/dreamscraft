import { termToast } from "@/lib/term-toast";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion, useReducedMotion } from "framer-motion";
import { z } from "zod";
import { whatsappHref } from "@/lib/contact";
import { submitLead } from "@/lib/leads.functions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Dreamscraft Code" },
      {
        name: "description",
        content:
          "Fale com a Dreamscraft Code sobre seu projeto, operação ou ideia e compartilhe o contexto para definirmos o próximo passo.",
      },
      { property: "og:title", content: "Contato — Dreamscraft Code" },
      {
        property: "og:description",
        content:
          "Fale com a Dreamscraft Code sobre seu projeto, operação ou ideia e compartilhe o contexto para definirmos o próximo passo.",
      },
      { property: "og:url", content: "https://dreamscraftcode.com/contato" },
    ],
  }),
  component: ContatoPage,
});

const PROJECT_TYPES = [
  "landing",
  "app",
  "web",
  "automacao",
  "consultoria",
  "outro",
] as const;

type ProjectType = (typeof PROJECT_TYPES)[number];

const PROJECT_TYPE_OPTIONS: { value: ProjectType; label: string }[] = [
  { value: "landing", label: "Landing page / site institucional" },
  { value: "app", label: "App mobile" },
  { value: "web", label: "Sistema web / SaaS" },
  { value: "automacao", label: "Automação com IA" },
  { value: "consultoria", label: "Consultoria" },
  { value: "outro", label: "Outro" },
];

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  type: z.enum(PROJECT_TYPES, { errorMap: () => ({ message: "Selecione o tipo" }) }),
  message: z.string().trim().min(10, "Conte um pouco mais").max(2000),
});

const WHATSAPP_LABEL = "+55 61 99174-8651";
const EMAIL = "contato@dreamscraftcode.com";
const WA_HREF = whatsappHref(
  "Olá, Dreamscraft. Quero falar sobre um projeto / operação / ideia.",
);

const inputClass =
  "mt-2 w-full min-h-12 border border-brand-branco/20 bg-surface px-3 py-3 text-sm text-brand-branco placeholder:text-brand-azul/80 transition-[border-color,box-shadow] duration-200 focus:border-brand-rosa focus:outline-none focus:ring-2 focus:ring-brand-rosa/40";

const labelClass =
  "text-[11px] uppercase tracking-[0.16em] text-brand-azul transition-colors duration-200 group-focus-within:text-brand-rosa";

const channelLinkClass =
  "inline-flex min-h-11 items-center text-base text-brand-branco underline-offset-4 transition-colors duration-200 hover:text-brand-rosa hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa";

function ContatoPage() {
  const reduce = useReducedMotion();
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [projectType, setProjectType] = useState<ProjectType>("landing");
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
    <div className="overflow-x-clip">
      <section
        aria-labelledby="contato-heading"
        className="px-5 pb-16 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pb-20 lg:pt-12"
      >
        <div className="mx-auto max-w-[1080px]">
          <h1
            id="contato-heading"
            className="text-[13px] uppercase tracking-[0.22em] text-brand-rosa"
          >
            Contato
          </h1>
          <p className="mt-3 max-w-[34ch] text-lg font-light leading-snug text-brand-branco sm:text-xl">
            Conte o contexto. A gente organiza o próximo passo.
          </p>

          <div className="mt-8 grid items-start gap-12 lg:mt-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(16rem,0.62fr)] lg:gap-16">
            <motion.div
              className="min-w-0"
              initial={reduce ? false : { opacity: 0.92, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.28, ease: "easeOut" }}
            >
              <h2
                id="contato-form-heading"
                className="text-lg font-light tracking-[-0.02em] text-brand-branco"
              >
                Prefere escrever?
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-brand-azul">
                Deixe o contexto essencial e um canal para retorno.
              </p>

              <div className="mt-6">
                {sent ? (
                  <div className="py-2" role="status">
                    <p className="text-lg font-light tracking-[-0.02em] text-brand-branco">
                      Mensagem recebida.
                    </p>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-brand-azul">
                      Recebemos sua mensagem e entraremos em contato pelo canal informado.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="space-y-4" noValidate>
                    <input type="hidden" name="type" value={projectType} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        id="contato-name"
                        label="Nome"
                        name="name"
                        autoComplete="name"
                        error={errors.name}
                      />
                      <Field
                        id="contato-email"
                        label="Email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        error={errors.email}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        id="contato-phone"
                        label="Telefone (opcional)"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        error={errors.phone}
                      />
                      <div className="group">
                        <label htmlFor="contato-type" className={labelClass}>
                          Tipo de projeto
                        </label>
                        <Select
                          value={projectType}
                          onValueChange={(value) => {
                            setProjectType(value as ProjectType);
                            setErrors((prev) => {
                              if (!prev.type) return prev;
                              const next = { ...prev };
                              delete next.type;
                              return next;
                            });
                          }}
                        >
                          <SelectTrigger
                            id="contato-type"
                            aria-invalid={errors.type ? true : undefined}
                            aria-describedby={errors.type ? "contato-type-error" : undefined}
                            className="mt-2 h-auto min-h-12 w-full rounded-none border-brand-branco/20 bg-surface px-3 py-3 text-sm text-brand-branco shadow-none focus:border-brand-rosa focus:ring-2 focus:ring-brand-rosa/40 data-[placeholder]:text-brand-azul/80 [&>svg]:text-brand-azul"
                          >
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            className="max-h-[min(18rem,var(--radix-select-content-available-height))] rounded-sm border-brand-branco/20 bg-surface-elevated text-brand-branco shadow-none"
                          >
                            {PROJECT_TYPE_OPTIONS.map((opt) => (
                              <SelectItem
                                key={opt.value}
                                value={opt.value}
                                className="rounded-sm text-brand-branco focus:bg-brand-rosa/15 focus:text-brand-branco data-[highlighted]:bg-brand-rosa/15 data-[highlighted]:text-brand-branco"
                              >
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.type && (
                          <p
                            id="contato-type-error"
                            role="alert"
                            className="mt-1 text-xs text-brand-rosa"
                          >
                            {errors.type}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="group">
                      <label htmlFor="contato-message" className={labelClass}>
                        Mensagem
                      </label>
                      <textarea
                        id="contato-message"
                        name="message"
                        rows={4}
                        placeholder="Conte o que está acontecendo hoje e o que você precisa resolver."
                        aria-invalid={errors.message ? true : undefined}
                        aria-describedby={errors.message ? "contato-message-error" : undefined}
                        className={`${inputClass} min-h-24`}
                      />
                      {errors.message && (
                        <p
                          id="contato-message-error"
                          role="alert"
                          className="mt-1 text-xs text-brand-rosa"
                        >
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex min-h-12 items-center justify-center rounded-button bg-brand-rosa px-7 text-sm font-medium text-brand-roxo transition-[filter] duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa disabled:opacity-60"
                    >
                      {submitting ? "Enviando..." : "Enviar mensagem"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

            <aside aria-label="Canais diretos" className="min-w-0 lg:pt-1">
              <div className="border-t border-brand-branco/15 pt-6 lg:border-t-0 lg:pt-0">
                <h2
                  id="contato-canais-heading"
                  className="text-[11px] uppercase tracking-[0.18em] text-brand-azul"
                >
                  Prefere falar agora?
                </h2>
                <a
                  href={WA_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${channelLinkClass} mt-3`}
                >
                  WhatsApp
                </a>
                <p className="text-sm text-brand-azul">{WHATSAPP_LABEL}</p>
              </div>

              <div className="mt-8 border-t border-brand-branco/15 pt-6">
                <h2 className="text-[11px] uppercase tracking-[0.18em] text-brand-azul">E-mail</h2>
                <a href={`mailto:${EMAIL}`} className={`${channelLinkClass} mt-3 break-all`}>
                  {EMAIL}
                </a>
              </div>

              <div className="mt-8 border-t border-brand-branco/15 pt-6">
                <p className="text-sm leading-relaxed text-brand-azul">
                  Se o contexto já está claro, o diagnóstico organiza problema, restrições e próximo
                  passo.
                </p>
                <Link
                  to="/estimar"
                  className="mt-2 inline-flex min-h-11 items-center text-sm text-brand-branco underline-offset-4 transition-colors hover:text-brand-rosa hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa"
                >
                  Solicitar diagnóstico
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  id,
  label,
  name,
  type = "text",
  autoComplete,
  error,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  error?: string;
}) {
  const errorId = `${id}-error`;
  return (
    <div className="group">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={inputClass}
      />
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-xs text-brand-rosa">
          {error}
        </p>
      )}
    </div>
  );
}
