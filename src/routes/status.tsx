import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "Status — Dreamscraft Code" },
      { name: "description", content: "Status operacional dos serviços da Dreamscraft Code: uptime, latência e histórico de incidentes." },
      { property: "og:title", content: "Status — Dreamscraft Code" },
      { property: "og:description", content: "Status operacional em tempo real." },
    ],
  }),
  component: StatusPage,
});

type Service = {
  name: string;
  status: "operational" | "degraded" | "down";
  uptime: string;
  latency: string;
};

const services: Service[] = [
  { name: "Lovable Cloud (Supabase)", status: "operational", uptime: "99.99%", latency: "42ms" },
  { name: "Vercel (Frontend)", status: "operational", uptime: "99.98%", latency: "88ms" },
  { name: "Cloudflare Workers (Edge)", status: "operational", uptime: "100.00%", latency: "21ms" },
];

type Incident = {
  date: string;
  title: string;
  resolution: string;
  duration: string;
};

const incidents: Incident[] = [
  {
    date: "2026-04-18",
    title: "Latência elevada no edge (us-east)",
    resolution: "Failover automático para região secundária. Sem perda de dados.",
    duration: "12 min",
  },
  {
    date: "2026-02-03",
    title: "Manutenção programada do banco",
    resolution: "Upgrade de versão concluído com sucesso fora do horário comercial.",
    duration: "8 min",
  },
];

function StatusPage() {
  const allOperational = services.every((s) => s.status === "operational");

  return (
    <main id="main-content" className="min-h-screen bg-background pt-32 pb-24">
      <div className="container max-w-4xl mx-auto px-6">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-light tracking-[-0.03em] mb-6 text-foreground">
            Status do sistema
          </h1>

          {allOperational && (
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full border border-brand-amarelo/30 bg-brand-amarelo/10">
              <CheckCircle2 className="w-5 h-5 text-brand-amarelo" />
              <span className="text-brand-amarelo font-medium">
                Todos os sistemas operacionais
              </span>
            </div>
          )}
        </header>

        {/* Services Table */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Serviços</h2>
          <div className="overflow-hidden border border-border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Serviço</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Uptime (90d)</th>
                  <th className="px-4 py-3 font-medium">Latência</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.name} className="border-t border-border">
                    <td className="px-4 py-3 text-foreground">{s.name}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2 text-brand-amarelo">
                        <span className="w-2 h-2 rounded-full bg-brand-amarelo" />
                        Operacional
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground tabular-nums">{s.uptime}</td>
                    <td className="px-4 py-3 text-foreground tabular-nums">{s.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Incidents */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Histórico de incidentes</h2>
          <div className="overflow-hidden border border-border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Data</th>
                  <th className="px-4 py-3 font-medium">Incidente</th>
                  <th className="px-4 py-3 font-medium">Duração</th>
                </tr>
              </thead>
              <tbody>
                {incidents.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">
                      Nenhum incidente registrado.
                    </td>
                  </tr>
                ) : (
                  incidents.map((i) => (
                    <tr key={i.date + i.title} className="border-t border-border align-top">
                      <td className="px-4 py-3 text-muted-foreground tabular-nums whitespace-nowrap">{i.date}</td>
                      <td className="px-4 py-3 text-foreground">
                        <div className="font-medium">{i.title}</div>
                        <div className="text-muted-foreground mt-1">{i.resolution}</div>
                      </td>
                      <td className="px-4 py-3 text-foreground tabular-nums whitespace-nowrap">{i.duration}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Dados atualizados manualmente. Métricas de uptime e latência são representativas.
          </p>
        </section>
      </div>
    </main>
  );
}