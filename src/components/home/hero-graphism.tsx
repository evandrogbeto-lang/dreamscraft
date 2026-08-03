import { CodeRainBackground } from "@/components/code-rain-background";

type HeroGraphismProps = {
  /** desktop: sangramento superior direito; strip: faixa curta no mobile */
  variant?: "desktop" | "strip";
  className?: string;
};

/**
 * Assinatura visual do hero — reutiliza o grafismo oficial de chuva de colunas
 * (`CodeRainBackground`), o mesmo usado em Projetos e Sobre.
 * Não redesenha barras em CSS ad-hoc.
 */
export function HeroGraphism({ variant = "desktop", className = "" }: HeroGraphismProps) {
  if (variant === "strip") {
    return (
      <div
        className={`relative h-12 overflow-hidden max-[359px]:hidden sm:h-14 ${className}`}
        aria-hidden="true"
      >
        <CodeRainBackground
          seed={21}
          count={32}
          palette="rosa-azul"
          className="opacity-75 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]"
        />
      </div>
    );
  }

  return (
    <div
      className={`pointer-events-none absolute -right-6 -top-6 bottom-[38%] left-[42%] z-0 overflow-hidden max-lg:hidden xl:left-[46%] ${className}`}
      aria-hidden="true"
    >
      <CodeRainBackground
        seed={21}
        count={42}
        palette="rosa-azul"
        className="opacity-90 [mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)]"
      />
    </div>
  );
}
