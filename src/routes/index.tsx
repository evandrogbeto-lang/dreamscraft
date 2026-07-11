import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { Clock, Zap, MessageSquare, Mail, Calendar, CircleDot } from "lucide-react";
import { LiveTerminal } from "@/components/live-terminal";
import { PinnedBuild } from "@/components/pinned-build";
import { PipelineScroll } from "@/components/pipeline-scroll";
import { ProjectStory } from "@/components/project-story";
import { ProofOfWork } from "@/components/proof-of-work";
import { MagneticButton } from "@/components/MagneticButton";
import { TiltCard } from "@/components/TiltCard";
import { CodeRainBackground } from "@/components/code-rain-background";

export const Route = createFileRoute("/")({
  head: () => {
    const title = "Dreamscraft Code — Codificamos sua visão";
    const description =
      "Engenharia digital de elite: apps, sistemas web, SaaS e automação com IA. Codificamos sua visão da arquitetura ao deploy.";
    const url = "https://dreamscraftcode.com.br/";
    const image = "https://dreamscraftcode.com.br/og-image.png";
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

const services = [
  {
    name: "Apps Mobile",
    desc: "iOS e Android com design focado em conversão e publicação nas lojas.",
    stack: ["React Native", "Expo", "Swift", "Kotlin"],
  },
  {
    name: "Sistemas Web",
    desc: "SaaS, painéis e plataformas robustas que escalam com o seu negócio.",
    stack: ["React", "TypeScript", "Node", "Postgres"],
  },
  {
    name: "Automação com IA",
    desc: "Agentes, chatbots e fluxos que reduzem custo operacional.",
    stack: ["OpenAI", "n8n", "LangChain", "Supabase"],
  },
  {
    name: "Consultoria",
    desc: "Auditoria técnica, integração de legados e migração de dados.",
    stack: ["Arquitetura", "DevOps", "Cloud", "Mentoria"],
  },
];

const pioneiroBenefits = [
  {
    title: "Preço de fundador",
    desc: "Escopo travado com condição pioneira — vale apenas para os primeiros contratos assinados em 2026.",
  },
  {
    title: "Prioridade absoluta na fila",
    desc: "Seu projeto entra na frente. Sprint dedicada, sem dividir foco com carteira antiga.",
  },
  {
    title: "Case coautorado",
    desc: "Publicamos o processo, os números e as decisões técnicas — com sua aprovação. Você vira referência junto.",
  },
  {
    title: "Suporte estendido",
    desc: "60 dias de acompanhamento pós-deploy inclusos. Ajuste fino, correções e handoff completo.",
  },
];

function BrasiliaCard() {
  const [time, setTime] = useState("");
  const [isBusinessHours, setIsBusinessHours] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const bsb = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
      const h = bsb.getHours();
      const m = bsb.getMinutes();
      const pad = (n: number) => String(n).padStart(2, "0");
      setTime(`${pad(h)}:${pad(m)}`);
      const day = bsb.getDay();
      setIsBusinessHours(day >= 1 && day <= 5 && h >= 9 && h < 19);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TiltCard maxTilt={6} className="glass-card rounded-2xl border border-border/60 p-8 space-y-8">
      {/* Relógio */}
      <div>
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-primary-glow font-mono">
          <Clock className="h-3.5 w-3.5" />
          Brasília, DF — UTC-3
        </div>
        <div className="mt-3 text-5xl sm:text-6xl font-bold font-mono text-soft-glow tabular-nums">
          {time || "--:--"}
        </div>
      </div>

      {/* Disponibilidade */}
      <div className="flex items-start gap-3">
        <span
          className={`mt-1.5 h-2.5 w-2.5 rounded-full ${
            isBusinessHours ? "bg-brand-amarelo node-pulse" : "bg-brand-amarelo"
          }`}
        />
        <div>
          <p className="text-sm font-semibold text-foreground">
            {isBusinessHours ? "Disponível agora" : "Fora do horário comercial"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isBusinessHours ? "Seg–Sex, 09h–19h" : "Respondemos no próximo dia útil"}
          </p>
        </div>
      </div>

      {/* Tempo médio de resposta */}
      <div className="border-t border-border/60 pt-6">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-primary-glow font-mono">
          <Zap className="h-3.5 w-3.5" />
          Tempo médio de resposta
        </div>
        <p className="mt-2 text-3xl font-light tracking-[-0.03em] text-brand-amber font-mono">~20 min</p>
        <p className="text-xs text-muted-foreground">durante o horário comercial</p>
      </div>

      {/* Badge projeto */}
      <div className="inline-flex items-center gap-2 rounded-full border border-brand-amarelo/40 bg-brand-amarelo/10 px-3 py-1.5 text-xs font-mono text-brand-amarelo">
        <CircleDot className="h-3.5 w-3.5" />
        Aceitando novos projetos
      </div>
    </TiltCard>
  );
}

function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Smooth spring for the zoom-in dot grid
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 20, mass: 0.4 });

  const dotSize = useTransform(smooth, [0, 1], [22, 90]);
  const dotBgSize = useMotionTemplate`${dotSize}px ${dotSize}px`;

  const titleOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section ref={heroRef} className="relative min-h-[82vh] flex items-center pt-6 overflow-hidden">
      {/* brand "chuva de colunas" */}
      <CodeRainBackground
        count={56}
        className="opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_85%)]"
      />
      {/* dot grid (zoom parallax) */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--primary) / 0.18) 0.5px, transparent 0.5px)",
          backgroundSize: dotBgSize,
          maskImage:
            "radial-gradient(ellipse at center, black 55%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 55%, transparent 100%)",
        }}
        aria-hidden
      />
      {/* noise grain */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-overlay"
        style={{
          opacity: 0.03,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
        aria-hidden
      />

      <motion.div
        style={{ y: contentY }}
        className="mx-auto max-w-3xl px-6 py-12 lg:py-16 relative w-full text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-background/40 px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-primary-glow backdrop-blur font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-amarelo node-pulse" />
            system.online · taking_clients
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-6"
        >
          <LiveTerminal />
        </motion.div>

        <motion.h1
          style={{ opacity: titleOpacity, scale: titleScale }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 text-[clamp(2rem,5.5vw,4.5rem)] font-light leading-[0.95] text-soft-glow tracking-[-0.03em] font-mono"
        >
          <span className="block">SMALL TEAM,</span>
          <span className="block text-gradient">BIG SYSTEMS</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-5 text-base sm:text-lg text-muted-foreground"
        >
          Engenharia que você pode ver.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <a
            href="#proof-of-work"
            className="btn-glow inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground font-mono uppercase tracking-wider"
          >
            → Ver código em ação
          </a>
          <MagneticButton>
            <Link
              to="/estimar"
              className="btn-glow inline-flex items-center gap-2 rounded-lg border border-primary-glow/60 bg-primary/10 backdrop-blur px-6 py-3.5 text-sm font-semibold text-primary-glow hover:bg-primary/20 font-mono uppercase tracking-wider"
            >
              ← Estimar projeto
            </Link>
          </MagneticButton>
        </motion.div>
      </motion.div>
    </section>
  );
}

function HomePage() {
  return (
    <div className="relative overflow-x-clip">
      <Hero />

      {/* SERVIÇOS — lista editorial */}
      <section className="mx-auto max-w-5xl px-6 pt-6 pb-10 lg:pt-10 lg:pb-14">
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.32em] text-primary-glow font-mono">// services</p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-light tracking-[-0.03em] text-soft-glow">O que construímos</h2>
        </div>

        <ul className="border-t border-border/60">
          {services.map((s, i) => (
            <motion.li
              key={s.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              data-cursor="code"
              className="group border-b border-border/60"
            >
              <TiltCard maxTilt={4} className="rounded-lg transition-colors hover:bg-primary/5">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-6 md:py-7 px-2 md:px-4 relative z-[2]">
                  <div className="md:col-span-5">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                      <span className="bg-gradient-to-r from-primary-glow to-primary-glow bg-[length:0%_2px] bg-no-repeat bg-left-bottom transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
                        {s.name}
                      </span>
                    </h3>
                  </div>
                  <p className="md:col-span-4 text-base text-muted-foreground leading-relaxed self-center">
                    {s.desc}
                  </p>
                  <div className="md:col-span-3 flex flex-wrap gap-1.5 self-center md:justify-end">
                    {s.stack.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-background/60 text-primary-glow/80 border border-border/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* PIONEIRO — honesto, sem cliente fake */}
      <section id="proof-of-work" className="mx-auto max-w-5xl px-6 pt-8 pb-12 lg:pt-10 lg:pb-16 scroll-mt-24">
        <div className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.32em] text-primary-glow font-mono">// pacote.pioneiro</p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-light tracking-[-0.03em] text-soft-glow">
            Você pode ser nosso primeiro case.
          </h2>
          <p className="mt-5 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Somos uma casa nova por escolha — e por isso ainda não temos vitrine de
            clientes para expor. O que temos é senioridade real e uma janela curta com
            condições que não se repetem: <span className="text-foreground">Pacote Pioneiro</span>,
            vagas limitadas, preço de fundador.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {pioneiroBenefits.map((b, i) => (
            <motion.article
              key={b.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card rounded-2xl border border-border/60 p-6"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-md border border-brand-amarelo/40 bg-brand-amarelo/10 font-mono text-xs text-brand-amarelo">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-semibold tracking-tight">{b.title}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <MagneticButton>
            <Link
              to="/estimar"
              className="btn-glow inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground font-mono uppercase tracking-wider"
            >
              → Reservar vaga pioneiro
            </Link>
          </MagneticButton>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-amarelo">
            vagas limitadas · condição de fundador
          </span>
        </div>
      </section>


      {/* PIPELINE — horizontal scroll */}
      <PipelineScroll />

      {/* PROJECT STORY — scroll-driven */}
      <ProjectStory />

      {/* PINNED BUILD — sticky scroll-driven */}
      <PinnedBuild />

      {/* PROOF OF WORK — live demo */}
      <ProofOfWork />

      {/* CTA FINAL — "A conversa começa aqui" */}
      <section className="relative mx-auto max-w-7xl px-6 py-10 lg:py-14 overflow-hidden">
        <CodeRainBackground
          count={44}
          seed={7}
          className="opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_80%)]"
        />
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 lg:gap-16 items-start">
          {/* COLUNA ESQUERDA — 60% */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-primary-glow font-mono">
              // a_conversa_começa_aqui
            </p>
            <h2 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-light tracking-[-0.03em] text-soft-glow leading-[1.05]">
              Próximo
              <br />
              projeto.
              <br />
              <span className="text-gradient">Quem faz?</span>
            </h2>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Time pequeno, resposta na hora.
              <br />
              Sem gerente de projeto no meio.
            </p>

            {/* Contatos estilo terminal */}
            <div className="mt-10 rounded-xl border border-border/60 bg-background/70 backdrop-blur p-5 font-mono text-sm">
              <div className="flex items-center gap-2 pb-3 border-b border-border/50 mb-3">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-rosa/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-brand-amber/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-brand-amarelo/80" />
                <span className="ml-2 text-xs text-muted-foreground">dreamscraft@contact:~$</span>
              </div>
              <div className="space-y-2.5" data-cursor="contact">
                <a
                  href="https://wa.me/5561991748651?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20quero%20conversar%20sobre%20um%20projeto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-neutral-300 hover:text-primary-glow transition-colors group"
                >
                  <span className="text-primary-glow select-none">$</span>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">whatsapp</span>
                  <span className="text-brand-amarelo group-hover:underline underline-offset-4">
                    +55 61 99174-8651
                  </span>
                </a>
                <a
                  href="mailto:contato@dreamscraftcode.com"
                  className="flex items-center gap-3 text-neutral-300 hover:text-primary-glow transition-colors group"
                >
                  <span className="text-primary-glow select-none">$</span>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">email</span>
                  <span className="text-brand-azul group-hover:underline underline-offset-4">
                    contato@dreamscraftcode.com
                  </span>
                </a>
                <a
                  href="https://cal.com/dreamscraftcode"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-neutral-300 hover:text-primary-glow transition-colors group"
                >
                  <span className="text-primary-glow select-none">$</span>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">calendly</span>
                  <span className="text-brand-azul group-hover:underline underline-offset-4">
                    Agendar 30 min gratuito →
                  </span>
                </a>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/contato"
                className="text-sm text-muted-foreground hover:text-primary-glow transition-colors"
              >
                Ou use o formulário →
              </Link>
            </div>
          </div>

          {/* COLUNA DIREITA — 40% */}
          <BrasiliaCard />
        </div>
      </section>
    </div>
  );
}
