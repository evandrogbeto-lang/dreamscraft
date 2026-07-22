import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { TiltCard } from "@/components/TiltCard";
import { CodeRainBackground } from "@/components/code-rain-background";
import {
  BrandPictogram,
  type PictogramName,
} from "@/components/brand-pictogram";

type Row = {
  level:
    | "Baixa"
    | "Média"
    | "Alta"
    | "Básico"
    | "Profissional"
    | "Enterprise"
    | "Essencial"
    | "Média (MVP)"
    | "Alta (Completo)";
  deadline?: string;
  price: string;
  includes: string;
  example?: string;
};

type Service = {
  icon: PictogramName;
  title: string;
  desc: string;
  headers: string[];
  rows: Row[];
};

const services: Service[] = [
  {
    icon: "documento",
    title: "Site Institucional / Vitrine",
    desc: "Ideal para empresas locais, profissionais liberais e pequenos negócios que querem presença online profissional.",
    headers: ["Complexidade", "Prazo", "Faixa (R$)", "O que inclui", "Exemplo"],
    rows: [
      {
        level: "Baixa",
        deadline: "1-2 semanas",
        price: "1.200 - 2.500",
        includes:
          "Landing page responsiva (3-5 seções), formulário de contato, WhatsApp flutuante, SEO básico, Google Maps",
        example: "Salão, clínica pequena, portfólio profissional",
      },
      {
        level: "Média",
        deadline: "3-5 semanas",
        price: "3.500 - 7.000",
        includes:
          "Até 10 páginas, blog, área administrativa simples, otimização de imagens, captação de leads",
        example: "Escola de cursos, consultório médico, loja de decoração",
      },
      {
        level: "Alta",
        deadline: "6-10 semanas",
        price: "8.000 - 18.000",
        includes:
          "Login de usuários, integração WhatsApp API, agendamentos, dashboard personalizado, módulos internos",
        example: "Clube de assinatura, plataforma de cursos, portal de notícias",
      },
    ],
  },
  {
    icon: "dinheiro",
    title: "E-commerce / SaaS",
    desc: "Para quem quer vender online ou cobrar mensalidades recorrentes.",
    headers: ["Complexidade", "Prazo", "Faixa (R$)", "O que inclui", "Exemplo"],
    rows: [
      {
        level: "Média",
        deadline: "6-10 semanas",
        price: "8.000 - 18.000",
        includes:
          "Catálogo, carrinho, checkout (Pix/cartão), gestão de pedidos, cupons, frete integrado",
        example: "Loja de roupas, produtos digitais, artesanato",
      },
      {
        level: "Alta",
        deadline: "12-20 semanas",
        price: "20.000 - 50.000+",
        includes:
          "Marketplace multi-vendedor, assinaturas SaaS, split de pagamento, dashboard analítico, automação de cobrança",
        example: "Marketplace de serviços, SaaS de gestão, clube de assinaturas",
      },
    ],
  },
  {
    icon: "celular",
    title: "Aplicativo Mobile (iOS + Android)",
    desc: "React Native / Flutter — um único código para ambas as lojas.",
    headers: ["Complexidade", "Prazo", "Faixa (R$)", "O que inclui", "Exemplo"],
    rows: [
      {
        level: "Média (MVP)",
        deadline: "6-10 semanas",
        price: "12.000 - 25.000",
        includes:
          "Cadastro, login, módulo principal, push notification, integração com API, painel admin básico",
        example: "App de tarefas, delivery simples, fidelidade de clientes",
      },
      {
        level: "Alta (Completo)",
        deadline: "12-20 semanas",
        price: "25.000 - 70.000",
        includes:
          "App + painel web completo, GPS em tempo real, chat, pagamentos integrados, validação por IA, publicação nas lojas",
        example: "App de fretes, marketplace, Uber-like, clube de vantagens",
      },
    ],
  },
  {
    icon: "link",
    title: "Bots (WhatsApp / Telegram / Instagram)",
    desc: "Automatize atendimento, vendas, notificações e fluxos.",
    headers: ["Complexidade", "Prazo", "Faixa (R$)", "O que inclui", "Exemplo"],
    rows: [
      {
        level: "Baixa",
        deadline: "1-2 semanas",
        price: "800 - 2.500",
        includes:
          "Respostas automáticas (menu interativo), envio de catálogo, captura de leads",
        example: "Atendimento básico, cardápio digital",
      },
      {
        level: "Média",
        deadline: "3-6 semanas",
        price: "3.000 - 8.000",
        includes:
          "Bot com integração a banco de dados, agendamentos, cobrança via link de pagamento, notificações",
        example: "Agendamento de serviços, e-commerce via WhatsApp",
      },
      {
        level: "Alta",
        deadline: "6-10 semanas",
        price: "8.000 - 20.000",
        includes:
          "Bot com IA, fluxos condicionais complexos, integração com ERP, dashboard de análise",
        example: "Suporte empresarial, automação de vendas B2B",
      },
    ],
  },
  {
    icon: "cadeado",
    title: "Planos de Manutenção Recorrente",
    desc: "Opcional. O código e o repositório são seus — a manutenção é um plano à parte se quiser que a gente continue cuidando do que está no ar.",
    headers: ["Plano", "Mensal (R$)", "Inclui"],
    rows: [
      {
        level: "Básico",
        price: "390",
        includes:
          "Hospedagem leve, backups semanais, correção de bugs críticos (até 2h/mês)",
      },
      {
        level: "Essencial",
        price: "790",
        includes:
          "Básico + pequenas alterações (texto, imagem, cor) até 4h/mês, monitoramento 24/7",
      },
      {
        level: "Profissional",
        price: "1.490",
        includes:
          "Essencial + alterações ilimitadas (não estruturais) + suporte em até 12h úteis + relatório mensal",
      },
      {
        level: "Enterprise",
        price: "2.490",
        includes:
          "Profissional + 1 nova funcionalidade/mês + Google Maps incluso + consultoria estratégica mensal",
      },
    ],
  },
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
    Básico: "bg-brand-azul/10 text-brand-azul border-brand-azul/20",
    Essencial: "bg-brand-azul/10 text-brand-azul border-brand-azul/20",
    Profissional: "bg-brand-rosa/15 text-brand-rosa border-brand-rosa/30",
    Enterprise: "bg-brand-rosa/10 text-brand-rosa border-brand-rosa/20",
  };
  return map[level] ?? "bg-surface text-foreground border-border";
}

export const Route = createFileRoute("/precos")({
  head: () => {
    const title = "Tabela de Preços — Dreamscraft Code";
    const description =
      "Faixas honestas por complexidade: sites, e-commerce, apps, bots e manutenção opcional. Sem pacote inventado.";
    const url = "https://dreamscraftcode.com/precos";
    const image = "https://dreamscraftcode.com/og-image.png";
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
    };
  },
  component: PrecosPage,
});

function PrecosPage() {
  return (
    <div>
      <section className="relative overflow-hidden mx-auto max-w-7xl px-6 pt-20 pb-12">
        <CodeRainBackground seed={6} palette="rosa-amarelo" className="opacity-35" />
        <Reveal>
          <p className="text-sm font-mono text-brand-amarelo">// precos</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-2 text-5xl sm:text-6xl font-light tracking-[-0.03em] max-w-3xl text-gradient">
            Faixas honestas por complexidade
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            Números de referência para orientar a conversa — o orçamento fechado sai
            depois do brief. Código entregue no seu repositório; manutenção é opcional.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-amarelo/30 bg-brand-amarelo/10 px-4 py-1.5 text-xs text-brand-amarelo font-mono">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            valores vigentes por 30 dias a partir da consulta
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12 space-y-6">
        {services.map((svc, i) => (
          <motion.div
            key={svc.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: i * 0.03 }}
          >
            <TiltCard
              maxTilt={3}
              className="rounded-3xl border border-border bg-surface/60 overflow-hidden"
            >
              <div className="p-6 lg:p-8 border-b border-border">
                <h2 className="text-2xl font-light tracking-[-0.03em] inline-flex items-center gap-3">
                  <BrandPictogram
                    name={svc.icon}
                    color={svc.icon === "cadeado" ? "azul" : "amarelo"}
                    size={28}
                  />
                  {svc.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{svc.desc}</p>
              </div>
              <div className="md:hidden space-y-3 p-4">
                {svc.rows.map((r, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-primary/20 bg-surface p-4 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`inline-flex rounded-sm border px-2.5 py-1 text-xs font-medium font-mono ${levelBadge(r.level)}`}
                      >
                        {r.level}
                      </span>
                      <span className="font-semibold font-mono text-brand-rosa text-sm">
                        R$ {r.price}
                      </span>
                    </div>
                    {r.deadline !== undefined && (
                      <p className="font-mono text-xs text-muted-foreground">
                        <span className="text-primary-glow">{`// prazo`}</span>{" "}
                        {r.deadline}
                      </p>
                    )}
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-primary-glow">
                        // o que inclui
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        {r.includes}
                      </p>
                    </div>
                    {r.example && (
                      <p className="text-xs text-muted-foreground/80 italic font-mono">
                        <span className="not-italic text-primary-glow/80">{`// ex`}</span>{" "}
                        {r.example}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="hidden md:block overflow-x-auto">
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
            </TiltCard>
          </motion.div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-mono text-brand-azul">// custos.externos</p>
          <h2 className="mt-2 text-3xl font-light tracking-[-0.03em]">
            Custos externos repassáveis
          </h2>
          <p className="mt-2 text-muted-foreground">
            Itens pagos a terceiros (domínio, lojas, APIs) — você paga direto ou a
            Dreamscraft gerencia com taxa de administração de 10%.
          </p>
          <ul className="mt-8 divide-y divide-border/50 border-y border-border/50">
            {external.map((e) => (
              <li
                key={e.item}
                className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              >
                <span className="text-sm text-foreground/90">{e.item}</span>
                <span className="flex shrink-0 items-baseline gap-3 font-mono text-sm">
                  <span className="font-semibold text-brand-rosa">{e.cost}</span>
                  <span className="text-xs text-muted-foreground">{e.freq}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl border border-brand-rosa/25 bg-gradient-to-br from-surface-elevated to-surface p-10 text-center relative overflow-hidden">
          <div className="pointer-events-none absolute -top-20 right-0 h-56 w-56 rounded-full bg-brand-amarelo/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-0 h-56 w-56 rounded-full bg-brand-rosa/20 blur-3xl" />
          <div className="relative">
            <p className="text-sm font-mono text-brand-rosa">// proximo.passo</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-light tracking-[-0.03em]">
              Quer um orçamento personalizado?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Descreva a ideia no estimador — a gente devolve faixa de prazo e
              investimento a partir do seu brief.
            </p>
            <Link
              to="/estimar"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition glow-ring"
            >
              Descrever minha ideia <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
