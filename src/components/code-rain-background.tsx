import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CodeRainBackgroundProps {
  /** Número de colunas/barras */
  count?: number;
  /** Classe extra (posicionamento, opacidade global, mask, etc.) */
  className?: string;
  /** Semente para variação determinística (evita hydration mismatch) */
  seed?: number;
}

interface Bar {
  left: number;
  height: number;
  delay: number;
  duration: number;
  gold: boolean;
  bodyOpacity: number;
  wickTopOpacity: number;
  wickBottomOpacity: number;
}

// PRNG determinístico (mulberry32) — evita SSR/CSR mismatch
function rand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Padrão de "chuva de colunas" da brand Dreamscraft.Code.
 * Cada barra é um candlestick:
 *   - wick superior: 1px, ~20% da altura, opacidade 0.2–0.4
 *   - corpo central: 3px, ~60% da altura, opacidade 0.6–0.9
 *   - wick inferior: 1px, ~20% da altura, opacidade 0.2–0.4
 * ~15% das barras renderizam em Amber (#F0D071); o restante em Orchid (#AF66F9).
 */
export function CodeRainBackground({
  count = 48,
  className,
  seed = 1,
}: CodeRainBackgroundProps) {
  const bars = useMemo<Bar[]>(() => {
    const r = rand(seed);
    return Array.from({ length: count }, (_, i): Bar => ({
      left: (i / count) * 100 + r() * (100 / count) * 0.5,
      height: 30 + r() * 60, // 30–90% da altura do container
      delay: r() * -8,
      duration: 4 + r() * 6,
      gold: r() < 0.15,
      bodyOpacity: 0.6 + r() * 0.3,
      wickTopOpacity: 0.2 + r() * 0.2,
      wickBottomOpacity: 0.2 + r() * 0.2,
    }));
  }, [count, seed]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {bars.map((b, i) => {
        const color = b.gold ? "#F0D071" : "#AF66F9";
        return (
          <div
            key={i}
            className="absolute bottom-0 flex flex-col items-center code-rain-bar"
            style={{
              left: `${b.left}%`,
              height: `${b.height}%`,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
            }}
          >
            {/* wick superior */}
            <span
              style={{
                width: 1,
                flex: "0 0 20%",
                background: color,
                opacity: b.wickTopOpacity,
              }}
            />
            {/* corpo */}
            <span
              style={{
                width: 3,
                flex: "0 0 60%",
                background: color,
                opacity: b.bodyOpacity,
                boxShadow: `0 0 8px ${color}55`,
              }}
            />
            {/* wick inferior */}
            <span
              style={{
                width: 1,
                flex: "0 0 20%",
                background: color,
                opacity: b.wickBottomOpacity,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
