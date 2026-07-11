import { cn } from "@/lib/utils";
import logoBranco from "@/assets/logo-branco.png";
import logoRoxo from "@/assets/logo-roxo.png";

type Variant = "dark" | "light";

interface DreamscraftLogoProps {
  variant?: Variant;
  className?: string;
  /** Tailwind height class, e.g. "h-8" / "h-9". Width auto. */
  symbolClassName?: string;
  /** @deprecated mantido para compatibilidade — usar symbolClassName para definir altura */
  wordmarkClassName?: string;
}

/**
 * Logo oficial Dreamscraft.code — arte vetorial fornecida pelo brand guide.
 * - variant="dark": LOGO_BRANCO (wordmark lavanda + ícone) para fundos escuros.
 * - variant="light": LOGO_ROXO para fundos claros.
 */
export function DreamscraftLogo({
  variant = "dark",
  className,
  symbolClassName = "h-8",
}: DreamscraftLogoProps) {
  const src = variant === "dark" ? logoBranco : logoRoxo;
  return (
    <img
      src={src}
      alt="Dreamscraft.code"
      className={cn("w-auto select-none", symbolClassName, className)}
      draggable={false}
    />
  );
}
