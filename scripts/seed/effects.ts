import { OWN, refs, type Seed } from "./common";

type E = {
  slug: string;
  title: string;
  summary: string;
  category: "gradiente" | "glass" | "noise" | "sombra" | "hover" | "borda" | "fundo" | "texto" | "imagem";
  html: string;
  css: string;
  height?: number;
  hover?: boolean;
  dark?: boolean;
  fonts?: string[];
  tags: string[];
  boldness: number;
  use: string[];
  avoid: string[];
  anti?: string[];
  pairs?: string[];
  component_refs?: string[];
  references?: Seed["references"];
};

function effect(e: E): Seed {
  return {
    kind: "effect",
    slug: e.slug,
    title: e.title,
    summary: e.summary,
    category: e.category,
    tags: e.tags,
    sectors: [],
    boldness: e.boldness,
    when_to_use: e.use,
    avoid_when: e.avoid,
    anti_patterns: e.anti ?? ["Aplicar em todos os elementos da página", "Usar só porque é bonito, sem função"],
    pairs_with: e.pairs ?? [],
    component_refs: e.component_refs ?? [],
    references: e.references ?? [],
    license: OWN,
    demo: { html: e.html.trim(), css: e.css.trim(), height: e.height ?? 220, fonts: e.fonts ?? [], hover: !!e.hover, dark: !!e.dark },
  };
}

const grainSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export const effects: Seed[] = [
  // gradientes
  effect({
    slug: "malha-de-gradiente", title: "Malha de gradiente", category: "gradiente",
    summary: "Vários radial-gradient sobrepostos em tons vizinhos criam uma malha suave, sem o clichê roxo/azul.",
    tags: ["gradiente", "fundo", "suave"], boldness: 2, use: ["Fundo de hero com foto ausente", "Capa de case"], avoid: ["Atrás de texto longo"],
    anti: ["Roxo + azul (cara de IA)", "Mais de 4 cores", "Saturação alta em todas as manchas"],
    html: `<div class="m"><h2>Outono<br>em casa</h2></div>`,
    css: `.m{height:100vh;padding:1.4rem;box-sizing:border-box;background:radial-gradient(at 15% 20%,oklch(0.86 0.09 70) 0,transparent 55%),radial-gradient(at 85% 30%,oklch(0.75 0.12 40) 0,transparent 50%),radial-gradient(at 50% 90%,oklch(0.6 0.1 20) 0,transparent 55%),oklch(0.92 0.04 75)}
.m h2{font:700 2.2rem/1 var(--font);letter-spacing:-.03em;margin:0;color:oklch(0.25 0.05 40)}`,
  }),
  effect({
    slug: "gradiente-conico-em-giro", title: "Gradiente cônico girando", category: "gradiente",
    summary: "Um conic-gradient girando devagar atrás de um objeto, com blur. Halo vivo sem neon.",
    tags: ["cônico", "halo", "animado"], boldness: 3, use: ["Atrás de um produto ou mockup", "Avatar destacado"], avoid: ["Fundos de página inteira"], dark: true,
    html: `<div class="w"><div class="halo"></div><div class="obj">app</div></div>`,
    css: `@property --a{syntax:"<angle>";initial-value:0deg;inherits:false}
.w{position:relative;height:100vh;display:grid;place-items:center;background:oklch(0.16 0.005 260)}
.halo{position:absolute;width:150px;height:150px;border-radius:50%;background:conic-gradient(from var(--a),oklch(0.85 0.17 90),oklch(0.7 0.18 30),oklch(0.85 0.17 90));filter:blur(30px);opacity:.7;animation:sp 6s linear infinite}
.obj{position:relative;width:110px;height:110px;border-radius:26px;background:oklch(0.22 0.006 260);border:1px solid oklch(1 0 0/.1);display:grid;place-items:center;color:#fff;font:600 1rem var(--font)}
@keyframes sp{to{--a:360deg}}`,
  }),
  effect({
    slug: "degrade-de-uma-cor", title: "Degradê de uma cor só", category: "gradiente",
    summary: "Gradiente do mesmo matiz variando só luminosidade em OKLCH. Sofisticado e seguro.",
    tags: ["monocromático", "oklch", "sóbrio"], boldness: 1, use: ["Botões e cards premium", "Fundo de seção"], avoid: ["Quando a marca tem cor fraca (fica sujo)"],
    references: [refs.oklch],
    html: `<div class="g"><div class="b">Assinar</div></div>`,
    css: `.g{height:100vh;display:grid;place-items:center;background:linear-gradient(in oklch 170deg,oklch(0.42 0.1 150),oklch(0.22 0.05 150))}
.b{font:600 1rem var(--font);padding:.9rem 1.5rem;border-radius:10px;color:oklch(0.98 0.02 150);background:linear-gradient(in oklch 180deg,oklch(0.62 0.14 150),oklch(0.5 0.13 150));box-shadow:inset 0 1px 0 oklch(1 0 0/.25),0 6px 16px -6px oklch(0 0 0/.5)}`,
  }),
  effect({
    slug: "aurora-lenta", title: "Aurora lenta", category: "gradiente",
    summary: "Faixas de cor borradas que se deslocam devagar no topo da seção. Fundo vivo e discreto.",
    tags: ["aurora", "animado", "fundo"], boldness: 3, use: ["Topo de landing escura", "Tela de login"], avoid: ["Telas de trabalho (distrai)"], dark: true,
    component_refs: ["@magicui/aurora-text"],
    html: `<div class="au"><i></i><i></i><h3>Bem-vindo de volta</h3></div>`,
    css: `.au{position:relative;height:100vh;overflow:hidden;background:oklch(0.16 0.02 200);display:flex;align-items:flex-end;padding:1.4rem;box-sizing:border-box}
.au i{position:absolute;top:-40%;width:80%;height:90%;border-radius:50%;filter:blur(40px);opacity:.55;animation:dr 10s ease-in-out infinite alternate}
.au i:first-child{left:-10%;background:oklch(0.7 0.14 170)}.au i:last-child{right:-20%;background:oklch(0.75 0.13 110);animation-delay:-5s}
.au h3{position:relative;color:#fff;font:600 1.5rem var(--font);margin:0}
@keyframes dr{to{transform:translateX(18%) translateY(10%) scale(1.1)}}`,
  }),
  // glass
  effect({
    slug: "vidro-com-motivo", title: "Vidro com motivo", category: "glass",
    summary: "Glass só quando há algo atrás para borrar: barra flutuando sobre foto. Blur + borda clara de 1px.",
    tags: ["glass", "backdrop-filter", "navbar"], boldness: 2, use: ["Navbar fixa sobre imagem", "Controles sobre vídeo"], avoid: ["Sobre fundo liso (vira cinza sem motivo)"],
    anti: ["Glass em todos os cards", "Blur acima de 24px (pesado no celular)", "Texto fino sobre vidro claro"],
    references: [refs.backdrop],
    html: `<div class="ph"><nav class="g"><b>Lume</b><span>Menu</span><span>Reservar</span></nav></div>`,
    css: `.ph{height:100vh;padding:1rem;box-sizing:border-box;background:radial-gradient(circle at 25% 70%,oklch(0.75 0.14 60),transparent 40%),radial-gradient(circle at 80% 30%,oklch(0.55 0.12 30),transparent 45%),oklch(0.35 0.05 40)}
.g{display:flex;gap:1rem;align-items:center;padding:.8rem 1rem;border-radius:14px;background:oklch(1 0 0/.14);-webkit-backdrop-filter:blur(14px) saturate(1.4);backdrop-filter:blur(14px) saturate(1.4);border:1px solid oklch(1 0 0/.25);color:#fff;font:500 .9rem var(--font)}
.g b{margin-right:auto;font-weight:700}`,
  }),
  effect({
    slug: "vidro-fosco-escuro", title: "Vidro fosco escuro", category: "glass",
    summary: "Painel escuro translúcido com grão leve por cima. Lê bem e não parece 2021.",
    tags: ["glass", "escuro", "painel"], boldness: 2, use: ["Modal sobre conteúdo rico", "Player de mídia"], avoid: ["Formulários longos"], dark: true,
    html: `<div class="bg"><div class="p"><small>TOCANDO</small><b>Noite em BH</b><div class="bar"><i></i></div></div></div>`,
    css: `.bg{height:100vh;display:grid;place-items:center;background:conic-gradient(from 200deg at 30% 60%,oklch(0.5 0.15 30),oklch(0.4 0.12 300),oklch(0.55 0.13 80),oklch(0.5 0.15 30))}
.p{position:relative;width:70%;padding:1rem;border-radius:16px;background:oklch(0.15 0 0/.55);-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);border:1px solid oklch(1 0 0/.12);color:#fff;font:400 .85rem var(--font);display:grid;gap:.3rem;overflow:hidden}
.p::after{content:"";position:absolute;inset:0;background:${grainSvg};opacity:.12;mix-blend-mode:overlay;pointer-events:none}
.p small{letter-spacing:.2em;opacity:.7}.p b{font-size:1.2rem}.bar{height:4px;border-radius:2px;background:oklch(1 0 0/.2)}.bar i{display:block;width:40%;height:100%;border-radius:2px;background:#fff}`,
  }),
  // noise / textura
  effect({
    slug: "grao-de-papel", title: "Grão de papel", category: "noise",
    summary: "Ruído SVG (feTurbulence) em overlay com 6–10% de opacidade. Tira o aspecto digital chapado.",
    tags: ["grão", "textura", "svg"], boldness: 1, use: ["Fundo de site editorial ou quente", "Cartazes digitais"], avoid: ["Interfaces densas de dados"],
    anti: ["Opacidade acima de 15%", "Grão animado em tela cheia (pesado)", "Grão por cima de texto pequeno"],
    references: [refs.noise], pairs: ["risografia", "organico-quente"],
    html: `<div class="pp"><h2>Caderno<br>de receitas</h2><p>edição de outono</p></div>`,
    css: `.pp{position:relative;height:100vh;padding:1.4rem;box-sizing:border-box;background:oklch(0.93 0.03 80)}
.pp::before{content:"";position:absolute;inset:0;background:${grainSvg};opacity:.22;mix-blend-mode:multiply;pointer-events:none}
.pp h2{position:relative;font:700 2.2rem/1 var(--font);letter-spacing:-.03em;margin:0;color:oklch(0.3 0.05 40)}.pp p{position:relative;color:oklch(0.45 0.05 40);font:italic 500 .95rem var(--font)}`,
  }),
  effect({
    slug: "gradiente-granulado", title: "Gradiente granulado", category: "noise",
    summary: "Gradiente com grão por cima: some com as faixas (banding) e parece impresso.",
    tags: ["grão", "gradiente", "impresso"], boldness: 2, use: ["Capas, cartazes", "Fundo de hero"], avoid: ["Fundo de texto corrido"],
    references: [refs.noise],
    html: `<div class="gg"><b>Festival<br>Inverno 26</b></div>`,
    css: `.gg{position:relative;height:100vh;padding:1.4rem;box-sizing:border-box;background:linear-gradient(in oklch 200deg,oklch(0.75 0.15 40),oklch(0.55 0.2 15) 50%,oklch(0.3 0.12 290))}
.gg::after{content:"";position:absolute;inset:0;background:${grainSvg};opacity:.35;mix-blend-mode:overlay}
.gg b{position:relative;display:block;color:#fff;font:800 2.4rem/1 var(--font);letter-spacing:-.04em;margin-top:40%}`,
  }),
  effect({
    slug: "meio-tom", title: "Meio-tom (halftone)", category: "noise",
    summary: "Pontos em grade com tamanho variando por gradiente, como retícula de jornal. CSS puro com máscara.",
    tags: ["halftone", "retícula", "impresso"], boldness: 3, use: ["Detalhes gráficos", "Risografia, cartaz"], avoid: ["Fundo de texto"], pairs: ["risografia"],
    html: `<div class="ht"><div class="dots"></div><b>Edição 04</b></div>`,
    css: `.ht{position:relative;height:100vh;background:oklch(0.95 0.015 90);overflow:hidden}
.dots{position:absolute;inset:0;background:radial-gradient(circle,oklch(0.66 0.21 0) 38%,transparent 40%) 0 0/12px 12px;-webkit-mask-image:linear-gradient(135deg,#000,transparent 75%);mask-image:linear-gradient(135deg,#000,transparent 75%)}
.ht b{position:absolute;right:1.2rem;bottom:1.2rem;font:800 2rem var(--font);color:oklch(0.3 0.12 260);letter-spacing:-.03em}`,
  }),
  // sombras
  effect({
    slug: "sombra-em-camadas", title: "Sombra em camadas", category: "sombra",
    summary: "Quatro sombras pequenas somadas, com a cor do fundo escurecida. Profundidade realista.",
    tags: ["sombra", "elevação", "realista"], boldness: 1, use: ["Cards e popovers", "Elevação sutil"], avoid: ["Neo-brutalismo (use sombra dura)"],
    anti: ["Sombra preta pura em fundo colorido", "Uma sombra única grande e borrada"],
    references: [refs.shadows],
    html: `<div class="w"><div class="c"><b>Plano Pro</b><span>R$ 49/mês</span></div></div>`,
    css: `.w{height:100vh;display:grid;place-items:center;background:oklch(0.94 0.02 80)}
.c{width:60%;padding:1.2rem;border-radius:14px;background:oklch(0.99 0.005 80);font:400 .9rem var(--font);display:grid;gap:.3rem;box-shadow:0 1px 1px oklch(0.45 0.05 70/.08),0 2px 4px oklch(0.45 0.05 70/.08),0 6px 12px oklch(0.45 0.05 70/.08),0 16px 32px oklch(0.45 0.05 70/.1)}
.c b{font-size:1.2rem}`,
  }),
  effect({
    slug: "sombra-dura", title: "Sombra dura deslocada", category: "sombra",
    summary: "Sombra sem blur, deslocada, na cor do contorno. A assinatura do neo-brutalismo.",
    tags: ["neo-brutalismo", "sombra", "chapado"], boldness: 4, use: ["Neo-brutalismo", "Cartões lúdicos"], avoid: ["Interfaces sóbrias"], pairs: ["neo-brutalismo"],
    html: `<div class="w"><div class="c">Nova turma<br><b>abre segunda</b></div></div>`,
    css: `.w{height:100vh;display:grid;place-items:center;background:oklch(0.9 0.08 200)}
.c{padding:1.1rem 1.3rem;background:oklch(0.96 0.05 95);border:3px solid #111;box-shadow:6px 6px 0 #111;border-radius:10px;font:500 1.1rem/1.2 var(--font);transform:rotate(-2deg)}.c b{font-weight:800}`,
  }),
  effect({
    slug: "sombra-colorida", title: "Sombra colorida", category: "sombra",
    summary: "A sombra pega a cor do próprio elemento, escurecida e borrada. Botão que parece aceso.",
    tags: ["sombra", "cor", "botão"], boldness: 2, use: ["CTA principal", "Ícone de app"], avoid: ["Vários botões coloridos juntos"],
    html: `<div class="w"><button>Baixar app</button></div>`,
    css: `.w{height:100vh;display:grid;place-items:center;background:var(--bg)}
button{font:600 1rem var(--font);padding:.95rem 1.5rem;border:0;border-radius:12px;color:#fff;background:oklch(0.6 0.19 40);box-shadow:0 10px 24px -8px oklch(0.6 0.19 40/.7),inset 0 1px 0 oklch(1 0 0/.3)}`,
  }),
  effect({
    slug: "relevo-interno", title: "Relevo interno", category: "sombra",
    summary: "Sombra interna sutil em campos e trilhos. Mostra que é um espaço para preencher.",
    tags: ["inset", "input", "profundidade"], boldness: 1, use: ["Inputs, sliders, trilhos"], avoid: ["Neumorfismo completo (contraste ruim)"],
    html: `<div class="w"><div class="in">buscar molde…</div><div class="tr"><i></i></div></div>`,
    css: `.w{height:100vh;display:grid;align-content:center;gap:1rem;padding:1.4rem;box-sizing:border-box;background:oklch(0.95 0.005 90)}
.in{padding:.85rem 1rem;border-radius:10px;background:oklch(0.97 0.004 90);box-shadow:inset 0 1px 3px oklch(0.3 0.01 90/.2),inset 0 0 0 1px oklch(0.3 0.01 90/.12);color:oklch(0.48 0.01 90);font:400 .95rem var(--font)}
.tr{height:8px;border-radius:4px;background:oklch(0.9 0.005 90);box-shadow:inset 0 1px 2px oklch(0.3 0.01 90/.25)}.tr i{display:block;width:60%;height:100%;border-radius:4px;background:var(--fg)}`,
  }),
  // hover
  effect({
    slug: "spotlight-no-cursor", title: "Spotlight no cursor", category: "hover",
    summary: "Um brilho radial segue o cursor dentro do card, revelando a borda. Usa variável CSS atualizada no pointermove.",
    tags: ["cursor", "brilho", "card"], boldness: 3, use: ["Grade de features escura", "Cards de preço"], avoid: ["Mobile (sem cursor: mostrar estático)"], dark: true, hover: true, pairs: ["dark-tech-sobrio"],
    component_refs: ["@magicui/magic-card"], references: [refs.aceternity],
    html: `<div class="w"><div class="c"><b>Deploy em 1 clique</b><p>Conecte o repositório e pronto.</p></div></div>`,
    css: `.w{height:100vh;display:grid;place-items:center;background:oklch(0.16 0.005 260)}
.c{--x:30%;--y:20%;position:relative;width:75%;padding:1.2rem;border-radius:14px;background:oklch(0.2 0.006 260);color:oklch(0.95 0 0);font:400 .9rem var(--font);border:1px solid oklch(1 0 0/.08);overflow:hidden;animation:mv 5s ease-in-out infinite}
.c::before{content:"";position:absolute;inset:0;background:radial-gradient(180px circle at var(--x) var(--y),oklch(0.88 0.19 125/.18),transparent 60%);pointer-events:none}
.c b{font-size:1.1rem}.c p{margin:.3rem 0 0;color:oklch(0.75 0.01 260)}
@property --x{syntax:"<percentage>";initial-value:30%;inherits:false}@property --y{syntax:"<percentage>";initial-value:20%;inherits:false}
@keyframes mv{0%,100%{--x:15%;--y:20%}50%{--x:85%;--y:80%}}`,
  }),
  effect({
    slug: "inclinar-no-hover", title: "Inclinar no hover", category: "hover",
    summary: "O card inclina levemente em 3D na direção do cursor, com reflexo. Use com moderação.",
    tags: ["3d", "tilt", "card"], boldness: 3, use: ["Cartões de produto, ingressos", "Capa de case"], avoid: ["Listas longas", "Mobile"], hover: true,
    html: `<div class="w"><div class="t"><small>INGRESSO</small><b>Show de sábado</b><span>Pista · 22h</span></div></div>`,
    css: `.w{height:100vh;display:grid;place-items:center;perspective:700px;background:var(--bg)}
.t{width:65%;padding:1.1rem;border-radius:14px;background:linear-gradient(in oklch 135deg,oklch(0.55 0.2 15),oklch(0.4 0.16 350));color:#fff;font:400 .85rem var(--font);display:grid;gap:.2rem;position:relative;overflow:hidden;animation:tl 4s ease-in-out infinite;transform-style:preserve-3d}
.t::after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 40%,oklch(1 0 0/.25) 50%,transparent 60%);animation:sh 4s ease-in-out infinite}
.t small{letter-spacing:.2em;opacity:.8}.t b{font-size:1.3rem}
@keyframes tl{0%,100%{transform:rotateX(8deg) rotateY(-12deg)}50%{transform:rotateX(-6deg) rotateY(12deg)}}
@keyframes sh{0%,100%{transform:translateX(-60%)}50%{transform:translateX(60%)}}`,
  }),
  effect({
    slug: "revelar-ao-passar", title: "Revelar ao passar", category: "hover",
    summary: "A lista mostra só títulos; no hover a linha ganha fundo de acento e uma seta desliza.",
    tags: ["lista", "hover", "menu"], boldness: 2, use: ["Índice de projetos", "Menu em tela cheia"], avoid: ["Listas de dados"], hover: true,
    html: `<ul class="l"><li>Branding <span>→</span></li><li class="on">Sites <span>→</span></li><li>Embalagem <span>→</span></li></ul>`,
    css: `.l{list-style:none;margin:0;padding:1rem}.l li{display:flex;justify-content:space-between;padding:.8rem .6rem;border-bottom:1px solid var(--line);font:600 1.3rem var(--font);transition:background .25s,color .25s,padding .25s}
.l span{opacity:0;transform:translateX(-10px);transition:.25s}
.l li:hover,html.hover .l li.on{background:var(--accent);color:var(--accent-fg);padding-left:1rem}.l li:hover span,html.hover .l li.on span{opacity:1;transform:none}`,
  }),
  effect({
    slug: "botao-com-preenchimento", title: "Botão com preenchimento", category: "hover",
    summary: "No hover a cor enche o botão a partir de baixo e o texto inverte. Simples e satisfatório.",
    tags: ["botão", "hover", "preenchimento"], boldness: 2, use: ["CTAs secundários", "Botões contornados"], avoid: ["Botões pequenos de interface"], hover: true,
    html: `<div class="w"><button>Ver portfólio</button></div>`,
    css: `.w{height:100vh;display:grid;place-items:center}
button{position:relative;overflow:hidden;font:600 1rem var(--font);padding:.9rem 1.5rem;border:2px solid var(--fg);background:transparent;color:var(--fg);border-radius:0;transition:color .3s;z-index:0}
button::before{content:"";position:absolute;inset:0;background:var(--fg);transform:translateY(101%);transition:transform .35s cubic-bezier(.2,0,0,1);z-index:-1}
button:hover,html.hover button{color:var(--bg)}button:hover::before,html.hover button::before{transform:none}`,
  }),
  // bordas
  effect({
    slug: "borda-em-movimento", title: "Borda em movimento", category: "borda",
    summary: "Um brilho percorre a borda do card em loop. Chama atenção para um item só.",
    tags: ["borda", "animado", "destaque"], boldness: 3, use: ["Plano recomendado", "Card de novidade"], avoid: ["Mais de um card na tela com o efeito"], dark: true,
    component_refs: ["@magicui/border-beam", "@magicui/shine-border"],
    html: `<div class="w"><div class="c"><small>RECOMENDADO</small><b>Pro</b><span>R$ 49/mês</span></div></div>`,
    css: `@property --a{syntax:"<angle>";initial-value:0deg;inherits:false}
.w{height:100vh;display:grid;place-items:center;background:oklch(0.16 0.005 260)}
.c{width:62%;padding:1.2rem;border-radius:14px;color:#fff;font:400 .9rem var(--font);display:grid;gap:.2rem;border:1px solid transparent;background:linear-gradient(oklch(0.2 0.006 260),oklch(0.2 0.006 260)) padding-box,conic-gradient(from var(--a),transparent 70%,oklch(0.88 0.19 125),transparent 85%) border-box;animation:bd 4s linear infinite}
.c small{letter-spacing:.2em;color:oklch(0.88 0.19 125)}.c b{font-size:1.6rem}
@keyframes bd{to{--a:360deg}}`,
  }),
  effect({
    slug: "filete-duplo", title: "Filete duplo editorial", category: "borda",
    summary: "Linha grossa + linha fina com 3px entre elas, como em jornal. Separa seções com elegância.",
    tags: ["editorial", "divisor", "jornal"], boldness: 1, use: ["Divisores de seção", "Cabeçalho de artigo"], avoid: ["Interfaces de app"], pairs: ["editorial"],
    fonts: ["Fraunces"],
    html: `<div class="w"><hr><h3>Cultura</h3><p>A semana em cinco exposições</p></div>`,
    css: `.w{padding:1.6rem 1.4rem}.w hr{border:0;height:7px;border-top:3px solid var(--fg);border-bottom:1px solid var(--fg);margin:0 0 .8rem}
.w h3{font:600 .75rem var(--font);letter-spacing:.25em;text-transform:uppercase;margin:0}.w p{font:600 1.7rem/1.1 "Fraunces",serif;margin:.4rem 0 0}`,
  }),
  effect({
    slug: "borda-tracejada-animada", title: "Borda tracejada andando", category: "borda",
    summary: "Tracejado que anda em volta da área, tipo seleção de editor. Ótimo para zona de upload.",
    tags: ["tracejado", "upload", "seleção"], boldness: 2, use: ["Área de arrastar arquivo", "Seleção ativa"], avoid: ["Bordas comuns de card"],
    html: `<div class="w"><div class="dz">Solte o arquivo aqui</div></div>`,
    css: `.w{height:100vh;padding:1.2rem;box-sizing:border-box}
.dz{height:100%;display:grid;place-items:center;font:500 1rem var(--font);color:var(--muted);border-radius:12px;background:linear-gradient(90deg,var(--fg) 50%,transparent 0) repeat-x top/16px 2px,linear-gradient(90deg,var(--fg) 50%,transparent 0) repeat-x bottom/16px 2px,linear-gradient(0deg,var(--fg) 50%,transparent 0) repeat-y left/2px 16px,linear-gradient(0deg,var(--fg) 50%,transparent 0) repeat-y right/2px 16px;animation:ants .8s linear infinite}
@keyframes ants{to{background-position:16px 0,-16px 100%,0 -16px,100% 16px}}`,
  }),
  // fundos
  effect({
    slug: "grade-de-pontos", title: "Grade de pontos", category: "fundo",
    summary: "Pontos em grade com máscara radial que some nas bordas. Fundo técnico sem barulho.",
    tags: ["pontos", "grid", "tech"], boldness: 1, use: ["Fundo de hero tech", "Área de canvas"], avoid: ["Atrás de texto pequeno"], dark: true, pairs: ["dark-tech-sobrio"],
    component_refs: ["@magicui/dot-pattern"],
    html: `<div class="d"><b>API de pagamentos</b></div>`,
    css: `.d{height:100vh;display:grid;place-items:center;background:radial-gradient(oklch(1 0 0/.18) 1px,transparent 1.5px) 0 0/18px 18px,oklch(0.16 0.005 260);-webkit-mask-image:radial-gradient(ellipse at center,#000 40%,transparent 80%);mask-image:radial-gradient(ellipse at center,#000 40%,transparent 80%)}
.d b{color:#fff;font:600 1.4rem var(--font)}`,
  }),
  effect({
    slug: "grade-de-linhas", title: "Grade de linhas", category: "fundo",
    summary: "Linhas finas formando grade, como papel milimetrado, com fade no topo.",
    tags: ["grid", "milimetrado", "técnico"], boldness: 1, use: ["Hero técnico, arquitetura", "Fundo de diagrama"], avoid: ["Fundos de leitura"],
    component_refs: ["@magicui/grid-pattern"],
    html: `<div class="gl"><span>planta 01 · escala 1:50</span></div>`,
    css: `.gl{height:100vh;display:flex;align-items:flex-end;padding:1.2rem;box-sizing:border-box;background:linear-gradient(var(--line) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,var(--line) 1px,transparent 1px) 0 0/24px 24px;-webkit-mask-image:linear-gradient(transparent,#000 40%);mask-image:linear-gradient(transparent,#000 40%)}
.gl span{font:500 .8rem var(--mono);color:var(--muted)}`,
  }),
  effect({
    slug: "blob-organico", title: "Blob orgânico", category: "fundo",
    summary: "Forma com border-radius de 8 valores que se transforma devagar. Calor sem ilustração.",
    tags: ["blob", "orgânico", "forma"], boldness: 2, use: ["Atrás de foto de produto", "Orgânico/quente"], avoid: ["Interfaces técnicas"], pairs: ["organico-quente"],
    html: `<div class="w"><div class="b"></div></div>`,
    css: `.w{height:100vh;display:grid;place-items:center;background:oklch(0.95 0.025 75)}
.b{width:150px;height:150px;background:oklch(0.55 0.13 40);animation:mo 8s ease-in-out infinite}
@keyframes mo{0%,100%{border-radius:60% 40% 55% 45%/50% 60% 40% 50%}33%{border-radius:40% 60% 45% 55%/60% 40% 60% 40%}66%{border-radius:55% 45% 40% 60%/40% 55% 45% 60%}}`,
  }),
  effect({
    slug: "formas-soltas", title: "Formas soltas", category: "fundo",
    summary: "Triângulo, círculo, zigue-zague e pontos espalhados nas margens. Memphis sem poluir o miolo.",
    tags: ["memphis", "geométrico", "decoração"], boldness: 4, use: ["Memphis contido", "Seções de evento"], avoid: ["Sobre texto"], pairs: ["memphis-contido"],
    html: `<div class="w"><i class="tri"></i><i class="ci"></i><i class="zz"></i><h3>Oficina de verão</h3></div>`,
    css: `.w{position:relative;height:100vh;background:oklch(0.97 0.02 90);display:grid;place-items:center;overflow:hidden}
.w h3{font:800 1.6rem var(--font);margin:0;color:oklch(0.18 0.01 280)}.w i{position:absolute}
.tri{left:8%;top:12%;width:0;height:0;border-left:22px solid transparent;border-right:22px solid transparent;border-bottom:38px solid oklch(0.75 0.15 350);transform:rotate(-15deg)}
.ci{right:12%;top:18%;width:34px;height:34px;border-radius:50%;border:4px solid oklch(0.18 0.01 280)}
.zz{left:12%;bottom:14%;width:110px;height:14px;background:linear-gradient(135deg,oklch(0.7 0.12 200) 25%,transparent 25%) -7px 0/14px 14px,linear-gradient(225deg,oklch(0.7 0.12 200) 25%,transparent 25%) -7px 0/14px 14px}`,
  }),
  effect({
    slug: "listras-diagonais", title: "Listras diagonais", category: "fundo",
    summary: "repeating-linear-gradient a 45° em dois tons próximos. Fundo de faixa de aviso, sem gritar.",
    tags: ["listras", "padrão", "css"], boldness: 2, use: ["Faixas de aviso", "Placeholder de imagem"], avoid: ["Atrás de texto"],
    html: `<div class="w"><span>em construção</span></div>`,
    css: `.w{height:100vh;display:grid;place-items:center;background:repeating-linear-gradient(45deg,oklch(0.86 0.17 92) 0 14px,oklch(0.82 0.16 88) 14px 28px)}
.w span{font:800 1.1rem var(--font);text-transform:uppercase;background:#111;color:oklch(0.86 0.17 92);padding:.4rem .8rem;letter-spacing:.06em}`,
  }),
  // texto
  effect({
    slug: "texto-vazado", title: "Texto vazado", category: "texto",
    summary: "Título só com contorno (-webkit-text-stroke) misturado com palavras cheias.",
    tags: ["contorno", "título", "cartaz"], boldness: 4, use: ["Cartazes, títulos gigantes"], avoid: ["Texto abaixo de 40px", "Contorno fino em fundo agitado"],
    html: `<h1 class="o">FESTA<br><span>JUNINA</span><br>2026</h1>`,
    css: `.o{font:900 3.2rem/.9 var(--font);margin:0;padding:1.4rem;letter-spacing:-.03em}.o span{color:transparent;-webkit-text-stroke:2px var(--fg)}`,
  }),
  effect({
    slug: "sobreposicao-de-tintas", title: "Sobreposição de tintas", category: "texto",
    summary: "Mesmo texto em duas cores, deslocado 3px, com mix-blend-mode multiply. Erro de registro proposital.",
    tags: ["risografia", "blend", "título"], boldness: 4, use: ["Risografia", "Cartazes de evento"], avoid: ["Texto pequeno (fica ilegível)"], pairs: ["risografia"],
    html: `<div class="w"><h1 data-t="ZINE">ZINE</h1></div>`,
    css: `.w{padding:1.4rem;height:100vh;box-sizing:border-box;background:oklch(0.95 0.015 90)}
.w h1{position:relative;font:900 5rem/1 var(--font);margin:0;color:oklch(0.66 0.21 0);mix-blend-mode:multiply;letter-spacing:-.04em}
.w h1::after{content:attr(data-t);position:absolute;left:4px;top:3px;color:oklch(0.55 0.15 245);mix-blend-mode:multiply}`,
  }),
  effect({
    slug: "marca-texto", title: "Marca-texto", category: "texto",
    summary: "Fundo de cor só na metade de baixo da palavra, com leve inclinação. Destaque de anotação.",
    tags: ["destaque", "texto", "anotação"], boldness: 2, use: ["Destacar 1–3 palavras no título"], avoid: ["Parágrafos inteiros destacados"],
    html: `<h2 class="h">Seu site pronto em <mark>sete dias</mark>, sem enrolação.</h2>`,
    css: `.h{font:700 1.8rem/1.2 var(--font);letter-spacing:-.02em;padding:1.4rem;margin:0}
.h mark{color:inherit;background:linear-gradient(104deg,transparent .4em,oklch(0.9 0.15 100) .5em,oklch(0.88 0.16 95) 95%,transparent) 0 85%/100% 45% no-repeat;padding:0 .1em}`,
  }),
  effect({
    slug: "texto-vertical", title: "Texto vertical", category: "texto",
    summary: "Rótulo com writing-mode vertical na lateral. Organiza e dá ar de livro de arte.",
    tags: ["vertical", "rótulo", "editorial"], boldness: 2, use: ["Minimal japonês", "Rótulos de seção"], avoid: ["Textos com mais de 3 palavras"], pairs: ["minimal-japones"],
    html: `<div class="w"><span class="v">coleção 03 — inverno</span><div class="img"></div></div>`,
    css: `.w{display:flex;gap:1rem;padding:1.4rem;height:100vh;box-sizing:border-box}
.v{writing-mode:vertical-rl;transform:rotate(180deg);font:500 .75rem var(--font);letter-spacing:.2em;text-transform:uppercase;color:var(--muted)}
.img{flex:1;background:linear-gradient(170deg,oklch(0.85 0.02 90),oklch(0.65 0.03 80));position:relative}.img::after{content:"";position:absolute;right:10px;bottom:10px;width:14px;height:14px;background:oklch(0.55 0.19 30)}`,
  }),
  effect({
    slug: "texto-com-imagem", title: "Texto recortando imagem", category: "texto",
    summary: "background-clip: text com uma textura ou foto preenchendo letras grossas.",
    tags: ["clip", "título", "textura"], boldness: 3, use: ["Título de campanha", "Capa"], avoid: ["Fontes finas", "Textura com pouco contraste"],
    html: `<h1 class="c">MAR</h1>`,
    css: `.c{font:900 7rem/1 var(--font);margin:0;padding:1rem 1.4rem;letter-spacing:-.05em;color:transparent;background:repeating-linear-gradient(170deg,oklch(0.5 0.13 230) 0 10px,oklch(0.65 0.12 210) 10px 20px,oklch(0.8 0.09 200) 20px 26px);-webkit-background-clip:text;background-clip:text;animation:wv 6s linear infinite}
@keyframes wv{to{background-position:0 120px}}`,
  }),
  // imagem
  effect({
    slug: "duotone", title: "Duotone", category: "imagem",
    summary: "Imagem em escala de cinza com duas cores mapeadas por mix-blend-mode. Unifica fotos de origens diferentes.",
    tags: ["foto", "duotone", "blend"], boldness: 3, use: ["Fotos de equipe com qualidades diferentes", "Capas"], avoid: ["Fotos de produto (muda a cor real)"],
    html: `<div class="d"><div class="ph"></div></div>`,
    css: `.d{position:relative;height:100vh;background:oklch(0.3 0.12 260)}
.ph{position:absolute;inset:0;background:radial-gradient(circle at 35% 40%,#fff 0 18%,#888 30%,#222 60%),linear-gradient(#000,#fff);filter:grayscale(1) contrast(1.2);mix-blend-mode:screen;opacity:.9}
.d::after{content:"";position:absolute;inset:0;background:oklch(0.66 0.21 0);mix-blend-mode:multiply}`,
  }),
  effect({
    slug: "moldura-polaroide", title: "Moldura de foto impressa", category: "imagem",
    summary: "Foto com margem branca, legenda escrita e leve rotação. Memória, não banco de imagem.",
    tags: ["foto", "polaroide", "pessoal"], boldness: 2, use: ["Página 'sobre'", "Depoimentos com foto"], avoid: ["Galerias grandes"],
    fonts: ["Caveat"],
    html: `<div class="w"><figure><div class="im"></div><figcaption>equipe, março</figcaption></figure></div>`,
    css: `.w{height:100vh;display:grid;place-items:center;background:oklch(0.9 0.03 75)}
figure{margin:0;background:#fff;padding:10px 10px 6px;transform:rotate(-3deg);box-shadow:0 10px 20px -10px oklch(0.3 0.05 50/.5)}
.im{width:140px;height:120px;background:linear-gradient(160deg,oklch(0.75 0.08 60),oklch(0.5 0.07 30))}
figcaption{font:600 1.3rem "Caveat",cursive;text-align:center;color:oklch(0.35 0.03 260)}`,
  }),
];
