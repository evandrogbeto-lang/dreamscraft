import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { DiagnosticTester } from "@/components/home/diagnostic-tester";
import { HeroGraphism } from "@/components/home/hero-graphism";

export const Route = createFileRoute("/")({
  head: () => {
    const title = "Dreamscraft Code — Sistemas que eliminam o improviso";
    const description =
      "Projetamos sites, plataformas e automações para empresas que cresceram além das planilhas, mensagens soltas e processos manuais.";
    const url = "https://dreamscraftcode.com/";
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
  component: HomePage,
});

const principles = [
  {
    num: "01",
    title: "Diagnóstico antes do código",
    desc: "Entendemos o processo antes de propor a tecnologia.",
  },
  {
    num: "02",
    title: "Decisão sem telefone sem fio",
    desc: "Você conversa diretamente com quem projeta e desenvolve.",
  },
  {
    num: "03",
    title: "Processo visível",
    desc: "Escopo, decisões e entregas documentados do início ao fim.",
  },
] as const;

const problems = [
  {
    num: "01",
    title: "Operação na memória",
    desc: "Mensagens, planilhas e conhecimento solto sustentam o dia a dia — até alguém sair ou o volume crescer.",
  },
  {
    num: "02",
    title: "Atendimento que não escala",
    desc: "Respostas improvisadas funcionam no começo e viram gargalo quando a operação precisa de consistência.",
  },
  {
    num: "03",
    title: "Ideia que precisa virar produto",
    desc: "Há hipótese e urgência, mas falta um caminho verificável da conversa ao primeiro uso real.",
  },
  {
    num: "04",
    title: "Site abaixo do nível da empresa",
    desc: "A presença digital não comunica clareza, processo nem confiança — e atrapalha a conversão.",
  },
] as const;

const processSteps = [
  "Diagnóstico",
  "Arquitetura",
  "Construção",
  "Validação",
  "Entrega e evolução",
] as const;

const projects = [
  {
    num: "01",
    label: "Produto próprio · em evolução",
    title: "Secretária.Code",
    desc: "Atendimento pelo WhatsApp com interpretação, contexto simples e resposta — produto real da Dreamscraft.",
    to: "/portfolio" as const,
  },
  {
    num: "02",
    label: "Produto em construção",
    title: "SaaS de gestão financeira",
    desc: "Sistema próprio em evolução. Nome definitivo sujeito a verificação — aqui mostramos o estado atual, não uma marca fechada.",
    to: "/portfolio" as const,
  },
  {
    num: "03",
    label: "Produto em construção",
    title: "Plataforma de gestão de leads",
    desc: "Construção interna em andamento, apresentada com o mesmo critério: estado real, sem case inventado.",
    to: "/portfolio" as const,
  },
  {
    num: "04",
    label: "Prova de processo · este site",
    title: "Dreamscraft.Code",
    desc: "Design system, estimador, responsividade e handoff — o próprio site como demonstração do processo.",
    to: "/portfolio" as const,
  },
] as const;

const founders = [
  {
    name: "Gabrielle",
    role: "Co-fundadora · Backend, arquitetura e negócios",
  },
  {
    name: "Evandro",
    role: "Co-fundador · Frontend, automação e relacionamento",
  },
] as const;

function HomePage() {
  return (
    <div className="overflow-x-clip bg-background">
      {/* 1–2. Hero + Diagnostic Tester */}
      <section className="relative overflow-x-clip bg-background pt-6 sm:pt-8 lg:pt-10">
        {/* Grafismo oficial — sangramento superior direito (desktop) */}
        <HeroGraphism variant="desktop" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="min-w-0 lg:col-span-7">
              <p className="max-w-full text-[10px] uppercase leading-relaxed tracking-[0.08em] text-brand-branco sm:text-[12px] sm:tracking-[0.16em]">
                Software sob medida · Automação · Produtos digitais
              </p>
              <h1 className="mt-4 max-w-[18ch] text-[clamp(1.75rem,5vw,3.5rem)] font-light uppercase leading-[1.12] tracking-[-0.03em] text-brand-branco sm:mt-5">
                <span className="block">Sistemas que eliminam</span>
                <span className="mt-1 block bg-gradient-to-r from-brand-rosa to-brand-azul bg-clip-text text-transparent">
                  o improviso da sua operação.
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-brand-branco/85 sm:mt-6 sm:text-base">
                Projetamos sites, plataformas e automações para empresas que cresceram além das
                planilhas, mensagens soltas e processos manuais.
              </p>

              <div className="mt-7 hidden lg:block">
                <Link
                  to="/estimar"
                  className="inline-flex min-h-11 items-center rounded-button bg-brand-rosa px-5 text-sm font-medium text-brand-roxo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-branco"
                >
                  Solicitar diagnóstico
                </Link>
              </div>

              {/* Mobile: faixa curta do grafismo oficial, depois tester */}
              <div className="mt-6 space-y-5 lg:hidden">
                <HeroGraphism variant="strip" />
                <DiagnosticTester />
              </div>
            </div>

            <div className="relative z-10 hidden min-w-0 lg:col-span-5 lg:block">
              <DiagnosticTester />
            </div>
          </div>
        </div>

        {/* Transição limpa para a próxima seção */}
        <div className="mt-10 border-t border-brand-branco/10 lg:mt-14" aria-hidden />
      </section>

      {/* 3. Princípios */}
      <section className="bg-surface px-5 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-brand-rosa">
            {"// princípios"}
          </p>
          <RevealGroup className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
            {principles.map((p) => (
              <RevealItem key={p.num} className="border-t border-brand-branco/20 pt-6">
                <p className="text-sm text-brand-azul">{p.num}</p>
                <h2 className="mt-3 text-xl font-light tracking-tight text-brand-branco sm:text-2xl">
                  {p.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-brand-branco/70">{p.desc}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 4. Secretária.Code */}
      <section className="px-5 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.28em] text-brand-azul">
              Produto real · em evolução
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-light tracking-[-0.03em] text-brand-branco sm:text-4xl lg:text-5xl">
              Atendimento pelo WhatsApp,
              <br />
              sem depender de respostas improvisadas.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-branco/75">
              A Secretária.Code interpreta mensagens, mantém o contexto da conversa e responde pelo
              WhatsApp seguindo as regras definidas para o negócio.
            </p>
          </Reveal>

          <Reveal
            delay={0.08}
            className="mt-10 overflow-hidden rounded-2xl border border-brand-branco/15 bg-surface"
          >
            <div className="grid gap-0 md:grid-cols-4">
              {["Mensagem", "Interpretação", "Contexto", "Resposta"].map((step, i) => (
                <div
                  key={step}
                  className="border-b border-brand-branco/10 px-5 py-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
                >
                  <p className="text-xs text-brand-rosa">{String(i + 1).padStart(2, "0")}</p>
                  <p className="mt-3 text-sm text-brand-branco">
                    {step}
                    {i < 3 && (
                      <span className="ml-2 hidden text-brand-azul md:inline" aria-hidden>
                        →
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
            <p className="border-t border-brand-branco/10 px-5 py-3 text-[11px] text-brand-branco/55">
              Fluxo real: mensagem → interpretação → contexto → resposta
            </p>
          </Reveal>

          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.22em] text-brand-azul">
                O que faz hoje
              </p>
              <ul className="mt-4 space-y-3 text-sm text-brand-branco/80">
                {[
                  "recebe mensagens pelo WhatsApp;",
                  "interpreta a solicitação;",
                  "mantém memória simples da conversa;",
                  "gera e envia a resposta.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-brand-rosa" aria-hidden>
                      [✓]
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="text-[11px] uppercase tracking-[0.22em] text-brand-azul">
                Próximos passos
              </p>
              <ul className="mt-4 space-y-3 text-sm text-brand-branco/80">
                {[
                  "memória persistente;",
                  "integrações específicas;",
                  "automações definidas por operação.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-brand-azul" aria-hidden>
                      →
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-10">
            <Link
              to="/portfolio"
              className="inline-flex min-h-11 items-center rounded-lg bg-brand-rosa px-5 text-sm font-medium text-brand-roxo transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-branco"
            >
              Conhecer a Secretária.Code
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 5. Problemas */}
      <section className="border-t border-brand-branco/10 bg-brand-branco px-5 py-16 text-brand-roxo sm:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-brand-rosa">
            {"// problemas que travam a operação"}
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-light tracking-[-0.03em] sm:text-4xl">
            Escolha a dor. Não a stack.
          </h2>
          <RevealGroup className="mt-12 grid gap-0 sm:grid-cols-2">
            {problems.map((p) => (
              <RevealItem
                key={p.num}
                className="border-t border-brand-roxo/15 px-0 py-8 sm:px-6 sm:odd:pl-0 sm:even:pr-0"
              >
                <div className="flex gap-4">
                  <span className="text-sm text-brand-azul">{p.num}</span>
                  <div>
                    <h3 className="text-lg font-medium tracking-tight">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-roxo/75">{p.desc}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 6. Processo resumido */}
      <section id="processo" className="scroll-mt-24 px-5 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-brand-azul">{"// processo"}</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-light tracking-[-0.03em] text-brand-branco sm:text-4xl">
            Diagnóstico → arquitetura → construção → validação → entrega.
          </h2>
          <div className="mt-12 hidden items-start lg:flex">
            {processSteps.map((step, i) => (
              <div key={step} className="relative flex-1">
                {i < processSteps.length - 1 && (
                  <div
                    className="absolute left-4 top-4 h-px w-full bg-brand-branco/25"
                    aria-hidden
                  />
                )}
                <div className="relative z-[1] flex h-8 w-8 items-center justify-center rounded-full border border-brand-rosa bg-background text-[11px] text-brand-rosa">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p className="mt-4 max-w-[10rem] text-sm text-brand-branco">{step}</p>
              </div>
            ))}
          </div>
          <ol className="mt-8 space-y-4 lg:hidden">
            {processSteps.map((step, i) => (
              <li key={step} className="flex items-center gap-4 text-sm text-brand-branco">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-rosa text-[11px] text-brand-rosa">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-brand-branco/70">
            Cada etapa tem entrega verificável. Sem telefone sem fio entre quem decide e quem
            constrói.
          </p>
          <a
            href="#processo"
            className="mt-8 inline-flex min-h-11 items-center text-sm text-brand-rosa underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa"
          >
            Processo resumido nesta página
          </a>
        </div>
      </section>

      {/* 7. Projetos reais */}
      <section className="border-t border-brand-branco/10 bg-surface px-5 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-brand-rosa">
            {"// projetos reais"}
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-light tracking-[-0.03em] text-brand-branco sm:text-4xl">
            Produtos próprios, demonstrações e construções em evolução.
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-brand-branco/70">
            Sem cliente inventado, sem resultado maquiado e sem nome definitivo antes da hora.
          </p>
          <ul className="mt-12 divide-y divide-brand-branco/15 border-y border-brand-branco/15">
            {projects.map((p) => (
              <li key={p.num}>
                <Link
                  to={p.to}
                  className="group grid gap-3 py-7 transition-colors hover:bg-brand-branco/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa sm:grid-cols-[4rem_1fr_auto] sm:items-start sm:gap-6"
                >
                  <span className="text-sm text-brand-azul">{p.num}</span>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-brand-branco/55">
                      {p.label}
                    </p>
                    <h3 className="mt-2 text-xl text-brand-branco group-hover:text-brand-rosa">
                      {p.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-branco/70">
                      {p.desc}
                    </p>
                  </div>
                  <span className="text-sm text-brand-rosa sm:pt-6">Abrir →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8. Fundadores — seção compacta */}
      <section className="px-5 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-brand-azul">
            {"// fundadores"}
          </p>
          <h2 className="mt-4 text-2xl font-light tracking-[-0.03em] text-brand-branco sm:text-3xl">
            Uma dupla complementar.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6">
            {founders.map((f) => (
              <article
                key={f.name}
                className="flex gap-4 rounded-xl border border-brand-branco/15 bg-surface p-4 sm:p-5"
              >
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-[10px] uppercase tracking-[0.12em] text-brand-branco/40"
                  data-placeholder="founder-photo"
                  aria-label={`Espaço reservado para fotografia de ${f.name}`}
                >
                  Foto
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-light text-brand-branco">{f.name}</h3>
                  <p className="mt-1 text-sm text-brand-rosa">{f.role}</p>
                </div>
              </article>
            ))}
          </div>
          <Link
            to="/sobre"
            className="mt-6 inline-flex min-h-11 items-center text-sm text-brand-rosa underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa"
          >
            Sobre a Dreamscraft →
          </Link>
        </div>
      </section>

      {/* 9. Manifesto */}
      <section className="border-y border-brand-branco/10 bg-surface px-5 py-20 sm:px-6 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] uppercase tracking-[0.28em] text-brand-rosa">
            {"// manifesto"}
          </p>
          <blockquote className="mt-8 text-3xl font-light leading-tight tracking-[-0.03em] text-brand-branco sm:text-4xl lg:text-5xl">
            Processo que não se esconde nas entrelinhas.
          </blockquote>
          <Link
            to="/manifesto"
            className="mt-10 inline-flex min-h-11 items-center text-sm text-brand-azul underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa"
          >
            Ler o manifesto →
          </Link>
        </div>
      </section>

      {/* 10. Pioneiro */}
      <section className="px-5 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-brand-amarelo">
            {"// programa pioneiro"}
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-light tracking-[-0.03em] text-brand-branco sm:text-4xl">
            Condições de fundador para os primeiros contratos.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-brand-branco/75">
            Somos uma casa nova por escolha. O Programa Pioneiro concentra prioridade e condições de
            fundador nos primeiros engajamentos — sem countdown inventado e sem promessa absoluta.
            Valores e descontos de serviço são fechados após diagnóstico.
          </p>
          <ul className="mt-10 max-w-2xl divide-y divide-brand-branco/15 border-y border-brand-branco/15">
            {[
              "Prioridade na fila de projetos.",
              "Condições de fundador combinadas na proposta.",
              "Badge de Cliente Fundador, quando aplicável ao contrato.",
              "Para a Secretária.Code, setup e mensalidade pioneiros estão definidos no catálogo do produto.",
            ].map((item, i) => (
              <li key={item} className="flex gap-4 py-5 text-sm text-brand-branco/85">
                <span className="text-brand-amarelo">{String(i + 1).padStart(2, "0")}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/estimar"
              className="inline-flex min-h-11 items-center rounded-lg bg-brand-amarelo px-5 text-sm font-medium text-brand-roxo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-branco"
            >
              Solicitar diagnóstico
            </Link>
            <Link
              to="/contato"
              className="inline-flex min-h-11 items-center rounded-lg border border-brand-branco/25 px-5 text-sm text-brand-branco focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa"
            >
              Falar sobre um projeto
            </Link>
          </div>
        </div>
      </section>

      {/* 11. CTA final */}
      <section className="border-t border-brand-branco/10 bg-surface px-5 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-brand-rosa">
            {"// próximo passo"}
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-light tracking-[-0.03em] text-brand-branco sm:text-5xl">
            Um projeto começa com contexto — não com resposta pronta.
          </h2>
          <p className="mt-5 max-w-2xl text-base text-brand-branco/75">
            Diagnóstico, estimador ou conversa direta. Você fala com quem projeta e desenvolve.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/estimar"
              className="inline-flex min-h-11 items-center rounded-lg bg-brand-branco px-5 text-sm font-medium text-brand-roxo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa"
            >
              Solicitar diagnóstico
            </Link>
            <Link
              to="/contato"
              className="inline-flex min-h-11 items-center rounded-lg border border-brand-branco/30 px-5 text-sm text-brand-branco focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa"
            >
              Entrar em contato
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
