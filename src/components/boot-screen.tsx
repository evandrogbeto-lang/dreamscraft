import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Line = { at: number; text: string };

const LINES: Line[] = [
  { at: 0,    text: "DREAMSCRAFT OS v3.1 — initializing..." },
  { at: 300,  text: "→ loading core modules" },
  { at: 550,  text: "  [✓] React 19 · TypeScript · Framer Motion" },
  { at: 800,  text: "  [✓] Supabase · TanStack Router · Tailwind" },
  { at: 1050, text: "→ connecting services..." },
  { at: 1300, text: "  [✓] AI estimate engine online" },
  { at: 1500, text: "✓ All systems operational. Welcome." },
];

const TYPE_SPEED = 15; // ms per char
const POST_DELAY = 400;
const SCAN_DURATION = 400;

export function BootScreen() {
  const [show, setShow] = useState(false);
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [scanning, setScanning] = useState(false);
  const [closing, setClosing] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  // Decide on mount if we should boot
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("booted") === "1") return;
    setShow(true);
  }, []);

  // Show skip button after 300 ms
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setShowSkip(true), 300);
    return () => clearTimeout(t);
  }, [show]);

  // Esc key skips boot
  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        sessionStorage.setItem("booted", "1");
        setClosing(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show]);

  // Run the sequence
  useEffect(() => {
    if (!show) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    LINES.forEach((line, idx) => {
      // Schedule typewriter for each line
      timers.push(
        setTimeout(() => {
          let i = 0;
          const id = setInterval(() => {
            i++;
            setVisibleLines((prev) => {
              const next = [...prev];
              next[idx] = line.text.slice(0, i);
              return next;
            });
            if (i >= line.text.length) clearInterval(id);
          }, TYPE_SPEED);
        }, line.at),
      );
    });

    const last = LINES[LINES.length - 1];
    const finishAt = last.at + last.text.length * TYPE_SPEED + POST_DELAY;

    timers.push(setTimeout(() => setScanning(true), finishAt));
    timers.push(setTimeout(() => setClosing(true), finishAt + SCAN_DURATION));
    timers.push(
      setTimeout(() => {
        sessionStorage.setItem("booted", "1");
        setShow(false);
      }, finishAt + SCAN_DURATION + 450),
    );

    return () => timers.forEach(clearTimeout);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="boot"
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          animate={{
            clipPath: closing ? "inset(0 0 100% 0)" : "inset(0 0 0% 0)",
          }}
          transition={{ duration: 0.45, ease: [0.7, 0, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-black text-primary-glow overflow-hidden"
          style={{
            fontFamily:
              "'Cascadia Code', ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >
          {/* CRT scanlines ambient */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0 1px, transparent 1px 3px)",
            }}
          />

          {/* Content */}
          <div className="relative h-full w-full px-6 sm:px-10 py-10 sm:py-14 text-[13px] sm:text-sm leading-relaxed">
            {LINES.map((_, i) => (
              <div key={i} className="min-h-[1.6em] whitespace-pre">
                {visibleLines[i] ?? ""}
                {i === visibleLines.length - 1 &&
                  visibleLines[i] &&
                  visibleLines[i].length < LINES[i].text.length && (
                    <span className="inline-block w-[0.5ch] h-[1em] align-middle bg-primary-glow ml-0.5 animate-pulse" />
                  )}
              </div>
            ))}
          </div>

          {/* Skip button */}
          {showSkip && !closing && (
            <button
              onClick={() => {
                sessionStorage.setItem("booted", "1");
                setClosing(true);
              }}
              className="absolute bottom-6 right-6 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              skip →
            </button>
          )}

          {/* Scan line de saída */}
          {scanning && (
            <motion.div
              initial={{ y: "-2px" }}
              animate={{ y: "100vh" }}
              transition={{ duration: SCAN_DURATION / 1000, ease: "linear" }}
              className="absolute left-0 right-0 h-[2px] bg-white"
              style={{
                boxShadow:
                  "0 0 12px rgba(255,255,255,0.9), 0 0 32px hsl(var(--primary) / 0.6)",
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
