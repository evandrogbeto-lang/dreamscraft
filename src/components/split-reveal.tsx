import { motion, useReducedMotion, type Variants } from "framer-motion";
import { createElement } from "react";

type SplitRevealProps = {
  /** Texto a animar. Quebras de linha podem ser feitas com "\n". */
  text?: string;
  /** Alternativa a `text`: array já pronto de linhas. */
  lines?: string[];
  /** Delay inicial antes da primeira linha aparecer. */
  delay?: number;
  /** Intervalo entre linhas. */
  stagger?: number;
  /** Duração da animação por linha. */
  duration?: number;
  /** Combina clip-path com o translateY para um reveal ainda mais limpo. */
  withClip?: boolean;
  /** Margem do viewport para disparar mais cedo. */
  viewportMargin?: string;
  /** Disparar apenas uma vez. */
  once?: boolean;
  className?: string;
  /** Tag do wrapper (semântica). */
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "div" | "span";
};

const easeNatural = [0.22, 1, 0.36, 1] as const;

/**
 * Reveal cinematográfico linha-a-linha: cada linha sobe de baixo
 * (translateY 110% → 0) dentro de um clip overflow:hidden.
 * Opcionalmente combina com clip-path inset() para um corte mais nítido.
 */
export function SplitReveal({
  text,
  lines,
  delay = 0,
  stagger = 0.09,
  duration = 0.85,
  withClip = false,
  viewportMargin = "-20%",
  once = true,
  className,
  as = "div",
}: SplitRevealProps) {
  const reduce = useReducedMotion();
  const source = lines ?? (text ?? "").split("\n");

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const child: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : {
        hidden: {
          y: "110%",
          ...(withClip && { clipPath: "inset(0 0 100% 0)" }),
        },
        show: {
          y: "0%",
          ...(withClip && { clipPath: "inset(0 0 0% 0)" }),
          transition: { duration, ease: easeNatural },
        },
      };

  return createElement(
    motion[as] as typeof motion.div,
    {
      variants: container,
      initial: "hidden",
      whileInView: "show",
      viewport: { once, margin: viewportMargin },
      className,
    },
    source.map((line, i) => (
      <span
        key={i}
        className="block overflow-hidden"
        style={{ paddingBottom: "0.04em" }}
      >
        <motion.span variants={child} className="block will-change-transform">
          {line || "\u00A0"}
        </motion.span>
      </span>
    )),
  );
}
