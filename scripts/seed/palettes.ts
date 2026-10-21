import { contrast } from "../../lib/color";
import { OWN, refs, type Seed } from "./common";

type T = [number, number, number];
type Roles = { bg: T; surface: T; fg: T; muted: T; accent: T; accent_fg: T; danger: T };

const str = ([l, c, h]: T) => `oklch(${+l.toFixed(3)} ${+c.toFixed(3)} ${+h.toFixed(1)})`;

// Nudges lightness away from the background until the pair reaches the target ratio.
function fit(color: T, against: T, target: number): T {
  const out: T = [...color];
  const dir = against[0] > 0.6 ? -1 : 1;
  for (let i = 0; i < 100 && contrast(str(out), str(against)) < target; i++) out[0] = Math.min(1, Math.max(0, out[0] + dir * 0.01));
  return out;
}

function fitAccentFg(fg: T, accent: T): T {
  if (contrast(str(fg), str(accent)) >= 4.5) return fg;
  const dark: T = [0.15, fg[1], fg[2]];
  const light: T = [0.99, fg[1], fg[2]];
  return contrast(str(dark), str(accent)) > contrast(str(light), str(accent)) ? fit(dark, accent, 4.5) : fit(light, accent, 4.5);
}

function roles(r: Roles) {
  const fg = fit(fit(r.fg, r.bg, 7), r.surface, 4.5);
  const muted = fit(fit(r.muted, r.bg, 4.5), r.surface, 4.5);
  const accent = fit(r.accent, r.bg, 3);
  const accent_fg = fitAccentFg(r.accent_fg, accent);
  const danger = fit(r.danger, r.bg, 4.5);
  return { bg: str(r.bg), surface: str(r.surface), fg: str(fg), muted: str(muted), accent: str(accent), accent_fg: str(accent_fg), danger: str(danger) };
}

type P = Omit<Extract<Seed, { kind: "palette" }>, "kind" | "license" | "light" | "dark" | "references" | "anti_patterns"> & { light: Roles; dark: Roles };

function palette({ light, dark, ...rest }: P): Seed {
  return {
    kind: "palette",
    license: OWN,
    references: [refs.oklch, refs.wcag],
    anti_patterns: ["Usar o acento em texto corrido", "Inventar tons fora da paleta para 'dar vida'", "Cinza puro sobre fundo colorido (perde contraste)"],
    light: roles(light),
    dark: roles(dark),
    ...rest,
  } as Seed;
}

export const palettes: Seed[] = [
  palette({
    slug: "papel-e-vermelho", title: "Papel e vermelho", category: "clássico", summary: "Branco de papel, preto quase puro e um vermelho de sinalização. A paleta suíça.",
    tags: ["vermelho", "neutro", "contraste"], sectors: ["arquitetura", "cultura", "consultoria"], boldness: 3,
    when_to_use: ["Estilo suíço", "Marcas que querem autoridade"], avoid_when: ["Saúde (vermelho = alerta)"], pairs_with: ["suico", "grotesca-e-mono"],
    light: { bg: [0.98, 0.004, 90], surface: [0.95, 0.004, 90], fg: [0.18, 0, 0], muted: [0.48, 0, 0], accent: [0.58, 0.22, 28], accent_fg: [0.99, 0, 0], danger: [0.5, 0.2, 28] },
    dark: { bg: [0.16, 0, 0], surface: [0.21, 0, 0], fg: [0.96, 0.004, 90], muted: [0.72, 0, 0], accent: [0.64, 0.22, 28], accent_fg: [0.99, 0, 0], danger: [0.7, 0.19, 28] },
  }),
  palette({
    slug: "tinta-e-papel", title: "Tinta e papel", category: "editorial", summary: "Creme de papel offset, tinta marrom-escura e um vinho como acento editorial.",
    tags: ["creme", "editorial", "quente"], sectors: ["mídia", "editoras", "gastronomia"], boldness: 2,
    when_to_use: ["Editorial, arquivo, revista"], avoid_when: ["Tech escuro"], pairs_with: ["editorial", "academico-arquivo", "serifa-de-revista"],
    light: { bg: [0.97, 0.012, 85], surface: [0.94, 0.016, 85], fg: [0.22, 0.01, 60], muted: [0.48, 0.015, 60], accent: [0.45, 0.12, 25], accent_fg: [0.97, 0.012, 85], danger: [0.5, 0.18, 25] },
    dark: { bg: [0.19, 0.01, 60], surface: [0.24, 0.012, 60], fg: [0.94, 0.012, 85], muted: [0.74, 0.015, 80], accent: [0.7, 0.12, 25], accent_fg: [0.18, 0.01, 60], danger: [0.7, 0.17, 25] },
  }),
  palette({
    slug: "chapado-de-feira", title: "Chapado de feira", category: "ousado", summary: "Amarelo-manteiga de fundo, verde-limão chapado e preto. Barulhento e alegre.",
    tags: ["saturado", "alegre", "chapado"], sectors: ["startup", "eventos", "educação"], boldness: 5,
    when_to_use: ["Neo-brutalismo", "Campanhas"], avoid_when: ["Marcas sóbrias"], pairs_with: ["neo-brutalismo", "display-gorda"],
    light: { bg: [0.96, 0.05, 95], surface: [1, 0, 0], fg: [0.15, 0, 0], muted: [0.4, 0, 0], accent: [0.72, 0.19, 145], accent_fg: [0.15, 0, 0], danger: [0.55, 0.22, 25] },
    dark: { bg: [0.18, 0.02, 95], surface: [0.24, 0.03, 95], fg: [0.97, 0.04, 95], muted: [0.78, 0.03, 95], accent: [0.8, 0.19, 145], accent_fg: [0.15, 0, 0], danger: [0.7, 0.2, 25] },
  }),
  palette({
    slug: "terminal-verde", title: "Terminal verde", category: "tech", summary: "Fósforo verde sobre preto esverdeado. Terminal antigo, com contraste de verdade.",
    tags: ["escuro", "verde", "dev"], sectors: ["devtools", "segurança"], boldness: 4,
    when_to_use: ["Terminal/dev", "Brutalismo"], avoid_when: ["Público geral"], pairs_with: ["terminal-dev", "mono-total"],
    light: { bg: [0.97, 0.01, 150], surface: [0.93, 0.015, 150], fg: [0.2, 0.03, 160], muted: [0.45, 0.03, 160], accent: [0.5, 0.15, 150], accent_fg: [0.98, 0.01, 150], danger: [0.52, 0.2, 25] },
    dark: { bg: [0.17, 0.01, 160], surface: [0.22, 0.012, 160], fg: [0.9, 0.03, 150], muted: [0.7, 0.03, 150], accent: [0.84, 0.2, 145], accent_fg: [0.17, 0.01, 160], danger: [0.72, 0.18, 25] },
  }),
  palette({
    slug: "grafite-e-lima", title: "Grafite e lima", category: "tech", summary: "Grafite azulado, branco frio e lima elétrico como único ponto de luz.",
    tags: ["escuro", "lima", "produto"], sectors: ["SaaS", "IA", "fintech"], boldness: 3,
    when_to_use: ["Dark tech", "Bento"], avoid_when: ["Marcas quentes"], pairs_with: ["dark-tech-sobrio", "bento", "sora-e-plex-mono"],
    light: { bg: [0.98, 0.003, 260], surface: [0.95, 0.004, 260], fg: [0.2, 0.01, 260], muted: [0.48, 0.01, 260], accent: [0.62, 0.17, 135], accent_fg: [0.15, 0.02, 135], danger: [0.53, 0.2, 25] },
    dark: { bg: [0.16, 0.005, 260], surface: [0.2, 0.006, 260], fg: [0.95, 0.003, 260], muted: [0.72, 0.01, 260], accent: [0.88, 0.19, 125], accent_fg: [0.18, 0.02, 125], danger: [0.7, 0.19, 25] },
  }),
  palette({
    slug: "barro-e-creme", title: "Barro e creme", category: "humano", summary: "Creme quente, marrom de café e terracota. Cozinha de vó com bom gosto.",
    tags: ["quente", "terracota", "natural"], sectors: ["café", "bem-estar", "cosméticos"], boldness: 2,
    when_to_use: ["Orgânico/quente", "Gastronomia"], avoid_when: ["Tech"], pairs_with: ["organico-quente", "serifa-macia"],
    light: { bg: [0.95, 0.025, 75], surface: [0.91, 0.035, 70], fg: [0.28, 0.04, 45], muted: [0.47, 0.045, 50], accent: [0.55, 0.13, 40], accent_fg: [0.97, 0.02, 75], danger: [0.5, 0.18, 25] },
    dark: { bg: [0.2, 0.02, 45], surface: [0.25, 0.025, 45], fg: [0.94, 0.025, 75], muted: [0.76, 0.03, 70], accent: [0.7, 0.13, 45], accent_fg: [0.2, 0.02, 45], danger: [0.72, 0.16, 25] },
  }),
  palette({
    slug: "noite-e-ouro", title: "Noite e ouro", category: "premium", summary: "Preto quente, marfim e um dourado fosco usado só em filetes e detalhes.",
    tags: ["luxo", "escuro", "dourado"], sectors: ["joalheria", "imobiliário", "vinhos"], boldness: 2,
    when_to_use: ["Luxo sóbrio"], avoid_when: ["Varejo popular"], pairs_with: ["luxo-sobrio", "didone-fina"],
    light: { bg: [0.97, 0.008, 85], surface: [0.94, 0.01, 85], fg: [0.18, 0.005, 80], muted: [0.46, 0.01, 80], accent: [0.6, 0.1, 80], accent_fg: [0.15, 0.005, 80], danger: [0.5, 0.17, 25] },
    dark: { bg: [0.15, 0.005, 80], surface: [0.2, 0.006, 80], fg: [0.93, 0.01, 85], muted: [0.72, 0.015, 85], accent: [0.78, 0.09, 85], accent_fg: [0.15, 0.005, 80], danger: [0.7, 0.16, 25] },
  }),
  palette({
    slug: "riso-rosa-e-azul", title: "Riso rosa e azul", category: "gráfico", summary: "As duas tintas clássicas de risografia: rosa fluorescente e azul médio, sobre papel.",
    tags: ["risografia", "duotone", "rosa"], sectors: ["eventos", "música", "editoras"], boldness: 4,
    when_to_use: ["Risografia", "Cartazes"], avoid_when: ["Corporativo"], pairs_with: ["risografia", "display-gorda"],
    light: { bg: [0.95, 0.015, 90], surface: [0.91, 0.02, 90], fg: [0.3, 0.12, 260], muted: [0.42, 0.1, 260], accent: [0.66, 0.21, 0], accent_fg: [0.2, 0.08, 260], danger: [0.5, 0.19, 25] },
    dark: { bg: [0.22, 0.08, 260], surface: [0.27, 0.09, 260], fg: [0.95, 0.015, 90], muted: [0.8, 0.04, 260], accent: [0.72, 0.2, 0], accent_fg: [0.18, 0.06, 260], danger: [0.74, 0.17, 25] },
  }),
  palette({
    slug: "papel-de-arroz", title: "Papel de arroz", category: "minimal", summary: "Off-white levemente esverdeado, cinza de nanquim e um vermelho de selo.",
    tags: ["minimal", "calmo", "neutro"], sectors: ["cerâmica", "arquitetura", "chá"], boldness: 1,
    when_to_use: ["Minimal japonês"], avoid_when: ["Campanha barulhenta"], pairs_with: ["minimal-japones", "mincho-e-gothic"],
    light: { bg: [0.97, 0.006, 95], surface: [0.94, 0.008, 95], fg: [0.25, 0.005, 95], muted: [0.5, 0.008, 95], accent: [0.55, 0.19, 30], accent_fg: [0.98, 0, 0], danger: [0.5, 0.19, 30] },
    dark: { bg: [0.19, 0.004, 95], surface: [0.23, 0.005, 95], fg: [0.93, 0.006, 95], muted: [0.72, 0.008, 95], accent: [0.66, 0.18, 30], accent_fg: [0.15, 0, 0], danger: [0.7, 0.17, 30] },
  }),
  palette({
    slug: "seguranca-amarelo", title: "Segurança amarelo", category: "setor", summary: "Amarelo de sinalização com preto e cinza de concreto. Industrial direto.",
    tags: ["amarelo", "industrial", "alto-contraste"], sectors: ["indústria", "logística", "construção"], boldness: 4,
    when_to_use: ["Industrial"], avoid_when: ["Bem-estar"], pairs_with: ["industrial-mineiro", "condensada-industrial"],
    light: { bg: [0.96, 0.005, 95], surface: [0.9, 0.006, 95], fg: [0.18, 0, 0], muted: [0.42, 0, 0], accent: [0.86, 0.17, 92], accent_fg: [0.18, 0, 0], danger: [0.52, 0.2, 28] },
    dark: { bg: [0.17, 0, 0], surface: [0.22, 0, 0], fg: [0.96, 0.005, 95], muted: [0.74, 0, 0], accent: [0.86, 0.17, 92], accent_fg: [0.18, 0, 0], danger: [0.7, 0.19, 28] },
  }),
  palette({
    slug: "pastel-com-preto", title: "Pastel com preto", category: "lúdico", summary: "Rosa, céu e creme pastel amarrados por um preto firme. Memphis comportado.",
    tags: ["pastel", "lúdico", "anos-80"], sectors: ["educação", "infantil", "eventos"], boldness: 4,
    when_to_use: ["Memphis contido"], avoid_when: ["Finanças"], pairs_with: ["memphis-contido", "syne-e-karla"],
    light: { bg: [0.97, 0.02, 90], surface: [0.9, 0.07, 200], fg: [0.18, 0.01, 280], muted: [0.4, 0.02, 280], accent: [0.75, 0.15, 350], accent_fg: [0.18, 0.01, 280], danger: [0.52, 0.2, 25] },
    dark: { bg: [0.18, 0.01, 280], surface: [0.24, 0.02, 280], fg: [0.97, 0.02, 90], muted: [0.78, 0.03, 200], accent: [0.8, 0.13, 350], accent_fg: [0.18, 0.01, 280], danger: [0.72, 0.17, 25] },
  }),
  palette({
    slug: "grafite-e-violeta", title: "Grafite e violeta", category: "tech", summary: "Preto e cinzas neutros com um violeta frio como acento único. Sem gradiente.",
    tags: ["escuro", "violeta", "minimal"], sectors: ["SaaS", "criadores", "portfólio"], boldness: 3,
    when_to_use: ["Marca pessoal tech", "Portfólio escuro"], avoid_when: ["Saúde tradicional"], pairs_with: ["dark-tech-sobrio", "instrument-duo"],
    light: { bg: [0.98, 0.002, 290], surface: [0.95, 0.004, 290], fg: [0.2, 0.01, 290], muted: [0.48, 0.01, 290], accent: [0.52, 0.2, 295], accent_fg: [0.99, 0, 0], danger: [0.52, 0.2, 25] },
    dark: { bg: [0.15, 0.004, 290], surface: [0.2, 0.006, 290], fg: [0.95, 0.004, 290], muted: [0.72, 0.01, 290], accent: [0.74, 0.16, 295], accent_fg: [0.15, 0.02, 295], danger: [0.7, 0.19, 25] },
  }),
  palette({
    slug: "verde-clinica", title: "Verde clínica", category: "setor", summary: "Branco limpo, verde-água sério e azul-petróleo. Saúde que não parece hospital.",
    tags: ["saúde", "calmo", "verde"], sectors: ["saúde", "odontologia", "psicologia"], boldness: 1,
    when_to_use: ["Clínicas, consultórios", "Apps de saúde"], avoid_when: ["Marcas ousadas"], pairs_with: ["humanista-acessivel", "geometrica-limpa"],
    light: { bg: [0.98, 0.006, 180], surface: [0.95, 0.012, 180], fg: [0.24, 0.03, 220], muted: [0.48, 0.03, 220], accent: [0.55, 0.1, 185], accent_fg: [0.99, 0, 0], danger: [0.52, 0.19, 25] },
    dark: { bg: [0.19, 0.02, 220], surface: [0.24, 0.025, 220], fg: [0.95, 0.01, 180], muted: [0.76, 0.02, 190], accent: [0.76, 0.11, 185], accent_fg: [0.18, 0.02, 220], danger: [0.72, 0.16, 25] },
  }),
  palette({
    slug: "azul-cartorio", title: "Azul cartório", category: "setor", summary: "Azul-marinho institucional, papel cinza-quente e cobre discreto. Jurídico sem parecer 1998.",
    tags: ["institucional", "azul", "sério"], sectors: ["jurídico", "contabilidade", "governo"], boldness: 1,
    when_to_use: ["Escritórios de advocacia", "Contabilidade"], avoid_when: ["Marcas jovens"], pairs_with: ["serifa-tecnica"],
    light: { bg: [0.97, 0.006, 80], surface: [0.93, 0.008, 80], fg: [0.24, 0.06, 255], muted: [0.47, 0.03, 255], accent: [0.55, 0.1, 55], accent_fg: [0.99, 0, 0], danger: [0.5, 0.19, 25] },
    dark: { bg: [0.2, 0.05, 255], surface: [0.25, 0.055, 255], fg: [0.95, 0.008, 80], muted: [0.76, 0.02, 255], accent: [0.74, 0.1, 55], accent_fg: [0.18, 0.04, 255], danger: [0.72, 0.16, 25] },
  }),
  palette({
    slug: "cafe-torrado", title: "Café torrado", category: "humano", summary: "Marrom de grão torrado, leite vaporizado e laranja de crema.",
    tags: ["café", "marrom", "quente"], sectors: ["café", "padaria", "chocolate"], boldness: 2,
    when_to_use: ["Cafeterias", "Torrefação"], avoid_when: ["Tech"], pairs_with: ["serifa-macia", "slab-de-jornal"],
    light: { bg: [0.96, 0.018, 70], surface: [0.92, 0.025, 65], fg: [0.26, 0.04, 50], muted: [0.48, 0.04, 55], accent: [0.62, 0.15, 55], accent_fg: [0.2, 0.04, 50], danger: [0.5, 0.18, 25] },
    dark: { bg: [0.19, 0.025, 50], surface: [0.24, 0.03, 50], fg: [0.94, 0.02, 70], muted: [0.76, 0.03, 65], accent: [0.72, 0.14, 55], accent_fg: [0.19, 0.025, 50], danger: [0.72, 0.16, 25] },
  }),
  palette({
    slug: "oliva-e-linho", title: "Oliva e linho", category: "humano", summary: "Linho cru, verde-oliva e tinta escura. Moda sustentável e casa.",
    tags: ["oliva", "natural", "têxtil"], sectors: ["moda", "decoração", "bem-estar"], boldness: 2,
    when_to_use: ["Moda slow", "Decoração"], avoid_when: ["Tech"], pairs_with: ["instrument-duo", "serifa-de-livro"],
    light: { bg: [0.95, 0.015, 95], surface: [0.91, 0.02, 100], fg: [0.25, 0.03, 120], muted: [0.47, 0.04, 115], accent: [0.52, 0.09, 125], accent_fg: [0.98, 0.01, 95], danger: [0.5, 0.17, 30] },
    dark: { bg: [0.2, 0.02, 120], surface: [0.25, 0.025, 120], fg: [0.94, 0.015, 95], muted: [0.76, 0.03, 110], accent: [0.74, 0.1, 125], accent_fg: [0.2, 0.02, 120], danger: [0.72, 0.15, 30] },
  }),
  palette({
    slug: "terracota-e-azul", title: "Terracota e azul", category: "humano", summary: "Azulejo português: azul cobalto e terracota sobre cal.",
    tags: ["azulejo", "complementar", "mediterrâneo"], sectors: ["turismo", "restaurante", "decoração"], boldness: 3,
    when_to_use: ["Turismo, pousadas", "Restaurante de cozinha portuguesa"], avoid_when: ["SaaS"], pairs_with: ["serifa-gorda-e-grotesca"],
    light: { bg: [0.97, 0.01, 85], surface: [0.93, 0.02, 250], fg: [0.3, 0.14, 262], muted: [0.45, 0.08, 262], accent: [0.58, 0.14, 40], accent_fg: [0.99, 0, 0], danger: [0.5, 0.19, 25] },
    dark: { bg: [0.22, 0.09, 262], surface: [0.27, 0.1, 262], fg: [0.96, 0.01, 85], muted: [0.8, 0.04, 262], accent: [0.72, 0.13, 40], accent_fg: [0.2, 0.07, 262], danger: [0.74, 0.16, 25] },
  }),
  palette({
    slug: "menta-fresca", title: "Menta fresca", category: "produto", summary: "Fundo quase branco com menta e verde-escuro. Fintech amigável.",
    tags: ["verde", "fresco", "amigável"], sectors: ["fintech", "saúde", "apps"], boldness: 2,
    when_to_use: ["Apps financeiros pessoais", "Saúde digital"], avoid_when: ["Luxo"], pairs_with: ["geometrica-limpa", "grotesca-amigavel"],
    light: { bg: [0.98, 0.01, 165], surface: [0.94, 0.03, 165], fg: [0.24, 0.04, 170], muted: [0.47, 0.04, 170], accent: [0.62, 0.13, 165], accent_fg: [0.15, 0.03, 170], danger: [0.52, 0.19, 25] },
    dark: { bg: [0.18, 0.025, 170], surface: [0.23, 0.03, 170], fg: [0.96, 0.015, 165], muted: [0.78, 0.03, 165], accent: [0.82, 0.13, 165], accent_fg: [0.17, 0.03, 170], danger: [0.72, 0.16, 25] },
  }),
  palette({
    slug: "cereja-e-off-white", title: "Cereja e off-white", category: "ousado", summary: "Vermelho-cereja profundo dominando o fundo, com off-white rosado. Marca de moda ou bebida.",
    tags: ["vermelho", "dominante", "intenso"], sectors: ["moda", "bebidas", "beleza"], boldness: 4,
    when_to_use: ["Campanhas, lançamentos", "Marca de bebida"], avoid_when: ["Saúde"], pairs_with: ["didone-de-moda", "cartaz-condensado"],
    light: { bg: [0.97, 0.01, 20], surface: [0.93, 0.025, 15], fg: [0.3, 0.12, 15], muted: [0.45, 0.1, 15], accent: [0.45, 0.18, 18], accent_fg: [0.98, 0.01, 20], danger: [0.45, 0.18, 30] },
    dark: { bg: [0.32, 0.13, 18], surface: [0.37, 0.14, 18], fg: [0.97, 0.01, 20], muted: [0.88, 0.04, 20], accent: [0.92, 0.04, 20], accent_fg: [0.3, 0.12, 18], danger: [0.86, 0.1, 50] },
  }),
  palette({
    slug: "aco-e-laranja", title: "Aço e laranja", category: "setor", summary: "Cinza-aço azulado com laranja de segurança. Engenharia, frota, oficina.",
    tags: ["laranja", "aço", "técnico"], sectors: ["automotivo", "engenharia", "logística"], boldness: 3,
    when_to_use: ["Oficinas, frotas", "Engenharia"], avoid_when: ["Bem-estar"], pairs_with: ["condensada-industrial", "grotesca-e-mono"],
    light: { bg: [0.97, 0.004, 240], surface: [0.93, 0.006, 240], fg: [0.22, 0.015, 240], muted: [0.47, 0.015, 240], accent: [0.68, 0.19, 45], accent_fg: [0.18, 0.02, 240], danger: [0.5, 0.2, 25] },
    dark: { bg: [0.2, 0.012, 240], surface: [0.25, 0.014, 240], fg: [0.95, 0.004, 240], muted: [0.75, 0.012, 240], accent: [0.72, 0.18, 45], accent_fg: [0.18, 0.02, 240], danger: [0.72, 0.18, 25] },
  }),
  palette({
    slug: "ameixa-e-rosa-seco", title: "Ameixa e rosa seco", category: "humano", summary: "Ameixa escura, rosa empoeirado e areia. Beleza e terapia sem o rosa-chiclete.",
    tags: ["ameixa", "rosa", "suave"], sectors: ["beleza", "psicologia", "moda"], boldness: 2,
    when_to_use: ["Estética, terapia", "Moda feminina adulta"], avoid_when: ["Industrial"], pairs_with: ["didone-fina", "instrument-duo"],
    light: { bg: [0.96, 0.012, 40], surface: [0.92, 0.025, 20], fg: [0.27, 0.06, 340], muted: [0.47, 0.05, 340], accent: [0.62, 0.08, 10], accent_fg: [0.2, 0.05, 340], danger: [0.5, 0.18, 25] },
    dark: { bg: [0.2, 0.04, 340], surface: [0.25, 0.045, 340], fg: [0.95, 0.012, 40], muted: [0.78, 0.03, 10], accent: [0.76, 0.08, 10], accent_fg: [0.2, 0.04, 340], danger: [0.74, 0.15, 25] },
  }),
  palette({
    slug: "cerrado-seco", title: "Cerrado seco", category: "humano", summary: "Ocre de terra, verde-buriti e céu de agosto. Paleta brasileira do interior.",
    tags: ["brasil", "terra", "ocre"], sectors: ["turismo", "agro", "cultura", "café"], boldness: 3,
    when_to_use: ["Turismo rural", "Agro com cara boa", "Festivais regionais"], avoid_when: ["Tech frio"], pairs_with: ["slab-de-jornal", "serifa-macia"],
    light: { bg: [0.95, 0.03, 80], surface: [0.9, 0.05, 75], fg: [0.26, 0.04, 60], muted: [0.46, 0.05, 60], accent: [0.5, 0.1, 150], accent_fg: [0.98, 0.02, 80], danger: [0.5, 0.18, 30] },
    dark: { bg: [0.21, 0.03, 60], surface: [0.26, 0.04, 60], fg: [0.95, 0.03, 80], muted: [0.78, 0.05, 75], accent: [0.75, 0.12, 150], accent_fg: [0.2, 0.03, 60], danger: [0.74, 0.15, 30] },
  }),
];
