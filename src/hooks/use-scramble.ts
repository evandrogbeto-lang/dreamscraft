import { useCallback, useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789/_-$#";

export function useScramble(target: string) {
  const [text, setText] = useState(target);
  const raf = useRef<number | null>(null);

  useEffect(() => setText(target), [target]);
  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  const start = useCallback(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let iter = 0;
    let last = performance.now();
    const total = target.length;
    const step = (now: number) => {
      if (now - last >= 40) {
        last = now;
        iter += 1;
        const revealed = Math.min(total, Math.floor(iter / 2));
        let out = "";
        for (let i = 0; i < total; i++) {
          if (i < revealed) out += target[i];
          else if (target[i] === " ") out += " ";
          else out += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        setText(out);
        if (revealed >= total) { setText(target); return; }
      }
      raf.current = requestAnimationFrame(step);
    };
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(step);
  }, [target]);

  const stop = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    setText(target);
  }, [target]);

  return { text, start, stop };
}