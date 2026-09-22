import { Link, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { DreamscraftLogo } from "@/components/dreamscraft-logo";

type NavItem =
  | { kind: "route"; to: "/solucoes" | "/portfolio" | "/sobre"; label: string }
  | { kind: "hash"; to: "/"; hash: string; label: string };

const nav: NavItem[] = [
  { kind: "route", to: "/solucoes", label: "Soluções" },
  { kind: "route", to: "/portfolio", label: "Projetos" },
  { kind: "hash", to: "/", hash: "processo", label: "Processo" },
  { kind: "route", to: "/sobre", label: "Sobre" },
];

/**
 * Rotas que já possuem CTA local de diagnóstico
 * devem esconder o CTA equivalente do header
 * para evitar duplicação de ação.
 */
const routesWithLocalDiagnosticCta = new Set([
  "/estimar",
  "/contato",
  "/solucoes",
]);

function navKey(item: NavItem) {
  return item.kind === "hash" ? `${item.to}#${item.hash}` : item.to;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { location } = useRouterState();
  const reduce = useReducedMotion();
  const menuId = useId();
  const showDiagnosticCta = !routesWithLocalDiagnosticCta.has(location.pathname);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

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

  const isActive = (item: NavItem) => {
    if (item.kind === "hash") {
      return location.pathname === "/" && location.hash.replace(/^#/, "") === item.hash;
    }
    return (
      location.pathname === item.to ||
      (item.to === "/portfolio" && location.pathname.startsWith("/portfolio"))
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 isolate transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-brand-branco/15 bg-background/95 backdrop-blur-md"
          : "border-b border-brand-branco/10 bg-background"
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-brand-branco focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-brand-roxo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa"
      >
        Pular para conteúdo
      </a>

      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:h-[4.25rem]">
        <Link
          to="/"
          aria-label="Dreamscraft Code — Home"
          className="relative z-10 flex min-h-11 min-w-11 shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <DreamscraftLogo mark className="lg:hidden" symbolClassName="h-8 w-auto" />
          <DreamscraftLogo variant="dark" className="hidden lg:block" symbolClassName="h-8" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
          {nav.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={navKey(item)}
                to={item.to}
                hash={item.kind === "hash" ? item.hash : undefined}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-3 py-2 text-[13px] tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  active ? "text-brand-branco" : "text-brand-branco/70 hover:text-brand-branco"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {showDiagnosticCta && (
            <Link
              to="/estimar"
              className="hidden min-h-11 items-center rounded-button bg-brand-branco px-4 py-2.5 text-sm font-medium tracking-tight text-brand-roxo transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:inline-flex"
            >
              Solicitar diagnóstico
            </Link>
          )}

          <button
            type="button"
            onClick={toggle}
            className="relative z-10 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-brand-branco/20 p-2 text-brand-branco transition-colors hover:bg-brand-branco/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls={menuId}
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0.01 : 0.2 }}
              onClick={close}
              aria-hidden="true"
              className="fixed inset-x-0 bottom-0 top-16 z-40 bg-brand-roxo/50 backdrop-blur-sm lg:hidden"
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
              transition={{ duration: reduce ? 0.01 : 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-50 border-t border-brand-branco/15 bg-background lg:hidden"
            >
              <nav
                aria-label="Navegação principal (mobile)"
                className="flex flex-col gap-0.5 px-4 py-4 sm:px-5"
              >
                {nav.map((item) => {
                  const active = isActive(item);
                  return (
                    <Link
                      key={navKey(item)}
                      to={item.to}
                      hash={item.kind === "hash" ? item.hash : undefined}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={`inline-flex min-h-11 items-center rounded-md px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        active
                          ? "bg-brand-branco/10 text-brand-branco"
                          : "text-brand-branco/75 hover:bg-brand-branco/5 hover:text-brand-branco"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                {showDiagnosticCta && (
                  <Link
                    to="/estimar"
                    onClick={close}
                    className="mt-3 inline-flex min-h-11 items-center justify-center rounded-button bg-brand-branco px-4 py-2.5 text-sm font-medium text-brand-roxo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    Solicitar diagnóstico
                  </Link>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
