import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { SplitReveal } from "@/components/split-reveal";
import { CodeRainBackground } from "@/components/code-rain-background";

export const Route = createFileRoute("/manifesto")({
  head: () => {
    const title = "Manifesto — Dreamscraft Code";
    const description =
      "Os cinco princípios que guiam a engenharia da Dreamscraft Code. Código é arquitetura. Clareza é respeito.";
    const url = "https://dreamscraftcode.com/manifesto";
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
  component: ManifestoPage,
});

const principios = [
  {
    n: "01",
    title: "Código é arquitetura, não digitação",
    sub: "Cada linha que escrevemos precisa ter uma razão. Não entregamos software — entregamos decisões técnicas justificadas.",
  },
  {
    n: "02",
    title: "O cliente não contrata código. Contrata resultado.",
    sub: "Somos responsáveis pelo negócio que o software serve. Se a funcionalidade não resolve o problema real, não importa quão elegante é o código.",
  },
  {
    n: "03",
    title: "Clareza é respeito.",
    sub: "Sem estimativa surpresa. Sem prazo inventado. Sem jargão que esconde incapacidade. O que não sabemos, falamos.",
  },
  {
    n: "04",
    title: "Feito é melhor que perfeito. Mas perfeito vem logo depois.",
    sub: "MVPs rápidos, feedback cedo, iteração constante. Mas nunca entregamos tech debt como produto final.",
  },
  {
    n: "05",
    title: "Somos o time que você deveria ter desde o começo.",
    sub: "Não terceirizamos problema. Não desaparecemos após o deploy. Estamos aqui enquanto o produto existir.",
  },
];

function ManifestoPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inRange, setInRange] = useState(false);
  const [active, setActive] = useState(0);

  // Visibility of the principles container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInRange(entry.isIntersecting),
      { rootMargin: "0px 0px -20% 0px", threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Active principle based on which section is centered
  useEffect(() => {
    const sections = principios.map((p) =>
      document.getElementById(`principio-${p.n}`),
    );
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sections.findIndex((s) => s === entry.target);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sections.forEach((s) => s && obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const goTo = (i: number) => {
    document
      .getElementById(`principio-${principios[i].n}`)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-brand-roxo text-foreground">
      <OpeningSection />
      <div ref={containerRef}>
        {principios.map((p) => (
          <PrincipleSection key={p.n} {...p} />
        ))}
      </div>
      <ClosingSection />
      <ManifestoNav
        visible={inRange}
        active={active}
        total={principios.length}
        onGo={goTo}
      />
    </div>
  );
}

function ManifestoNav({
  visible,
  active,
  total,
  onGo,
}: {
  visible: boolean;
  active: number;
  total: number;
  onGo: (i: number) => void;
}) {
  const pad = (n: number) => String(n + 1).padStart(2, "0");
  const progress = ((active + 1) / total) * 100;

  return (
    <>
      {/* MOBILE: horizontal progress bar no topo */}
      <motion.div
        initial={false}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -8 }}
        transition={{ duration: 0.4 }}
        className="md:hidden fixed top-0 left-0 right-0 z-40 pointer-events-none"
      >
        <div className="h-[3px] w-full bg-border/40">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
          />
        </div>
        <div className="mt-2 px-4 font-mono text-[10px] tracking-[0.3em] text-primary-glow">
          {pad(active)} / {String(total).padStart(2, "0")} · MANIFESTO
        </div>
      </motion.div>

      {/* DESKTOP: dots verticais na lateral direita */}
      <motion.aside
        initial={false}
        animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 16 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-5"
        style={{ pointerEvents: visible ? "auto" : "none" }}
      >
        <div className="font-mono text-[10px] tracking-[0.3em] text-primary-glow tabular-nums">
          {pad(active)} / {String(total).padStart(2, "0")}
        </div>

        <div
          aria-hidden
          className="font-mono text-[9px] tracking-[0.5em] text-muted-foreground"
          style={{
            writingMode: "vertical-lr",
            transform: "rotate(180deg)",
          }}
        >
          MANIFESTO
        </div>

        {/* Dots + linha de progresso */}
        <div className="relative flex flex-col items-center gap-4 py-2">
          {/* Trilho */}
          <span
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-px bg-border/40"
          />
          {/* Progresso */}
          <motion.span
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2 top-2 w-px bg-gradient-to-b from-primary to-primary-glow"
            animate={{
              height: `calc(${progress}% - 8px)`,
            }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
          />
          {Array.from({ length: total }).map((_, i) => {
            const isActive = i === active;
            return (
              <button
                key={i}
                onClick={() => onGo(i)}
                aria-label={`Princípio ${pad(i)}`}
                className="relative h-2 w-2 rounded-full transition-all duration-300"
                style={{
                  background: isActive
                    ? "hsl(var(--primary))"
                    : "hsl(var(--border) / 0.4)",
                  transform: isActive ? "scale(1.4)" : "scale(1)",
                  boxShadow: isActive
                    ? "0 0 12px hsl(var(--primary) / 0.8), 0 0 24px hsl(var(--primary) / 0.4)"
                    : "none",
                }}
              />
            );
          })}
        </div>
      </motion.aside>
    </>
  );
}


function OpeningSection() {
  const FULL = "DREAMSCRAFT.MANIFESTO";
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(FULL.slice(0, i));
      if (i >= FULL.length) {
        clearInterval(id);
        setTimeout(() => setDone(true), 600);
      }
    }, 70);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center bg-brand-roxo overflow-hidden">
      <CodeRainBackground seed={3} palette="rosa" className="opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,80,255,0.15),transparent_60%)]" />
      <motion.div
        animate={{ opacity: done ? 0 : 1 }}
        transition={{ duration: 0.8 }}
        className="relative font-mono text-2xl sm:text-4xl md:text-5xl tracking-tight text-soft-glow"
      >
        <span className="text-primary-glow">$</span> {typed}
        <span className="inline-block w-[0.6ch] h-[1em] align-middle bg-primary-glow ml-1 animate-pulse" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: done ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute bottom-12 text-[10px] uppercase tracking-[0.4em] font-mono text-muted-foreground"
      >
        scroll para revelar ↓
      </motion.div>
    </section>
  );
}

function PrincipleSection({
  n,
  title,
  sub,
}: {
  n: string;
  title: string;
  sub: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section
      id={`principio-${n}`}
      ref={ref}
      className="relative h-screen flex items-center overflow-hidden border-t border-primary/10 scroll-mt-0 bg-brand-roxo"
    >
      <CodeRainBackground seed={Number(n)} palette="rosa" className="opacity-20" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(175,102,249,0.12),transparent_65%)]"
      />

      {/* Watermark number — intentional, rosa accent */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span
          className="font-mono font-light leading-none text-brand-rosa tracking-[-0.03em]"
          style={{
            fontSize: "clamp(12rem, 32vw, 28rem)",
            opacity: 0.25,
          }}
        >
          {n}
        </span>
      </motion.div>

      <div className="relative mx-auto max-w-3xl px-6 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-30%" }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.4em] text-brand-rosa"
        >
          <span className="h-px w-8 bg-brand-rosa" />
          {`// princípio ${n}`}
        </motion.div>

        <SplitReveal
          as="h2"
          text={title}
          delay={0.15}
          withClip
          viewportMargin="-25%"
          once={false}
          className="mt-4 text-[clamp(1.85rem,4.8vw,3.75rem)] font-light leading-[1.08] text-brand-branco max-w-3xl tracking-[-0.03em]"
        />

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-25%" }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-xl text-base sm:text-lg text-brand-branco/70 leading-relaxed"
        >
          {sub}
        </motion.p>
      </div>
    </section>
  );
}

function ClosingSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden border-t border-primary/10 bg-brand-roxo">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-[700px] rounded-full bg-primary/30 blur-3xl" />
      <div className="relative text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-mono text-[11px] uppercase tracking-[0.4em] text-primary-glow"
        >
          // end_of_manifesto
        </motion.p>
        <div className="mt-6 text-[clamp(2.5rem,7vw,6rem)] font-light leading-[1] tracking-[-0.03em]">
          <SplitReveal
            as="h2"
            text="Quer construir"
            delay={0.15}
            withClip
            className="text-soft-glow"
          />
          <SplitReveal
            as="div"
            text="com a gente?"
            delay={0.35}
            withClip
            className="text-gradient"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10"
        >
          <Link
            to="/contato"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground hover:opacity-90 transition glow-ring font-mono uppercase tracking-wider"
          >
            Iniciar conversa <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
