import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

type Mode = "default" | "interactive" | "code" | "contact" | "view" | "drag";

const GLYPH: Record<Exclude<Mode, "default" | "interactive">, string> = {
  code: "</>",
  contact: "@",
  view: "→",
  drag: "↔",
};

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("default");

  // Dot — instant follow
  const dx = useMotionValue(-100);
  const dy = useMotionValue(-100);

  // Ring — springy follow
  const rx = useMotionValue(-100);
  const ry = useMotionValue(-100);
  const sx = useSpring(rx, { stiffness: 150, damping: 20, mass: 0.4 });
  const sy = useSpring(ry, { stiffness: 150, damping: 20, mass: 0.4 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);
    document.body.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      dx.set(e.clientX);
      dy.set(e.clientY);
      rx.set(e.clientX);
      ry.set(e.clientY);

      const target = e.target as HTMLElement | null;
      const tagged = target?.closest<HTMLElement>("[data-cursor]");
      const dc = tagged?.dataset.cursor as Mode | undefined;
      if (dc && (dc === "code" || dc === "contact" || dc === "view" || dc === "drag")) {
        setMode(dc);
      } else if (
        target?.closest('a, button, [role="button"], input, textarea, select, label')
      ) {
        setMode("interactive");
      } else {
        setMode("default");
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.body.style.cursor = "";
    };
  }, [dx, dy, rx, ry]);

  if (!enabled) return null;

  const isInteractive = mode === "interactive";
  const hasGlyph = mode === "code" || mode === "contact" || mode === "view" || mode === "drag";
  const scale = isInteractive ? 1.5 : hasGlyph ? 1.25 : 1;

  return (
    <>
      {/* Ring */}
      <motion.div
        aria-hidden
        style={{
          x: sx,
          y: sy,
          translateX: "-50%",
          translateY: "-50%",
          position: "fixed",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: 9999,
          border: "1px solid color-mix(in oklab, var(--color-primary) 55%, transparent)",
          background: isInteractive
            ? "color-mix(in oklab, var(--color-primary) 20%, transparent)"
            : "transparent",
          pointerEvents: "none",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Cascadia Code', ui-monospace, SFMono-Regular, monospace",
          fontSize: 10,
          fontWeight: 600,
          color: "var(--color-primary)",
          transition: "background 180ms ease, border-color 180ms ease",
          willChange: "transform",
          transform: `scale(${scale})`,
        }}
        animate={{ scale }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
      >
        <AnimatePresence mode="wait">
          {hasGlyph && (
            <motion.span
              key={mode}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.1 }}
              style={{ lineHeight: 1 }}
            >
              {GLYPH[mode as Exclude<Mode, "default" | "interactive">]}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Dot */}
      <motion.div
        aria-hidden
        style={{
          x: dx,
          y: dy,
          translateX: "-50%",
          translateY: "-50%",
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: 9999,
          background: "var(--color-primary)",
          pointerEvents: "none",
          zIndex: 10000,
          willChange: "transform",
          opacity: hasGlyph ? 0 : 1,
          transition: "opacity 150ms ease",
        }}
      />
    </>
  );
}
