import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const STORAGE_KEY = "dreamscraft-lgpd-consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const accepted = localStorage.getItem(STORAGE_KEY);
      if (!accepted) {
        // pequeno delay para não aparecer instantaneamente no load
        const t = setTimeout(() => setVisible(true), 800);
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage pode estar indisponível em alguns contextos
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // noop
    }
    setDismissed(true);
    setTimeout(() => setVisible(false), 400);
  };

  if (!visible) return null;

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-[9999]
        transition-all duration-500 ease-out
        ${dismissed ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"}
      `}
    >
      <div className="border-t border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-5 sm:px-6 lg:px-8">
          <p className="text-sm leading-relaxed text-muted-foreground sm:max-w-2xl">
            Usamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa{" "}
            <Link
              to="/privacidade"
              className="underline underline-offset-2 transition-colors hover:text-foreground"
            >
              Política de Privacidade
            </Link>
            .
          </p>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
            <Link
              to="/privacidade"
              className="inline-flex items-center justify-center rounded-md border border-input bg-transparent px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent sm:py-2"
            >
              Saiba mais
            </Link>
            <button
              onClick={handleAccept}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:brightness-110 sm:py-2"
            >
              Aceitar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
