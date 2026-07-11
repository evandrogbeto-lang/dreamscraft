import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";

type Line = { text: string; color?: string };

const WELCOME: Line[] = [
  { text: "Welcome to DreamsCraft Code v2.0 — type 'help' to get started", color: "text-primary-glow" },
  { text: "" },
];

const COMMANDS: Record<string, () => Line[]> = {
  help: () => [
    { text: "Available commands:", color: "text-brand-amarelo" },
    { text: "  help       → list all available commands", color: "text-foreground" },
    { text: "  services   → our 4 core services", color: "text-foreground" },
    { text: "  portfolio  → projects with status", color: "text-foreground" },
    { text: "  pricing    → price ranges", color: "text-foreground" },
    { text: "  contact    → email and whatsapp", color: "text-foreground" },
    { text: "  stack      → technologies we use", color: "text-foreground" },
    { text: "  about      → meet the team", color: "text-foreground" },
    { text: "  clear      → clear the terminal", color: "text-foreground" },
  ],
  services: () => [
    { text: "✓ Services loaded", color: "text-brand-amarelo" },
    { text: "01 Apps mobile        — React Native, iOS & Android nativos", color: "text-brand-amarelo" },
    { text: "02 Sistemas web       — SaaS, dashboards, plataformas internas", color: "text-brand-amarelo" },
    { text: "03 Automação com IA   — agentes, RAG, workflows inteligentes", color: "text-brand-amarelo" },
    { text: "04 Consultoria        — arquitetura, code review, mentoria", color: "text-brand-amarelo" },
  ],
  portfolio: () => [
    { text: "✓ Portfolio loaded (produtos próprios · nenhum cliente ainda)", color: "text-brand-amarelo" },
    { text: "● NutrIAprova              [em desenvolvimento]", color: "text-brand-amarelo" },
    { text: "● FYNK                     [em desenvolvimento]", color: "text-brand-amarelo" },
    { text: "● OURleads                 [em desenvolvimento]", color: "text-brand-amarelo" },
    { text: "○ Secretária Virtual IA    [em escopo]", color: "text-muted-foreground" },
  ],
  pricing: () => [
    { text: "✓ Pricing loaded", color: "text-brand-amarelo" },
    { text: "Landing page         R$ 3k  – R$ 8k", color: "text-brand-amarelo" },
    { text: "MVP web/mobile       R$ 15k – R$ 40k", color: "text-brand-amarelo" },
    { text: "Produto completo     R$ 40k – R$ 120k+", color: "text-brand-amarelo" },
    { text: "Retainer mensal      a partir de R$ 6k/mês", color: "text-brand-amarelo" },
  ],
  contact: () => [
    { text: "✓ Contact info", color: "text-brand-amarelo" },
    { text: "email:    contato@dreamscraftcode.com.br", color: "text-brand-amarelo" },
    { text: "whatsapp: +55 61 99174-8651", color: "text-brand-amarelo" },
    { text: "Or run any of the above. We reply within 1 business day.", color: "text-foreground" },
  ],

  stack: () => [
    { text: "✓ Stack loaded", color: "text-brand-amarelo" },
    { text: "Frontend:  React, TanStack Start, TypeScript, Tailwind", color: "text-brand-amarelo" },
    { text: "Mobile:    React Native, Expo", color: "text-brand-amarelo" },
    { text: "Backend:   Node.js, Supabase, Postgres, Edge Functions", color: "text-brand-amarelo" },
    { text: "AI:        OpenAI, Gemini, RAG, agentes customizados", color: "text-brand-amarelo" },
    { text: "DevOps:    Cloudflare, Vercel, GitHub Actions", color: "text-brand-amarelo" },
  ],
  about: () => [
    { text: "✓ Team loaded", color: "text-brand-amarelo" },
    { text: "Gabrielle  — backend, arquitetura & negócios", color: "text-brand-amarelo" },
    { text: "Evandro    — frontend, automação & relacionamento", color: "text-brand-amarelo" },
    { text: "Pequeno time, contato direto, zero camadas de gerência.", color: "text-foreground" },
  ],
};

export function CodeTerminal() {
  const [history, setHistory] = useState<Line[]>(WELCOME);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const runCommand = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const prompt: Line = { text: `visitor@dreamscraft:~$ ${raw}`, color: "text-primary-glow" };

    if (cmd === "") {
      setHistory((h) => [...h, prompt]);
      return;
    }

    setCmdHistory((h) => [...h, raw]);
    setHistoryIdx(-1);

    if (cmd === "clear") {
      setHistory(WELCOME);
      return;
    }

    const handler = COMMANDS[cmd];
    const output: Line[] = handler
      ? handler()
      : [{ text: `command not found: ${cmd}. Type 'help' for available commands`, color: "text-brand-rosa" }];

    setHistory((h) => [...h, prompt, ...output, { text: "" }]);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const next = historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(next);
      setInput(cmdHistory[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === -1) return;
      const next = historyIdx + 1;
      if (next >= cmdHistory.length) {
        setHistoryIdx(-1);
        setInput("");
      } else {
        setHistoryIdx(next);
        setInput(cmdHistory[next] ?? "");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="glass-card rounded-2xl overflow-hidden shadow-2xl"
      onClick={() => inputRef.current?.focus()}
    >
      {/* window chrome */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-primary/20 bg-background/60">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-rosa/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-amarelo/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-amarelo/70" />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          ~/dreamscraft/terminal
        </p>
        <span className="font-mono text-[10px] text-primary-glow flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-amarelo node-pulse" />
          live
        </span>
      </div>

      {/* terminal body */}
      <div
        ref={scrollRef}
        className="font-mono text-[12.5px] leading-relaxed p-5 sm:p-6 h-[420px] overflow-y-auto cursor-text"
      >
        {history.map((l, i) => (
          <div key={i} className={l.color ?? "text-foreground"}>
            {l.text || "\u00A0"}
          </div>
        ))}

        {/* live prompt */}
        <div className="flex items-center text-primary-glow">
          <span className="select-none">visitor@dreamscraft:~$&nbsp;</span>
          <span className="text-foreground whitespace-pre">{input}</span>
          <span className="inline-block w-2 h-4 bg-primary-glow ml-0.5 animate-pulse" />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            aria-label="terminal input"
            className="absolute opacity-0 -z-10 w-px h-px"
          />
        </div>
      </div>
    </motion.div>
  );
}
