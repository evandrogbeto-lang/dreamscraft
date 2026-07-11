export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "code"; lang: string; code: string };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string; // ISO
  dateLabel: string;
  readTime: number; // minutes
  content: Block[];
  featured?: boolean;
};

export const tags = [
  "Todos",
  "Preços",
  "Estratégia",
  "Processo",
  "React Native",
  "Node.js",
  "IA",
  "Arquitetura",
  "Negócio",
] as const;

export const posts: Post[] = [
  {
    slug: "quanto-custa-um-site-em-2026",
    title: "Quanto custa um site profissional em 2026 — a verdade sem rodeio",
    excerpt:
      "De R$ 1.500 a R$ 80.000, qual a diferença real? Decompomos cada faixa de preço e mostramos onde o seu dinheiro está indo (ou sendo queimado).",
    tag: "Preços",
    date: "2026-05-23",
    dateLabel: "Mai 2026",
    readTime: 7,
    featured: true,
    content: [
      {
        type: "p",
        text: "Pesquisar 'preço de site' é entrar em uma feira sem placas. Encontramos orçamentos de R$ 1.500 e de R$ 80.000 para projetos que, no papel, parecem iguais. Esse texto explica o que justifica a diferença — e em quais faixas você está pagando por engenharia, e em quais está pagando por intermediário.",
      },
      { type: "h2", text: "R$ 0 a R$ 2.000 — template + ajustes" },
      {
        type: "p",
        text: "Aqui mora a fila de Wix, Hostgator e freelancer iniciante. Você ganha um site no ar rápido, com template pronto e troca de imagem. Funciona para presença mínima, mas não escala: SEO técnico fica raso, performance depende do template e qualquer customização vira gambiarra.",
      },
      {
        type: "ul",
        items: [
          "Bom para: cartão de visita digital, validação de ideia em 1 semana",
          "Ruim para: blog ativo, integração com CRM, formulário condicional",
          "Custo escondido: trocar de plataforma depois é doloroso e caro",
        ],
      },
      { type: "h2", text: "R$ 2.000 a R$ 8.000 — site institucional sob medida" },
      {
        type: "p",
        text: "Faixa de freelancer experiente ou agência pequena. Você ganha layout próprio, código limpo, performance decente e geralmente CMS para editar conteúdo. É a faixa onde a maioria das pequenas empresas deveria estar.",
      },
      {
        type: "ul",
        items: [
          "5 a 10 páginas com identidade visual aplicada",
          "SEO técnico básico (sitemap, meta tags, schema)",
          "Formulário de contato funcionando de verdade",
          "Hospedagem otimizada e SSL configurado",
        ],
      },
      { type: "h2", text: "R$ 8.000 a R$ 25.000 — site + sistema leve" },
      {
        type: "p",
        text: "Aqui entra catálogo dinâmico, blog com painel, captação avançada de leads, integrações (RD Station, Hubspot, Stripe). Você não está mais pagando por 'site' — está pagando por uma máquina de marketing e vendas que roda 24/7.",
      },
      {
        type: "code",
        lang: "ts",
        code: `// Exemplo do que está incluído nessa faixa:
- 15+ páginas com componentes reutilizáveis
- Blog headless (Sanity, Contentful, Strapi)
- Integração com CRM e analytics avançado
- Multi-idioma e versão mobile-first
- Painel admin para o cliente editar`,
      },
      { type: "h2", text: "R$ 25.000+ — aplicação web sob medida" },
      {
        type: "p",
        text: "Não é mais site. É produto. Tem login, dashboard, cobrança recorrente, regras de negócio próprias. Aqui o trabalho é arquitetura, banco de dados, segurança e infra. É o que cobramos para projetos como portal de cliente, marketplace pequeno ou SaaS B2B inicial.",
      },
      { type: "h2", text: "O sinal de alerta: preço sem escopo" },
      {
        type: "quote",
        text: "Quem te dá um preço de site sem perguntar quantas páginas, qual o tráfego esperado e o que conecta com o quê, está chutando — ou cobrando para descobrir depois.",
      },
      { type: "h2", text: "Como pedir orçamento certo" },
      {
        type: "ul",
        items: [
          "Liste 5 sites que você gosta, e 5 que você odeia (com o porquê)",
          "Defina o resultado de negócio: leads/mês, conversão, retenção",
          "Diga qual ferramenta vocês já usam (CRM, email, pagamento)",
          "Combine prazos em etapas, não uma data única no final",
        ],
      },
      {
        type: "p",
        text: "Se você está nesse momento de decisão, fale com a gente. Em 30 minutos te dizemos honestamente em qual faixa o seu projeto cabe — mesmo que não sejamos a melhor escolha.",
      },
    ],
  },
  {
    slug: "site-ou-app-qual-escolher",
    title: "Site ou app? O guia honesto para não jogar dinheiro fora",
    excerpt:
      "A maioria dos clientes que pede 'um app' precisa, na verdade, de um bom site responsivo. Decomposição prática da escolha, com critérios reais.",
    tag: "Estratégia",
    date: "2026-05-21",
    dateLabel: "Mai 2026",
    readTime: 6,
    content: [
      {
        type: "p",
        text: "Pelo menos 7 em cada 10 reuniões aqui começam com 'queremos um app'. Em 5 delas, a recomendação final é: comece por um site progressivo (PWA). É mais barato, vai ao ar mais rápido, indexa no Google e cobre 80% do caso de uso.",
      },
      { type: "h2", text: "Quando faz sentido um app nativo" },
      {
        type: "ul",
        items: [
          "Uso recorrente diário (delivery, banco, transporte, mensageria)",
          "Hardware: câmera intensiva, biometria, sensores, bluetooth",
          "Push notification como parte central da experiência",
          "Funcionamento offline com sincronização robusta",
          "Estar na home screen do usuário tem valor estratégico real",
        ],
      },
      { type: "h2", text: "Quando um site responsivo é melhor" },
      {
        type: "ul",
        items: [
          "Usuário entra 1 ou 2 vezes para resolver algo (catálogo, agendamento)",
          "Você precisa ser encontrado pelo Google (SEO importa)",
          "Conversão de tráfego pago — instalar app é fricção pesada",
          "Orçamento limitado e necessidade de iterar rápido",
          "Conteúdo muda com frequência (blog, novidades, promoções)",
        ],
      },
      { type: "h2", text: "O custo real que ninguém soma" },
      {
        type: "p",
        text: "App tem manutenção dobrada: iOS e Android. Atualização da loja leva dias. Cada release exige QA em vários aparelhos. Push notification exige infraestrutura. E você precisa convencer o usuário a baixar — taxa de adesão fica entre 5% e 20% do tráfego.",
      },
      {
        type: "code",
        lang: "ts",
        code: `// Custo aproximado em 1 ano (projeto médio):
site responsivo .... R$ 12k build + R$ 200/mês infra
PWA .............. R$ 18k build + R$ 300/mês infra
app nativo ....... R$ 45k build + R$ 1.500/mês manutenção
                    (lojas, certificados, releases, suporte)`,
      },
      { type: "h2", text: "Caminho intermediário: PWA" },
      {
        type: "p",
        text: "Progressive Web App é a opção que ninguém te oferece porque dá menos margem. Funciona como site, instala como app, suporta notificação e offline (com limites). Cobre o caso de uso de 80% dos pedidos de 'app' por uma fração do custo.",
      },
      {
        type: "quote",
        text: "Tudo que você ganha em 'sensação de app' você perde em SEO. Não existe almoço grátis — só engenharia bem feita.",
      },
      { type: "h2", text: "Como decidir em 5 minutos" },
      {
        type: "ul",
        items: [
          "Frequência de uso por usuário ativo é diária? → tende a app",
          "Você depende de Google/Instagram pra trazer gente? → tende a site",
          "Precisa de hardware nativo? → app",
          "MVP precisa estar no ar em 30 dias? → site/PWA",
          "Ainda não validou a ideia? → site, sempre",
        ],
      },
    ],
  },
  {
    slug: "por-que-ter-um-site-em-2026",
    title: "Por que ter um site ainda importa em 2026 (mesmo com Instagram)",
    excerpt:
      "Rede social aluga. Site é propriedade. A diferença vira óbvia no dia que o algoritmo muda — e o seu negócio depende de algo que você não controla.",
    tag: "Estratégia",
    date: "2026-05-19",
    dateLabel: "Mai 2026",
    readTime: 5,
    content: [
      {
        type: "p",
        text: "Toda semana ouvimos: 'Tenho Instagram, tenho WhatsApp Business, preciso mesmo de site?'. A resposta curta é sim. A longa é melhor.",
      },
      { type: "h2", text: "Rede social é território alugado" },
      {
        type: "p",
        text: "Você posta, paga anúncio, conquista seguidor — e amanhã o algoritmo decide entregar 5% do seu alcance. Aconteceu com o Facebook, com o Instagram, vai acontecer com qualquer rede futura. Sua audiência mora numa casa que não é sua.",
      },
      { type: "h2", text: "Site é o seu CEP digital" },
      {
        type: "ul",
        items: [
          "Domínio próprio é o único endereço que ninguém pode te tirar",
          "Conteúdo indexa no Google e gera tráfego orgânico por anos",
          "Você captura email/telefone e fala direto, sem intermediário",
          "Sua marca aparece sem competição visual com outros perfis",
          "Você controla cor, layout, ritmo de carregamento, tudo",
        ],
      },
      { type: "h2", text: "O efeito composto do conteúdo próprio" },
      {
        type: "p",
        text: "Um post no Instagram dura 48 horas. Um artigo no blog continua trazendo visita por anos. A diferença em 2 anos é absurda — e é por isso que toda empresa séria mantém site mesmo com presença forte em rede.",
      },
      {
        type: "code",
        lang: "ts",
        code: `// Conteúdo no Instagram (post comum):
alcance dia 1 ........ 1.500
alcance dia 30 ....... 30
total estimado ....... ~2.000 views

// Conteúdo no blog (artigo bem indexado):
alcance mês 1 ........ 200
alcance mês 12 ....... 1.800
total em 24 meses .... ~25.000 views`,
      },
      { type: "h2", text: "Quando rede social basta" },
      {
        type: "p",
        text: "Sendo honestos: se o seu negócio é local, conhecido pelo dono, e fatura via WhatsApp, talvez você não precise de site agora. Mas no dia que quiser vender pra fora da bolha, contratar, captar investidor ou ser levado a sério em uma RFP — vai precisar.",
      },
      {
        type: "quote",
        text: "Site não é folder online. É a única vitrine onde você é o senhorio, não o inquilino.",
      },
    ],
  },
  {
    slug: "seo-tecnico-que-importa",
    title: "SEO técnico que importa em 2026 — sem encheção",
    excerpt:
      "Esqueça 'palavra-chave longtail'. Os ganhos reais hoje vêm de performance, semântica HTML e estrutura de URL. Checklist prático.",
    tag: "Processo",
    date: "2026-05-16",
    dateLabel: "Mai 2026",
    readTime: 6,
    content: [
      {
        type: "p",
        text: "SEO virou indústria de planilha. A verdade é que o Google em 2026 ranqueia bem quem tem site rápido, semântico, com conteúdo profundo e estrutura de URL clara. Quem te promete 'top 1 em 30 dias' está vendendo sonho.",
      },
      { type: "h2", text: "Os 5 fatores técnicos que movem ponteiro" },
      {
        type: "ul",
        items: [
          "Core Web Vitals (LCP < 2.5s, CLS < 0.1, INP < 200ms)",
          "HTML semântico: H1 único, headings em ordem, alt em imagem",
          "Schema.org/JSON-LD para artigo, produto, organização, FAQ",
          "URLs limpas, hierárquicas, sem parâmetro inútil",
          "Sitemap.xml e robots.txt corretos, canonical apontando direito",
        ],
      },
      { type: "h2", text: "Performance é a régua principal" },
      {
        type: "p",
        text: "Um site que demora 4 segundos pra carregar perde metade do tráfego antes de aparecer. Google sabe disso e ranqueia de acordo. Em 2026 isso é amplificado: mobile-first indexing + Core Web Vitals como sinal pesado.",
      },
      {
        type: "code",
        lang: "ts",
        code: `// O que olhar (e como medir):
LCP — Largest Contentful Paint
  -> usar fonte local, imagem otimizada, server location próximo
CLS — Cumulative Layout Shift
  -> definir width/height em imagem e iframe, evitar font swap
INP — Interaction to Next Paint
  -> hidratar menos JS, code-splitting por rota

medir com:
- web.dev/measure
- Chrome DevTools > Lighthouse
- PageSpeed Insights (real user data)`,
      },
      { type: "h2", text: "Conteúdo: profundidade > volume" },
      {
        type: "p",
        text: "Google penaliza 'thin content' desde 2023. Vinte páginas rasas perdem para 5 artigos profundos respondendo de verdade a intenção de busca. Escreva pra humano e revise pra robô.",
      },
      { type: "h2", text: "Schema é o detalhe que vira diferencial" },
      {
        type: "code",
        lang: "html",
        code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Título do artigo",
  "datePublished": "2026-05-16",
  "author": { "@type": "Organization", "name": "Dreamscraft Code" }
}
</script>`,
      },
      {
        type: "quote",
        text: "SEO técnico hoje é 80% engenharia. Quem te oferece SEO sem entender de performance está vendendo cartilha de 2018.",
      },
    ],
  },
  {
    slug: "performance-web-importa-quanto",
    title: "Performance web vale dinheiro — números reais de conversão",
    excerpt:
      "Cada 1 segundo a mais no carregamento custa entre 7% e 20% de conversão. Estudo de caso com dados de antes/depois.",
    tag: "Processo",
    date: "2026-05-14",
    dateLabel: "Mai 2026",
    readTime: 5,
    content: [
      {
        type: "p",
        text: "Performance web não é vaidade técnica. É fator direto de conversão, retenção e custo de aquisição. Amazon mediu há anos que 100ms a mais custam 1% de venda. Em 2026 a régua só ficou mais alta.",
      },
      { type: "h2", text: "Os números que importam" },
      {
        type: "ul",
        items: [
          "53% dos usuários mobile abandonam sites que demoram > 3s (Google)",
          "1s extra de loading derruba conversão em ~7% (Akamai)",
          "Site rápido reduz CAC em campanhas pagas — Google e Meta dão preço melhor",
          "Bounce rate cai pela metade quando LCP sai de 4s pra 2s",
        ],
      },
      { type: "h2", text: "Caso real de um cliente nosso" },
      {
        type: "p",
        text: "Recebemos um e-commerce com LCP médio de 5.8s. Reescrevemos imagens, ajustamos critical CSS, movemos analytics para web worker e adotamos edge cache.",
      },
      {
        type: "code",
        lang: "ts",
        code: `// Antes:
LCP ........ 5.8s
CLS ........ 0.31
conversão .. 1.4%
bounce ..... 68%

// Depois (mesma campanha, mesmo tráfego):
LCP ........ 1.9s
CLS ........ 0.04
conversão .. 2.6%
bounce ..... 41%`,
      },
      { type: "h2", text: "O que sempre funciona" },
      {
        type: "ul",
        items: [
          "Imagens em AVIF/WebP com width/height definidos",
          "Fonte local, com font-display: swap e subset",
          "Crítico inline, resto lazy. Sem framework gigante na home",
          "CDN com edge cache, idealmente perto do seu usuário",
          "Menos JS de terceiros — cada tag custa milissegundos",
        ],
      },
      {
        type: "quote",
        text: "Performance é a única feature que melhora tudo ao mesmo tempo: SEO, conversão, retenção e custo de mídia.",
      },
    ],
  },
  {
    slug: "mvp-em-30-dias-como-fazemos",
    title: "MVP em 30 dias — o método que usamos (passo a passo)",
    excerpt:
      "Como saímos do brief para o primeiro deploy útil em 4 semanas, sem cortar qualidade. O processo, as ferramentas e o que cortamos do escopo.",
    tag: "Processo",
    date: "2026-05-10",
    dateLabel: "Mai 2026",
    readTime: 7,
    content: [
      {
        type: "p",
        text: "MVP virou desculpa pra entregar produto pela metade. Aqui ele é o oposto: o menor escopo possível que prova o valor central — bem feito. Esse é o processo de 4 semanas que repetimos.",
      },
      { type: "h2", text: "Semana 1 — Discovery cirúrgica" },
      {
        type: "ul",
        items: [
          "90 minutos de imersão com o cliente: problema, usuário, sucesso",
          "Mapeamento de jornada com no máximo 5 telas-chave",
          "Decisão de stack documentada em 1 página",
          "Setup do repositório, CI, ambientes (staging e prod)",
        ],
      },
      { type: "h2", text: "Semana 2 — Esqueleto navegável" },
      {
        type: "p",
        text: "Sai a wireframe, entra a navegação clicável com dados mockados. Cliente vê na quinta-feira. O objetivo é validar o fluxo antes de escrever lógica de negócio.",
      },
      {
        type: "code",
        lang: "ts",
        code: `// Stack padrão que monta esqueleto em horas:
- TanStack Start (file-based routing + SSR)
- Tailwind v4 + shadcn (design system pronto)
- Supabase (auth + banco + storage em 1 cliente)
- Mock layer (data fake) pra acelerar UI`,
      },
      { type: "h2", text: "Semana 3 — Lógica de negócio + dados reais" },
      {
        type: "ul",
        items: [
          "Schema do banco modelado com migrations versionadas",
          "RLS configurada por escopo (cliente, admin, parceiro)",
          "Integrações críticas (pagamento, email transacional)",
          "Testes de fluxo principal automatizados",
        ],
      },
      { type: "h2", text: "Semana 4 — Polimento + deploy" },
      {
        type: "p",
        text: "Performance, acessibilidade, SEO técnico, monitoramento, analytics. Documentação de operação entregue. Treinamento de 1 hora pra o cliente operar o admin.",
      },
      { type: "h2", text: "O que cortamos sem dó" },
      {
        type: "ul",
        items: [
          "Painel admin sofisticado — começa com Supabase Studio puro",
          "Integrações secundárias — entram no ciclo seguinte",
          "Animação 'wow' fora do fluxo principal",
          "Funcionalidade pedida por 'um cliente teórico' que ainda não existe",
        ],
      },
      {
        type: "quote",
        text: "MVP bem feito é embrião de produto. MVP mal feito é prejuízo travestido de aprendizado.",
      },
    ],
  },
  {
    slug: "por-que-lovable",
    title:
      "Por que construímos o site da DreamsCraft Code na Lovable — e o que aprendemos",
    excerpt:
      "Escolhemos Lovable ao invés de subir Next.js do zero. Velocidade absurda em algumas partes, hacks necessários em outras. Aqui está a verdade técnica.",
    tag: "Processo",
    date: "2026-05-24",
    dateLabel: "Mai 2026",
    readTime: 6,
    content: [
      {
        type: "p",
        text: "Esse site que você está lendo agora foi construído na Lovable em poucos dias. Não é demo, não é landing page de teste — é o site institucional real da DreamsCraft Code, com blog, formulários, autenticação e painel admin. Esse post documenta a decisão e o que aprendemos no caminho.",
      },
      { type: "h2", text: "A decisão" },
      {
        type: "p",
        text: "A pergunta interna foi simples: subir Next.js do zero, configurar Tailwind, escolher CMS, montar pipeline de deploy — ou usar Lovable e ter algo navegável no mesmo dia? O site da agência é uma vitrine, não um produto com SLA crítico. O custo de oportunidade de gastar 2 semanas montando boilerplate era alto demais.",
      },
      { type: "h2", text: "O que funcionou muito bem" },
      {
        type: "ul",
        items: [
          "Velocidade de iteração visual — mudanças de layout em segundos, não em commits",
          "Componentes shadcn já configurados com tokens semânticos prontos para customizar",
          "Deploy automático sem precisar tocar em CI, DNS de preview ou variáveis de ambiente",
          "Backend integrado (auth, banco, storage) sem montar Supabase à mão",
          "TanStack Router file-based já ligado — rotas tipadas funcionando de cara",
        ],
      },
      { type: "h2", text: "O que tivemos que hackear" },
      {
        type: "p",
        text: "Nem tudo saiu pronto. Algumas partes exigiram mergulho manual no código gerado: cursor customizado, animações de scroll avançadas (pinned, scramble), tilt 3D nos cards, toast estilo terminal — tudo na unha.",
      },
      { type: "h2", text: "Vale a pena?" },
      {
        type: "p",
        text: "Sim — com ressalvas honestas. Vale para site institucional, landing page, MVP de validação, painel interno simples. Não vale para produto com lógica de negócio profunda, time grande mexendo no mesmo código, ou aplicação que precisa de arquitetura customizada desde o primeiro commit.",
      },
      {
        type: "quote",
        text: "Ferramenta nova não substitui engenharia. Mas muda onde o engenheiro gasta tempo — e isso, sim, vale ouro.",
      },
    ],
  },
  {
    slug: "react-native-vs-flutter-fretes",
    title:
      "Por que escolhemos React Native ao invés de Flutter para o App de Fretes",
    excerpt:
      "A escolha entre frameworks mobile não é técnica — é estratégica. Decompondo a decisão real por trás do nosso primeiro app em produção.",
    tag: "React Native",
    date: "2026-05-18",
    dateLabel: "Mai 2026",
    readTime: 8,
    content: [
      {
        type: "p",
        text: "Quando o cliente do App de Fretes nos procurou, a primeira pergunta interna não foi 'qual framework é mais rápido?'. Foi: 'em qual stack a gente consegue iterar mais rápido com menos risco?'",
      },
      { type: "h2", text: "O contexto importava mais que o benchmark" },
      {
        type: "p",
        text: "O cliente queria validar product-market-fit em 60 dias. Não era hora de lutar contra ferramentas. React Native ganhou porque o ecossistema de bibliotecas para mapas, geolocalização em background e pagamento já estava maduro — e o time tinha velocidade nela.",
      },
      { type: "h2", text: "Onde Flutter teria sido melhor" },
      {
        type: "ul",
        items: [
          "UI altamente customizada com animações complexas",
          "Time já familiar com Dart e padrões reactive",
          "Apps com requisitos de performance gráfica (jogos, dashboards 3D)",
          "Quando você quer pixel-perfect entre Android e iOS sem ajustes",
        ],
      },
      { type: "h2", text: "Onde React Native ganhou no nosso caso" },
      {
        type: "ul",
        items: [
          "Reaproveitamos hooks e validação Zod do backend Node",
          "Expo EAS resolveu CI/CD de publicação nas lojas em 1 dia",
          "Bibliotecas maduras para Stripe, Mapbox, push notifications",
          "Pool de devs no Brasil 5x maior — manutenção futura é tranquila",
        ],
      },
      {
        type: "code",
        lang: "ts",
        code: `import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const TASK = "driver-location";

TaskManager.defineTask(TASK, async ({ data, error }) => {
  if (error) return;
  const { locations } = data as { locations: Location.LocationObject[] };
  await sendToBackend(locations);
});

await Location.startLocationUpdatesAsync(TASK, {
  accuracy: Location.Accuracy.High,
  distanceInterval: 50,
});`,
      },
      {
        type: "quote",
        text: "Framework não é religião. É ferramenta que precisa caber no momento do negócio.",
      },
    ],
  },
  {
    slug: "estrutura-banco-app-delivery",
    title: "Como estruturamos o banco de dados de um app de delivery do zero",
    excerpt:
      "Modelagem que aguenta crescimento, evita migrations dolorosas e mantém RLS simples. Decisões reais, não exemplo de tutorial.",
    tag: "Arquitetura",
    date: "2026-05-12",
    dateLabel: "Mai 2026",
    readTime: 6,
    content: [
      {
        type: "p",
        text: "Toda vez que um cliente nos pede 'um app de delivery', a primeira coisa que abrimos não é o Figma — é uma planilha vazia. Modelagem de dados é onde a maioria dos projetos morre silenciosamente.",
      },
      { type: "h2", text: "Os 5 agregados que sempre existem" },
      {
        type: "ul",
        items: [
          "users — clientes, restaurantes e entregadores compartilham auth",
          "stores — restaurante ou loja, com horários e geolocalização",
          "products — catálogo versionado por loja",
          "orders — pedido com estados explícitos como máquina de estados",
          "deliveries — separado de orders pra suportar split delivery no futuro",
        ],
      },
      {
        type: "code",
        lang: "sql",
        code: `CREATE TYPE order_status AS ENUM (
  'pending', 'accepted', 'preparing',
  'ready', 'in_transit', 'delivered', 'canceled'
);

CREATE TABLE orders (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES auth.users(id),
  store_id    uuid NOT NULL REFERENCES stores(id),
  status      order_status NOT NULL DEFAULT 'pending',
  total_cents integer NOT NULL CHECK (total_cents >= 0),
  created_at  timestamptz NOT NULL DEFAULT now()
);`,
      },
      { type: "h2", text: "RLS que não vira labirinto" },
      {
        type: "p",
        text: "A regra que adotamos: nunca encadear mais de 1 join dentro de uma policy. Se precisa de mais, vira function security definer.",
      },
      {
        type: "quote",
        text: "Schema bom é aquele que te deixa errar UI várias vezes sem precisar fazer migration.",
      },
    ],
  },
  {
    slug: "ia-no-desenvolvimento-onde-acerta",
    title: "IA no desenvolvimento: onde acerta, onde ainda atrapalha",
    excerpt:
      "Copiloto, agente, geração de código. O hype passa, o uso fica. Onde a gente usa, onde a gente bloqueia — e por quê.",
    tag: "IA",
    date: "2026-05-08",
    dateLabel: "Mai 2026",
    readTime: 6,
    content: [
      {
        type: "p",
        text: "Depois de um ano usando IA pesadamente no dia a dia (Copilot, Cursor, Claude, agentes), o filtro está claro. Esse texto mapeia onde a IA acelera, onde introduz risco e onde não tem volta — a régua que adotamos internamente.",
      },
      { type: "h2", text: "Onde ela é ouro" },
      {
        type: "ul",
        items: [
          "Boilerplate (form, schema, CRUD básico) — ganho de 70%+ de tempo",
          "Refator localizado com contexto pequeno e teste por perto",
          "Traduzir uma intenção em snippet — explicar a IA é como pedir code review",
          "Aprender API nova rápido: 'me mostre o jeito idiomático de fazer X'",
        ],
      },
      { type: "h2", text: "Onde ela atrapalha" },
      {
        type: "ul",
        items: [
          "Decisão arquitetural — IA otimiza para o que existe, não para o que vai vir",
          "Performance fina (memory leak, race condition) — exige engenheiro",
          "Segurança — IA inventa permissões e expõe campos sem perceber",
          "Domínio de negócio complexo — gera código plausível mas errado em sutilezas",
        ],
      },
      { type: "h2", text: "A regra interna" },
      {
        type: "p",
        text: "IA escreve, humano sênior aprova. Nenhum PR entra em main sem revisão humana. Code review existe pra IA também. Diff grande gerado por IA é diff de risco grande.",
      },
      {
        type: "code",
        lang: "ts",
        code: `// Nossa checklist antes de aceitar código gerado:
[ ] Entendi cada linha?
[ ] Testei o caminho feliz E o caminho de erro?
[ ] As permissões/validação fazem sentido?
[ ] Está alinhado com o padrão do resto do código?
[ ] Não inventou import nem nome de função?`,
      },
      {
        type: "quote",
        text: "IA é o melhor estagiário do mundo. Mas estagiário sem revisão é como deixar nota de R$100 na rua.",
      },
    ],
  },
  {
    slug: "30-dias-mvps-aprendizado",
    title:
      "O que aprendemos depois de 30 dias construindo MVPs para clientes",
    excerpt:
      "Primeiro mês, dois apps simultâneos, mais propostas que tempo. O que funciona, o que furamos e o que não vai mais acontecer.",
    tag: "Negócio",
    date: "2026-05-05",
    dateLabel: "Mai 2026",
    readTime: 5,
    content: [
      {
        type: "p",
        text: "A DreamsCraft Code tem 30 dias. Já tem dois projetos em desenvolvimento simultâneo e mais três em proposta. Esse texto é o registro honesto do que esse mês ensinou — sem narrativa de LinkedIn.",
      },
      { type: "h2", text: "1. Escopo é o produto. Não a feature." },
      {
        type: "p",
        text: "Cliente nenhum compra 'tela de login'. Compra 'meus motoristas trabalhando até sexta'. Toda discovery agora começa pelo resultado que o cliente quer mostrar pra alguém — chefe, sócio, investidor. O escopo segue daí.",
      },
      { type: "h2", text: "2. Demo semanal mata reunião mensal" },
      {
        type: "p",
        text: "Trocamos status meeting por demo de 20 min toda sexta com link clicável. Reduziu ansiedade do cliente e expôs problemas 3 semanas antes do que pegaríamos em call.",
      },
      { type: "h2", text: "3. Estimativa é um intervalo, não um número" },
      {
        type: "ul",
        items: [
          "Antes: 'vamos entregar em 6 semanas'",
          "Agora: 'cenário bom: 5 semanas. Realista: 7. Pessimista: 9'",
          "Resultado: cliente prepara expectativa interna em vez de surpresa",
        ],
      },
      {
        type: "quote",
        text: "Você não escala consultoria entregando código. Escala entregando previsibilidade.",
      },
    ],
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAdjacent(slug: string): { prev?: Post; next?: Post } {
  const i = posts.findIndex((p) => p.slug === slug);
  if (i === -1) return {};
  return { prev: posts[i - 1], next: posts[i + 1] };
}
