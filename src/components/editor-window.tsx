import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type EditorWindowProps = {
  /** Rótulo estilo nome de arquivo (ex: `visao.md`, `$ products/slug`). */
  filename: string;
  children: ReactNode;
  /** Coluna fina de números de linha — decorativa; o conteúdo continua prosa. */
  showLineNumbers?: boolean;
  /** Quantidade de linhas no gutter (só com `showLineNumbers`). */
  lineCount?: number;
  className?: string;
  /** Classes do corpo (use `p-0` quando o filho já tem padding próprio). */
  contentClassName?: string;
  as?: "div" | "article" | "section";
};

/**
 * Moldura “janela de editor” da marca: chrome com bolinhas + filename,
 * borda rosa suave, hover com brilho. Só a moldura — conteúdo legível.
 */
export function EditorWindow({
  filename,
  children,
  showLineNumbers = false,
  lineCount = 8,
  className,
  contentClassName,
  as: Comp = "div",
}: EditorWindowProps) {
  const Tag = Comp as ElementType;
  const lines = Array.from({ length: Math.max(1, lineCount) }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );

  return (
    <Tag
      className={cn(
        "group/editor overflow-hidden rounded-lg border border-brand-rosa/30 bg-surface",
        "transition-[border-color,box-shadow] duration-300 ease-out",
        "hover:border-brand-rosa/50 hover:shadow-[0_0_40px_-12px_color-mix(in_oklab,var(--color-brand-rosa)_45%,transparent)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-brand-rosa/20 bg-surface-elevated/80 px-4 py-2 font-mono text-[10px] text-muted-foreground sm:text-[11px]">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-rosa/80"
          aria-hidden
        />
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-amarelo/80"
          aria-hidden
        />
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-azul/80"
          aria-hidden
        />
        <span className="ml-2 truncate text-primary-glow/90">{filename}</span>
      </div>

      <div className="flex min-w-0">
        {showLineNumbers ? (
          <div
            aria-hidden
            className="shrink-0 select-none border-r border-brand-rosa/15 bg-surface-elevated/40 px-2 py-4 text-right font-mono text-[10px] leading-6 text-muted-foreground/50"
          >
            {lines.map((n) => (
              <div key={n}>{n}</div>
            ))}
          </div>
        ) : null}

        <div className={cn("min-w-0 flex-1 p-5 md:p-6", contentClassName)}>
          {children}
        </div>
      </div>
    </Tag>
  );
}
