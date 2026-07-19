import { createFileRoute } from "@tanstack/react-router";
import { BrandPictogram } from "@/components/brand-pictogram";
import { CodeRainBackground } from "@/components/code-rain-background";

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "Status — Dreamscraft Code" },
      {
        name: "description",
        content:
          "Onde o site da Dreamscraft Code roda hoje e como falamos de incidentes — sem métrica inventada.",
      },
      { property: "og:title", content: "Status — Dreamscraft Code" },
      {
        property: "og:description",
        content:
          "Infra deste site e política de transparência operacional.",
      },
    ],
  }),
  component: StatusPage,
});

type Service = {
  name: string;
  role: string;
  note: string;
};

/** Só o que de fato sustenta este site — sem uptime/% inventados. */
const services: Service[] = [
  {
    name: "Cloudflare Workers",
    role: "Edge / frontend",
    note: "Deploy e entrega deste site.",
  },
  {
    name: "Supabase",
    role: "Auth · Postgres · storage",
    note: "Leads, admin e dados do site.",
  },
  {
    name: "Domínio dreamscraftcode.com",
    role: "DNS",
    note: "Aponta para a stack acima.",
  },
];

function StatusPage() {
  return (
    <main id="main-content" className="relative min-h-screen bg-background pt-32 pb-24 overflow-hidden">
      <CodeRainBackground seed={15} palette="azul" className="opacity-25" />
      <div className="relative container max-w-4xl mx-auto px-6">
        <header className="mb-12">
          <p className="text-sm font-mono text-brand-azul mb-3">// status</p>
          <h1 className="text-4xl md:text-5xl font-display font-light tracking-[-0.03em] mb-6 text-foreground">
            Status do sistema
          </h1>

          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full border border-brand-amarelo/30 bg-brand-amarelo/10">
            <BrandPictogram name="cadeado" color="amarelo" size={18} />
            <span className="text-brand-amarelo font-medium font-mono text-sm">
              site no ar · monitoramento manual por enquanto
            </span>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
            Ainda não temos painel de uptime público automatizado. Quando houver
            incidente relevante neste site, publicamos aqui — sem inventar número.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-4 text-foreground font-mono text-brand-azul">
            // o que sustenta este site
          </h2>
          <div className="overflow-hidden border border-border rounded-2xl bg-surface/50">
            <table className="w-full text-sm">
              <thead className="bg-surface-elevated/60">
                <tr className="text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium font-mono text-xs uppercase tracking-wider">
                    Serviço
                  </th>
                  <th className="px-4 py-3 font-medium font-mono text-xs uppercase tracking-wider">
                    Papel
                  </th>
                  <th className="px-4 py-3 font-medium font-mono text-xs uppercase tracking-wider">
                    Nota
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.name} className="border-t border-border">
                    <td className="px-4 py-3 text-foreground font-medium">{s.name}</td>
                    <td className="px-4 py-3 text-brand-azul font-mono text-xs">
                      {s.role}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{s.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground font-mono text-brand-rosa">
            // histórico de incidentes
          </h2>
          <div className="rounded-2xl border border-border bg-surface/50 px-6 py-10 text-center">
            <p className="text-muted-foreground text-sm">
              Nenhum incidente publicado ainda.
            </p>
            <p className="mt-2 text-xs text-muted-foreground/80 font-mono">
              // quando houver, a descrição e a duração vão aparecer aqui
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
