import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { MessageSquare, Smartphone } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const cards = [
  { id: 1, label: "Client", tag: "// client" },
  { id: 2, label: "Design", tag: "// design" },
  { id: 3, label: "Code", tag: "// code" },
  { id: 4, label: "Deploy", tag: "// deploy" },
  { id: 5, label: "Live", tag: "// live" },
];

function ClientCard() {
  return (
    <div className="flex flex-col justify-end gap-4 h-full">
      <div className="flex items-center gap-2 text-brand-amarelo font-mono text-xs">
        <MessageSquare className="h-4 w-4" />
        WhatsApp · agora
      </div>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-20%" }}
        transition={{ duration: 0.5 }}
        className="self-start max-w-[80%] rounded-2xl rounded-bl-sm bg-brand-amarelo/15 border border-brand-amarelo/30 px-4 py-3 text-base sm:text-lg text-foreground"
      >
        Tenho uma ideia...
        <span className="inline-block w-2 h-5 ml-1 bg-brand-amarelo animate-pulse align-middle" />
      </motion.div>
      <div className="text-xs text-muted-foreground font-mono">recebido às 09:14</div>
    </div>
  );
}

function DesignCard() {
  const lines = [
    { d: "M20 30 L260 30", delay: 0 },
    { d: "M20 60 L180 60", delay: 0.2 },
    { d: "M20 100 L260 100 L260 180 L20 180 Z", delay: 0.4 },
    { d: "M40 130 L180 130", delay: 0.7 },
    { d: "M40 150 L140 150", delay: 0.9 },
    { d: "M20 210 L120 210 L120 240 L20 240 Z", delay: 1.1 },
  ];
  return (
    <div className="flex items-center justify-center h-full">
      <svg viewBox="0 0 280 260" className="w-full max-w-sm h-auto">
        {lines.map((l, i) => (
          <motion.path
            key={i}
            d={l.d}
            fill="none"
            stroke="hsl(var(--primary-glow, 280 80% 70%))"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: false, margin: "-20%" }}
            transition={{ duration: 1, delay: l.delay, ease: [0.22, 1, 0.36, 1] }}
            style={{ stroke: "#AF66F9" }}
          />
        ))}
      </svg>
    </div>
  );
}

function CodeCard() {
  const fullCode = `export async function deploy() {
  const build = await compile();
  const url  = await upload(build);
  return { ok: true, url };
}`;
  const [typed, setTyped] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    let interval: ReturnType<typeof setInterval> | null = null;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          i = 0;
          setTyped("");
          interval = setInterval(() => {
            i++;
            setTyped(fullCode.slice(0, i));
            if (i >= fullCode.length && interval) clearInterval(interval);
          }, 18);
        } else if (interval) {
          clearInterval(interval);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => {
      obs.disconnect();
      if (interval) clearInterval(interval);
    };
  }, []);

  // very light "highlight"
  const highlight = (s: string) =>
    s
      .replace(/\b(export|async|function|const|return|await)\b/g, '<span style="color:#AF66F9">$1</span>')
      .replace(/\b(true|false)\b/g, '<span style="color:#F0D071">$1</span>')
      .replace(/(['"`].*?['"`])/g, '<span style="color:#F0D071">$1</span>')
      .replace(/(\/\/[^\n]*)/g, '<span style="color:#B8A8D4">$1</span>');

  return (
    <div ref={ref} className="h-full flex items-center">
      <pre className="font-mono text-sm sm:text-base leading-relaxed text-foreground/80 whitespace-pre-wrap">
        <code dangerouslySetInnerHTML={{ __html: highlight(typed) + '<span class="inline-block w-2 h-4 bg-primary-glow animate-pulse align-middle ml-0.5"></span>' }} />
      </pre>
    </div>
  );
}

function DeployCard() {
  return (
    <div className="h-full flex flex-col justify-center font-mono text-sm space-y-1.5">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <span className="h-2.5 w-2.5 rounded-full bg-brand-rosa/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-brand-amber/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-brand-amarelo/80" />
        <span className="ml-2 text-xs text-muted-foreground">deploy@prod:~$</span>
      </div>
      <div className="text-muted-foreground mt-3">$ pnpm deploy --prod</div>
      <div className="text-muted-foreground">→ building...</div>
      <div className="text-muted-foreground">→ uploading assets (124 files)</div>
      <div className="text-muted-foreground">→ provisioning edge network</div>
      <div className="text-brand-amarelo mt-2">
        ✓ deployed to production
        <span className="inline-flex ml-2">
          <span className="animate-bounce [animation-delay:-0.3s]">.</span>
          <span className="animate-bounce [animation-delay:-0.15s]">.</span>
          <span className="animate-bounce">.</span>
        </span>
      </div>
      <div className="text-primary-glow">https://app.dreamscraftcode.com</div>
    </div>
  );
}

function LiveCard() {
  const [users, setUsers] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const ref = { current: null as HTMLDivElement | null };
    let raf: number | null = null;
    const tick = () => {
      setUsers((u) => (u < 1284 ? u + 17 : 1284));
      setRevenue((r) => (r < 8420 ? r + 113 : 8420));
      raf = requestAnimationFrame(() => setTimeout(tick, 40));
    };
    tick();
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="h-full flex items-center justify-center">
      <div className="relative w-[180px] h-[340px] rounded-[2rem] border-2 border-border/60 bg-background/80 shadow-soft-lg p-3">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full bg-black/60" />
        <div className="mt-6 h-full rounded-2xl bg-gradient-to-b from-primary/20 to-background/40 p-3 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Smartphone className="h-3.5 w-3.5 text-primary-glow" />
            <span className="text-[10px] font-mono text-primary-glow uppercase tracking-wider">preview</span>
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-amarelo node-pulse" />
          </div>
          <div className="text-[8px] font-mono text-muted-foreground leading-tight">
            preview ilustrativo — não são dados reais de cliente
          </div>
          <div className="rounded-lg bg-background/60 border border-border/60 p-2">
            <div className="text-[9px] text-muted-foreground font-mono uppercase">users</div>
            <div className="text-lg font-medium text-soft-glow font-mono tabular-nums">
              {users.toLocaleString()}
            </div>
          </div>
          <div className="rounded-lg bg-background/60 border border-border/60 p-2">
            <div className="text-[9px] text-muted-foreground font-mono uppercase">revenue</div>
            <div className="text-lg font-medium text-brand-amarelo font-mono tabular-nums">
              R$ {revenue.toLocaleString()}
            </div>
          </div>
          <div className="flex-1 flex items-end gap-1">
            {[40, 60, 35, 75, 55, 85, 70, 95].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                className="flex-1 bg-gradient-to-t from-primary to-primary-glow rounded-sm"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const renderers = [ClientCard, DesignCard, CodeCard, DeployCard, LiveCard];

export function PipelineScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Card width is responsive: 40vw on desktop, 84vw on mobile (readable cards).
  // Track math: side padding = (100 - cardW) / 2 centers each card;
  // travel per card = cardW + 2vw gap; total = 4 * travel.
  // Hold the first card briefly at the start and the last card at the end
  // so users have time to read both before the section releases.
  const isMobile = useIsMobile();
  const cardW = isMobile ? 84 : 40;
  const sidePad = (100 - cardW) / 2;
  const travel = (cardW + 2) * (cards.length - 1);
  const x = useTransform(
    scrollYProgress,
    [0, 0.04, 0.94, 1],
    ["0vw", "0vw", `-${travel}vw`, `-${travel}vw`],
  );
  const [activeIdx, setActiveIdx] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // Map travel range [0.04, 0.94] -> [0, 1] for the active-card index.
    const t = Math.max(0, Math.min(1, (v - 0.04) / 0.9));
    const idx = Math.min(cards.length - 1, Math.max(0, Math.floor(t * cards.length)));
    setActiveIdx(idx);
  });

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: "420vh" }}
      aria-label="Pipeline de desenvolvimento"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-[oklch(0.16_0.08_285)] border-y border-border/50">
        {/* edge fade gradients */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 z-20 bg-gradient-to-r from-[oklch(0.16_0.08_285)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 z-20 bg-gradient-to-l from-[oklch(0.16_0.08_285)] to-transparent" />

        {/* top progress bar */}
        <div className="absolute top-0 left-0 right-0 z-30">
          <div className="h-[3px] w-full bg-border/40">
            <motion.div
              style={{ scaleX: scrollYProgress, transformOrigin: "0% 50%" }}
              className="h-full bg-primary"
            />
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <p className="text-[11px] uppercase tracking-[0.32em] text-primary-glow font-mono">
              // pipeline
            </p>
            <div className="hidden md:flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
              {cards.map((c, i) => (
                <div key={c.id} className="flex items-center gap-3">
                  <span
                    className={
                      i === activeIdx
                        ? "text-soft-glow"
                        : i < activeIdx
                        ? "text-primary-glow/70"
                        : "text-muted-foreground/50"
                    }
                  >
                    {String(i + 1).padStart(2, "0")} {c.label}
                  </span>
                  {i < cards.length - 1 && (
                    <span className="h-px w-6 bg-border/60" aria-hidden />
                  )}
                </div>
              ))}
            </div>
            <p className="font-mono text-xs text-muted-foreground tabular-nums">
              <span className="text-soft-glow">
                {String(activeIdx + 1).padStart(2, "0")}
              </span>
              <span className="text-muted-foreground/60"> / 05</span>
              <span className="ml-3 text-primary-glow">{cards[activeIdx].tag}</span>
            </p>
          </div>
        </div>

        {/* horizontal track */}
        <div className="h-full flex items-center">
          <motion.div
            style={{ x, paddingLeft: `${sidePad}vw`, paddingRight: `${sidePad}vw` }}
            className="flex items-center gap-[2vw]"
          >
            {cards.map((c, i) => {
              const Renderer = renderers[i];
              const isActive = i === activeIdx;
              return (
                <motion.div
                  key={c.id}
                  animate={{
                    scale: isActive ? 1 : 0.94,
                    opacity: isActive ? 1 : 0.55,
                  }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ width: `${cardW}vw` }}
                  className="shrink-0 h-[60vh] rounded-2xl border border-border/60 bg-background/70 backdrop-blur p-6 sm:p-8 shadow-soft-lg relative overflow-hidden"
                >
                  <div className="absolute top-5 left-6 flex items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary-glow">
                      0{c.id} / 05
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {c.label}
                    </span>
                  </div>
                  <div className="pt-10 h-full">
                    <Renderer />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
