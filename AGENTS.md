# Dreamscraft.Code — Instruções para agentes

## Prioridade de fontes

Antes de qualquer alteração visual ou de conteúdo, ler integralmente:

1. `docs/brand/DREAMSCRAFT_Brandsheet.pdf`
2. `docs/brand/Linguagem_Visual_Dreamscraft.pdf`
3. `docs/brand/DREAMSCRAFT_CONTEXTO_GERAL.md`
4. `docs/DIRECAO-CRIATIVA-SITE.md`
5. `docs/SITE_STATUS_COMPLETO.md`
6. `.cursor/rules/dreamscraft-brand.mdc`
7. Documentação técnica relevante do repositório.

Em caso de conflito, o Brandsheet oficial prevalece.

## Responsabilidades

- A direção criativa, arquitetura e copy são definidas nos documentos do projeto.
- O agente implementa a especificação aprovada; não deve substituí-la por uma solução genérica.
- O Cursor controla commits, push, merge e histórico Git.
- Nenhum agente deve fazer commit, push, merge, rebase, reset ou trocar de branch sem solicitação explícita.

## Antes de editar

1. Confirmar caminho absoluto e branch atual.
2. Executar `git status`.
3. Ler os documentos prioritários.
4. Localizar os assets oficiais antes de criar qualquer elemento visual.
5. Apresentar plano, arquivos afetados e riscos.
6. Aguardar aprovação.

## Restrições de conteúdo

Nunca inventar:

- clientes;
- depoimentos;
- métricas;
- resultados;
- prêmios;
- números de projetos;
- preços;
- funcionalidades ainda inexistentes;
- cases;
- escassez ou urgência não comprovada.

Toda prova deve ser real, autorizada e claramente identificada.

## Restrições visuais

A interface deve parecer uma software house boutique premium, não um template de startup de IA.

Evitar:

- glassmorphism generalizado;
- cards em todas as seções;
- glow permanente em muitos elementos;
- partículas decorativas;
- chuva de código;
- grids digitais genéricos;
- terminais sem função;
- dashboard fictício;
- efeitos concorrentes;
- ícones genéricos de bibliotecas quando houver pictograma oficial;
- novas versões improvisadas da logo ou do símbolo `c/`.

Regra: cada seção deve ter um único gesto visual protagonista.

## Qualidade obrigatória

Antes de concluir:

- executar lint;
- executar typecheck;
- executar testes existentes;
- verificar desktop e mobile;
- verificar 360 px sem overflow;
- verificar navegação por teclado;
- verificar estados de foco;
- respeitar `prefers-reduced-motion`;
- informar todos os arquivos alterados;
- não fazer commit automaticamente.
