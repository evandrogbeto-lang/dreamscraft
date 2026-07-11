import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";

export const Route = createFileRoute("/stack")({
  head: () => ({
    meta: [
      { title: "Stack Técnica — Dreamscraft Code" },
      {
        name: "description",
        content:
          "As ferramentas que usamos no dia a dia e por quê — React, React Native, Supabase, Claude API, Cloudflare e mais.",
      },
      { property: "og:title", content: "Stack Técnica — Dreamscraft Code" },
      {
        property: "og:description",
        content:
          "As ferramentas que usamos no dia a dia e por quê — React, React Native, Supabase, Claude API, Cloudflare e mais.",
      },
    ],
  }),
  component: StackPage,
});

type Tech = { name: string; why: string; where: string };
type Category = { id: string; label: string; items: Tech[] };

const categories: Category[] = [
  {
    id: "frontend",
    label: "FRONTEND",
    items: [
      {
        name: "React",
        why: "Maturidade, ecossistema absurdo e equipe que já domina. Não inventamos roda para o cliente pagar.",
        where: "Dashboard de operações da Logística X, painel admin do app de delivery.",
      },
      {
        name: "TypeScript",
        why: "Erro pego em build é erro que não chega no cliente. Custo extra de 10% de tempo, benefício de meses.",
        where: "Todos os projetos novos desde 2023.",
      },
      {
        name: "Tailwind CSS",
        why: "Design consistente sem CSS órfão. UI rápida sem virar bagunça de classes.",
        where: "Site institucional da Fintech Y, marketplace B2B.",
      },
      {
        name: "Framer Motion",
        why: "Animações que parecem profissionais sem perder semanas. Performance boa por padrão.",
        where: "Onboarding do app fitness, landing page de SaaS.",
      },
    ],
  },
  {
    id: "mobile",
    label: "MOBILE",
    items: [
      {
        name: "React Native",
        why: "Um time, duas plataformas. Para 90% dos apps, performance nativa não compensa o custo de duas bases.",
        where: "App de delivery em construção, app fitness com 8k downloads.",
      },
      {
        name: "Expo",
        why: "Build, OTA update e deploy nas lojas sem dor. Foco no produto, não na máquina de empacotar.",
        where: "Todos os apps mobile que entregamos.",
      },
    ],
  },
  {
    id: "backend",
    label: "BACKEND",
    items: [
      {
        name: "Node.js",
        why: "Mesma linguagem do front. Onboarding mais rápido e código compartilhado quando faz sentido.",
        where: "APIs do marketplace, integrações de pagamento.",
      },
      {
        name: "Supabase",
        why: "Backend as a service que entrega auth, banco, storage e realtime em horas. Para MVPs, reduz semanas de boilerplate para 1 dia.",
        where: "MVP de SaaS de gestão, app fitness, painel admin.",
      },
      {
        name: "PostgreSQL",
        why: "Banco relacional sério, sem mágica. Quando o produto cresce, ele acompanha.",
        where: "Base de tudo que rodamos em Supabase ou self-hosted.",
      },
    ],
  },
  {
    id: "ia",
    label: "IA / AUTOMAÇÃO",
    items: [
      {
        name: "Claude API (Anthropic)",
        why: "Modelos de raciocínio mais precisos para casos sérios — análise de documentos, agentes, resumo de reuniões.",
        where: "Automação de triagem de currículos, copiloto de atendimento.",
      },
      {
        name: "n8n",
        why: "Automação visual auto-hospedada. Sem lock-in de Zapier e sem custo por execução fora de controle.",
        where: "Integrações de CRM, disparos automáticos, ETL de planilhas.",
      },
      {
        name: "WhatsApp Business API",
        why: "É onde o brasileiro responde. Bot bem feito aqui economiza 1 atendente em meses.",
        where: "Bot de qualificação de leads, notificação de pedidos.",
      },
    ],
  },
  {
    id: "infra",
    label: "INFRA",
    items: [
      {
        name: "Cloudflare",
        why: "Edge global, Workers e DNS no mesmo lugar. Latência baixa sem virar conta de AWS no fim do mês.",
        where: "Site institucional, APIs públicas, deploy desta página.",
      },
      {
        name: "Vercel",
        why: "Deploy de Next/React em 1 push. Ótimo para projetos que vivem de marketing e iteração rápida.",
        where: "Landing pages de produto, blogs corporativos.",
      },
      {
        name: "GitHub Actions",
        why: "CI/CD onde o código já está. Sem mais uma ferramenta para o cliente aprender depois.",
        where: "Build, teste e deploy de todos os projetos ativos.",
      },
    ],
  },
  {
    id: "tools",
    label: "TOOLS",
    items: [
      {
        name: "Figma",
        why: "Padrão da indústria. Cliente, designer e dev olhando o mesmo arquivo, em tempo real.",
        where: "Handoff de design em todo projeto com UI custom.",
      },
      {
        name: "Linear",
        why: "Gestão de issues sem virar Jira. Time enxerga roadmap em segundos.",
        where: "Sprint de todo projeto em andamento.",
      },
    ],
  },
];

function StackPage() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-mono text-primary">
          <Layers className="h-3.5 w-3.5" /> nossa.stack
        </div>
        <h1 className="mt-4 text-5xl sm:text-6xl font-light tracking-[-0.03em] max-w-3xl text-gradient">
          Nossa stack técnica e por que escolhemos cada ferramenta
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          Não somos religiosos de stack. Usamos o que resolve o problema — mas aqui está o que
          resolve a maioria deles e por quê.
        </p>
      </section>

      {/* Categorias */}
      <section className="mx-auto max-w-7xl px-6 pb-24 space-y-16">
        {categories.map((cat) => (
          <div key={cat.id}>
            <p className="text-sm font-mono text-primary">// {cat.id}</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-light tracking-[-0.03em]">{cat.label}</h2>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cat.items.map((tech, i) => (
                <motion.article
                  key={tech.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group rounded-2xl border border-border bg-surface/60 p-6 hover:bg-surface-elevated hover:border-primary/40 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-mono text-2xl font-semibold leading-tight">{tech.name}</h3>
                    <span className="shrink-0 rounded-full border border-border bg-background/60 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      {cat.label}
                    </span>
                  </div>

                  <p className="mt-5 text-sm text-foreground/90">
                    <span className="font-mono text-xs text-primary">// por que usamos</span>
                    <br />
                    {tech.why}
                  </p>

                  <p className="mt-4 text-sm text-muted-foreground">
                    <span className="font-mono text-xs text-primary-glow">// onde</span>
                    <br />
                    {tech.where}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}