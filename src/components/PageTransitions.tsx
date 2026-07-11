import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { memo, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";

function PageTransitionsImpl({ children }: { children: ReactNode }) {
  const location = useRouterState({ select: (s) => s.location });
  const reduce = useReducedMotion();
  const pathname = location.pathname;
  const prevPath = useRef(pathname);
  const [overlayPath, setOverlayPath] = useState<string | null>(null);
  const [typed, setTyped] = useState("");

  const isBlogToBlog = (from: string, to: string) =>
    from.startsWith("/blog/") && to.startsWith("/blog/") && from !== to;

  // Trigger overlay on route change
  useEffect(() => {
    const from = prevPath.current;
    const to = pathname;
    prevPath.current = to;
    if (from === to) return;
    if (reduce) return;
    if (isBlogToBlog(from, to)) return;
    setOverlayPath(to);
  }, [pathname, reduce]);

  // Typewriter + auto-dismiss
  useEffect(() => {
    if (!overlayPath) return;
    const full = `$ cd ${overlayPath === "/" ? "/" : overlayPath}`;
    setTyped("");
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(interval);
    }, 40);
    const totalMs = full.length * 40 + 250;
    const dismiss = setTimeout(() => setOverlayPath(null), totalMs);
    return () => {
      clearInterval(interval);
      clearTimeout(dismiss);
    };
  }, [overlayPath]);

  const pageMotion = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
      }
    : isBlogToBlog(prevPath.current, pathname) || overlayPath === null
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const },
      }
    : {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.35, delay: 0.4, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <>
      <AnimatePresence>
        {overlayPath && (
          <motion.div
            key="terminal-overlay"
            aria-hidden="true"
            initial={{ y: "-100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              background: "#0A0A0A",
              zIndex: 10000,
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                color: "var(--color-primary-glow, #C99BFB)",
                fontSize: "clamp(14px, 2.2vw, 22px)",
                letterSpacing: "0.02em",
              }}
            >
              <span>{typed}</span>
              <span
                style={{
                  display: "inline-block",
                  width: "0.55em",
                  height: "1em",
                  marginLeft: "0.15em",
                  verticalAlign: "-0.15em",
                  background: "currentColor",
                  animation: "pulse 1s steps(2) infinite",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={pathname} {...pageMotion}>
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export const PageTransitions = memo(PageTransitionsImpl);
