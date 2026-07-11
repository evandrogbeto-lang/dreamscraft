import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ArrowRight, Calendar, Clock, Search, Sparkles } from "lucide-react";
import { posts, tags } from "@/lib/blog-posts";
import { CodeRainBackground } from "@/components/code-rain-background";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Dreamscraft Code" },
      {
        name: "description",
        content:
          "Engenharia em público — decisões técnicas reais, guias de preço, escolha de stack e estratégia de produto. Sem tutorial genérico.",
      },
      { property: "og:title", content: "Blog — Dreamscraft Code" },
      {
        property: "og:description",
        content:
          "Decisões técnicas reais, guias de preço, escolha de stack e estratégia de produto.",
      },
      { property: "og:url", content: "https://dreamscraftcode.com.br/blog" },
    ],
  }),
  component: BlogIndex,
});

const tagColors: Record<string, string> = {
  Preços: "bg-brand-amarelo/15 text-brand-amarelo border-brand-amarelo/30",
  Estratégia: "bg-brand-azul/15 text-brand-azul border-brand-azul/30",
  Processo: "bg-primary/15 text-primary-glow border-primary/30",
  "React Native": "bg-brand-azul/15 text-brand-azul border-brand-azul/30",
  "Node.js": "bg-brand-amarelo/15 text-brand-amarelo border-brand-amarelo/30",
  IA: "bg-primary/15 text-primary-glow border-primary/30",
  Arquitetura: "bg-brand-amarelo/15 text-brand-amarelo border-brand-amarelo/30",
  Negócio: "bg-brand-rosa/15 text-brand-rosa border-brand-rosa/30",
};

const tagGradients: Record<string, string> = {
  Preços: "from-brand-amarelo/25 via-brand-amarelo/15 to-transparent",
  Estratégia: "from-brand-azul/25 via-brand-azul/15 to-transparent",
  Processo: "from-primary/25 via-primary-glow/15 to-transparent",
  "React Native": "from-brand-azul/25 via-brand-azul/15 to-transparent",
  "Node.js": "from-brand-amarelo/25 via-brand-azul/15 to-transparent",
  IA: "from-primary/25 via-primary-glow/15 to-transparent",
  Arquitetura: "from-brand-amarelo/25 via-brand-amarelo/15 to-transparent",
  Negócio: "from-brand-rosa/25 via-brand-rosa/15 to-transparent",
};

function BlogIndex() {
  const [active, setActive] = useState<string>("Todos");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const byTag =
      active === "Todos" ? posts : posts.filter((p) => p.tag === active);
    if (!query.trim()) return byTag;
    const q = query.toLowerCase();
    return byTag.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q),
    );
  }, [active, query]);

  const totalReadTime = posts.reduce((a, p) => a + p.readTime, 0);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <CodeRainBackground seed={13} className="opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(175,102,249,0.22),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(106,120,246,0.15),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-primary-glow">
              <Sparkles className="h-3 w-3" /> blog · engenharia em público
            </p>
            <h1 className="mt-5 text-5xl sm:text-7xl font-display font-light tracking-[-0.03em] leading-[0.95] max-w-4xl text-gradient">
              O que a gente faz,
              <br />
              em primeira pessoa.
            </h1>
            <p className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Decisões técnicas reais, guias práticos de preço, escolha de stack
              e estratégia de produto. Texto direto, escrito por quem programa.
            </p>

            {/* Stats */}
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-3 text-sm">
              <div>
                <dt className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  artigos
                </dt>
                <dd className="mt-1 font-display text-2xl font-light text-foreground">
                  {posts.length}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  minutos de leitura
                </dt>
                <dd className="mt-1 font-display text-2xl font-light text-foreground">
                  {totalReadTime}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  categorias
                </dt>
                <dd className="mt-1 font-display text-2xl font-light text-foreground">
                  {tags.length - 1}
                </dd>
              </div>
            </dl>
          </motion.div>
        </div>
      </section>

      {/* Filtros + busca */}
      <section className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => {
              const isActive = active === t;
              return (
                <button
                  key={t}
                  onClick={() => setActive(t)}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm border transition font-medium ${
                    isActive
                      ? "bg-primary text-primary-foreground border-transparent glow-ring"
                      : "border-border bg-surface/50 text-muted-foreground hover:text-foreground hover:bg-surface-elevated"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar no blog..."
              className="w-full rounded-full border border-border bg-surface/50 pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40"
            />
          </div>
        </div>
      </section>

      {/* Lista */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        {(() => {
          const featured =
            active === "Todos" && !query
              ? filtered.find((p) => p.featured)
              : undefined;
          const rest = featured
            ? filtered.filter((p) => p.slug !== featured.slug)
            : filtered;
          return (
            <>
              {featured && (
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="group mb-10"
                >
                  <Link
                    to="/blog/$slug"
                    params={{ slug: featured.slug }}
                    className="block glass-card rounded-3xl p-8 sm:p-12 hover:bg-surface-elevated transition relative overflow-hidden border-primary/30"
                  >
                    <div
                      className={`absolute -top-24 -right-24 h-80 w-80 rounded-full blur-3xl bg-gradient-to-br ${
                        tagGradients[featured.tag] ?? "from-primary/30 to-transparent"
                      }`}
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_50%)]" />
                    <div className="relative">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] px-2.5 py-1 rounded-full border border-brand-amber/50 bg-brand-amber/10 text-brand-amber">
                          ● Destaque
                        </span>
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                            tagColors[featured.tag] ??
                            "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {featured.tag}
                        </span>
                      </div>
                      <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-display font-light tracking-[-0.03em] leading-[1.1] text-soft-glow group-hover:text-primary-glow transition max-w-4xl">
                        {featured.title}
                      </h2>
                      <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
                        {featured.excerpt}
                      </p>
                      <div className="mt-8 flex items-center gap-5 text-xs text-muted-foreground font-mono">
                        <span className="inline-flex items-center gap-1.5 text-brand-amber">
                          <Calendar className="h-3 w-3" /> {featured.dateLabel}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-3 w-3" /> {featured.readTime} min
                        </span>
                        <span className="inline-flex items-center gap-1 text-primary-glow group-hover:gap-2 transition-all">
                          ler agora <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              )}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((p, i) => (
                  <motion.article
                    key={p.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    className="group"
                  >
                    <Link
                      to="/blog/$slug"
                      params={{ slug: p.slug }}
                      className="relative block h-full glass-card rounded-3xl overflow-hidden border border-border/60 hover:border-primary/40 transition"
                    >
                      {/* Visual header com gradiente por categoria */}
                      <div
                        className={`relative h-32 bg-gradient-to-br ${
                          tagGradients[p.tag] ??
                          "from-primary/20 to-transparent"
                        } overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent_60%)]" />
                        <div className="absolute bottom-3 left-5">
                          <span
                            className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${
                              tagColors[p.tag] ??
                              "bg-muted text-muted-foreground border-border"
                            }`}
                          >
                            {p.tag}
                          </span>
                        </div>
                        <div className="absolute top-3 right-4 font-mono text-[10px] uppercase tracking-widest text-foreground/30">
                          {String(posts.indexOf(p) + 1).padStart(2, "0")}
                        </div>
                      </div>

                      <div className="p-6 flex flex-col h-[calc(100%-8rem)]">
                        <h2 className="text-xl font-display font-light tracking-[-0.03em] leading-snug group-hover:text-primary-glow transition">
                          {p.title}
                        </h2>
                        <p className="mt-3 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {p.excerpt}
                        </p>

                        <div className="mt-auto pt-6 border-t border-border/60 flex items-center gap-4 text-xs text-muted-foreground font-mono">
                          <span className="inline-flex items-center gap-1.5 text-brand-amber">
                            <Calendar className="h-3 w-3" /> {p.dateLabel}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-3 w-3" /> {p.readTime} min
                          </span>
                          <span className="ml-auto inline-flex items-center gap-1 text-primary-glow opacity-0 group-hover:opacity-100 group-hover:gap-2 transition-all">
                            ler <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="mt-16 text-center">
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    // sem resultados
                  </p>
                  <p className="mt-3 text-muted-foreground">
                    Nada por aqui ainda. Tente outra categoria ou limpe a busca.
                  </p>
                </div>
              )}
            </>
          );
        })()}
      </section>

      {/* CTA fim de página */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-transparent to-primary-glow/10 p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-[600px] rounded-full bg-primary/20 blur-3xl" />
          <div className="relative">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow">
              // próximo passo
            </p>
            <h2 className="mt-4 text-3xl sm:text-4xl font-display font-light tracking-[-0.03em]">
              Gostou do que leu? Vamos construir o seu.
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              30 minutos de conversa, diagnóstico claro, sem compromisso.
            </p>
            <Link
              to="/contato"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground hover:opacity-90 transition glow-ring font-mono uppercase tracking-wider"
            >
              Iniciar conversa <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export { tagColors };
