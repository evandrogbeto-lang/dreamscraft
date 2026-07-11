import { forwardRef, useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
  as?: "div" | "span";
};

/**
 * Magnetic CTA with 3D tilt + inner parallax + cursor-tracked light sheen.
 * - Translates toward cursor when within 80px (magnetic pull).
 * - Tilts on rotateX / rotateY (max 8°) while hovered.
 * - Inner content drifts with the cursor (parallax).
 * - ::after radial gradient follows the pointer via --mx / --my CSS vars.
 */
export const MagneticButton = forwardRef<HTMLDivElement, Props>(
  ({ children, className, as = "div" }, _ref) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Magnetic translation
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    // 3D tilt
    const rX = useMotionValue(0);
    const rY = useMotionValue(0);
    // Inner parallax
    const ix = useMotionValue(0);
    const iy = useMotionValue(0);

    const spring = { stiffness: 220, damping: 18, mass: 0.4 };
    const restSpring = { stiffness: 200, damping: 25, mass: 0.5 };

    const sx = useSpring(x, spring);
    const sy = useSpring(y, spring);
    const srX = useSpring(rX, restSpring);
    const srY = useSpring(rY, restSpring);
    const six = useSpring(ix, restSpring);
    const siy = useSpring(iy, restSpring);

    useEffect(() => {
      if (typeof window === "undefined") return;
      if (window.matchMedia("(pointer: coarse)").matches) return;
      const el = wrapperRef.current;
      if (!el) return;

      const MAX = 8; // magnetic pull (px)
      const RADIUS = 80;
      const TILT = 8; // max degrees
      const PARALLAX = 0.3;

      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);

        // Magnetic translation
        if (dist < RADIUS) {
          const k = (1 - dist / RADIUS) * MAX;
          const a = Math.atan2(dy, dx);
          x.set(Math.cos(a) * k);
          y.set(Math.sin(a) * k);
        } else {
          x.set(0);
          y.set(0);
        }

        // Hover-bounded effects (tilt, parallax, sheen)
        const inside =
          e.clientX >= r.left &&
          e.clientX <= r.right &&
          e.clientY >= r.top &&
          e.clientY <= r.bottom;

        if (inside) {
          // Normalized -1..1
          const nx = (e.clientX - cx) / (r.width / 2);
          const ny = (e.clientY - cy) / (r.height / 2);
          rX.set(ny * -TILT);
          rY.set(nx * TILT);
          ix.set((e.clientX - cx) * PARALLAX);
          iy.set((e.clientY - cy) * PARALLAX);

          // Sheen position in %
          const mxPct = ((e.clientX - r.left) / r.width) * 100;
          const myPct = ((e.clientY - r.top) / r.height) * 100;
          el.style.setProperty("--mx", `${mxPct}%`);
          el.style.setProperty("--my", `${myPct}%`);
        } else {
          rX.set(0);
          rY.set(0);
          ix.set(0);
          iy.set(0);
        }
      };

      const onLeave = () => {
        x.set(0);
        y.set(0);
        rX.set(0);
        rY.set(0);
        ix.set(0);
        iy.set(0);
      };

      window.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      window.addEventListener("mouseleave", onLeave);
      return () => {
        window.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
        window.removeEventListener("mouseleave", onLeave);
      };
    }, [x, y, rX, rY, ix, iy]);

    const Comp = as === "span" ? motion.span : motion.div;
    const Inner = as === "span" ? motion.span : motion.div;

    return (
      <Comp
        ref={wrapperRef as never}
        style={{
          x: sx,
          y: sy,
          rotateX: srX,
          rotateY: srY,
          transformPerspective: 600,
          transformStyle: "preserve-3d",
          display: "inline-block",
          position: "relative",
        }}
        className={`magnetic-sheen ${className ?? ""}`}
      >
        <Inner
          style={{ x: six, y: siy, display: "inline-block" }}
        >
          {children}
        </Inner>
      </Comp>
    );
  },
);
MagneticButton.displayName = "MagneticButton";
