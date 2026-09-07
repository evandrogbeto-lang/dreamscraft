import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  phaseKey: string;
};

/** Transição curta fade + translateY — respeita reduced motion. */
export function DiagnosticPhaseMotion({ children, className, phaseKey }: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      key={phaseKey}
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.01 : 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * CTA primário V3.12.
 * Disabled: lavanda + borda rosa + texto roxo legível (sem opacity baixa).
 * Enabled: rosa sólido + texto roxo.
 */
export function DiagnosticCtaPrimary({
  children,
  type = "button",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      {...props}
      className={`inline-flex min-h-11 items-center justify-center rounded-[10px] border-2 border-brand-rosa bg-brand-rosa px-[22px] py-4 text-[14px] text-brand-roxo transition-colors hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa focus-visible:ring-offset-2 focus-visible:ring-offset-brand-roxo disabled:cursor-not-allowed disabled:border-brand-rosa disabled:bg-brand-branco disabled:text-brand-roxo disabled:opacity-100 disabled:hover:brightness-100 ${className}`}
    >
      {children}
    </button>
  );
}

export function DiagnosticCtaSecondary({
  children,
  tone = "dark",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "dark" | "light" }) {
  const border =
    tone === "dark"
      ? "border-brand-roxo text-brand-roxo focus-visible:ring-offset-brand-branco disabled:border-brand-roxo/50 disabled:text-brand-roxo/70"
      : "border-brand-branco text-brand-branco focus-visible:ring-offset-brand-roxo disabled:border-brand-branco/50 disabled:text-brand-branco/70";
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex min-h-11 items-center justify-center rounded-[10px] border-2 bg-transparent px-[18px] py-[15px] text-[13px] transition-colors hover:bg-brand-branco/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-100 ${border} ${className}`}
    >
      {children}
    </button>
  );
}
