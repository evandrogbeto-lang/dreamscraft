import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import { getAdjacent, getPostBySlug, type Block } from "@/lib/blog-posts";
import { tagColors } from "./blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post, adjacent: getAdjacent(params.slug) };
  },
  head: ({ params, loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.post.title} — Dreamscraft Code` },
            { name: "description", content: loaderData.post.excerpt },
            { property: "og:title", content: loaderData.post.title },
            { property: "og:description", content: loaderData.post.excerpt },
            { property: "og:type", content: "article" },
            {
              property: "og:url",
              content: `https://dreamscraftcode.com.br/blog/${params.slug}`,
            },
            { property: "article:published_time", content: loaderData.post.date },
          ],
          scripts: [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: loaderData.post.title,
                description: loaderData.post.excerpt,
                datePublished: loaderData.post.date,
                dateModified: loaderData.post.date,
                author: {
                  "@type": "Organization",
                  name: "Dreamscraft Code",
                  url: "https://dreamscraftcode.com.br",
                },
                publisher: {
                  "@type": "Organization",
                  name: "Dreamscraft Code",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://dreamscraftcode.com.br/icone-roxo.png",
                  },
                },
                mainEntityOfPage: `https://dreamscraftcode.com.br/blog/${params.slug}`,
                articleSection: loaderData.post.tag,
              }),
            },
          ],
        }
      : {},
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-primary">404</p>
      <h1 className="mt-3 text-3xl font-light tracking-[-0.03em]">Post não encontrado</h1>
      <Link to="/blog" className="mt-6 inline-flex items-center gap-2 text-primary-glow">
        <ArrowLeft className="h-4 w-4" /> Voltar para o blog
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <h1 className="text-2xl font-light tracking-[-0.03em]">Erro ao carregar o post</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: BlogPost,
});

const codeKeywords =
  /\b(const|let|var|function|return|if|else|for|while|import|export|from|default|async|await|class|new|extends|interface|type|enum|public|private|protected|null|undefined|true|false|throw|try|catch|finally|in|of|as)\b/g;
const sqlKeywords =
  /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|CREATE|TABLE|ALTER|DROP|TYPE|ENUM|POLICY|USING|WITH|CHECK|AS|FOR|ON|REFERENCES|PRIMARY|KEY|NOT|NULL|DEFAULT|UNIQUE|INDEX|GIN|VARCHAR|INTEGER|TEXT|UUID|TIMESTAMPTZ|BOOLEAN|AND|OR)\b/g;

function highlight(code: string, lang: string): string {
  // Escape HTML
  let out = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Strings (do first so other patterns don't match inside)
  out = out.replace(
    /(&quot;|&#39;|`)((?:\\.|(?!\1).)*)\1/g,
    '<span class="text-brand-amarelo">$1$2$1</span>',
  );
  // Comments
  out = out.replace(
    /(\/\/[^\n]*)/g,
    '<span class="text-muted-foreground italic">$1</span>',
  );
  out = out.replace(
    /(--[^\n]*)/g,
    '<span class="text-muted-foreground italic">$1</span>',
  );
  // Numbers
  out = out.replace(/\b(\d+)\b/g, '<span class="text-brand-amarelo">$1</span>');
  // Keywords
  const kw = lang === "sql" ? sqlKeywords : codeKeywords;
  out = out.replace(kw, '<span class="text-primary-glow font-semibold">$&</span>');

  return out;
}

function Renderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2
                key={i}
                className="mt-12 mb-4 text-2xl sm:text-3xl font-semibold text-foreground tracking-tight"
              >
                {b.text}
              </h2>
            );
          case "p":
            return (
              <p key={i} className="my-5 text-base sm:text-lg leading-relaxed text-muted-foreground">
                {b.text}
              </p>
            );
          case "ul":
            return (
              <ul key={i} className="my-5 space-y-2 pl-5">
                {b.items.map((it, j) => (
                  <li
                    key={j}
                    className="text-muted-foreground text-base leading-relaxed list-disc marker:text-primary"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="my-8 border-l-2 border-primary pl-5 py-1 italic text-lg text-foreground/90"
              >
                "{b.text}"
              </blockquote>
            );
          case "code":
            return (
              <pre
                key={i}
                className="my-6 overflow-x-auto rounded-xl border border-border bg-[#0A0620] p-5 text-sm leading-relaxed"
              >
                <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
                  <span className="h-2 w-2 rounded-full bg-brand-rosa/70" />
                  <span className="h-2 w-2 rounded-full bg-brand-amarelo/70" />
                  <span className="h-2 w-2 rounded-full bg-brand-amarelo/70" />
                  <span className="ml-2">{b.lang}</span>
                </div>
                <code
                  className="font-mono text-foreground/90"
                  dangerouslySetInnerHTML={{ __html: highlight(b.code, b.lang) }}
                />
              </pre>
            );
        }
      })}
    </>
  );
}

function BlogPost() {
  const { post, adjacent } = Route.useLoaderData();

  return (
    <article className="mx-auto max-w-3xl px-6 pt-16 pb-24">
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Todos os posts
      </Link>

      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-8"
      >
        <span
          className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border ${
            tagColors[post.tag] ?? "bg-muted text-muted-foreground border-border"
          }`}
        >
          {post.tag}
        </span>
        <h1 className="mt-5 text-4xl sm:text-5xl font-light tracking-[-0.03em] leading-tight text-soft-glow">
          {post.title}
        </h1>
        <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground font-mono">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> {post.dateLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {post.readTime} min de leitura
          </span>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-10"
      >
        <Renderer blocks={post.content} />
      </motion.div>

      {/* CTA */}
      <div className="mt-16 glass-card rounded-3xl p-8 sm:p-10 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary-glow">
          // próximo passo
        </p>
        <h2 className="mt-3 text-2xl sm:text-3xl font-light tracking-[-0.03em]">
          Gostou do conteúdo? Vamos construir seu projeto.
        </h2>
        <Link
          to="/contato"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition glow-ring"
        >
          Iniciar conversa <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Prev / Next */}
      <nav className="mt-12 grid sm:grid-cols-2 gap-4">
        {adjacent.prev ? (
          <Link
            to="/blog/$slug"
            params={{ slug: adjacent.prev.slug }}
            className="group rounded-2xl border border-border bg-surface/40 hover:bg-surface-elevated p-5 transition"
          >
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono inline-flex items-center gap-1.5">
              <ArrowLeft className="h-3 w-3" /> post anterior
            </p>
            <p className="mt-2 font-semibold leading-snug group-hover:text-primary-glow transition">
              {adjacent.prev.title}
            </p>
          </Link>
        ) : (
          <div />
        )}
        {adjacent.next ? (
          <Link
            to="/blog/$slug"
            params={{ slug: adjacent.next.slug }}
            className="group rounded-2xl border border-border bg-surface/40 hover:bg-surface-elevated p-5 transition sm:text-right"
          >
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono inline-flex items-center gap-1.5 sm:justify-end w-full">
              próximo post <ArrowRight className="h-3 w-3" />
            </p>
            <p className="mt-2 font-semibold leading-snug group-hover:text-primary-glow transition">
              {adjacent.next.title}
            </p>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
