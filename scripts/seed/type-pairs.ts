import { FONT_CATALOG } from "../../lib/fonts";
import { OWN, refs, type Seed } from "./common";

function f(family: string, weights?: number[]) {
  const entry = FONT_CATALOG[family];
  if (!entry) throw new Error(`font not in catalog: ${family}`);
  return { family, source: "google" as const, license: "OFL-1.1" as const, weights: weights ?? entry.weights, italic: !!entry.italic };
}

function steps(base: number, ratio: number) {
  return [-1, 0, 1, 2, 3, 4, 5].map((n) => Math.round(base * ratio ** n * 10) / 10);
}

type P = {
  slug: string;
  title: string;
  summary: string;
  display: string;
  text: string;
  mono?: string;
  ratio: number;
  base?: number;
  headline: string;
  body: string;
  tags: string[];
  sectors: string[];
  boldness: number;
  use: string[];
  avoid: string[];
  pairs?: string[];
  category: string;
};

function pair(p: P): Seed {
  const base = p.base ?? 16;
  return {
    kind: "type_pair",
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    category: p.category,
    tags: p.tags,
    sectors: p.sectors,
    boldness: p.boldness,
    when_to_use: p.use,
    avoid_when: p.avoid,
    anti_patterns: ["Usar mais de dois pesos do display na mesma tela", "Texto corrido abaixo de 16px no celular", "Tracking positivo em minúsculas"],
    pairs_with: p.pairs ?? [],
    component_refs: [],
    references: [refs.googleFonts, refs.ofl],
    license: OWN,
    display: f(p.display),
    text: f(p.text),
    mono: p.mono ? f(p.mono) : undefined,
    scale: { ratio: p.ratio, base_px: base, steps: steps(base, p.ratio) },
    sample: { headline: p.headline, body: p.body },
  };
}

export const typePairs: Seed[] = [
  pair({ slug: "grotesca-e-mono", title: "Grotesca + mono", category: "neutro", display: "Schibsted Grotesk", text: "Schibsted Grotesk", mono: "IBM Plex Mono", ratio: 1.333, summary: "Grotesca de jornal com mono para rótulos e números. Séria, precisa, sem frieza.", headline: "Projeto, prazo e preço na mesa.", body: "Uma grotesca de jornal carrega o texto inteiro. A mono entra só em rótulos, datas e números de referência.", tags: ["grotesca", "mono", "neutro"], sectors: ["consultoria", "SaaS", "arquitetura"], boldness: 2, use: ["Sites institucionais modernos", "Produto B2B"], avoid: ["Marcas lúdicas"], pairs: ["suico", "dark-tech-sobrio"] }),
  pair({ slug: "serifa-de-revista", title: "Serifa de revista", category: "editorial", display: "Fraunces", text: "Newsreader", mono: "IBM Plex Mono", ratio: 1.414, base: 18, summary: "Fraunces com eixo óptico nos títulos e Newsreader para leitura longa. Cara de revista boa.", headline: "O que sobra quando a moda passa", body: "Newsreader foi desenhada para tela e aguenta parágrafos longos. Fraunces dá o drama nos títulos sem virar caricatura.", tags: ["serifa", "editorial", "leitura"], sectors: ["mídia", "cultura", "gastronomia"], boldness: 3, use: ["Blogs, revistas, newsletters", "Landing de restaurante autoral"], avoid: ["Dashboards"], pairs: ["editorial"] }),
  pair({ slug: "display-gorda", title: "Display gorda", category: "ousado", display: "Archivo Black", text: "Archivo", mono: "Space Mono", ratio: 1.5, summary: "Grotesca preta e larga para gritar no título, Archivo normal para o resto.", headline: "Faz barulho. Depois explica.", body: "Archivo Black só funciona grande. Abaixo de 32px ela embola, então o texto fica com a Archivo regular.", tags: ["pesada", "cartaz", "impacto"], sectors: ["eventos", "startup", "esporte"], boldness: 5, use: ["Neo-brutalismo", "Cartaz, evento, campanha"], avoid: ["Marcas discretas"], pairs: ["neo-brutalismo", "risografia", "memphis-contido"] }),
  pair({ slug: "mono-total", title: "Mono total", category: "tech", display: "JetBrains Mono", text: "JetBrains Mono", mono: "JetBrains Mono", ratio: 1.25, base: 15, summary: "Uma mono só, em três pesos. Para quem quer cara de ferramenta.", headline: "$ deploy --prod", body: "Monoespaçada em tudo exige escala curta e entrelinha generosa. Use peso, não tamanho, para hierarquia.", tags: ["mono", "dev", "cli"], sectors: ["devtools", "API"], boldness: 4, use: ["Terminal/dev", "Documentação de API"], avoid: ["Textos longos de marketing"], pairs: ["terminal-dev", "brutalismo"] }),
  pair({ slug: "grotesca-amigavel", title: "Grotesca amigável", category: "produto", display: "Bricolage Grotesque", text: "Figtree", mono: "JetBrains Mono", ratio: 1.333, summary: "Bricolage tem personalidade nos detalhes; Figtree é limpa e lê bem em interface.", headline: "Tudo que seu time precisa, sem planilha.", body: "Bricolage no título dá calor sem perder seriedade. Figtree segura formulários, tabelas e menus.", tags: ["produto", "amigável", "SaaS"], sectors: ["SaaS", "apps", "educação"], boldness: 3, use: ["Landing de produto", "Bento"], avoid: ["Luxo"], pairs: ["bento"] }),
  pair({ slug: "serifa-macia", title: "Serifa macia", category: "humano", display: "Young Serif", text: "Figtree", mono: "DM Mono", ratio: 1.333, summary: "Serifa arredondada e quente com sans simples. Acolhedor sem ser infantil.", headline: "Pão de fermentação natural, todo dia às 7h", body: "Young Serif tem terminais redondos que lembram letreiro pintado à mão. Combina com tons de barro.", tags: ["quente", "artesanal", "serifa"], sectors: ["café", "padaria", "bem-estar"], boldness: 2, use: ["Orgânico/quente", "Gastronomia"], avoid: ["Tech"], pairs: ["organico-quente"] }),
  pair({ slug: "didone-fina", title: "Didone fina", category: "premium", display: "Cormorant Garamond", text: "Hanken Grotesk", mono: "IBM Plex Mono", ratio: 1.5, summary: "Garamond fina e alta com sans leve. Luxo silencioso.", headline: "Residências com vista para a serra", body: "Cormorant precisa de tamanho: use acima de 40px. A Hanken leve no texto mantém o ar sem competir.", tags: ["luxo", "serifa", "fino"], sectors: ["imobiliário", "joalheria", "hotelaria"], boldness: 2, use: ["Luxo sóbrio", "Convites, hotelaria"], avoid: ["Interfaces pequenas"], pairs: ["luxo-sobrio"] }),
  pair({ slug: "serifa-de-livro", title: "Serifa de livro", category: "editorial", display: "EB Garamond", text: "EB Garamond", mono: "Courier Prime", ratio: 1.25, base: 18, summary: "Garamond clássica em tudo, com Courier para notas. Cheiro de livro.", headline: "Notas sobre o acervo, volume II", body: "Uma serifa só, com itálico de verdade, resolve quase tudo em projetos editoriais e de acervo.", tags: ["livro", "clássico", "leitura"], sectors: ["editoras", "museus", "pesquisa"], boldness: 1, use: ["Arquivo acadêmico", "Minimal japonês"], avoid: ["Apps"], pairs: ["academico-arquivo", "minimal-japones"] }),
  pair({ slug: "condensada-industrial", title: "Condensada industrial", category: "setor", display: "Big Shoulders Display", text: "Barlow", mono: "Chivo Mono", ratio: 1.5, summary: "Condensada alta inspirada em sinalização, com Barlow técnica no texto.", headline: "Capacidade de 40 t por turno", body: "Big Shoulders em caixa alta segura números e especificações. Barlow é legível em tabelas técnicas.", tags: ["condensada", "industrial", "técnico"], sectors: ["indústria", "logística", "construção"], boldness: 4, use: ["Industrial", "Catálogo técnico"], avoid: ["Bem-estar"], pairs: ["industrial-mineiro"] }),
  pair({ slug: "instrument-duo", title: "Instrument duo", category: "editorial", display: "Instrument Serif", text: "Instrument Sans", mono: "JetBrains Mono", ratio: 1.5, summary: "Serifa condensada e elegante com a sans da mesma família. Moderno com um pé no editorial.", headline: "Estúdio de marca para quem faz coisas", body: "Instrument Serif tem um itálico lindo para destacar uma palavra no título. A sans irmã cuida do resto.", tags: ["moderno", "editorial", "estúdio"], sectors: ["agências", "portfólio", "moda"], boldness: 3, use: ["Portfólio, estúdio", "Landing de produto com tom editorial"], avoid: ["Texto display pequeno"] }),
  pair({ slug: "slab-de-jornal", title: "Slab de jornal", category: "editorial", display: "Zilla Slab", text: "Libre Franklin", mono: "Courier Prime", ratio: 1.333, summary: "Slab forte de manchete com Franklin no texto. Jornal de bairro bem feito.", headline: "Feira volta à praça neste sábado", body: "Serifa quadrada passa confiança e urgência. Franklin é a sans clássica de jornal americano.", tags: ["jornal", "slab", "notícia"], sectors: ["mídia", "comunidade", "ONG"], boldness: 3, use: ["Portais de notícia locais", "Newsletter"], avoid: ["Luxo"] }),
  pair({ slug: "geometrica-limpa", title: "Geométrica limpa", category: "produto", display: "Outfit", text: "Onest", mono: "Martian Mono", ratio: 1.25, summary: "Geométrica redonda com sans de texto russa muito legível. Produto calmo.", headline: "Agende, confirme, receba.", body: "Outfit é simples e geométrica. Onest foi feita para interface e tem números tabulares bons.", tags: ["geométrica", "app", "calmo"], sectors: ["saúde", "agendamento", "fintech"], boldness: 2, use: ["Apps de serviço", "Saúde digital"], avoid: ["Editorial"] }),
  pair({ slug: "didone-de-moda", title: "Didone de moda", category: "premium", display: "Bodoni Moda", text: "Work Sans", ratio: 1.618, summary: "Bodoni de contraste extremo, grande, com Work Sans neutra. Capa de revista de moda.", headline: "Coleção Inverno", body: "Bodoni Moda tem eixo óptico. Grande, mostra filetes finíssimos; pequena, engrossa para não sumir.", tags: ["moda", "didone", "contraste"], sectors: ["moda", "beleza", "joalheria"], boldness: 4, use: ["E-commerce de moda", "Lookbook"], avoid: ["Interfaces densas"] }),
  pair({ slug: "pixel-retro", title: "Pixel retrô", category: "lúdico", display: "Silkscreen", text: "Space Mono", mono: "VT323", ratio: 1.25, summary: "Fonte de pixel para títulos curtos e mono arredondada no texto. Fliperama sem exagero.", headline: "NÍVEL 2 LIBERADO", body: "Pixel só no título, curto e grande. Texto corrido em pixel cansa em três linhas.", tags: ["pixel", "games", "retrô"], sectors: ["games", "eventos", "criadores"], boldness: 5, use: ["Games indie", "Hackathon"], avoid: ["Qualquer coisa séria"] }),
  pair({ slug: "humanista-acessivel", title: "Humanista acessível", category: "acessível", display: "Atkinson Hyperlegible", text: "Atkinson Hyperlegible", mono: "IBM Plex Mono", ratio: 1.25, base: 17, summary: "Fonte feita para baixa visão em tudo. Quando legibilidade é o requisito número um.", headline: "Seu exame está pronto", body: "Atkinson distingue letras parecidas como I, l e 1. Ideal para saúde, governo e público idoso.", tags: ["acessibilidade", "legível", "saúde"], sectors: ["saúde", "governo", "educação"], boldness: 1, use: ["Serviço público, saúde", "Público idoso"], avoid: ["Marca que precisa de muito caráter"] }),
  pair({ slug: "grotesca-larga", title: "Grotesca larga", category: "ousado", display: "Unbounded", text: "Manrope", mono: "JetBrains Mono", ratio: 1.414, summary: "Display larga e redonda que ocupa espaço, com Manrope compacta. Cripto sem o clichê.", headline: "Pague em segundos", body: "Unbounded é muito larga: títulos curtos, de 2 a 4 palavras. Manrope equilibra com proporções estreitas.", tags: ["larga", "fintech", "moderno"], sectors: ["fintech", "web3", "esporte"], boldness: 4, use: ["Fintech jovem", "Esporte"], avoid: ["Títulos longos"] }),
  pair({ slug: "serifa-gorda-e-grotesca", title: "Serifa gorda + grotesca", category: "editorial", display: "Gloock", text: "Familjen Grotesk", mono: "DM Mono", ratio: 1.414, summary: "Serifa pesada de alto contraste com grotesca de caráter. Editorial com músculo.", headline: "Comida honesta, preço justo", body: "Gloock é preta e expressiva. Familjen tem detalhes curiosos que aparecem só de perto.", tags: ["serifa", "pesada", "editorial"], sectors: ["gastronomia", "cultura", "editoras"], boldness: 4, use: ["Restaurante, bar", "Revista independente"], avoid: ["SaaS técnico"] }),
  pair({ slug: "manuscrita-e-sans", title: "Manuscrita + sans", category: "humano", display: "Caveat", text: "DM Sans", ratio: 1.333, summary: "Letra de mão para anotações pontuais, DM Sans para tudo o resto.", headline: "feito à mão, com calma", body: "Caveat funciona como bilhete: uma palavra, uma seta, uma nota de margem. Nunca no parágrafo.", tags: ["manuscrita", "pessoal", "notas"], sectors: ["educação", "criadores", "papelaria"], boldness: 3, use: ["Anotações sobre screenshots", "Marca pessoal"], avoid: ["Corporativo"] }),
  pair({ slug: "serifa-tecnica", title: "Serifa técnica", category: "neutro", display: "IBM Plex Serif", text: "IBM Plex Sans", mono: "IBM Plex Mono", ratio: 1.25, summary: "Família Plex completa: serifa, sans e mono desenhadas juntas. Corporativo bem resolvido.", headline: "Relatório anual 2026", body: "Usar a família inteira garante alturas de x iguais e convivência pacífica entre as três.", tags: ["corporativo", "família", "relatório"], sectors: ["jurídico", "consultoria", "governo"], boldness: 1, use: ["Relatórios, documentos", "Sites institucionais"], avoid: ["Marcas jovens"] }),
  pair({ slug: "cartaz-condensado", title: "Cartaz condensado", category: "ousado", display: "Bebas Neue", text: "Karla", mono: "Space Mono", ratio: 1.618, summary: "Bebas em caixa alta gigante com Karla simpática. Cartaz de show.", headline: "SEXTA 22H AO VIVO", body: "Bebas só tem caixa alta e um peso. Escala grande, entrelinha apertada, e deixe a Karla explicar.", tags: ["cartaz", "condensada", "evento"], sectors: ["música", "eventos", "esporte"], boldness: 5, use: ["Evento, show, academia"], avoid: ["Texto longo"] }),
  pair({ slug: "literata-livro-digital", title: "Livro digital", category: "editorial", display: "Literata", text: "Literata", mono: "Fragment Mono", ratio: 1.2, base: 18, summary: "Literata foi feita para e-books. Uma família só para leitura longa em tela.", headline: "Capítulo 3: a volta", body: "Escala curta e entrelinha de 1,6 deixam a página respirar. Itálico para ênfase, nunca negrito.", tags: ["leitura", "livro", "longo"], sectors: ["editoras", "blogs", "educação"], boldness: 1, use: ["Leitura longa", "Documentação narrativa"], avoid: ["Landing curta"] }),
  pair({ slug: "abril-e-franklin", title: "Abril + Franklin", category: "editorial", display: "Abril Fatface", text: "Libre Franklin", ratio: 1.5, summary: "Didone gorda de cartaz antigo com Franklin. Clássico de pôster.", headline: "Grande Circo Nacional", body: "Abril é a didone de pôster do século XIX. Use em uma linha, grande, com a Franklin sóbria embaixo.", tags: ["pôster", "didone", "retrô"], sectors: ["cultura", "eventos", "bar"], boldness: 4, use: ["Cartaz, cardápio", "Eventos culturais"], avoid: ["Interface"] }),
  pair({ slug: "sora-e-plex-mono", title: "Sora + Plex Mono", category: "tech", display: "Sora", text: "Sora", mono: "IBM Plex Mono", ratio: 1.25, summary: "Geométrica tecnológica sem ser fria, com mono para dados.", headline: "Infra que escala sozinha", body: "Sora tem aberturas largas e funciona bem em telas escuras. A mono separa o que é dado do que é texto.", tags: ["tech", "geométrica", "escuro"], sectors: ["SaaS", "IA", "infra"], boldness: 2, use: ["Produto técnico", "Dark tech"], avoid: ["Editorial"] }),
  pair({ slug: "mincho-e-gothic", title: "Mincho + Gothic", category: "minimal", display: "Shippori Mincho", text: "Zen Kaku Gothic New", mono: "IBM Plex Mono", ratio: 1.25, summary: "Serifa japonesa (mincho) com gótica limpa. Funciona em latim e japonês.", headline: "Cerâmica feita em pequenos lotes", body: "As duas cobrem latim e japonês, então a mesma página pode misturar idiomas sem trocar de fonte.", tags: ["japonês", "minimal", "calmo"], sectors: ["cerâmica", "chá", "arquitetura"], boldness: 1, use: ["Minimal japonês"], avoid: ["Interfaces densas"], pairs: ["minimal-japones"] }),
  pair({ slug: "syne-e-karla", title: "Syne + Karla", category: "lúdico", display: "Syne", text: "Karla", mono: "Space Mono", ratio: 1.414, summary: "Syne extra-bold larga e estranha com Karla simpática. Agência criativa.", headline: "Ideias que fazem barulho", body: "Syne muda muito entre pesos. No 800 ela fica larga e peculiar, ótima para marcas criativas.", tags: ["criativo", "agência", "estranho"], sectors: ["agências", "eventos", "cultura"], boldness: 4, use: ["Memphis contido", "Agência"], avoid: ["Saúde"], pairs: ["memphis-contido"] }),
  pair({ slug: "epilogue-editorial-tech", title: "Epilogue editorial tech", category: "produto", display: "Epilogue", text: "Rethink Sans", mono: "Red Hat Mono", ratio: 1.333, summary: "Epilogue pesada e compacta com Rethink Sans. Produto com voz.", headline: "Escreva menos, entregue mais", body: "Epilogue fica ótima em 800 com tracking negativo. Rethink Sans foi feita para interfaces modernas.", tags: ["produto", "compacto", "moderno"], sectors: ["SaaS", "criadores", "mídia"], boldness: 3, use: ["Landing de produto com personalidade"], avoid: ["Luxo"] }),
];
