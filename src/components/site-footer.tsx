import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { DreamscraftLogo } from "@/components/dreamscraft-logo";

const partners = [
  {
    name: "Gabrielle",
    line: "Backend bem feito é silêncio. Você não ouve falar dele.",
  },
  {
    name: "Evandro",
    line: "Se precisa de manual pra usar, falhei no design.",
  },
];

type Vitals = {
  lcp: number | null;
  cls: number | null;
  fcp: number | null;
};

function useWebVitals(): Vitals {
  const [vitals, setVitals] = useState<Vitals>({ lcp: null, cls: null, fcp: null });

  useEffect(() => {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) return;

    const observers: PerformanceObserver[] = [];

    try {
      const lcpObs = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
        if (last) setVitals((v) => ({ ...v, lcp: last.startTime }));
      });
      lcpObs.observe({ type: "largest-contentful-paint", buffered: true });
      observers.push(lcpObs);
    } catch {}

    try {
      let clsValue = 0;
      const clsObs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as Array<PerformanceEntry & { value: number; hadRecentInput: boolean }>) {
          if (!entry.hadRecentInput) clsValue += entry.value;
        }
        setVitals((v) => ({ ...v, cls: clsValue }));
      });
      clsObs.observe({ type: "layout-shift", buffered: true });
      observers.push(clsObs);
    } catch {}

    try {
      const fcpObs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            setVitals((v) => ({ ...v, fcp: entry.startTime }));
          }
        }
      });
      fcpObs.observe({ type: "paint", buffered: true });
      observers.push(fcpObs);
    } catch {}

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return vitals;
}

function formatMs(n: number | null) {
  if (n === null) return "···";
  return `${(n / 1000).toFixed(2)}s`;
}

function formatCls(n: number | null) {
  if (n === null) return "···";
  return n.toFixed(3);
}

type Commit = { message: string; relative: string };

function relativeTime(date: Date): string {
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "agora há pouco";
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`;
  return `há ${Math.floor(diff / 86400)}d`;
}

function useLastCommit(): Commit {
  const [commit, setCommit] = useState<Commit>({
    message: "feat: narrativa scroll-driven 'como um projeto nasce'",
    relative: "há 2 horas",
  });

  // GitHub commit fetch removed — repo is private/inexistent and was 404-looping.
  useEffect(() => {
    return () => {};
  }, []);


  return commit;
}

export function SiteFooter() {
  const vitals = useWebVitals();
  const commit = useLastCommit();

  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <DreamscraftLogo variant="dark" />

        {/* 3 columns: partners */}
        <div className="grid gap-10 sm:grid-cols-2 mt-10">
          {partners.map((p) => (
            <div key={p.name}>
              <p className="font-display text-xl font-semibold tracking-tight">{p.name}</p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.line}</p>
            </div>
          ))}
        </div>

        {/* Links — mono */}
        <div className="mt-16 grid gap-10 sm:grid-cols-2 font-mono text-sm">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">// produto</p>
            <ul className="space-y-2">
              <li><Link to="/solucoes" className="text-foreground/80 hover:text-primary transition-colors">soluções</Link></li>
              <li><Link to="/precos" className="text-foreground/80 hover:text-primary transition-colors">preços</Link></li>
              <li><Link to="/portfolio" className="text-foreground/80 hover:text-primary transition-colors">portfolio</Link></li>
              <li><Link to="/estimar" className="text-foreground/80 hover:text-primary transition-colors">estimar projeto</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">// empresa</p>
            <ul className="space-y-2">
              <li><Link to="/sobre" className="text-foreground/80 hover:text-primary transition-colors">sobre</Link></li>
              <li><Link to="/parceiros" className="text-foreground/80 hover:text-primary transition-colors">parceiros</Link></li>
              <li><Link to="/manifesto" className="text-foreground/80 hover:text-primary transition-colors">manifesto</Link></li>
              <li><Link to="/stack" className="text-foreground/80 hover:text-primary transition-colors">stack</Link></li>
              <li><Link to="/blog" className="text-foreground/80 hover:text-primary transition-colors">blog</Link></li>
              <li><Link to="/contato" className="text-foreground/80 hover:text-primary transition-colors">contato</Link></li>
              <li><Link to="/status" className="text-foreground/80 hover:text-primary transition-colors">status</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <p className="text-xs text-muted-foreground font-mono">
            Dreamscraft Code © 2026 · Brasília, BR
          </p>

          <div className="font-mono text-xs space-y-1 sm:text-right">
            {vitals.lcp === null && vitals.cls === null && vitals.fcp === null ? null : (
              <>
                <p className="text-muted-foreground">// performance deste site agora</p>
                <p className="text-foreground/90">
                  {vitals.lcp !== null && (
                    <><span className="text-primary">LCP</span> {formatMs(vitals.lcp)}</>
                  )}
                  {vitals.cls !== null && (
                    <>{vitals.lcp !== null && <span className="text-muted-foreground"> · </span>}
                    <span className="text-primary">CLS</span> {formatCls(vitals.cls)}</>
                  )}
                  {vitals.fcp !== null && (
                    <>{(vitals.lcp !== null || vitals.cls !== null) && <span className="text-muted-foreground"> · </span>}
                    <span className="text-primary">FCP</span> {formatMs(vitals.fcp)}</>
                  )}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-6 font-mono text-xs text-muted-foreground sm:text-right">
          último deploy: <span className="text-foreground/80">'{commit.message}'</span> – {commit.relative}
        </div>

      </div>
    </footer>
  );
}
