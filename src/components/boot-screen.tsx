import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const BRAND = "DREAMSCRAFT.CODE";
const TYPE_SPEED = 45; // ms por caractere
const TYPE_START = 280;
const SCAN_AT = 1250;
const SCAN_DURATION = 350;
const CLOSE_AT = SCAN_AT + SCAN_DURATION;

/**
 * Boot "compilando a marca": tipografia c/ + DREAMSCRAFT.CODE digitado,
 * scanline rosa e saída. Roda uma vez por sessão; pulável com Esc ou clique.
 * Usa o glifo tipográfico da marca (Cascadia), não um path SVG inventado.
 */
export function BootScreen() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [typedCount, setTypedCount] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [closing, setClosing] = useState(false);
  const [markReady, setMarkReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (reduce) return;
    if (sessionStorage.getItem("booted") === "1") return;
    setShow(true);
  }, [reduce]);

  const skip = useCallback(() => {
    sessionStorage.setItem("booted", "1");
    setClosing(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, skip]);

  useEffect(() => {
    if (!show) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setMarkReady(true), 120));
    for (let i = 1; i <= BRAND.length; i++) {
      timers.push(setTimeout(() => setTypedCount(i), TYPE_START + i * TYPE_SPEED));
    }
    timers.push(setTimeout(() => setScanning(true), SCAN_AT));
    timers.push(
      setTimeout(() => {
        sessionStorage.setItem("booted", "1");
        setClosing(true);
      }, CLOSE_AT),
    );

    return () => timers.forEach(clearTimeout);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="boot"
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          animate={{ clipPath: closing ? "inset(0 0 100% 0)" : "inset(0 0 0% 0)" }}
          transition={{ duration: 0.4, ease: [0.7, 0, 0.3, 1] }}
          onAnimationComplete={() => {
            if (closing) setShow(false);
          }}
          onClick={skip}
          role="presentation"
          aria-label="Carregando Dreamscraft Code — Esc ou clique para pular"
          className="fixed inset-0 z-[9999] overflow-hidden cursor-pointer select-none bg-brand-roxo"
          style={{
            fontFamily: "'Cascadia Code', ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(239,229,253,0.6) 0 1px, transparent 1px 3px)",
            }}
          />

          <div className="h-full w-full flex items-center justify-center px-6">
            <div className="flex items-baseline gap-3 sm:gap-5">
              <motion.span
                aria-hidden
                initial={{ opacity: 0, filter: "blur(6px)" }}
                animate={{
                  opacity: markReady ? 1 : 0,
                  filter: markReady ? "blur(0px)" : "blur(6px)",
                }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl sm:text-5xl font-light tracking-tight text-brand-rosa"
                style={{
                  textShadow:
                    "0 0 12px rgba(175,102,249,0.85), 0 0 28px rgba(175,102,249,0.35)",
                }}
              >
                c/
              </motion.span>

              <p className="text-lg sm:text-2xl tracking-[0.18em] text-brand-branco whitespace-nowrap">
                {BRAND.slice(0, typedCount)}
                <span
                  className="inline-block w-[0.55ch] h-[1.05em] ml-1 align-middle bg-brand-rosa animate-pulse"
                  aria-hidden
                />
              </p>
            </div>
          </div>

          <p className="absolute bottom-6 inset-x-0 text-center text-[11px] text-brand-branco/35">
            Esc ou clique para pular
          </p>

          {scanning && (
            <motion.div
              initial={{ y: "-2px" }}
              animate={{ y: "100vh" }}
              transition={{ duration: SCAN_DURATION / 1000, ease: "linear" }}
              className="absolute left-0 right-0 h-[2px] bg-brand-rosa"
              style={{
                boxShadow:
                  "0 0 12px rgba(175,102,249,0.95), 0 0 32px rgba(175,102,249,0.55)",
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
