import { OWN, refs, type Seed } from "./common";

type M = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  trigger: "load" | "scroll" | "hover" | "tap" | "loop" | "state";
  duration_ms: number;
  easing: string;
  stagger_ms?: number;
  props: string[];
  reduced_motion: string;
  snippet: string;
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
  refs_?: string[];
  component_refs?: string[];
};

function motion(m: M): Seed {
  return {
    kind: "motion",
    slug: m.slug,
    title: m.title,
    summary: m.summary,
    category: m.category,
    tags: m.tags,
    sectors: [],
    boldness: m.boldness,
    when_to_use: m.use,
    avoid_when: m.avoid,
    anti_patterns: m.anti ?? ["Animar tudo na página com o mesmo efeito", "Duração acima de 600ms em interação direta", "Ignorar prefers-reduced-motion"],
    pairs_with: m.pairs ?? [],
    component_refs: m.component_refs ?? [],
    references: [refs.motion, refs.reducedMotion],
    license: OWN,
    trigger: m.trigger,
    duration_ms: m.duration_ms,
    easing: m.easing,
    stagger_ms: m.stagger_ms ?? 0,
    props: m.props,
    reduced_motion: m.reduced_motion,
    snippet: m.snippet.trim(),
    demo: { html: m.html.trim(), css: m.css.trim(), height: m.height ?? 220, fonts: m.fonts ?? [], hover: !!m.hover, dark: !!m.dark },
  };
}

export const motions: Seed[] = [
  motion({
    slug: "revelar-em-linhas", title: "Revelar em linhas", category: "texto", trigger: "load", duration_ms: 700, easing: "cubic-bezier(0.2, 0, 0, 1)", stagger_ms: 90,
    summary: "Cada linha do título sobe de dentro de uma máscara, uma depois da outra. Entrada clássica de site editorial.",
    props: ["y", "opacity"], reduced_motion: "Mostrar o texto direto, sem deslocamento; no máximo um fade de 150ms.",
    tags: ["título", "entrada", "stagger"], boldness: 2, use: ["Título principal do hero", "Abertura de seção editorial"], avoid: ["Texto que o usuário precisa ler imediatamente em formulários"], pairs: ["suico", "editorial"],
    snippet: `
const lines = ["Projeto,", "prazo e", "preço."];
<h1>{lines.map((l, i) => (
  <span key={l} style={{ display: "block", overflow: "hidden" }}>
    <motion.span style={{ display: "block" }} initial={{ y: "110%" }} animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.2, 0, 0, 1], delay: i * 0.09 }}>{l}</motion.span>
  </span>
))}</h1>`,
    html: `<h1 class="t"><span><i>Projeto,</i></span><span><i>prazo e</i></span><span><i>preço.</i></span></h1>`,
    css: `.t{font:700 2.6rem/1 var(--font);letter-spacing:-.04em;margin:0;padding:1.5rem}
.t span{display:block;overflow:hidden}.t i{display:block;font-style:normal;animation:up 3.2s cubic-bezier(.2,0,0,1) infinite}
.t span:nth-child(2) i{animation-delay:.09s}.t span:nth-child(3) i{animation-delay:.18s;color:var(--accent)}
@keyframes up{0%{transform:translateY(110%)}22%,85%{transform:none}100%{transform:translateY(-110%)}}`,
  }),
  motion({
    slug: "fade-de-capitular", title: "Capitular que aparece", category: "texto", trigger: "scroll", duration_ms: 900, easing: "cubic-bezier(0.33, 1, 0.68, 1)", stagger_ms: 200,
    summary: "A capitular surge primeiro com escala leve; o parágrafo vem logo depois. Ritmo de revista.",
    props: ["opacity", "scale", "y"], reduced_motion: "Sem escala; opacity de 0 a 1 em 200ms.",
    tags: ["editorial", "capitular", "leitura"], boldness: 2, use: ["Primeiro parágrafo de artigo", "Página 'sobre'"], avoid: ["Listas e UI"], pairs: ["editorial", "serifa-de-revista"],
    fonts: ["Fraunces", "Newsreader"],
    snippet: `
<motion.p initial="hidden" whileInView="show" viewport={{ once: true }}>
  <motion.span className="dropcap" variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }}
    transition={{ duration: 0.9, ease: [0.33, 1, 0.68, 1] }}>O</motion.span>
  <motion.span variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { delay: 0.2 } } }}>
    texto continua aqui…
  </motion.span>
</motion.p>`,
    html: `<p class="p"><b>O</b><span>café da esquina abre às sete e fecha quando acaba o pão. Ninguém lembra de ter visto o dono sentado.</span></p>`,
    css: `.p{font:400 1.05rem/1.5 "Newsreader",serif;padding:1.4rem;margin:0;color:var(--fg)}
.p b{float:left;font:600 4.2rem/.8 "Fraunces",serif;margin:.3rem .5rem 0 0;color:var(--accent);animation:cap 4s cubic-bezier(.33,1,.68,1) infinite}
.p span{display:block;animation:txt 4s cubic-bezier(.33,1,.68,1) infinite}
@keyframes cap{0%{opacity:0;transform:scale(.85)}22%,88%{opacity:1;transform:none}100%{opacity:0}}
@keyframes txt{0%,5%{opacity:0;transform:translateY(8px)}28%,88%{opacity:1;transform:none}100%{opacity:0}}`,
  }),
  motion({
    slug: "botao-que-afunda", title: "Botão que afunda", category: "interação", trigger: "tap", duration_ms: 120, easing: "cubic-bezier(0.7, 0, 0.3, 1)",
    summary: "No neo-brutalismo, o botão anda na direção da sombra dura e ela some, como uma tecla física.",
    props: ["x", "y", "boxShadow"], reduced_motion: "Mantém, é curto e não desloca a página; opcionalmente trocar por mudança de cor.",
    tags: ["botão", "neo-brutalismo", "feedback"], boldness: 4, use: ["CTAs em neo-brutalismo", "Botões de jogo"], avoid: ["Interfaces sóbrias"], pairs: ["neo-brutalismo", "botao-neo-brutal"], hover: true,
    component_refs: ["@shadcn/button"],
    snippet: `
<motion.button
  style={{ boxShadow: "5px 5px 0 #111", border: "3px solid #111" }}
  whileHover={{ x: -2, y: -2, boxShadow: "7px 7px 0 #111" }}
  whileTap={{ x: 5, y: 5, boxShadow: "0px 0px 0 #111" }}
  transition={{ duration: 0.12, ease: [0.7, 0, 0.3, 1] }}
>Começar</motion.button>`,
    html: `<div class="w"><button class="b">Começar agora</button></div>`,
    css: `.w{display:grid;place-items:center;height:100vh;background:oklch(0.96 0.05 95)}
.b{font:800 1.1rem var(--font);padding:.9rem 1.4rem;background:oklch(0.72 0.19 145);border:3px solid #111;box-shadow:5px 5px 0 #111;border-radius:8px;transition:transform .12s cubic-bezier(.7,0,.3,1),box-shadow .12s cubic-bezier(.7,0,.3,1);animation:press 2.4s infinite}
html.hover .b,.b:hover{transform:translate(-2px,-2px);box-shadow:7px 7px 0 #111;animation:none}
.b:active{transform:translate(5px,5px);box-shadow:0 0 0 #111}
@keyframes press{0%,40%{transform:none;box-shadow:5px 5px 0 #111}50%,60%{transform:translate(5px,5px);box-shadow:0 0 0 #111}70%,100%{transform:none;box-shadow:5px 5px 0 #111}}`,
  }),
  motion({
    slug: "entrada-em-cascata", title: "Entrada em cascata", category: "layout", trigger: "scroll", duration_ms: 500, easing: "cubic-bezier(0.33, 1, 0.68, 1)", stagger_ms: 70,
    summary: "Cards de uma grade sobem 12px e aparecem em sequência, da esquerda para a direita e de cima para baixo.",
    props: ["opacity", "y"], reduced_motion: "Todos aparecem juntos com fade de 150ms, sem deslocamento.",
    tags: ["stagger", "grid", "cards"], boldness: 2, use: ["Grades de features", "Bento", "Listas de produtos"], avoid: ["Mais de 12 itens (fica lento)"], pairs: ["bento", "features-em-bento"],
    component_refs: ["@magicui/blur-fade"],
    snippet: `
const container = { show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] } } };
<motion.ul variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
  {items.map((it) => <motion.li key={it.id} variants={item}>{it.title}</motion.li>)}
</motion.ul>`,
    html: `<div class="g"><i></i><i></i><i></i><i></i><i></i><i></i></div>`,
    css: `.g{display:grid;grid-template-columns:2fr 1fr 1fr;grid-auto-rows:70px;gap:8px;padding:16px}
.g i{background:var(--surface);border:1px solid var(--line);border-radius:12px;animation:in 3.4s cubic-bezier(.33,1,.68,1) infinite both}
.g i:first-child{grid-row:span 2;background:var(--accent)}
.g i:nth-child(2){animation-delay:.07s}.g i:nth-child(3){animation-delay:.14s}.g i:nth-child(4){animation-delay:.21s}.g i:nth-child(5){animation-delay:.28s}.g i:nth-child(6){animation-delay:.35s;grid-column:span 2}
@keyframes in{0%{opacity:0;transform:translateY(12px)}18%,85%{opacity:1;transform:none}100%{opacity:0}}`,
  }),
  motion({
    slug: "texto-que-pisca", title: "Piscar de letreiro", category: "texto", trigger: "loop", duration_ms: 1200, easing: "steps(2, jump-none)",
    summary: "Liga e desliga seco, sem fade, como placa de neon velha ou cursor de terminal.",
    props: ["opacity"], reduced_motion: "Parar ligado (opacity 1).",
    tags: ["brutalismo", "loop", "letreiro"], boldness: 5, use: ["Uma palavra de destaque", "Status 'ao vivo'"], avoid: ["Texto longo", "Mais de um elemento piscando (acessibilidade)"], pairs: ["brutalismo"],
    anti: ["Piscar mais de 3 vezes por segundo (risco de crise fotossensível)", "Piscar o CTA principal"],
    snippet: `
<motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear", times: [0, 0.5, 0.5] }}>
  AO VIVO
</motion.span>`,
    html: `<p class="x">ENTRADA <mark>GRÁTIS</mark><br>HOJE 22H</p>`,
    css: `.x{font:700 2.4rem/1.05 "IBM Plex Mono",monospace;margin:0;padding:1.4rem;letter-spacing:-.03em}
.x mark{background:#000;color:#fff;padding:0 .2em;animation:blink 1.2s steps(2,jump-none) infinite}
@keyframes blink{50%{opacity:0}}`, fonts: ["IBM Plex Mono"],
  }),
  motion({
    slug: "digitando", title: "Digitando", category: "texto", trigger: "load", duration_ms: 1800, easing: "steps(22)",
    summary: "Texto aparece letra por letra com cursor de bloco no final. Para comandos e respostas curtas.",
    props: ["width (ch)", "clipPath"], reduced_motion: "Mostrar o texto completo, sem cursor piscando.",
    tags: ["terminal", "texto", "dev"], boldness: 3, use: ["Hero de devtool", "Demonstração de CLI"], avoid: ["Frases longas (o usuário espera demais)"], pairs: ["terminal-dev", "mono-total"],
    component_refs: ["@magicui/typing-animation", "@magicui/terminal"], dark: true, fonts: ["JetBrains Mono"],
    snippet: `
const text = "npx moldes brief --goal saas";
const [n, setN] = useState(0);
useEffect(() => { if (n < text.length) { const t = setTimeout(() => setN(n + 1), 60); return () => clearTimeout(t); } }, [n]);
<code>{text.slice(0, n)}<motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.6 }}>▌</motion.span></code>`,
    html: `<div class="c"><span class="p">$</span><span class="t">npx moldes brief --saas</span></div>`,
    css: `.c{font:500 1.05rem "JetBrains Mono",monospace;padding:1.4rem;color:oklch(0.9 0.03 150);display:flex;gap:.6ch;height:100vh;box-sizing:border-box;background:oklch(0.17 0.01 160)}
.p{color:oklch(0.84 0.2 145)}
.t{display:inline-block;overflow:hidden;white-space:nowrap;width:23ch;border-right:.6em solid oklch(0.84 0.2 145);animation:type 4s steps(23) infinite,cur .6s step-end infinite;height:1.3em}
@keyframes type{0%{width:0}45%,90%{width:23ch}100%{width:0}}
@keyframes cur{50%{border-color:transparent}}`,
  }),
  motion({
    slug: "cursor-piscando", title: "Cursor piscando", category: "detalhe", trigger: "loop", duration_ms: 1000, easing: "step-end",
    summary: "Um bloco ou traço piscando no fim do título dá vida sem animar o resto.",
    props: ["opacity"], reduced_motion: "Cursor fixo, sem piscar.",
    tags: ["cursor", "terminal", "micro"], boldness: 2, use: ["Final de título em sites dev", "Campo de busca vazio"], avoid: ["Vários cursores na mesma tela"], pairs: ["terminal-dev"], dark: true, fonts: ["JetBrains Mono"],
    snippet: `
<h1>Feito para o terminal<motion.span aria-hidden animate={{ opacity: [1, 1, 0, 0] }}
  transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}>_</motion.span></h1>`,
    html: `<h1 class="h">Feito para<br>o terminal<span>_</span></h1>`,
    css: `.h{font:700 2.3rem/1.05 "JetBrains Mono",monospace;padding:1.4rem;margin:0;color:oklch(0.92 0.02 150);background:oklch(0.17 0.01 160);height:100vh;box-sizing:border-box;letter-spacing:-.04em}
.h span{color:oklch(0.84 0.2 145);animation:b 1s step-end infinite}@keyframes b{50%{opacity:0}}`,
  }),
  motion({
    slug: "flutuar-suave", title: "Flutuar suave", category: "loop", trigger: "loop", duration_ms: 6000, easing: "ease-in-out",
    summary: "Formas sobem e descem poucos pixels em ritmos diferentes. Dá vida a ilustrações paradas.",
    props: ["y", "rotate"], reduced_motion: "Formas paradas.",
    tags: ["loop", "ambiente", "formas"], boldness: 2, use: ["Ilustrações do hero", "Memphis, orgânico"], avoid: ["Elementos clicáveis (alvo se mexendo)"], pairs: ["organico-quente", "memphis-contido"],
    snippet: `
<motion.div animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }} />`,
    html: `<div class="s"><i class="a"></i><i class="b"></i><i class="c"></i></div>`,
    css: `.s{position:relative;height:100vh;background:oklch(0.95 0.025 75)}
.s i{position:absolute;animation:f 6s ease-in-out infinite}
.a{width:90px;height:90px;border-radius:60% 40% 55% 45%/50% 60% 40% 50%;background:oklch(0.55 0.13 40);left:18%;top:22%}
.b{width:60px;height:60px;border-radius:50%;background:oklch(0.75 0.1 120);right:22%;top:30%;animation-delay:-2s!important;animation-duration:5s!important}
.c{width:120px;height:40px;border-radius:30px;background:oklch(0.28 0.04 45);left:40%;bottom:18%;animation-delay:-4s!important;animation-duration:7s!important}
@keyframes f{50%{transform:translateY(-10px) rotate(4deg)}}`,
  }),
  motion({
    slug: "fade-lento", title: "Fade lento com desfoque", category: "entrada", trigger: "load", duration_ms: 1200, easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    summary: "Imagem ou título sai de um leve desfoque para nítido, devagar. Calma de marca premium.",
    props: ["opacity", "filter: blur"], reduced_motion: "Só opacity, 200ms.",
    tags: ["premium", "calmo", "entrada"], boldness: 1, use: ["Luxo sóbrio", "Minimal japonês"], avoid: ["Conteúdo urgente"], pairs: ["luxo-sobrio", "minimal-japones"], dark: true, fonts: ["Cormorant Garamond"],
    component_refs: ["@magicui/blur-fade"],
    snippet: `
<motion.h1 initial={{ opacity: 0, filter: "blur(8px)" }} animate={{ opacity: 1, filter: "blur(0px)" }}
  transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}>Residências na serra</motion.h1>`,
    html: `<div class="l"><small>COLEÇÃO 2026</small><h1>Residências<br><em>na serra</em></h1></div>`,
    css: `.l{background:oklch(0.15 0.005 80);color:oklch(0.93 0.01 85);height:100vh;padding:1.6rem;box-sizing:border-box}
.l small{font:500 .7rem var(--font);letter-spacing:.3em;color:oklch(0.78 0.09 85)}
.l h1{font:500 2.6rem/1 "Cormorant Garamond",serif;margin:.6rem 0 0;animation:bf 5s cubic-bezier(.4,0,.2,1) infinite}
@keyframes bf{0%{opacity:0;filter:blur(8px)}30%,85%{opacity:1;filter:blur(0)}100%{opacity:0;filter:blur(8px)}}`,
  }),
  motion({
    slug: "contador-de-numeros", title: "Contador de números", category: "dados", trigger: "scroll", duration_ms: 1600, easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    summary: "O número sobe do zero até o valor quando entra na tela, desacelerando no fim.",
    props: ["valor numérico"], reduced_motion: "Mostrar o valor final direto.",
    tags: ["números", "métricas", "dados"], boldness: 2, use: ["Métricas no hero", "Seção de resultados"], avoid: ["Números que mudam em tempo real"], pairs: ["industrial-mineiro", "card-de-metrica"],
    component_refs: ["@magicui/number-ticker"],
    snippet: `
const v = useMotionValue(0);
const text = useTransform(v, (n) => Math.round(n).toLocaleString("pt-BR"));
const ref = useRef(null); const inView = useInView(ref, { once: true });
useEffect(() => { if (inView) animate(v, 40000, { duration: 1.6, ease: [0.16, 1, 0.3, 1] }); }, [inView]);
<motion.span ref={ref}>{text}</motion.span>`,
    html: `<div class="n"><b></b><span>toneladas por mês</span></div>`,
    css: `@property --v{syntax:"<integer>";initial-value:0;inherits:false}
.n{padding:1.4rem}.n b{font:800 3.6rem/1 var(--font);letter-spacing:-.04em;--v:40000;counter-reset:v var(--v);animation:c 4s cubic-bezier(.16,1,.3,1) infinite}
.n b::after{content:counter(v)}.n span{display:block;color:var(--muted);font:500 .9rem var(--font)}
@keyframes c{0%{--v:0}50%,100%{--v:40000}}`,
  }),
  motion({
    slug: "marquee-de-logos", title: "Faixa rolando", category: "loop", trigger: "loop", duration_ms: 20000, easing: "linear",
    summary: "Uma faixa contínua de logos ou palavras rolando para o lado, com máscara nas bordas.",
    props: ["x"], reduced_motion: "Faixa parada, com scroll horizontal manual.",
    tags: ["marquee", "logos", "faixa"], boldness: 2, use: ["Logos de clientes", "Palavras-chave de serviço"], avoid: ["Informação essencial (some da tela)"], pairs: ["prova-social-editorial"],
    component_refs: ["@magicui/marquee"],
    snippet: `
<div style={{ overflow: "hidden", maskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)" }}>
  <motion.div style={{ display: "flex", gap: 48, width: "max-content" }}
    animate={{ x: ["0%", "-50%"] }} transition={{ duration: 20, ease: "linear", repeat: Infinity }}>
    {[...logos, ...logos].map((l, i) => <img key={i} src={l.src} alt={l.name} />)}
  </motion.div>
</div>`,
    html: `<div class="m"><div class="r"><span>Branding</span><span>Sites</span><span>Embalagem</span><span>Motion</span><span>Editorial</span><span>Branding</span><span>Sites</span><span>Embalagem</span><span>Motion</span><span>Editorial</span></div></div>`,
    css: `.m{overflow:hidden;padding:2.6rem 0;-webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)}
.r{display:flex;gap:2rem;width:max-content;animation:mq 12s linear infinite}
.r span{font:700 2rem var(--font);letter-spacing:-.03em}.r span:nth-child(even){font-style:italic;font-weight:400;color:var(--accent)}
@keyframes mq{to{transform:translateX(-50%)}}`,
  }),
  motion({
    slug: "sublinhado-que-cresce", title: "Sublinhado que cresce", category: "interação", trigger: "hover", duration_ms: 300, easing: "cubic-bezier(0.2, 0, 0, 1)",
    summary: "No hover o sublinhado cresce da esquerda; ao sair, encolhe para a direita.",
    props: ["scaleX", "transformOrigin"], reduced_motion: "Sublinhado aparece sem transição.",
    tags: ["link", "hover", "micro"], boldness: 1, use: ["Links de navegação", "Links em texto editorial"], avoid: ["Links dentro de parágrafos longos (use sublinhado fixo)"], hover: true,
    snippet: `
<motion.a href="#" initial="rest" whileHover="hover" style={{ position: "relative" }}>
  Trabalhos
  <motion.span style={{ position: "absolute", left: 0, right: 0, bottom: -2, height: 2, background: "currentColor", originX: 0 }}
    variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }} />
</motion.a>`,
    html: `<nav class="n"><a>Trabalhos</a><a class="on">Estúdio</a><a>Contato</a></nav>`,
    css: `.n{display:flex;gap:1.4rem;padding:2rem 1.4rem;font:600 1.3rem var(--font)}
.n a{position:relative;color:var(--fg)}
.n a::after{content:"";position:absolute;left:0;right:0;bottom:-3px;height:2px;background:var(--accent);transform:scaleX(0);transform-origin:right;transition:transform .3s cubic-bezier(.2,0,0,1)}
.n a:hover::after,html.hover .n a.on::after{transform:scaleX(1);transform-origin:left}`,
  }),
  motion({
    slug: "revelar-com-mascara", title: "Revelar com máscara", category: "imagem", trigger: "scroll", duration_ms: 900, easing: "cubic-bezier(0.77, 0, 0.175, 1)",
    summary: "A imagem é revelada por um recorte que abre de baixo para cima, enquanto ela mesma desce um pouco de escala.",
    props: ["clipPath", "scale"], reduced_motion: "Imagem aparece com fade simples.",
    tags: ["imagem", "clip-path", "entrada"], boldness: 3, use: ["Fotos de portfólio", "Imagem principal do hero"], avoid: ["Galerias com muitas imagens (cansa)"],
    snippet: `
<motion.figure initial={{ clipPath: "inset(100% 0 0 0)" }} whileInView={{ clipPath: "inset(0% 0 0 0)" }}
  viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1] }}>
  <motion.img src={src} alt="" initial={{ scale: 1.15 }} whileInView={{ scale: 1 }} transition={{ duration: 1.2 }} />
</motion.figure>`,
    html: `<figure class="f"><div class="img"></div><figcaption>Casa Pampulha, 2026</figcaption></figure>`,
    css: `.f{margin:0;padding:1rem}.img{height:150px;background:linear-gradient(160deg,oklch(0.7 0.08 60),oklch(0.45 0.06 40) 60%,oklch(0.3 0.04 30));border-radius:4px;animation:clip 4s cubic-bezier(.77,0,.175,1) infinite}
.f figcaption{font:500 .75rem var(--mono);color:var(--muted);margin-top:.5rem}
@keyframes clip{0%{clip-path:inset(100% 0 0 0);transform:scale(1.1)}35%,85%{clip-path:inset(0 0 0 0);transform:scale(1)}100%{clip-path:inset(0 0 100% 0)}}`,
  }),
  motion({
    slug: "troca-de-palavra", title: "Troca de palavra", category: "texto", trigger: "loop", duration_ms: 2400, easing: "cubic-bezier(0.65, 0, 0.35, 1)",
    summary: "Uma palavra do título gira verticalmente entre opções. Mostra vários públicos sem poluir.",
    props: ["y", "opacity"], reduced_motion: "Mostrar só a primeira palavra, fixa.",
    tags: ["título", "loop", "palavras"], boldness: 3, use: ["Hero com vários públicos ('para clínicas / escolas / lojas')"], avoid: ["Palavras de tamanho muito diferente (o título pula)"],
    component_refs: ["@magicui/word-rotate"],
    snippet: `
const words = ["clínicas", "escolas", "lojas"];
const [i, setI] = useState(0);
useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % words.length), 2400); return () => clearInterval(t); }, []);
<AnimatePresence mode="wait">
  <motion.span key={words[i]} initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-100%", opacity: 0 }}
    transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}>{words[i]}</motion.span>
</AnimatePresence>`,
    html: `<h1 class="h">Sites para <span class="w"><span>clínicas</span><span>escolas</span><span>lojas</span><span>clínicas</span></span></h1>`,
    css: `.h{font:700 2.1rem/1.15 var(--font);letter-spacing:-.03em;padding:1.5rem;margin:0}
.w{display:inline-block;height:1.15em;overflow:hidden;vertical-align:bottom;color:var(--accent)}
.w span{display:block;animation:rot 7.2s cubic-bezier(.65,0,.35,1) infinite}
@keyframes rot{0%,28%{transform:translateY(0)}33%,61%{transform:translateY(-100%)}66%,94%{transform:translateY(-200%)}100%{transform:translateY(-300%)}}`,
  }),
  motion({
    slug: "progresso-de-leitura", title: "Progresso de leitura", category: "scroll", trigger: "scroll", duration_ms: 0, easing: "linear",
    summary: "Uma barra fina no topo acompanha o scroll da página. Ligada direto ao scroll, sem atraso.",
    props: ["scaleX"], reduced_motion: "Mantém (é ligado ao scroll do próprio usuário).",
    tags: ["scroll", "leitura", "barra"], boldness: 1, use: ["Artigos longos", "Documentação"], avoid: ["Páginas curtas"],
    component_refs: ["@magicui/scroll-progress"],
    snippet: `
const { scrollYProgress } = useScroll();
<motion.div style={{ scaleX: scrollYProgress, originX: 0, position: "fixed", top: 0, left: 0, right: 0, height: 3, background: "var(--accent)" }} />
/* CSS puro: animation-timeline: scroll(); */`,
    html: `<div class="p"><i></i><h3>Como escolher uma paleta</h3><p></p><p></p><p class="s"></p><p></p></div>`,
    css: `.p{padding:1.2rem;position:relative}.p i{position:absolute;top:0;left:0;right:0;height:4px;background:var(--accent);transform-origin:0;animation:pr 5s linear infinite}
.p h3{font:700 1.2rem var(--font);margin:.6rem 0 1rem}.p p{height:10px;background:var(--line);border-radius:5px;margin:0 0 10px}.p p.s{width:60%}
@keyframes pr{from{transform:scaleX(0)}to{transform:scaleX(1)}}`,
  }),
  motion({
    slug: "cartas-empilhadas", title: "Cartas empilhadas", category: "layout", trigger: "loop", duration_ms: 3000, easing: "cubic-bezier(0.65, 0, 0.35, 1)",
    summary: "Depoimentos ou cards empilhados com leve rotação; o de cima vai para trás do monte em ciclo.",
    props: ["y", "rotate", "zIndex", "scale"], reduced_motion: "Mostrar a pilha parada e trocar por botões.",
    tags: ["cards", "depoimentos", "pilha"], boldness: 3, use: ["Depoimentos", "Galeria de cases no mobile"], avoid: ["Conteúdo que precisa ser comparado lado a lado"],
    snippet: `
const [order, setOrder] = useState(cards);
useEffect(() => { const t = setInterval(() => setOrder(([first, ...rest]) => [...rest, first]), 3000); return () => clearInterval(t); }, []);
{order.map((c, i) => (
  <motion.article key={c.id} layout animate={{ y: i * 10, scale: 1 - i * 0.04, rotate: i === 0 ? 0 : (i % 2 ? 2 : -2), zIndex: order.length - i }}
    transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}>{c.quote}</motion.article>
))}`,
    html: `<div class="st"><article>“Entregou em uma semana.”</article><article>“O site novo dobrou os pedidos.”</article><article>“Finalmente parece a gente.”</article></div>`,
    css: `.st{position:relative;height:100vh}.st article{position:absolute;left:12%;right:12%;top:28%;padding:1.1rem;background:var(--surface);border:1px solid var(--line);border-radius:14px;font:600 1rem/1.3 var(--font);box-shadow:0 8px 24px -12px oklch(0 0 0/.3);animation:cyc 9s cubic-bezier(.65,0,.35,1) infinite}
.st article:nth-child(2){animation-delay:-3s}.st article:nth-child(3){animation-delay:-6s}
@keyframes cyc{0%,28%{transform:translateY(0) rotate(0);z-index:3;opacity:1}33%,61%{transform:translateY(20px) scale(.92) rotate(-2deg);z-index:1;opacity:.8}66%,94%{transform:translateY(10px) scale(.96) rotate(2deg);z-index:2;opacity:.9}100%{transform:none;z-index:3}}`,
  }),
  motion({
    slug: "ponto-pulsante", title: "Ponto pulsante", category: "status", trigger: "loop", duration_ms: 1800, easing: "cubic-bezier(0, 0, 0.2, 1)",
    summary: "Ponto de status com um anel que expande e some. Indica 'ao vivo' ou 'online'.",
    props: ["scale", "opacity"], reduced_motion: "Ponto fixo, sem anel.",
    tags: ["status", "ao-vivo", "micro"], boldness: 1, use: ["Status online", "Badge 'ao vivo'"], avoid: ["Vários pontos pulsando juntos"],
    snippet: `
<span style={{ position: "relative", width: 10, height: 10 }}>
  <motion.span style={{ position: "absolute", inset: 0, borderRadius: 99, background: "var(--accent)" }}
    animate={{ scale: [1, 2.6], opacity: [0.6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: [0, 0, 0.2, 1] }} />
  <span style={{ position: "absolute", inset: 0, borderRadius: 99, background: "var(--accent)" }} />
</span>`,
    html: `<div class="s"><span class="d"></span>Sistema operando normalmente</div>`,
    css: `.s{display:flex;align-items:center;gap:.7rem;padding:2.4rem 1.4rem;font:500 1rem var(--font)}
.d{position:relative;width:10px;height:10px;border-radius:50%;background:oklch(0.65 0.17 150)}
.d::before{content:"";position:absolute;inset:0;border-radius:50%;background:inherit;animation:pl 1.8s cubic-bezier(0,0,.2,1) infinite}
@keyframes pl{from{transform:scale(1);opacity:.6}to{transform:scale(2.8);opacity:0}}`,
  }),
  motion({
    slug: "acordeao-suave", title: "Acordeão suave", category: "interação", trigger: "state", duration_ms: 320, easing: "cubic-bezier(0.2, 0, 0, 1)",
    summary: "Altura animada com grid-template-rows de 0fr a 1fr: abre sem saber a altura do conteúdo.",
    props: ["gridTemplateRows", "rotate (ícone)"], reduced_motion: "Abre e fecha sem transição.",
    tags: ["faq", "acordeão", "css"], boldness: 1, use: ["FAQ", "Detalhes técnicos"], avoid: ["Conteúdo principal escondido"],
    component_refs: ["@shadcn/accordion"],
    snippet: `
<motion.div initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
  transition={{ duration: 0.32, ease: [0.2, 0, 0, 1] }} style={{ overflow: "hidden" }}>{children}</motion.div>
/* CSS puro: .panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows .32s} .open .panel{grid-template-rows:1fr} */`,
    html: `<div class="a"><div class="q"><b>Vocês fazem a hospedagem?</b><span>+</span></div><div class="p"><div><p>Sim. Publicamos na Vercel e deixamos o domínio configurado.</p></div></div><div class="q"><b>Quanto tempo leva?</b><span>+</span></div></div>`,
    css: `.a{padding:1rem 1.2rem;font:400 .95rem/1.4 var(--font)}.q{display:flex;justify-content:space-between;padding:.8rem 0;border-bottom:1px solid var(--line)}
.q span{transition:transform .32s;animation:ic 4s infinite}.p{display:grid;grid-template-rows:0fr;animation:op 4s cubic-bezier(.2,0,0,1) infinite}.p>div{overflow:hidden}.p p{margin:.6rem 0;color:var(--muted)}
.q:last-child span{animation:none}
@keyframes op{0%,15%{grid-template-rows:0fr}30%,80%{grid-template-rows:1fr}95%,100%{grid-template-rows:0fr}}
@keyframes ic{0%,15%{transform:none}30%,80%{transform:rotate(45deg)}95%{transform:none}}`,
  }),
  motion({
    slug: "botao-magnetico", title: "Botão magnético", category: "interação", trigger: "hover", duration_ms: 400, easing: "spring(stiffness 300, damping 20)",
    summary: "O botão é puxado alguns pixels em direção ao cursor e volta com mola quando ele sai.",
    props: ["x", "y"], reduced_motion: "Desligar; botão fica parado.",
    tags: ["cursor", "mola", "desktop"], boldness: 3, use: ["CTA único no desktop", "Portfólio criativo"], avoid: ["Mobile (não tem cursor)", "Vários botões lado a lado"], hover: true,
    snippet: `
const x = useSpring(0, { stiffness: 300, damping: 20 }); const y = useSpring(0, { stiffness: 300, damping: 20 });
<motion.button style={{ x, y }}
  onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * 0.3); y.set((e.clientY - r.top - r.height / 2) * 0.3); }}
  onPointerLeave={() => { x.set(0); y.set(0); }}>Vamos conversar</motion.button>`,
    html: `<div class="w"><button class="b">Vamos conversar →</button></div>`,
    css: `.w{display:grid;place-items:center;height:100vh}
.b{font:600 1rem var(--font);padding:1rem 1.6rem;border-radius:99px;border:0;background:var(--fg);color:var(--bg);animation:mag 3s cubic-bezier(.34,1.56,.64,1) infinite}
@keyframes mag{0%,100%{transform:none}25%{transform:translate(10px,-6px)}50%{transform:translate(-8px,5px)}75%{transform:translate(4px,4px)}}`,
  }),
  motion({
    slug: "brilho-de-carregamento", title: "Brilho de carregamento", category: "estado", trigger: "loop", duration_ms: 1400, easing: "linear",
    summary: "Skeleton com uma faixa de luz atravessando. Mostra que algo está vindo sem spinner.",
    props: ["backgroundPosition"], reduced_motion: "Skeleton parado com opacidade alternando devagar, ou estático.",
    tags: ["loading", "skeleton", "estado"], boldness: 1, use: ["Listas e cards carregando"], avoid: ["Carregamentos de menos de 300ms (pisca)"],
    component_refs: ["@shadcn/skeleton"],
    snippet: `
<motion.div style={{ background: "linear-gradient(90deg, var(--s1) 30%, var(--s2) 50%, var(--s1) 70%)", backgroundSize: "300% 100%" }}
  animate={{ backgroundPosition: ["100% 0", "0% 0"] }} transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }} />`,
    html: `<div class="k"><div class="av"></div><div class="ln"><i></i><i class="s"></i></div></div><div class="k"><div class="av"></div><div class="ln"><i></i><i class="s"></i></div></div><div class="blk"></div>`,
    css: `.k{display:flex;gap:.8rem;padding:.8rem 1.2rem}.av{width:40px;height:40px;border-radius:50%}.ln{flex:1;display:grid;gap:8px;align-content:center}.ln i{height:10px;border-radius:5px}.ln i.s{width:55%}.blk{height:70px;margin:.4rem 1.2rem;border-radius:12px}
.av,.ln i,.blk{background:linear-gradient(90deg,var(--surface) 30%,var(--line) 50%,var(--surface) 70%);background-size:300% 100%;animation:sh 1.4s linear infinite}
@keyframes sh{from{background-position:100% 0}to{background-position:0 0}}`,
  }),
  motion({
    slug: "toast-que-entra", title: "Toast que entra e sai", category: "feedback", trigger: "state", duration_ms: 350, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    summary: "Notificação sobe do rodapé com um leve overshoot e sai para baixo com fade.",
    props: ["y", "opacity", "scale"], reduced_motion: "Fade simples, sem deslocamento.",
    tags: ["toast", "feedback", "notificação"], boldness: 2, use: ["Confirmação de ação ('copiado')"], avoid: ["Mensagens de erro críticas (use inline)"],
    component_refs: ["@shadcn/sonner"],
    snippet: `
<AnimatePresence>
  {show && <motion.div role="status" initial={{ y: 24, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }}
    exit={{ y: 16, opacity: 0 }} transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}>Copiado!</motion.div>}
</AnimatePresence>`,
    html: `<div class="w"><div class="t"><b>✓</b> Brief copiado</div></div>`,
    css: `.w{height:100vh;display:flex;align-items:flex-end;justify-content:center;padding-bottom:1.4rem;box-sizing:border-box}
.t{font:600 .95rem var(--font);background:var(--fg);color:var(--bg);padding:.8rem 1.1rem;border-radius:10px;display:flex;gap:.5rem;animation:ts 3s cubic-bezier(.34,1.56,.64,1) infinite}
.t b{color:var(--accent)}
@keyframes ts{0%{transform:translateY(30px) scale(.96);opacity:0}15%,75%{transform:none;opacity:1}90%,100%{transform:translateY(16px);opacity:0}}`,
  }),
  motion({
    slug: "zoom-no-hover", title: "Zoom dentro da moldura", category: "imagem", trigger: "hover", duration_ms: 600, easing: "cubic-bezier(0.2, 0, 0, 1)",
    summary: "No hover a imagem cresce 6% dentro da moldura fixa e a legenda sobe. Card de portfólio.",
    props: ["scale", "y"], reduced_motion: "Sem zoom; só mostrar a legenda.",
    tags: ["imagem", "card", "portfólio"], boldness: 2, use: ["Grade de projetos", "Cards de produto"], avoid: ["Imagens com texto (corta)"], hover: true,
    snippet: `
<motion.a initial="rest" whileHover="hover" style={{ overflow: "hidden", display: "block" }}>
  <motion.img src={src} variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }} transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }} />
  <motion.p variants={{ rest: { y: 8, opacity: 0 }, hover: { y: 0, opacity: 1 } }}>Ver projeto</motion.p>
</motion.a>`,
    html: `<a class="c"><div class="im"></div><p>Restaurante Lume <span>ver projeto →</span></p></a>`,
    css: `.c{display:block;margin:1rem;overflow:hidden;border-radius:10px;position:relative}
.im{height:170px;background:radial-gradient(circle at 30% 40%,oklch(0.8 0.1 80),oklch(0.55 0.12 40) 60%,oklch(0.3 0.05 30));transition:transform .6s cubic-bezier(.2,0,0,1)}
.c p{position:absolute;left:0;right:0;bottom:0;margin:0;padding:.8rem;font:600 .95rem var(--font);color:#fff;background:linear-gradient(transparent,oklch(0 0 0/.6));display:flex;justify-content:space-between}
.c p span{opacity:0;transform:translateY(8px);transition:.4s}
.c:hover .im,html.hover .im{transform:scale(1.06)}.c:hover p span,html.hover p span{opacity:1;transform:none}`,
  }),
  motion({
    slug: "letras-em-onda", title: "Letras em onda", category: "texto", trigger: "loop", duration_ms: 1600, easing: "ease-in-out", stagger_ms: 60,
    summary: "Cada letra sobe e desce em sequência, como uma onda passando pela palavra.",
    props: ["y"], reduced_motion: "Palavra parada.",
    tags: ["letras", "lúdico", "loop"], boldness: 4, use: ["Palavra única de destaque", "Tela de carregamento divertida"], avoid: ["Títulos longos", "Marcas sóbrias"],
    snippet: `
{"moldes".split("").map((ch, i) => (
  <motion.span key={i} style={{ display: "inline-block" }} animate={{ y: [0, -10, 0] }}
    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.06 }}>{ch}</motion.span>
))}`,
    html: `<h1 class="o"><span>o</span><span>n</span><span>d</span><span>a</span><span>!</span></h1>`,
    css: `.o{font:800 3.6rem var(--font);margin:0;padding:2rem 1.4rem;letter-spacing:-.03em}.o span{display:inline-block;animation:w 1.6s ease-in-out infinite}
.o span:nth-child(2){animation-delay:.06s}.o span:nth-child(3){animation-delay:.12s}.o span:nth-child(4){animation-delay:.18s}.o span:nth-child(5){animation-delay:.24s;color:var(--accent)}
@keyframes w{0%,60%,100%{transform:none}30%{transform:translateY(-12px)}}`,
  }),
  motion({
    slug: "parallax-de-camadas", title: "Parallax de camadas", category: "scroll", trigger: "scroll", duration_ms: 0, easing: "linear",
    summary: "Camadas se movem em velocidades diferentes conforme o scroll. Profundidade leve, sem enjoo.",
    props: ["y"], reduced_motion: "Camadas fixas.",
    tags: ["parallax", "scroll", "profundidade"], boldness: 3, use: ["Hero ilustrado", "Storytelling"], avoid: ["Deslocamentos acima de 15% (enjoo)", "Mobile com muitas camadas"],
    snippet: `
const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
const back = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
const front = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
<section ref={ref}><motion.div style={{ y: back }} /><motion.div style={{ y: front }} /></section>`,
    html: `<div class="px"><i class="s"></i><i class="m1"></i><i class="m2"></i><i class="f"></i></div>`,
    css: `.px{position:relative;height:100vh;overflow:hidden;background:oklch(0.9 0.04 220)}.px i{position:absolute;left:-10%;right:-10%}
.s{top:15%;left:auto!important;right:20%!important;width:46px;height:46px;border-radius:50%;background:oklch(0.85 0.14 85);animation:p1 5s ease-in-out infinite alternate}
.m1{bottom:0;height:55%;background:oklch(0.6 0.06 200);clip-path:polygon(0 60%,25% 20%,45% 55%,70% 10%,100% 50%,100% 100%,0 100%);animation:p2 5s ease-in-out infinite alternate}
.m2{bottom:0;height:40%;background:oklch(0.42 0.06 190);clip-path:polygon(0 50%,30% 30%,60% 60%,85% 25%,100% 45%,100% 100%,0 100%);animation:p3 5s ease-in-out infinite alternate}
.f{bottom:0;height:16%;background:oklch(0.28 0.04 180);animation:p4 5s ease-in-out infinite alternate}
@keyframes p1{to{transform:translateY(10px)}}@keyframes p2{to{transform:translateY(-6px)}}@keyframes p3{to{transform:translateY(-14px)}}@keyframes p4{to{transform:translateY(-22px)}}`,
  }),
  motion({
    slug: "desenhar-traco", title: "Desenhar o traço", category: "svg", trigger: "scroll", duration_ms: 1400, easing: "cubic-bezier(0.65, 0, 0.35, 1)",
    summary: "Um traço SVG se desenha sozinho, como se alguém sublinhasse ou circulasse algo à mão.",
    props: ["pathLength"], reduced_motion: "Traço completo, já desenhado.",
    tags: ["svg", "traço", "destaque"], boldness: 3, use: ["Sublinhar uma palavra do título", "Setas e anotações"], avoid: ["Ícones de interface"],
    snippet: `
<motion.svg viewBox="0 0 200 20"><motion.path d="M2 14 C 50 4, 120 4, 198 12" fill="none" stroke="var(--accent)" strokeWidth={4} strokeLinecap="round"
  initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }} /></motion.svg>`,
    html: `<h2 class="h">Sites que <span>vendem<svg viewBox="0 0 200 24" preserveAspectRatio="none"><path d="M3 16 C 50 5, 120 4, 197 13" pathLength="1"/></svg></span></h2>`,
    css: `.h{font:700 2.4rem/1.1 var(--font);letter-spacing:-.03em;padding:2rem 1.4rem;margin:0}.h span{position:relative;white-space:nowrap}
.h svg{position:absolute;left:0;bottom:-.25em;width:100%;height:.45em;overflow:visible}
.h path{fill:none;stroke:var(--accent);stroke-width:5;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:0;animation:dr 3.5s cubic-bezier(.65,0,.35,1) infinite}
@keyframes dr{0%{stroke-dashoffset:1}40%,85%{stroke-dashoffset:0}100%{stroke-dashoffset:-1}}`,
  }),
  motion({
    slug: "virar-cartao", title: "Virar o cartão", category: "interação", trigger: "hover", duration_ms: 600, easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    summary: "Cartão gira em 3D no eixo Y e mostra o verso com detalhes. Bom para equipe ou preços.",
    props: ["rotateY"], reduced_motion: "Trocar frente e verso com fade.",
    tags: ["3d", "cartão", "flip"], boldness: 3, use: ["Cartões de equipe", "Comparar 'antes/depois'"], avoid: ["Informação essencial escondida no verso"], hover: true,
    snippet: `
<motion.div style={{ transformStyle: "preserve-3d" }} animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}>
  <div style={{ backfaceVisibility: "hidden" }}>Frente</div>
  <div style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", position: "absolute", inset: 0 }}>Verso</div>
</motion.div>`,
    html: `<div class="sc"><div class="cd"><div class="fr"><b>Ana Lima</b><span>direção de arte</span></div><div class="bk">10 anos fazendo marca para restaurante.</div></div></div>`,
    css: `.sc{perspective:800px;padding:1.4rem;height:100vh;box-sizing:border-box}.cd{position:relative;height:150px;transform-style:preserve-3d;transition:transform .6s cubic-bezier(.4,0,.2,1);animation:fl 4s cubic-bezier(.4,0,.2,1) infinite}
.fr,.bk{position:absolute;inset:0;backface-visibility:hidden;border-radius:14px;padding:1.1rem;display:flex;flex-direction:column;justify-content:flex-end;font:400 .95rem var(--font)}
.fr{background:var(--accent);color:var(--accent-fg)}.fr b{font-size:1.4rem}.bk{background:var(--fg);color:var(--bg);transform:rotateY(180deg)}
html.hover .cd,.sc:hover .cd{animation:none;transform:rotateY(180deg)}
@keyframes fl{0%,35%{transform:none}50%,85%{transform:rotateY(180deg)}100%{transform:none}}`,
  }),
  motion({
    slug: "check-com-mola", title: "Check com mola", category: "feedback", trigger: "state", duration_ms: 500, easing: "spring(stiffness 400, damping 15)",
    summary: "Ao concluir, o círculo cresce com overshoot e o check se desenha. Recompensa pequena.",
    props: ["scale", "pathLength"], reduced_motion: "Check aparece pronto.",
    tags: ["sucesso", "check", "feedback"], boldness: 2, use: ["Formulário enviado", "Tarefa concluída"], avoid: ["Ações repetitivas (cansa)"],
    snippet: `
<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
  <svg viewBox="0 0 24 24"><motion.path d="M5 12l5 5L19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.15, duration: 0.3 }} /></svg>
</motion.div>`,
    html: `<div class="w"><div class="c"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1"/></svg></div><p>Pedido enviado</p></div>`,
    css: `.w{display:grid;place-items:center;align-content:center;gap:.8rem;height:100vh;font:600 1rem var(--font)}.w p{margin:0}
.c{width:64px;height:64px;border-radius:50%;background:oklch(0.62 0.16 150);display:grid;place-items:center;animation:pop 3s cubic-bezier(.34,1.56,.64,1) infinite}
.c svg{width:34px}.c path{fill:none;stroke:#fff;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:0;animation:ck 3s ease-out infinite}
@keyframes pop{0%{transform:scale(0)}15%,85%{transform:scale(1)}100%{transform:scale(0)}}
@keyframes ck{0%,15%{stroke-dashoffset:1}30%,85%{stroke-dashoffset:0}100%{stroke-dashoffset:1}}`,
  }),
  motion({
    slug: "transicao-de-pagina", title: "Transição de página", category: "navegação", trigger: "state", duration_ms: 400, easing: "cubic-bezier(0.65, 0, 0.35, 1)",
    summary: "A página atual sai para cima com fade e a nova entra de baixo. Pode usar View Transitions no CSS.",
    props: ["opacity", "y"], reduced_motion: "Troca instantânea.",
    tags: ["rotas", "view-transitions", "navegação"], boldness: 2, use: ["Sites multi-página com navegação frequente"], avoid: ["Apps de uso intenso (atrasa cada clique)"],
    snippet: `
/* CSS (View Transitions entre páginas) */
@view-transition { navigation: auto; }
::view-transition-old(root) { animation: 0.4s cubic-bezier(.65,0,.35,1) both out; }
::view-transition-new(root) { animation: 0.4s cubic-bezier(.65,0,.35,1) both in; }
@keyframes out { to { opacity: 0; transform: translateY(-12px); } }
@keyframes in { from { opacity: 0; transform: translateY(12px); } }`,
    html: `<div class="v"><div class="pg a"><b>Início</b><i></i><i></i></div><div class="pg b"><b>Projetos</b><i></i><i class="s"></i></div></div>`,
    css: `.v{position:relative;height:100vh}.pg{position:absolute;inset:1rem;padding:1rem;border:1px solid var(--line);border-radius:12px;background:var(--surface);font:700 1.3rem var(--font)}
.pg i{display:block;height:10px;background:var(--line);border-radius:5px;margin-top:12px}.pg i.s{width:50%}
.a{animation:pa 4s cubic-bezier(.65,0,.35,1) infinite}.b{animation:pb 4s cubic-bezier(.65,0,.35,1) infinite}.b b{color:var(--accent)}
@keyframes pa{0%,40%{opacity:1;transform:none}50%,90%{opacity:0;transform:translateY(-12px)}100%{opacity:1;transform:none}}
@keyframes pb{0%,45%{opacity:0;transform:translateY(12px)}55%,90%{opacity:1;transform:none}100%{opacity:0}}`,
  }),
];
