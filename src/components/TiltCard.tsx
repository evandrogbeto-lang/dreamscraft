import { useRef, type ReactNode, type CSSProperties } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion, useTransform } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface TiltCardProps {
  children: ReactNode;
  maxTilt?: number;
  glowColor?: string;
  className?: string;
  style?: CSSProperties;
}

export function TiltCard({
  children,
  maxTilt = 6,
  glowColor = "var(--primary)",
  className,
  style,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);

  const springCfg = { stiffness: 180, damping: 20, mass: 0.6 };
  const rotateX = useSpring(rx, springCfg);
  const rotateY = useSpring(ry, springCfg);
  const glowX = useSpring(gx, springCfg);
  const glowY = useSpring(gy, springCfg);

  const glowXPct = useTransform(glowX, (v) => `${v}%`);
  const glowYPct = useTransform(glowY, (v) => `${v}%`);

  const disabled = reduce || isMobile;

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const cy = ((e.clientY - r.top) / r.height) * 2 - 1;
    rx.set(cy * -maxTilt);
    ry.set(cx * maxTilt);
    gx.set(((e.clientX - r.left) / r.width) * 100);
    gy.set(((e.clientY - r.top) / r.height) * 100);
  }

  function handleLeave() {
    rx.set(0);
    ry.set(0);
    gx.set(50);
    gy.set(50);
  }

  if (disabled) {
    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`tilt-card relative ${className ?? ""}`}
      style={{
        ...style,
        perspective: 800,
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
        ["--glow-x" as string]: glowXPct,
        ["--glow-y" as string]: glowYPct,
        ["--glow-color" as string]: glowColor,
      }}
    >
      {children}
    </motion.div>
  );
}

export default TiltCard;
