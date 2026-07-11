import { MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "@tanstack/react-router";

const PHONE = "5561991748651";

const MESSAGES: Record<string, string> = {
  "/": "Olá! Quero saber sobre desenvolvimento de software",
  "/precos": "Olá! Quero entender melhor os preços",
  "/portfolio": "Olá! Vi o portfolio e quero conversar sobre meu projeto",
};

const DEFAULT_MESSAGE = "Olá! Quero conversar com a DreamsCraftCode";

function getMessage(pathname: string) {
  return MESSAGES[pathname] ?? DEFAULT_MESSAGE;
}

export function WhatsAppButton() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (visible) return;

    const checkScroll = () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && scrolled / max >= 0.4) {
        setVisible(true);
      }
    };

    const timer = window.setTimeout(() => setVisible(true), 30_000);
    window.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", checkScroll);
    };
  }, [visible]);

  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(getMessage(pathname))}`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.3, y: 40 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring", stiffness: 260, damping: 14 },
          }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3"
        >
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="glass-card flex items-center gap-3 rounded-2xl border border-border/60 bg-background/90 px-4 py-3 shadow-xl backdrop-blur"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-amarelo to-brand-amarelo font-mono text-sm font-bold text-white">
                  c/
                </div>
                <div className="pr-1">
                  <p className="text-sm font-medium leading-tight text-foreground">
                    Respondemos em minutos
                  </p>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-xs text-brand-amarelo hover:underline"
                  >
                    Iniciar conversa →
                  </a>
                </div>
                <button
                  onClick={() => setExpanded(false)}
                  aria-label="Fechar"
                  className="ml-1 rounded-full p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <span className="absolute inset-0 -z-10 rounded-full bg-[#25D366] opacity-30 animate-ping" />
            {expanded ? (
              <a
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Falar no WhatsApp"
                className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 transition-transform hover:scale-105 active:scale-95"
              >
                <MessageCircle className="h-6 w-6" />
              </a>
            ) : (
              <button
                onClick={() => setExpanded(true)}
                aria-label="Abrir WhatsApp"
                className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 transition-transform hover:scale-105 active:scale-95"
              >
                <MessageCircle className="h-6 w-6" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
