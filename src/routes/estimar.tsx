import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { DiagnosticFlow } from "@/components/diagnostic/diagnostic-flow";
import { useDiagnosticSession } from "@/components/diagnostic/use-diagnostic-session";
import { parseDiagnosticCategory } from "@/lib/diagnostic-context";
import { prepareLegacyUrlCleanup } from "@/lib/diagnostic/storage";

export const Route = createFileRoute("/estimar")({
  validateSearch: (search: Record<string, unknown>) => {
    const categoria = parseDiagnosticCategory(search.categoria);
    const descricao =
      typeof search.descricao === "string" && search.descricao.trim()
        ? search.descricao.slice(0, 480)
        : undefined;
    return {
      ...(categoria ? { categoria } : {}),
      ...(descricao ? { descricao } : {}),
    };
  },
  head: () => {
    const title = "Diagnóstico inicial | Dreamscraft";
    const description =
      "Organize o contexto do seu cenário operacional: entendimento, perguntas de negócio e uma direção possível — sem stack, preço ou prazo automáticos.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: EstimarPage,
});

function EstimarPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/estimar" });
  const flow = useDiagnosticSession(search);

  // Remove relato da querystring assim que migrar (Router + history).
  useEffect(() => {
    if (!search.descricao && !search.categoria) return;
    const href = typeof window !== "undefined" ? window.location.href : "/estimar";
    const prepared = prepareLegacyUrlCleanup({
      href,
      search: { descricao: search.descricao, categoria: search.categoria },
    });
    if (!prepared.shouldReplaceUrl) return;
    void navigate({
      to: "/estimar",
      search: {},
      replace: true,
    });
    if (typeof window !== "undefined" && prepared.cleanHref) {
      window.history.replaceState(null, "", prepared.cleanHref);
    }
  }, [navigate, search.categoria, search.descricao]);

  return <DiagnosticFlow {...flow} />;
}
