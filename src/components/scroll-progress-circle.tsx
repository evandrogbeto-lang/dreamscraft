import { useEffect, useState } from "react";

export function ScrollProgressCircle() {
  const [pct, setPct] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      setPct(p);
      setVisible(window.scrollY > 200);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const r = 22;
  const c = 2 * Math.PI * r;
  const dash = c - (pct / 100) * c;

  return (
    <button
      type="button"
      aria-label={`Scroll progress ${Math.round(pct)} percent. Click to scroll to top.`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: "9999px",
        background: "color-mix(in oklab, var(--background) 70%, transparent)",
        backdropFilter: "blur(10px)",
        border: "1px solid color-mix(in oklab, var(--primary) 35%, transparent)",
        zIndex: 60,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity .3s ease, transform .3s ease",
        display: "grid",
        placeItems: "center",
        cursor: "pointer",
      }}
    >
      <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true" style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
        <circle cx="28" cy="28" r={r} fill="none" stroke="color-mix(in oklab, var(--primary) 18%, transparent)" strokeWidth="3" />
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke="var(--primary-glow)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={dash}
          style={{ transition: "stroke-dashoffset .15s linear" }}
        />
      </svg>
      <span style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        fontWeight: 600,
        color: "var(--foreground)",
        fontVariantNumeric: "tabular-nums",
      }}>
        {Math.round(pct)}%
      </span>
    </button>
  );
}