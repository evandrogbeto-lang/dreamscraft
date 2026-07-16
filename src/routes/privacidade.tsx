import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Dreamscraft Code" },
      {
        name: "description",
        content:
          "Como a Dreamscraft Code coleta, usa e protege seus dados pessoais. Em conformidade com a LGPD.",
      },
    ],
  }),
  component: PrivacidadePage,
});

function PrivacidadePage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-20 prose-content">
      <p className="text-sm text-primary font-medium">Legal</p>
      <h1 className="mt-2 text-4xl sm:text-5xl font-light tracking-[-0.03em]">Política de Privacidade</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Versão 3.0 — em conformidade com a LGPD (Lei 13.709/2018)
      </p>

      <p className="mt-8 text-muted-foreground">
        A Dreamscraft Solutions valoriza sua privacidade. Esta Política explica como coletamos,
        usamos, armazenamos e protegemos seus dados pessoais quando você utiliza nossos sites,
        aplicativos, sistemas ou serviços.
      </p>

      <Section title="1. Definições importantes">
        <p><strong>Controlador:</strong> cliente (pessoa física ou jurídica contratante) que define finalidades e meios de tratamento.</p>
        <p><strong>Operador:</strong> Dreamscraft Solutions, que processa dados conforme instruções do controlador.</p>
        <p><strong>Titular:</strong> usuário final (cliente do seu negócio, caminhoneiro, prestador, etc).</p>
        <p><strong>Dados Pessoais:</strong> qualquer informação que identifique ou torne identificável uma pessoa natural.</p>
      </Section>

      <Section title="2. Dados coletados">
        <p>Conforme o projeto contratado, podemos coletar:</p>
        <ul>
          <li>Dados cadastrais: nome, CPF, e-mail, telefone, endereço</li>
          <li>Documentos de identificação: RG, CNH, comprovante de residência</li>
          <li>Dados profissionais: CNPJ, razão social, dados de veículo</li>
          <li>Dados de localização: GPS, geolocalização (mediante consentimento)</li>
          <li>Dados de pagamento: transações via gateway (não armazenamos cartão)</li>
          <li>Dados de navegação: IP, tipo de dispositivo, logs de acesso</li>
        </ul>
      </Section>

      <Section title="3. Finalidades do tratamento">
        <ul>
          <li>Execução do contrato e prestação dos serviços</li>
          <li>Autenticação e segurança de acesso</li>
          <li>Processamento de pagamentos e repasses</li>
          <li>Comunicação com usuários (notificações, suporte)</li>
          <li>Cumprimento de obrigações legais (LGPD, fiscal, judicial)</li>
          <li>Melhoria contínua e análise de uso (dados anonimizados)</li>
        </ul>
      </Section>

      <Section title="4. Compartilhamento de dados">
        <p>Podemos compartilhar dados pessoais com:</p>
        <ul>
          <li><strong>Parceiros e prestadores:</strong> hospedagem, gateway de pagamento, APIs de mapas, SMS/e-mail (sempre mediante contratos que garantam proteção de dados)</li>
          <li><strong>Autoridades judiciais ou regulatórias:</strong> quando exigido por lei</li>
          <li><strong>Sucessores legais:</strong> em caso de fusão, aquisição ou venda</li>
        </ul>
        <p><strong>A Dreamscraft NUNCA vende ou aluga dados pessoais.</strong></p>
      </Section>

      <Section title="5. Direitos dos titulares (LGPD)">
        <ul>
          <li>Confirmar a existência de tratamento</li>
          <li>Acessar seus dados pessoais</li>
          <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
          <li>Anonimizar, bloquear ou eliminar dados desnecessários</li>
          <li>Portabilidade para outro fornecedor (quando aplicável)</li>
          <li>Revogar consentimento a qualquer momento</li>
          <li>Opor-se a tratamento irregular</li>
        </ul>
        <p>
          Para exercer seus direitos:{" "}
          <a href="mailto:privacidade@dreamscraftcode.com" className="text-primary hover:underline">
            privacidade@dreamscraftcode.com
          </a>
          . Respondemos em até 15 dias.
        </p>
      </Section>

      <Section title="6. Segurança e armazenamento">
        <p>
          Adotamos criptografia em trânsito (TLS/SSL), criptografia em repouso, controle de acesso
          baseado em função, logs de acesso, backups criptografados e monitoramento 24/7. Dados
          armazenados no Brasil ou em países com nível de proteção equivalente.
        </p>
      </Section>

      <Section title="7. Retenção de dados">
        <p>
          Mantidos pelo tempo necessário para cumprir as finalidades ou por prazo legal (ex: 5 anos
          para obrigações fiscais). Ao final, são anonimizados ou excluídos de forma segura.
        </p>
      </Section>

      <Section title="8. Cookies">
        <p>
          Utilizamos cookies essenciais (necessários para navegação) e analíticos (Google Analytics
          anonimizado). Você pode desabilitá-los nas configurações do navegador.
        </p>
      </Section>

      <Section title="9. Canais de atendimento (DPO)">
        <p>
          📧 dpo@dreamscraftcode.com
          <br />
          📞 (61) 99174-8651
          <br />
          📍 Brasília/DF
        </p>
      </Section>

      <Section title="10. Atualizações desta política">
        <p>
          Esta política pode ser atualizada periodicamente. A versão mais recente estará sempre
          disponível em nosso site. Alterações substanciais serão comunicadas por e-mail.
        </p>
      </Section>

      <div className="mt-12 rounded-2xl border border-border bg-surface/60 p-6">
        <p className="text-sm text-muted-foreground">
          Veja também os{" "}
          <Link to="/termos" className="text-primary hover:underline">
            Termos de Uso
          </Link>
          .
        </p>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold border-l-2 border-primary pl-3">{title}</h2>
      <div className="mt-4 space-y-3 text-muted-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_strong]:text-foreground">
        {children}
      </div>
    </section>
  );
}
