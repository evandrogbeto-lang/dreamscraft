import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Clock, Users, DollarSign, TrendingDown, Calendar, ArrowRight, Zap } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});
const num = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

// Investimento médio de uma automação DreamsCraft (faixa base)
const INVESTIMENTO_BASE = 15000;
const REDUCAO = 0.8;

export function RoiCalculator() {
  const [horas, setHoras] = useState(10);
  const [pessoas, setPessoas] = useState(2);
  const [custoHora, setCustoHora] = useState(25);

  const { custoMensal, economiaMensal, custoComAutomacao, paybackMeses } = useMemo(() => {
    const semanasMes = 4.33;
    const custoMensal = horas * pessoas * custoHora * semanasMes;
    const economiaMensal = custoMensal * REDUCAO;
    const custoComAutomacao = custoMensal - economiaMensal;
    const paybackMeses = economiaMensal > 0 ? INVESTIMENTO_BASE / economiaMensal : 0;
    return { custoMensal, economiaMensal, custoComAutomacao, paybackMeses };
  }, [horas, pessoas, custoHora]);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="glass-card rounded-3xl p-8 lg:p-12 relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary-glow/20 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/15 border border-primary/30 p-2.5">
              <Zap className="h-5 w-5 text-primary-glow" />
            </div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-primary-glow font-mono">
              // roi.calculator
            </p>
          </div>
          <h2 className="mt-5 text-3xl sm:text-4xl font-bold text-soft-glow">
            Quanto você economiza automatizando?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Simule o custo real de uma tarefa repetitiva no seu time e veja o retorno
            de uma automação sob medida da Dreamscraft.
          </p>

          <div className="mt-10 grid lg:grid-cols-2 gap-10">
            {/* INPUTS */}
            <div className="space-y-8">
              <Field
                icon={Clock}
                label="Horas/semana gastas na tarefa"
                value={`${horas}h`}
              >
                <Slider
                  min={1}
                  max={40}
                  step={1}
                  value={[horas]}
                  onValueChange={(v) => setHoras(v[0])}
                />
                <Range left="1h" right="40h" />
              </Field>

              <Field
                icon={Users}
                label="Quantas pessoas executam"
                value={`${pessoas} ${pessoas === 1 ? "pessoa" : "pessoas"}`}
              >
                <Slider
                  min={1}
                  max={20}
                  step={1}
                  value={[pessoas]}
                  onValueChange={(v) => setPessoas(v[0])}
                />
                <Range left="1" right="20" />
              </Field>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <DollarSign className="h-4 w-4 text-primary-glow" />
                    Custo/hora médio (R$)
                  </div>
                  <span className="font-mono text-sm text-primary-glow">
                    {brl.format(custoHora)}
                  </span>
                </div>
                <Input
                  type="number"
                  min={1}
                  value={custoHora}
                  onChange={(e) => setCustoHora(Math.max(1, Number(e.target.value) || 0))}
                  className="bg-background/40 border-primary/30 font-mono"
                />
              </div>
            </div>

            {/* RESULTADOS */}
            <div className="space-y-4">
              <ResultCard
                tone="muted"
                label="Custo mensal atual"
                value={brl.format(custoMensal)}
                hint={`${horas}h × ${pessoas} × ${brl.format(custoHora)} × 4,33 semanas`}
              />
              <ResultCard
                tone="primary"
                icon={TrendingDown}
                label="Com automação DreamsCraft (–80%)"
                value={`Economiza ${brl.format(economiaMensal)}/mês`}
                hint={`Custo residual estimado: ${brl.format(custoComAutomacao)}/mês`}
              />
              <ResultCard
                tone="glow"
                icon={Calendar}
                label="Retorno do investimento em"
                value={
                  paybackMeses > 0
                    ? `${num.format(paybackMeses)} ${paybackMeses <= 1.05 ? "mês" : "meses"}`
                    : "—"
                }
                hint={`Baseado em investimento médio de ${brl.format(INVESTIMENTO_BASE)}`}
              />

              <Link
                to="/contato"
                className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition glow-ring font-mono uppercase tracking-wider"
              >
                Automatizar esse processo <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Icon className="h-4 w-4 text-primary-glow" />
          {label}
        </div>
        <span className="font-mono text-sm text-primary-glow">{value}</span>
      </div>
      {children}
    </div>
  );
}

function Range({ left, right }: { left: string; right: string }) {
  return (
    <div className="mt-2 flex justify-between text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}

function ResultCard({
  tone,
  label,
  value,
  hint,
  icon: Icon,
}: {
  tone: "muted" | "primary" | "glow";
  label: string;
  value: string;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const styles = {
    muted: "border-border/50 bg-background/40",
    primary: "border-primary/40 bg-primary/10",
    glow: "border-primary-glow/50 bg-gradient-to-br from-primary/15 to-primary-glow/10",
  }[tone];

  return (
    <motion.div
      layout
      className={`rounded-2xl border ${styles} backdrop-blur p-5`}
    >
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-mono text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5 text-primary-glow" />}
        {label}
      </div>
      <p className="mt-2 text-2xl sm:text-3xl font-bold text-soft-glow font-mono">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </motion.div>
  );
}
