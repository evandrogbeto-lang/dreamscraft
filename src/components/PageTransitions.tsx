import { motion, useReducedMotion } from "framer-motion";
import { memo, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Fade de entrada por rota, sem AnimatePresence/exit: a página nova monta
 * imediatamente (nunca fica em branco) e só anima a entrada.
 */
function PageTransitionsImpl({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const reduce = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.15 : 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export const PageTransitions = memo(PageTransitionsImpl);
