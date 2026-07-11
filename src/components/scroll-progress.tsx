import { memo } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

/**
 * Subtle top scroll-progress bar synced with viewport scroll.
 * Uses spring-smoothed scrollYProgress for premium feel.
 * Respects prefers-reduced-motion.
 */
function ScrollProgressImpl() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: reduce ? 200 : 140,
    damping: reduce ? 40 : 24,
    mass: 0.25,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{
        scaleX,
        transformOrigin: "0% 50%",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 10000,
        pointerEvents: "none",
        background:
          "linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-glow) 100%)",
        boxShadow:
          "0 0 12px color-mix(in oklab, var(--primary-glow) 60%, transparent)",
      }}
    />
  );
}

export const ScrollProgress = memo(ScrollProgressImpl);
