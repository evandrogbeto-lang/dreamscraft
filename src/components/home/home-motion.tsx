/**
 * Home V6G motion — brand experience layer.
 * Soft spring scroll-reactive + one protagonist gesture per section.
 * Pictograma Fluxo · Sistema: mount-once (approved, untouched).
 */
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

export const homeEase = [0.22, 1, 0.36, 1] as const;

export const HOME_SPRING = {
  stiffness: 96,
  damping: 28,
  mass: 0.78,
} as const;

export const HOME_SPRING_SOFT = {
  stiffness: 88,
  damping: 30,
  mass: 0.85,
} as const;

export type HomeSpringPreset = {
  stiffness: number;
  damping: number;
  mass: number;
};

/**
 * Bidirectional section progress spanning the section.
 * Motion model: ENTRY → SETTLE → HOLD (no aggressive exit while leaving).
 */
export const SECTION_OFFSET = ["start 88%", "end 22%"] as const;
export const SECTION_OFFSET_TALL = ["start 90%", "end 18%"] as const;
export const SECTION_OFFSET_PROCESS = ["start 82%", "end 35%"] as const;
/** Projetos: late entry; settles and holds once cards are in. */
export const SECTION_OFFSET_PROJECTS = ["start 94%", "end 28%"] as const;
/** Soluções: enough distance for lines + 01→04, then hold. */
export const SECTION_OFFSET_SOLUTIONS = ["start 92%", "end 18%"] as const;
/** Small Team: starts early so construction finishes mid-section. */
export const SECTION_OFFSET_TEAM = ["start 86%", "end 30%"] as const;
/** Fechamento: entry-only feel — settles early and holds through page end. */
export const SECTION_OFFSET_CLOSE = ["start 90%", "end 42%"] as const;
export const SECTION_OFFSET_MOBILE = ["start 92%", "end 28%"] as const;
export const SECTION_OFFSET_TALL_MOBILE = ["start 94%", "end 24%"] as const;
export const SECTION_OFFSET_PROCESS_MOBILE = ["start 88%", "end 42%"] as const;
export const SECTION_OFFSET_PROJECTS_MOBILE = ["start 93%", "end 32%"] as const;
export const SECTION_OFFSET_SOLUTIONS_MOBILE = ["start 94%", "end 22%"] as const;
export const SECTION_OFFSET_TEAM_MOBILE = ["start 90%", "end 34%"] as const;
export const SECTION_OFFSET_CLOSE_MOBILE = ["start 92%", "end 48%"] as const;

export type MotionEnvelopeConfig = {
  entryStart?: number;
  entryEnd?: number;
  /** Kept for API compat; ignored when hold=true (default). */
  exitStart?: number;
  exitEnd?: number;
  yIn?: number;
  yOut?: number;
  xIn?: number;
  xOut?: number;
  /** Entry opacity floor (~0.65–0.8). Reverse soft-dim stays near this. */
  floor?: number;
  scaleIn?: number;
  scaleOut?: number;
  /**
   * ENTRY → SETTLE → HOLD.
   * After entryEnd, values stay final while scrolling down.
   * Reverse only when progress retreats through the entry band.
   */
  hold?: boolean;
};

/**
 * ENTRY → SETTLE → HOLD from a single progress value.
 * Default hold=true: no aggressive unmount on the way out.
 */
export function useMotionEnvelope(
  progress: MotionValue<number>,
  config: MotionEnvelopeConfig = {},
  reduce = false,
) {
  const entryStart = config.entryStart ?? 0;
  const entryEnd = config.entryEnd ?? 0.25;
  const hold = config.hold !== false;
  const exitStart = hold ? Math.min(0.999, entryEnd + 0.001) : (config.exitStart ?? 0.72);
  const exitEnd = hold ? 1 : (config.exitEnd ?? 1);
  const yIn = config.yIn ?? 24;
  const yOut = hold ? 0 : (config.yOut ?? -14);
  const xIn = config.xIn ?? 0;
  const xOut = hold ? 0 : (config.xOut ?? 0);
  const floor = config.floor ?? 0.75;
  const scaleIn = config.scaleIn ?? 0.985;
  const scaleOut = hold ? 1 : (config.scaleOut ?? 0.99);
  const opacityOut = hold ? 1 : Math.max(floor, 0.85);

  const keys = [entryStart, entryEnd, exitStart, exitEnd] as const;

  const opacity = useTransform(
    progress,
    [...keys],
    reduce ? [1, 1, 1, 1] : [floor, 1, 1, opacityOut],
  );
  const y = useTransform(progress, [...keys], reduce ? [0, 0, 0, 0] : [yIn, 0, 0, yOut]);
  const x = useTransform(progress, [...keys], reduce ? [0, 0, 0, 0] : [xIn, 0, 0, xOut]);
  const scale = useTransform(
    progress,
    [...keys],
    reduce ? [1, 1, 1, 1] : [scaleIn, 1, 1, scaleOut],
  );

  return { opacity, y, x, scale };
}

/** Derive entry band; exit band only used when hold=false. */
export function envelopeFromEntry(
  at: readonly [number, number],
  exitAt?: readonly [number, number],
): Required<Pick<MotionEnvelopeConfig, "entryStart" | "entryEnd" | "exitStart" | "exitEnd">> {
  const entryStart = at[0];
  const entryEnd = at[1];
  if (exitAt) {
    return {
      entryStart,
      entryEnd,
      exitStart: exitAt[0],
      exitEnd: exitAt[1],
    };
  }
  return {
    entryStart,
    entryEnd,
    exitStart: Math.min(0.999, entryEnd + 0.001),
    exitEnd: 1,
  };
}

type HomeMotionValue = {
  reduce: boolean;
  ready: boolean;
};

const HomeMotionContext = createContext<HomeMotionValue>({
  reduce: true,
  ready: false,
});

export function HomeMotionRoot({ children }: { children: ReactNode }) {
  const framer = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [mqReduce, setMqReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setMqReduce(mq.matches);
    setReady(true);
    const onChange = () => setMqReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const reduce = !ready || mqReduce || framer === true;

  return (
    <HomeMotionContext.Provider value={{ reduce, ready }}>{children}</HomeMotionContext.Provider>
  );
}

export function useHomeReduceMotion(): boolean {
  return useContext(HomeMotionContext).reduce;
}

function useHomeMotion() {
  return useContext(HomeMotionContext);
}

export function useAdaptiveSectionOffset(
  desktop: readonly [string, string] = SECTION_OFFSET,
  mobile: readonly [string, string] = SECTION_OFFSET_MOBILE,
): readonly [string, string] {
  const [offset, setOffset] = useState(desktop);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setOffset(mq.matches ? mobile : desktop);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [desktop, mobile]);

  return offset;
}

export function useSoftProgress(
  raw: MotionValue<number>,
  reduce: boolean,
  preset: HomeSpringPreset = HOME_SPRING,
) {
  const sprung = useSpring(raw, preset);
  return reduce ? raw : sprung;
}

export function useSectionProgress(
  ref: RefObject<HTMLElement | null>,
  offset: readonly [string, string] = SECTION_OFFSET,
) {
  const { reduce, ready } = useHomeMotion();
  const mobile =
    offset === SECTION_OFFSET_TALL
      ? SECTION_OFFSET_TALL_MOBILE
      : offset === SECTION_OFFSET_PROJECTS
        ? SECTION_OFFSET_PROJECTS_MOBILE
        : offset === SECTION_OFFSET_SOLUTIONS
          ? SECTION_OFFSET_SOLUTIONS_MOBILE
          : offset === SECTION_OFFSET_TEAM
            ? SECTION_OFFSET_TEAM_MOBILE
            : offset === SECTION_OFFSET_CLOSE
              ? SECTION_OFFSET_CLOSE_MOBILE
              : offset === SECTION_OFFSET_PROCESS
                ? SECTION_OFFSET_PROCESS_MOBILE
                : SECTION_OFFSET_MOBILE;
  const adaptive = useAdaptiveSectionOffset(offset, mobile);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [...adaptive] as ["start 88%", "end 22%"],
  });
  /** Soft spring only for Small Team + Fechamento (Hero uses soft separately). */
  const soft =
    offset === SECTION_OFFSET_TEAM || offset === SECTION_OFFSET_CLOSE
      ? HOME_SPRING_SOFT
      : HOME_SPRING;
  const progress = useSoftProgress(scrollYProgress, !ready || reduce, soft);
  return { progress, raw: scrollYProgress, reduce: !ready || reduce };
}

/**
 * Section-local depth layers — different travel speeds.
 * Applied only inside a section, never page-wide.
 */
export function useSectionDepth(progress: MotionValue<number>, reduce: boolean) {
  /** Mild depth that settles — does not keep drifting out as progress → 1. */
  const headlineY = useTransform(progress, [0, 0.45, 1], reduce ? [0, 0, 0] : [0, -8, -8]);
  const bodyY = useTransform(progress, [0, 0.5, 1], reduce ? [0, 0, 0] : [0, -12, -12]);
  const visualY = useTransform(progress, [0, 0.55, 1], reduce ? [0, 0, 0] : [0, -16, -16]);
  return { headlineY, bodyY, visualY };
}

export function DepthLayer({
  y,
  className,
  children,
  style,
}: {
  y: MotionValue<number>;
  className?: string;
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  const reduce = useHomeReduceMotion();
  if (reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
  return (
    <motion.div className={className} style={{ ...style, y }}>
      {children}
    </motion.div>
  );
}

/**
 * Transversal brand gesture — ENTRY / STABLE / EXIT via envelope.
 * Floors stay high: motion, not vanish/reappear.
 */
export function BrandDepthReveal({
  progress,
  at = [0, 0.28],
  exitAt,
  y = 24,
  yOut,
  scale = 0.985,
  scaleOut = 0.99,
  floor = 0.75,
  className,
  children,
  as = "div",
  style,
}: {
  progress: MotionValue<number>;
  at?: readonly [number, number];
  exitAt?: readonly [number, number];
  y?: number;
  yOut?: number;
  scale?: number;
  scaleOut?: number;
  floor?: number;
  className?: string;
  children: ReactNode;
  as?: "div" | "li";
  style?: React.CSSProperties;
}) {
  const reduce = useHomeReduceMotion();
  const band = envelopeFromEntry(at, exitAt);
  const { opacity, y: translateY, scale: scaleMv } = useMotionEnvelope(
    progress,
    {
      ...band,
      yIn: y,
      yOut: yOut ?? -Math.round(Math.abs(y) * 0.55 || 12),
      floor,
      scaleIn: scale,
      scaleOut,
    },
    reduce,
  );

  if (reduce) {
    const Tag = as;
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }

  const MotionTag = as === "li" ? motion.li : motion.div;
  return (
    <MotionTag
      className={className}
      style={{ ...style, opacity, y: translateY, scale: scaleMv }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Scroll scrub with bidirectional envelope.
 * `at` = entry band; `exitAt` = exit band (auto-derived if omitted).
 */
export function Scrub({
  progress,
  at,
  exitAt,
  y = 24,
  yOut,
  x = 0,
  xOut = 0,
  scale = 0.985,
  scaleOut = 0.99,
  floor = 0.75,
  className,
  children,
  style,
  as = "div",
}: {
  progress: MotionValue<number>;
  at: readonly [number, number];
  exitAt?: readonly [number, number];
  y?: number;
  yOut?: number;
  x?: number;
  xOut?: number;
  scale?: number;
  scaleOut?: number;
  floor?: number;
  className?: string;
  children: ReactNode;
  style?: React.CSSProperties;
  as?: "div" | "li";
}) {
  const reduce = useHomeReduceMotion();
  const band = envelopeFromEntry(at, exitAt);
  const { opacity, y: translateY, x: translateX, scale: scaleMv } = useMotionEnvelope(
    progress,
    {
      ...band,
      yIn: y,
      yOut: yOut ?? -(y === 0 ? 12 : Math.round(Math.abs(y) * 0.55)),
      xIn: x,
      xOut,
      floor,
      scaleIn: scale,
      scaleOut,
    },
    reduce,
  );

  if (reduce) {
    const Tag = as;
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }

  const MotionTag = as === "li" ? motion.li : motion.div;
  return (
    <MotionTag
      className={className}
      style={{ ...style, opacity, y: translateY, x: translateX, scale: scaleMv }}
    >
      {children}
    </MotionTag>
  );
}

/** Rail growth that follows the same envelope (Soluções presence). */
export function EnvelopeRail({
  progress,
  at,
  exitAt,
  className,
}: {
  progress: MotionValue<number>;
  at: readonly [number, number];
  exitAt?: readonly [number, number];
  className?: string;
}) {
  const reduce = useHomeReduceMotion();
  const band = envelopeFromEntry(at, exitAt);
  const scaleY = useTransform(
    progress,
    [band.entryStart, band.entryEnd, band.exitStart, band.exitEnd],
    reduce ? [1, 1, 1, 1] : [0.18, 1, 1, 0.42],
  );
  const opacity = useTransform(
    progress,
    [band.entryStart, band.entryEnd, band.exitStart, band.exitEnd],
    reduce ? [1, 1, 1, 1] : [0.45, 1, 1, 0.55],
  );

  if (reduce) {
    return <span className={className} aria-hidden />;
  }

  return (
    <motion.span
      className={className}
      aria-hidden
      style={{ scaleY, opacity, originY: 0.5 }}
    />
  );
}

export function HomeReveal({
  children,
  className,
  delay = 0,
  y = 24,
  x = 0,
  duration = 0.65,
  immediate = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  duration?: number;
  immediate?: boolean;
}) {
  const { reduce, ready } = useHomeMotion();

  if (reduce || !ready || !immediate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration, delay, ease: homeEase }}
    >
      {children}
    </motion.div>
  );
}

export function HomeConnectorY({
  className,
  active,
  delay = 0,
  duration = 0.4,
}: {
  className?: string;
  active?: boolean;
  delay?: number;
  duration?: number;
}) {
  const { reduce, ready } = useHomeMotion();

  if (reduce || !ready) {
    return <span className={className} aria-hidden />;
  }

  return (
    <motion.span
      className={className}
      aria-hidden
      style={{ originY: 0 }}
      initial={{ scaleY: 0, opacity: 0 }}
      animate={active ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
      transition={{ duration, delay, ease: homeEase }}
    />
  );
}

/* ── HERO depth + exit (pictograma untouched) ── */

export function useHeroScrollDepth() {
  const { reduce, ready } = useHomeMotion();
  const { scrollY } = useScroll();
  const soft = useSoftProgress(scrollY, !ready || reduce, HOME_SPRING_SOFT);

  const headlineY = useTransform(soft, [0, 380], reduce ? [0, 0] : [0, -12]);
  const bodyY = useTransform(soft, [0, 420], reduce ? [0, 0] : [0, -18]);
  const structureY = useTransform(soft, [0, 400], reduce ? [0, 0] : [0, -8]);
  const structureOpacity = useTransform(soft, [0, 120, 480], reduce ? [1, 1, 1] : [1, 1, 0.82]);
  const structureScale = useTransform(soft, [0, 480], reduce ? [1, 1] : [1, 0.985]);

  return {
    headlineY,
    bodyY,
    structureY,
    structureOpacity,
    structureScale,
    reduce: !ready || reduce,
  };
}

export function HeroDepthLayer({
  y,
  opacity,
  scale,
  className,
  children,
}: {
  y: MotionValue<number>;
  opacity?: MotionValue<number>;
  scale?: MotionValue<number>;
  className?: string;
  children: ReactNode;
}) {
  const reduce = useHomeReduceMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div className={className} style={{ y, opacity, scale }}>
      {children}
    </motion.div>
  );
}

/* ── HERO: Fluxo · Sistema (mount-once) — DO NOT alter paths/timing ── */

export function HeroFluxoSistemaMark({
  className,
  play,
}: {
  className?: string;
  play: boolean;
}) {
  const { reduce, ready } = useHomeMotion();
  const animate = ready && !reduce && play;

  const paths = (
    <>
      <path
        d="M14.52 15.84H5.72C3.77596 15.84 2.2 17.416 2.2 19.36V28.16C2.2 30.104 3.77596 31.68 5.72 31.68H14.52C16.464 31.68 18.04 30.104 18.04 28.16V19.36C18.04 17.416 16.464 15.84 14.52 15.84Z"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path
        d="M44 3.96H35.2C33.256 3.96 31.68 5.53596 31.68 7.48V16.28C31.68 18.224 33.256 19.8 35.2 19.8H44C45.944 19.8 47.52 18.224 47.52 16.28V7.48C47.52 5.53596 45.944 3.96 44 3.96Z"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path
        d="M73.48 15.84H64.68C62.736 15.84 61.16 17.416 61.16 19.36V28.16C61.16 30.104 62.736 31.68 64.68 31.68H73.48C75.424 31.68 77 30.104 77 28.16V19.36C77 17.416 75.424 15.84 73.48 15.84Z"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path
        d="M30.8 22.66H18.92C18.434 22.66 18.04 23.054 18.04 23.54V23.98C18.04 24.466 18.434 24.86 18.92 24.86H30.8C31.286 24.86 31.68 24.466 31.68 23.98V23.54C31.68 23.054 31.286 22.66 30.8 22.66Z"
        fill="currentColor"
      />
      <path
        d="M54.12 10.78H48.4C47.914 10.78 47.52 11.174 47.52 11.66V12.1C47.52 12.586 47.914 12.98 48.4 12.98H54.12C54.606 12.98 55 12.586 55 12.1V11.66C55 11.174 54.606 10.78 54.12 10.78Z"
        fill="currentColor"
      />
      <path
        d="M54.12 10.78H53.68C53.194 10.78 52.8 11.174 52.8 11.66V23.98C52.8 24.466 53.194 24.86 53.68 24.86H54.12C54.606 24.86 55 24.466 55 23.98V11.66C55 11.174 54.606 10.78 54.12 10.78Z"
        fill="currentColor"
      />
      <path
        d="M60.28 22.66H55.88C55.394 22.66 55 23.054 55 23.54V23.98C55 24.466 55.394 24.86 55.88 24.86H60.28C60.766 24.86 61.16 24.466 61.16 23.98V23.54C61.16 23.054 60.766 22.66 60.28 22.66Z"
        fill="currentColor"
      />
    </>
  );

  if (reduce || !ready) {
    return (
      <svg
        className={className}
        viewBox="0 0 79.2 46.2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {paths}
      </svg>
    );
  }

  return (
    <svg
      className={className}
      viewBox="0 0 79.2 46.2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <motion.path
        d="M14.52 15.84H5.72C3.77596 15.84 2.2 17.416 2.2 19.36V28.16C2.2 30.104 3.77596 31.68 5.72 31.68H14.52C16.464 31.68 18.04 30.104 18.04 28.16V19.36C18.04 17.416 16.464 15.84 14.52 15.84Z"
        stroke="currentColor"
        strokeWidth="2.2"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={animate ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.45, delay: 0.15, ease: homeEase }}
        style={{ originX: "11px", originY: "23.76px" }}
      />
      <motion.path
        d="M44 3.96H35.2C33.256 3.96 31.68 5.53596 31.68 7.48V16.28C31.68 18.224 33.256 19.8 35.2 19.8H44C45.944 19.8 47.52 18.224 47.52 16.28V7.48C47.52 5.53596 45.944 3.96 44 3.96Z"
        stroke="currentColor"
        strokeWidth="2.2"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={animate ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.45, delay: 0.32, ease: homeEase }}
        style={{ originX: "39.6px", originY: "11.88px" }}
      />
      <motion.path
        d="M73.48 15.84H64.68C62.736 15.84 61.16 17.416 61.16 19.36V28.16C61.16 30.104 62.736 31.68 64.68 31.68H73.48C75.424 31.68 77 30.104 77 28.16V19.36C77 17.416 75.424 15.84 73.48 15.84Z"
        stroke="currentColor"
        strokeWidth="2.2"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={animate ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.45, delay: 0.48, ease: homeEase }}
        style={{ originX: "69.08px", originY: "23.76px" }}
      />
      <motion.path
        d="M30.8 22.66H18.92C18.434 22.66 18.04 23.054 18.04 23.54V23.98C18.04 24.466 18.434 24.86 18.92 24.86H30.8C31.286 24.86 31.68 24.466 31.68 23.98V23.54C31.68 23.054 31.286 22.66 30.8 22.66Z"
        fill="currentColor"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={animate ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
        transition={{ duration: 0.35, delay: 0.58, ease: homeEase }}
        style={{ originX: 0 }}
      />
      <motion.path
        d="M54.12 10.78H48.4C47.914 10.78 47.52 11.174 47.52 11.66V12.1C47.52 12.586 47.914 12.98 48.4 12.98H54.12C54.606 12.98 55 12.586 55 12.1V11.66C55 11.174 54.606 10.78 54.12 10.78Z"
        fill="currentColor"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={animate ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
        transition={{ duration: 0.3, delay: 0.68, ease: homeEase }}
        style={{ originX: 0 }}
      />
      <motion.path
        d="M54.12 10.78H53.68C53.194 10.78 52.8 11.174 52.8 11.66V23.98C52.8 24.466 53.194 24.86 53.68 24.86H54.12C54.606 24.86 55 24.466 55 23.98V11.66C55 11.174 54.606 10.78 54.12 10.78Z"
        fill="currentColor"
        initial={{ opacity: 0, scaleY: 0 }}
        animate={animate ? { opacity: 1, scaleY: 1 } : { opacity: 0, scaleY: 0 }}
        transition={{ duration: 0.35, delay: 0.72, ease: homeEase }}
        style={{ originY: 0 }}
      />
      <motion.path
        d="M60.28 22.66H55.88C55.394 22.66 55 23.054 55 23.54V23.98C55 24.466 55.394 24.86 55.88 24.86H60.28C60.766 24.86 61.16 24.466 61.16 23.98V23.54C61.16 23.054 60.766 22.66 60.28 22.66Z"
        fill="currentColor"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={animate ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
        transition={{ duration: 0.3, delay: 0.82, ease: homeEase }}
        style={{ originX: 0 }}
      />
    </svg>
  );
}

/* ── DIAGNÓSTICO — choreography protagonist ── */

export function DiagnosticSurfaceScrub({
  progress,
  className,
  children,
}: {
  progress: MotionValue<number>;
  className?: string;
  children: ReactNode;
}) {
  const reduce = useHomeReduceMotion();
  const { opacity, y, scale } = useMotionEnvelope(
    progress,
    {
      entryStart: 0,
      entryEnd: 0.26,
      yIn: 22,
      floor: 0.72,
      scaleIn: 0.985,
      hold: true,
    },
    reduce,
  );

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} style={{ opacity, y, scale }}>
      {children}
    </motion.div>
  );
}

export function DiagnosticRailScrub({
  progress,
  className,
}: {
  progress: MotionValue<number>;
  className?: string;
}) {
  const reduce = useHomeReduceMotion();
  const scaleY = useTransform(progress, [0.0, 0.28, 1], reduce ? [1, 1, 1] : [0.08, 1, 1]);
  const opacity = useTransform(progress, [0.0, 0.18, 1], reduce ? [1, 1, 1] : [0.55, 1, 1]);

  if (reduce) {
    return <div className={className} aria-hidden />;
  }

  return (
    <motion.div
      className={className}
      aria-hidden
      style={{ scaleY, opacity, originY: 0 }}
    />
  );
}

/** Pain signal — future/active/past contrast (protagonist for Diagnóstico list). */
export function DiagnosticPainSignal({
  progress,
  index,
  total = 4,
  className,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  total?: number;
  className?: string;
  children: ReactNode;
}) {
  const reduce = useHomeReduceMotion();
  const entryStart = 0.14 + index * 0.07;
  const entryEnd = entryStart + 0.1;

  const opacity = useTransform(progress, (p) => {
    if (reduce) return 1;
    const active = Math.min(total - 1, Math.max(0, ((p - 0.14) / 0.52) * total));
    const dist = Math.abs(active - index);
    if (dist < 0.5) return 1;
    if (active > index) return 0.92;
    return 0.62;
  });

  const { y, scale } = useMotionEnvelope(
    progress,
    {
      entryStart,
      entryEnd,
      yIn: 14,
      floor: 1,
      scaleIn: 0.985,
      hold: true,
    },
    reduce,
  );

  if (reduce) {
    return <li className={className}>{children}</li>;
  }

  return (
    <motion.li className={className} style={{ opacity, y, scale }}>
      {children}
    </motion.li>
  );
}

export function DiagnosticFormPresence({
  progress,
  className,
  children,
}: {
  progress: MotionValue<number>;
  className?: string;
  children: ReactNode;
}) {
  const reduce = useHomeReduceMotion();
  const { opacity, y, scale } = useMotionEnvelope(
    progress,
    {
      entryStart: 0.34,
      entryEnd: 0.52,
      yIn: 20,
      floor: 0.74,
      scaleIn: 0.985,
      hold: true,
    },
    reduce,
  );

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} style={{ opacity, y, scale }}>
      {children}
    </motion.div>
  );
}

/* ── SECRETÁRIA — signal travel protagonist ── */

function signalActive(p: number, total: number) {
  const span = 0.62;
  const start = 0.12;
  return Math.min(total - 1, Math.max(0, ((p - start) / span) * total));
}

export function SignalStep({
  progress,
  index,
  total = 4,
  children,
  className,
}: {
  progress: MotionValue<number>;
  index: number;
  total?: number;
  children: ReactNode;
  className?: string;
}) {
  const reduce = useHomeReduceMotion();

  const opacity = useTransform(progress, (p) => {
    if (reduce) return 1;
    const active = signalActive(p, total);
    const dist = Math.abs(active - index);
    if (dist < 0.4) return 1;
    if (active > index) return 0.85;
    return 0.55;
  });

  const scale = useTransform(progress, (p) => {
    if (reduce) return 1;
    const active = signalActive(p, total);
    const dist = Math.abs(active - index);
    if (dist < 0.4) return 1.02;
    return 1;
  });

  const x = useTransform(progress, (p) => {
    if (reduce) return 0;
    const active = signalActive(p, total);
    if (active >= index) return 0;
    return 10;
  });

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} style={{ opacity, scale, x, originX: 0 }}>
      {children}
    </motion.div>
  );
}

export function SignalConnector({
  progress,
  afterIndex,
  total = 4,
  className,
}: {
  progress: MotionValue<number>;
  afterIndex: number;
  total?: number;
  className?: string;
}) {
  const reduce = useHomeReduceMotion();

  const opacity = useTransform(progress, (p) => {
    if (reduce) return 1;
    const active = signalActive(p, total);
    if (active > afterIndex + 0.4) return 0.95;
    if (active > afterIndex) return 0.55 + (active - afterIndex) * 0.5;
    return 0.4;
  });

  const scaleY = useTransform(progress, (p) => {
    if (reduce) return 1;
    const active = signalActive(p, total);
    if (active > afterIndex + 0.35) return 1;
    if (active > afterIndex) return 0.4 + (active - afterIndex) * 0.7;
    return 0.35;
  });

  if (reduce) {
    return (
      <p className={className} aria-hidden>
        ↓
      </p>
    );
  }

  return (
    <motion.p
      className={className}
      aria-hidden
      style={{ opacity, scaleY, originY: 0 }}
    >
      ↓
    </motion.p>
  );
}

/** Traveling highlight along the signal column. */
export function SignalTravelPulse({
  progress,
  className,
}: {
  progress: MotionValue<number>;
  className?: string;
}) {
  const reduce = useHomeReduceMotion();
  const top = useTransform(progress, [0.12, 0.74], reduce ? ["8%", "8%"] : ["6%", "78%"]);
  const opacity = useTransform(
    progress,
    [0.08, 0.18, 0.74, 1],
    reduce ? [0, 0, 0, 0] : [0, 0.9, 0.9, 0.85],
  );

  if (reduce) return null;

  return (
    <motion.span
      className={className}
      aria-hidden
      style={{ top, opacity }}
    />
  );
}

/* ── SMALL TEAM — line reveal (not letter-by-letter) ── */

/**
 * Headline presence by line: Y + soft clip. Bidirectional via envelope.
 * Not character reveal — the line assumes presence as a unit.
 */
export function TeamLineReveal({
  progress,
  at = [0.08, 0.28],
  exitAt,
  y = 24,
  floor = 0.7,
  scale = 0.99,
  className,
  children,
}: {
  progress: MotionValue<number>;
  at?: readonly [number, number];
  exitAt?: readonly [number, number];
  y?: number;
  floor?: number;
  scale?: number;
  className?: string;
  children: ReactNode;
}) {
  const reduce = useHomeReduceMotion();
  const band = envelopeFromEntry(at, exitAt);
  const { opacity, y: translateY, scale: scaleMv } = useMotionEnvelope(
    progress,
    {
      ...band,
      yIn: y,
      floor,
      scaleIn: scale,
      hold: true,
    },
    reduce,
  );
  const clipPath = useTransform(
    progress,
    [band.entryStart, band.entryEnd, 1],
    reduce
      ? ["inset(0 0% 0 0)", "inset(0 0% 0 0)", "inset(0 0% 0 0)"]
      : ["inset(0 0% 32% 0)", "inset(0 0% 0% 0)", "inset(0 0% 0% 0)"],
  );

  if (reduce) {
    return <span className={className}>{children}</span>;
  }

  return (
    <motion.span className={className} style={{ display: "block", opacity, y: translateY, scale: scaleMv, clipPath }}>
      {children}
    </motion.span>
  );
}

/** @deprecated Prefer TeamLineReveal — kept as alias for older call sites. */
export function TeamHeadlineReveal(props: {
  progress: MotionValue<number>;
  className?: string;
  children: ReactNode;
}) {
  return <TeamLineReveal {...props} />;
}

export function ManifestoAccentRail({
  progress,
  className,
}: {
  progress: MotionValue<number>;
  className?: string;
}) {
  const reduce = useHomeReduceMotion();
  const scaleX = useTransform(progress, [0.34, 0.48, 1], reduce ? [1, 1, 1] : [0, 1, 1]);
  const opacity = useTransform(progress, [0.34, 0.46, 1], reduce ? [1, 1, 1] : [0.4, 1, 1]);

  if (reduce) {
    return <span className={className} aria-hidden />;
  }

  return (
    <motion.span
      className={className}
      aria-hidden
      style={{ scaleX, opacity, originX: 0 }}
    />
  );
}

/* ── PROCESSO ── */

export function useProcessScrollProgress(ref: RefObject<HTMLElement | null>) {
  const { reduce, ready } = useHomeMotion();
  const adaptive = useAdaptiveSectionOffset(
    SECTION_OFFSET_PROCESS,
    SECTION_OFFSET_PROCESS_MOBILE,
  );
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [...adaptive] as ["start 78%", "end 42%"],
  });
  const progress = useSoftProgress(scrollYProgress, !ready || reduce, HOME_SPRING);
  return { progress, reduce: !ready || reduce };
}

export function ProcessProgressRail({
  progress,
  reduce,
  className,
}: {
  progress: MotionValue<number>;
  reduce: boolean;
  className?: string;
}) {
  const scaleX = useTransform(progress, [0, 1], reduce ? [1, 1] : [0, 1]);

  if (reduce) {
    return <div className={className} data-process-progress aria-hidden />;
  }

  return (
    <motion.div
      className={className}
      data-process-progress
      aria-hidden
      style={{ scaleX, originX: 0 }}
    />
  );
}

export function ProcessStepLabel({
  progress,
  index,
  total,
  className,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  className?: string;
  children: ReactNode;
}) {
  const reduce = useHomeReduceMotion();

  const opacity = useTransform(progress, (p) => {
    if (reduce) return 1;
    const active = p * total;
    if (active >= index + 0.55) return 0.9;
    if (active >= index) return 1;
    return 0.5;
  });

  const scale = useTransform(progress, (p) => {
    if (reduce) return 1;
    const active = p * total;
    if (active >= index && active < index + 0.7) return 1.03;
    return 1;
  });

  if (reduce) {
    return <p className={className}>{children}</p>;
  }

  return (
    <motion.p className={className} style={{ opacity, scale }}>
      {children}
    </motion.p>
  );
}

export function ProcessStepTick({
  progress,
  index,
  total,
  className,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  className?: string;
}) {
  const reduce = useHomeReduceMotion();

  const opacity = useTransform(progress, (p) => {
    if (reduce) return 1;
    const active = p * total;
    if (active >= index + 0.5) return 0.92;
    if (active >= index) return 1;
    return 0.45;
  });

  const scale = useTransform(progress, (p) => {
    if (reduce) return 1;
    const active = p * total;
    if (active >= index) return 1;
    return 0.85;
  });

  if (reduce) {
    return <span className={className} aria-hidden />;
  }

  return (
    <motion.span
      className={className}
      aria-hidden
      style={{ opacity, scale, originX: 0 }}
    />
  );
}

export function useSectionRef<T extends HTMLElement = HTMLDivElement>() {
  return useRef<T | null>(null);
}

/* ── SCROLL TEXT REVEAL — brand typography built by local progress ── */

function segmentGraphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    try {
      const seg = new Intl.Segmenter("pt", { granularity: "grapheme" });
      return Array.from(seg.segment(text), (s) => s.segment);
    } catch {
      /* fall through */
    }
  }
  return Array.from(text);
}

function segmentWords(text: string): string[] {
  return text.split(/(\s+)/).filter((part) => part.length > 0);
}

/**
 * Word-safe structure for chars mode:
 * punctuation stays inside the word wrapper (no orphan "." / ",").
 */
type CharRevealBlock =
  | { kind: "word"; chars: string[] }
  | { kind: "space"; text: string }
  | { kind: "br" };

function segmentCharBlocks(text: string): CharRevealBlock[] {
  const blocks: CharRevealBlock[] = [];
  const parts = text.split(/(\n|\s+)/);
  for (const part of parts) {
    if (!part) continue;
    if (part === "\n") {
      blocks.push({ kind: "br" });
      continue;
    }
    if (/^\s+$/.test(part)) {
      blocks.push({ kind: "space", text: part });
      continue;
    }
    blocks.push({ kind: "word", chars: segmentGraphemes(part) });
  }
  return blocks;
}

function unitProgress(
  p: number,
  index: number,
  count: number,
  from: number,
  to: number,
  reverseOrder: boolean,
): number {
  if (count <= 0) return 1;
  const span = Math.max(0.001, to - from);
  const order = reverseOrder ? count - 1 - index : index;
  const slot = span / count;
  const overlap = slot * 1.65;
  const start = from + order * slot * 0.72;
  const end = Math.min(to, start + overlap);
  if (p <= start) return 0;
  if (p >= end) return 1;
  return (p - start) / (end - start);
}

const ScrollUnit = memo(function ScrollUnit({
  text,
  index,
  count,
  progress,
  from,
  to,
  exitFrom,
  exitTo,
  y = 22,
  reduce,
}: {
  text: string;
  index: number;
  count: number;
  progress: MotionValue<number>;
  from: number;
  to: number;
  exitFrom: number;
  exitTo: number;
  y?: number;
  reduce: boolean;
}) {
  const amount = useTransform(progress, (p) => {
    if (reduce) return 1;
    /** ENTRY → HOLD: no exit unmount; reverse only when progress retreats through entry. */
    return unitProgress(p, index, count, from, to, false);
  });

  const opacity = useTransform(amount, [0, 1], reduce ? [1, 1] : [0, 1]);
  const translateY = useTransform(amount, [0, 1], reduce ? [0, 0] : [y, 0]);
  const rotateX = useTransform(amount, [0, 1], reduce ? [0, 0] : [7, 0]);

  if (reduce) {
    return <span style={{ display: "inline-block", whiteSpace: "pre" }}>{text}</span>;
  }

  return (
    <motion.span
      aria-hidden
      style={{
        display: "inline-block",
        whiteSpace: "pre",
        opacity,
        y: translateY,
        rotateX,
        transformOrigin: "50% 100%",
      }}
    >
      {text}
    </motion.span>
  );
});

export type ScrollTextRevealMode = "chars" | "words";

/**
 * Scroll-driven brand typography reveal.
 * Same local progress builds (and unbuilds) units — no timers, no direction state.
 * chars mode: letters animate inside nowrap word wrappers (punctuation never orphans).
 */
export function ScrollTextReveal({
  text,
  progress,
  from = 0,
  to = 0.28,
  exitFrom = 0.78,
  exitTo = 1,
  mode = "chars",
  y = 22,
  as: Tag = "span",
  className,
  id,
}: {
  text: string;
  progress: MotionValue<number>;
  from?: number;
  to?: number;
  exitFrom?: number;
  exitTo?: number;
  mode?: ScrollTextRevealMode;
  y?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  className?: string;
  id?: string;
}) {
  const reduce = useHomeReduceMotion();
  const wordUnits = useMemo(() => segmentWords(text), [text]);
  const charBlocks = useMemo(() => segmentCharBlocks(text), [text]);
  const charCount = useMemo(
    () => charBlocks.reduce((n, b) => (b.kind === "word" ? n + b.chars.length : n), 0),
    [charBlocks],
  );

  /** Mobile: slightly shorter band so letter reveal does not feel sluggish. */
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const bandTo = compact ? from + (to - from) * 0.82 : to;
  const bandExitFrom = compact ? exitFrom + (exitTo - exitFrom) * 0.08 : exitFrom;

  if (reduce) {
    return (
      <Tag id={id} className={className}>
        {text}
      </Tag>
    );
  }

  let charIndex = 0;

  return (
    <Tag
      id={id}
      className={className}
      aria-label={text}
      style={{ perspective: 680 }}
    >
      <span aria-hidden>
        {mode === "words"
          ? (() => {
              const tokens = wordUnits.filter((u) => !/^\s+$/.test(u) && u !== "\n");
              let tokenIndex = 0;
              return wordUnits.map((unit, index) => {
                if (unit === "\n") return <br key={`br-${index}`} />;
                if (/^\s+$/.test(unit)) {
                  return (
                    <span key={`sp-${index}`} style={{ whiteSpace: "pre" }}>
                      {unit}
                    </span>
                  );
                }
                const i = tokenIndex++;
                return (
                  <span
                    key={`w-${index}-${unit}`}
                    style={{ display: "inline-block", whiteSpace: "nowrap" }}
                  >
                    <ScrollUnit
                      text={unit}
                      index={i}
                      count={tokens.length}
                      progress={progress}
                      from={from}
                      to={bandTo}
                      exitFrom={bandExitFrom}
                      exitTo={exitTo}
                      y={y * 0.75}
                      reduce={false}
                    />
                  </span>
                );
              });
            })()
          : charBlocks.map((block, bi) => {
              if (block.kind === "br") {
                return <br key={`br-${bi}`} />;
              }
              if (block.kind === "space") {
                return (
                  <span key={`sp-${bi}`} style={{ whiteSpace: "pre" }}>
                    {block.text}
                  </span>
                );
              }
              const start = charIndex;
              charIndex += block.chars.length;
              return (
                <span
                  key={`w-${bi}-${block.chars.join("")}`}
                  style={{ display: "inline-block", whiteSpace: "nowrap" }}
                >
                  {block.chars.map((ch, ci) => (
                    <ScrollUnit
                      key={`${start + ci}-${ch}`}
                      text={ch}
                      index={start + ci}
                      count={charCount}
                      progress={progress}
                      from={from}
                      to={bandTo}
                      exitFrom={bandExitFrom}
                      exitTo={exitTo}
                      y={y}
                      reduce={false}
                    />
                  ))}
                </span>
              );
            })}
      </span>
    </Tag>
  );
}

/**
 * Soluções line — number → title → description → rail, all from one progress.
 */
export function SolutionLine({
  progress,
  index,
  num,
  title,
  desc,
  accent,
  className,
}: {
  progress: MotionValue<number>;
  index: number;
  num: string;
  title: string;
  desc: string;
  accent: string;
  className?: string;
}) {
  const reduce = useHomeReduceMotion();

  const entryStart = 0.28 + index * 0.1;
  const entryEnd = 0.42 + index * 0.1;

  const span = Math.max(0.08, entryEnd - entryStart);
  const numAt: readonly [number, number] = [entryStart, entryStart + span * 0.35];
  const titleAt: readonly [number, number] = [entryStart + span * 0.2, entryStart + span * 0.65];
  const descAt: readonly [number, number] = [entryStart + span * 0.4, entryEnd];

  const { opacity, y, x, scale } = useMotionEnvelope(
    progress,
    {
      entryStart,
      entryEnd,
      yIn: 10 + index,
      xIn: -(18 + index * 2),
      floor: 0.68,
      scaleIn: 0.985,
      hold: true,
    },
    reduce,
  );

  const numEnv = useMotionEnvelope(
    progress,
    {
      entryStart: numAt[0],
      entryEnd: numAt[1],
      yIn: 10,
      floor: 0.7,
      scaleIn: 0.97,
      hold: true,
    },
    reduce,
  );
  const titleEnv = useMotionEnvelope(
    progress,
    {
      entryStart: titleAt[0],
      entryEnd: titleAt[1],
      yIn: 12,
      xIn: -8,
      floor: 0.7,
      scaleIn: 0.985,
      hold: true,
    },
    reduce,
  );
  const descEnv = useMotionEnvelope(
    progress,
    {
      entryStart: descAt[0],
      entryEnd: descAt[1],
      yIn: 10,
      xIn: -6,
      floor: 0.68,
      scaleIn: 0.99,
      hold: true,
    },
    reduce,
  );

  const railScaleY = useTransform(
    progress,
    [entryStart, entryEnd, 1],
    reduce ? [1, 1, 1] : [0.12, 1, 1],
  );
  const railOpacity = useTransform(
    progress,
    [entryStart, entryEnd, 1],
    reduce ? [1, 1, 1] : [0.35, 1, 1],
  );

  if (reduce) {
    return (
      <li className={className}>
        <span
          className={`absolute inset-y-0 left-0 bg-brand-rosa ${index === 0 ? "w-1" : "w-0"}`}
          aria-hidden
        />
        <span className={`text-[13px] ${accent}`}>{num}</span>
        <p className="text-sm uppercase tracking-[0.04em] text-brand-branco sm:text-[15px]">
          {title}
        </p>
        <p className="text-sm leading-relaxed text-brand-branco/80 sm:text-[15px]">{desc}</p>
      </li>
    );
  }

  return (
    <motion.li className={className} style={{ opacity, y, x, scale }}>
      <motion.span
        className={`absolute inset-y-0 left-0 bg-brand-rosa transition-[width] duration-300 motion-reduce:transition-none ${
          index === 0 ? "w-1" : "w-0 group-hover:w-1.5"
        }`}
        aria-hidden
        style={{ scaleY: railScaleY, opacity: railOpacity, originY: 0 }}
      />
      <motion.span
        className={`text-[13px] transition-colors duration-300 ${accent} group-hover:text-brand-rosa`}
        style={{ opacity: numEnv.opacity, y: numEnv.y, scale: numEnv.scale }}
      >
        {num}
      </motion.span>
      <motion.p
        className="text-sm uppercase tracking-[0.04em] text-brand-branco transition-colors duration-300 group-hover:text-brand-rosa sm:text-[15px]"
        style={{ opacity: titleEnv.opacity, y: titleEnv.y, x: titleEnv.x, scale: titleEnv.scale }}
      >
        {title}
      </motion.p>
      <motion.p
        className="text-sm leading-relaxed text-brand-branco/80 transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transform-none sm:text-[15px]"
        style={{ opacity: descEnv.opacity, y: descEnv.y, x: descEnv.x, scale: descEnv.scale }}
      >
        {desc}
      </motion.p>
    </motion.li>
  );
}
