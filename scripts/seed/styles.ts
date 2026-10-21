import { genericFamily } from "../../lib/fonts";
import { OWN, refs, type Seed } from "./common";

type StyleSpec = {
  colors: { bg: string; surface: string; fg: string; muted: string; accent: string; accentFg: string; border: string };
  fonts: { display: string; text: string; mono: string };
  displayWeight: number;
  radius: [number, number, number];
  borderWidth: number;
  shadow: { x: number; y: number; blur: number; spread: number; color: string } | null;
  space: number;
  duration: number;
  ease: [number, number, number, number];
  tracking: number;
  uppercase?: boolean;
};

const px = (value: number) => ({ value, unit: "px" });

function tokens(s: StyleSpec) {
  const color = (v: string) => ({ $type: "color" as const, $value: v });
  return {
    color: {
      bg: color(s.colors.bg),
      surface: color(s.colors.surface),
      fg: color(s.colors.fg),
      muted: color(s.colors.muted),
      accent: color(s.colors.accent),
      "accent-fg": color(s.colors.accentFg),
      border: color(s.colors.border),
    },
    font: {
      display: { $type: "fontFamily" as const, $value: [s.fonts.display, genericFamily(s.fonts.display)] },
      text: { $type: "fontFamily" as const, $value: [s.fonts.text, genericFamily(s.fonts.text)] },
      mono: { $type: "fontFamily" as const, $value: [s.fonts.mono, genericFamily(s.fonts.mono)] },
      "display-weight": { $type: "fontWeight" as const, $value: s.displayWeight },
      tracking: { $type: "number" as const, $value: s.tracking, $description: "letter-spacing do display em em" },
      uppercase: { $type: "number" as const, $value: s.uppercase ? 1 : 0, $description: "1 = display em caixa alta" },
    },
    radius: {
      sm: { $type: "dimension" as const, $value: px(s.radius[0]) },
      md: { $type: "dimension" as const, $value: px(s.radius[1]) },
      lg: { $type: "dimension" as const, $value: px(s.radius[2]) },
    },
    border: { width: { $type: "dimension" as const, $value: px(s.borderWidth) } },
    space: { unit: { $type: "dimension" as const, $value: px(s.space) } },
    shadow: {
      card: s.shadow
        ? {
            $type: "shadow" as const,
            $value: { color: s.shadow.color, offsetX: px(s.shadow.x), offsetY: px(s.shadow.y), blur: px(s.shadow.blur), spread: px(s.shadow.spread) },
          }
        : { $type: "shadow" as const, $value: { color: "oklch(0 0 0 / 0)", offsetX: px(0), offsetY: px(0), blur: px(0), spread: px(0) } },
    },
    motion: {
      duration: { $type: "duration" as const, $value: { value: s.duration, unit: "ms" } },
      ease: { $type: "cubicBezier" as const, $value: s.ease },
    },
  };
}

const quiet: [number, number, number, number] = [0.2, 0, 0, 1];
const snap: [number, number, number, number] = [0.7, 0, 0.3, 1];
const soft: [number, number, number, number] = [0.33, 1, 0.68, 1];

type Extra = Omit<Extract<Seed, { kind: "style" }>, "kind" | "tokens" | "license"> & { spec: StyleSpec };

function style({ spec, ...rest }: Extra): Seed {
  return { kind: "style", license: OWN, tokens: tokens(spec), ...rest } as Seed;
}

export const styles: Seed[] = [
  style({
    slug: "suico",
    title: "Suíço / Internacional",
    summary: "Grade rígida, tipografia grotesca grande alinhada à esquerda, vermelho como único acento e muito branco ativo.",
    category: "clássico",
    tags: ["grid", "tipográfico", "minimal", "modernismo"],
    sectors: ["arquitetura", "consultoria", "cultura", "jurídico"],
    boldness: 3,
    when_to_use: ["Marcas que querem parecer precisas e confiáveis", "Sites com muito conteúdo textual hierarquizado", "Portfólios de arquitetura e design"],
    avoid_when: ["Produto infantil ou lúdico", "Quando o cliente pede 'aconchegante'"],
    anti_patterns: ["Centralizar o texto", "Usar mais de um acento", "Cantos arredondados grandes", "Ícones decorativos sem função"],
    pairs_with: ["grotesca-e-mono", "papel-e-vermelho", "revelar-em-linhas", "hero-assimetrico", "regua-de-numeros"],
    component_refs: ["@shadcn/button", "@shadcn/separator", "@shadcn/navigation-menu"],
    references: [refs.swiss],
    signature_moves: ["Número de seção gigante em vermelho alinhado à coluna 1", "Texto corrido em 2 colunas estreitas", "Filetes de 1px separando blocos", "Títulos com tracking negativo"],
    spec: {
      colors: { bg: "oklch(0.98 0.004 90)", surface: "oklch(0.95 0.004 90)", fg: "oklch(0.18 0 0)", muted: "oklch(0.45 0 0)", accent: "oklch(0.58 0.22 28)", accentFg: "oklch(0.99 0 0)", border: "oklch(0.18 0 0)" },
      fonts: { display: "Schibsted Grotesk", text: "Schibsted Grotesk", mono: "IBM Plex Mono" },
      displayWeight: 700, radius: [0, 0, 0], borderWidth: 1, shadow: null, space: 8, duration: 220, ease: quiet, tracking: -0.04,
    },
  }),
  style({
    slug: "editorial",
    title: "Editorial de revista",
    summary: "Serifa de alto contraste nos títulos, capitulares, legendas pequenas e ritmo de revista impressa.",
    category: "editorial",
    tags: ["serifa", "revista", "leitura", "elegante"],
    sectors: ["mídia", "cultura", "moda", "gastronomia", "ONG"],
    boldness: 3,
    when_to_use: ["Blogs e publicações", "Marcas com história para contar", "Landing de livro, evento cultural ou restaurante autoral"],
    avoid_when: ["Dashboards densos", "Ferramentas técnicas onde velocidade de leitura de dados importa mais"],
    anti_patterns: ["Serifa no texto de interface pequeno", "Linhas com mais de 75 caracteres", "Fotos genéricas de banco de imagem"],
    pairs_with: ["serifa-de-revista", "tinta-e-papel", "fade-de-capitular", "prova-social-editorial", "citacao-grande"],
    component_refs: ["@shadcn/tabs", "@shadcn/separator", "@magicui/blur-fade"],
    references: [refs.googleFonts],
    signature_moves: ["Capitular de 3 linhas no primeiro parágrafo", "Legenda em caixa alta com tracking largo", "Títulos em itálico misturado com romano", "Filete duplo antes de seções"],
    spec: {
      colors: { bg: "oklch(0.97 0.012 85)", surface: "oklch(0.94 0.016 85)", fg: "oklch(0.22 0.01 60)", muted: "oklch(0.47 0.015 60)", accent: "oklch(0.45 0.12 25)", accentFg: "oklch(0.97 0.012 85)", border: "oklch(0.8 0.02 80)" },
      fonts: { display: "Fraunces", text: "Newsreader", mono: "IBM Plex Mono" },
      displayWeight: 600, radius: [2, 2, 4], borderWidth: 1, shadow: null, space: 8, duration: 420, ease: soft, tracking: -0.02,
    },
  }),
  style({
    slug: "neo-brutalismo",
    title: "Neo-brutalismo",
    summary: "Bordas pretas grossas, sombra dura deslocada, cores chapadas saturadas e botões que 'afundam' ao clicar.",
    category: "ousado",
    tags: ["bordas", "sombra-dura", "colorido", "divertido"],
    sectors: ["startup", "educação", "criadores", "eventos"],
    boldness: 5,
    when_to_use: ["Produto jovem que quer chamar atenção", "Ferramentas para criadores", "Landing de evento ou comunidade"],
    avoid_when: ["Banco, jurídico, saúde tradicional", "Interfaces com muita informação densa"],
    anti_patterns: ["Sombra com blur (quebra o estilo)", "Mais de 3 cores chapadas na mesma tela", "Borda fina misturada com grossa sem regra"],
    pairs_with: ["display-gorda", "chapado-de-feira", "botao-que-afunda", "features-em-bento", "botao-neo-brutal"],
    component_refs: ["@shadcn/button", "@shadcn/card", "@shadcn/badge"],
    references: [refs.brutalist],
    signature_moves: ["Sombra 4px 4px 0 preta sem blur", "Hover move o elemento -2px e aumenta a sombra", "Etiquetas tortas (rotate -2deg)", "Fundo de cor chapada por seção"],
    spec: {
      colors: { bg: "oklch(0.96 0.05 95)", surface: "oklch(1 0 0)", fg: "oklch(0.15 0 0)", muted: "oklch(0.38 0 0)", accent: "oklch(0.72 0.19 145)", accentFg: "oklch(0.15 0 0)", border: "oklch(0.15 0 0)" },
      fonts: { display: "Archivo Black", text: "Archivo", mono: "Space Mono" },
      displayWeight: 400, radius: [6, 8, 12], borderWidth: 3, shadow: { x: 5, y: 5, blur: 0, spread: 0, color: "oklch(0.15 0 0)" }, space: 8, duration: 120, ease: snap, tracking: -0.01,
    },
  }),
  style({
    slug: "brutalismo",
    title: "Brutalismo cru",
    summary: "HTML quase sem estilo de propósito: fonte do sistema mono, links sublinhados azuis, layout que mostra a estrutura.",
    category: "ousado",
    tags: ["cru", "mono", "anti-design", "texto"],
    sectors: ["arte", "música", "portfólio", "manifesto"],
    boldness: 5,
    when_to_use: ["Portfólio de artista ou estúdio experimental", "Manifestos, zines, páginas de lançamento underground"],
    avoid_when: ["E-commerce", "Qualquer público que precise de confiança imediata"],
    anti_patterns: ["Fazer 'brutalismo' com gradiente e sombra", "Esconder a navegação", "Contraste baixo como estética"],
    pairs_with: ["mono-total", "terminal-verde", "texto-que-pisca", "lista-indice"],
    component_refs: ["@shadcn/table"],
    references: [refs.brutalist],
    signature_moves: ["Tabela HTML como layout", "Links sublinhados com cor padrão", "Bordas de 1px pretas em tudo", "Texto gigante quebrando a coluna"],
    spec: {
      colors: { bg: "oklch(1 0 0)", surface: "oklch(0.93 0 0)", fg: "oklch(0 0 0)", muted: "oklch(0.35 0 0)", accent: "oklch(0.45 0.27 264)", accentFg: "oklch(1 0 0)", border: "oklch(0 0 0)" },
      fonts: { display: "IBM Plex Mono", text: "IBM Plex Mono", mono: "IBM Plex Mono" },
      displayWeight: 700, radius: [0, 0, 0], borderWidth: 1, shadow: null, space: 4, duration: 0, ease: [0, 0, 1, 1], tracking: -0.03, uppercase: true,
    },
  }),
  style({
    slug: "bento",
    title: "Bento",
    summary: "Grade de caixas de tamanhos diferentes, cada uma com uma ideia, cantos generosos e superfícies em tons próximos.",
    category: "produto",
    tags: ["grid", "cards", "produto", "features"],
    sectors: ["SaaS", "apps", "hardware", "portfólio"],
    boldness: 2,
    when_to_use: ["Mostrar várias funcionalidades de produto de uma vez", "Página 'sobre mim' com blocos de informação", "Resumo de métricas"],
    avoid_when: ["Conteúdo linear que precisa ser lido em ordem", "Pouco conteúdo (fica vazio)"],
    anti_patterns: ["Todas as caixas do mesmo tamanho (vira grade comum)", "Um ícone + 3 palavras em cada caixa", "Gradiente diferente em cada card"],
    pairs_with: ["grotesca-amigavel", "grafite-e-lima", "entrada-em-cascata", "features-em-bento", "card-de-metrica"],
    component_refs: ["@magicui/bento-grid", "@shadcn/card", "@magicui/number-ticker"],
    references: [refs.bento],
    signature_moves: ["Uma caixa 2x2 dominante com a ideia principal", "Caixas com mini demos reais, não ícones", "Gap pequeno e constante", "Raio interno = raio externo − padding"],
    spec: {
      colors: { bg: "oklch(0.97 0.003 250)", surface: "oklch(1 0 0)", fg: "oklch(0.2 0.01 250)", muted: "oklch(0.5 0.01 250)", accent: "oklch(0.55 0.16 150)", accentFg: "oklch(0.99 0 0)", border: "oklch(0.9 0.005 250)" },
      fonts: { display: "Bricolage Grotesque", text: "Figtree", mono: "JetBrains Mono" },
      displayWeight: 700, radius: [10, 16, 24], borderWidth: 1, shadow: { x: 0, y: 1, blur: 2, spread: 0, color: "oklch(0.2 0.01 250 / 0.08)" }, space: 8, duration: 320, ease: soft, tracking: -0.03,
    },
  }),
  style({
    slug: "terminal-dev",
    title: "Terminal / dev",
    summary: "Fundo quase preto, fonte mono em tudo, cursor piscando, prompts e cor de fósforo como acento.",
    category: "tech",
    tags: ["mono", "escuro", "dev", "cli"],
    sectors: ["devtools", "API", "segurança", "infra"],
    boldness: 4,
    when_to_use: ["Ferramentas de desenvolvedor, CLIs, APIs", "Documentação técnica com personalidade"],
    avoid_when: ["Público não técnico", "Textos longos de marketing"],
    anti_patterns: ["Verde neon em texto corrido longo", "Simular terminal com efeito 'matrix' chovendo", "Monoespaçada com tracking apertado"],
    pairs_with: ["mono-total", "terminal-verde", "digitando", "cursor-piscando", "bloco-de-comando"],
    component_refs: ["@magicui/terminal", "@shadcn/command", "@magicui/typing-animation"],
    references: [],
    signature_moves: ["Prompt '$' antes de cada título", "Comentários '//' como subtítulos", "Bordas tracejadas", "Status com [ok] e [erro]"],
    spec: {
      colors: { bg: "oklch(0.17 0.01 160)", surface: "oklch(0.22 0.012 160)", fg: "oklch(0.9 0.03 150)", muted: "oklch(0.68 0.03 150)", accent: "oklch(0.84 0.2 145)", accentFg: "oklch(0.17 0.01 160)", border: "oklch(0.35 0.02 160)" },
      fonts: { display: "JetBrains Mono", text: "JetBrains Mono", mono: "JetBrains Mono" },
      displayWeight: 700, radius: [2, 4, 6], borderWidth: 1, shadow: null, space: 8, duration: 160, ease: quiet, tracking: -0.02,
    },
  }),
  style({
    slug: "organico-quente",
    title: "Orgânico / quente",
    summary: "Tons de barro e creme, formas arredondadas irregulares, serifa macia e textura de papel.",
    category: "humano",
    tags: ["quente", "natural", "arredondado", "artesanal"],
    sectors: ["gastronomia", "bem-estar", "saúde", "cosméticos", "café"],
    boldness: 2,
    when_to_use: ["Marcas artesanais, cafés, padarias", "Bem-estar, terapia, produtos naturais"],
    avoid_when: ["Produtos de tecnologia de ponta", "Finanças com tom institucional"],
    anti_patterns: ["Folhinhas clip-art", "Bege sem contraste (texto ilegível)", "Script cursiva no texto corrido"],
    pairs_with: ["serifa-macia", "barro-e-creme", "flutuar-suave", "blob-organico", "depoimento-em-cartao"],
    component_refs: ["@shadcn/card", "@shadcn/accordion"],
    references: [],
    signature_moves: ["Blobs com border-radius assimétrico", "Fotos com cantos muito arredondados", "Textura de papel granulada", "Títulos em serifa com itálico"],
    spec: {
      colors: { bg: "oklch(0.95 0.025 75)", surface: "oklch(0.91 0.035 70)", fg: "oklch(0.28 0.04 45)", muted: "oklch(0.47 0.045 50)", accent: "oklch(0.55 0.13 40)", accentFg: "oklch(0.97 0.02 75)", border: "oklch(0.82 0.04 65)" },
      fonts: { display: "Young Serif", text: "Figtree", mono: "DM Mono" },
      displayWeight: 400, radius: [12, 22, 40], borderWidth: 0, shadow: { x: 0, y: 8, blur: 24, spread: -8, color: "oklch(0.4 0.06 45 / 0.25)" }, space: 8, duration: 600, ease: soft, tracking: -0.01,
    },
  }),
  style({
    slug: "luxo-sobrio",
    title: "Luxo sóbrio",
    summary: "Preto profundo, dourado contido, serifa fina com muito espaço e nada piscando. Silêncio como sinal de preço.",
    category: "premium",
    tags: ["premium", "escuro", "serifa", "minimal"],
    sectors: ["joalheria", "imobiliário", "hotelaria", "advocacia", "vinhos"],
    boldness: 2,
    when_to_use: ["Produtos de alto ticket", "Imobiliário de alto padrão", "Escritórios que querem parecer exclusivos"],
    avoid_when: ["Promoções, varejo de volume", "Apps com muita interação"],
    anti_patterns: ["Dourado em gradiente brilhante", "Muitas animações", "Fonte script 'chique'", "Texto pequeno demais em cinza no preto"],
    pairs_with: ["didone-fina", "noite-e-ouro", "fade-lento", "hero-tela-cheia-lateral", "botao-fantasma-fino"],
    component_refs: ["@shadcn/button", "@shadcn/dialog"],
    references: [],
    signature_moves: ["Caixa alta pequena com tracking 0.3em", "Filete dourado de 1px", "Margens enormes", "Uma única imagem por dobra"],
    spec: {
      colors: { bg: "oklch(0.15 0.005 80)", surface: "oklch(0.2 0.006 80)", fg: "oklch(0.93 0.01 85)", muted: "oklch(0.72 0.015 85)", accent: "oklch(0.78 0.09 85)", accentFg: "oklch(0.15 0.005 80)", border: "oklch(0.4 0.03 85)" },
      fonts: { display: "Cormorant Garamond", text: "Hanken Grotesk", mono: "IBM Plex Mono" },
      displayWeight: 500, radius: [0, 0, 2], borderWidth: 1, shadow: null, space: 10, duration: 800, ease: [0.4, 0, 0.2, 1], tracking: 0.02, uppercase: true,
    },
  }),
  style({
    slug: "risografia",
    title: "Risografia",
    summary: "Duas ou três tintas chapadas com sobreposição, desalinhamento leve de impressão e grão forte.",
    category: "gráfico",
    tags: ["impressão", "grão", "duotone", "cultura"],
    sectors: ["eventos", "música", "editoras", "festivais", "café"],
    boldness: 4,
    when_to_use: ["Cartazes de evento, festival, zine", "Marcas independentes com pegada gráfica"],
    avoid_when: ["Interfaces de produto com muito estado", "Marcas que precisam de neutralidade"],
    anti_patterns: ["Usar mais de 3 tintas", "Grão por cima do texto pequeno", "Desalinhamento em botões (parece bug)"],
    pairs_with: ["display-gorda", "riso-rosa-e-azul", "grao-de-papel", "sobreposicao-de-tintas", "cartaz-tipografico"],
    component_refs: ["@shadcn/badge"],
    references: [refs.noise],
    signature_moves: ["mix-blend-mode: multiply entre duas cores", "Sombra de texto deslocada 2px em outra tinta", "Grão SVG por cima de imagens", "Halftone em fotos"],
    spec: {
      colors: { bg: "oklch(0.95 0.015 90)", surface: "oklch(0.91 0.02 90)", fg: "oklch(0.3 0.12 260)", muted: "oklch(0.42 0.1 260)", accent: "oklch(0.66 0.21 0)", accentFg: "oklch(0.2 0.08 260)", border: "oklch(0.3 0.12 260)" },
      fonts: { display: "Bricolage Grotesque", text: "Karla", mono: "Space Mono" },
      displayWeight: 800, radius: [0, 4, 8], borderWidth: 2, shadow: { x: 3, y: 3, blur: 0, spread: 0, color: "oklch(0.66 0.21 0)" }, space: 8, duration: 260, ease: snap, tracking: -0.03, uppercase: true,
    },
  }),
  style({
    slug: "minimal-japones",
    title: "Minimal japonês",
    summary: "Muito vazio, alinhamento assimétrico, tipografia pequena e precisa, um ponto de cor como selo.",
    category: "minimal",
    tags: ["ma", "vazio", "calmo", "assimétrico"],
    sectors: ["arquitetura", "cerâmica", "moda", "chá", "estúdio"],
    boldness: 1,
    when_to_use: ["Marcas de produto físico artesanal", "Portfólio de arquitetura, fotografia"],
    avoid_when: ["Muito conteúdo para mostrar", "Público que precisa de CTA óbvio e grande"],
    anti_patterns: ["Usar caracteres japoneses como decoração sem sentido", "Vermelho em excesso (é selo, não tema)", "Centralizar tudo"],
    pairs_with: ["serifa-de-livro", "papel-de-arroz", "fade-lento", "texto-vertical", "galeria-em-rio"],
    component_refs: ["@shadcn/separator"],
    references: [],
    signature_moves: ["Texto vertical (writing-mode) como rótulo", "Selo quadrado vermelho pequeno", "Margem lateral de 20% vazia", "Números de página discretos"],
    spec: {
      colors: { bg: "oklch(0.97 0.006 95)", surface: "oklch(0.94 0.008 95)", fg: "oklch(0.25 0.005 95)", muted: "oklch(0.5 0.008 95)", accent: "oklch(0.55 0.19 30)", accentFg: "oklch(0.98 0 0)", border: "oklch(0.86 0.006 95)" },
      fonts: { display: "Shippori Mincho", text: "Zen Kaku Gothic New", mono: "IBM Plex Mono" },
      displayWeight: 500, radius: [0, 2, 2], borderWidth: 1, shadow: null, space: 12, duration: 700, ease: [0.25, 0.1, 0.25, 1], tracking: 0.04,
    },
  }),
  style({
    slug: "dark-tech-sobrio",
    title: "Dark tech sóbrio",
    summary: "Escuro com hierarquia por luminosidade, grade fina de fundo, um único acento elétrico e nada de neon espalhado.",
    category: "tech",
    tags: ["escuro", "produto", "grid", "preciso"],
    sectors: ["SaaS", "IA", "fintech", "infra"],
    boldness: 3,
    when_to_use: ["Produtos técnicos para times", "Landing de API, infraestrutura, dados"],
    avoid_when: ["Público geral que espera claro e amigável", "Conteúdo editorial longo"],
    anti_patterns: ["Gradiente roxo/azul atrás do hero", "Glow em todos os cards", "Texto cinza 50% no preto (falha AA)"],
    pairs_with: ["grotesca-e-mono", "grafite-e-lima", "grade-de-pontos", "spotlight-no-cursor", "features-em-bento"],
    component_refs: ["@magicui/dot-pattern", "@magicui/border-beam", "@shadcn/tabs"],
    references: [],
    signature_moves: ["Grade de linhas 1px com máscara radial", "Bordas 1px com 10% de branco", "Rótulos em mono caixa alta", "Um único elemento com acento por tela"],
    spec: {
      colors: { bg: "oklch(0.16 0.005 260)", surface: "oklch(0.2 0.006 260)", fg: "oklch(0.95 0.003 260)", muted: "oklch(0.72 0.01 260)", accent: "oklch(0.88 0.19 125)", accentFg: "oklch(0.18 0.02 125)", border: "oklch(0.32 0.008 260)" },
      fonts: { display: "Geist", text: "Geist", mono: "Geist Mono" },
      displayWeight: 600, radius: [6, 10, 14], borderWidth: 1, shadow: { x: 0, y: 0, blur: 0, spread: 1, color: "oklch(1 0 0 / 0.06)" }, space: 8, duration: 200, ease: quiet, tracking: -0.035,
    },
  }),
  style({
    slug: "industrial-mineiro",
    title: "Industrial / chão de fábrica",
    summary: "Amarelo de segurança, preto, condensada pesada, números grandes e etiquetas técnicas. Força sem enfeite.",
    category: "setor",
    tags: ["industrial", "condensada", "amarelo", "técnico"],
    sectors: ["indústria", "logística", "construção", "mineração", "automotivo"],
    boldness: 4,
    when_to_use: ["Empresas industriais e B2B pesado", "Catálogo técnico de produtos", "Logística e frota"],
    avoid_when: ["Saúde, bem-estar", "Marcas que querem delicadeza"],
    anti_patterns: ["Faixa zebrada amarela/preta em tudo", "Fotos de capacete genéricas", "Ícones de engrenagem"],
    pairs_with: ["condensada-industrial", "seguranca-amarelo", "contador-de-numeros", "regua-de-numeros", "tabela-de-especificacao"],
    component_refs: ["@shadcn/table", "@magicui/number-ticker"],
    references: [],
    signature_moves: ["Números de especificação gigantes", "Etiquetas tipo placa técnica", "Grade de 12 colunas visível em detalhes", "Condensada em caixa alta"],
    spec: {
      colors: { bg: "oklch(0.96 0.005 95)", surface: "oklch(0.9 0.006 95)", fg: "oklch(0.18 0 0)", muted: "oklch(0.42 0 0)", accent: "oklch(0.86 0.17 92)", accentFg: "oklch(0.18 0 0)", border: "oklch(0.18 0 0)" },
      fonts: { display: "Big Shoulders Display", text: "Barlow", mono: "Chivo Mono" },
      displayWeight: 800, radius: [0, 2, 4], borderWidth: 2, shadow: null, space: 8, duration: 180, ease: snap, tracking: 0, uppercase: true,
    },
  }),
  style({
    slug: "memphis-contido",
    title: "Memphis contido",
    summary: "Formas geométricas soltas, padrões de rabisco e cores pastel com um preto firme, usado com moderação.",
    category: "lúdico",
    tags: ["geométrico", "colorido", "anos-80", "lúdico"],
    sectors: ["educação", "infantil", "eventos", "agências"],
    boldness: 4,
    when_to_use: ["Produtos educativos, escolas, cursos", "Agências criativas e eventos"],
    avoid_when: ["Ferramentas profissionais sérias", "Saúde e finanças"],
    anti_patterns: ["Formas cobrindo o texto", "Mais de 5 cores", "Animar todas as formas ao mesmo tempo"],
    pairs_with: ["display-gorda", "pastel-com-preto", "flutuar-suave", "formas-soltas"],
    component_refs: ["@shadcn/card", "@shadcn/badge"],
    references: [],
    signature_moves: ["Triângulos e círculos soltos nas margens", "Padrão de zigue-zague como divisor", "Pastel chapado com contorno preto", "Títulos levemente rotacionados"],
    spec: {
      colors: { bg: "oklch(0.97 0.02 90)", surface: "oklch(0.9 0.07 200)", fg: "oklch(0.18 0.01 280)", muted: "oklch(0.4 0.02 280)", accent: "oklch(0.75 0.15 350)", accentFg: "oklch(0.18 0.01 280)", border: "oklch(0.18 0.01 280)" },
      fonts: { display: "Syne", text: "Karla", mono: "Space Mono" },
      displayWeight: 800, radius: [4, 10, 999], borderWidth: 2, shadow: { x: 3, y: 3, blur: 0, spread: 0, color: "oklch(0.18 0.01 280)" }, space: 8, duration: 360, ease: [0.34, 1.56, 0.64, 1], tracking: -0.02,
    },
  }),
  style({
    slug: "academico-arquivo",
    title: "Arquivo acadêmico",
    summary: "Catálogo de biblioteca: fichas, números de referência, serifa de livro e mono para metadados, tudo em papel envelhecido.",
    category: "editorial",
    tags: ["arquivo", "catálogo", "serifa", "metadados"],
    sectors: ["educação", "pesquisa", "museus", "editoras", "jurídico"],
    boldness: 2,
    when_to_use: ["Repositórios, bibliotecas, coleções", "Portfólio de pesquisa ou acervo"],
    avoid_when: ["Produto que precisa parecer novo e rápido"],
    anti_patterns: ["Textura de papel exagerada", "Fonte 'máquina de escrever' em tudo"],
    pairs_with: ["serifa-de-livro", "tinta-e-papel", "revelar-em-linhas", "lista-indice", "ficha-catalografica"],
    component_refs: ["@shadcn/table", "@shadcn/hover-card"],
    references: [],
    signature_moves: ["Metadados em mono com rótulos 'ref.', 'vol.'", "Cards como fichas com furo", "Numeração de itens 001, 002", "Filetes pontilhados"],
    spec: {
      colors: { bg: "oklch(0.94 0.02 85)", surface: "oklch(0.97 0.012 85)", fg: "oklch(0.24 0.02 60)", muted: "oklch(0.46 0.025 60)", accent: "oklch(0.45 0.09 160)", accentFg: "oklch(0.97 0.012 85)", border: "oklch(0.7 0.03 75)" },
      fonts: { display: "Libre Caslon Display", text: "Libre Caslon Text", mono: "Courier Prime" },
      displayWeight: 400, radius: [0, 2, 2], borderWidth: 1, shadow: { x: 0, y: 1, blur: 0, spread: 0, color: "oklch(0.5 0.03 75 / 0.4)" }, space: 8, duration: 300, ease: quiet, tracking: -0.01,
    },
  }),
];
