import { termToast } from "@/lib/term-toast";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { submitLead } from "@/lib/leads.functions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BrandPictogram,
  type PictogramName,
} from "@/components/brand-pictogram";
import { CodeRainBackground } from "@/components/code-rain-background";

const partnersFaqs = [
  {
    q: "Tem limite de indicações?",
    a: "Não. Você pode indicar quantos clientes quiser — a gente combina a contrapartida quando a indicação vira projeto.",
  },
  {
    q: "Posso ser parceiro sendo dev freelancer?",
    a: "Sim. Muitos devs nos indicam projetos fora da sua stack ou capacidade de entrega no momento.",
  },
  {
    q: "Como funciona o retorno da indicação?",
    a: "Combinamos por escrito quando a indicação vira contrato. Sem tabela pública por enquanto — cada caso tem contexto.",
  },
];

export const Route = createFileRoute("/parceiros")({
  head: () => ({
    meta: [
      { title: "Programa de Parceiros — Dreamscraft Code" },
      {
        name: "description",
        content:
          "Indique projetos de software e caminhe junto com a Dreamscraft. Para agências, designers, consultores e freelancers.",
      },
      { property: "og:title", content: "Programa de Parceiros — Dreamscraft Code" },
      {
        property: "og:description",
        content:
          "Indique projetos de software e caminhe junto com a Dreamscraft. Para agências, designers, consultores e freelancers.",
      },
      { property: "og:url", content: "https://dreamscraftcode.com/parceiros" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: partnersFaqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: ParceirosPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  linkedin: z.string().trim().max(255).optional().or(z.literal("")),
  type: z.enum(["agencia", "designer", "consultor", "freelancer", "outro"]),
  audience: z.string().trim().min(10, "Conte um pouco mais").max(1000),
});

const steps: { icon: PictogramName; title: string; desc: string }[] = [
  {
    icon: "usuario",
    title: "Cadastre-se como parceiro",
    desc: "Formulário rápido. Sem burocracia, sem reunião obrigatória.",
  },
  {
    icon: "link",
    title: "Indique um cliente",
    desc: "Envie quem tem uma necessidade real de software — app, sistema, automação.",
  },
  {
    icon: "moeda",
    title: "Combinamos o retorno",
    desc: "Se a indicação virar projeto, alinhamos a contrapartida por escrito — sem tabela pública por enquanto.",
  },
];

const profiles: { title: string; desc: string }[] = [
  {
    title: "Agência de marketing digital",
    desc: "Seu cliente precisa de landing page, sistema interno ou app — você não precisa virar dev.",
  },
  {
    title: "Designer UX/UI",
    desc: "Você tem o design pronto. A gente codifica com qualidade e respeita seu trabalho.",
  },
  {
    title: "Consultor de negócios",
    desc: "Cliente precisa automatizar processo, integrar sistema ou digitalizar operação.",
  },
  {
    title: "Desenvolvedor freelancer",
    desc: "Projeto fora da sua especialidade? Indica pra gente e participa do resultado.",
  },
];

const faqs = partnersFaqs;

function ParceirosPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = useServerFn(submitLead);

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
      const { name, email, linkedin, type, audience } = result.data;
      await submit({
        data: {
          name,
          email,
          project_type: `parceiro:${type}`,
          description: [
            audience,
            linkedin ? `LinkedIn: ${linkedin}` : null,
          ]
            .filter(Boolean)
            .join("\n\n"),
        },
      });
      setSent(true);
      termToast.success("candidatura recebida");
    } catch (err) {
      termToast.error(err instanceof Error ? err.message : "falha ao enviar — tente de novo");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden mx-auto max-w-7xl px-6 pt-20 pb-16">
        <CodeRainBackground seed={12} palette="rosa" className="opacity-30" />
        <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-rosa/40 bg-brand-rosa/10 px-3 py-1 text-xs font-mono text-brand-rosa">
          // programa.parceiros
        </div>
        <h1 className="mt-4 text-5xl sm:text-6xl font-light tracking-[-0.03em] max-w-3xl text-gradient">
          Indique projetos, caminhe junto
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          Para agências, designers e consultores que querem agregar valor aos seus clientes sem
          precisar desenvolver.
        </p>
        </div>
      </section>

      {/* Como funciona */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <p className="text-sm font-mono text-brand-rosa">// como.funciona</p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-light tracking-[-0.03em]">3 passos simples</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-3xl border border-border bg-surface/60 p-8"
            >
              <div className="absolute -top-4 left-8 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow font-mono text-sm font-bold text-primary-foreground">
                {i + 1}
              </div>
              <BrandPictogram name={s.icon} color="rosa" size={32} />
              <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Perfis */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <p className="text-sm font-mono text-brand-rosa">// perfil.ideal</p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-light tracking-[-0.03em]">Pra quem é esse programa</h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {profiles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-border bg-surface/60 p-6 hover:bg-surface-elevated hover:border-brand-rosa/30 transition"
            >
              <span className="font-mono text-xs text-brand-rosa">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Formulário */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <p className="text-sm font-mono text-brand-rosa">// cadastro.parceiro</p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-light tracking-[-0.03em]">Quero ser parceiro</h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 rounded-3xl border border-border bg-surface/60 p-8 lg:p-10"
        >
          {sent ? (
            <div className="flex flex-col items-center text-center py-12">
              <CheckCircle2 className="h-14 w-14 text-primary" />
              <h3 className="mt-6 text-2xl font-bold">Cadastro recebido!</h3>
              <p className="mt-3 text-muted-foreground max-w-sm">
                Recebemos seu cadastro. Respondemos por email em até 1 dia útil.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <Field label="Nome" name="name" error={errors.name} />
              <Field label="Email" name="email" type="email" error={errors.email} />
              <Field label="LinkedIn (opcional)" name="linkedin" error={errors.linkedin} />

              <div>
                <label className="text-sm font-medium">Tipo de parceiro</label>
                <select
                  name="type"
                  defaultValue="agencia"
                  className="mt-2 w-full rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="agencia">Agência de marketing</option>
                  <option value="designer">Designer UX/UI</option>
                  <option value="consultor">Consultor de negócios</option>
                  <option value="freelancer">Dev freelancer</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Que tipo de clientes você atende</label>
                <textarea
                  name="audience"
                  rows={4}
                  placeholder="Ex: pequenas indústrias, e-commerces, clínicas, startups B2B..."
                  className="mt-2 w-full rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.audience && (
                  <p className="mt-1 text-xs text-destructive">{errors.audience}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition glow-ring disabled:opacity-50"
              >
                {submitting ? "Enviando…" : "Enviar cadastro"} <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <p className="text-sm font-mono text-brand-rosa">// faq</p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-light tracking-[-0.03em]">Perguntas frequentes</h2>

        <Accordion type="single" collapsible className="mt-8">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        name={name}
        type={type}
        className="mt-2 w-full rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}