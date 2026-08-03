import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * TEMPORARY:
 * A página completa /processo ainda não foi implementada (próxima fase).
 * Header aponta temporariamente para /#processo na Home.
 * Esta rota permanece e redireciona para a âncora até a página real existir.
 * Será substituída na fase de páginas essenciais — não inventar conteúdo aqui.
 */
export const Route = createFileRoute("/processo")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "processo" });
  },
});
