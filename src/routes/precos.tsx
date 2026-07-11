import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { TiltCard } from "@/components/TiltCard";
import { DreamscraftLogo } from "@/components/dreamscraft-logo";
import { CodeRainBackground } from "@/components/code-rain-background";

type BillingMode = "total" | "monthly";

type PricingCard = {
  tier: "MVP" | "Sistema" | "Enterprise";
  tagline: string;
  total: number;
  supportMonths: number;
  supportValuePerMonth: number;
  features: string[];
};

const pricingCards: PricingCard[] = [
  {
    tier: "MVP",
    tagline: "Valide sua ideia em semanas, não meses",
    total: 12000,
    supportMonths: 1,
    supportValuePerMonth: 790,
    features: [
      "App mobile ou web (1 plataforma)",
      "Até 5 telas/módulos principais",
      "Auth + banco + 1 integração",
      "Publicação em staging",
    ],
  },
  {
    tier: "Sistema",
    tagline: "Produto completo para escalar com tração",
    total: 30000,
    supportMonths: 2,
    supportValuePerMonth: 1490,
    features: [
      "App + painel admin web",
      "Até 15 telas/módulos",
      "Integrações: pagamento, push, mapas",
      "Publicação em produção (App Store + Play)",
    ],
  },
  {
    tier: "Enterprise",
    tagline: "Plataforma robusta com regras de negócio complexas",
    total: 70000,
    supportMonths: 3,
    supportValuePerMonth: 2490,
    features: [
      "Multi-plataforma + dashboards",
      "Módulos ilimitados sob escopo",
      "IA, realtime, integrações ERP",
      "SLA dedicado + consultoria",
    ],
  },
];

function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
}

function AnimatedPrice({ value }: { value: number }) {
  const mv = useMotionValue(value);
  const rounded = useTransform(mv, (v) => `R$ ${formatBRL(Math.round(v))}`);
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.4, ease: "easeOut" });
    return controls.stop;
  }, [value, mv]);
  return <motion.span>{rounded}</motion.span>;
}

export const Route = createFileRoute("/precos")({
  head: () => {
    const title = "Tabela de Preços — Dreamscraft Code";
    const description =
      "Tabela transparente de preços: sites, e-commerce, apps mobile, bots, redes sociais, pacotes completos, parcerias e planos de manutenção.";
    const url = "https://dreamscraftcode.com.br/precos";
    const image = "https://dreamscraftcode.com.br/og-image.png";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "OfferCatalog",
            name: "Catálogo de serviços — Dreamscraft Code",
            url,
            provider: {
              "@type": "Organization",
              name: "Dreamscraft Code",
              url: "https://dreamscraftcode.com.br",
            },
            itemListElement: [
              {
                "@type": "Offer",
                name: "Site Institucional / Vitrine",
                description:
                  "Presença online profissional para empresas locais e profissionais liberais.",
                priceCurrency: "BRL",
                priceSpecification: {
                  "@type": "PriceSpecification",
                  minPrice: 1200,
                  maxPrice: 18000,
                  priceCurrency: "BRL",
                },
              },
              {
                "@type": "Offer",
                name: "E-commerce",
                description: "Lojas virtuais sob medida com checkout, gestão e integrações.",
                priceCurrency: "BRL",
                priceSpecification: {
                  "@type": "PriceSpecification",
                  minPrice: 3500,
                  maxPrice: 40000,
                  priceCurrency: "BRL",
                },
              },
              {
                "@type": "Offer",
                name: "Aplicativos Mobile",
                description: "Apps nativos e híbridos para iOS e Android.",
                priceCurrency: "BRL",
                priceSpecification: {
                  "@type": "PriceSpecification",
                  minPrice: 8000,
                  maxPrice: 60000,
                  priceCurrency: "BRL",
                },
              },
              {
                "@type": "Offer",
                name: "Bots & Automações com IA",
                description: "Chatbots e fluxos com OpenAI, n8n e LangChain.",
                priceCurrency: "BRL",
                priceSpecification: {
                  "@type": "PriceSpecification",
                  minPrice: 3000,
                  maxPrice: 20000,
                  priceCurrency: "BRL",
                },
              },
            ],
          }),
        },
      ],
    };
  },
  component: PrecosPage,
});

type Row = {
  level: "Baixa" | "Média" | "Alta" | "Básico" | "Profissional" | "Enterprise" | "Essencial" | "Negócio Digital" | "Empresa Total" | "Média (MVP)" | "Alta (Completo)";
  deadline?: string;
  price: string;
  includes: string;
  example?: string;
};

type Service = {
  emoji: string;
  title: string;
  desc: string;
  headers: string[];
  rows: Row[];
  note?: string;
};

const services: Service[] = [
  {
    emoji: "🌐",
    title: "Site Institucional / Vitrine",
    desc: "Ideal para empresas locais, profissionais liberais e pequenos negócios que querem presença online profissional.",
    headers: ["Complexidade", "Prazo", "Faixa (R$)", "O que inclui", "Exemplo"],
    rows: [
      { level: "Baixa", deadline: "1-2 semanas", price: "1.200 - 2.500", includes: "Landing page responsiva (3-5 seções), formulário de contato, WhatsApp flutuante, SEO básico, Google Maps", example: "Salão, clínica pequena, portfólio profissional" },
      { level: "Média", deadline: "3-5 semanas", price: "3.500 - 7.000", includes: "Até 10 páginas, blog, área administrativa simples, otimização de imagens, captação de leads", example: "Escola de cursos, consultório médico, loja de decoração" },
      { level: "Alta", deadline: "6-10 semanas", price: "8.000 - 18.000", includes: "Login de usuários, integração WhatsApp API, agendamentos, dashboard personalizado, módulos internos", example: "Clube de assinatura, plataforma de cursos, portal de notícias" },
    ],
  },
  {
    emoji: "🛒",
    title: "E-commerce / SaaS",
    desc: "Para quem quer vender online ou cobrar mensalidades recorrentes.",
    headers: ["Complexidade", "Prazo", "Faixa (R$)", "O que inclui", "Exemplo"],
    rows: [
      { level: "Média", deadline: "6-10 semanas", price: "8.000 - 18.000", includes: "Catálogo, carrinho, checkout (Pix/cartão), gestão de pedidos, cupons, frete integrado", example: "Loja de roupas, produtos digitais, artesanato" },
      { level: "Alta", deadline: "12-20 semanas", price: "20.000 - 50.000+", includes: "Marketplace multi-vendedor, assinaturas SaaS, split de pagamento, dashboard analítico, automação de cobrança", example: "Marketplace de serviços, SaaS de gestão, clube de assinaturas" },
    ],
  },
  {
    emoji: "📱",
    title: "Aplicativo Mobile (iOS + Android)",
    desc: "React Native / Flutter — um único código para ambas as lojas.",
    headers: ["Complexidade", "Prazo", "Faixa (R$)", "O que inclui", "Exemplo"],
    rows: [
      { level: "Média (MVP)", deadline: "6-10 semanas", price: "12.000 - 25.000", includes: "Cadastro, login, módulo principal, push notification, integração com API, painel admin básico", example: "App de tarefas, delivery simples, fidelidade de clientes" },
      { level: "Alta (Completo)", deadline: "12-20 semanas", price: "25.000 - 70.000", includes: "App + painel web completo, GPS em tempo real, chat, pagamentos integrados, validação por IA, publicação nas lojas", example: "App de fretes, marketplace, Uber-like, clube de vantagens" },
    ],
  },
  {
    emoji: "🤖",
    title: "Bots (WhatsApp / Telegram / Instagram)",
    desc: "Automatize atendimento, vendas, notificações e fluxos.",
    headers: ["Complexidade", "Prazo", "Faixa (R$)", "O que inclui", "Exemplo"],
    rows: [
      { level: "Baixa", deadline: "1-2 semanas", price: "800 - 2.500", includes: "Respostas automáticas (menu interativo), envio de catálogo, captura de leads", example: "Atendimento básico, cardápio digital" },
      { level: "Média", deadline: "3-6 semanas", price: "3.000 - 8.000", includes: "Bot com integração a banco de dados, agendamentos, cobrança via link de pagamento, notificações", example: "Agendamento de serviços, e-commerce via WhatsApp" },
      { level: "Alta", deadline: "6-10 semanas", price: "8.000 - 20.000", includes: "Bot com IA, fluxos condicionais complexos, integração com ERP, dashboard de análise", example: "Suporte empresarial, automação de vendas B2B" },
    ],
  },
  {
    emoji: "📸",
    title: "Repaginação de Redes Sociais + Gestão",
    desc: "Instagram, Facebook, LinkedIn — com direito a Reels e identidade visual.",
    headers: ["Pacote", "Setup", "Mensal (R$)", "O que inclui"],
    rows: [
      { level: "Básico", deadline: "1 semana", price: "590", includes: "Identidade visual (avatar, capa, destaques), 10 artes fixas + 4 stories/semana, agendamento" },
      { level: "Profissional", deadline: "1 semana", price: "1.200", includes: "Básico + 4 Reels/mês, legendas otimizadas, resposta a comentários, relatório mensal" },
      { level: "Enterprise", deadline: "2 semanas", price: "2.500", includes: "Profissional + criação de anúncios, estratégia de engajamento, 8 Reels/mês, consultoria semanal" },
    ],
    note: "Parceiro especializado: indicamos produtor de vídeo e fotógrafo profissional para gravação de Reels de alta qualidade (orçamento separado a partir de R$ 400/Reel).",
  },
  {
    emoji: "🎯",
    title: "Pacotes Completos (Site + Redes + Bot)",
    desc: "Para quem quer presença digital integrada e sem dor de cabeça.",
    headers: ["Pacote", "Setup (R$)", "Mensal (R$)", "O que inclui"],
    rows: [
      { level: "Essencial", price: "3.900", deadline: "490/mês", includes: "Site institucional (5 páginas) + gestão básica de redes (10 artes/mês) + WhatsApp flutuante" },
      { level: "Negócio Digital", price: "8.500", deadline: "1.190/mês", includes: "E-commerce ou SaaS simples + repaginação profissional + bot WhatsApp básico + Google Maps verificado" },
      { level: "Empresa Total", price: "15.000 - 30.000", deadline: "2.490/mês", includes: "App mobile + site + redes Enterprise + bot completo + manutenção prioritária + consultoria mensal" },
    ],
  },
  {
    emoji: "🛠️",
    title: "Planos de Manutenção Recorrente",
    desc: "Após a entrega, garantimos que o projeto continue funcionando e evoluindo.",
    headers: ["Plano", "Mensal (R$)", "Inclui"],
    rows: [
      { level: "Básico", price: "390", includes: "Hospedagem leve, backups semanais, correção de bugs críticos (até 2h/mês)" },
      { level: "Essencial", price: "790", includes: "Básico + pequenas alterações (texto, imagem, cor) até 4h/mês, monitoramento 24/7" },
      { level: "Profissional", price: "1.490", includes: "Essencial + alterações ilimitadas (não estruturais) + suporte em até 12h úteis + relatório mensal" },
      { level: "Enterprise", price: "2.490", includes: "Profissional + 1 nova funcionalidade/mês + Google Maps incluso + consultoria estratégica mensal" },
    ],
  },
];

const partnership = [
  { type: "Parceria Básica", setup: "5.000 - 8.000", commission: "15%", min: "R$ 500", duration: "3 anos" },
  { type: "Parceria Completa", setup: "2.500 - 5.000", commission: "25%", min: "R$ 800", duration: "5 anos" },
  { type: "Parceria Total (setup zero)", setup: "0", commission: "40%", min: "R$ 1.000", duration: "7 anos" },
];

const external = [
  { item: "Registro de domínio (.com.br)", cost: "R$ 40", freq: "Anual" },
  { item: "Hospedagem (site/app leve)", cost: "R$ 50 - 150", freq: "Mensal" },
  { item: "Hospedagem backend + banco", cost: "R$ 150 - 500", freq: "Mensal" },
  { item: "Google Maps API", cost: "R$ 50 - 300", freq: "Mensal" },
  { item: "Gateway de pagamento", cost: "% + fixo", freq: "Por transação" },
  { item: "Publicação App Store (Apple)", cost: "R$ 499", freq: "Anual" },
  { item: "Publicação Google Play", cost: "R$ 25", freq: "Único" },
];

function levelBadge(level: string) {
  const map: Record<string, string> = {
    Baixa: "bg-brand-amarelo/10 text-brand-amarelo border-brand-amarelo/20",
    Média: "bg-brand-amarelo/10 text-brand-amarelo border-brand-amarelo/20",
    "Média (MVP)": "bg-brand-amarelo/10 text-brand-amarelo border-brand-amarelo/20",
    Alta: "bg-brand-rosa/10 text-brand-rosa border-brand-rosa/20",
    "Alta (Completo)": "bg-brand-rosa/10 text-brand-rosa border-brand-rosa/20",
    Básico: "bg-brand-amarelo/10 text-brand-amarelo border-brand-amarelo/20",
    Essencial: "bg-brand-amarelo/10 text-brand-amarelo border-brand-amarelo/20",
    Profissional: "bg-primary/15 text-primary border-primary/30",
    Enterprise: "bg-brand-rosa/10 text-brand-rosa border-brand-rosa/20",
    "Negócio Digital": "bg-primary/15 text-primary border-primary/30",
    "Empresa Total": "bg-brand-rosa/10 text-brand-rosa border-brand-rosa/20",
  };
  return map[level] ?? "bg-surface text-foreground border-border";
}

function PrecosPage() {
  return (
    <div>
      <section className="relative overflow-hidden mx-auto max-w-7xl px-6 pt-20 pb-12">
        <CodeRainBackground seed={6} className="opacity-30" />
        <Reveal><p className="text-sm text-primary font-medium">Preços</p></Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-2 text-5xl sm:text-6xl font-light tracking-[-0.03em] max-w-3xl text-gradient">
            Tecnologia que cabe no seu bolso, com qualidade enterprise
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            Valores transparentes por complexidade. Sem surpresas, sem letras miúdas — você sabe
            exatamente o que está pagando antes mesmo de assinar.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs text-muted-foreground">
            <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Valores vigentes por 30 dias a partir da consulta
          </div>
        </Reveal>
      </section>

      {/* Cards de preço com toggle Total / Mensal */}
      <PricingCardsSection />


      {/* Serviços */}

      <section className="mx-auto max-w-7xl px-6 pb-12 space-y-6">
        {services.map((svc, i) => (
          <motion.div
            key={svc.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: i * 0.03 }}
          >
            <TiltCard maxTilt={3} className="rounded-3xl border border-border bg-surface/60 overflow-hidden">
            <div className="p-6 lg:p-8 border-b border-border">
              <h2 className="text-2xl font-light tracking-[-0.03em]">
                <span className="mr-2">{svc.emoji}</span>
                {svc.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{svc.desc}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-background/40">
                  <tr>
                    {svc.headers.map((h) => (
                      <th
                        key={h}
                        className="text-left font-semibold text-muted-foreground px-4 py-3 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {svc.rows.map((r, idx) => (
                    <tr key={idx} className="border-t border-border/60">
                      <td className="px-4 py-4 align-top">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${levelBadge(r.level)}`}
                        >
                          {r.level}
                        </span>
                      </td>
                      {r.deadline !== undefined && (
                        <td className="px-4 py-4 align-top text-muted-foreground whitespace-nowrap">
                          {r.deadline}
                        </td>
                      )}
                      <td className="px-4 py-4 align-top font-semibold text-foreground whitespace-nowrap">
                        R$ {r.price}
                      </td>
                      <td className="px-4 py-4 align-top text-muted-foreground min-w-[280px]">
                        {r.includes}
                      </td>
                      {r.example && (
                        <td className="px-4 py-4 align-top text-muted-foreground italic">
                          {r.example}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {svc.note && (
              <div className="m-6 lg:m-8 mt-0 rounded-2xl border border-brand-amarelo/20 bg-brand-amarelo/5 p-4 text-sm text-brand-amarelo/90">
                💡 {svc.note}
              </div>
            )}
            </TiltCard>
          </motion.div>
        ))}
      </section>

      {/* Parceria */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-8 lg:p-10">
          <p className="text-sm text-primary font-medium">🤝 Modelo de Parceria</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-light tracking-[-0.03em]">Participação nos resultados</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Para startups, marketplaces e negócios com potencial recorrente. Investimento inicial
            reduzido (ou zero), e a Dreamscraft cresce junto com você.
          </p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="text-left font-semibold py-3 px-2">Tipo</th>
                  <th className="text-left font-semibold py-3 px-2">Setup (R$)</th>
                  <th className="text-left font-semibold py-3 px-2">Comissão</th>
                  <th className="text-left font-semibold py-3 px-2">Manutenção mín.</th>
                  <th className="text-left font-semibold py-3 px-2">Duração</th>
                </tr>
              </thead>
              <tbody>
                {partnership.map((p) => (
                  <tr key={p.type} className="border-b border-border/60">
                    <td className="py-3 px-2 font-medium">{p.type}</td>
                    <td className="py-3 px-2 text-muted-foreground">{p.setup}</td>
                    <td className="py-3 px-2 text-primary font-semibold">{p.commission} faturamento líquido</td>
                    <td className="py-3 px-2 text-muted-foreground">{p.min}</td>
                    <td className="py-3 px-2 text-muted-foreground">{p.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            ⚠️ Faturamento líquido = total recebido pela plataforma menos custos de gateway. Extrato
            mensal até dia 5, pagamento até dia 10.
          </p>
        </div>
      </section>

      {/* Custos externos */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-3xl font-light tracking-[-0.03em]">🔌 Custos externos repassáveis</h2>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Itens que não estão inclusos no orçamento — pagos diretamente por você ou gerenciados pela
          Dreamscraft com taxa de administração de 10%.
        </p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {external.map((e) => (
            <div key={e.item} className="rounded-2xl border border-border bg-surface/60 p-5">
              <p className="text-sm font-semibold">{e.item}</p>
              <p className="mt-2 text-lg font-bold text-primary">{e.cost}</p>
              <p className="mt-1 text-xs text-muted-foreground">{e.freq}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-surface to-surface-elevated p-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-light tracking-[-0.03em]">Quer um orçamento personalizado?</h2>
          <p className="mt-3 text-muted-foreground">
            Para projetos acima de R$ 30.000, parcelamos em até 3x sem juros.
          </p>
          <Link
            to="/contato"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition glow-ring"
          >
            Solicitar orçamento <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function PricingCardsSection() {
  const [mode, setMode] = useState<BillingMode>("total");

  return (
    <section className="relative bg-[#EFE5FD] text-[#21104E] py-16">
      <div className="absolute top-6 right-6">
        <DreamscraftLogo variant="light" />
      </div>
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start gap-4 mb-8">
          <h2 className="text-3xl sm:text-4xl">Pacotes principais</h2>
          <div
            role="tablist"
            aria-label="Modo de pagamento"
            className="inline-flex items-center gap-1 rounded-full border border-[#21104E]/10 bg-white/60 p-1 font-mono text-xs"
          >
            {(["total", "monthly"] as const).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={`px-4 py-1.5 rounded-full transition-colors ${
                  mode === m
                    ? "bg-[#AF66F9] text-white"
                    : "text-[#21104E]/60 hover:text-[#21104E]"
                }`}
              >
                {m === "total" ? "[ Total ]" : "[ Mensal 6x ]"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {pricingCards.map((card) => {
            const displayValue = mode === "total" ? card.total : card.total / 6;
            const supportTotal = card.supportMonths * card.supportValuePerMonth;
            return (
              <TiltCard
                key={card.tier}
                maxTilt={3}
                glowColor="#AF66F9"
                className="rounded-3xl border border-[#21104E]/10 bg-white p-6 lg:p-8 flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{card.tier}</h3>
                  <span className="font-mono text-[10px] text-[#21104E]/50 uppercase">
                    {mode === "total" ? "à vista" : "parcelado"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[#21104E]/70 min-h-[2.5rem]">
                  {card.tagline}
                </p>

                <div className="mt-6">
                  <div className="text-4xl font-bold text-[#21104E]">
                    <AnimatedPrice value={displayValue} />
                  </div>
                  <p className="mt-1 text-xs text-[#21104E]/60 font-mono">
                    {mode === "total"
                      ? "valor total do projeto"
                      : "por mês · em até 6x sem juros"}
                  </p>
                </div>

                <div className="mt-5 rounded-lg border border-[#21104E]/10 bg-[#21104E]/5 px-3 py-2 text-xs text-[#21104E]">
                  {mode === "total"
                    ? `Inclui ${card.supportMonths} ${card.supportMonths === 1 ? "mês" : "meses"} de suporte gratuito`
                    : `equivale a R$ ${formatBRL(supportTotal)} em suporte incluído`}
                </div>

                <ul className="mt-6 flex flex-wrap gap-2 flex-1 content-start">
                  {card.features.map((f) => (
                    <li
                      key={f}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#21104E]/15 px-3 py-1 text-[11px] text-[#21104E]"
                    >
                      <Check className="h-3 w-3 text-[#AF66F9] shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contato"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:brightness-110 transition"
                >
                  Solicitar proposta <ArrowRight className="h-4 w-4" />
                </Link>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

