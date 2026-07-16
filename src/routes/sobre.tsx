import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { SplitReveal } from "@/components/split-reveal";
import { MagneticButton } from "@/components/MagneticButton";
import { ArrowRight, Code2, Eye, Heart, Layers, MessageSquare, RefreshCw, ShieldCheck, Target, Zap } from "lucide-react";
import { CodeRainBackground } from "@/components/code-rain-background";

export const Route = createFileRoute("/sobre")({
  head: () => {
    const title = "Sobre — Dreamscraft Code";
    const description =
      "Quem somos, por que existimos, nossa visão, missão e valores. Três engenheiros construindo software que dura.";
    const url = "https://dreamscraftcode.com/sobre";
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
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: title,
            description,
            url,
          }),
        },
      ],
    };
  },
  component: SobrePage,
});

type Partner = {
  name: string;
  role: string;
  shortRole: string;
  line: string;
  bio: string;
  initials: string;
  photo?: string; // substitua aqui pela URL da foto (ex: import partnerImg from "@/assets/gabrielle.jpg")
  highlights: string[];
  accent: string; // gradient classes
};

const partners: Partner[] = [
  {
    name: "Gabrielle",
    role: "Co-fundadora · Backend, Arquitetura & Negócios",
    shortRole: "Backend, Arquitetura & Negócios",
    line: "Prefiro uma query SQL bem escrita a mil reuniões. Sistema lento é falha de projeto, não de infra.",
    bio: "Engenheira de software com background em sistemas distribuídos. Responsável pela arquitetura de dados, APIs e decisões técnicas críticas. Também conduz discovery, escopo e a modelagem comercial dos projetos — para que cada decisão técnica tenha lastro de negócio.",
    initials: "GA",
    accent: "from-primary/30 via-primary-glow/20 to-transparent",
    highlights: ["PostgreSQL & RLS", "Node.js / TypeScript", "Discovery & escopo"],
  },
  {
    name: "Evandro",
    role: "Co-fundador · Frontend, Automação & Relacionamento",
    shortRole: "Frontend, Automação & Relacionamento",
    line: "Se um deploy demora mais que café, o processo está errado. Automatizo tudo que posso — e o que não posso, documento.",
    bio: "Desenvolvedor full-stack com obsessão por experiência e performance. Cuida do que o usuário vê e do que faz acontecer por trás — pipelines, integrações, monitoramento. Também é a ponte direta com o cliente: comunicação semanal, demos e a régua que separa promessa de entrega.",
    initials: "EV",
    accent: "from-brand-azul/30 via-primary-glow/20 to-transparent",
    highlights: ["React / React Native", "CI/CD & DX", "Comunicação com cliente"],
  },
];

const values = [
  {
    icon: Code2,
    title: "Engenharia, não digitação",
    text: "Cada decisão técnica é justificada. Não escrevemos linhas; resolvemos problemas com a stack certa para o momento.",
  },
  {
    icon: Heart,
    title: "Clareza acima de apresentação",
    text: "Sem slide bonito escondendo prazo furado. Falamos o que sabemos, admitimos o que não sabemos e atualizamos toda semana.",
  },
  {
    icon: Zap,
    title: "Velocidade com responsabilidade",
    text: "MVP em semanas, não em meses. Mas nunca entregamos tech debt como produto final. Feito e bem feito.",
  },
  {
    icon: Target,
    title: "Resultado mensurável",
    text: "Software que serve negócio. Métrica, retorno, retenção. Se não move ponteiro, não construímos.",
  },
];

const credibilityNumbers = [
  { value: "2", label: "engenheiros seniores" },
  { value: "100%", label: "código próprio, sem caixa preta" },
  { value: "≤2sem", label: "do brief ao primeiro deploy" },
  { value: "0", label: "projetos abandonados pós-entrega" },
];

const promises = [
  "Você fala com quem programa. Sem camadas de gerência traduzindo.",
  "Estimativa em intervalo (otimista / realista / pessimista). Nunca um número mágico.",
  "Demo clicável toda semana. Status meeting morreu aqui.",
  "Código entregue no seu repositório. Sem refém de plataforma.",
  "Documentação técnica viva, não PDF morto.",
  "Suporte pós-deploy combinado em contrato — não 'a gente vê depois'.",
];

function SobrePage() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      {/* Hero / Apresentação */}
      <section className="relative overflow-hidden pt-24 pb-20">
        <CodeRainBackground seed={2} className="opacity-30" />
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-primary-glow">
            // quem.somos
          </p>
        </Reveal>
        <SplitReveal
          as="h1"
          text={"Somos\ndois."}
          className="mt-6 text-6xl sm:text-8xl font-display font-light tracking-[-0.03em] leading-[0.9]"
          withClip
        />
        <Reveal delay={0.9}>
          <p className="mt-10 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
            A <span className="text-foreground font-semibold">Dreamscraft Code</span> é uma
            casa de engenharia fundada por dois sócios que cansaram de ver dinheiro
            bem-intencionado virar lixo digital. Não somos agência. Não somos fábrica de
            apps. Somos um time enxuto que entrega software sério — com a velocidade que
            o mercado pede e a responsabilidade que ele esqueceu.
          </p>
        </Reveal>
        <Reveal delay={1.1}>
          <p className="mt-6 text-base text-muted-foreground/80 leading-relaxed max-w-3xl">
            Somos novos como empresa, mas não como engenheiros. A soma da bagagem do time
            inclui sistemas em produção atendendo milhares de usuários, integrações com
            gateways de pagamento, apps em loja, painéis administrativos críticos e
            arquiteturas que aguentaram o tranco em momentos de pico.
          </p>
        </Reveal>
      </section>

      {/* Os sócios — com espaço para foto */}
      <section className="py-20 border-t border-border">
        <Reveal>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-primary-glow">
                // socios
              </p>
              <h2 className="mt-3 text-4xl sm:text-5xl font-display font-light tracking-[-0.03em]">
                Quem você vai encontrar
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              Reunião com a Dreamscraft é reunião com quem desenha, escreve e mantém o
              código. Sem intermediário.
            </p>
          </div>
        </Reveal>

        <RevealGroup
          as="div"
          className="mt-14 grid gap-8 sm:grid-cols-2 max-w-4xl"
          stagger={0.12}
        >
          {partners.map((p) => (
            <RevealItem key={p.name}>
              <article className="group h-full glass-card rounded-3xl overflow-hidden border border-border/60 hover:border-primary/40 transition-colors">
                {/* SLOT PARA FOTO — substitua o div interno por <img src={p.photo} ... /> */}
                <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${p.accent}`}
                    aria-hidden
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_60%)]" />
                  {/* placeholder visual — troque por <img> */}
                  {p.photo ? (
                    <img
                      src={p.photo}
                      alt={`Foto de ${p.name}`}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <img
                      src={`https://placehold.co/400x500/21104E/AF66F9?text=${p.initials}`}
                      alt={`Foto de ${p.name}`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/90 to-transparent" />
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-display font-semibold tracking-tight">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-xs font-mono uppercase tracking-wider text-primary-glow">
                    {p.shortRole}
                  </p>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    {p.bio}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {p.highlights.map((h) => (
                      <li
                        key={h}
                        className="rounded-full border border-border/60 bg-surface/60 px-2.5 py-1 text-[11px] font-mono text-muted-foreground"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                  <blockquote className="mt-5 border-l-2 border-primary/60 pl-3 text-sm italic text-foreground/80 leading-relaxed">
                    “{p.line}”
                  </blockquote>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Visão / Missão */}
      <section className="py-20 border-t border-border grid lg:grid-cols-2 gap-8">
        <Reveal>
          <div className="glass-card rounded-3xl p-8 h-full relative overflow-hidden">
            <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center h-10 w-10 rounded-xl bg-primary/15 text-primary-glow">
                  <Eye className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow">
                  visão
                </p>
              </div>
              <h3 className="mt-5 text-2xl sm:text-3xl font-display font-semibold tracking-tight leading-tight">
                Ser referência em engenharia de software honesta no Brasil.
              </h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Queremos que a frase “contratei a Dreamscraft” signifique, para o
                mercado, que o cliente é exigente, leva o produto a sério e não tolera
                processo inflado. Construir uma marca em que o nosso nome no rodapé do
                sistema vale recomendação.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="glass-card rounded-3xl p-8 h-full relative overflow-hidden">
            <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-primary-glow/20 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center h-10 w-10 rounded-xl bg-primary/15 text-primary-glow">
                  <Target className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow">
                  missão
                </p>
              </div>
              <h3 className="mt-5 text-2xl sm:text-3xl font-display font-semibold tracking-tight leading-tight">
                Transformar ideias em sistemas que duram — com clareza, velocidade e
                código que não dá vergonha.
              </h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Tirar produto do papel para a loja em semanas. Manter no ar por anos.
                Conversar com o cliente em português, não em jargão. Tratar dinheiro
                dos outros como tratamos o nosso.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Valores */}
      <section className="py-20 border-t border-border">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-primary-glow">
            // valores
          </p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-display font-light tracking-[-0.03em]">
            O que não negociamos
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            Quatro princípios que filtram cliente, projeto e decisão técnica. Tudo o
            que fazemos passa por aqui antes de virar código.
          </p>
        </Reveal>

        <RevealGroup
          as="div"
          className="mt-12 grid sm:grid-cols-2 gap-5"
          stagger={0.1}
        >
          {values.map((v) => (
            <RevealItem key={v.title}>
              <div className="group h-full rounded-2xl border border-border/60 bg-surface/40 p-6 hover:border-primary/40 hover:bg-surface-elevated/50 transition">
                <span className="inline-grid place-items-center h-11 w-11 rounded-xl bg-primary/15 text-primary-glow group-hover:bg-primary/25 transition">
                  <v.icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <h3 className="mt-5 text-xl font-display font-semibold tracking-tight">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {v.text}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Nosso jeito de trabalhar — painel claro emoldurado sobre o fundo escuro */}
      <section className="relative py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-3xl bg-brand-lavender text-brand-indigo py-14 px-6 sm:px-10 shadow-soft-lg">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.4em] opacity-60">
                // processo
              </p>
              <h2 className="mt-3 text-4xl sm:text-5xl font-display font-light tracking-[-0.03em]">
                Nosso jeito de trabalhar
              </h2>
              <p className="mt-4 max-w-2xl opacity-70">
                Quatro regras operacionais que mantêm a entrega rápida e o código limpo —
                desde o primeiro commit até o deploy em produção.
              </p>
            </div>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: RefreshCw,
                title: "Iteração em semanas",
                text: "Entregas curtas de 1–2 semanas. Demo funcional a cada ciclo, não de meses.",
              },
              {
                icon: MessageSquare,
                title: "Comunicação direta",
                text: "Você fala com quem programa. Sem account manager traduzindo requisito.",
              },
              {
                icon: ShieldCheck,
                title: "Qualidade sem cortes",
                text: "Code review, testes automatizados e docs antes de qualquer merge.",
              },
              {
                icon: Layers,
                title: "Transparência total",
                text: "Acesso ao repositório, pipeline visível e deploys diários.",
              },
            ].map((item, i) => (
              <RevealItem key={item.title}>
                <div className="h-full rounded-2xl border border-brand-indigo/10 bg-white/60 p-6">
                  <item.icon className="h-5 w-5" strokeWidth={1.5} />
                  <h3 className="mt-4 text-lg font-display font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm opacity-70 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </RevealItem>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-border">
        <Reveal>
          <div className="glass-card rounded-3xl p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(126,34,206,0.18),transparent_50%)]" />
            <div className="relative">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow">
                // a régua que usamos
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-display font-light tracking-[-0.03em] max-w-2xl">
                Empresa nova, padrão sênior.
              </h2>
              <p className="mt-3 text-muted-foreground max-w-2xl">
                Somos uma estrutura jovem por escolha. Pequena, sem hierarquia inflada,
                com o que importa: senioridade real em quem coloca a mão no código.
              </p>

              <dl className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
                {credibilityNumbers.map((n) => (
                  <div key={n.label} className="border-l border-primary/30 pl-4">
                    <dt className="text-3xl sm:text-4xl font-display font-light text-soft-glow tracking-tight">
                      {n.value}
                    </dt>
                    <dd className="mt-1 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      {n.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Promessas / O que esperar */}
      <section className="py-20 border-t border-border">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-primary-glow">
            // o que você pode cobrar da gente
          </p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-display font-light tracking-[-0.03em] max-w-3xl">
            Seis compromissos por escrito.
          </h2>
        </Reveal>

        <RevealGroup
          as="ul"
          className="mt-12 grid sm:grid-cols-2 gap-4"
          stagger={0.06}
        >
          {promises.map((promise, i) => (
            <RevealItem key={i}>
              <li className="flex items-start gap-4 rounded-2xl border border-border/50 bg-surface/30 p-5 hover:bg-surface-elevated/40 transition">
                <span className="shrink-0 grid place-items-center h-8 w-8 rounded-lg bg-primary/15 font-mono text-xs text-primary-glow">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                  {promise}
                </p>
              </li>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Manifesto link */}
      <section className="py-20 border-t border-border">
        <Reveal>
          <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-transparent to-primary-glow/10 p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute -top-32 -right-20 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
            <div className="relative grid lg:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow">
                  // leitura recomendada
                </p>
                <h3 className="mt-3 text-2xl sm:text-3xl font-display font-semibold tracking-tight">
                  Os 5 princípios que regem cada linha que escrevemos.
                </h3>
                <p className="mt-3 text-muted-foreground max-w-xl">
                  Nosso manifesto é a versão longa do que está acima. Se quiser
                  entender como pensamos antes de marcar uma conversa, vale 3 minutos.
                </p>
              </div>
              <Link
                to="/manifesto"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition glow-ring font-mono uppercase tracking-wider w-fit"
              >
                Ler manifesto <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTA final */}
      <section className="py-24 border-t border-border text-center">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-primary-glow">
            // proximo.passo
          </p>
          <h2 className="mt-4 text-4xl sm:text-6xl font-display font-light tracking-[-0.03em]">
            Vamos conversar?
          </h2>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
            30 minutos. Sem custo. Saímos com diagnóstico claro do que faz sentido
            construir — mesmo que não seja com a gente.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <MagneticButton>
              <Link
                to="/contato"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground hover:opacity-90 transition glow-ring font-mono uppercase tracking-wider"
              >
                Iniciar conversa <ArrowRight className="h-4 w-4" />
              </Link>
            </MagneticButton>
            <Link
              to="/estimar"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/40 px-8 py-4 text-sm font-semibold text-foreground hover:bg-surface-elevated transition font-mono uppercase tracking-wider"
            >
              Estimar projeto
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
