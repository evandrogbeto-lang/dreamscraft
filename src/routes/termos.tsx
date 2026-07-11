import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — Dreamscraft Code" },
      {
        name: "description",
        content: "Termos de uso dos serviços e produtos desenvolvidos pela Dreamscraft Code.",
      },
    ],
  }),
  component: TermosPage,
});

function TermosPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-sm text-primary font-medium">Legal</p>
      <h1 className="mt-2 text-4xl sm:text-5xl font-light tracking-[-0.03em]">Termos de Uso</h1>
      <p className="mt-4 text-sm text-muted-foreground">Versão vigente — Dreamscraft Solutions</p>

      <Section title="1. Aceitação dos termos">
        <p>
          Ao acessar ou utilizar qualquer produto desenvolvido pela Dreamscraft Solutions (sites,
          aplicativos, sistemas, bots), você concorda com estes Termos de Uso e com a{" "}
          <Link to="/privacidade" className="text-primary hover:underline">
            Política de Privacidade
          </Link>
          .
        </p>
      </Section>

      <Section title="2. Cadastro e segurança">
        <p>
          Você é responsável pela veracidade dos dados fornecidos, pela confidencialidade da sua
          senha e por todas as atividades realizadas em sua conta. Notifique imediatamente qualquer
          uso não autorizado.
        </p>
      </Section>

      <Section title="3. Conduta proibida">
        <p>
          É proibido: violar leis; enviar conteúdo ilegal, ofensivo ou difamatório; praticar
          fraudes; tentar acessar dados de outros usuários; realizar engenharia reversa; usar bots
          automatizados para manipular o sistema.
        </p>
      </Section>

      <Section title="4. Propriedade intelectual">
        <p>
          Todo o código-fonte, design, marcas, logos e interfaces são propriedade da Dreamscraft
          Solutions ou de seus clientes (conforme contrato). É proibida a cópia, distribuição ou uso
          não autorizado.
        </p>
      </Section>

      <Section title="5. Pagamentos e comissões">
        <p>
          Quando aplicável, o usuário concorda com as taxas, comissões e condições de pagamento
          estabelecidas na plataforma. Valores podem ser alterados com aviso prévio de 30 dias.
        </p>
      </Section>

      <Section title="6. Disponibilidade do serviço">
        <p>
          Fazemos o máximo para garantir disponibilidade de 99,9%, mas não nos responsabilizamos por
          indisponibilidades decorrentes de manutenção emergencial, falhas de terceiros (internet,
          AWS, gateway), ataques cibernéticos ou casos de força maior.
        </p>
      </Section>

      <Section title="7. Suspensão e cancelamento">
        <p>
          A Dreamscraft pode suspender ou encerrar contas que violem estes Termos, sem prejuízo de
          medidas legais. O usuário pode cancelar sua conta a qualquer momento, perdendo o acesso a
          funcionalidades pagas.
        </p>
      </Section>

      <Section title="8. Limitação de responsabilidade">
        <p>
          A Dreamscraft não se responsabiliza por danos indiretos, lucros cessantes ou perda de
          dados decorrentes do uso da plataforma, exceto em casos de dolo ou culpa grave comprovada
          judicialmente. O valor máximo de indenização fica limitado ao valor pago pelo usuário nos
          últimos 6 meses.
        </p>
      </Section>

      <Section title="9. Legislação e foro">
        <p>
          Estes Termos são regidos pelas leis brasileiras. Fica eleito o foro da Comarca de
          Brasília/DF para resolver qualquer controvérsia.
        </p>
      </Section>

      <div className="mt-12 rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
        <p className="text-sm text-foreground">
          ✅ Ao utilizar nossos serviços, você declara ter lido, compreendido e aceitado a Política
          de Privacidade e os Termos de Uso.
        </p>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold border-l-2 border-primary pl-3">{title}</h2>
      <div className="mt-4 space-y-3 text-muted-foreground">{children}</div>
    </section>
  );
}
