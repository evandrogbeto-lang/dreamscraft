import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { homeEase } from "@/components/home/home-motion";

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
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  involves: string[];
};

const PATHS: PathItem[] = [
  {
    id: "automacao",
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
  },
  {
    id: "sistema",
    eyebrow: "Operação sem ferramenta adequada",
    title: "Sistema sob medida",
    body: "Quando planilhas, mensagens ou ferramentas genéricas já não acompanham a operação e o processo precisa ganhar uma estrutura própria.",
    involves: ["painéis", "fluxos internos", "permissões", "integrações", "regras de negócio", "APIs"],
  },
  {
    id: "produtos",
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
  },
  {
    id: "sites",
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
  },
];

const DECIDE = ["Problema", "Contexto", "Restrições", "Prioridade"] as const;

const ctaClass =
  "inline-flex min-h-12 items-center justify-center rounded-button bg-brand-rosa px-6 text-sm font-medium text-brand-roxo transition-[transform,filter] duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none";

function detailId(id: string) {
  return `solucoes-detail-${id}`;
}

function SolucoesPage() {
  const reduce = !!useReducedMotion();
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [reach, setReach] = useState(0);
  const [listHeight, setListHeight] = useState(0);
  const [fieldMin, setFieldMin] = useState(0);

  const activeId = previewId ?? selectedId;
  const selected = PATHS.find((path) => path.id === selectedId) ?? null;

  useEffect(() => {
    if (!selectedId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setSelectedId(null);
      setPreviewId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId]);

  useLayoutEffect(() => {
    const measure = () => {
      const list = listRef.current;
      const field = fieldRef.current;
      if (!list || !field) return;

      const last = rowRefs.current[PATHS.length - 1];
      if (last) {
        const listTop = list.getBoundingClientRect().top;
        setListHeight(last.getBoundingClientRect().bottom - listTop);
      }
      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      if (!activeId) {
        setReach(0);
      } else {
        const index = PATHS.findIndex((path) => path.id === activeId);
        const row = rowRefs.current[index];
        if (row) {
          const listTop = list.getBoundingClientRect().top;
          const rowRect = row.getBoundingClientRect();
          setReach(rowRect.top - listTop + rowRect.height / 2);
        }
      }

      const panel = panelRef.current;
      if (!desktop || !selectedId || !panel) {
        setFieldMin(0);
        return;
      }
      setFieldMin(Math.max(list.offsetHeight, panel.offsetHeight));
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (fieldRef.current) observer.observe(fieldRef.current);
    if (panelRef.current) observer.observe(panelRef.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [activeId, selectedId]);

  return (
    <div className="overflow-x-clip">
      <section aria-labelledby="solucoes-hero-heading" className="px-5 pb-4 pt-8 sm:px-6 sm:pt-10">
        <div className="mx-auto max-w-[1240px]">
          <p className="text-[11px] uppercase tracking-[0.22em] text-brand-rosa sm:text-[12px]">
            Soluções
          </p>
          <h1
            id="solucoes-hero-heading"
            className="mt-4 max-w-[16ch] text-[clamp(1.85rem,1.2rem+2vw,2.75rem)] font-light uppercase leading-[1.08] tracking-[-0.03em] text-brand-branco"
          >
            O que precisa mudar?
          </h1>
          <p className="mt-4 max-w-[38rem] text-sm leading-relaxed text-brand-azul sm:text-[15px] sm:leading-7">
            Entendemos o problema, o contexto, as restrições e o que precisa mudar. Só depois
            definimos o que vale construir.
          </p>
          {!selectedId && (
            <p className="mt-5 text-[12px] tracking-[0.04em] text-brand-branco/50">
              Escolha uma situação para explorar
            </p>
          )}

          <div
            ref={fieldRef}
            className="relative mt-8"
            style={fieldMin > 0 ? { minHeight: fieldMin } : undefined}
          >
            <div ref={listRef} className="relative lg:static lg:max-w-[46%]">
              <span
                className="pointer-events-none absolute left-[7px] top-0 w-px bg-brand-branco/18"
                style={{ height: listHeight }}
                aria-hidden
              />
              <span
                className="pointer-events-none absolute left-[7px] top-0 w-px origin-top bg-brand-rosa"
                style={{
                  height: Math.max(0, reach - 8),
                  transition: reduce ? "none" : "height 160ms linear",
                }}
                aria-hidden
              />

              {PATHS.map((path, index) => {
                const isPreview = previewId === path.id;
                const isSelected = selectedId === path.id;
                const isActive = activeId === path.id;
                const shift = reduce ? 0 : isSelected ? 14 : isPreview ? 8 : 0;
                const dim = !reduce && !!activeId && !isActive;

                return (
                  <div key={path.id} className="static">
                    <div
                      ref={(node) => {
                        rowRefs.current[index] = node;
                      }}
                      className="relative"
                    >
                      <span
                        className="pointer-events-none absolute left-[7px] top-1/2 h-px -translate-y-1/2 bg-brand-rosa"
                        style={{
                          width: isActive ? 22 : 10,
                          opacity: isActive ? 1 : 0.4,
                          transition: reduce ? "none" : "width 160ms linear, opacity 160ms linear",
                        }}
                        aria-hidden
                      />
                      <button
                        type="button"
                        aria-expanded={isSelected}
                        aria-controls={detailId(path.id)}
                        className="w-full min-h-11 py-3 pl-8 pr-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        style={{
                          transform: `translateX(${shift}px)`,
                          opacity: dim ? 0.85 : 1,
                          transition: reduce
                            ? "none"
                            : "transform 160ms linear, opacity 160ms linear",
                        }}
                        onPointerEnter={(event) => {
                          if (event.pointerType === "mouse") setPreviewId(path.id);
                        }}
                        onPointerLeave={(event) => {
                          if (event.pointerType !== "mouse") return;
                          setPreviewId((current) => (current === path.id ? null : current));
                        }}
                        onFocus={() => setPreviewId(path.id)}
                        onBlur={() => {
                          setPreviewId((current) => (current === path.id ? null : current));
                        }}
                        onClick={() => setSelectedId(path.id)}
                      >
                        <span className="block text-[11px] uppercase leading-snug tracking-[0.14em] text-brand-rosa sm:text-[12px]">
                          {path.eyebrow}
                        </span>
                        <span className="mt-1 block text-base font-light uppercase leading-snug tracking-[-0.02em] text-brand-branco sm:text-[1.15rem]">
                          {path.title}
                        </span>
                      </button>
                    </div>

                    {isSelected && (
                      <div
                        id={detailId(path.id)}
                        ref={panelRef}
                        className="mt-2 mb-4 border-l border-brand-rosa/45 py-1 pl-4 lg:absolute lg:top-0 lg:left-[52%] lg:mt-0 lg:mb-0 lg:w-[44%] lg:py-0 lg:pl-8"
                      >
                        <PathDetail path={path} reduce={reduce} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mt-10 max-w-xl text-sm leading-relaxed text-brand-branco/80 sm:text-[15px]">
            Não começamos escolhendo a stack.
          </p>
        </div>
      </section>

      <section aria-label="Diagnóstico" className="px-5 pt-8 pb-16 sm:px-6 sm:pt-10 sm:pb-20">
        <div className="mx-auto max-w-[1240px]">
          <p className="max-w-xl text-sm leading-relaxed text-brand-azul sm:text-[15px] sm:leading-7">
            Se você sabe o que precisa mudar, mas ainda não qual caminho seguir, o diagnóstico
            organiza o primeiro recorte.
          </p>
          <div className="mt-6">
            <Link to="/estimar" className={ctaClass}>
              Solicitar diagnóstico
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function PathDetail({ path, reduce }: { path: PathItem; reduce: boolean }) {
  const body = (
    <>
      <h2 className="text-[clamp(1.25rem,1rem+0.8vw,1.7rem)] font-light uppercase leading-[1.12] tracking-[-0.03em] text-brand-branco">
        {path.title}
      </h2>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-azul sm:text-[15px] sm:leading-7">
        {path.body}
      </p>
      <p className="mt-7 text-[11px] uppercase tracking-[0.16em] text-brand-branco/55">
        Pode envolver
      </p>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t border-brand-branco/15 pt-3 text-sm text-brand-branco/85">
        {path.involves.map((item) => (
          <li key={item}>
            <span className="mr-2 text-brand-rosa" aria-hidden>
              ·
            </span>
            {item}
          </li>
        ))}
      </ul>
      <ol className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-2 text-[12px] uppercase tracking-[0.12em] text-brand-branco">
        {DECIDE.map((item, index) => (
          <li key={item} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-brand-rosa" aria-hidden>
                →
              </span>
            )}
            {item}
          </li>
        ))}
      </ol>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-azul sm:text-[15px] sm:leading-7">
        Essas respostas definem o primeiro recorte. Tecnologia, escopo, cronograma e investimento
        vêm depois.
      </p>
    </>
  );

  if (reduce) return <div>{body}</div>;

  return (
    <motion.div
      key={path.id}
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22, ease: homeEase }}
    >
      {body}
    </motion.div>
  );
}
