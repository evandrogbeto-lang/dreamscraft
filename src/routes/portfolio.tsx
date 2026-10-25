import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type TargetAndTransition,
  type Transition,
} from "framer-motion";
import { HOME_SPRING, HOME_SPRING_SOFT, homeEase } from "@/components/home/home-motion";

const SEO_TITLE = "Projetos — Dreamscraft Code";
const SEO_DESCRIPTION =
  "Cuidadim, Café Orquestra e Secretária.Code: produtos e projetos apresentados com contexto, estado atual e evidências reais.";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: SEO_TITLE },
      { name: "description", content: SEO_DESCRIPTION },
      { property: "og:title", content: SEO_TITLE },
      { property: "og:description", content: SEO_DESCRIPTION },
      { property: "og:url", content: "https://dreamscraftcode.com/portfolio" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SEO_TITLE },
      { name: "twitter:description", content: SEO_DESCRIPTION },
    ],
  }),
  component: PortfolioPage,
});

type Accent = "rosa" | "azul";

const accentText: Record<Accent, string> = {
  rosa: "text-brand-rosa",
  azul: "text-brand-azul",
};

const INDEX = [
  { id: "cuidadim", num: "01", name: "Cuidadim", status: "Em desenvolvimento" },
  { id: "cafe-orquestra", num: "02", name: "Café Orquestra", status: "Protótipo em validação" },
  { id: "secretaria-code", num: "03", name: "Secretária.Code", status: "Em validação" },
] as const;

const HERO_LINES = ["Problemas diferentes.", "O mesmo cuidado", "para construir."] as const;

const CUIDADIM_MODULES = [
  "Pets da família",
  "Registros de saúde",
  "Neonatal",
  "Agenda e rotinas",
  "Plano de saúde",
  "Compras e despesas",
  "Memórias e fotos",
] as const;

const CAFE_LAYERS = [
  { title: "Contexto operacional", note: "talhões, lotes e recursos" },
  { title: "Decision Engine", note: "prioriza o que precisa acontecer primeiro" },
  { title: "Execução por lotes", note: "acompanha o que foi decidido" },
  { title: "Quality Flow", note: "registra a qualidade ao longo do processo" },
  { title: "Evidence Layer", note: "guarda as evidências de cada etapa" },
  { title: "Passaporte público", note: "verificador aberto para consulta" },
] as const;

const SECRETARIA_FLOW = [
  { num: "01", title: "Mensagem", note: "chega pelo WhatsApp" },
  { num: "02", title: "Interpretação", note: "entende o pedido" },
  { num: "03", title: "Contexto", note: "usa memória simples" },
  { num: "04", title: "Resposta", note: "gerada com o contexto" },
  { num: "05", title: "Retorno", note: "devolvida pelo WhatsApp" },
] as const;

const SECRETARIA_NOT_YET = [
  "agenda",
  "encaminhamento humano",
  "banco de dados próprio",
  "voz",
  "canal web",
  "tool calling",
  "memória persistente avançada",
] as const;

const secondaryCta =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-button border border-brand-branco/25 px-5 text-sm text-brand-branco transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-brand-rosa/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none";

const spring = { type: "spring" as const, ...HOME_SPRING };
const springSoft = { type: "spring" as const, ...HOME_SPRING_SOFT };

/* ---------- Motion helpers ---------- */

/**
 * Entrada com o mesmo estado inicial no servidor e no cliente.
 * Com reduced motion, o estado final é aplicado imediatamente, sem transição.
 */
function enter(
  reduce: boolean,
  initial: TargetAndTransition,
  final: TargetAndTransition,
  transition: Transition,
  viewport?: { once: boolean; amount: number },
) {
  if (reduce) return { initial, animate: final, transition: { duration: 0 } };
  if (viewport) return { initial, whileInView: final, transition, viewport };
  return { initial, animate: final, transition };
}

type Track = { axis: "x" | "y"; points: number[]; cross: number };

/** Mede o centro de cada nó do fluxo para que linha e marcador alcancem cada nó com precisão. */
function useNodeTrack(containerRef: RefObject<HTMLElement | null>, count: number) {
  const nodeRefs = useRef<(HTMLElement | null)[]>([]);
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const base = container.getBoundingClientRect();
      const centers = nodeRefs.current.slice(0, count).map((node) => {
        if (!node) return null;
        const r = node.getBoundingClientRect();
        return { x: r.left + r.width / 2 - base.left, y: r.top + r.height / 2 - base.top };
      });
      if (centers.length < count || centers.some((c) => !c)) return;
      const first = centers[0]!;
      const last = centers[count - 1]!;
      const axis = Math.abs(last.y - first.y) > Math.abs(last.x - first.x) ? "y" : "x";
      setTrack({
        axis,
        points: centers.map((c) => (axis === "x" ? c!.x : c!.y)),
        cross: axis === "x" ? first.y : first.x,
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, [containerRef, count]);

  return { nodeRefs, track };
}

/** Posição do marcador e tamanho do preenchimento ao longo dos nós medidos. */
function useTrackPosition(progress: MotionValue<number>, track: Track | null) {
  const pos = useMotionValue(0);
  const fill = useMotionValue(0);

  useEffect(() => {
    if (!track) return;
    const { points } = track;
    const segments = points.length - 1;
    const update = (v: number) => {
      const t = Math.min(Math.max(v, 0), 1) * segments;
      const i = Math.min(Math.floor(t), segments - 1);
      const p = points[i] + (points[i + 1] - points[i]) * (t - i);
      pos.set(p);
      fill.set(p - points[0]);
    };
    update(progress.get());
    return progress.on("change", update);
  }, [progress, track, pos, fill]);

  return { pos, fill };
}

/* ---------- Página ---------- */

function PortfolioPage() {
  const reduce = !!useReducedMotion();
  const chaptersRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(-1);
  const [railNodes, setRailNodes] = useState<number[]>([]);

  const { scrollYProgress } = useScroll({
    target: chaptersRef,
    offset: ["start center", "end center"],
  });
  const railProgress = useSpring(scrollYProgress, HOME_SPRING);
  const markerTop = useTransform(railProgress, (v) => `${Math.min(Math.max(v, 0), 1) * 100}%`);

  // Posição de cada número de capítulo dentro do bloco de capítulos (sem efeito de transforms).
  useEffect(() => {
    const container = chaptersRef.current;
    if (!container) return;
    const measure = () => {
      const offsets = INDEX.map((item) => {
        let el = container.querySelector<HTMLElement>(`[data-chapter-num="${item.id}"]`);
        if (!el) return 0;
        const half = el.offsetHeight / 2;
        let top = 0;
        while (el && el !== container) {
          top += el.offsetTop;
          el = el.offsetParent as HTMLElement | null;
        }
        return top + half;
      });
      setRailNodes(offsets);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Capítulo dominante: o último cujo número já cruzou o meio da viewport.
  useEffect(() => {
    const container = chaptersRef.current;
    if (!container || railNodes.length === 0) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const top = container.getBoundingClientRect().top;
      const mid = window.innerHeight * 0.5;
      let next = -1;
      railNodes.forEach((offset, i) => {
        if (top + offset <= mid) next = i;
      });
      setActiveChapter((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [railNodes]);

  // railNodes só existe após a montagem: o estado estático não altera o HTML hidratado.
  const railStatic = reduce && railNodes.length > 0;

  const heroIn = (delay: number, y = 20) =>
    enter(reduce, { opacity: 0, y }, { opacity: 1, y: 0 }, { ...spring, delay });

  return (
    <div className="overflow-x-clip">
      {/* Hero */}
      <section
        aria-labelledby="projetos-hero-heading"
        className="px-5 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:pb-20 lg:pt-14"
      >
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="min-w-0 lg:col-span-8">
            <motion.p
              className="text-[11px] uppercase tracking-[0.22em] text-brand-rosa sm:text-[12px]"
              {...heroIn(0.05, 10)}
            >
              Projetos
            </motion.p>
            <h1
              id="projetos-hero-heading"
              className="mt-5 text-[clamp(1.75rem,1.1rem+2.6vw,3.25rem)] font-light uppercase leading-[1.1] tracking-[-0.03em] text-brand-branco"
            >
              {HERO_LINES.map((line, index) => (
                <span key={line} className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
                  <motion.span
                    className="block"
                    {...enter(
                      reduce,
                      { opacity: 0, y: "70%" },
                      { opacity: 1, y: "0%" },
                      { ...spring, delay: 0.16 + index * 0.11 },
                    )}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p
              className="mt-6 max-w-[40rem] text-sm leading-relaxed text-brand-azul sm:text-base sm:leading-7"
              {...heroIn(0.58, 16)}
            >
              Produtos e projetos que transformam contexto, regras e necessidades reais em
              experiências utilizáveis. Cada um aparece aqui no estado em que realmente está.
            </motion.p>
          </div>

          <nav aria-label="Projetos nesta página" className="lg:col-span-4">
            <ol className="border-t border-brand-branco/20 pt-6 lg:border-t-0 lg:border-l lg:pl-10 lg:pt-0">
              {INDEX.map((item, index) => (
                <motion.li key={item.id} {...heroIn(0.74 + index * 0.07, 12)}>
                  <a
                    href={`#${item.id}`}
                    className="group grid min-h-11 grid-cols-[2.25rem_1fr] items-baseline gap-x-3 rounded-md py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <span className="text-[11px] tracking-[0.18em] text-brand-rosa">
                      {item.num}
                    </span>
                    <span className="text-sm font-light uppercase tracking-[-0.01em] text-brand-branco transition-colors group-hover:text-brand-rosa">
                      {item.name}
                    </span>
                    <span className="col-start-2 mt-1 text-[11px] uppercase tracking-[0.14em] text-brand-branco/50">
                      {item.status}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      {/* Capítulos — rail narrativo */}
      <div ref={chaptersRef} className="relative mx-auto max-w-[1240px] px-5 sm:px-6">
        <div
          className="pointer-events-none absolute bottom-0 left-6 top-0 hidden w-px bg-brand-branco/15 lg:block"
          aria-hidden
        >
          <motion.div
            className="h-full w-px origin-top bg-brand-rosa/70"
            style={{ scaleY: railStatic ? 1 : railProgress }}
          />

          {railNodes.map((offset, i) => {
            const active = i === activeChapter;
            return (
              <span
                key={INDEX[i].id}
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ top: offset }}
              >
                <span
                  className={`block h-[7px] w-[7px] border transition-colors duration-300 motion-reduce:transition-none ${
                    active
                      ? "border-brand-rosa bg-brand-rosa"
                      : "border-brand-branco/35 bg-background"
                  }`}
                />
                <span
                  className={`absolute right-full top-1/2 mr-2.5 -translate-y-1/2 text-[10px] tracking-[0.16em] transition-colors duration-300 motion-reduce:transition-none ${
                    active ? "text-brand-branco" : "text-brand-branco/40"
                  }`}
                >
                  {INDEX[i].num}
                </span>
              </span>
            );
          })}

          {railNodes.length > 0 && !reduce && (
            <motion.span
              className="absolute left-1/2 h-[2px] w-[11px] -translate-x-1/2 -translate-y-1/2 bg-brand-rosa"
              style={{ top: markerTop }}
            />
          )}
        </div>

        <div className="lg:pl-10">
          <CuidadimChapter reduce={reduce} active={activeChapter === 0} />
          <CafeChapter reduce={reduce} active={activeChapter === 1} />
          <SecretariaChapter reduce={reduce} active={activeChapter === 2} />
        </div>
      </div>

      {/* Fechamento */}
      <section
        aria-labelledby="projetos-cta-heading"
        className="px-5 pt-8 pb-16 sm:px-6 sm:pt-10 sm:pb-20 lg:pt-12 lg:pb-24"
      >
        <motion.div
          className="mx-auto max-w-[1240px] border-t border-brand-branco/15 pt-8 sm:pt-10"
          {...enter(reduce, { opacity: 0.4, y: 20 }, { opacity: 1, y: 0 }, springSoft, {
            once: true,
            amount: 0.4,
          })}
        >
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
            <div className="lg:col-span-7">
              <p className="text-[11px] uppercase tracking-[0.22em] text-brand-rosa">
                Seu contexto
              </p>
              <h2
                id="projetos-cta-heading"
                className="mt-4 text-[clamp(1.35rem,1rem+1.4vw,2.15rem)] font-light uppercase leading-[1.14] tracking-[-0.03em] text-brand-branco"
              >
                <span className="block">O próximo projeto</span>
                <span className="block">começa pelo problema.</span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <div className="h-px w-12 bg-brand-rosa/70" aria-hidden />
              <p className="mt-4 max-w-md text-sm leading-relaxed text-brand-azul sm:text-[15px] sm:leading-7">
                Conte o que precisa mudar. O diagnóstico organiza contexto, restrições e o primeiro
                recorte.
              </p>
              <div className="mt-6">
                <Link
                  to="/estimar"
                  className="inline-flex min-h-12 items-center justify-center rounded-button bg-brand-rosa px-6 text-sm font-medium text-brand-roxo transition-[transform,filter] duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none"
                >
                  Solicitar diagnóstico
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

/* ---------- Estrutura comum de capítulo ---------- */

type ChapterInfo = {
  id: string;
  num: string;
  name: string;
  classification: string;
  status: string;
  problem: string;
  exists: string;
  stack: string[];
  accent: Accent;
};

function ChapterIdentity({ info, active }: { info: ChapterInfo; active: boolean }) {
  return (
    <>
      <div className="flex items-baseline gap-4">
        <motion.p
          data-chapter-num={info.id}
          className={`text-[clamp(2rem,1.5rem+2vw,3rem)] font-light tracking-[-0.04em] ${accentText[info.accent]}`}
          aria-hidden
          initial={false}
          animate={{ opacity: active ? 1 : 0.5 }}
          transition={{ duration: 0.35, ease: homeEase }}
        >
          {info.num}
        </motion.p>
        <div className="h-px flex-1 bg-brand-branco/20" aria-hidden />
      </div>
      <h2
        id={`${info.id}-heading`}
        className="mt-5 text-[clamp(1.5rem,1.1rem+1.6vw,2.4rem)] font-light uppercase leading-[1.08] tracking-[-0.03em] text-brand-branco"
      >
        <span className="sr-only">{info.num} — </span>
        {info.name}
      </h2>
      <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 text-[11px] uppercase tracking-[0.16em]">
        <dt className="text-brand-branco/50">Classificação</dt>
        <dd className="text-brand-branco/85">{info.classification}</dd>
        <dt className="text-brand-branco/50">Status</dt>
        <dd className={accentText[info.accent]}>{info.status}</dd>
      </dl>
    </>
  );
}

function ChapterBody({ info, children }: { info: ChapterInfo; children?: ReactNode }) {
  return (
    <>
      <div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-brand-branco/55">Problema</p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-branco/90 sm:text-[15px] sm:leading-7">
          {info.problem}
        </p>
      </div>
      <div className="mt-7">
        <p className="text-[11px] uppercase tracking-[0.16em] text-brand-branco/55">
          O que existe hoje
        </p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-azul sm:text-[15px] sm:leading-7">
          {info.exists}
        </p>
      </div>
      <p className="mt-7 border-t border-brand-branco/12 pt-4 text-[12px] leading-relaxed text-brand-branco/70">
        <span className="mr-3 uppercase tracking-[0.16em] text-brand-branco/50">Stack</span>
        {info.stack.join(" · ")}
      </p>
      {children}
    </>
  );
}

function chapterTextMotion(reduce: boolean) {
  return enter(reduce, { opacity: 0.3, y: 24 }, { opacity: 1, y: 0 }, spring, {
    once: true,
    amount: 0.25,
  });
}

function evidenceMotion(reduce: boolean, from: { x?: number; y?: number }) {
  return enter(
    reduce,
    { opacity: 0.35, x: from.x ?? 0, y: from.y ?? 0 },
    { opacity: 1, x: 0, y: 0 },
    { ...spring, delay: 0.08 },
    { once: true, amount: 0.2 },
  );
}

const chapterClass =
  "scroll-mt-24 border-t border-brand-branco/12 py-14 first:border-t-0 first:pt-2 sm:py-16 lg:py-20";

/* ---------- 01 — Cuidadim ---------- */

const CUIDADIM: ChapterInfo = {
  id: "cuidadim",
  num: "01",
  name: "Cuidadim",
  classification: "Produto próprio",
  status: "Em desenvolvimento",
  problem:
    "Organizar cuidados, saúde, rotina, finanças e memórias de pets quando a responsabilidade é dividida pela família.",
  exists:
    "App funcional com demo pública. Reúne pets, registros de saúde, agenda, despesas e memórias em um só lugar, com papéis diferentes para cada pessoa da família.",
  stack: ["Next.js", "TypeScript", "React", "Supabase", "Vercel"],
  accent: "rosa",
};

const MODULE_START = 0.28;
const MODULE_STEP = 0.07;
const FAMILY_DELAY = MODULE_START + CUIDADIM_MODULES.length * MODULE_STEP;

function CuidadimChapter({ reduce, active }: { reduce: boolean; active: boolean }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(mapRef, { once: true, amount: 0.35 });
  const on = reduce || inView;

  const line = (delay: number) => ({
    initial: { scaleX: 0 },
    animate: on ? { scaleX: 1 } : {},
    transition: reduce ? { duration: 0 } : { duration: 0.5, ease: homeEase, delay },
  });

  const settle = (delay: number, from = 0.5) => ({
    initial: { opacity: from, y: 8 },
    animate: on ? { opacity: 1, y: 0 } : {},
    transition: reduce ? { duration: 0 } : { ...springSoft, delay },
  });

  return (
    <article id={CUIDADIM.id} aria-labelledby={`${CUIDADIM.id}-heading`} className={chapterClass}>
      <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
        <motion.div className="min-w-0 lg:col-span-5" {...chapterTextMotion(reduce)}>
          <ChapterIdentity info={CUIDADIM} active={active} />
          <div className="mt-8">
            <ChapterBody info={CUIDADIM}>
              <div className="mt-7 flex gap-3">
                <span className="mt-2 h-px w-6 shrink-0 bg-brand-rosa/70" aria-hidden />
                <p className="max-w-md text-[13px] leading-relaxed text-brand-branco/65">
                  Experiência pública em atualização de identidade.
                </p>
              </div>
            </ChapterBody>
          </div>
        </motion.div>

        <motion.figure className="min-w-0 lg:col-span-7" {...evidenceMotion(reduce, { x: 28 })}>
          <div ref={mapRef} className="border border-brand-branco/10 bg-surface p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-[11px] uppercase tracking-[0.2em] text-brand-rosa">
                Mapa do produto
              </p>
              <p className="text-[11px] uppercase tracking-[0.14em] text-brand-branco/50">
                módulos no app hoje
              </p>
            </div>
            <ol className="mt-8 grid grid-cols-2 gap-x-5 gap-y-5 sm:gap-x-8">
              {CUIDADIM_MODULES.map((label, index) => (
                <li key={label} className="relative pt-3">
                  <motion.span
                    className="absolute inset-x-0 top-0 h-px origin-left bg-brand-branco/15"
                    aria-hidden
                    {...line(0.14 + index * 0.06)}
                  />
                  <motion.span
                    className="block"
                    {...settle(MODULE_START + index * MODULE_STEP)}
                  >
                    <span className="block text-[11px] tracking-[0.18em] text-brand-rosa/80">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-1.5 block text-[13px] uppercase leading-snug tracking-[-0.01em] text-brand-branco sm:text-sm">
                      {label}
                    </span>
                  </motion.span>
                </li>
              ))}
            </ol>
            <div className="relative mt-8 pt-4">
              <motion.span
                className="absolute inset-x-0 top-0 h-px origin-left bg-brand-rosa/50"
                aria-hidden
                {...line(FAMILY_DELAY - 0.08)}
              />
              <motion.div {...settle(FAMILY_DELAY + 0.06, 0.45)}>
                <p className="text-[11px] uppercase tracking-[0.18em] text-brand-rosa">Família</p>
                <p className="mt-2 text-[13px] leading-relaxed text-brand-branco/85 sm:text-sm">
                  Papéis de responsável, cuidador e visualizador · convites
                </p>
              </motion.div>
            </div>
          </div>
          <figcaption className="mt-3 text-[11px] leading-relaxed text-brand-branco/45">
            Composição institucional a partir dos módulos existentes — não representa a identidade
            final do produto.
          </figcaption>
        </motion.figure>
      </div>
    </article>
  );
}

/* ---------- 02 — Café Orquestra ---------- */

const CAFE: ChapterInfo = {
  id: "cafe-orquestra",
  num: "02",
  name: "Café Orquestra",
  classification: "Projeto próprio",
  status: "Protótipo em validação",
  problem:
    "Na cafeicultura, várias frentes disputam os mesmos recursos. Falta inteligência operacional para priorizar o que precisa acontecer primeiro, considerando o contexto da operação.",
  exists:
    "Protótipo técnico demonstrável, com demo pública em modo demonstrativo e fluxo conectado ao Supabase. Desenvolvido no Programa de Pré-Aceleração Avança Café 2026 e em validação.",
  stack: ["JavaScript modular", "Supabase", "Netlify"],
  accent: "azul",
};

/** Progresso do Café = posição atual do scroll. Descer avança, subir reverte. */
function useCafeScroll(target: RefObject<HTMLElement | null>, reduce: boolean) {
  const { scrollYProgress } = useScroll({ target, offset: ["start 75%", "end 50%"] });
  const settled = useMotionValue(1);
  const [focus, setFocus] = useState(0);
  const span = CAFE_LAYERS.length - 1;

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (reduce) return;
    const next = Math.min(Math.max(value, 0), 1) * span;
    setFocus((prev) => (Math.abs(prev - next) < 0.004 ? prev : next));
  });

  useEffect(() => {
    if (reduce) return;
    setFocus(Math.min(Math.max(scrollYProgress.get(), 0), 1) * span);
  }, [reduce, scrollYProgress, span]);

  return { motion: reduce ? settled : scrollYProgress, focus };
}

function CafeChapter({ reduce, active }: { reduce: boolean; active: boolean }) {
  const layersRef = useRef<HTMLOListElement>(null);
  const { motion: progress, focus } = useCafeScroll(layersRef, reduce);
  const { nodeRefs, track } = useNodeTrack(layersRef, CAFE_LAYERS.length);
  const { pos, fill } = useTrackPosition(progress, track);

  return (
    <article id={CAFE.id} aria-labelledby={`${CAFE.id}-heading`} className={chapterClass}>
      <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
        <motion.figure
          className="order-2 min-w-0 lg:order-1 lg:col-span-7"
          {...evidenceMotion(reduce, { x: -28 })}
        >
          <div className="border border-brand-branco/10 bg-surface p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-[11px] uppercase tracking-[0.2em] text-brand-azul">
                Camadas do protótipo
              </p>
              <p className="text-[11px] uppercase tracking-[0.14em] text-brand-branco/50">
                modo demo · dados demonstrativos
              </p>
            </div>
            <ol ref={layersRef} className="relative mt-8">
              {track && (
                <>
                  <span
                    className="pointer-events-none absolute w-px -translate-x-1/2 bg-brand-branco/15"
                    style={{
                      left: track.cross,
                      top: track.points[0],
                      height: track.points[track.points.length - 1] - track.points[0],
                    }}
                    aria-hidden
                  />
                  <motion.span
                    className="pointer-events-none absolute w-px -translate-x-1/2 bg-brand-azul"
                    style={{ left: track.cross, top: track.points[0], height: fill }}
                    aria-hidden
                  />
                  {!reduce && (
                    <motion.span
                      className="pointer-events-none absolute z-20 h-[2px] w-[9px] bg-brand-azul"
                      style={{ left: track.cross, top: pos, x: "-50%", y: "-50%" }}
                      aria-hidden
                    />
                  )}
                </>
              )}
              {CAFE_LAYERS.map((layer, index) => {
                const weight = reduce ? 1 : Math.max(0, 1 - Math.abs(focus - index));
                const opacity = reduce ? 1 : 0.72 + weight * 0.28;
                const shift = reduce ? 0 : (1 - weight) * 4;
                return (
                  <li key={layer.title} className="relative grid grid-cols-[1.5rem_1fr] gap-x-3 py-3">
                    <span
                      ref={(el) => {
                        nodeRefs.current[index] = el;
                      }}
                      className="relative z-10 mt-1.5 block h-2.5 w-2.5 border border-brand-azul bg-brand-azul"
                      style={{
                        opacity: reduce ? 1 : 0.45 + weight * 0.55,
                        transform: `scale(${reduce ? 1 : 0.86 + weight * 0.14})`,
                      }}
                      aria-hidden
                    />
                    <span
                      className="min-w-0"
                      style={{ opacity, transform: shift ? `translateY(${shift}px)` : undefined }}
                    >
                      <span className="block text-[13px] uppercase tracking-[-0.01em] text-brand-branco sm:text-sm">
                        {layer.title}
                      </span>
                      <span className="mt-1 block text-[12px] leading-relaxed text-brand-branco/60 sm:text-[13px]">
                        {layer.note}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-6 border-t border-brand-branco/12 pt-4 text-[12px] leading-relaxed text-brand-branco/60">
              Recomendação não é prescrição agronômica. Protótipo não é implantação em produtor ou
              cooperativa.
            </p>
          </div>
        </motion.figure>

        <motion.div
          className="order-1 min-w-0 lg:order-2 lg:col-span-5"
          {...chapterTextMotion(reduce)}
        >
          <ChapterIdentity info={CAFE} active={active} />
          <div className="mt-8">
            <ChapterBody info={CAFE}>
              <div className="mt-8">
                <a
                  href="https://cafe-orquestra-mvp.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={secondaryCta}
                >
                  Explorar protótipo
                  <span aria-hidden className="text-brand-azul">
                    ↗
                  </span>
                  <span className="sr-only">(abre em nova aba)</span>
                </a>
              </div>
            </ChapterBody>
          </div>
        </motion.div>
      </div>
    </article>
  );
}

/* ---------- 03 — Secretária.Code ---------- */

const SECRETARIA: ChapterInfo = {
  id: "secretaria-code",
  num: "03",
  name: "Secretária.Code",
  classification: "Produto próprio",
  status: "Em validação",
  problem:
    "Atendimento no WhatsApp que precisa manter contexto sem depender de respostas manuais repetitivas.",
  exists:
    "Recebe a mensagem, interpreta o pedido, usa contexto e memória simples, gera a resposta e devolve pelo próprio WhatsApp.",
  stack: ["WhatsApp Cloud API", "n8n", "OpenRouter"],
  accent: "rosa",
};

/** Progresso do fluxo da Secretária = posição atual do scroll. Descer avança, subir reverte. */
function useSecretariaScroll(target: RefObject<HTMLElement | null>, reduce: boolean) {
  const { scrollYProgress } = useScroll({ target, offset: ["start 85%", "end 50%"] });
  const settled = useMotionValue(1);
  const [focus, setFocus] = useState(0);
  const span = SECRETARIA_FLOW.length - 1;

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (reduce) return;
    const next = Math.min(Math.max(value, 0), 1) * span;
    setFocus((prev) => (Math.abs(prev - next) < 0.004 ? prev : next));
  });

  useEffect(() => {
    if (reduce) return;
    setFocus(Math.min(Math.max(scrollYProgress.get(), 0), 1) * span);
  }, [reduce, scrollYProgress, span]);

  return { motion: reduce ? settled : scrollYProgress, focus };
}

function SecretariaChapter({ reduce, active }: { reduce: boolean; active: boolean }) {
  const flowRef = useRef<HTMLOListElement>(null);
  const { motion: progress, focus } = useSecretariaScroll(flowRef, reduce);
  const { nodeRefs, track } = useNodeTrack(flowRef, SECRETARIA_FLOW.length);
  const { pos, fill } = useTrackPosition(progress, track);
  const atEnd = reduce || focus >= SECRETARIA_FLOW.length - 1 - 0.08;
  const horizontal = track?.axis === "x";

  return (
    <article
      id={SECRETARIA.id}
      aria-labelledby={`${SECRETARIA.id}-heading`}
      className={chapterClass}
    >
      <motion.div className="grid gap-8 lg:grid-cols-12 lg:gap-12" {...chapterTextMotion(reduce)}>
        <div className="min-w-0 lg:col-span-5">
          <ChapterIdentity info={SECRETARIA} active={active} />
        </div>
        <div className="min-w-0 lg:col-span-7 lg:pt-2">
          <ChapterBody info={SECRETARIA}>
            <div className="mt-8">
              <Link to="/solucoes" className={secondaryCta}>
                Entender a solução
                <span aria-hidden className="text-brand-rosa">
                  →
                </span>
              </Link>
            </div>
          </ChapterBody>
        </div>
      </motion.div>

      <motion.figure className="mt-12 lg:mt-16" {...evidenceMotion(reduce, { y: 28 })}>
        <div className="border border-brand-branco/10 bg-surface p-6 sm:p-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-brand-rosa">Fluxo atual</p>

          <ol ref={flowRef} className="relative mt-8 grid gap-0 lg:grid-cols-5 lg:gap-6">
            {track && (
              <>
                <span
                  className={`pointer-events-none absolute bg-brand-branco/15 ${
                    horizontal ? "h-px -translate-y-1/2" : "w-px -translate-x-1/2"
                  }`}
                  style={
                    horizontal
                      ? {
                          top: track.cross,
                          left: track.points[0],
                          width: track.points[track.points.length - 1] - track.points[0],
                        }
                      : {
                          left: track.cross,
                          top: track.points[0],
                          height: track.points[track.points.length - 1] - track.points[0],
                        }
                  }
                  aria-hidden
                />
                <motion.span
                  className={`pointer-events-none absolute ${
                    horizontal
                      ? "h-px -translate-y-1/2 bg-gradient-to-r from-brand-rosa to-brand-azul"
                      : "w-px -translate-x-1/2 bg-gradient-to-b from-brand-rosa to-brand-azul"
                  }`}
                  style={
                    horizontal
                      ? { top: track.cross, left: track.points[0], width: fill }
                      : { left: track.cross, top: track.points[0], height: fill }
                  }
                  aria-hidden
                />
                {!reduce && (
                  <motion.span
                    className={`pointer-events-none absolute z-20 block h-3 w-3 border-2 bg-brand-roxo transition-colors duration-300 ${
                      atEnd ? "border-brand-azul" : "border-brand-rosa"
                    }`}
                    style={
                      horizontal
                        ? { left: pos, top: track.cross, x: "-50%", y: "-50%" }
                        : { top: pos, left: track.cross, x: "-50%", y: "-50%" }
                    }
                    initial={false}
                    animate={{ scale: atEnd ? [1, 1.4, 1] : 1 }}
                    transition={{ duration: 0.55, ease: homeEase }}
                    aria-hidden
                  />
                )}
              </>
            )}

            {SECRETARIA_FLOW.map((step, index) => {
              const weight = reduce ? 1 : Math.max(0, 1 - Math.abs(focus - index));
              const opacity = reduce ? 1 : 0.45 + weight * 0.55;
              const shift = reduce ? 0 : (1 - weight) * 6;
              const scale = reduce ? 1 : 0.8 + weight * 0.2;
              const tone = index < 2 ? "rosa" : "azul";
              return (
                <li
                  key={step.num}
                  className="relative grid grid-cols-[1.5rem_1fr] gap-x-3 pb-6 last:pb-0 lg:block lg:pb-0"
                >
                  <span
                    ref={(el) => {
                      nodeRefs.current[index] = el;
                    }}
                    className="relative z-10 block h-2.5 w-2.5"
                    style={{ transform: `scale(${scale})` }}
                    aria-hidden
                  >
                    <span className="absolute inset-0 border border-brand-branco/30 bg-surface" />
                    <span
                      className={`absolute inset-0 border ${
                        tone === "rosa"
                          ? "border-brand-rosa bg-brand-rosa"
                          : "border-brand-azul bg-brand-azul"
                      }`}
                      style={{ opacity: weight }}
                    />
                  </span>
                  <span
                    className="min-w-0 lg:mt-5 lg:block"
                    style={{
                      opacity,
                      transform: shift ? `translateY(${shift}px)` : undefined,
                    }}
                  >
                    <span
                      className={`block text-[11px] tracking-[0.18em] ${
                        tone === "rosa" ? "text-brand-rosa" : "text-brand-azul"
                      }`}
                    >
                      {step.num}
                    </span>
                    <span className="mt-1 block text-[13px] uppercase tracking-[-0.01em] text-brand-branco sm:text-sm">
                      {step.title}
                    </span>
                    <span className="mt-1 block text-[12px] leading-relaxed text-brand-branco/60 sm:text-[13px]">
                      {step.note}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>

          <motion.p
            className="mt-8 border-t border-brand-branco/12 pt-4 text-[12px] leading-relaxed text-brand-branco/60"
            initial={{ opacity: 0, y: 8 }}
            animate={atEnd ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={reduce ? { duration: 0 } : { ...springSoft, delay: 0.35 }}
          >
            <span className="mr-3 uppercase tracking-[0.16em] text-brand-branco/50">
              Ainda não inclui
            </span>
            {SECRETARIA_NOT_YET.join(" · ")}
          </motion.p>
        </div>
      </motion.figure>
    </article>
  );
}
