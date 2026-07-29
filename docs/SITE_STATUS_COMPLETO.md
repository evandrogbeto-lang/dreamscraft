# 📋 SITE DREAMSCRAFT — STATUS COMPLETO (feito + pendente)

> Documento-fonte do estado real do site. Reflete a branch `main` no GitHub
> (`evandrogbeto-lang/dreamscraft`), com todos os PRs mergeados. Atualizar sempre que algo mudar.

---

## Resumo em um parágrafo

Site criado pelo Evandro no **Lovable**, migrado para **GitHub** e desenvolvido no **Cursor**, 100% próprio. Já passou por rodadas de: identidade visual + pictogramas, honestidade de dados (Regra nº 1), responsividade, correção de bugs, integrações (estimador com OpenRouter, e-mail de lead com Resend) e **hardening de segurança**. **Falta para lançar:** definir os valores de preço reais, o deploy, e a auditoria final no ar. O restante (diagramas do portfólio, motion, notificação de lead) é backlog pós-lançamento.

## De onde viemos

- Design/build original: **Evandro, no Lovable**.
- Migração: zip → **repo GitHub** → **Cursor**. Assets do Lovable (que eram ponteiros de CDN) já foram substituídos por arquivos reais commitados.

## Versionamento (estado atual)

- **`main`** = versão oficial, com **todos os 26 commits** mergeados.
- Branches redundantes no GitHub (já mergeadas, podem ser apagadas): `chore/honesty-and-integrations`, `chore/security-headers`.

---

## ✅ O QUE JÁ FOI FEITO

### Marca e visual
- **Assets self-hosted** — logos, ícone, favicon, og-image reais commitados; URLs do Lovable removidas.
- **Sistema de cor por seção** — roxo base + acentos rosa/azul/amarelo; pictogramas próprios (`brand-pictogram.tsx`) no lugar de ícones genéricos.
- **Seções claras → painéis flutuantes** arredondados; logo repetida no meio da página removida.
- **Boot screen "Compilação"** — animação de abertura (logo se desenha), rápida, pulável, 1x por sessão, respeitando `prefers-reduced-motion`.
- **Cards estilo "janela de editor"** (`EditorWindow`) aplicados nos cards de destaque; "paredões" de cards convertidos em **listas compactas**.
- **Ícones repetidos corrigidos** — a seta que se repetia virou numeração em mono (`01–04`) nas listas de valores/processo/parceiros.
- **Cabeçalho responsivo** — ícone "c/" no mobile, wordmark + nav a partir de `lg`, hamburger abaixo de `lg`.
- **Arquivo de regras de marca** — `.cursor/rules/dreamscraft-brand.mdc` (o Cursor lê sozinho).

### Honestidade de dados (Regra nº 1 — nada inventado)
- **Proof of Work** — selos "código real · em produção" (enganosos) → "demo interativa / produto próprio / trecho deste site".
- **ROI calculator** — removidos o "−80%" e o "R$ 15.000 médio" (fake); hoje mostra só o custo da tarefa manual dos inputs do usuário.
- **Preços** — cards fixos (12k/30k/70k) → "a partir de" + "valor fechado após diagnóstico".
- **Rodapé** — bloco "último deploy" (que era texto chumbado fingindo commit real) removido. Métricas LCP/CLS/FCP do rodapé **são reais** (Web Vitals ao vivo) — mantidas.
- **Terminal da home** — número inventado "LCP 0.9s / 2.3s / 42 modules" removido; conteúdo trocado por neutro/verdadeiro.
- **Portfólio da Secretária** — afirmações que o produto não faz (agenda, DB Postgres, canais Web/Voz, tool calling) ajustadas para linguagem honesta; diagrama limpo.
- **Add-ons de WhatsApp** — lista adicionada, sem valores, marcada "sob consulta".

### Conteúdo e UX
- Home simplificada — `PinnedBuild` (tinha bug de HTML) e a barra de progresso duplicada removidos.
- Botões diferenciados — "Solicitar orçamento/proposta" → `/estimar` (antes tudo caía em `/contato`).
- Removidos da página de preços: **fotógrafo parceiro**, **repaginação de redes sociais**, **participação em resultados** (revenue-share).
- `/stack` e `/status` **removidas do menu** (rotas mantidas, mas fora da navegação — vazias/cedo demais).
- Opção **"Landing page / site institucional"** adicionada no formulário de contato.
- Portfólio reordenado — **Secretária.Code primeiro** (é o produto do lançamento).

### Responsividade (o que o visitante vê)
- `/precos` — tabelas de complexidade viram **cards empilhados no mobile**.
- Home — `PipelineScroll` vira **lista vertical no mobile**; Proof of Work com Monaco mais baixo + alvos de toque ≥44px.
- Alvos de toque ≥44px em `/estimar`, `/portfolio`, `/blog`, `/contato`.
- Correções extras da home no mobile: terminal que transbordava, gráfico do mockup colado na borda, diagrama de arquitetura empurrado/cortado.

### Correções de bug
- **Manifesto** — a "tela vazia ao voltar" foi corrigida (reveals `once:true` + o título da intro deixa de sumir).

### Integrações
- **Estimador → OpenRouter** — trocada a IA da Lovable (`LOVABLE_API_KEY`, que quebrava) pelo **OpenRouter com Gemini Flash 2.5** (`google/gemini-2.5-flash`), que a Dreams controla. Testado localmente, **funcionando**. Erro tratado com mensagem amigável + link pro `/contato`.
- **E-mail de lead (Resend)** — código pronto: quando um lead é salvo, dispara e-mail de notificação. `reply-to` = e-mail do lead. (Verificação de domínio pendente — ver abaixo.)

### Segurança (hardening)
- **Headers de segurança no Worker** — CSP, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Strict-Transport-Security, Referrer-Policy.
- **Escape em `highlight()`** — `pipeline-scroll.tsx` passou a escapar `< > &` (fecha o vetor de XSS).
- **Limpeza** — removidos código morto do template, menções ao Stripe e envs placeholder.
- Auditoria confirmou: **sem segredos hardcoded**, `.env` no `.gitignore`, `service_role` só no servidor, **SQL injection** seguro (queries parametrizadas), **rate limit** nos endpoints públicos, **CSRF** não se aplica (auth por Bearer token).

### Banco de dados
- **Migrations das 4 tabelas órfãs** — `projects`, `meetings`, `tasks`, `profiles` (que existiam só no Supabase) agora versionadas.

### E-mail
- `contato@dreamscraftcode.com` **recebendo no Gmail** (POP3) + configurado "enviar como".
- `dpo@` e `privacidade@` criados (LGPD).
- Resend: **DKIM verificado** ✅; SPF/MX **falharam** porque a Namecheap bloqueia MX manual (Private Email) → notificação por e-mail **adiada** (ver backlog).

### Documentação
- `PROJETO.md`, `BANCO-DE-DADOS.md`, catálogo de serviços/preços (rascunho), regras de marca, e este status.

---

## 🔴 PENDÊNCIAS QUE TRAVAM O LANÇAMENTO

1. **Definir os valores de preço REAIS** — última pendência de conteúdo. Destrava a calibragem do estimador (hoje a IA chuta valores altos que assustam, ex: R$ 4.000–7.500 pra landing) e o fechamento da página de preços.
2. **Auditoria final no ar** — Lighthouse na versão publicada (a nota no localhost deu 35, mas localhost distorce — o número real é no ar), formulários gravando no Supabase, todos os links sem 404, headers de segurança chegando (testar em `securityheaders.com`).
3. **Deploy** — publicar na Cloudflare (ver notas abaixo).

---

## 🟡 BACKLOG PÓS-LANÇAMENTO (recolocar/fazer depois)

- **Notificação de lead** — Resend por subdomínio (`send.dreamscraftcode.com`) OU webhook do Supabase. Por ora: checagem manual da tabela `leads`.
- **Diagramas de arquitetura do portfólio** — NutrIAprova, Fynk, OURleads com topologia real (os atuais são idênticos = cara de template e imprecisos).
- **Ficha honesta da Secretária** — versão "o que faz hoje / o que vem depois".
- **Página `/stack`** — dar conteúdo real e devolver ao menu.
- **Página `/status`** — quando houver clientes usando a Secretária.
- **Motion / GSAP** — animação-assinatura (home "código compilando" + reveal dos princípios).
- **Memória persistente da Secretária** — o upgrade técnico real (a "memória simples" do n8n pode perder contexto).
- **Backups automáticos do Supabase** — via Supabase CLI (`db dump`) + GitHub Action.
- **Estimador** — visual dos `@@` (sintaxe de diff feia) e remover a "stack recomendada" do resultado (cliente não precisa de stack).
- **Renovação do e-mail (Namecheap)** — revisar antes do vencimento (talvez migrar pro Cloudflare grátis / baixar plano).
- **Verificação de nomes no INPI** — NutrIAprova (buscar antes de featurar) e o **novo nome do Fynk** (o atual tem marca registrada — trocar).
- **Consertar branches redundantes** no GitHub (apagar `chore/honesty-and-integrations` e `chore/security-headers`, já mergeadas).

---

## ⚠️ DECISÕES EM ABERTO / A ALINHAR

- **Domínio canônico:** decidido **`.com`** (código já usa; `.com.br` vira redirect 301).
- **Período de teste:** decisão nova = **1–2 semanas SEM devolver o setup**. A Base de Conhecimento antiga ainda diz "30 dias, devolvemos o setup" — **atualizar lá e no contrato** (com o Paulo).
- **Nomes de produto:** usar descrição genérica ("SaaS de gestão financeira", "plataforma de nutrição") até verificar no INPI. Featurar só depois de checar.

---

## 🚀 NOTAS DE DEPLOY

- O site é um **Cloudflare Worker** (`wrangler.jsonc` → `src/server.ts`).
- **`wrangler.jsonc`** — o `name` ainda é `tanstack-start-app`; renomear pra `dreamscraft-site`.
- **Domínio:** pra o Worker usar `dreamscraftcode.com`, o **DNS precisa ir pra Cloudflare**. Isso **NÃO tira o e-mail** — as 5 caixas do Private Email continuam na Namecheap; a Cloudflare importa os registros de e-mail (MX `mx1`/`mx2.privateemail.com`) e o e-mail segue funcionando. **Conferir os registros de e-mail (com print) ANTES de trocar os nameservers.**
- **Opção mais segura:** publicar primeiro no endereço grátis `*.workers.dev` (não mexe no domínio nem no e-mail), testar tudo no ar, e fazer o domínio próprio como passo separado.
- **Secrets no Worker (produção):** configurar no painel da Cloudflare — `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_PUBLISHABLE_KEY`. `LOVABLE_API_KEY` pode sair.
- Depois do deploy: redirect 301 do `.com.br` → `.com`, e rodar Lighthouse no ar.

## 🔑 VARIÁVEIS DE AMBIENTE

| Variável | Onde | Uso |
|---|---|---|
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` | cliente | Supabase (público) |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_PUBLISHABLE_KEY` | servidor/worker | Supabase (servidor) |
| `OPENROUTER_API_KEY` / `OPENROUTER_MODEL` (`google/gemini-2.5-flash`) | servidor/worker | Estimador |
| `RESEND_API_KEY` | servidor/worker | Notificação de lead |
| ~~`LOVABLE_API_KEY`~~ | — | não usa mais |

Local: no `.env` / `.dev.vars` (fora do Git). Produção: secrets na Cloudflare.

## 📦 STACKS REAIS DOS PRODUTOS (pro portfólio, quando refizer os diagramas)

- **Secretária.Code:** WhatsApp Cloud API → webhook → código JS → condicional → Agente de IA (OpenRouter + memória de conversa) → resposta no WhatsApp. (n8n; sem agenda/DB próprio ainda.)
- **Fynk/Prosperia (financeiro):** React + Vite + TS + Tailwind + Supabase (**25 migrations**) + TanStack Query + recharts + jsPDF/xlsx + zod. É o mais maduro.
- **OURleads:** React + Vite + TS + Tailwind + Supabase (**7 migrations**) + TanStack Query + recharts + zod.
- (NutrIAprova: stack a confirmar do repo.)

## 📁 DOCUMENTOS DO PROJETO

- `PROJETO.md` — guia do dev (stack, estrutura, "como mudo X").
- `BANCO-DE-DADOS.md` — schema do Supabase, RLS, acesso admin.
- Catálogo de Serviços e Preços (rascunho).
- `.cursor/rules/dreamscraft-brand.mdc` — regras de marca.
- **Este arquivo** — status geral.

> Prioridade de negócio em paralelo: **mandar as abordagens de prospecção** (a honesta, pro decisor da clínica). "Publicar > polir", mas honestidade e segurança **são** o publicar bem-feito.
