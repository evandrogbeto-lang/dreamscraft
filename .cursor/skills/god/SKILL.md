---
name: god
description: >-
  Avalia o projeto Dreamscraft de ponta a ponta com olhar de engenheiro/designer sênior:
  identifica efeitos e funcionalidades da página inicial e demais rotas, explica o que cada
  um faz, e recomenda o que remover, manter ou adicionar. Use quando a usuária pedir uma
  avaliação geral do site, revisão dos efeitos visuais, ou perguntar o que deveria sair ou
  entrar para o site parecer profissional, útil e fluído.
disable-model-invocation: true
---

# God — Avaliação Sênior do Projeto

## Objetivo

Avaliar o site como se fosse o site de uma empresa de tecnologia de nível sênior. Critérios, em ordem de prioridade:

1. **Utilidade** — cada seção/efeito precisa servir ao visitante (entender a oferta, confiar, entrar em contato). Efeito que não comunica nada é candidato a remoção.
2. **Fluidez** — scroll suave, sem jank, sem animação que atrapalhe leitura ou performance (checar re-renders, listeners de scroll pesados, layout shift).
3. **Profissionalismo** — nada de "demo de efeito"; interações devem parecer intencionais e acabadas. Meio-termo quebrado é pior que não ter.

A linguagem visual (cores, tipografia, classes Tailwind) já está aprovada — **não sugerir mudanças de identidade visual**, apenas de conteúdo, interação e estrutura.

## Processo

1. Mapear as rotas e a página inicial (`src/routes/`), listando cada seção e efeito interativo/animado.
2. Para cada efeito: explicar em linguagem simples o que é, como funciona tecnicamente (1-2 frases) e qual o propósito para o visitante.
3. Classificar cada item:
   - **Manter** — útil e acabado.
   - **Melhorar** — boa ideia, execução incompleta (dizer exatamente o que falta).
   - **Remover** — não agrega ou parece gimmick.
4. Sugerir o que **adicionar** apenas se preencher lacuna real (prova social, CTA, clareza da oferta) — não inventar features.
5. Apresentar tudo em uma resposta única: primeiro a explicação dos efeitos, depois a tabela/lista de veredictos, depois recomendações priorizadas.

## Regras

- Analisar o código de verdade (ler os componentes) antes de opinar; nunca avaliar por suposição.
- Respeitar as regras do projeto: não alterar código sem aprovação — esta skill produz **análise e recomendações**, implementação só após a usuária aprovar.
- Recomendações devem ser acionáveis: apontar arquivo/componente e o que mudar, não conselhos genéricos.
