import { OWN, refs, type Seed } from "./common";

type P = {
  slug: string;
  title: string;
  summary: string;
  category: "hero" | "features" | "prova-social" | "cta" | "conteúdo" | "preços" | "navegação" | "rodapé" | "galeria" | "processo";
  structure: string[];
  wireframe: string;
  variations: string[];
  html: string;
  css: string;
  height?: number;
  dark?: boolean;
  fonts?: string[];
  tags: string[];
  sectors?: string[];
  boldness: number;
  use: string[];
  avoid: string[];
  anti: string[];
  pairs?: string[];
  component_refs?: string[];
};

function pattern(p: P): Seed {
  return {
    kind: "pattern",
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    category: p.category,
    tags: p.tags,
    sectors: p.sectors ?? [],
    boldness: p.boldness,
    when_to_use: p.use,
    avoid_when: p.avoid,
    anti_patterns: p.anti,
    pairs_with: p.pairs ?? [],
    component_refs: p.component_refs ?? [],
    references: [refs.laws],
    license: OWN,
    structure: p.structure,
    wireframe: p.wireframe.replace(/^\n/, "").replace(/\s+$/, ""),
    variations: p.variations,
    demo: { html: p.html.trim(), css: p.css.trim(), height: p.height ?? 240, fonts: p.fonts ?? [], hover: false, dark: !!p.dark },
  };
}

// Pattern demos are laid out in rem; the demo page sets 1rem = 1/52 of the frame width,
// so the preview scales like a screenshot of a ~1040px wide page.
export const patterns: Seed[] = [
  pattern({
    slug: "hero-assimetrico", title: "Hero assimétrico", category: "hero",
    summary: "Título grande ocupando 7 de 12 colunas à esquerda, texto e CTA deslocados, imagem sangrando à direita.",
    structure: ["Rótulo pequeno (categoria ou ano)", "Título de 2–3 linhas, alinhado à esquerda", "Parágrafo curto em coluna estreita deslocada", "CTA primário + link secundário", "Imagem ou demo sangrando na borda direita"],
    wireframe: `
+--------------------------------------------------+
| LOGO                         menu  menu  [CTA]   |
|                                                  |
| 01 / ESTÚDIO                                     |
| TÍTULO GRANDE QUE          +---------------------|
| OCUPA SETE COLUNAS         |                     |
|            texto curto     |      IMAGEM         |
|            deslocado       |      sangrando      |
|            [CTA]  link →   |                     |
+--------------------------------------------------+`,
    variations: ["Imagem à esquerda e texto à direita", "Sem imagem: número gigante ocupando o lado direito", "Título quebrando a grade e invadindo a imagem"],
    tags: ["hero", "assimétrico", "grid"], boldness: 3, use: ["Quase qualquer landing que não quer cara de template"], avoid: ["Quando o produto precisa de screenshot grande centralizado"],
    anti: ["Hero centralizado com título + subtítulo + 2 botões", "Gradiente roxo atrás", "Mockup de celular flutuando com sombra"],
    pairs: ["suico", "editorial", "revelar-em-linhas"], component_refs: ["@shadcn/button", "@shadcn/navigation-menu"],
    html: `<header><b>Lume</b><nav><span>Trabalhos</span><span>Estúdio</span><a>Contato</a></nav></header>
<section class="h"><small>01 / ESTÚDIO DE MARCA</small><h1>Marcas que<br>parecem gente,<br>não template.</h1><div class="tx"><p>Identidade, site e embalagem para negócios independentes de BH.</p><div class="ct"><a class="p">Ver trabalhos</a><a>Falar com a gente →</a></div></div><div class="img"></div></section>`,
    css: `header{display:flex;justify-content:space-between;align-items:center;padding:1.6rem 2.4rem;font:600 1rem var(--font)}header nav{display:flex;gap:2rem;align-items:center}header a{padding:.6rem 1.2rem;background:var(--fg);color:var(--bg)}
.h{display:grid;grid-template-columns:repeat(12,1fr);gap:1.2rem;padding:1rem 0 0 2.4rem;position:relative}
.h small{grid-column:1/8;grid-row:1;font:600 .8rem var(--mono);letter-spacing:.1em;color:var(--accent)}
.h h1{grid-column:1/8;grid-row:2;font:800 4.6rem/.95 var(--font);letter-spacing:-.045em;margin:0;position:relative;z-index:1}
.tx{grid-column:3/8;grid-row:3;font:400 1.15rem/1.45 var(--font);color:var(--muted)}.tx p{margin:0 0 1.4rem}.ct{display:flex;gap:1.6rem;align-items:center;font:600 1rem var(--font);color:var(--fg)}.ct .p{padding:.9rem 1.5rem;background:var(--accent);color:var(--accent-fg)}
.img{grid-column:8/13;grid-row:1/4;min-height:24rem;background:linear-gradient(160deg,oklch(0.75 0.08 60),oklch(0.45 0.06 40) 60%,oklch(0.3 0.04 30))}`,
    height: 240,
  }),
  pattern({
    slug: "features-em-bento", title: "Features em bento", category: "features",
    summary: "Grade com uma caixa dominante 2x2, caixas médias e uma faixa larga. Cada caixa mostra a feature, não um ícone.",
    structure: ["Título da seção alinhado à esquerda com contagem (ex.: 6 coisas)", "Caixa principal 2x2 com mini demo real", "3–4 caixas menores com número, gráfico ou trecho de UI", "Faixa larga com integração ou logos"],
    wireframe: `
| 6 COISAS QUE O APP FAZ                           |
| +-----------------+ +--------+ +--------+        |
| |                 | | 98%    | | gráfico|        |
| |  DEMO PRINCIPAL | +--------+ +--------+        |
| |                 | +-------------------+        |
| +-----------------+ | trecho de UI      |        |
| +----------------------------+ +-------+         |
| | faixa larga: integrações   | | CTA   |         |
+--------------------------------------------------+`,
    variations: ["Caixa dominante à direita", "Versão escura com bordas 1px", "Mobile: vira pilha com a dominante primeiro"],
    tags: ["bento", "features", "grid"], boldness: 2, use: ["Mostrar 4–7 funcionalidades", "Página de produto"], avoid: ["Só 2 features (use split)"],
    anti: ["Todas as caixas iguais", "Ícone + título + 1 frase em cada caixa", "Cada caixa com um gradiente"],
    pairs: ["bento", "entrada-em-cascata", "card-de-metrica"], component_refs: ["@magicui/bento-grid", "@shadcn/card"],
    html: `<section class="b"><h2><small>6 coisas</small>O que o app resolve</h2><div class="g"><div class="big"><b>Agenda que se preenche</b><div class="cal"><i></i><i class="on"></i><i></i><i class="on"></i><i class="on"></i><i></i><i></i><i class="on"></i><i></i><i></i><i class="on"></i><i></i><i></i><i></i></div></div><div class="m"><em>98%</em><span>confirmam pelo WhatsApp</span></div><div class="m"><div class="bars"><i style="height:40%"></i><i style="height:70%"></i><i style="height:55%"></i><i style="height:90%"></i></div><span>faturamento</span></div><div class="w"><span>Lembrete enviado para</span><b>Maria · 14h30</b></div><div class="wide">Pix · Google Agenda · WhatsApp · Planilha</div><div class="cta">Testar grátis →</div></div></section>`,
    css: `.b{padding:2.4rem}.b h2{font:800 2.6rem var(--font);letter-spacing:-.04em;margin:0 0 1.4rem}.b h2 small{display:block;font:500 .9rem var(--mono);color:var(--muted);letter-spacing:0}
.g{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:9rem;gap:.9rem}.g>div{background:var(--surface);border:1px solid var(--line);border-radius:1.2rem;padding:1.2rem;font:500 1rem var(--font);display:flex;flex-direction:column;justify-content:space-between}
.big{grid-column:span 2;grid-row:span 2}.big b{font-size:1.5rem}.cal{display:grid;grid-template-columns:repeat(7,1fr);gap:.4rem}.cal i{height:2.4rem;border-radius:.4rem;background:var(--line)}.cal i.on{background:var(--accent)}
.m em{font:800 2.6rem var(--font);font-style:normal;letter-spacing:-.04em}.m span,.w span{color:var(--muted);font-size:.9rem}.bars{display:flex;align-items:flex-end;gap:.4rem;height:4rem}.bars i{flex:1;background:var(--fg);border-radius:.3rem}
.w{grid-column:span 2}.w b{font-size:1.3rem}.wide{grid-column:span 3;justify-content:center!important;color:var(--muted)}.cta{background:var(--fg)!important;color:var(--bg);font-weight:700!important;justify-content:center!important}`,
    height: 257,
  }),
  pattern({
    slug: "prova-social-editorial", title: "Prova social editorial", category: "prova-social",
    summary: "Uma citação grande em serifa com aspas tipográficas, nome e cargo pequenos, e dois depoimentos menores ao lado.",
    structure: ["Citação principal (até 25 palavras) em serifa grande", "Autor: nome, cargo, empresa, sem foto de banco", "Coluna lateral com 2 citações curtas", "Número de prova (ex.: 120 clientes) como rodapé"],
    wireframe: `
| “CITAÇÃO PRINCIPAL EM SERIFA         | “curta 1”  |
|  GRANDE QUE OCUPA A MAIOR PARTE      |  — nome    |
|  DA LARGURA.”                        |------------|
|  — Nome, cargo · Empresa             | “curta 2”  |
|--------------------------------------+  — nome    |
| 120 clientes · desde 2019                         |`,
    variations: ["Citação com foto real recortada em P&B", "Marquee de citações curtas abaixo", "Uma citação por tela no mobile com scroll horizontal"],
    tags: ["depoimento", "citação", "editorial"], boldness: 2, use: ["Serviços e agências", "Produtos com poucos mas bons clientes"], avoid: ["Quando não há depoimentos reais"],
    anti: ["Grade de 6 cards iguais com 5 estrelas", "Fotos de banco de imagem sorrindo", "Depoimentos inventados"],
    pairs: ["editorial", "serifa-de-revista", "marquee-de-logos"], fonts: ["Fraunces"], component_refs: ["@magicui/marquee", "@shadcn/card"],
    html: `<section class="q"><blockquote class="main"><p>“O site novo fez a gente parar de explicar o que faz. Agora o cliente chega sabendo.”</p><cite>Renata Alves, sócia · Ateliê Barro</cite></blockquote><aside><blockquote><p>“Entregaram antes do prazo.”</p><cite>Paulo, Café Ponto</cite></blockquote><blockquote><p>“Primeira agência que respondeu rápido.”</p><cite>Júlia, Studio J</cite></blockquote></aside><footer>120 clientes · desde 2019</footer></section>`,
    css: `.q{display:grid;grid-template-columns:2.2fr 1fr;gap:2.4rem;padding:3rem 2.4rem;font:400 1rem var(--font)}.q blockquote{margin:0}
.main p{font:500 3rem/1.08 "Fraunces",serif;letter-spacing:-.02em;margin:0 0 1.4rem}.main cite{font:600 .95rem var(--font);font-style:normal;color:var(--muted)}
aside{display:grid;gap:1.6rem;align-content:start;border-left:1px solid var(--line);padding-left:1.6rem}aside p{font:500 1.35rem/1.2 "Fraunces",serif;margin:0 0 .4rem}aside cite{font-style:normal;color:var(--muted);font-size:.9rem}
footer{grid-column:1/-1;border-top:3px solid var(--fg);padding-top:.8rem;font:500 .9rem var(--mono);color:var(--muted)}`,
    height: 170,
  }),
  pattern({
    slug: "cta-de-rodape", title: "CTA de rodapé", category: "cta",
    summary: "Última dobra com frase gigante alinhada à esquerda, um botão e o contato direto ao lado. Fecha a página com convicção.",
    structure: ["Frase curta e direta em display gigante", "Um único botão (sem 2 opções competindo)", "Contato alternativo visível (e-mail, WhatsApp)", "Rodapé mínimo logo abaixo"],
    wireframe: `
|                                                  |
| VAMOS FAZER                                      |
| O SEU?                     [ Pedir orçamento ]   |
|                            ou ola@estudio.com    |
|--------------------------------------------------|
| © 2026 · Instagram · LinkedIn          BH, MG    |`,
    variations: ["Fundo na cor de acento chapada", "Frase com uma palavra em itálico serifado", "Formulário de e-mail inline no lugar do botão"],
    tags: ["cta", "rodapé", "conversão"], boldness: 3, use: ["Fim de qualquer landing"], avoid: ["Páginas de app logado"],
    anti: ["Card centralizado com 'Pronto para começar?'", "Dois botões iguais", "Gradiente de fundo"],
    pairs: ["hero-assimetrico", "suico"], component_refs: ["@shadcn/button"],
    html: `<section class="c"><h2>Vamos fazer<br><em>o seu?</em></h2><div class="a"><a class="p">Pedir orçamento</a><span>ou ola@lume.studio</span></div></section><footer class="f"><span>© 2026 Lume</span><span>Instagram · LinkedIn</span><span>BH, MG</span></footer>`,
    css: `.c{display:grid;grid-template-columns:1.6fr 1fr;align-items:end;gap:2rem;padding:4rem 2.4rem 3rem;background:var(--accent);color:var(--accent-fg)}
.c h2{font:800 5.2rem/.92 var(--font);letter-spacing:-.05em;margin:0}.c em{font-weight:400;font-style:italic}
.a{display:grid;gap:.8rem;font:500 1rem var(--font)}.a .p{padding:1.2rem 1.6rem;background:var(--accent-fg);color:var(--accent);font-weight:700;font-size:1.2rem;text-align:center}
.f{display:flex;justify-content:space-between;padding:1.2rem 2.4rem;font:500 .85rem var(--mono);color:var(--muted)}`,
    height: 131,
  }),
  pattern({
    slug: "citacao-grande", title: "Citação de página inteira", category: "conteúdo",
    summary: "Uma frase só ocupando a dobra, deslocada para a direita, com número de seção à esquerda.",
    structure: ["Número ou rótulo de seção à esquerda", "Frase de 10–20 palavras em display", "Assinatura pequena"],
    wireframe: `
| 03      UMA FRASE SÓ, GRANDE, OCUPANDO           |
|         A DOBRA INTEIRA E DESLOCADA PARA         |
|         A DIREITA.                               |
|                                      — assinatura|`,
    variations: ["Fundo escuro", "Com uma palavra em cor de acento"],
    tags: ["citação", "manifesto", "pausa"], boldness: 3, use: ["Pausa entre seções longas", "Manifesto da marca"], avoid: ["Frases genéricas ('inovação e qualidade')"],
    anti: ["Aspas gigantes decorativas cinzas", "Centralizar"],
    pairs: ["editorial", "suico"], fonts: ["Instrument Serif"],
    html: `<section class="cq"><span>03</span><p>A gente não faz site bonito. A gente faz site que <em>o cliente entende</em> em cinco segundos.</p><cite>— manifesto, 2026</cite></section>`,
    css: `.cq{display:grid;grid-template-columns:8rem 1fr;gap:1rem;padding:4rem 2.4rem}.cq span{font:600 1rem var(--mono);color:var(--muted)}
.cq p{font:400 4rem/1.02 "Instrument Serif",serif;letter-spacing:-.02em;margin:0}.cq em{color:var(--accent)}.cq cite{grid-column:2;justify-self:end;font:500 1rem var(--font);color:var(--muted);font-style:normal}`,
    height: 173,
  }),
  pattern({
    slug: "lista-indice", title: "Lista índice", category: "conteúdo",
    summary: "Projetos ou serviços como linhas de índice: número, nome grande, categoria e ano. Hover revela.",
    structure: ["Linhas numeradas 01, 02…", "Nome em display, categoria e ano em mono", "Filete entre linhas", "Hover: fundo ou miniatura aparece"],
    wireframe: `
| 01  NOME DO PROJETO GRANDE        branding  2026 |
|--------------------------------------------------|
| 02  OUTRO PROJETO                 site      2025 |
|--------------------------------------------------|
| 03  MAIS UM                       embalagem 2025 |`,
    variations: ["Miniatura seguindo o cursor", "Versão com filtros por categoria no topo"],
    tags: ["portfólio", "lista", "índice"], boldness: 2, use: ["Portfólio com muitos projetos", "Lista de serviços"], avoid: ["Produtos que precisam de imagem"],
    anti: ["Grade de cards com thumbnail e título", "Ícones de seta em cada linha sem hover"],
    pairs: ["brutalismo", "academico-arquivo", "revelar-ao-passar"],
    html: `<section class="li"><div class="r"><i>01</i><b>Ateliê Barro</b><span>branding</span><span>2026</span></div><div class="r on"><i>02</i><b>Café Ponto</b><span>site</span><span>2025</span></div><div class="r"><i>03</i><b>Feira do Mercado</b><span>sinalização</span><span>2025</span></div><div class="r"><i>04</i><b>Studio J</b><span>embalagem</span><span>2024</span></div></section>`,
    css: `.li{padding:2rem 2.4rem}.r{display:grid;grid-template-columns:4rem 1fr 10rem 5rem;align-items:baseline;padding:1.1rem .8rem;border-top:1px solid var(--fg);font:500 1rem var(--mono);color:var(--muted)}
.r b{font:700 2.6rem var(--font);letter-spacing:-.04em;color:var(--fg)}.r.on{background:var(--accent)}.r.on *{color:var(--accent-fg)}`,
    height: 167,
  }),
  pattern({
    slug: "hero-tela-cheia-lateral", title: "Hero de tela cheia com texto lateral", category: "hero",
    summary: "Foto ocupando a tela, texto pequeno em caixa alta no canto inferior esquerdo e um CTA fantasma.",
    structure: ["Imagem em tela cheia", "Rótulo e título discretos no canto", "CTA fantasma fino", "Indicador de scroll sutil"],
    wireframe: `
|LOGO                                      MENU    |
|                                                  |
|                 IMAGEM TELA CHEIA                |
|                                                  |
|RESIDÊNCIAS NA SERRA                              |
|[ AGENDAR VISITA ]                         01/04  |`,
    variations: ["Vídeo curto em loop no lugar da foto", "Texto no canto superior direito"],
    tags: ["hero", "luxo", "imagem"], boldness: 2, use: ["Imobiliário, hotelaria, moda"], avoid: ["Sem foto boa (fica pior que nada)"],
    anti: ["Texto centralizado sobre a foto com overlay preto 50%", "Carrossel automático rápido"],
    pairs: ["luxo-sobrio", "fade-lento", "botao-fantasma-fino"], dark: true, fonts: ["Cormorant Garamond"],
    html: `<section class="fs"><header><b>SERRA</b><span>MENU</span></header><div class="tx"><small>COLEÇÃO 2026</small><h1>Residências<br>na serra</h1><a>Agendar visita</a></div><span class="n">01 / 04</span></section>`,
    css: `.fs{position:relative;height:100vh;min-height:30rem;background:linear-gradient(180deg,oklch(0 0 0/.15),oklch(0 0 0/.55)),linear-gradient(200deg,oklch(0.55 0.05 160),oklch(0.35 0.04 120) 50%,oklch(0.2 0.02 80));color:oklch(0.95 0.01 85)}
.fs header{display:flex;justify-content:space-between;padding:2rem 2.4rem;font:500 .9rem var(--font);letter-spacing:.3em}
.tx{position:absolute;left:2.4rem;bottom:2.4rem}.tx small{font:500 .8rem var(--font);letter-spacing:.3em;color:oklch(0.78 0.09 85)}.tx h1{font:500 4.4rem/.95 "Cormorant Garamond",serif;margin:.6rem 0 1.6rem}
.tx a{display:inline-block;padding:1rem 2rem;border:1px solid oklch(0.78 0.09 85);font:500 .8rem var(--font);letter-spacing:.3em;text-transform:uppercase}.n{position:absolute;right:2.4rem;bottom:2.4rem;font:500 .9rem var(--mono)}`,
    height: 220,
  }),
  pattern({
    slug: "cartaz-tipografico", title: "Cartaz tipográfico", category: "hero",
    summary: "Só tipografia: palavras gigantes de tamanhos diferentes empilhadas, data e local como num cartaz de evento.",
    structure: ["Nome do evento quebrado em 2–4 linhas de tamanhos diferentes", "Data e local em bloco pequeno", "Uma cor de acento chapada", "Ingresso/CTA como etiqueta"],
    wireframe: `
| FESTIVAL                       12—14 JUN         |
| DE INVERNO                     PRAÇA DA ESTAÇÃO  |
| 2026  ←enorme                                    |
|                    [ INGRESSOS ]                 |`,
    variations: ["Texto girado 90° na lateral", "Duas tintas sobrepostas (riso)"],
    tags: ["cartaz", "tipografia", "evento"], boldness: 5, use: ["Eventos, festivais, shows"], avoid: ["Serviços corporativos"],
    anti: ["Foto genérica de multidão", "Contagem regressiva gigante"],
    pairs: ["risografia", "display-gorda", "cartaz-condensado"], fonts: ["Bebas Neue"],
    html: `<section class="cz"><h1><span>FESTIVAL</span><span>DE INVERNO</span><span class="big">2026</span></h1><aside><b>12—14 JUN</b><span>PRAÇA DA ESTAÇÃO · BH</span><a>INGRESSOS</a></aside></section>`,
    css: `.cz{display:grid;grid-template-columns:2fr 1fr;padding:2.4rem;background:oklch(0.86 0.17 92);color:#111;min-height:28rem}
.cz h1{margin:0;font:400 1rem/.82 "Bebas Neue",sans-serif}.cz h1 span{display:block;font-size:5.4rem}.cz h1 .big{font-size:13rem;color:oklch(0.55 0.22 28)}
.cz aside{display:grid;align-content:space-between;justify-items:end;font:700 1.1rem var(--font);text-align:right}.cz aside b{font:400 3rem "Bebas Neue",sans-serif}.cz a{padding:1rem 1.6rem;background:#111;color:oklch(0.86 0.17 92);transform:rotate(-4deg)}`,
    height: 188,
  }),
  pattern({
    slug: "galeria-em-rio", title: "Galeria em rio", category: "galeria",
    summary: "Imagens de proporções diferentes alinhadas por baixo, com legendas em mono e espaços irregulares.",
    structure: ["Faixa horizontal de 3–5 imagens de alturas diferentes", "Legendas curtas com número e título", "Scroll horizontal no mobile"],
    wireframe: `
| +------+        +----+                +--------+ |
| |      | +----+ |    |  +----------+  |        | |
| |      | |    | |    |  |          |  |        | |
| +------+ +----+ +----+  +----------+  +--------+ |
| 01 casa  02 vaso 03 mesa 04 luminária  05 sofá   |`,
    variations: ["Alinhado pelo topo", "Uma imagem em cor e o resto em P&B"],
    tags: ["galeria", "imagens", "ritmo"], boldness: 2, use: ["Portfólio de produto, arquitetura"], avoid: ["Imagens de baixa qualidade"],
    anti: ["Grade quadrada perfeita de 9 fotos", "Lightbox com animação pesada"],
    pairs: ["minimal-japones", "editorial"],
    html: `<section class="gr"><figure style="--h:16rem;--w:12rem;--c:60"><i></i><figcaption>01 casa</figcaption></figure><figure style="--h:10rem;--w:8rem;--c:30"><i></i><figcaption>02 vaso</figcaption></figure><figure style="--h:20rem;--w:9rem;--c:90"><i></i><figcaption>03 luminária</figcaption></figure><figure style="--h:12rem;--w:14rem;--c:140"><i></i><figcaption>04 mesa</figcaption></figure></section>`,
    css: `.gr{display:flex;align-items:flex-end;gap:2.4rem;padding:3rem 2.4rem}.gr figure{margin:0}.gr i{display:block;width:var(--w);height:var(--h);background:linear-gradient(170deg,oklch(0.85 0.03 var(--c)),oklch(0.6 0.05 var(--c)))}
.gr figcaption{font:500 .85rem var(--mono);color:var(--muted);margin-top:.6rem}`,
    height: 181,
  }),
  pattern({
    slug: "regua-de-numeros", title: "Régua de números", category: "prova-social",
    summary: "Faixa com 3–4 números grandes separados por filetes verticais, cada um com rótulo curto embaixo.",
    structure: ["3–4 métricas reais", "Número em display, unidade menor", "Rótulo de 2–4 palavras"],
    wireframe: `
| 40 t        | 220 kW      | 24 meses     | 1987    |
| por turno   | de potência | de garantia  | fundada |`,
    variations: ["Com contador animado ao entrar", "Fundo escuro"],
    tags: ["números", "métricas", "faixa"], boldness: 2, use: ["Industrial, B2B", "Resultados de agência"], avoid: ["Números vaidosos sem significado"],
    anti: ["'+1000 clientes satisfeitos' sem fonte", "Ícones acima dos números"],
    pairs: ["industrial-mineiro", "suico", "contador-de-numeros"], fonts: ["Big Shoulders Display"],
    html: `<section class="rn"><div><b>40<small>t</small></b><span>por turno</span></div><div><b>220<small>kW</small></b><span>de potência</span></div><div><b>24<small>meses</small></b><span>de garantia</span></div><div><b>1987</b><span>fundada em Contagem</span></div></section>`,
    css: `.rn{display:grid;grid-template-columns:repeat(4,1fr);padding:2.4rem;border-top:3px solid var(--fg);border-bottom:1px solid var(--fg)}.rn div{padding:0 1.4rem;border-left:1px solid var(--line)}.rn div:first-child{border:0;padding-left:0}
.rn b{display:block;font:800 5rem/1 "Big Shoulders Display",sans-serif}.rn small{font-size:1.6rem;margin-left:.3rem}.rn span{font:500 1rem var(--font);color:var(--muted)}`,
    height: 76,
  }),
  pattern({
    slug: "ficha-catalografica", title: "Ficha catalográfica", category: "conteúdo",
    summary: "Item apresentado como ficha de acervo: número de registro, metadados em mono, imagem e descrição.",
    structure: ["Número de registro em destaque", "Tabela de metadados (autor, data, técnica)", "Imagem com legenda", "Descrição curta"],
    wireframe: `
| REG. 0042                       +--------------+ |
| autor ..... Fulano              |              | |
| data ...... 1974                |    IMAGEM    | |
| técnica ... óleo s/ tela        |              | |
| descrição curta em serifa       +--------------+ |`,
    variations: ["Lista de fichas empilhadas", "Ficha com furo e sombra de papel"],
    tags: ["acervo", "metadados", "catálogo"], boldness: 2, use: ["Museus, acervos, coleções", "Catálogo de produtos artesanais"], avoid: ["E-commerce rápido"],
    anti: ["Tabela de metadados com bordas pesadas"],
    pairs: ["academico-arquivo", "serifa-de-livro"], fonts: ["Libre Caslon Text"],
    html: `<section class="fc"><div class="m"><b>REG. 0042</b><dl><dt>autor</dt><dd>Maria Helena</dd><dt>data</dt><dd>1974</dd><dt>técnica</dt><dd>óleo sobre tela</dd><dt>acervo</dt><dd>Casa do Baile</dd></dl><p>Paisagem da lagoa vista do alto, com a igreja ainda em obra.</p></div><figure><i></i><figcaption>fig. 12</figcaption></figure></section>`,
    css: `.fc{display:grid;grid-template-columns:1.2fr 1fr;gap:2.4rem;padding:2.4rem;font:400 1rem var(--font)}.fc b{font:700 2.4rem var(--mono);letter-spacing:-.03em}
.fc dl{display:grid;grid-template-columns:8rem 1fr;margin:1.2rem 0;font:500 .95rem var(--mono)}.fc dt{color:var(--muted);border-bottom:1px dotted var(--line);padding:.35rem 0}.fc dd{margin:0;border-bottom:1px dotted var(--line);padding:.35rem 0}
.fc p{font:400 1.3rem/1.4 "Libre Caslon Text",serif;margin:0}.fc figure{margin:0}.fc i{display:block;height:18rem;background:linear-gradient(180deg,oklch(0.8 0.04 220),oklch(0.65 0.06 150) 55%,oklch(0.5 0.05 100))}.fc figcaption{font:500 .8rem var(--mono);color:var(--muted);margin-top:.4rem}`,
    height: 159,
  }),
  pattern({
    slug: "depoimento-em-cartao", title: "Depoimento em cartão", category: "prova-social",
    summary: "Cartões levemente rotacionados como bilhetes, com foto pequena real e frase curta escrita como fala.",
    structure: ["2–3 cartões de tamanho e rotação diferentes", "Frase curta em primeira pessoa", "Nome e contexto (bairro, produto comprado)"],
    wireframe: `
|   +-----------+                 +------------+   |
|   | “frase”   |   +---------+   | “frase”    |   |
|   |  — nome   |   | “frase” |   |  — nome    |   |
|   +-----------+   +---------+   +------------+   |`,
    variations: ["Fundo de papel com grão", "Cartões em marquee lento"],
    tags: ["depoimento", "humano", "quente"], boldness: 3, use: ["Negócios locais, gastronomia"], avoid: ["B2B formal"],
    anti: ["5 estrelas em todos", "Fotos de banco de imagem"],
    pairs: ["organico-quente", "barro-e-creme"], fonts: ["Young Serif"],
    html: `<section class="dc"><article style="--r:-3deg">“O pão de queijo é o mesmo da minha avó.”<span>— Dona Lúcia, Santa Tereza</span></article><article style="--r:2deg;--y:2rem">“Peço toda sexta pro escritório.”<span>— Bruno, Savassi</span></article><article style="--r:-1deg">“Café coado que dá vontade de voltar.”<span>— Carla, Floresta</span></article></section>`,
    css: `.dc{display:flex;gap:1.6rem;padding:3rem 2.4rem;background:oklch(0.95 0.025 75)}.dc article{flex:1;padding:1.6rem;background:oklch(0.99 0.01 80);transform:rotate(var(--r)) translateY(var(--y,0));box-shadow:0 1rem 2rem -1.2rem oklch(0.4 0.06 45/.4);font:400 1.6rem/1.2 "Young Serif",serif;color:oklch(0.28 0.04 45)}
.dc span{display:block;margin-top:1rem;font:500 .9rem var(--font);color:oklch(0.47 0.045 50)}`,
    height: 112,
  }),
  pattern({
    slug: "precos-em-colunas", title: "Preços em colunas abertas", category: "preços",
    summary: "Planos como colunas separadas por filete, sem cards. Preço grande, o que inclui e para quem não é.",
    structure: ["2–3 planos em colunas", "Nome e preço em destaque", "Lista curta (até 5 itens)", "Linha 'não é para'", "Botão por coluna"],
    wireframe: `
| BÁSICO          | COMPLETO        | SOB MEDIDA       |
| R$ 900          | R$ 2.400        | a conversar      |
| - item          | - item          | - item           |
| não é para…     | não é para…     |                  |
| [ escolher ]    | [ escolher ]    | [ conversar ]    |`,
    variations: ["Toggle mensal/anual acima", "Tabela comparativa abaixo"],
    tags: ["preços", "planos", "serviço"], boldness: 2, use: ["Freelancer, agência, SaaS simples"], avoid: ["Mais de 4 planos"],
    anti: ["Card do meio maior com glow e 'Mais popular'", "Preço riscado falso"],
    pairs: ["card-de-preco", "suico"], component_refs: ["@shadcn/button", "@shadcn/tabs"],
    html: `<section class="pc"><div><small>Básico</small><b>R$ 900</b><ul><li>1 página</li><li>Publicação</li></ul><em>Não é para: loja.</em><a>Escolher</a></div><div class="on"><small>Completo</small><b>R$ 2.400</b><ul><li>Até 5 páginas</li><li>Blog</li><li>1 mês de ajustes</li></ul><em>Não é para: app.</em><a>Escolher</a></div><div><small>Sob medida</small><b>a conversar</b><ul><li>Sistema, loja ou app</li></ul><a>Conversar</a></div></section>`,
    css: `.pc{display:grid;grid-template-columns:repeat(3,1fr);padding:2.4rem;font:400 1rem var(--font)}.pc>div{display:flex;flex-direction:column;gap:.6rem;padding:0 1.6rem;border-left:1px solid var(--line)}.pc>div:first-child{border:0;padding-left:0}
.pc small{font:600 .8rem var(--font);letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}.pc b{font:800 2.6rem var(--font);letter-spacing:-.04em}.pc ul{margin:0;padding-left:1.2rem;line-height:1.7;flex:1}.pc em{color:var(--muted);font-size:.9rem}
.pc a{padding:.9rem;text-align:center;border:1.5px solid var(--fg);font-weight:600}.pc .on a{background:var(--fg);color:var(--bg)}.pc .on small{color:var(--accent)}`,
    height: 135,
  }),
  pattern({
    slug: "faq-em-duas-colunas", title: "FAQ em duas colunas", category: "conteúdo",
    summary: "Título e contato fixos à esquerda, perguntas em acordeão à direita. Respostas curtas e honestas.",
    structure: ["Coluna esquerda: título, frase e contato", "Coluna direita: 5–8 perguntas em acordeão", "Primeira pergunta aberta"],
    wireframe: `
| PERGUNTAS            | Pergunta 1                 − |
| FREQUENTES           |   resposta curta             |
|                      |------------------------------|
| não achou?           | Pergunta 2                 + |
| fale no WhatsApp     | Pergunta 3                 + |`,
    variations: ["Categorias como abas acima", "Busca nas perguntas"],
    tags: ["faq", "acordeão", "suporte"], boldness: 1, use: ["Quase toda landing de serviço"], avoid: ["Perguntas que ninguém faz"],
    anti: ["Perguntas inventadas para SEO", "Centralizar tudo numa coluna estreita"],
    pairs: ["acordeao-suave"], component_refs: ["@shadcn/accordion"],
    html: `<section class="fq"><div class="l"><h2>Perguntas<br>frequentes</h2><p>Não achou? <u>Fale no WhatsApp</u>.</p></div><div class="r"><div class="q o"><b>Quanto tempo leva?</b><span>−</span><p>De 1 a 3 semanas, dependendo do número de páginas.</p></div><div class="q"><b>Vocês fazem a hospedagem?</b><span>+</span></div><div class="q"><b>Posso editar o site depois?</b><span>+</span></div><div class="q"><b>Como é o pagamento?</b><span>+</span></div></div></section>`,
    css: `.fq{display:grid;grid-template-columns:1fr 1.6fr;gap:3rem;padding:3rem 2.4rem;font:400 1rem var(--font)}.l h2{font:800 3rem/1 var(--font);letter-spacing:-.04em;margin:0 0 1rem}.l p{color:var(--muted)}
.q{display:grid;grid-template-columns:1fr auto;padding:1.2rem 0;border-bottom:1px solid var(--line);font-size:1.2rem}.q:first-child{border-top:1px solid var(--line)}.q p{grid-column:1/-1;color:var(--muted);margin:.6rem 0 0;font-size:1rem}`,
    height: 153,
  }),
  pattern({
    slug: "rodape-editorial", title: "Rodapé editorial", category: "rodapé",
    summary: "Nome da marca enorme cortado na base da página, colunas de links pequenas acima.",
    structure: ["3–4 colunas de links", "Contato e endereço", "Nome da marca gigante sangrando no fim"],
    wireframe: `
| Estúdio      Projetos     Contato     Redes       |
| sobre        branding     ola@…       instagram   |
| equipe       sites        BH, MG      linkedin    |
| L U M E  ← nome gigante cortado pela borda        |`,
    variations: ["Nome em outline", "Nome com hover que preenche"],
    tags: ["rodapé", "marca", "tipografia"], boldness: 3, use: ["Estúdios, marcas com nome forte"], avoid: ["Nomes longos"],
    anti: ["Rodapé com 40 links", "Newsletter com glass"],
    pairs: ["hero-assimetrico", "cta-de-rodape"],
    html: `<footer class="re"><div class="cols"><div><b>Estúdio</b><span>Sobre</span><span>Equipe</span></div><div><b>Projetos</b><span>Branding</span><span>Sites</span></div><div><b>Contato</b><span>ola@lume.studio</span><span>BH, MG</span></div><div><b>Redes</b><span>Instagram</span><span>LinkedIn</span></div></div><div class="big">lume</div></footer>`,
    css: `.re{background:var(--fg);color:var(--bg);overflow:hidden;padding:2.4rem 2.4rem 0}.cols{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;font:400 .95rem var(--font)}.cols div{display:grid;gap:.4rem}.cols b{font-weight:700;margin-bottom:.3rem}.cols span{opacity:.75}
.big{font:900 15rem/.75 var(--font);letter-spacing:-.07em;margin-top:2rem;margin-bottom:-2.4rem}`,
    height: 116,
  }),
  pattern({
    slug: "cabecalho-com-menu", title: "Cabeçalho com menu em tela cheia", category: "navegação",
    summary: "Logo e botão 'Menu' em texto; ao abrir, a tela vira lista gigante de links com numeração.",
    structure: ["Barra mínima: logo + 'Menu'", "Menu aberto: links gigantes numerados", "Contato no rodapé do menu"],
    wireframe: `
| LOGO                                     FECHAR  |
| 01  Trabalhos                                    |
| 02  Estúdio                                      |
| 03  Contato                                      |
| ola@estudio.com                     instagram    |`,
    variations: ["Menu entrando de cima com clip-path", "Links com miniatura no hover"],
    tags: ["menu", "navegação", "mobile"], boldness: 3, use: ["Portfólio, estúdio", "Sites com até 6 páginas"], avoid: ["E-commerce com muitas categorias"],
    anti: ["Ícone de hambúrguer sem rótulo", "Menu lateral estreito"],
    pairs: ["lista-indice", "sublinhado-que-cresce"], component_refs: ["@shadcn/sheet"],
    html: `<section class="mn"><header><b>Lume</b><span>Fechar</span></header><nav><a><i>01</i>Trabalhos</a><a class="on"><i>02</i>Estúdio</a><a><i>03</i>Contato</a></nav><footer><span>ola@lume.studio</span><span>Instagram</span></footer></section>`,
    css: `.mn{background:var(--accent);color:var(--accent-fg);padding:2rem 2.4rem;min-height:28rem;display:flex;flex-direction:column}.mn header{display:flex;justify-content:space-between;font:600 1.1rem var(--font)}
.mn nav{flex:1;display:grid;align-content:center;gap:.4rem}.mn a{font:800 4.4rem/1 var(--font);letter-spacing:-.04em;display:flex;gap:1.4rem;align-items:baseline}.mn a i{font:500 1rem var(--mono);font-style:normal}.mn a.on{font-style:italic;font-weight:400}
.mn footer{display:flex;justify-content:space-between;font:500 1rem var(--font)}`,
    height: 183,
  }),
  pattern({
    slug: "split-de-portfolio", title: "Split de portfólio", category: "hero",
    summary: "Tela dividida: lado esquerdo fixo com nome e bio, lado direito rola com os projetos.",
    structure: ["Coluna esquerda sticky: nome, bio de 2 linhas, contatos", "Coluna direita: projetos grandes empilhados", "Mobile: vira bio no topo + lista"],
    wireframe: `
| NOME             | +----------------------------+ |
| bio curta        | |  PROJETO 1                 | |
| em duas linhas   | +----------------------------+ |
|                  | +----------------------------+ |
| email · insta    | |  PROJETO 2                 | |`,
    variations: ["Esquerda com foto P&B", "Direita em grade de 2 colunas"],
    tags: ["portfólio", "split", "sticky"], boldness: 2, use: ["Portfólio pessoal de designer/dev"], avoid: ["Empresas com várias seções"],
    anti: ["Foto de perfil redonda centralizada com 'Olá, eu sou'"],
    pairs: ["instrument-duo", "grafite-e-violeta"], fonts: ["Instrument Serif"],
    html: `<section class="sp"><aside><h1>Ana Lima</h1><p>Direção de arte para restaurantes e cafés. <em>Belo Horizonte.</em></p><span>ana@lima.art · Instagram</span></aside><div class="pj"><figure><i style="--c:40"></i><figcaption>Café Ponto — identidade</figcaption></figure><figure><i style="--c:160"></i><figcaption>Horta Viva — embalagem</figcaption></figure></div></section>`,
    css: `.sp{display:grid;grid-template-columns:1fr 1.5fr;gap:2.4rem;padding:2.4rem;font:400 1rem var(--font)}.sp aside{display:flex;flex-direction:column;gap:1rem}.sp h1{font:400 4.4rem/.9 "Instrument Serif",serif;margin:0}.sp p{font-size:1.3rem;line-height:1.35;margin:0}.sp p em{color:var(--muted)}.sp span{margin-top:auto;font:500 .9rem var(--mono);color:var(--muted)}
.pj{display:grid;gap:1.4rem}.pj figure{margin:0}.pj i{display:block;height:13rem;background:linear-gradient(150deg,oklch(0.8 0.07 var(--c)),oklch(0.5 0.08 var(--c)))}.pj figcaption{margin-top:.5rem;font:500 .9rem var(--font)}`,
    height: 231,
  }),
  pattern({
    slug: "processo-em-etapas", title: "Processo em etapas", category: "processo",
    summary: "Etapas numeradas em linha horizontal com duração de cada uma. Tira a ansiedade de quem contrata.",
    structure: ["3–5 etapas numeradas", "Nome curto e 1 frase por etapa", "Duração em mono", "Linha conectando"],
    wireframe: `
| 01 ————— 02 ————— 03 ————— 04                     |
| Conversa  Proposta  Criação   Publicação          |
| 1 dia     2 dias    2 sem     1 dia               |`,
    variations: ["Vertical no mobile", "Com a etapa atual destacada (para clientes)"],
    tags: ["processo", "etapas", "serviço"], boldness: 1, use: ["Serviços, agências, freelas"], avoid: ["Produtos self-service"],
    anti: ["Ícones genéricos de lâmpada/foguete", "Etapas vagas ('Descoberta', 'Mágica')"],
    pairs: ["linha-do-tempo", "trilha-de-etapas"],
    html: `<section class="pe"><h2>Como funciona</h2><ol><li><i>01</i><b>Conversa</b><p>Você conta o que precisa.</p><span>1 dia</span></li><li><i>02</i><b>Proposta</b><p>Preço fechado e prazo.</p><span>2 dias</span></li><li><i>03</i><b>Criação</b><p>Duas rodadas de ajuste.</p><span>2 semanas</span></li><li><i>04</i><b>No ar</b><p>Domínio e treinamento.</p><span>1 dia</span></li></ol></section>`,
    css: `.pe{padding:2.4rem;font:400 1rem var(--font)}.pe h2{font:800 2.6rem var(--font);letter-spacing:-.04em;margin:0 0 2rem}.pe ol{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(4,1fr)}
.pe li{border-top:2px solid var(--fg);padding:1rem 1.2rem 0 0;display:grid;gap:.4rem}.pe i{font:600 .9rem var(--mono);font-style:normal;color:var(--accent)}.pe b{font:700 1.5rem var(--font)}.pe p{margin:0;color:var(--muted)}.pe span{font:500 .85rem var(--mono)}`,
    height: 123,
  }),
  pattern({
    slug: "antes-e-depois", title: "Antes e depois", category: "prova-social",
    summary: "Duas metades com divisor arrastável comparando o site antigo e o novo, ou o produto antes/depois.",
    structure: ["Imagem 'antes' e 'depois' do mesmo enquadramento", "Divisor com alça (arrastar ou teclado)", "Rótulos nos cantos"],
    wireframe: `
| ANTES                |                    DEPOIS |
|                      ||                           |
|      imagem A       <||>       imagem B           |
|                      ||                           |`,
    variations: ["Lado a lado sem divisor no mobile", "Com métrica abaixo (ex.: +40% pedidos)"],
    tags: ["comparação", "resultado", "case"], boldness: 2, use: ["Cases de redesign", "Reformas, estética"], avoid: ["Imagens com enquadramento diferente"],
    anti: ["Antes propositalmente piorado"],
    component_refs: [],
    html: `<section class="ab"><div class="a"><span>ANTES</span></div><div class="b"><span>DEPOIS</span></div><i></i></section>`,
    css: `.ab{position:relative;height:24rem;margin:2.4rem;overflow:hidden}.ab>div{position:absolute;inset:0;display:flex;padding:1.2rem;font:700 .9rem var(--mono)}
.a{background:repeating-linear-gradient(0deg,oklch(0.85 0 0) 0 1.2rem,oklch(0.9 0 0) 1.2rem 2.4rem)}.b{justify-content:flex-end;background:linear-gradient(150deg,oklch(0.75 0.12 60),oklch(0.5 0.12 30));color:#fff;clip-path:inset(0 0 0 50%);animation:sl 5s ease-in-out infinite}
.ab i{position:absolute;top:0;bottom:0;left:50%;width:3px;background:#fff;box-shadow:0 0 0 1px oklch(0 0 0/.2);animation:sx 5s ease-in-out infinite}.ab i::after{content:"";position:absolute;top:50%;left:50%;width:2.6rem;height:2.6rem;margin:-1.3rem;border-radius:50%;background:#fff;box-shadow:0 .2rem .8rem oklch(0 0 0/.3)}
@keyframes sl{0%,100%{clip-path:inset(0 0 0 50%)}50%{clip-path:inset(0 0 0 25%)}}@keyframes sx{0%,100%{left:50%}50%{left:25%}}`,
    height: 173,
  }),
  pattern({
    slug: "faixa-de-logos", title: "Faixa de logos honesta", category: "prova-social",
    summary: "Uma linha de logos em tom único, com frase curta à esquerda dizendo o que eles têm em comum.",
    structure: ["Frase à esquerda ('Cafés e padarias que já atendemos')", "4–6 logos monocromáticos", "Opcional: marquee no mobile"],
    wireframe: `
| Cafés e padarias      LOGO   LOGO   LOGO   LOGO   |
| que já atendemos                                  |`,
    variations: ["Marquee contínuo", "Logos com hover colorido"],
    tags: ["logos", "clientes", "prova-social"], boldness: 1, use: ["Logo abaixo do hero"], avoid: ["Logos de empresas que não são clientes"],
    anti: ["'Confiado por' + logos de big techs sem relação", "Logos coloridos misturados"],
    pairs: ["marquee-de-logos"], component_refs: ["@magicui/marquee"],
    html: `<section class="fl"><p>Cafés e padarias<br>que já atendemos</p><div><b>PONTO</b><b style="font-style:italic">Lume</b><b style="letter-spacing:.3em">FORNO</b><b>barro&co</b><b style="font-family:var(--mono)">grão.</b></div></section>`,
    css: `.fl{display:grid;grid-template-columns:14rem 1fr;align-items:center;gap:2rem;padding:2.4rem;border-block:1px solid var(--line)}.fl p{margin:0;font:500 1rem var(--font);color:var(--muted)}
.fl div{display:flex;justify-content:space-between;align-items:center;gap:1.4rem;font:800 1.8rem var(--font);color:var(--muted)}`,
    height: 60,
  }),
  pattern({
    slug: "sobre-com-foto", title: "Sobre com foto e fatos", category: "conteúdo",
    summary: "Foto real recortada à esquerda, texto em primeira pessoa e uma lista de fatos curtos em mono.",
    structure: ["Foto real (não banco)", "Texto em primeira pessoa, 3–5 linhas", "Lista de fatos: desde quando, onde, quantos", "Link de contato"],
    wireframe: `
| +---------+  Eu sou a Ana. Faço marcas para      |
| |  FOTO   |  quem cozinha.                       |
| |         |  desde ..... 2015                    |
| +---------+  clientes .. 120                     |`,
    variations: ["Foto em duotone", "Sem foto: assinatura manuscrita"],
    tags: ["sobre", "pessoal", "equipe"], boldness: 2, use: ["Página 'sobre' de profissional ou estúdio pequeno"], avoid: ["Empresas grandes (use equipe)"],
    anti: ["Texto em terceira pessoa formal", "Lista de 'valores' genéricos"],
    pairs: ["moldura-polaroide", "duotone"],
    html: `<section class="so"><i></i><div><p>Eu sou a Ana. Faço marcas para quem cozinha, de padaria de bairro a restaurante com estrela.</p><dl><dt>desde</dt><dd>2015</dd><dt>clientes</dt><dd>120</dd><dt>base</dt><dd>Belo Horizonte</dd></dl><a>Vamos conversar →</a></div></section>`,
    css: `.so{display:grid;grid-template-columns:16rem 1fr;gap:2.4rem;padding:2.4rem;font:400 1rem var(--font)}.so i{display:block;height:20rem;background:linear-gradient(170deg,oklch(0.7 0.05 60),oklch(0.4 0.04 40));filter:grayscale(.3)}
.so p{font:600 1.9rem/1.2 var(--font);letter-spacing:-.02em;margin:0 0 1.4rem}.so dl{display:grid;grid-template-columns:8rem 1fr;font:500 1rem var(--mono);margin:0 0 1.4rem}.so dt{color:var(--muted)}.so dd{margin:0}.so a{font-weight:700;text-decoration:underline;text-underline-offset:.3rem}`,
    height: 162,
  }),
];
