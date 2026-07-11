import { useEffect, useMemo, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { CyberArchitecture } from "@/components/cyber-architecture";

type Segment =
  | { type: "text"; value: string }
  | { type: "link"; to: string; label: string; meta: string };

type Line = {
  prefix?: string;
  segments: Segment[];
  className?: string;
};

export function NotFoundTerminal() {
  const router = useRouter();
  const attemptedPath =
    typeof window !== "undefined" ? window.location.pathname + window.location.search : "/unknown";

  const lines: Line[] = useMemo(
    () => [
      { prefix: ">", segments: [{ type: "text", value: "ERROR 404: route_not_found" }], className: "text-destructive" },
      { prefix: ">", segments: [{ type: "text", value: "  at DreamsCraft.navigation.resolve()" }], className: "text-muted-foreground" },
      { prefix: ">", segments: [{ type: "text", value: "  at render() line 404" }], className: "text-muted-foreground" },
      { prefix: ">", segments: [{ type: "text", value: "" }] },
      { prefix: ">", segments: [{ type: "text", value: "Debugging..." }], className: "text-primary" },
      { prefix: ">", segments: [{ type: "text", value: `Running: find_page --path="${attemptedPath}"` }] },
      { prefix: ">", segments: [{ type: "text", value: "Result: null" }], className: "text-destructive" },
      { prefix: ">", segments: [{ type: "text", value: "" }] },
      { prefix: ">", segments: [{ type: "text", value: "Possible matches found:" }], className: "text-primary" },
      { prefix: ">", segments: [{ type: "link", to: "/solucoes", label: "→ /solucoes", meta: "    [available modules]" }] },
      { prefix: ">", segments: [{ type: "link", to: "/portfolio", label: "→ /portfolio", meta: "   [active projects]" }] },
      { prefix: ">", segments: [{ type: "link", to: "/estimar", label: "→ /estimar", meta: "    [get AI estimate]" }] },
      { prefix: ">", segments: [{ type: "link", to: "/contato", label: "→ /contato", meta: "    [start a project]" }] },
      { prefix: ">", segments: [{ type: "link", to: "/", label: "→ /", meta: "           [return to base]" }] },
      { prefix: ">", segments: [{ type: "text", value: "" }] },
      { prefix: ">", segments: [{ type: "text", value: "Click a path above to navigate or type 'home'" }], className: "text-muted-foreground" },
    ],
    [attemptedPath],
  );

  const totalChars = useMemo(
    () =>
      lines.map((l) =>
        l.segments.reduce(
          (acc, s) => acc + (s.type === "text" ? s.value.length : s.label.length + s.meta.length),
          0,
        ),
      ),
    [lines],
  );

  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (done) return;
    const current = totalChars[lineIdx] ?? 0;
    if (charIdx >= current) {
      if (lineIdx >= lines.length - 1) {
        setDone(true);
        return;
      }
      const t = setTimeout(() => {
        setLineIdx((i) => i + 1);
        setCharIdx(0);
      }, 80);
      return () => clearTimeout(t);
    }
    const speed = current === 0 ? 30 : 14;
    const t = setTimeout(() => setCharIdx((c) => c + 1), speed);
    return () => clearTimeout(t);
  }, [charIdx, lineIdx, totalChars, lines.length, done]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = input.trim().toLowerCase().replace(/^\/+/, "");
    const map: Record<string, string> = {
      home: "/",
      "": "/",
      solucoes: "/solucoes",
      portfolio: "/portfolio",
      estimar: "/estimar",
      contato: "/contato",
    };
    const target = map[v];
    if (target) router.navigate({ to: target });
  };

  const renderLine = (line: Line, visible: number) => {
    const parts: React.ReactNode[] = [];
    let remaining = visible;
    line.segments.forEach((seg, i) => {
      if (seg.type === "text") {
        const slice = seg.value.slice(0, remaining);
        remaining -= slice.length;
        parts.push(<span key={i}>{slice}</span>);
      } else {
        const labelSlice = seg.label.slice(0, remaining);
        remaining -= labelSlice.length;
        const metaSlice = seg.meta.slice(0, Math.max(0, remaining));
        remaining -= metaSlice.length;
        parts.push(
          <Link
            key={i}
            to={seg.to}
            className="text-primary underline-offset-4 hover:underline hover:text-primary/80 transition-colors"
          >
            {labelSlice}
            <span className="text-muted-foreground">{metaSlice}</span>
          </Link>,
        );
      }
    });
    return parts;
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      <CyberArchitecture className="absolute inset-0 z-0 opacity-60" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl items-center px-4 py-16">
        <div className="w-full rounded-lg border border-border/60 bg-background/70 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-2 border-b border-border/60 px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-destructive/80" />
            <span className="h-3 w-3 rounded-full bg-brand-amarelo/80" />
            <span className="h-3 w-3 rounded-full bg-brand-amarelo/80" />
            <span className="ml-3 font-mono text-xs text-muted-foreground">
              dreamscraft@router ~ /404
            </span>
          </div>
          <div className="p-5 sm:p-6 font-mono text-sm leading-relaxed">
            {lines.slice(0, lineIdx + 1).map((line, i) => {
              const isCurrent = i === lineIdx && !done;
              const visible = isCurrent ? charIdx : totalChars[i];
              return (
                <div key={i} className={`flex gap-2 ${line.className ?? "text-foreground"}`}>
                  <span className="select-none text-primary/70">{line.prefix ?? " "}</span>
                  <span className="whitespace-pre-wrap break-all">
                    {renderLine(line, visible)}
                    {isCurrent && <span className="ml-0.5 inline-block h-4 w-2 -mb-0.5 bg-primary animate-pulse" />}
                  </span>
                </div>
              );
            })}
            {done && (
              <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2 text-foreground">
                <span className="select-none text-primary">$</span>
                <input
                  autoFocus
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="home"
                  className="flex-1 bg-transparent font-mono text-sm outline-none placeholder:text-muted-foreground"
                />
                <span className="inline-block h-4 w-2 bg-primary animate-pulse" />
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}