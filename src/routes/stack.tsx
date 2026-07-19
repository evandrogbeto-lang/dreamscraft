import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BrandPictogram } from "@/components/brand-pictogram";
import { CodeRainBackground } from "@/components/code-rain-background";

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
type Category = {
  id: string;
  label: string;
  accent: "azul" | "rosa" | "amarelo";
  items: Tech[];
};

/** "where" só cita o que a Dreamscraft de fato opera: este site e produtos próprios. */
const categories: Category[] = [
  {
    id: "frontend",
    label: "FRONTEND",
    accent: "azul",
    items: [
      {
        name: "React",
        why: "Maturidade, ecossistema absurdo e equipe que já domina. Não inventamos roda para o cliente pagar.",
        where: "Este site, painéis admin e produtos próprios (FYNK, NutrIAprova, OURleads).",
      },
      {
        name: "TypeScript",
        why: "Erro pego em build é erro que não chega no cliente. Custo extra de 10% de tempo, benefício de meses.",
        where: "Todo código novo que escrevemos.",
      },
      {
        name: "Tailwind CSS",
        why: "Design consistente sem CSS órfão. UI rápida sem virar bagunça de classes.",
        where: "Este site e interfaces dos produtos próprios.",
      },
      {
        name: "Framer Motion",
        why: "Animações que parecem profissionais sem perder semanas. Performance boa por padrão.",
        where: "Transições e micro-interações deste site.",
      },
    ],
  },
  {
    id: "mobile",
    label: "MOBILE",
    accent: "rosa",
    items: [
      {
        name: "React Native",
        why: "Um time, duas plataformas. Para 90% dos apps, performance nativa não compensa o custo de duas bases.",
        where: "Stack padrão quando o brief pede iOS + Android.",
      },
      {
        name: "Expo",
        why: "Build, OTA update e deploy nas lojas sem dor. Foco no produto, não na máquina de empacotar.",
        where: "Preferência em apps mobile que entregamos sob demanda.",
      },
    ],
  },
  {
    id: "backend",
    label: "BACKEND",
    accent: "azul",
    items: [
      {
        name: "Node.js",
        why: "Mesma linguagem do front. Onboarding mais rápido e código compartilhado quando faz sentido.",
        where: "Server functions deste site e APIs dos produtos próprios.",
      },
      {
        name: "Supabase",
        why: "Auth, banco, storage e realtime em horas. Para MVPs, reduz semanas de boilerplate.",
        where: "Este site (leads, admin) e backend dos produtos próprios.",
      },
      {
        name: "PostgreSQL",
        why: "Banco relacional sério, sem mágica. Quando o produto cresce, ele acompanha.",
        where: "Base via Supabase em tudo que rodamos hoje.",
      },
    ],
  },
  {
    id: "ia",
    label: "IA / AUTOMAÇÃO",
    accent: "rosa",
    items: [
      {
        name: "Claude API (Anthropic)",
        why: "Modelos de raciocínio precisos para casos sérios — análise, agentes, estimativa.",
        where: "Estimador deste site e copiloto do FYNK (produto próprio).",
      },
      {
        name: "n8n",
        why: "Automação visual auto-hospedada. Sem lock-in de Zapier e sem custo por execução fora de controle.",
        where: "Quando o brief pede integrações e fluxos sem reinventar fila.",
      },
      {
        name: "WhatsApp Business API",
        why: "É onde o brasileiro responde. Bot bem feito aqui economiza atendimento repetitivo.",
        where: "Linha de produto Secretária Virtual (em escopo) e automações sob demanda.",
      },
    ],
  },
  {
    id: "infra",
    label: "INFRA",
    accent: "azul",
    items: [
      {
        name: "Cloudflare",
        why: "Edge global, Workers e DNS no mesmo lugar. Latência baixa sem conta de hyperscaler no fim do mês.",
        where: "Deploy e edge deste site.",
      },
      {
        name: "TanStack Start",
        why: "SSR + server functions no mesmo projeto React. Menos glue, mais produto.",
        where: "Arquitetura deste site.",
      },
      {
        name: "GitHub Actions",
        why: "CI/CD onde o código já está. Sem mais uma ferramenta para o cliente aprender depois.",
        where: "Build e checagens dos repositórios que mantemos.",
      },
    ],
  },
  {
    id: "tools",
    label: "TOOLS",
    accent: "amarelo",
    items: [
      {
        name: "Figma",
        why: "Padrão da indústria. Cliente, designer e dev olhando o mesmo arquivo.",
        where: "Handoff quando o projeto tem UI custom.",
      },
      {
        name: "Linear",
        why: "Gestão de issues sem virar Jira. Time enxerga roadmap em segundos.",
        where: "Operação interna da Dreamscraft.",
      },
    ],
  },
];

const accentClass = {
  azul: "text-brand-azul",
  rosa: "text-brand-rosa",
  amarelo: "text-brand-amarelo",
} as const;

function StackPage() {
  return (
    <div>
      <section className="relative overflow-hidden mx-auto max-w-7xl px-6 pt-20 pb-12">
        <CodeRainBackground seed={14} palette="rosa-azul" className="opacity-30" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-azul/40 bg-brand-azul/10 px-3 py-1 text-xs font-mono text-brand-azul">
            <BrandPictogram name="tabela" color="azul" size={14} /> // nossa.stack
          </div>
          <h1 className="mt-4 text-5xl sm:text-6xl font-light tracking-[-0.03em] max-w-3xl text-gradient">
            Nossa stack técnica e por que escolhemos cada ferramenta
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            Não somos religiosos de stack. Usamos o que resolve o problema — mas aqui está o que
            resolve a maioria deles e por quê. Exemplos de uso citam só o que a gente opera de fato.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 space-y-16">
        {categories.map((cat) => (
          <div key={cat.id}>
            <p className={`text-sm font-mono ${accentClass[cat.accent]}`}>
              // {cat.id}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-light tracking-[-0.03em]">
              {cat.label}
            </h2>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cat.items.map((tech, i) => (
                <motion.article
                  key={tech.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group rounded-2xl border border-border bg-surface/60 p-6 hover:bg-surface-elevated hover:border-brand-azul/40 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-mono text-2xl font-semibold leading-tight">
                      {tech.name}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider ${
                        cat.accent === "azul"
                          ? "border-brand-azul/30 text-brand-azul bg-brand-azul/10"
                          : cat.accent === "rosa"
                            ? "border-brand-rosa/30 text-brand-rosa bg-brand-rosa/10"
                            : "border-brand-amarelo/30 text-brand-amarelo bg-brand-amarelo/10"
                      }`}
                    >
                      {cat.label}
                    </span>
                  </div>

                  <p className="mt-5 text-sm text-foreground/90">
                    <span className={`font-mono text-xs ${accentClass[cat.accent]}`}>
                      // por que usamos
                    </span>
                    <br />
                    {tech.why}
                  </p>

                  <p className="mt-4 text-sm text-muted-foreground">
                    <span className="font-mono text-xs text-muted-foreground/80">
                      // onde
                    </span>
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
