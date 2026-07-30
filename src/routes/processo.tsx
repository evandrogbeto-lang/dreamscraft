import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * TEMPORARY (Fase 1 — Fundação):
 * A página /processo ainda não foi implementada (fase de páginas essenciais).
 * Não há conteúdo fictício aqui: o link do Header/Footer aponta para esta rota
 * e redireciona para a Home até a página real existir — evita 404.
 */
export const Route = createFileRoute("/processo")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
