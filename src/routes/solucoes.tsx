import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { HOME_SPRING, HOME_SPRING_SOFT } from "@/components/home/home-motion";

export const Route = createFileRoute("/solucoes")({
  head: () => ({
    meta: [
      { title: "Soluções — Dreamscraft Code" },
      {
        name: "description",
        content:
          "Automação, sistemas sob medida, produtos digitais e sites institucionais — sempre partindo do problema, do contexto e do que precisa mudar.",
      },
      { property: "og:title", content: "Soluções — Dreamscraft Code" },
      {
        property: "og:description",
        content:
          "Automação, sistemas sob medida, produtos digitais e sites institucionais — sempre partindo do problema, do contexto e do que precisa mudar.",
      },
      { property: "og:url", content: "https://dreamscraftcode.com/solucoes" },
    ],
  }),
  component: SolucoesPage,
});

type PathItem = {
  num: string;
  eyebrow: string;
  title: string;
  body: string;
  involves: string[];
  surface: "dark" | "lavanda";
  accent: "rosa" | "azul";
};

const PATHS: PathItem[] = [
  {
    num: "01",
    eyebrow: "Operação manual ou repetitiva",
    title: "Automação e atendimento",
    body: "Para fluxos que dependem de copiar informação, responder sempre a mesma coisa, mover dados entre ferramentas ou executar tarefas repetitivas manualmente.",
    involves: [
      "automações",
      "integrações",
      "atendimento assistido",
      "agentes/IA quando fizer sentido",
      "fluxos entre ferramentas existentes",
    ],
    surface: "dark",
    accent: "rosa",
  },
  {
    num: "02",
    eyebrow: "Operação sem ferramenta adequada",
    title: "Sistema sob medida",
    body: "Quando planilhas, mensagens ou ferramentas genéricas já não acompanham a operação e o processo precisa ganhar uma estrutura própria.",
    involves: [
      "painéis",
      "fluxos internos",
      "permissões",
      "integrações",
      "regras de negócio",
      "APIs",
    ],
    surface: "lavanda",
    accent: "azul",
  },
  {
    num: "03",
    eyebrow: "Ideia que precisa virar produto",
    title: "Produtos digitais",
    body: "Para transformar uma hipótese ou necessidade em algo que possa ser testado, usado e evoluído.",
    involves: [
      "discovery",
      "protótipo",
      "MVP",
      "aplicação web",
      "app quando realmente necessário",
      "arquitetura para evolução",
    ],
    surface: "dark",
    accent: "rosa",
  },
  {
    num: "04",
    eyebrow: "Marca que precisa existir melhor na internet",
    title: "Sites institucionais",
    body: "Para transformar presença digital dispersa em uma casa própria da marca — clara, responsiva e construída para representar o negócio com identidade.",
    involves: [
      "landing pages",
      "sites institucionais",
      "páginas de campanha",
      "integrações simples",
      "formulários/captação",
      "SEO técnico básico quando aplicável",
    ],
    surface: "lavanda",
    accent: "azul",
  },
];

const DECIDE = [
  { num: "01", title: "Problema" },
  { num: "02", title: "Contexto" },
  { num: "03", title: "Restrições" },
  { num: "04", title: "Prioridade" },
] as const;

const HERO_FLOW = ["Problema", "Contexto", "Caminho", "Construção"] as const;

function SolucoesPage() {
  const reduce = useReducedMotion();
  const pathsRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: pathsRef,
    offset: ["start 75%", "end 35%"],
  });
  const railProgress = useSpring(scrollYProgress, HOME_SPRING);
  const railScale = useTransform(railProgress, (v) => (reduce ? 1 : v));

  const spring = { type: "spring" as const, ...HOME_SPRING };
  const springSoft = { type: "spring" as const, ...HOME_SPRING_SOFT };

  const heroStart = reduce ? { opacity: 1, y: 0 } : { opacity: 0.55, y: 18 };
  const heroSettle = reduce
    ? { opacity: 1, y: 0 }
    : { opacity: 1, y: 0, transition: spring };

  return (
    <div className="overflow-x-clip">
      {/* Hero */}
      <section
        aria-labelledby="solucoes-hero-heading"
        className="px-5 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:pb-20 lg:pt-14"
      >
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-12 lg:items-start lg:gap-10">
          <motion.div
            className="min-w-0 lg:col-span-7"
            initial={heroStart}
            animate={heroSettle}
          >
            <p className="text-[11px] uppercase tracking-[0.22em] text-brand-rosa sm:text-[12px]">
              Soluções
            </p>
            <h1
              id="solucoes-hero-heading"
              className="mt-5 max-w-[20ch] text-[clamp(1.75rem,1.1rem+2.6vw,3.25rem)] font-light uppercase leading-[1.1] tracking-[-0.03em] text-brand-branco sm:max-w-[22ch]"
            >
              A solução começa
              <br />
              antes da tecnologia.
            </h1>
            <p className="mt-6 max-w-[38rem] text-sm leading-relaxed text-brand-azul sm:text-base sm:leading-7">
              Entendemos o problema, o contexto, as restrições e o que precisa mudar. Só depois
              definimos o que vale construir.
            </p>
            <div className="mt-10">
              <Link
                to="/estimar"
                className="inline-flex min-h-12 items-center justify-center rounded-button bg-brand-rosa px-6 text-sm font-medium text-brand-roxo transition-[transform,filter] duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa motion-reduce:transform-none"
              >
                Solicitar diagnóstico
              </Link>
            </div>
          </motion.div>

          <aside
            className="lg:col-span-5 lg:pt-3"
            aria-label="Fluxo da solução"
          >
            <motion.ol
              className="border-t border-brand-branco/20 pt-6 lg:border-t-0 lg:border-l lg:pl-10 lg:pt-0"
              initial={reduce ? { opacity: 1 } : { opacity: 0.5 }}
              animate={
                reduce
                  ? { opacity: 1 }
                  : { opacity: 1, transition: { ...spring, delay: 0.14 } }
              }
            >
              {HERO_FLOW.map((label, index) => (
                <li key={label} className="relative pb-6 last:pb-0">
                  <p className="text-sm font-light uppercase tracking-[-0.01em] text-brand-branco">
                    {label}
                  </p>
                  {index < HERO_FLOW.length - 1 && (
                    <span
                      className="mt-3 block text-brand-rosa/80"
                      aria-hidden
                    >
                      ↓
                    </span>
                  )}
                </li>
              ))}
            </motion.ol>
          </aside>
        </div>
      </section>

      {/* Caminhos — rail progressivo */}
      <section
        aria-labelledby="solucoes-paths-heading"
        className="px-5 pb-6 sm:px-6 lg:pb-8"
      >
        <div className="mx-auto max-w-[1240px]">
          <motion.h2
            id="solucoes-paths-heading"
            className="max-w-[18ch] text-[clamp(1.4rem,1rem+1.7vw,2.25rem)] font-light uppercase leading-[1.12] tracking-[-0.03em] text-brand-branco sm:max-w-[20ch]"
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0.55, y: 16 }}
            whileInView={
              reduce
                ? { opacity: 1, y: 0 }
                : { opacity: 1, y: 0, transition: spring }
            }
            viewport={{ once: true, amount: 0.6 }}
          >
            O que precisa mudar?
          </motion.h2>
        </div>

        <div ref={pathsRef} className="relative mx-auto mt-10 max-w-[1240px] lg:mt-14">
          {/* Rail progressivo */}
          <div
            className="pointer-events-none absolute bottom-8 left-0 top-2 hidden w-px bg-brand-branco/15 lg:block"
            aria-hidden
          >
            <motion.div
              className="h-full w-px origin-top bg-brand-rosa"
              style={{ scaleY: railScale }}
            />
          </div>

          <div className="space-y-6 lg:space-y-8 lg:pl-10">
            {PATHS.map((path, index) => (
              <PathBlock
                key={path.num}
                path={path}
                reduce={!!reduce}
                delay={index * 0.04}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Como decidimos */}
      <section
        aria-labelledby="solucoes-decide-heading"
        className="px-5 pt-14 pb-8 sm:px-6 sm:pt-16 sm:pb-10 lg:pt-20 lg:pb-10"
      >
        <motion.div
          className="mx-auto max-w-[1240px]"
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0.55, y: 18 }}
          whileInView={
            reduce
              ? { opacity: 1, y: 0 }
              : { opacity: 1, y: 0, transition: springSoft }
          }
          viewport={{ once: true, amount: 0.35 }}
        >
          <h2
            id="solucoes-decide-heading"
            className="max-w-[20ch] text-[clamp(1.35rem,1rem+1.5vw,2.1rem)] font-light uppercase leading-[1.14] tracking-[-0.03em] text-brand-branco sm:max-w-[22ch]"
          >
            Não começamos
            <br />
            escolhendo a stack.
          </h2>
          <ol className="mt-10 grid gap-6 border-t border-brand-branco/15 pt-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {DECIDE.map((item) => (
              <li key={item.num}>
                <p
                  className={`text-[11px] tracking-[0.18em] ${
                    item.num === "01" || item.num === "03"
                      ? "text-brand-rosa"
                      : "text-brand-azul"
                  }`}
                >
                  {item.num}
                </p>
                <p className="mt-2 text-sm font-light uppercase tracking-[-0.01em] text-brand-branco sm:text-[15px]">
                  {item.title}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-brand-azul sm:text-base sm:leading-7">
            Essas respostas definem o primeiro recorte. Tecnologia, escopo, cronograma e
            investimento vêm depois.
          </p>
        </motion.div>
      </section>

      {/* Fechamento — conclusão compacta */}
      <section
        aria-labelledby="solucoes-cta-heading"
        className="px-5 pt-8 pb-16 sm:px-6 sm:pt-10 sm:pb-20 lg:pt-12 lg:pb-24"
      >
        <motion.div
          className="mx-auto max-w-[1240px] border-t border-brand-branco/15 pt-8 sm:pt-10"
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0.55, y: 14 }}
          whileInView={
            reduce
              ? { opacity: 1, y: 0 }
              : { opacity: 1, y: 0, transition: spring }
          }
          viewport={{ once: true, amount: 0.4 }}
        >
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
            <div className="lg:col-span-7">
              <p className="text-[11px] uppercase tracking-[0.22em] text-brand-rosa">
                Próximo passo
              </p>
              <h2
                id="solucoes-cta-heading"
                className="mt-4 max-w-[16ch] text-[clamp(1.35rem,1rem+1.4vw,2.15rem)] font-light uppercase leading-[1.14] tracking-[-0.03em] text-brand-branco sm:max-w-[18ch]"
              >
                O problema vem
                <br />
                antes da solução.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <div className="h-px w-12 bg-brand-rosa/70" aria-hidden />
              <p className="mt-4 max-w-md text-sm leading-relaxed text-brand-azul sm:text-[15px] sm:leading-7">
                Se você sabe o que precisa mudar, mas ainda não qual caminho seguir, o
                diagnóstico organiza o primeiro recorte.
              </p>
              <div className="mt-6">
                <Link
                  to="/estimar"
                  className="inline-flex min-h-12 items-center justify-center rounded-button bg-brand-rosa px-6 text-sm font-medium text-brand-roxo transition-[transform,filter] duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa motion-reduce:transform-none"
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

function PathBlock({
  path,
  reduce,
  delay,
}: {
  path: PathItem;
  reduce: boolean;
  delay: number;
}) {
  const isLavanda = path.surface === "lavanda";
  const accentClass = path.accent === "rosa" ? "text-brand-rosa" : "text-brand-azul";
  const spring = { type: "spring" as const, ...HOME_SPRING };

  return (
    <motion.article
      aria-labelledby={`solucoes-path-${path.num}`}
      className={
        isLavanda
          ? "border border-brand-roxo/15 bg-brand-branco text-brand-roxo"
          : "border border-brand-branco/12 bg-transparent text-brand-branco"
      }
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0.55, y: 22 }}
      whileInView={
        reduce
          ? { opacity: 1, y: 0 }
          : { opacity: 1, y: 0, transition: { ...spring, delay } }
      }
      viewport={{ once: true, amount: 0.28 }}
    >
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-12 lg:gap-10 lg:p-10">
        <div className="lg:col-span-5">
          <div className="flex items-baseline gap-4">
            <p className={`text-[clamp(2rem,1.5rem+2vw,3rem)] font-light tracking-[-0.04em] ${accentClass}`}>
              {path.num}
            </p>
            <div
              className={`h-px flex-1 ${isLavanda ? "bg-brand-roxo/20" : "bg-brand-branco/20"}`}
              aria-hidden
            />
          </div>
          <p
            className={`mt-5 text-[11px] uppercase tracking-[0.18em] ${
              isLavanda ? "text-brand-azul" : accentClass
            }`}
          >
            {path.eyebrow}
          </p>
          <h3
            id={`solucoes-path-${path.num}`}
            className={`mt-3 max-w-[18ch] text-[clamp(1.3rem,1rem+1vw,1.75rem)] font-light leading-[1.15] tracking-[-0.02em] ${
              isLavanda ? "text-brand-roxo" : "text-brand-branco"
            }`}
          >
            {path.title}
          </h3>
        </div>

        <div className="lg:col-span-7">
          <p
            className={`max-w-xl text-sm leading-relaxed sm:text-[15px] sm:leading-7 ${
              isLavanda ? "text-brand-roxo/80" : "text-brand-azul"
            }`}
          >
            {path.body}
          </p>
          <div className="mt-7">
            <p
              className={`text-[11px] uppercase tracking-[0.16em] ${
                isLavanda ? "text-brand-roxo/55" : "text-brand-branco/55"
              }`}
            >
              Pode envolver
            </p>
            <ul
              className={`mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t pt-3 text-sm ${
                isLavanda
                  ? "border-brand-roxo/15 text-brand-roxo/85"
                  : "border-brand-branco/15 text-brand-branco/85"
              }`}
            >
              {path.involves.map((item) => (
                <li key={item} className="before:mr-2 before:text-brand-rosa before:content-['·']">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
