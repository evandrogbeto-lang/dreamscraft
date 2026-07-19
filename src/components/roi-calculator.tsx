import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  BrandPictogram,
  type PictogramName,
} from "@/components/brand-pictogram";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

/** Custo manual da tarefa — só o que sai dos inputs do usuário. Sem economia/payback inventados. */
export function RoiCalculator() {
  const [horas, setHoras] = useState(10);
  const [pessoas, setPessoas] = useState(2);
  const [custoHora, setCustoHora] = useState(25);

  const { custoMensal, custoAnual } = useMemo(() => {
    const semanasMes = 4.33;
    const custoMensal = horas * pessoas * custoHora * semanasMes;
    return { custoMensal, custoAnual: custoMensal * 12 };
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
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-azul/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand-rosa/20 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <BrandPictogram name="grafico" color="azul" size={28} />
            <p className="text-[11px] uppercase tracking-[0.3em] text-brand-azul font-mono">
              // custo.tarefa
            </p>
          </div>
          <h2 className="mt-5 text-3xl sm:text-4xl font-bold text-soft-glow">
            Quanto custa essa tarefa hoje?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Coloque as horas, as pessoas e o custo/hora. O número abaixo é só a conta
            do processo manual — sem promessa de economia. A Dreamscraft conversa
            com você sobre o que automatizar a partir daí.
          </p>

          <div className="mt-10 grid lg:grid-cols-2 gap-10">
            <div className="space-y-8">
              <Field
                icon="offline"
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
                icon="usuario"
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
                    <BrandPictogram name="moeda" color="azul" size={16} />
                    Custo/hora médio (R$)
                  </div>
                  <span className="font-mono text-sm text-brand-azul">
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

            <div className="space-y-4">
              <ResultCard
                tone="primary"
                icon="moeda"
                label="Custo mensal estimado"
                value={brl.format(custoMensal)}
                hint={`${horas}h × ${pessoas} × ${brl.format(custoHora)} × 4,33 semanas`}
              />
              <ResultCard
                tone="glow"
                icon="grafico"
                label="Custo anual estimado"
                value={brl.format(custoAnual)}
                hint="12 × o custo mensal acima"
              />

              <Link
                to="/contato"
                className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition glow-ring font-mono uppercase tracking-wider"
              >
                Vamos conversar sobre automatizar isso <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Field({
  icon,
  label,
  value,
  children,
}: {
  icon: PictogramName;
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <BrandPictogram name={icon} color="azul" size={16} />
          {label}
        </div>
        <span className="font-mono text-sm text-brand-azul">{value}</span>
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
  icon,
}: {
  tone: "muted" | "primary" | "glow";
  label: string;
  value: string;
  hint?: string;
  icon?: PictogramName;
}) {
  const styles = {
    muted: "border-border/50 bg-background/40",
    primary: "border-brand-azul/40 bg-brand-azul/10",
    glow: "border-brand-rosa/40 bg-gradient-to-br from-brand-rosa/10 to-brand-azul/10",
  }[tone];

  return (
    <motion.div
      layout
      className={`rounded-2xl border ${styles} backdrop-blur p-5`}
    >
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-mono text-muted-foreground">
        {icon && <BrandPictogram name={icon} color="azul" size={14} />}
        {label}
      </div>
      <p className="mt-2 text-2xl sm:text-3xl font-bold text-soft-glow font-mono">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </motion.div>
  );
}
