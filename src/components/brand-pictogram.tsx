import { cn } from "@/lib/utils";

export type PictogramName =
  | "cadeado"
  | "celular"
  | "dinheiro"
  | "documento"
  | "grafico"
  | "home"
  | "link"
  | "lupa"
  | "moeda"
  | "offline"
  | "porcentagem"
  | "seta"
  | "tabela"
  | "usuario";

/** Cor do asset PNG — bate com as pastas em public/brand/pictograms/ */
export type PictogramColor = "rosa" | "azul" | "amarelo" | "roxo";

type BrandPictogramProps = {
  name: PictogramName;
  color?: PictogramColor;
  /** Tamanho em px (lado). Default 24. */
  size?: number;
  className?: string;
  alt?: string;
};

export function pictogramSrc(name: PictogramName, color: PictogramColor = "rosa") {
  return `/brand/pictograms/${color}/${name}.png`;
}

/**
 * Pictograma oficial Dreamscraft.Code (PNG @4x por cor).
 * Sem caixa de gradiente — só o glifo, fino e monocromático via asset.
 */
export function BrandPictogram({
  name,
  color = "rosa",
  size = 24,
  className,
  alt = "",
}: BrandPictogramProps) {
  return (
    <img
      src={pictogramSrc(name, color)}
      width={size}
      height={size}
      alt={alt}
      draggable={false}
      className={cn("inline-block select-none object-contain", className)}
      style={{ width: size, height: size }}
    />
  );
}
