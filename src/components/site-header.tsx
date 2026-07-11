import { Link, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { useScramble } from "@/hooks/use-scramble";
import { DreamscraftLogo } from "@/components/dreamscraft-logo";

const nav = [
  { to: "/", label: "Home" },
  { to: "/solucoes", label: "Soluções" },
  { to: "/precos", label: "Preços" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/sobre", label: "Sobre" },
  { to: "/blog", label: "Blog" },
  { to: "/manifesto", label: "Manifesto", highlight: true },
  { to: "/contato", label: "Contato" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { location } = useRouterState();
  const reduce = useReducedMotion();
  const menuId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Esc to close + lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  const navItems = useMemo(() => nav, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled || open
          ? "backdrop-blur-2xl bg-background/65 border-b border-primary/20 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]"
          : "backdrop-blur-md bg-background/30 border-b border-transparent"
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Pular para conteúdo
      </a>

      <div
        className="mx-auto max-w-7xl px-6 flex items-center justify-between transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ height: scrolled ? "3.5rem" : "4.25rem" }}
      >
        <Link
          to="/"
          aria-label="Dreamscraft Code — Home"
          className="group flex items-center gap-2.5 font-display font-semibold text-lg tracking-tight rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <DreamscraftLogo variant="dark" />
        </Link>

        <nav className="hidden md:flex items-center gap-0.5" aria-label="Navegação principal">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            const highlight = "highlight" in item && item.highlight;
            return (
              <ScrambleNavLink
                key={item.to}
                to={item.to}
                label={item.label}
                active={active}
                highlight={Boolean(highlight)}
              />
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link
            to="/contato"
            className="btn-glow inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Solicitar orçamento
          </Link>
        </div>

        <button
          type="button"
          onClick={toggle}
          className="md:hidden p-2 rounded-md text-foreground hover:bg-primary/10 transition-colors min-h-11 min-w-11 inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls={menuId}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu — backdrop + animated panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
              aria-hidden="true"
              className="md:hidden fixed inset-x-0 top-[3.5rem] bottom-0 z-40 bg-background/40 backdrop-blur-sm"
            />
            <motion.div
              key="panel"
              id={menuId}
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden relative z-50 border-t border-primary/15 bg-background/85 backdrop-blur-2xl shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]"
            >
              <nav
                aria-label="Navegação principal (mobile)"
                className="px-6 py-4 flex flex-col gap-0.5"
              >
                {navItems.map((item) => {
                  const active = location.pathname === item.to;
                  const highlight = "highlight" in item && item.highlight;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={`min-h-11 px-3 py-2.5 rounded-md text-sm inline-flex items-center gap-1.5 transition-colors active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        active
                          ? "bg-primary/10 text-foreground"
                          : highlight
                            ? "text-primary-glow hover:bg-primary/10"
                            : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                      }`}
                    >
                      {item.label}
                      {highlight && (
                        <span aria-hidden="true" className="text-[10px] text-primary-glow animate-pulse">
                          ✦
                        </span>
                      )}
                    </Link>
                  );
                })}
                <Link
                  to="/contato"
                  onClick={close}
                  className="btn-glow mt-3 min-h-11 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Solicitar orçamento
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function ScrambleNavLink({
  to,
  label,
  active,
  highlight,
}: {
  to: string;
  label: string;
  active: boolean;
  highlight: boolean;
}) {
  const { text, start, stop } = useScramble(label);
  return (
    <Link
      to={to as never}
      data-active={active}
      aria-current={active ? "page" : undefined}
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
      className={`nav-underline px-3 py-2 text-[13px] rounded-md inline-flex items-center gap-1.5 transition-colors duration-300 ${
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      } ${highlight ? "text-primary-glow hover:text-primary-glow" : ""}`}
    >
      <span className="font-mono tracking-tight tabular-nums">{text}</span>
      {highlight && (
        <span aria-hidden="true" className="text-[10px] text-primary-glow animate-pulse">
          ✦
        </span>
      )}
    </Link>
  );
}
