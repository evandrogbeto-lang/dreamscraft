import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const BRAND = "DREAMSCRAFT.CODE";
const TYPE_SPEED = 45; // ms por caractere
const TYPE_START = 350; // digitação começa junto com o traço do "c"
const SCAN_AT = 1250; // scanline varre a tela
const SCAN_DURATION = 350;
const CLOSE_AT = SCAN_AT + SCAN_DURATION; // ~1.6s; overlay some por completo em ~2s

/**
 * Boot "compilando a marca": o símbolo c/ se desenha com brilho suave,
 * DREAMSCRAFT.CODE é digitado ao lado, uma scanline passa e o site aparece.
 * Roda uma vez por sessão; pulável com Esc ou clique.
 */
export function BootScreen() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [typedCount, setTypedCount] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [closing, setClosing] = useState(false);

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

  // Esc pula
  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, skip]);

  // Sequência: digitação → scanline → fechamento
  useEffect(() => {
    if (!show) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

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
          className="fixed inset-0 z-[9999] overflow-hidden cursor-pointer select-none"
          style={{
            background: "#180B3E",
            fontFamily: "'Cascadia Code', ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >
          {/* scanlines ambiente (CRT sutil) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0 1px, transparent 1px 3px)",
            }}
          />

          <div className="h-full w-full flex items-center justify-center px-6">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* símbolo c/ desenhado em traço, com brilho rosa suave */}
              <svg
                viewBox="0 0 72 64"
                className="h-12 w-[3.4rem] sm:h-16 sm:w-[4.5rem] shrink-0"
                style={{
                  filter:
                    "drop-shadow(0 0 6px rgba(175,102,249,0.9)) drop-shadow(0 0 22px rgba(175,102,249,0.45))",
                }}
                aria-hidden
              >
                <motion.path
                  d="M 46 22 A 17 17 0 1 0 46 42"
                  fill="none"
                  stroke="#C99BFB"
                  strokeWidth={6}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.15, duration: 0.45, ease: "easeOut" }}
                />
                <motion.path
                  d="M 52 48 L 66 16"
                  fill="none"
                  stroke="#AF66F9"
                  strokeWidth={6}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.55, duration: 0.3, ease: "easeOut" }}
                />
              </svg>

              {/* marca digitada + cursor piscando */}
              <p className="text-lg sm:text-2xl tracking-[0.18em] text-[#EFE5FD] whitespace-nowrap">
                {BRAND.slice(0, typedCount)}
                <span
                  className="inline-block w-[0.55ch] h-[1.05em] ml-1 align-middle bg-[#C99BFB] animate-pulse"
                  aria-hidden
                />
              </p>
            </div>
          </div>

          <p className="absolute bottom-6 inset-x-0 text-center text-[11px] text-[#EFE5FD]/35">
            Esc ou clique para pular
          </p>

          {/* scanline de saída */}
          {scanning && (
            <motion.div
              initial={{ y: "-2px" }}
              animate={{ y: "100vh" }}
              transition={{ duration: SCAN_DURATION / 1000, ease: "linear" }}
              className="absolute left-0 right-0 h-[2px] bg-white"
              style={{
                boxShadow:
                  "0 0 12px rgba(255,255,255,0.9), 0 0 32px rgba(175,102,249,0.6)",
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
