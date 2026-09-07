# Dreamscraft — Figma Handoff para Cursor

## Fonte de verdade
1. Brandsheet oficial e assets oficiais do repositório.
2. `AGENTS.md`.
3. `.cursor/rules/dreamscraft-brand.mdc`.
4. `docs/DIRECAO-CRIATIVA-SITE.md`.
5. Este arquivo.
6. Frames aprovados no Figma.

Não redesenhar, reinterpretar ou criar uma nova direção visual durante a implementação.

## Figma
Arquivo principal:
https://www.figma.com/design/uxUOzOWlB1HIcqtvdfNxMQ

Handoff final:
https://www.figma.com/design/uxUOzOWlB1HIcqtvdfNxMQ?node-id=130-3

Correção obrigatória do hero do portfólio:
https://www.figma.com/design/uxUOzOWlB1HIcqtvdfNxMQ?node-id=130-246

## Frames por rota

### Home
- Desktop: https://www.figma.com/design/uxUOzOWlB1HIcqtvdfNxMQ?node-id=98-3
- Mobile: https://www.figma.com/design/uxUOzOWlB1HIcqtvdfNxMQ?node-id=98-54

### Projetos / Portfólio
- Desktop: https://www.figma.com/design/uxUOzOWlB1HIcqtvdfNxMQ?node-id=98-86
- Mobile: https://www.figma.com/design/uxUOzOWlB1HIcqtvdfNxMQ?node-id=98-188
- O hero representa sites, sistemas e produtos digitais.
- A Secretária.Code aparece uma vez no corpo da página, não também no hero.

### Projeto individual
- Desktop: https://www.figma.com/design/uxUOzOWlB1HIcqtvdfNxMQ?node-id=98-264
- Mobile: https://www.figma.com/design/uxUOzOWlB1HIcqtvdfNxMQ?node-id=98-365

### Contato
- Desktop: https://www.figma.com/design/uxUOzOWlB1HIcqtvdfNxMQ?node-id=98-457
- Mobile: https://www.figma.com/design/uxUOzOWlB1HIcqtvdfNxMQ?node-id=98-525

### Soluções
- Desktop: https://www.figma.com/design/uxUOzOWlB1HIcqtvdfNxMQ?node-id=103-3
- Mobile: https://www.figma.com/design/uxUOzOWlB1HIcqtvdfNxMQ?node-id=103-94

### Processo
- Desktop: https://www.figma.com/design/uxUOzOWlB1HIcqtvdfNxMQ?node-id=103-157
- Mobile: https://www.figma.com/design/uxUOzOWlB1HIcqtvdfNxMQ?node-id=103-246

### Sobre
- Desktop: https://www.figma.com/design/uxUOzOWlB1HIcqtvdfNxMQ?node-id=103-313
- Mobile: https://www.figma.com/design/uxUOzOWlB1HIcqtvdfNxMQ?node-id=103-377

### Diagnóstico inicial (`/estimar`) — canônico V3.13
Página Figma: **V3.13 — Diagnóstico V2 · Web Flow** (`211:2`)

Arquivo: https://www.figma.com/design/uxUOzOWlB1HIcqtvdfNxMQ

A V3.13 substitui V3.12/V3.11/V3.10 como referência canônica de arquitetura e direção visual de `/estimar`.

**Figma representa arquitetura e direção visual. A implementação responsiva não deve reproduzir coordenadas, percentuais ou alturas literalmente.**

Quatro capítulos reais (estados temporários são inline):

| Capítulo | 1440 | 1024 | 390 |
|---|---|---|---|
| Entrada (+ interpretando inline) | `211:3` | `211:101` | `211:192` |
| Entendimento (+ ajuste inline) | `211:26` | `211:120` | `211:209` |
| Contexto (+ sintetizando inline) | `211:50` | `211:144` | `211:231` |
| Resultado (+ e-mail inline) | `211:74` | `211:165` | `211:250` |

Não há páginas independentes para Interpretando, Ajuste, Sintetizando ou Captura de e-mail.

Estados extraordinários também são **inline** no capítulo em que ocorrem:

- Timeout / indisponibilidade na interpretação → banner na **Entrada** (relato preservado)
- Timeout / indisponibilidade na síntese → banner no **Contexto** (respostas preservadas)
- Rate limit → mensagem calma; CTA principal WhatsApp (sem retry agressivo)
- Retomada de sessão válida → restaura o capítulo salvo + aviso “Continuamos de onde você parou.”
- Sessão expirada → volta à Entrada + aviso discreto (sem página própria)

**Decisões de implementação (fechamento V2):**

- 4 capítulos reais apenas
- Estados temporários inline (interpretando, ajuste, sintetizando, e-mail)
- Estados extraordinários inline (erro, timeout, rate limit, retomada, expirada)
- Figma = direção visual, não coordenadas/percentuais/alturas literais
- Superfícies secundárias (lavanda) exigem motivo + âncora + enquadramento no canvas roxo
- CodeRain / AccentBars genéricos **removidos** de `/estimar`

Motion spec (ainda válido): `183:162`

Regras da rota:
- Título público: Diagnóstico inicial | Dreamscraft
- Container ~1180–1240px; superfícies lavanda ancoradas ao conteúdo (sem split 50vw)
- Direção/Resultado: superfície ~1040–1160px; parágrafos com medida de leitura ~680–780px
- CTA disabled: lavanda + borda rosa + texto roxo legível (sem opacity baixa)
- Progresso de contexto discreto (`1 / 3`), não headline “PERGUNTA N DE 3”
- Sem WhatsApp flutuante na jornada; CTAs de WA só em resultado/erro/timeout/rate limit
- Sem terminal, CLI, stack, preço ou prazo automáticos
- Máximo 2 chamadas ao modelo (interpret + synthesize)
- Ajuste/rejeição usam perguntas neutras locais (sem nova interpretação OpenRouter)
- E-mail: stub UI transparente — sem “e-mail enviado” falso; Resend ainda desconectado

### Manifesto
- Desktop: https://www.figma.com/design/uxUOzOWlB1HIcqtvdfNxMQ?node-id=118-3
- Mobile: https://www.figma.com/design/uxUOzOWlB1HIcqtvdfNxMQ?node-id=118-46

### Blog
- Desktop: https://www.figma.com/design/uxUOzOWlB1HIcqtvdfNxMQ?node-id=118-79
- Mobile: https://www.figma.com/design/uxUOzOWlB1HIcqtvdfNxMQ?node-id=118-146

### Parceiros
- Desktop: https://www.figma.com/design/uxUOzOWlB1HIcqtvdfNxMQ?node-id=118-193
- Mobile: https://www.figma.com/design/uxUOzOWlB1HIcqtvdfNxMQ?node-id=118-266

## Regras obrigatórias
- Usar somente a paleta oficial.
- Roxo domina; lavanda cria respiro; rosa destaca; azul explica; amarelo é excepcional.
- Nunca usar linha, texto ou detalhe com a mesma cor do fundo.
- Usar Cascadia Code.
- Usar somente logos, ícones, pictogramas e grafismos oficiais.
- Não inventar clientes, cases, métricas, parceiros, artigos ou funcionalidades.
- Mobile desde 360 px sem overflow horizontal.
- Respeitar `prefers-reduced-motion`.
- Cada seção tem somente um gesto visual protagonista.



## Perguntas frequentes — inclusão obrigatória

As perguntas frequentes ainda não possuem um frame visual próprio. Implementar como seção da rota `/solucoes`, imediatamente antes do CTA final, seguindo a linguagem visual da página aprovada.

Não criar uma rota `/faq` neste momento.

Na página `/contato`, incluir somente um link discreto:
`Ainda está em dúvida? Consulte as perguntas frequentes.`
Esse link deve apontar para `/solucoes#faq`.

### Estrutura visual

- Título: `Dúvidas antes de começar.`
- Subtítulo: `Respostas diretas para decisões que costumam aparecer antes de um projeto.`
- Accordion acessível, com uma pergunta aberta por vez.
- Fundo lavanda ou roxo conforme o ritmo da página.
- Perguntas em roxo sobre fundo claro ou lavanda/branco sobre fundo escuro.
- Divisórias sempre com contraste; nunca usar linha da mesma cor do fundo.
- Sem cards coloridos independentes para cada pergunta.
- No mobile, largura total, área de toque mínima de 44 px e sem overflow.
- Respeitar teclado, foco visível e `prefers-reduced-motion`.

### Perguntas iniciais aprovadas

1. `A Dreamscraft desenvolve apenas sites?`
   Não. Trabalhamos com sites institucionais, sistemas sob medida, automações e produtos digitais. A solução depende do problema e do estágio da operação.

2. `Como vocês definem o que precisa ser construído?`
   O projeto começa pelo diagnóstico: contexto, objetivo, pessoas envolvidas, riscos, prioridades e critérios de validação vêm antes da escolha da tecnologia.

3. `Quanto custa um projeto?`
   O investimento depende de escopo, complexidade, integrações, conteúdo, prazo e continuidade. O diagnóstico e o estimador ajudam a organizar essas variáveis antes de uma proposta.

4. `Quanto tempo leva?`
   O prazo varia conforme o escopo e as dependências. A proposta deve apresentar etapas, entregas verificáveis e responsabilidades, sem prometer uma data antes de entender o projeto.

5. `Preciso ter todo o conteúdo e as funcionalidades definidos?`
   Não. Podemos ajudar a organizar conteúdo, prioridades e fluxo. O importante é trazer o contexto, o problema e as restrições reais.

6. `Quem fica com o código, o domínio e os acessos?`
   Propriedade, acessos, infraestrutura e responsabilidades devem ser definidos de forma explícita na proposta e no contrato, sem dependência escondida.

7. `Vocês oferecem manutenção e evolução depois da entrega?`
   A continuidade é definida conforme a necessidade do projeto. Manutenção, suporte e evolução devem ter escopo, canais e responsabilidades claros.

8. `Posso conversar com vocês antes de pedir uma proposta?`
   Sim. O diagnóstico existe justamente para entender o cenário e decidir o próximo passo antes de transformar a conversa em orçamento.

### Conteúdo e honestidade

- Não publicar resposta com preço fixo ou prazo universal.
- Não prometer suporte, manutenção, propriedade ou disponibilidade além do que estiver previsto na proposta/contrato real.
- Revisar as respostas com a política comercial antes do lançamento.



## Decisões fechadas após a auditoria

### Branch e base
- Criar `feat/site-v2-figma` a partir do HEAD atual de `chore/honesty-and-integrations`, desde que o commit local à frente seja verificado e pertença às correções de honestidade/integrações.
- Antes de criar a branch, mostrar `git log --oneline --decorate -5` e o resumo do commit local à frente.
- Preservar `docs/FIGMA-HANDOFF.md` na nova branch.
- Não partir de `main` descartando o commit local sem confirmação explícita.

### CTA principal
- O CTA global `Solicitar diagnóstico` aponta para `/estimar`.
- CTAs de conversa como `Falar sobre um projeto` ou `Entrar em contato` apontam para `/contato`.
- O testador da Home encaminha para `/estimar` após a interação.

### Projetos e rota
- O nome exibido na navegação é `Projetos`.
- A rota canônica permanece `/portfolio`.
- Não criar `/projetos` nesta fase.
- Um redirect opcional de `/projetos` para `/portfolio` só poderá ser avaliado depois, sem substituir a rota canônica.

### Preços e estimador
- Manter `/precos` e `/estimar` funcionando.
- Não exibir `Preços` no header nem no rodapé enquanto valores e política comercial não estiverem definitivamente validados.
- `/estimar` é acessado pelo CTA `Solicitar diagnóstico`, sem necessidade de um item textual duplicado no menu.

### Package manager e comandos
- Usar o package manager já adotado pelo repositório.
- Se houver `bun.lock` ou `bun.lockb`, usar `bun`; não executar `npm install` e não criar `package-lock.json`.
- Comandos preferenciais nesse caso:
  - `bun install` somente se necessário;
  - `bun run lint`;
  - `bunx tsc --noEmit`;
  - `bun run build`;
  - `bun run dev`.

### Reutilização de código antigo
- Reutilizar lógica e infraestrutura, não a estética antiga por conveniência.
- `LiveTerminal`, `CodeRainBackground`, dot-grid, `TiltCard`, `MagneticButton`, terminais falsos, Monaco no carregamento inicial e componentes da V1 não devem ser reaproveitados na nova interface sem correspondência explícita com o frame aprovado.
- `EditorWindow`, `ProjectStory`, `Reveal` e outros componentes só podem ser reutilizados se o resultado visual final continuar fiel ao Figma.
- Telemetria e medição de Web Vitals podem permanecer internamente; não precisam continuar como bloco visual no rodapé.
- A boot screen antiga não entra na Fundação. Uma versão refinada poderá ser tratada somente na fase de Motion, seguindo o contrato final.
- `routeTree.gen.ts` é gerado pela ferramenta e não deve ser editado manualmente.

### Formulário e banco
- Não encaixar `assunto` ou `consentimento` de forma improvisada dentro de outro campo.
- Na fase de Contato, auditar primeiro o schema real do Supabase.
- Caso sejam necessários novos campos, propor migration estruturada antes de alterar o formulário.

## Ordem de implementação
1. Auditar o repositório sem editar.
2. Tokens, fonte e assets.
3. Header, Footer e layout global.
4. Home.
5. Soluções, Processo e Sobre.
6. Portfólio e projeto individual.
7. Manifesto, Blog e Parceiros.
8. Contato e formulário.
9. Motion.
10. QA e deploy.

## Prompt inicial para o Cursor
Antes de editar qualquer arquivo, leia integralmente:
- `AGENTS.md`
- `.cursor/rules/dreamscraft-brand.mdc`
- `docs/DIRECAO-CRIATIVA-SITE.md`
- `docs/FIGMA-HANDOFF.md`

Depois:
1. Audite o repositório atual.
2. Identifique stack, rotas, componentes, tokens, assets oficiais, integrações e riscos.
3. Verifique o Figma MCP e abra os frames indicados.
4. Compare o código atual com os frames aprovados.
5. Não escreva código ainda.
6. Entregue um plano por fases, com arquivos afetados, dependências, riscos e critérios de validação.
7. Não redesenhe nem invente conteúdo.
8. Aguarde aprovação antes de editar.

## Prompt para a primeira fase
Implemente somente:
- tokens oficiais;
- Cascadia Code;
- assets oficiais existentes;
- Header global;
- Footer global;
- layout compartilhado.

Não implemente a Home ainda.

Valide em 360, 768 e 1440 px. Rode lint, typecheck, testes e build disponíveis. Ao final, liste arquivos alterados, resultados, divergências e screenshots. Pare e aguarde aprovação.


## Como entregar este handoff ao Cursor

1. Salvar este arquivo dentro do repositório em `docs/FIGMA-HANDOFF.md`.
2. Não anexar o arquivo novamente em todas as conversas.
3. Manter `AGENTS.md` na raiz e `.cursor/rules/dreamscraft-brand.mdc` dentro do repositório.
4. Abrir no Cursor a pasta raiz do mesmo repositório.
5. Na primeira mensagem, referenciar os quatro arquivos com `@` e solicitar apenas auditoria.
6. Entregar todos os documentos de contexto de uma vez.
7. Autorizar a implementação aos poucos, uma fase por mensagem.
8. Não enviar todos os prompts de implementação de uma vez.
9. Como o Figma MCP já está conectado, não exportar o arquivo inteiro; usar os links com `node-id` deste handoff.
