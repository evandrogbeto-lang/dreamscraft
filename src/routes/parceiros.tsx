import { termToast } from "@/lib/term-toast";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Handshake,
  UserPlus,
  Send,
  Coins,
  Megaphone,
  Palette,
  Briefcase,
  Code2,
  CheckCircle2,
} from "lucide-react";
import { z } from "zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const partnersFaqs = [
  {
    q: "Tem limite de indicações?",
    a: "Não. Você pode indicar quantos clientes quiser — quanto mais virarem projeto, mais você ganha.",
  },
  {
    q: "Posso ser parceiro sendo dev freelancer?",
    a: "Sim. Muitos devs nos indicam projetos fora da sua stack ou capacidade de entrega no momento.",
  },
  {
    q: "Quanto tempo até receber?",
    a: "30 dias após a assinatura do contrato do cliente. Pagamento via Pix ou transferência, com nota fiscal.",
  },
];

export const Route = createFileRoute("/parceiros")({
  head: () => ({
    meta: [
      { title: "Programa de Parceiros — Dreamscraft Code" },
      {
        name: "description",
        content:
          "Indique projetos de software e ganhe até 10% de comissão. Para agências, designers, consultores e devs freelancers.",
      },
      { property: "og:title", content: "Programa de Parceiros — Dreamscraft Code" },
      {
        property: "og:description",
        content:
          "Indique projetos de software e ganhe até 10% de comissão. Para agências, designers, consultores e devs freelancers.",
      },
      { property: "og:url", content: "https://dreamscraftcode.com.br/parceiros" },
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

const steps = [
  {
    icon: UserPlus,
    title: "Cadastre-se como parceiro",
    desc: "Formulário rápido. Sem burocracia, sem reunião obrigatória.",
  },
  {
    icon: Send,
    title: "Indique um cliente",
    desc: "Envie quem tem uma necessidade real de software — app, sistema, automação.",
  },
  {
    icon: Coins,
    title: "Receba sua comissão",
    desc: "Se virar projeto, você recebe 10% do valor inicial em até 30 dias.",
  },
];

const profiles = [
  {
    icon: Megaphone,
    title: "Agência de marketing digital",
    desc: "Seu cliente precisa de landing page, sistema interno ou app — você não precisa virar dev.",
  },
  {
    icon: Palette,
    title: "Designer UX/UI",
    desc: "Você tem o design pronto. A gente codifica com qualidade e respeita seu trabalho.",
  },
  {
    icon: Briefcase,
    title: "Consultor de negócios",
    desc: "Cliente precisa automatizar processo, integrar sistema ou digitalizar operação.",
  },
  {
    icon: Code2,
    title: "Desenvolvedor freelancer",
    desc: "Projeto fora da sua especialidade? Indica pra gente e participa do resultado.",
  },
];

const faqs = partnersFaqs;

function ParceirosPage() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
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
    setSent(true);
    termToast.success("candidatura recebida");
  }

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-mono text-primary">
          <Handshake className="h-3.5 w-3.5" /> programa.parceiros
        </div>
        <h1 className="mt-4 text-5xl sm:text-6xl font-light tracking-[-0.03em] max-w-3xl text-gradient">
          Indique projetos, ganhe comissão
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          Para agências, designers e consultores que querem agregar valor aos seus clientes sem
          precisar desenvolver.
        </p>
      </section>

      {/* Como funciona */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <p className="text-sm font-mono text-primary">// como.funciona</p>
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
              <s.icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Perfis */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <p className="text-sm font-mono text-primary">// perfil.ideal</p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-light tracking-[-0.03em]">Pra quem é esse programa</h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {profiles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-border bg-surface/60 p-6 hover:bg-surface-elevated transition"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-primary-glow/10 border border-border">
                <p.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Parcerias técnicas */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <p className="text-sm font-mono text-primary">// parcerias.tecnicas</p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-light tracking-[-0.03em]">Quem caminha com a gente</h2>
        <div className="mt-8 rounded-2xl border border-border bg-surface/60 p-6 max-w-2xl">
          <p className="text-sm text-foreground/90">
            <span className="font-mono text-primary">Dataloga</span> — colaboração pontual em cibersegurança
            (revisão de arquitetura, pentest e hardening) quando o projeto do cliente exige.
          </p>
          <p className="mt-3 text-xs text-muted-foreground font-mono">
            // sem contratos exclusivos. sem revenda. só engenharia séria quando faz sentido.
          </p>
        </div>
      </section>


      {/* Tabela comissão */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <p className="text-sm font-mono text-primary">// tabela.comissoes</p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-light tracking-[-0.03em]">Quanto você ganha</h2>

        <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-surface/60">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface-elevated/60">
              <tr className="text-left">
                <th className="px-6 py-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Faixa do projeto
                </th>
                <th className="px-6 py-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Comissão
                </th>
                <th className="px-6 py-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Mínimo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-6 py-5 font-medium">Projetos até R$20k</td>
                <td className="px-6 py-5 text-primary font-mono">10%</td>
                <td className="px-6 py-5 font-mono">R$2.000</td>
              </tr>
              <tr>
                <td className="px-6 py-5 font-medium">Projetos acima de R$20k</td>
                <td className="px-6 py-5 text-primary font-mono">8%</td>
                <td className="px-6 py-5 text-muted-foreground font-mono">—</td>
              </tr>
            </tbody>
          </table>
          <div className="border-t border-border px-6 py-4 text-xs text-muted-foreground font-mono">
            pagamento: 30 dias após início do projeto · pix ou transferência · com nota fiscal
          </div>
        </div>
      </section>

      {/* Formulário */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <p className="text-sm font-mono text-primary">// cadastro.parceiro</p>
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
                Vamos te enviar o kit do parceiro por email em até 1 dia útil.
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
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition glow-ring"
              >
                Enviar cadastro <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <p className="text-sm font-mono text-primary">// faq</p>
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