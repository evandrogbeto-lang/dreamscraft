import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Smartphone, Globe, Bot, Wrench, Check, ArrowRight, Package, Repeat, ChevronDown } from "lucide-react";
import { useState } from "react";
import { RoiCalculator } from "@/components/roi-calculator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CodeRainBackground } from "@/components/code-rain-background";

const solucoesFaqs = [
  {
    q: "Vocês usam IA para escrever código?",
    a: "Sim, usamos IA como assistente — como qualquer engenheiro moderno. Mas todo código é revisado, testado e entendido pelo nosso time. IA não substitui arquitetura, ela acelera execução.",
  },
  {
    q: "E se eu quiser trocar de empresa depois?",
    a: "Todo código entregue é 100% seu. Documentamos tudo, o repositório fica na sua conta, e fazemos handoff técnico completo. Não criamos dependência.",
  },
  {
    q: "Vocês atendem fora de Brasília?",
    a: "Somos de Brasília mas atendemos 100% remoto em todo o Brasil. Reuniões por videochamada, entregas pelo GitHub, comunicação pelo WhatsApp ou Slack.",
  },
  {
    q: "Quanto tempo leva para começar meu projeto?",
    a: "Após a proposta aprovada, em geral iniciamos em 1-2 semanas. Projetos urgentes podem começar em 3-5 dias úteis mediante disponibilidade.",
  },
  {
    q: "Vocês fazem manutenção depois do lançamento?",
    a: "Sim. Temos planos de manutenção mensal desde R$800/mês. Nenhum sistema é lançado e abandonado.",
  },
];

export const Route = createFileRoute("/solucoes")({
  head: () => ({
    meta: [
      { title: "Soluções — Dreamscraft Code" },
      {
        name: "description",
        content:
          "Apps mobile, sistemas web e SaaS, automação com IA e consultoria. Conheça cada serviço da Dreamscraft Code.",
      },
      { property: "og:title", content: "Soluções — Dreamscraft Code" },
      {
        property: "og:description",
        content:
          "Apps mobile, sistemas web e SaaS, automação com IA e consultoria. Conheça cada serviço da Dreamscraft Code.",
      },
      { property: "og:url", content: "https://dreamscraftcode.com/solucoes" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: solucoesFaqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: SolucoesPage,
});

const services = [
  {
    icon: Smartphone,
    tag: "Mobile",
    title: "Apps mobile (iOS + Android)",
    para: "Para empresas que querem ampliar alcance e estar no bolso do cliente.",
    delivers: ["Design UI/UX", "Desenvolvimento nativo ou híbrido", "Publicação nas lojas", "Manutenção e updates"],
    examples: ["App de fretes", "Apps de delivery", "Programas de fidelidade"],
  },
  {
    icon: Globe,
    tag: "Web",
    title: "Sistemas web e SaaS",
    para: "Para empresas que querem digitalizar processos e escalar operações.",
    delivers: ["Sistema completo end-to-end", "Painel administrativo", "Integrações com APIs", "Hospedagem e CI/CD"],
    examples: ["ERP customizado", "Dashboards analíticos", "Gestão de pedidos"],
  },
  {
    icon: Bot,
    tag: "IA",
    title: "Automação com IA e bots",
    para: "Para empresas com muito atendimento manual e processos repetitivos.",
    delivers: ["Chatbots inteligentes", "Automação de processos", "Integração com modelos de IA", "Treinamento da equipe"],
    examples: ["Bot WhatsApp", "Automação de email", "Agentes IA personalizados"],
  },
  {
    icon: Wrench,
    tag: "Consultoria",
    title: "Consultoria e integração",
    para: "Para empresas com sistemas legados que precisam conversar entre si.",
    delivers: ["Análise técnica", "Recomendação de stack", "Integração entre sistemas", "Migração de dados"],
    examples: ["E-commerce ↔ ERP", "Migração para a nuvem", "Refatoração de código legado"],
  },
];

function SolucoesPage() {
  return (
    <div>
      <section className="relative overflow-hidden mx-auto max-w-7xl px-6 pt-20 pb-12">
        <CodeRainBackground seed={5} className="opacity-30" />
        <p className="text-sm text-primary font-medium">Soluções</p>
        <h1 className="mt-2 text-5xl sm:text-6xl font-light tracking-[-0.03em] max-w-3xl text-gradient">
          Tecnologia que se adapta ao seu negócio
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          Cada empresa é única. Por isso, montamos a solução certa pra cada momento —
          do MVP enxuto ao sistema corporativo completo.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 space-y-6">
        {services.map((s, i) => (
          <motion.article
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-3xl p-8 lg:p-12 grid lg:grid-cols-12 gap-8"
          >
            <div className="lg:col-span-4">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                <s.icon className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <p className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">
                0{i + 1} · {s.tag}
              </p>
              <h2 className="mt-2 text-3xl font-light tracking-[-0.03em]">{s.title}</h2>
              <p className="mt-4 text-muted-foreground">{s.para}</p>
            </div>

            <div className="lg:col-span-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                O que entregamos
              </h3>
              <ul className="mt-4 space-y-3">
                {s.delivers.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Exemplos
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {s.examples.map((e) => (
                  <span
                    key={e}
                    className="rounded-full border border-border bg-background/50 px-3 py-1.5 text-xs"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </section>

      <RoiCalculator />

      <ComoTrabalhamos />

      <FaqSection />

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="glass-card rounded-3xl p-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-light tracking-[-0.03em]">Não sabe qual serviço escolher?</h2>
          <p className="mt-3 text-muted-foreground">A gente conversa, entende o problema e indica o caminho.</p>
          <Link
            to="/contato"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition glow-ring"
          >
            Falar com a equipe <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

const modelos = [
  {
    icon: Package,
    tag: "Modelo A",
    title: "Projeto fechado",
    bullets: [
      "Escopo definido, prazo fixo, preço fixo",
      "Ideal para: MVP, produto novo, funcionalidade específica",
      "Você sabe exatamente o que vai pagar",
    ],
    bestWhen: "você tem uma ideia clara do que quer",
  },
  {
    icon: Repeat,
    tag: "Modelo B",
    title: "Retainer mensal",
    bullets: [
      "Horas mensais dedicadas, prioridade garantida",
      "Escopo flexível mês a mês",
      "Evolução contínua do produto",
    ],
    bestWhen: "você tem produto no ar e quer evoluir rápido",
  },
];

const diagnostico = [
  {
    q: "Você já sabe exatamente o que quer construir?",
    a: "Sim, é uma lista clara → Projeto fechado. Ainda estou descobrindo → Retainer mensal.",
  },
  {
    q: "Seu produto já está no ar com usuários?",
    a: "Sim, e precisa evoluir continuamente → Retainer mensal. Ainda não existe → Projeto fechado para o MVP.",
  },
  {
    q: "Você prefere previsibilidade total ou flexibilidade?",
    a: "Previsibilidade de custo e prazo → Projeto fechado. Flexibilidade para pivotar → Retainer mensal.",
  },
];

function ComoTrabalhamos() {
  const [open, setOpen] = useState(false);
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <div className="mb-10 text-center">
        <p className="text-sm text-primary font-medium font-mono uppercase tracking-wider">// modelos</p>
        <h2 className="mt-2 text-4xl sm:text-5xl font-light tracking-[-0.03em] text-gradient">Como trabalhamos</h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Dois modelos de engajamento. Escolha o que faz sentido pro momento do seu produto.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {modelos.map((m, i) => (
          <motion.article
            key={m.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card rounded-3xl p-8 lg:p-10 flex flex-col"
          >
            <div className="flex items-center gap-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                <m.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
                {m.tag}
              </span>
            </div>
            <h3 className="mt-5 text-2xl font-bold">{m.title}</h3>
            <ul className="mt-5 space-y-3 flex-1">
              {m.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-5 border-t border-border/60 text-sm">
              <span className="text-primary-glow font-mono mr-2">→</span>
              <span className="text-muted-foreground">Melhor quando: </span>
              <span className="font-medium">{m.bestWhen}</span>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-8 glass-card rounded-2xl overflow-hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-background/40 transition"
          aria-expanded={open}
        >
          <span className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 border border-primary/30 text-primary font-mono text-sm">
              ?
            </span>
            <span className="font-semibold">Qual é melhor para mim?</span>
          </span>
          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="diag"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-border/60"
            >
              <ol className="px-6 py-6 space-y-5">
                {diagnostico.map((d, i) => (
                  <motion.li
                    key={d.q}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-4"
                  >
                    <span className="font-mono text-xs text-primary-glow shrink-0 mt-1">
                      0{i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{d.q}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{d.a}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function FaqSection() {
  const faqs = solucoesFaqs;
  return (
    <section className="mx-auto max-w-3xl px-6 pb-20">
      <div className="mb-10 text-center">
        <p className="text-sm text-primary font-medium font-mono uppercase tracking-wider">// faq</p>
        <h2 className="mt-2 text-4xl sm:text-5xl font-light tracking-[-0.03em] text-gradient">Perguntas frequentes</h2>
        <p className="mt-4 text-muted-foreground">As dúvidas que mais escutamos antes do "vamos começar".</p>
      </div>

      <div className="glass-card rounded-3xl p-2 sm:p-4">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`item-${i}`}
              className="border-b border-border/60 last:border-0 px-4"
            >
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline py-5">
                <span className="flex items-start gap-3">
                  <span className="font-mono text-xs text-primary-glow mt-1 shrink-0">
                    0{i + 1}
                  </span>
                  {f.q}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pl-8 pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
