import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  diagnosticToSearchParams,
  saveDiagnosticContext,
} from "@/lib/diagnostic-context";
import {
  BrandDepthReveal,
  DepthLayer,
  DiagnosticFormPresence,
  DiagnosticPainSignal,
  DiagnosticRailScrub,
  DiagnosticSurfaceScrub,
  HeroDepthLayer,
  HeroFluxoSistemaMark,
  HomeConnectorY,
  HomeMotionRoot,
  HomeReveal,
  ManifestoAccentRail,
  ProcessProgressRail,
  ProcessStepLabel,
  ProcessStepTick,
  Scrub,
  ScrollTextReveal,
  SECTION_OFFSET_CLOSE,
  SECTION_OFFSET_PROJECTS,
  SECTION_OFFSET_SOLUTIONS,
  SECTION_OFFSET_TALL,
  SECTION_OFFSET_TEAM,
  SignalConnector,
  SignalStep,
  SignalTravelPulse,
  SolutionLine,
  TeamLineReveal,
  useHeroScrollDepth,
  useProcessScrollProgress,
  useSectionDepth,
  useSectionProgress,
} from "@/components/home/home-motion";

export const Route = createFileRoute("/")({
  head: () => {
    const title = "Dreamscraft Code — Sistemas que tiram o improviso do centro da operação";
    const description =
      "Projetamos sites, plataformas e automações a partir do problema real — não da ferramenta da moda.";
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

const MIN_REPORT = 12;

const heroLogic = [
  {
    step: "01 · Problema",
    prompt: "O que está travando?",
    surface: "bg-brand-branco text-brand-roxo",
    label: "text-brand-rosa",
    offset: "md:ml-8 lg:ml-10",
  },
  {
    step: "02 · Contexto",
    prompt: "O que precisa funcionar?",
    surface: "bg-brand-azul text-brand-branco",
    label: "text-brand-branco/80",
    offset: "md:ml-0 lg:-ml-2",
  },
  {
    step: "03 · Sistema",
    prompt: "Só então a solução.",
    surface: "bg-brand-rosa text-brand-roxo",
    label: "text-brand-roxo/70",
    offset: "md:ml-6 lg:ml-8",
  },
] as const;

const pains = [
  {
    num: "01",
    accent: "text-brand-rosa",
    text: "Mensagens, planilhas e memória viraram a operação.",
  },
  {
    num: "02",
    accent: "text-brand-azul",
    text: "Atendimento cresce, mas o processo não acompanha.",
  },
  {
    num: "03",
    accent: "text-brand-rosa",
    text: "Uma ideia precisa virar produto utilizável.",
  },
  {
    num: "04",
    accent: "text-brand-azul",
    text: "O site não representa mais o nível da empresa.",
  },
] as const;

const solutions = [
  {
    num: "01",
    accent: "text-brand-rosa",
    title: "Automação e atendimento",
    desc: "Fluxos e respostas organizadas para reduzir improviso.",
  },
  {
    num: "02",
    accent: "text-brand-azul",
    title: "Sistemas sob medida",
    desc: "Operações, permissões e dados reunidos em uma experiência própria.",
  },
  {
    num: "03",
    accent: "text-brand-azul",
    title: "Produtos digitais",
    desc: "Da hipótese ao produto utilizável, com validação antes de escalar.",
  },
  {
    num: "04",
    accent: "text-brand-azul",
    title: "Sites institucionais",
    desc: "Clareza, conteúdo e presença para representar melhor a empresa.",
  },
] as const;

const secretariaFlow = [
  { num: "01", title: "Mensagem", note: "recebe", accent: "text-brand-rosa" },
  { num: "02", title: "Interpretação", note: "organiza", accent: "text-brand-azul" },
  { num: "03", title: "Contexto", note: "mantém", accent: "text-brand-rosa" },
  { num: "04", title: "Resposta", note: "encaminha", accent: "text-brand-azul" },
] as const;

const processSteps = [
  { num: "01", label: "Diagnóstico", tick: "bg-brand-rosa", numColor: "text-brand-rosa" },
  { num: "02", label: "Planejamento", tick: "bg-brand-azul", numColor: "text-brand-azul" },
  { num: "03", label: "Construção", tick: "bg-brand-rosa", numColor: "text-brand-rosa" },
  { num: "04", label: "Entrega", tick: "bg-brand-azul", numColor: "text-brand-azul" },
  { num: "05", label: "Evolução", tick: "bg-brand-rosa", numColor: "text-brand-rosa" },
] as const;

const osPillars = ["Estratégia", "Governança", "Documentação", "Operação"] as const;

/** Única entrada de diagnóstico no conteúdo da Home → handoff para /estimar. */
function HomeDiagnosticEntry() {
  const navigate = useNavigate();
  const fieldId = useId();
  const errorId = useId();
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const trimmed = description.trim();
      if (trimmed.length < MIN_REPORT) {
        setError("Descreva o que acontece hoje com pelo menos algumas palavras.");
        return;
      }
      const ctx = saveDiagnosticContext({ description: trimmed });
      void navigate({
        to: "/estimar",
        search: diagnosticToSearchParams(ctx),
      });
    },
    [description, navigate],
  );

  return (
    <form
      onSubmit={onSubmit}
      className="group relative overflow-hidden rounded-xl border border-brand-branco/10 bg-brand-branco transition-[border-color] duration-300 focus-within:border-brand-rosa/60"
      noValidate
    >
      <div
        className="absolute inset-y-0 left-0 w-1.5 bg-brand-rosa/70 transition-[width,background-color] duration-300 group-focus-within:w-2 group-focus-within:bg-brand-rosa"
        aria-hidden
      />
      <div className="grid gap-6 px-5 py-6 pl-7 sm:px-7 sm:py-7 sm:pl-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.22em] text-brand-rosa">
            Diagnóstico inicial
          </p>
          <label
            htmlFor={fieldId}
            className="mt-3 block text-xl font-light tracking-tight text-brand-roxo sm:text-2xl"
          >
            O que está travando ou improvisado hoje?
          </label>
          <input
            id={fieldId}
            name="descricao"
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Descreva em uma frase…"
            autoComplete="off"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className="mt-4 w-full border-0 border-b border-brand-roxo/20 bg-transparent pb-2 text-sm text-brand-roxo placeholder:text-brand-azul/80 transition-colors duration-300 focus:border-brand-rosa focus:outline-none focus:ring-0 sm:text-[15px]"
          />
          {error ? (
            <p id={errorId} role="alert" className="mt-2 text-xs text-brand-rosa">
              {error}
            </p>
          ) : null}
        </div>
        <button
          type="submit"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-button bg-brand-rosa px-6 text-sm font-medium text-brand-roxo transition-[transform,filter] duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:brightness-110 active:scale-[0.99] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-roxo motion-reduce:transform-none lg:w-auto lg:min-w-[14rem]"
        >
          Analisar cenário →
        </button>
      </div>
    </form>
  );
}

function HomePage() {
  return (
    <HomeMotionRoot>
      <HomePageContent />
    </HomeMotionRoot>
  );
}

function HomeProcessDesktop() {
  const railRef = useRef<HTMLDivElement>(null);
  const { progress, reduce } = useProcessScrollProgress(railRef);

  return (
    <div ref={railRef} className="mt-12 max-[1099px]:hidden">
      <ol className="sr-only">
        {processSteps.map((step) => (
          <li key={`a11y-${step.label}`}>
            {step.num} {step.label}
          </li>
        ))}
      </ol>
      <div className="grid grid-cols-5 gap-x-4">
        {processSteps.map((step, index) => (
          <ProcessStepLabel
            key={`n-${step.label}`}
            progress={progress}
            index={index}
            total={processSteps.length}
            className={`text-xs ${step.numColor}`}
          >
            <span aria-hidden>{step.num}</span>
          </ProcessStepLabel>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-5 gap-x-4" aria-hidden>
        {processSteps.map((step, index) => (
          <ProcessStepTick
            key={`t-${step.label}`}
            progress={progress}
            index={index}
            total={processSteps.length}
            className={`block h-1.5 w-20 max-w-full rounded-sm ${step.tick}`}
          />
        ))}
      </div>
      <div className="relative mt-3 h-px w-full bg-brand-branco/20" aria-hidden>
        <ProcessProgressRail
          progress={progress}
          reduce={reduce}
          className="absolute inset-y-0 left-0 h-px w-full origin-left bg-brand-rosa [transform-box:fill-box]"
        />
      </div>
      <div className="mt-4 grid grid-cols-5 gap-x-4">
        {processSteps.map((step, index) => (
          <ProcessStepLabel
            key={`l-${step.label}`}
            progress={progress}
            index={index}
            total={processSteps.length}
            className="text-sm uppercase tracking-[0.04em] text-brand-branco"
          >
            <span aria-hidden>{step.label}</span>
          </ProcessStepLabel>
        ))}
      </div>
    </div>
  );
}

function HomePageContent() {
  const [heroPlay, setHeroPlay] = useState(false);
  const { headlineY, bodyY, structureY, structureOpacity, structureScale } =
    useHeroScrollDepth();

  const diagRef = useRef<HTMLDivElement>(null);
  const solRef = useRef<HTMLDivElement>(null);
  const secRef = useRef<HTMLDivElement>(null);
  const projRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLDivElement>(null);
  const procSectionRef = useRef<HTMLDivElement>(null);

  const { progress: diagP, reduce: diagReduce } = useSectionProgress(
    diagRef,
    SECTION_OFFSET_TALL,
  );
  const { progress: solP } = useSectionProgress(solRef, SECTION_OFFSET_SOLUTIONS);
  const { progress: secP } = useSectionProgress(secRef, SECTION_OFFSET_TALL);
  const { progress: projP } = useSectionProgress(projRef, SECTION_OFFSET_PROJECTS);
  const { progress: teamP } = useSectionProgress(teamRef, SECTION_OFFSET_TEAM);
  const { progress: closeP } = useSectionProgress(closeRef, SECTION_OFFSET_CLOSE);
  const { progress: procSectionP } = useSectionProgress(procSectionRef, SECTION_OFFSET_TALL);

  const { headlineY: diagHeadY, bodyY: diagBodyY, visualY: diagVisualY } = useSectionDepth(
    diagP,
    diagReduce,
  );

  useEffect(() => {
    const id = window.setTimeout(() => setHeroPlay(true), 40);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="overflow-x-clip bg-background">
      {/* Hero — pictograma mount-once + depth / exit presence */}
      <section
        aria-labelledby="home-hero-heading"
        className="px-5 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-14"
      >
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <HomeReveal immediate delay={0} y={22} duration={0.55}>
              <p className="text-[11px] uppercase tracking-[0.16em] text-brand-rosa sm:text-[12px] sm:tracking-[0.18em]">
                Software sob medida · Automação · Produtos digitais
              </p>
            </HomeReveal>
            <HeroDepthLayer y={headlineY}>
              <HomeReveal immediate delay={0.08} y={24} duration={0.7}>
                <h1
                  id="home-hero-heading"
                  className="mt-5 max-w-[46rem] text-[clamp(1.85rem,1.2rem+3.4vw,4.375rem)] font-light uppercase leading-[1.08] tracking-[-0.03em] text-brand-branco"
                >
                  Sistemas que tiram o improviso do centro da operação.
                </h1>
              </HomeReveal>
            </HeroDepthLayer>
            <HeroDepthLayer y={bodyY}>
              <HomeReveal immediate delay={0.18} y={20} duration={0.6}>
                <p className="mt-6 max-w-[42rem] text-sm leading-relaxed text-brand-branco/85 sm:text-base sm:leading-7">
                  Projetamos sites, plataformas e automações a partir do problema real — não da
                  ferramenta da moda.
                </p>
              </HomeReveal>
            </HeroDepthLayer>
          </div>

          <aside className="min-w-0 lg:col-span-5 lg:pt-2">
            <HeroDepthLayer
              y={structureY}
              opacity={structureOpacity}
              scale={structureScale}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4 lg:flex-col lg:items-start xl:flex-row xl:items-center">
                <HomeReveal immediate delay={0.12} y={12} duration={0.5} className="shrink-0">
                  <HeroFluxoSistemaMark
                    play={heroPlay}
                    className="h-9 w-[4.95rem] text-brand-azul sm:h-10 sm:w-[5.5rem]"
                  />
                </HomeReveal>
                <HomeReveal immediate delay={0.2} y={14} duration={0.5}>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-brand-azul">
                    Como o problema ganha forma
                  </p>
                </HomeReveal>
              </div>

              <ol className="mt-5 space-y-0">
                {heroLogic.map((item, index) => (
                  <li key={item.step} className={item.offset}>
                    {index > 0 ? (
                      <div className="flex h-6 items-stretch pl-8" aria-hidden>
                        <HomeConnectorY
                          className={`w-0.5 ${index === 1 ? "bg-brand-azul" : "bg-brand-rosa"}`}
                          active={heroPlay}
                          delay={0.95 + (index - 1) * 0.28}
                          duration={0.42}
                        />
                      </div>
                    ) : null}
                    <HomeReveal immediate delay={0.88 + index * 0.28} y={26} duration={0.55}>
                      <div className={`px-5 py-4 sm:px-6 sm:py-5 ${item.surface}`}>
                        <p className={`text-[11px] uppercase tracking-[0.16em] ${item.label}`}>
                          {item.step}
                        </p>
                        <p className="mt-2 text-lg leading-snug tracking-tight sm:text-xl">
                          {item.prompt}
                        </p>
                      </div>
                    </HomeReveal>
                  </li>
                ))}
              </ol>
              <HomeReveal immediate delay={1.85} y={14} duration={0.5}>
                <p className="mt-5 text-sm text-brand-azul md:pl-8">small team, big systems.</p>
              </HomeReveal>
            </HeroDepthLayer>
          </aside>
        </div>
      </section>

      {/* Diagnóstico — scrub local: rail → sinais → ação */}
      <section
        aria-labelledby="home-diagnostic-heading"
        className="px-5 pb-16 sm:px-6 sm:pb-20 lg:pb-24"
      >
        <div ref={diagRef} className="mx-auto max-w-[1240px]">
          <DepthLayer y={diagHeadY}>
            <BrandDepthReveal progress={diagP} at={[0.0, 0.2]} y={18} floor={0.8}>
              <p className="text-[11px] uppercase tracking-[0.22em] text-brand-rosa">
                O problema vem primeiro
              </p>
            </BrandDepthReveal>
          </DepthLayer>

          <DepthLayer y={diagVisualY}>
            <DiagnosticSurfaceScrub
              progress={diagP}
              className="relative mt-6 overflow-hidden rounded-sm bg-brand-branco text-brand-roxo"
            >
              <DiagnosticRailScrub
                progress={diagP}
                className="absolute inset-y-0 left-0 w-1.5 bg-brand-rosa"
              />
              <div className="grid gap-10 px-5 py-10 pl-7 sm:px-8 sm:py-12 sm:pl-9 lg:grid-cols-12 lg:gap-12 lg:px-10 lg:py-14 lg:pl-11">
                <DepthLayer y={diagBodyY} className="min-w-0 lg:col-span-5">
                  <Scrub
                    progress={diagP}
                    at={[0.06, 0.26]}
                    y={20}
                    floor={0.76}
                    scale={0.985}
                  >
                    <p className="text-[11px] uppercase tracking-[0.2em] text-brand-azul">
                      Quando vale parar e organizar
                    </p>
                    <h2
                      id="home-diagnostic-heading"
                      className="mt-5 max-w-[12ch] text-[clamp(1.75rem,3vw,3rem)] font-light uppercase leading-[1.12] tracking-[-0.03em]"
                    >
                      Diagnóstico antes do código.
                    </h2>
                    <p className="mt-6 max-w-sm text-sm leading-relaxed text-brand-azul sm:text-[15px] sm:leading-7">
                      Entender o processo vem antes de propor tecnologia.
                    </p>
                    <p className="mt-8 max-w-xs text-xs leading-relaxed text-brand-roxo/75 sm:text-[13px]">
                      Sem “stack primeiro”.
                      <br />
                      Sem cardápio de tecnologia.
                      <br />
                      O problema define o caminho.
                    </p>
                  </Scrub>
                </DepthLayer>

                <ul className="min-w-0 divide-y divide-brand-roxo/12 border-y border-brand-roxo/12 lg:col-span-7 lg:border-l lg:border-y-0 lg:border-brand-roxo/10 lg:pl-10">
                  {pains.map((pain, index) => (
                    <DiagnosticPainSignal
                      key={pain.num}
                      progress={diagP}
                      index={index}
                      className="grid grid-cols-[2.75rem_1fr] gap-3 py-5 sm:grid-cols-[3rem_1fr] sm:gap-5 sm:py-6"
                    >
                      <span className={`text-sm sm:text-[15px] ${pain.accent}`}>{pain.num}</span>
                      <p className="text-[15px] leading-snug tracking-tight sm:text-lg sm:leading-7">
                        {pain.text}
                      </p>
                    </DiagnosticPainSignal>
                  ))}
                </ul>
              </div>
            </DiagnosticSurfaceScrub>
          </DepthLayer>

          <DiagnosticFormPresence progress={diagP} className="mt-6 sm:mt-8">
            <HomeDiagnosticEntry />
          </DiagnosticFormPresence>
        </div>
      </section>

      {/* Soluções — line reveal + sequential items (bidirectional; no letter reveal) */}
      <section aria-labelledby="home-solutions-heading" className="px-5 py-16 sm:px-6 lg:py-24">
        <div ref={solRef} className="mx-auto max-w-[1240px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-brand-rosa">
                Caminhos possíveis
              </p>
              <h2
                id="home-solutions-heading"
                className="mt-5 max-w-[22ch] text-[clamp(1.6rem,3.2vw,3.125rem)] font-light uppercase leading-[1.1] tracking-[-0.03em] text-brand-branco"
              >
                <TeamLineReveal
                  progress={solP}
                  at={[0.0, 0.14]}
                  y={28}
                  floor={0.7}
                  scale={0.985}
                  className="block"
                >
                  Uma empresa pode
                </TeamLineReveal>
                <TeamLineReveal
                  progress={solP}
                  at={[0.08, 0.22]}
                  y={28}
                  floor={0.7}
                  scale={0.985}
                  className="block"
                >
                  precisar de coisas
                </TeamLineReveal>
                <TeamLineReveal
                  progress={solP}
                  at={[0.16, 0.3]}
                  y={28}
                  floor={0.7}
                  scale={0.985}
                  className="block"
                >
                  muito diferentes.
                </TeamLineReveal>
              </h2>
            </div>
            <Scrub
              progress={solP}
              at={[0.22, 0.34]}
              y={16}
              floor={0.72}
              scale={0.99}
            >
              <p className="max-w-[14rem] text-sm leading-6 text-brand-azul lg:text-right lg:text-base">
                A solução muda.
                <br />
                O critério não.
              </p>
            </Scrub>
          </div>

          <ul className="mt-12 border-t border-brand-branco/20 sm:mt-14">
            {solutions.map((item, index) => (
              <SolutionLine
                key={item.num}
                progress={solP}
                index={index}
                num={item.num}
                title={item.title}
                desc={item.desc}
                accent={item.accent}
                className="group relative grid gap-2 border-b border-brand-branco/20 py-6 pl-3 transition-[border-color] duration-300 hover:border-brand-rosa/45 sm:grid-cols-[3rem_minmax(0,18rem)_1fr] sm:items-baseline sm:gap-6 sm:py-7 sm:pl-4"
              />
            ))}
          </ul>
        </div>
      </section>

      {/* Secretária — sinal acompanha scroll (crossfade suave) */}
      <section
        aria-labelledby="home-secretaria-heading"
        className="bg-brand-branco px-5 py-16 text-brand-roxo sm:px-6 lg:py-24"
      >
        <div ref={secRef} className="mx-auto max-w-[1240px]">
          <Scrub progress={secP} at={[0.0, 0.2]} y={20} floor={0.78} scale={0.99}>
            <p className="text-[11px] uppercase tracking-[0.22em] text-brand-azul">
              Produto próprio · em evolução
            </p>
            <h2
              id="home-secretaria-heading"
              className="mt-4 text-[clamp(1.75rem,4vw,3.875rem)] font-light uppercase leading-[1.05] tracking-[-0.03em]"
            >
              Secretária.Code
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-brand-roxo/85 sm:text-base sm:leading-7">
              Uma camada de organização entre mensagem, contexto e resposta.
            </p>
          </Scrub>

          <div className="mt-12 grid gap-5 lg:mt-14 lg:grid-cols-12 lg:gap-6">
            <div className="relative bg-brand-roxo p-6 text-brand-branco sm:p-8 lg:col-span-5">
              <SignalTravelPulse
                progress={secP}
                className="pointer-events-none absolute left-0 h-8 w-1.5 -translate-y-1/2 rounded-sm bg-brand-rosa shadow-[0_0_18px_rgba(175,102,249,0.45)]"
              />
              <p className="text-[11px] uppercase tracking-[0.2em] text-brand-rosa">Fluxo visível</p>
              <ol className="mt-8 space-y-0">
                {secretariaFlow.map((step, index) => (
                  <li key={step.title}>
                    <SignalStep progress={secP} index={index}>
                      <div className="grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-3">
                        <span className={`text-xs ${step.accent}`}>{step.num}</span>
                        <p className="text-lg uppercase tracking-tight sm:text-xl">{step.title}</p>
                        <span className="text-[11px] text-brand-azul">{step.note}</span>
                      </div>
                    </SignalStep>
                    {index < secretariaFlow.length - 1 ? (
                      <SignalConnector
                        progress={secP}
                        afterIndex={index}
                        className="py-2 pl-10 text-brand-rosa"
                      />
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col border border-brand-roxo/20 p-6 sm:p-8 lg:col-span-7">
              <Scrub progress={secP} at={[0.14, 0.32]} y={20} floor={0.72} scale={0.99}>
                <p className="text-[11px] uppercase tracking-[0.18em] text-brand-roxo">
                  O que faz hoje
                </p>
                <p className="mt-4 text-sm leading-7 text-brand-roxo/90 sm:text-[15px]">
                  Recebe mensagens · interpreta a solicitação · mantém memória simples · gera e
                  envia a resposta.
                </p>
              </Scrub>
              <Scrub
                progress={secP}
                at={[0.4, 0.55]}
                y={0}
                floor={0.75}
                className="mt-8 border-t border-brand-roxo/15 pt-8"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-brand-roxo">
                  Próximos passos
                </p>
                <p className="mt-4 text-sm leading-7 text-brand-roxo/90 sm:text-[15px]">
                  Memória persistente · integrações específicas · automações definidas por
                  operação.
                </p>
              </Scrub>
              <Scrub progress={secP} at={[0.58, 0.74]} y={18} floor={0.72} className="mt-auto sm:mt-10">
                <div className="bg-brand-azul px-5 py-4 text-brand-branco">
                  <p className="text-[11px] uppercase tracking-[0.16em]">Status real sempre visível</p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-branco/90">
                    Evolução não é apresentada como funcionalidade pronta.
                  </p>
                </div>
              </Scrub>
            </div>
          </div>
        </div>
      </section>

      {/* Processo */}
      <section
        id="processo"
        aria-labelledby="home-process-heading"
        className="scroll-mt-24 px-5 py-16 sm:px-6 lg:py-20"
      >
        <div ref={procSectionRef} className="mx-auto max-w-[1240px]">
          <Scrub progress={procSectionP} at={[0.0, 0.24]} y={22} floor={0.78} scale={0.99}>
            <p className="text-[11px] uppercase tracking-[0.22em] text-brand-rosa">Processo visível</p>
            <h2
              id="home-process-heading"
              className="mt-5 max-w-[20ch] text-[clamp(1.6rem,3.2vw,3.125rem)] font-light uppercase leading-[1.1] tracking-[-0.03em] text-brand-branco"
            >
              Clareza antes, durante e depois da construção.
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-brand-branco/80 sm:text-base sm:leading-7">
              O objetivo não é encher o projeto de cerimônia. É evitar decisão perdida e expectativa
              implícita.
            </p>
          </Scrub>

          <HomeProcessDesktop />

          <div className="min-[1100px]:hidden">
            <ol className="mt-12 hidden grid-cols-2 gap-x-8 gap-y-8 md:grid md:grid-cols-3">
              {processSteps.map((step, index) => (
                <Scrub
                  key={`t-${step.label}`}
                  as="li"
                  progress={procSectionP}
                  at={[0.18 + index * 0.06, 0.3 + index * 0.06]}
                  y={16}
                  floor={0.74}
                  className="min-w-0"
                >
                  <p className={`text-xs ${step.numColor}`}>{step.num}</p>
                  <span className={`mt-3 block h-1.5 w-14 rounded-sm ${step.tick}`} aria-hidden />
                  <p className="mt-3 text-sm uppercase tracking-[0.04em] text-brand-branco">
                    {step.label}
                  </p>
                </Scrub>
              ))}
            </ol>

            <ol className="mt-10 space-y-5 md:hidden">
              {processSteps.map((step, index) => (
                <Scrub
                  key={`m-${step.label}`}
                  as="li"
                  progress={procSectionP}
                  at={[0.16 + index * 0.07, 0.28 + index * 0.07]}
                  y={14}
                  floor={0.74}
                  className="flex gap-4"
                >
                  <div className="flex w-9 shrink-0 flex-col items-center">
                    <span className={`text-xs ${step.numColor}`}>{step.num}</span>
                    <span className={`mt-2 h-7 w-px ${step.tick}`} aria-hidden />
                  </div>
                  <p className="pt-0.5 text-sm uppercase tracking-[0.04em] text-brand-branco">
                    {step.label}
                  </p>
                </Scrub>
              ))}
            </ol>
          </div>

          <p className="mt-10 text-sm text-brand-azul">
            Uma sequência clara: entender, planejar, construir, entregar e evoluir.
          </p>
        </div>
      </section>

      {/* Projetos — scrub local (late trigger, sequential bands) */}
      <section
        ref={projRef}
        aria-labelledby="home-projects-heading"
        className="px-5 py-16 sm:px-6 lg:py-24"
      >
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <Scrub
              progress={projP}
              at={[0.0, 0.18]}
              y={24}
              floor={0.72}
              scale={0.985}
              className="lg:col-span-7"
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-brand-rosa">Projetos reais</p>
              <h2
                id="home-projects-heading"
                className="mt-5 max-w-[16ch] text-[clamp(1.6rem,3.4vw,3.25rem)] font-light uppercase leading-[1.1] tracking-[-0.03em] text-brand-branco"
              >
                Mostrar trabalho sem transformar tudo em case.
              </h2>
            </Scrub>
            <Scrub
              progress={projP}
              at={[0.08, 0.26]}
              y={18}
              floor={0.74}
              scale={0.99}
              className="max-w-md lg:col-span-5 lg:justify-self-end lg:text-right"
            >
              <p className="text-sm leading-relaxed text-brand-azul sm:text-base">
                Cada item aparece com sua classificação real e seu estágio visível.
              </p>
            </Scrub>
          </div>

          <div className="mt-12 grid gap-4 lg:mt-14 lg:grid-cols-12 lg:gap-5">
            <Scrub
              progress={projP}
              at={[0.22, 0.48]}
              y={26}
              x={-12}
              floor={0.68}
              scale={0.985}
              className="lg:col-span-7"
            >
              <article className="group flex min-h-0 flex-col border border-transparent bg-brand-branco p-6 text-brand-roxo transition-[border-color,transform] duration-300 hover:border-brand-rosa/50 hover:-translate-y-1 motion-reduce:transform-none sm:p-8 lg:min-h-[22rem] lg:p-9">
                <p className="text-[11px] uppercase tracking-[0.18em] text-brand-azul">
                  Projeto próprio · em evolução
                </p>
                <h3 className="mt-6 text-[clamp(1.75rem,3vw,2.875rem)] font-light uppercase tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none">
                  OURleads
                </h3>
                <p className="mt-5 max-w-lg flex-1 text-sm leading-relaxed text-brand-roxo/85 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none sm:text-base sm:leading-7">
                  Organização de prospecção e follow-up com intenção comercial e potencial de
                  portfólio.
                </p>
                <Link
                  to="/portfolio"
                  className="mt-8 inline-flex min-h-11 items-center text-sm uppercase tracking-[0.04em] text-brand-rosa transition-colors duration-200 hover:text-brand-roxo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa"
                >
                  Ver projeto{" "}
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-2 motion-reduce:transform-none">
                    →
                  </span>
                </Link>
              </article>
            </Scrub>

            <Scrub
              progress={projP}
              at={[0.36, 0.62]}
              y={26}
              x={-12}
              floor={0.68}
              scale={0.985}
              className="lg:col-span-5"
            >
              <article className="group border border-transparent bg-brand-azul p-6 text-brand-branco transition-[border-color,transform] duration-300 hover:border-brand-branco/55 hover:-translate-y-1 motion-reduce:transform-none sm:p-8">
                <p className="text-[11px] uppercase tracking-[0.18em] text-brand-branco/85">
                  Sistema interno
                </p>
                <h3 className="mt-5 text-2xl font-light uppercase tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none sm:text-3xl">
                  Dreamscraft OS
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-brand-branco/90 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none">
                  Estratégia, governança, documentação e operação coordenadas.
                </p>
                <ul className="mt-8 divide-y divide-brand-branco/25 border-y border-brand-branco/25 transition-[border-color] duration-300 group-hover:divide-brand-branco/40 group-hover:border-brand-branco/40">
                  {osPillars.map((pillar) => (
                    <li key={pillar} className="py-3 text-[13px] uppercase tracking-[0.06em]">
                      {pillar}
                    </li>
                  ))}
                </ul>
              </article>
            </Scrub>
          </div>

          <Scrub progress={projP} at={[0.58, 0.72]} y={12} floor={0.78} className="mt-8">
            <p className="text-sm text-brand-azul">
              A vitrine muda conforme os projetos reais amadurecem.
            </p>
          </Scrub>
        </div>
      </section>

      {/* Small Team — early entry → settle → hold */}
      <section
        aria-labelledby="home-team-heading"
        className="relative bg-brand-branco px-5 py-16 text-brand-roxo sm:px-6 lg:py-28"
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-2 bg-brand-rosa sm:w-3"
          aria-hidden
        />
        <div ref={teamRef} className="mx-auto max-w-[1240px] pl-3 sm:pl-5">
          <BrandDepthReveal progress={teamP} at={[0.0, 0.12]} y={12} floor={0.8}>
            <p className="text-[11px] uppercase tracking-[0.22em] text-brand-azul">Sobre a Dreamscraft</p>
          </BrandDepthReveal>
          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <h2
              id="home-team-heading"
              className="max-w-[12ch] text-[clamp(2rem,5vw,4.5rem)] font-light uppercase leading-[1.05] tracking-[-0.03em] lg:col-span-7"
            >
              <TeamLineReveal progress={teamP} at={[0.05, 0.2]} y={24} floor={0.7}>
                Small team,
              </TeamLineReveal>
              <TeamLineReveal progress={teamP} at={[0.12, 0.28]} y={24} floor={0.7}>
                big systems.
              </TeamLineReveal>
            </h2>
            <Scrub
              progress={teamP}
              at={[0.22, 0.38]}
              y={22}
              floor={0.74}
              scale={0.99}
              className="lg:col-span-5 lg:pt-4"
            >
              <p className="max-w-md text-sm leading-relaxed text-brand-roxo/90 sm:text-base sm:leading-7">
                Evandro + Gabrielle. Uma pequena equipe com proximidade suficiente para entender o
                problema e responsabilidade suficiente para acompanhar a execução.
              </p>
            </Scrub>
          </div>

          <div className="mt-16 grid gap-6 border-t border-brand-roxo/15 pt-10 sm:mt-20 lg:grid-cols-12 lg:items-start">
            <div className="relative lg:col-span-7">
              <ManifestoAccentRail
                progress={teamP}
                className="mb-4 block h-0.5 w-16 bg-brand-rosa"
              />
              <Scrub progress={teamP} at={[0.34, 0.5]} y={16} floor={0.75}>
                <p className="text-[clamp(1.1rem,2.2vw,1.5rem)] font-light uppercase leading-snug tracking-[-0.02em] text-brand-rosa">
                  Processo que não se esconde nas entrelinhas.
                </p>
              </Scrub>
            </div>
            <Scrub progress={teamP} at={[0.38, 0.52]} y={14} floor={0.78} className="lg:col-span-5">
              <p className="max-w-sm text-sm leading-relaxed text-brand-roxo/80">
                Menos camadas entre quem decide, projeta e constrói.
              </p>
            </Scrub>
          </div>

          <BrandDepthReveal
            progress={teamP}
            at={[0.46, 0.58]}
            y={10}
            floor={0.82}
            className="mt-14 sm:mt-16"
          >
            <p className="text-[11px] uppercase tracking-[0.16em] text-brand-azul">
              Dreamscraft.Code / Small team, big systems.
            </p>
          </BrandDepthReveal>
        </div>
      </section>

      {/* Fechamento — ENTRY ONLY, then hold forever (page end) */}
      <section aria-labelledby="home-close-heading" className="px-5 py-16 sm:px-6 lg:py-24">
        <div ref={closeRef} className="mx-auto max-w-[1240px]">
          <BrandDepthReveal progress={closeP} at={[0.0, 0.18]} y={8} floor={0.85}>
            <p className="text-[11px] uppercase tracking-[0.22em] text-brand-rosa">Fechamento</p>
          </BrandDepthReveal>
          <ScrollTextReveal
            as="h2"
            id="home-close-heading"
            text="Contexto antes da proposta. Sempre."
            progress={closeP}
            mode="words"
            from={0.0}
            to={0.28}
            exitFrom={1}
            exitTo={1}
            y={18}
            className="mt-5 max-w-[18ch] text-[clamp(1.6rem,3.6vw,3.625rem)] font-light uppercase leading-[1.1] tracking-[-0.03em] text-brand-branco"
          />
          <BrandDepthReveal progress={closeP} at={[0.14, 0.32]} y={14} floor={0.82}>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-brand-azul sm:text-base sm:leading-7">
              Entender o cenário vem antes de propor qualquer solução.
            </p>
          </BrandDepthReveal>
          <BrandDepthReveal progress={closeP} at={[0.22, 0.4]} y={12} floor={0.84} className="mt-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/portfolio"
                className="group inline-flex min-h-11 items-center text-sm uppercase tracking-[0.04em] text-brand-branco transition-colors duration-200 hover:text-brand-rosa focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa"
              >
                Explorar projetos{" "}
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-2 motion-reduce:transform-none">
                  →
                </span>
              </Link>
              <p className="text-sm text-brand-azul">small team, big systems.</p>
            </div>
          </BrandDepthReveal>
        </div>
      </section>
    </div>
  );
}
