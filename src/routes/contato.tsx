import { termToast } from "@/lib/term-toast";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion, useReducedMotion } from "framer-motion";
import { z } from "zod";
import { HOME_SPRING, HOME_SPRING_SOFT } from "@/components/home/home-motion";
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
  "mt-2 w-full min-h-12 border border-brand-roxo/25 bg-transparent px-3 py-3 text-sm text-brand-roxo placeholder:text-brand-azul/70 transition-[border-color,box-shadow] duration-200 focus:border-brand-rosa focus:outline-none focus:ring-2 focus:ring-brand-rosa/40";

const labelClass =
  "text-[11px] uppercase tracking-[0.16em] text-brand-roxo/70 transition-colors duration-200 group-focus-within:text-brand-rosa";

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

  const spring = { type: "spring" as const, ...HOME_SPRING };
  const springSoft = { type: "spring" as const, ...HOME_SPRING_SOFT };

  const settleIn = reduce
    ? { opacity: 1, y: 0 }
    : { opacity: 1, y: 0, transition: spring };
  const settleStart = reduce ? { opacity: 1, y: 0 } : { opacity: 0.55, y: 16 };

  const panelEntry = reduce
    ? { opacity: 1, y: 0, scale: 1 }
    : { opacity: 0.6, y: 32, scale: 0.985 };
  const panelSettle = reduce
    ? { opacity: 1, y: 0, scale: 1 }
    : { opacity: 1, y: 0, scale: 1, transition: { ...springSoft, delay: 0.06 } };

  return (
    <div className="overflow-x-clip">
      {/* Hero — assimétrico 60/40 */}
      <section
        aria-labelledby="contato-hero-heading"
        className="px-5 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-12 lg:pb-14 lg:pt-14"
      >
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-12 lg:items-start lg:gap-10">
          <motion.div
            className="min-w-0 lg:col-span-7"
            initial={settleStart}
            animate={settleIn}
          >
            <p className="text-[11px] uppercase tracking-[0.22em] text-brand-rosa sm:text-[12px]">
              Contato
            </p>
            <h1
              id="contato-hero-heading"
              className="mt-5 max-w-[18ch] text-[clamp(1.9rem,1.15rem+3.2vw,3.75rem)] font-light uppercase leading-[1.08] tracking-[-0.03em] text-brand-branco"
            >
              Conte o contexto.
              <br />
              A gente organiza
              <br />
              o próximo passo.
            </h1>
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-brand-azul sm:text-base sm:leading-7">
              Projeto novo, processo manual, sistema que precisa evoluir ou uma ideia ainda sem
              formato.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 sm:gap-4">
              <Link
                to="/estimar"
                className="inline-flex min-h-12 items-center justify-center rounded-button bg-brand-rosa px-6 text-sm font-medium text-brand-roxo transition-[transform,filter] duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa motion-reduce:transform-none"
              >
                Solicitar diagnóstico
              </Link>
              <a
                href={WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-button border border-brand-branco/25 px-6 text-sm font-medium text-brand-branco transition-colors duration-200 hover:border-brand-rosa/60 hover:text-brand-rosa focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa"
              >
                Falar no WhatsApp
              </a>
            </div>
          </motion.div>

          {/* Rail editorial — orientação 01 → 02 */}
          <aside className="relative lg:col-span-5 lg:pt-2" aria-label="Caminhos de contato">
            <motion.div
              className="pointer-events-none absolute bottom-0 left-0 top-0 hidden w-px origin-top bg-brand-branco/30 lg:block"
              aria-hidden
              initial={reduce ? { scaleY: 1 } : { scaleY: 0 }}
              animate={
                reduce
                  ? { scaleY: 1 }
                  : { scaleY: 1, transition: { ...spring, delay: 0.1 } }
              }
              style={{ transformOrigin: "top" }}
            />
            <div className="border-t border-brand-branco/20 lg:border-t-0 lg:pl-10">
              <motion.div
                className="border-b border-brand-branco/20 py-5 first:pt-0 lg:py-6"
                initial={settleStart}
                animate={
                  reduce
                    ? settleIn
                    : { opacity: 1, y: 0, transition: { ...spring, delay: 0.18 } }
                }
              >
                <p className="text-[11px] tracking-[0.18em] text-brand-rosa">01</p>
                <p className="mt-3 text-sm font-light uppercase leading-snug tracking-[-0.01em] text-brand-branco sm:text-[15px]">
                  Tenho contexto suficiente
                </p>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-brand-azul">
                  O diagnóstico organiza problema, restrições e próximo passo.
                </p>
              </motion.div>
              <motion.div
                className="py-5 lg:py-6"
                initial={settleStart}
                animate={
                  reduce
                    ? settleIn
                    : { opacity: 1, y: 0, transition: { ...spring, delay: 0.32 } }
                }
              >
                <p className="text-[11px] tracking-[0.18em] text-brand-azul">02</p>
                <p className="mt-3 text-sm font-light uppercase leading-snug tracking-[-0.01em] text-brand-branco sm:text-[15px]">
                  Quero falar direto
                </p>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-brand-azul">
                  WhatsApp ou formulário também funcionam.
                </p>
              </motion.div>
            </div>
          </aside>
        </div>
      </section>

      {/* Ponte 03 → painel lavanda */}
      <div className="px-5 sm:px-6">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex items-center gap-4">
            <motion.span
              className="shrink-0 text-[11px] uppercase tracking-[0.22em] text-brand-rosa"
              initial={reduce ? { opacity: 1 } : { opacity: 0.45 }}
              whileInView={
                reduce
                  ? { opacity: 1 }
                  : { opacity: 1, transition: { ...spring, delay: 0.02 } }
              }
              viewport={{ once: false, amount: 0.9 }}
            >
              03 · Escrever o contexto
            </motion.span>
            <motion.div
              className="h-px flex-1 origin-left bg-brand-rosa/55"
              aria-hidden
              initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
              whileInView={
                reduce
                  ? { scaleX: 1 }
                  : { scaleX: 1, transition: { ...spring, delay: 0.06 } }
              }
              viewport={{ once: false, amount: 0.9 }}
            />
          </div>
        </div>
      </div>

      {/* Painel lavanda — fase da jornada; footer entra logo depois */}
      <section
        aria-labelledby="contato-form-heading"
        className="px-4 pb-10 pt-4 sm:px-5 sm:pb-12 sm:pt-5 lg:px-6 lg:pb-14"
      >
        <motion.div
          className="relative mx-auto max-w-[1240px] border border-brand-roxo/20 bg-brand-branco text-brand-roxo"
          initial={panelEntry}
          whileInView={panelSettle}
          viewport={{ once: false, amount: 0.22 }}
        >
          <div
            className="absolute inset-y-0 left-0 w-1 bg-brand-rosa sm:w-1.5"
            aria-hidden
          />
          <div className="grid gap-0 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="border-b border-brand-roxo/15 p-6 pl-7 sm:p-8 sm:pl-9 lg:border-b-0 lg:border-r lg:p-9 lg:pl-11 xl:p-10 xl:pl-12">
              <h2
                id="contato-form-heading"
                className="text-[clamp(1.4rem,1rem+1.5vw,2rem)] font-light tracking-[-0.02em] text-brand-roxo"
              >
                Prefere escrever?
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-brand-roxo/75">
                Deixe o contexto essencial e um canal para retorno.
              </p>

              <div className="mt-7">
                {sent ? (
                  <div className="py-2" role="status">
                    <p className="text-lg font-light tracking-[-0.02em] text-brand-roxo">
                      Mensagem recebida.
                    </p>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-brand-roxo/75">
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
                            className="mt-2 h-auto min-h-12 w-full rounded-none border-brand-roxo/25 bg-transparent px-3 py-3 text-sm text-brand-roxo shadow-none focus:border-brand-rosa focus:ring-2 focus:ring-brand-rosa/40 data-[placeholder]:text-brand-azul/70 [&>svg]:text-brand-roxo/60"
                          >
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            className="max-h-[min(18rem,var(--radix-select-content-available-height))] rounded-sm border-brand-roxo/25 bg-brand-branco text-brand-roxo shadow-sm"
                          >
                            {PROJECT_TYPE_OPTIONS.map((opt) => (
                              <SelectItem
                                key={opt.value}
                                value={opt.value}
                                className="rounded-sm text-brand-roxo focus:bg-brand-rosa/15 focus:text-brand-roxo data-[highlighted]:bg-brand-rosa/15 data-[highlighted]:text-brand-roxo"
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
                        rows={5}
                        placeholder="Conte o que está acontecendo hoje e o que você precisa resolver."
                        aria-invalid={errors.message ? true : undefined}
                        aria-describedby={errors.message ? "contato-message-error" : undefined}
                        className={`${inputClass} min-h-28`}
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
                      className="inline-flex min-h-12 items-center justify-center rounded-button bg-brand-rosa px-7 text-sm font-medium text-brand-roxo transition-[transform,filter] duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-roxo disabled:opacity-60 motion-reduce:transform-none"
                    >
                      {submitting ? "Enviando..." : "Enviar mensagem"}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Canais + processo */}
            <aside className="flex flex-col gap-8 p-6 pl-7 sm:p-8 sm:pl-9 lg:p-9 lg:pl-10">
              <div>
                <h3
                  id="contato-canais-heading"
                  className="text-[11px] uppercase tracking-[0.22em] text-brand-rosa"
                >
                  Canais diretos
                </h3>
                <ul className="mt-5 space-y-4">
                  <li>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-brand-azul">Email</p>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="mt-1.5 inline-block break-all text-sm text-brand-roxo/90 underline-offset-4 transition-colors hover:text-brand-rosa hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa"
                    >
                      {EMAIL}
                    </a>
                  </li>
                  <li>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-brand-azul">
                      WhatsApp
                    </p>
                    <a
                      href={WA_HREF}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-block text-sm text-brand-roxo/90 underline-offset-4 transition-colors hover:text-brand-rosa hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa"
                    >
                      {WHATSAPP_LABEL}
                    </a>
                  </li>
                </ul>
              </div>

              <div className="border-t border-brand-roxo/15 pt-7">
                <h3 className="text-[11px] uppercase tracking-[0.22em] text-brand-azul">
                  O que acontece depois
                </h3>
                <ol className="relative mt-5 space-y-4 border-l border-brand-roxo/20 pl-4">
                  <li>
                    <p className="text-[11px] tracking-[0.16em] text-brand-rosa">01</p>
                    <p className="mt-1 text-sm font-light uppercase tracking-[-0.01em] text-brand-roxo">
                      Recebemos o contexto
                    </p>
                  </li>
                  <li>
                    <p className="text-[11px] tracking-[0.16em] text-brand-azul">02</p>
                    <p className="mt-1 text-sm font-light uppercase tracking-[-0.01em] text-brand-roxo">
                      Entendemos o problema
                    </p>
                  </li>
                  <li>
                    <p className="text-[11px] tracking-[0.16em] text-brand-rosa">03</p>
                    <p className="mt-1 text-sm font-light uppercase tracking-[-0.01em] text-brand-roxo">
                      Definimos o próximo passo
                    </p>
                  </li>
                </ol>
              </div>
            </aside>
          </div>
        </motion.div>
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
