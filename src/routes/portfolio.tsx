import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ClientOnly } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronDown,
  Clock,
  MessageCircle,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { CodeRainBackground } from "@/components/code-rain-background";
import {
  BrandPictogram,
  type PictogramName,
} from "@/components/brand-pictogram";

const MonacoEditor = lazy(() => import("@monaco-editor/react"));

export const Route = createFileRoute("/portfolio")({
  head: () => {
    const title = "Portfolio — Produtos próprios em construção · Dreamscraft Code";
    const description =
      "Os 4 SaaS que estamos construindo internamente: Secretária Virtual com IA, NutrIAprova, FYNK e OURleads. Nada de case de cliente inventado — só o que a gente está de fato codando.";
    const url = "https://dreamscraftcode.com/portfolio";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
    };
  },
  component: PortfolioPage,
});

// ---------- Types ----------

type Decision = { kind: "+" | "-"; tech: string; reason: string };
type ArchNode = { id: string; x: number; y: number; label: string; sub: string };
type Product = {
  icon: PictogramName;
  slug: string;
  name: string;
  tagline: string;
  status: "Em desenvolvimento" | "Em escopo";
  statusTone: "dev" | "scope";
  stage: string;
  nextMilestone: string;
  problem: string;
  arch: { nodes: ArchNode[]; edges: [string, string][] };
  decisions: Decision[];
  code: { lang: string; filename: string; body: string };
};

// ---------- Data (produtos PRÓPRIOS Dreamscraft — nenhum cliente) ----------

const products: Product[] = [
  {
      icon: "celular",
      slug: "recepcionista-ia",
      name: "Secretária Virtual com IA",
      tagline: "Atendimento automatizado que não parece bot — agenda, qualifica e responde 24/7.",
      status: "Em escopo",
      statusTone: "scope",
      stage: "Escopo fechando: canais, integrações de agenda e limites da IA",
      nextMilestone: "Primeira versão end-to-end no WhatsApp de um piloto interno",
      problem:
        "Clínicas, consultórios, prestadores e pequenos escritórios perdem cliente porque não têm quem atenda fora do horário — e chatbot de fluxo fixo irrita mais do que resolve. A Secretária Virtual usa IA para entender pedido, checar agenda real, oferecer horário e escalar para humano quando não deve decidir sozinha. Objetivo é substituir a recepção repetitiva, não a humana.",
      arch: {
        nodes: [
          { id: "wa", x: 40, y: 50, label: "Canais", sub: "WhatsApp · Web · Voz" },
          { id: "brain", x: 230, y: 50, label: "IA", sub: "modelo + tools" },
          { id: "cal", x: 420, y: 50, label: "Agenda", sub: "Google · iCal" },
          { id: "db", x: 230, y: 200, label: "DB", sub: "Postgres · RLS" },
        ],
        edges: [
          ["wa", "brain"],
          ["brain", "cal"],
          ["brain", "db"],
        ],
      },
      decisions: [
        { kind: "+", tech: "Tool calling estrito", reason: "IA só age via ações auditadas (agendar, cancelar, transferir humano)" },
        { kind: "+", tech: "Handoff explícito para humano", reason: "produto ganha confiança quando sabe dizer 'isso eu não decido'" },
        { kind: "+", tech: "WhatsApp Cloud API primeiro", reason: "canal com maior ROI para o público-alvo" },
        { kind: "-", tech: "Fluxo por árvore de decisão descartado", reason: "custo de manutenção alto e experiência ruim; IA + tools rende mais" },
      ],
      code: {
        lang: "typescript",
        filename: "tools.ts",
        body: `// src/lib/recepcionista/tools.ts
  export const tools = [
    {
      name: "check_availability",
      description: "Consulta horários livres na agenda do profissional",
      parameters: { date: "string (YYYY-MM-DD)", durationMin: "number" },
    },
    {
      name: "book_slot",
      description: "Agenda um horário para o cliente. Requer confirmação.",
      parameters: { slotId: "string", clientName: "string", clientPhone: "string" },
    },
    {
      name: "handoff_human",
      description: "Escala para atendente humano quando fugir do escopo",
      parameters: { reason: "string" },
    },
  ] as const;
  `,
      },
    },
  {
      icon: "documento",
      slug: "nutriaprova",
      name: "NutrIAprova",
      tagline: "Nutricionistas validam receitas de IA em segundos, não em horas.",
      status: "Em desenvolvimento",
      statusTone: "dev",
      stage: "MVP fechado, em iteração com nutricionistas",
      nextMilestone: "Fluxo de aprovação em lote + export para prontuário",
      problem:
        "Nutricionistas recebem centenas de receitas geradas por IA e precisam checar cada uma: macros batem? substituições fazem sentido clínico? contraindicações estão cobertas? Fazer isso manualmente é caro e lento. O NutrIAprova coloca a receita, o parecer da IA e os alertas nutricionais lado a lado — a aprovação vira 1 clique, e o que não bate volta com justificativa.",
      arch: {
        nodes: [
          { id: "web", x: 40, y: 50, label: "Web", sub: "React 19 · TS" },
          { id: "edge", x: 230, y: 50, label: "Server Fn", sub: "TanStack Start" },
          { id: "ai", x: 420, y: 50, label: "IA", sub: "Lovable AI Gateway" },
          { id: "db", x: 230, y: 200, label: "DB", sub: "Postgres · RLS" },
        ],
        edges: [
          ["web", "edge"],
          ["edge", "ai"],
          ["edge", "db"],
        ],
      },
      decisions: [
        { kind: "+", tech: "Lovable AI Gateway", reason: "sem API key própria e permite trocar modelo sem redeploy" },
        { kind: "+", tech: "Postgres + RLS", reason: "isolamento por nutricionista feito no banco, não no client" },
        { kind: "+", tech: "TanStack Start server functions", reason: "chamada de IA fica no edge, prompt nunca vaza para o browser" },
        { kind: "-", tech: "LangChain descartado", reason: "abstração cara para um caso de uso de 1 chamada + validação estruturada" },
      ],
      code: {
        lang: "typescript",
        filename: "validateRecipe.functions.ts",
        body: `// src/lib/nutri/validate.functions.ts
  import { createServerFn } from "@tanstack/react-start";
  import { z } from "zod";
  
  const Input = z.object({ recipeId: z.string().uuid() });
  
  export const validateRecipe = createServerFn({ method: "POST" })
    .inputValidator((d) => Input.parse(d))
    .handler(async ({ data }) => {
      // 1. carrega receita + restrições do paciente
      // 2. dispara modelo com schema estruturado (macros, alergênicos, alertas)
      // 3. persiste parecer e devolve para revisão da nutri
      return { recipeId: data.recipeId, verdict: "needs_review" };
    });
  `,
      },
    },
  {
      icon: "dinheiro",
      slug: "fynk",
      name: "FYNK",
      tagline: "Sua vida financeira num painel só — com uma IA sarcástica te chamando à realidade.",
      status: "Em desenvolvimento",
      statusTone: "dev",
      stage: "Núcleo de imposto de renda + cartões em construção",
      nextMilestone: "Importação de fatura + primeiro roast de gastos",
      problem:
        "Imposto de renda, empréstimos, faturas de cartão, gastos do mês, planejamento — tudo espalhado em planilha, banco e app de fintech. O FYNK unifica isso e coloca um copiloto de IA que não é gentil: ele confronta o usuário sobre onde o dinheiro vai. A ideia é o oposto do dashboard bonitinho que ninguém abre.",
      arch: {
        nodes: [
          { id: "app", x: 40, y: 50, label: "Web/App", sub: "React 19" },
          { id: "edge", x: 230, y: 50, label: "Edge", sub: "Server Fn" },
          { id: "ai", x: 420, y: 50, label: "IA", sub: "modelo com persona" },
          { id: "db", x: 230, y: 200, label: "DB", sub: "Postgres · RLS" },
        ],
        edges: [
          ["app", "edge"],
          ["edge", "ai"],
          ["edge", "db"],
        ],
      },
      decisions: [
        { kind: "+", tech: "Ingest CSV/OFX próprio", reason: "não depender de Open Finance no MVP; libera o produto sem convênio bancário" },
        { kind: "+", tech: "Persona sarcástica travada em system prompt", reason: "tom é o produto — não pode variar entre sessões" },
        { kind: "+", tech: "Categorização por regras + IA", reason: "regras cobrem 80% barato; IA só resolve os casos ambíguos" },
        { kind: "-", tech: "Pluggy/Belvo no MVP descartado", reason: "custo por conta inviabiliza o preço de entrada" },
      ],
      code: {
        lang: "typescript",
        filename: "roast.ts",
        body: `// src/lib/fynk/roast.ts
  export const ROAST_SYSTEM = \`
  Você é o copiloto financeiro do FYNK. Personalidade: sarcástico,
  direto, sem paciência para desculpa. Nunca xinga. Sempre confronta
  o gasto com a meta declarada do usuário. Fecha com uma ação de 1 linha.
  \`;
  
  export function buildRoastPrompt(input: {
    monthTotal: number;
    topCategory: { name: string; amount: number };
    goal: string;
  }) {
    return \`Mês fechou em R$ \${input.monthTotal}. Maior categoria:
  \${input.topCategory.name} (R$ \${input.topCategory.amount}).
  Meta declarada: "\${input.goal}". Comente.\`;
  }
  `,
      },
    },
  {
      icon: "usuario",
      slug: "ourleads",
      name: "OURleads",
      tagline: "Gestão de leads para quem cansou de CRM inchado — de qualquer nicho, não só imobiliária.",
      status: "Em desenvolvimento",
      statusTone: "dev",
      stage: "Pipeline, distribuição e integrações-base em construção",
      nextMilestone: "Distribuição round-robin com SLA de resposta",
      problem:
        "Ferramentas como C2S resolvem bem gestão de leads — mas só para imobiliária. Fora desse nicho, quem quer organizar lead vai parar em CRM genérico caro e configurável demais. O OURleads pega o núcleo bom (captura → distribuição → follow-up → conversão) e entrega enxuto para clínicas, escolas, prestadores de serviço, agências — qualquer negócio que roda em cima de lead frio.",
      arch: {
        nodes: [
          { id: "web", x: 40, y: 50, label: "Web", sub: "React 19" },
          { id: "api", x: 230, y: 50, label: "API", sub: "Server Fn · Edge" },
          { id: "wh", x: 420, y: 50, label: "Webhooks", sub: "Meta · Google · WA" },
          { id: "db", x: 230, y: 200, label: "DB", sub: "Postgres · RLS" },
        ],
        edges: [
          ["web", "api"],
          ["api", "db"],
          ["wh", "api"],
        ],
      },
      decisions: [
        { kind: "+", tech: "Webhooks em /api/public/*", reason: "endpoints públicos verificados por assinatura, sem auth de app" },
        { kind: "+", tech: "Motor de distribuição em Postgres", reason: "SLA e round-robin em transação — não em fila externa" },
        { kind: "+", tech: "RLS por conta + role", reason: "vendedor só enxerga o próprio funil sem lógica no client" },
        { kind: "-", tech: "Multi-tenant por schema descartado", reason: "explosão de migrations; RLS resolve com custo menor" },
      ],
      code: {
        lang: "sql",
        filename: "leads_rls.sql",
        body: `-- policies/leads.sql
  alter table public.leads enable row level security;
  
  create policy "vendedor ve seus leads"
    on public.leads for select
    to authenticated
    using (owner_id = auth.uid());
  
  create policy "gestor ve tudo da conta"
    on public.leads for select
    to authenticated
    using (public.has_role(auth.uid(), 'gestor'));
  `,
      },
    },
]

const toneStyle: Record<Product["statusTone"], string> = {
  dev: "bg-primary/15 text-primary-glow border-primary/30",
  scope: "bg-brand-amarelo/10 text-brand-amarelo border-brand-amarelo/30",
};

// ---------- Page ----------

function PortfolioPage() {
  const [openSlug, setOpenSlug] = useState<string | null>(products[0]?.slug ?? null);

  return (
    <div>
      <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-12">
        <CodeRainBackground seed={4} palette="rosa-azul" className="opacity-40" />
        <Reveal>
          <p className="text-sm text-primary-glow font-medium font-mono uppercase tracking-wider">
            // portfolio.produtos_proprios
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-2 text-5xl sm:text-6xl font-light tracking-[-0.03em] max-w-3xl text-gradient">
            O que estamos construindo por conta própria
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Não temos case de cliente para mostrar ainda — e a gente não vai inventar.
            O que temos são 4 produtos SaaS próprios que estamos codando agora, com
            problema real, arquitetura escolhida a dedo e trecho de código verdadeiro.
            Ficha técnica aberta.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-4 text-xs font-mono text-muted-foreground">
            // status: nenhum destes é produto de cliente. É Dreamscraft construindo Dreamscraft.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20 space-y-4">
        {products.map((p, i) => (
          <ProductCard
            key={p.slug}
            product={p}
            index={i}
            open={openSlug === p.slug}
            onToggle={() => setOpenSlug(openSlug === p.slug ? null : p.slug)}
          />
        ))}
      </section>

      <section className="relative mx-auto max-w-7xl px-6 pb-16">
        <CodeRainBackground seed={9} palette="azul" className="opacity-30" />
        <Reveal>
          <div className="relative rounded-3xl border border-primary/30 bg-gradient-to-br from-surface to-surface-elevated p-10 text-center">
            <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-primary-glow">
              // primeiro_cliente = null
            </p>
            <h2 className="mt-4 text-3xl sm:text-4xl font-light tracking-[-0.03em]">
              Quer ser o primeiro case real?
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              A gente ainda não entregou projeto para cliente externo. Se você topa
              construir junto com um time enxuto de engenharia séria, sua vaga é essa.
            </p>
            <Link
              to="/contato"
              className="btn-glow mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground glow-ring font-mono uppercase tracking-wider"
            >
              Conversar agora <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

// ---------- Product Card (accordion + tabs) ----------

type TabKey = "problema" | "arquitetura" | "decisoes" | "codigo";

const TABS: { id: TabKey; label: string }[] = [
  { id: "problema", label: "Problema" },
  { id: "arquitetura", label: "Arquitetura" },
  { id: "decisoes", label: "Decisões" },
  { id: "codigo", label: "Código" },
];

function ProductCard({
  product,
  index,
  open,
  onToggle,
}: {
  product: Product;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const [tab, setTab] = useState<TabKey>("problema");

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      data-cursor="view"
      className="rounded-lg border border-primary/25 bg-surface overflow-hidden"
    >
      {/* window chrome */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-primary/20 bg-surface-elevated/80 font-mono text-[10px] sm:text-[11px] text-muted-foreground">
        <span className="h-2.5 w-2.5 rounded-full bg-brand-rosa/80 shrink-0" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-brand-amarelo/80 shrink-0" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-brand-azul/80 shrink-0" aria-hidden />
        <span className="ml-2 truncate text-primary-glow/90">
          $ products/{product.slug}
        </span>
      </div>

      <button
        onClick={onToggle}
        className="w-full text-left p-5 md:p-6 hover:bg-surface-elevated/50 transition flex items-start gap-5"
        aria-expanded={open}
      >
        <BrandPictogram name={product.icon} color="azul" size={40} className="shrink-0 mt-1" />

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-2xl md:text-3xl font-light tracking-[-0.02em] font-mono">
              {product.name}
            </h2>
            <span
              className={`text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm border ${toneStyle[product.statusTone]}`}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current mr-1.5 align-middle" />
              {product.status}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm border border-primary/25 text-primary-glow/80">
              produto próprio
            </span>
          </div>

          <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{product.tagline}</p>

          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-mono text-xs">
              <span className="text-primary-glow">{`// stage`}</span>
              <span>{product.stage}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs">
              <span className="text-primary-glow">{`// next`}</span>
              <span className="text-foreground">{product.nextMilestone}</span>
            </span>
          </div>
        </div>

        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 mt-2 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-primary/20 overflow-hidden"
          >
            <div className="p-5 md:p-6">
              <div role="tablist" className="flex flex-wrap gap-1 border-b border-primary/20 mb-6">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={tab === t.id}
                    onClick={() => setTab(t.id)}
                    className={`px-3.5 py-2 text-sm font-mono rounded-none transition relative ${
                      tab === t.id
                        ? "text-primary-glow"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.label}
                    {tab === t.id && (
                      <motion.span
                        layoutId={`tab-underline-${product.slug}`}
                        className="absolute left-0 right-0 -bottom-px h-0.5 bg-primary"
                      />
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  {tab === "problema" && (
                    <p className="text-base leading-relaxed text-foreground/90 max-w-3xl">
                      {product.problem}
                    </p>
                  )}
                  {tab === "arquitetura" && <MiniArchitecture arch={product.arch} />}
                  {tab === "decisoes" && <DecisionList decisions={product.decisions} />}
                  {tab === "codigo" && <CodeViewer code={product.code} />}
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 pt-5 border-t border-border/60 flex flex-wrap items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground font-mono text-xs">
                  <Clock className="inline h-3 w-3 mr-1" />
                  em construção · sem cliente final ainda
                </span>
                <Link
                  to="/contato"
                  className="inline-flex items-center gap-1.5 text-primary-glow hover:text-primary transition"
                >
                  <MessageCircle className="h-4 w-4" />
                  Falar sobre {product.name}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

// ---------- Tab contents ----------

function MiniArchitecture({ arch }: { arch: Product["arch"] }) {
  const reduce = useReducedMotion();
  const pos = Object.fromEntries(arch.nodes.map((n) => [n.id, n]));
  return (
    <div className="rounded-2xl border border-primary/20 bg-[#0A0620] p-5 shadow-[0_0_60px_-30px_hsl(var(--primary)/0.5)]">
      <svg viewBox="0 0 560 290" className="w-full h-auto" role="img" aria-label="Diagrama de arquitetura">
        <defs>
          <linearGradient id="arch-edge" x1="0" x2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
            <stop offset="100%" stopColor="hsl(var(--primary-glow))" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        {arch.edges.map(([a, b], i) => {
          const p1 = pos[a];
          const p2 = pos[b];
          if (!p1 || !p2) return null;
          return (
            <motion.line
              key={`${a}-${b}`}
              x1={p1.x + 60}
              y1={p1.y + 30}
              x2={p2.x + 60}
              y2={p2.y + 30}
              stroke="url(#arch-edge)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              initial={reduce ? { opacity: 1 } : { pathLength: 0, opacity: 0 }}
              animate={reduce ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.12 }}
            />
          );
        })}
        {arch.nodes.map((n, i) => (
          <motion.g
            key={n.id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
            style={{ transformOrigin: `${n.x + 60}px ${n.y + 30}px` }}
          >
            <rect
              x={n.x}
              y={n.y}
              width={120}
              height={60}
              rx={12}
              fill="hsl(var(--primary) / 0.08)"
              stroke="hsl(var(--primary) / 0.5)"
              strokeWidth={1}
            />
            <text
              x={n.x + 60}
              y={n.y + 26}
              textAnchor="middle"
              className="fill-white"
              style={{ font: "600 14px 'Cascadia Code', ui-monospace, monospace" }}
            >
              {n.label}
            </text>
            <text
              x={n.x + 60}
              y={n.y + 44}
              textAnchor="middle"
              className="fill-zinc-400"
              style={{ font: "11px 'Cascadia Code', ui-monospace, monospace" }}
            >
              {n.sub}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

function DecisionList({ decisions }: { decisions: Decision[] }) {
  return (
    <ul className="space-y-2 font-mono text-sm">
      {decisions.map((d, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: i * 0.05 }}
          className={`flex gap-3 rounded-lg border px-4 py-3 ${
            d.kind === "+"
              ? "border-brand-amarelo/25 bg-brand-amarelo/5"
              : "border-brand-rosa/25 bg-brand-rosa/5"
          }`}
        >
          <span
            className={`text-base leading-5 ${
              d.kind === "+" ? "text-brand-amarelo" : "text-brand-rosa"
            }`}
          >
            {d.kind}
          </span>
          <span className="text-foreground">
            <span className="text-foreground">{d.tech}</span>
            <span className="text-muted-foreground"> → {d.reason}</span>
          </span>
        </motion.li>
      ))}
    </ul>
  );
}

function CodeViewer({ code }: { code: Product["code"] }) {
  return (
    <div className="rounded-2xl border border-border bg-[#0A0620] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/40">
        <span className="font-mono text-xs text-muted-foreground">{code.filename}</span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-primary-glow">
          // trecho real do repositório
        </span>
      </div>
      <ClientOnly fallback={<pre className="p-4 text-xs text-muted-foreground font-mono h-[260px] overflow-auto">{code.body}</pre>}>
        <Suspense
          fallback={
            <pre className="p-4 text-xs text-muted-foreground font-mono h-[260px] overflow-auto">{code.body}</pre>
          }
        >
          <MonacoEditor
            height="260px"
            language={code.lang}
            value={code.body}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 12,
              fontFamily: "'Cascadia Code', ui-monospace, monospace",
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              renderLineHighlight: "none",
              folding: false,
              contextmenu: false,
              scrollbar: { vertical: "auto", horizontal: "auto" },
            }}
          />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
