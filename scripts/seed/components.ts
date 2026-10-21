import { OWN, refs, type Seed } from "./common";

type C = {
  slug: string;
  title: string;
  summary: string;
  category: string;
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
  component_refs: string[];
};

function component(c: C): Seed {
  return {
    kind: "component",
    slug: c.slug,
    title: c.title,
    summary: c.summary,
    category: c.category,
    tags: c.tags,
    sectors: [],
    boldness: c.boldness,
    when_to_use: c.use,
    avoid_when: c.avoid,
    anti_patterns: c.anti ?? ["Copiar o visual padrão da biblioteca sem trocar tokens", "Alvo de toque menor que 44px"],
    pairs_with: c.pairs ?? [],
    component_refs: c.component_refs,
    references: [refs.shadcn],
    license: OWN,
    demo: { html: c.html.trim(), css: c.css.trim(), height: c.height ?? 200, fonts: c.fonts ?? [], hover: !!c.hover, dark: !!c.dark },
  };
}

export const components: Seed[] = [
  component({
    slug: "botao-neo-brutal", title: "Botão neo-brutal", category: "botão",
    summary: "Borda de 3px, sombra dura e rótulo pesado. Hover sobe, clique afunda.",
    tags: ["botão", "neo-brutalismo", "cta"], boldness: 4, use: ["CTA em neo-brutalismo"], avoid: ["Sites sóbrios"], pairs: ["neo-brutalismo", "botao-que-afunda"], hover: true,
    component_refs: ["@shadcn/button"],
    html: `<div class="w"><button class="nb">Quero participar</button><button class="nb ghost">Ver agenda</button></div>`,
    css: `.w{display:flex;flex-wrap:wrap;gap:12px;align-content:center;justify-content:center;height:100vh;background:oklch(0.96 0.05 95)}
.nb{min-height:48px;font:800 1rem var(--font);padding:0 1.2rem;border:3px solid #111;border-radius:8px;background:oklch(0.72 0.19 145);color:#111;box-shadow:4px 4px 0 #111;transition:transform .12s,box-shadow .12s}
.nb.ghost{background:#fff}.nb:hover,html.hover .nb:first-child{transform:translate(-2px,-2px);box-shadow:6px 6px 0 #111}.nb:active{transform:translate(4px,4px);box-shadow:0 0 0 #111}
.nb:focus-visible{outline:3px solid oklch(0.55 0.2 260);outline-offset:3px}`,
  }),
  component({
    slug: "botao-fantasma-fino", title: "Botão fantasma fino", category: "botão",
    summary: "Contorno de 1px, caixa alta pequena e tracking largo. Luxo que não grita.",
    tags: ["botão", "luxo", "contorno"], boldness: 1, use: ["Luxo sóbrio", "CTA secundário elegante"], avoid: ["CTA principal em app"], pairs: ["luxo-sobrio"], dark: true, hover: true,
    component_refs: ["@shadcn/button"],
    html: `<div class="w"><a class="g">Agendar visita</a></div>`,
    css: `.w{height:100vh;display:grid;place-items:center;background:oklch(0.15 0.005 80)}
.g{display:inline-flex;align-items:center;min-height:48px;padding:0 1.8rem;border:1px solid oklch(0.78 0.09 85);color:oklch(0.93 0.01 85);font:500 .75rem var(--font);letter-spacing:.3em;text-transform:uppercase;transition:background .4s,color .4s}
.g:hover,html.hover .g{background:oklch(0.78 0.09 85);color:oklch(0.15 0.005 80)}`,
  }),
  component({
    slug: "card-de-metrica", title: "Card de métrica", category: "card",
    summary: "Número grande, rótulo pequeno em mono e variação com seta. Sem gráfico se não precisa.",
    tags: ["métrica", "dashboard", "número"], boldness: 2, use: ["Dashboards", "Seção de resultados"], avoid: ["Números sem contexto"], pairs: ["bento", "contador-de-numeros"],
    component_refs: ["@shadcn/card", "@magicui/number-ticker"],
    html: `<div class="w"><div class="m"><small>RECEITA · OUT</small><b>R$ 18.420</b><span class="up">▲ 12% vs set</span></div><div class="m"><small>PEDIDOS</small><b>312</b><span class="dn">▼ 3%</span></div></div>`,
    css: `.w{display:grid;grid-template-columns:1.4fr 1fr;gap:10px;padding:1rem}
.m{padding:1rem;border:1px solid var(--line);border-radius:14px;background:var(--surface);display:grid;gap:.25rem}
.m small{font:500 .7rem var(--mono);letter-spacing:.08em;color:var(--muted)}.m b{font:700 1.6rem var(--font);letter-spacing:-.03em;font-variant-numeric:tabular-nums}
.up{color:oklch(0.5 0.14 150);font:600 .8rem var(--font)}.dn{color:oklch(0.52 0.19 25);font:600 .8rem var(--font)}`,
  }),
  component({
    slug: "bloco-de-comando", title: "Bloco de comando", category: "código",
    summary: "Linha de comando com prompt, botão de copiar e rótulo do gerenciador. Para docs e devtools.",
    tags: ["código", "cli", "copiar"], boldness: 2, use: ["Instalação na landing de devtool", "Documentação"], avoid: ["Público não técnico"], pairs: ["terminal-dev"], dark: true,
    component_refs: ["@magicui/terminal", "@shadcn/button"],
    html: `<div class="w"><div class="cmd"><span class="tab">pnpm</span><code><i>$</i> pnpm dlx shadcn add button</code><button aria-label="Copiar">copiar</button></div></div>`,
    css: `.w{height:100vh;display:grid;place-items:center;grid-template-columns:minmax(0,1fr);padding:1rem;box-sizing:border-box;background:oklch(0.16 0.005 260)}
.cmd{width:100%;display:flex;align-items:center;gap:.6rem;padding:.4rem .4rem .4rem .8rem;border:1px solid oklch(1 0 0/.12);border-radius:10px;background:oklch(0.2 0.006 260);font:500 .8rem var(--mono);color:oklch(0.92 0 0)}
.tab{color:oklch(0.88 0.19 125)}code{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}code i{color:oklch(0.65 0 0);font-style:normal}
.cmd button{min-height:36px;padding:0 .7rem;border:1px solid oklch(1 0 0/.15);border-radius:7px;background:transparent;color:inherit;font:inherit}`,
  }),
  component({
    slug: "campo-rotulo-flutuante", title: "Campo com rótulo que sobe", category: "formulário",
    summary: "O rótulo fica dentro do campo e sobe quando há foco ou valor. CSS puro com :placeholder-shown.",
    tags: ["input", "formulário", "rótulo"], boldness: 1, use: ["Formulários curtos (contato, login)"], avoid: ["Formulários longos (prefira rótulo fixo acima)"],
    component_refs: ["@shadcn/input", "@shadcn/label"],
    html: `<div class="w"><label class="f"><input placeholder=" " value="ana@exemplo.com"><span>E-mail</span></label><label class="f"><input placeholder=" "><span>Telefone</span></label></div>`,
    css: `.w{display:grid;gap:14px;padding:1.2rem}
.f{position:relative;display:block}.f input{width:100%;box-sizing:border-box;min-height:52px;padding:1.2rem .9rem .4rem;border:1.5px solid var(--line);border-radius:10px;background:var(--surface);color:var(--fg);font:400 1rem var(--font)}
.f span{position:absolute;left:.9rem;top:50%;transform:translateY(-50%);color:var(--muted);font:400 1rem var(--font);transition:.2s;pointer-events:none}
.f input:focus{outline:none;border-color:var(--fg)}.f input:focus+span,.f input:not(:placeholder-shown)+span{top:.85rem;font-size:.72rem;font-weight:600}`,
  }),
  component({
    slug: "interruptor", title: "Interruptor", category: "formulário",
    summary: "Switch com trilho e bolinha, estado ligado na cor de acento e rótulo clicável.",
    tags: ["switch", "toggle", "configuração"], boldness: 1, use: ["Preferências e configurações"], avoid: ["Ações que precisam de confirmação"],
    component_refs: ["@shadcn/switch"],
    html: `<div class="w"><label class="sw"><input type="checkbox" checked><i></i>Notificações por e-mail</label><label class="sw"><input type="checkbox"><i></i>Modo escuro</label></div>`,
    css: `.w{display:grid;gap:6px;padding:1.2rem}.sw{display:flex;align-items:center;gap:.8rem;min-height:44px;font:500 .95rem var(--font);cursor:pointer}
.sw input{position:absolute;opacity:0}.sw i{position:relative;width:44px;height:26px;border-radius:99px;background:var(--line);transition:background .2s;flex:none}
.sw i::after{content:"";position:absolute;left:3px;top:3px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 1px 3px oklch(0 0 0/.3);transition:transform .2s cubic-bezier(.2,0,0,1)}
.sw input:checked+i{background:var(--accent)}.sw input:checked+i::after{transform:translateX(18px)}.sw input:focus-visible+i{outline:2px solid var(--fg);outline-offset:2px}`,
  }),
  component({
    slug: "abas-sublinhadas", title: "Abas sublinhadas", category: "navegação",
    summary: "Abas de texto com sublinhado grosso na ativa e contador em mono. Sem pílula, sem fundo.",
    tags: ["abas", "tabs", "navegação"], boldness: 1, use: ["Filtros de conteúdo", "Seções de perfil"], avoid: ["Mais de 6 abas no mobile (use scroll)"],
    component_refs: ["@shadcn/tabs"],
    html: `<div class="t"><a class="on">Telas <i>18</i></a><a>Fontes <i>26</i></a><a>Paletas <i>22</i></a></div>`,
    css: `.t{display:flex;gap:1.2rem;padding:1.6rem 1.2rem 0;border-bottom:1px solid var(--line);font:600 1rem var(--font)}
.t a{display:flex;align-items:center;gap:.35rem;min-height:44px;color:var(--muted);border-bottom:3px solid transparent;margin-bottom:-1px}.t a.on{color:var(--fg);border-color:var(--fg)}
.t i{font:500 .7rem var(--mono);font-style:normal;color:var(--muted)}`,
  }),
  component({
    slug: "selo-de-status", title: "Selo de status", category: "dados",
    summary: "Badge com ponto colorido e texto, com fundo da mesma cor a 12%. Lê sem depender só da cor.",
    tags: ["badge", "status", "tabela"], boldness: 1, use: ["Status em tabelas e listas"], avoid: ["Usar só cor sem texto"],
    component_refs: ["@shadcn/badge"],
    html: `<div class="w"><span class="b ok">Pago</span><span class="b wait">Pendente</span><span class="b err">Atrasado</span><span class="b off">Rascunho</span></div>`,
    css: `.w{display:flex;flex-wrap:wrap;gap:8px;padding:1.6rem 1.2rem}
.b{--c:var(--muted);display:inline-flex;align-items:center;gap:.4rem;padding:.3rem .65rem;border-radius:99px;font:600 .8rem var(--font);color:color-mix(in oklch,var(--c),black 25%);background:color-mix(in oklch,var(--c) 13%,transparent)}
.b::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--c)}
.ok{--c:oklch(0.6 0.15 150)}.wait{--c:oklch(0.7 0.15 75)}.err{--c:oklch(0.58 0.2 25)}`,
  }),
  component({
    slug: "card-de-preco", title: "Card de preço honesto", category: "card",
    summary: "Preço grande, o que inclui em lista curta, e uma linha dizendo para quem não é.",
    tags: ["preço", "plano", "card"], boldness: 2, use: ["Página de preços", "Serviços de freelancer"], avoid: ["Mais de 3 planos lado a lado no mobile"],
    anti: ["Riscar preço 'de/por' falso", "Lista de 15 itens com check", "Plano do meio com glow"],
    component_refs: ["@shadcn/card", "@shadcn/button"],
    html: `<div class="w"><div class="p"><small>Site institucional</small><b>R$ 2.400</b><ul><li>Até 5 páginas</li><li>Publicado na Vercel</li><li>1 mês de ajustes</li></ul><em>Não é para: loja virtual.</em><button>Pedir orçamento</button></div></div>`,
    css: `.w{padding:1rem}.p{padding:1.2rem;border:1px solid var(--fg);border-radius:4px;display:grid;gap:.4rem;font:400 .9rem var(--font)}
.p small{font:600 .75rem var(--font);text-transform:uppercase;letter-spacing:.1em;color:var(--muted)}.p b{font:800 2rem var(--font);letter-spacing:-.03em}
.p ul{margin:.2rem 0;padding-left:1.1rem;line-height:1.6}.p em{color:var(--muted);font-size:.8rem}
.p button{margin-top:.4rem;min-height:46px;border:0;background:var(--fg);color:var(--bg);font:600 .95rem var(--font)}`,
    height: 290,
  }),
  component({
    slug: "avatares-empilhados", title: "Avatares empilhados", category: "dados",
    summary: "Círculos sobrepostos com borda da cor do fundo e um '+12' no final. Prova social compacta.",
    tags: ["avatar", "prova-social", "grupo"], boldness: 1, use: ["'Usado por 300 escolas'", "Membros de projeto"], avoid: ["Fotos falsas de banco"],
    component_refs: ["@shadcn/avatar", "@magicui/avatar-circles"],
    html: `<div class="w"><div class="st"><i style="--h:30"></i><i style="--h:150"></i><i style="--h:260"></i><i style="--h:80"></i><span>+12</span></div><p>Usado por 300 escolas em MG</p></div>`,
    css: `.w{padding:1.8rem 1.2rem;font:500 .9rem var(--font)}.st{display:flex}.st i,.st span{width:40px;height:40px;border-radius:50%;border:3px solid var(--bg);margin-left:-10px;background:oklch(0.75 0.1 var(--h))}
.st i:first-child{margin-left:0}.st span{display:grid;place-items:center;background:var(--fg);color:var(--bg);font:700 .75rem var(--font)}.w p{margin:.7rem 0 0;color:var(--muted)}`,
  }),
  component({
    slug: "trilha-de-etapas", title: "Trilha de etapas", category: "navegação",
    summary: "Etapas numeradas ligadas por linha; a atual em destaque e as feitas com check.",
    tags: ["stepper", "checkout", "etapas"], boldness: 1, use: ["Checkout", "Onboarding em passos"], avoid: ["Mais de 5 etapas"],
    component_refs: [],
    html: `<ol class="s"><li class="done"><i>✓</i>Dados</li><li class="on"><i>2</i>Entrega</li><li><i>3</i>Pagamento</li></ol>`,
    css: `.s{display:flex;list-style:none;margin:0;padding:2rem 1rem;font:600 .8rem var(--font);color:var(--muted)}
.s li{flex:1;display:grid;justify-items:center;gap:.4rem;position:relative}.s li::before{content:"";position:absolute;top:16px;right:50%;width:100%;height:2px;background:var(--line);z-index:-1}.s li:first-child::before{display:none}
.s i{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;font-style:normal;background:var(--bg);border:2px solid var(--line)}
.done{color:var(--fg)}.done i{background:var(--fg);border-color:var(--fg);color:var(--bg)}.done+li::before{background:var(--fg)}.on{color:var(--fg)}.on i{border-color:var(--accent);color:var(--fg);box-shadow:0 0 0 4px color-mix(in oklch,var(--accent) 25%,transparent)}`,
  }),
  component({
    slug: "tabela-de-especificacao", title: "Tabela de especificação", category: "dados",
    summary: "Tabela técnica de duas colunas, rótulos em mono e valores alinhados à direita com números tabulares.",
    tags: ["tabela", "técnico", "especificação"], boldness: 2, use: ["Ficha técnica de produto", "Industrial"], avoid: ["Comparar mais de 3 produtos (use tabela larga)"], pairs: ["industrial-mineiro"],
    component_refs: ["@shadcn/table"],
    html: `<table class="t"><tr><th>CAPACIDADE</th><td>40 t/turno</td></tr><tr><th>POTÊNCIA</th><td>220 kW</td></tr><tr><th>PESO</th><td>12.400 kg</td></tr><tr><th>GARANTIA</th><td>24 meses</td></tr></table>`,
    css: `.t{width:calc(100% - 2rem);margin:1rem;border-collapse:collapse;font:400 .95rem var(--font)}
.t th{text-align:left;font:500 .72rem var(--mono);letter-spacing:.08em;color:var(--muted);padding:.65rem 0;border-bottom:1px solid var(--line)}
.t td{text-align:right;font-weight:700;font-variant-numeric:tabular-nums;padding:.65rem 0;border-bottom:1px solid var(--line)}.t tr:first-child>*{border-top:2px solid var(--fg)}`,
  }),
  component({
    slug: "card-de-artigo", title: "Card de artigo editorial", category: "card",
    summary: "Categoria em caixa alta, título em serifa, linha fina e metadados. Sem imagem obrigatória.",
    tags: ["artigo", "blog", "editorial"], boldness: 2, use: ["Listas de posts", "Newsletter"], avoid: ["Feeds de produto"], pairs: ["editorial"],
    fonts: ["Fraunces"], hover: true,
    component_refs: ["@shadcn/card"],
    html: `<article class="a"><small>Ensaio</small><h3>Por que todo site novo parece igual</h3><p>Sobre templates, IA e a volta do gosto pessoal.</p><footer>8 min · 14 out</footer></article>`,
    css: `.a{margin:1rem;padding-top:.8rem;border-top:2px solid var(--fg);font:400 .9rem/1.45 var(--font)}
.a small{font:700 .7rem var(--font);letter-spacing:.2em;text-transform:uppercase;color:var(--accent)}
.a h3{font:600 1.5rem/1.1 "Fraunces",serif;margin:.4rem 0;transition:color .2s}.a p{margin:0;color:var(--muted)}.a footer{margin-top:.7rem;font:500 .75rem var(--mono);color:var(--muted)}
.a:hover h3,html.hover .a h3{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:4px}`,
  }),
  component({
    slug: "chips-de-filtro", title: "Chips de filtro", category: "formulário",
    summary: "Chips selecionáveis com scroll horizontal no mobile; selecionado é cheio, os outros contornados.",
    tags: ["filtro", "chips", "mobile"], boldness: 1, use: ["Filtros de catálogo", "Tags"], avoid: ["Mais de 2 linhas de chips"],
    component_refs: ["@shadcn/toggle-group"],
    html: `<div class="c"><button class="on">Todos</button><button>Gradiente</button><button>Glass</button><button>Grão</button><button>Sombra</button><button>Hover</button></div>`,
    css: `.c{display:flex;gap:8px;overflow-x:auto;padding:2rem 1rem;scrollbar-width:none}
.c button{flex:none;min-height:40px;padding:0 1rem;border-radius:99px;border:1.5px solid var(--line);background:transparent;color:var(--fg);font:500 .9rem var(--font)}
.c button.on{background:var(--fg);border-color:var(--fg);color:var(--bg)}`,
  }),
  component({
    slug: "busca-com-atalho", title: "Busca com atalho", category: "formulário",
    summary: "Campo de busca com ícone desenhado em CSS e atalho ⌘K à direita. Abre o comando.",
    tags: ["busca", "comando", "atalho"], boldness: 1, use: ["Docs, dashboards", "Apps com muitas páginas"], avoid: ["Sites de 3 páginas"],
    component_refs: ["@shadcn/command", "@shadcn/input"],
    html: `<div class="w"><div class="s"><i></i><span>Buscar moldes…</span><kbd>⌘K</kbd></div></div>`,
    css: `.w{padding:2rem 1rem}.s{display:flex;align-items:center;gap:.6rem;min-height:46px;padding:0 .6rem 0 .9rem;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--muted);font:400 .95rem var(--font)}
.s i{width:12px;height:12px;border:2px solid currentColor;border-radius:50%;position:relative}.s i::after{content:"";position:absolute;width:2px;height:6px;background:currentColor;right:-4px;bottom:-5px;transform:rotate(-45deg)}
.s span{flex:1}.s kbd{font:500 .72rem var(--mono);padding:.2rem .4rem;border:1px solid var(--line);border-bottom-width:2px;border-radius:5px;background:var(--bg)}`,
  }),
  component({
    slug: "dica-flutuante", title: "Dica flutuante", category: "feedback",
    summary: "Tooltip escuro com seta, aparece acima do elemento com fade de 150ms.",
    tags: ["tooltip", "dica", "ajuda"], boldness: 1, use: ["Explicar ícones e siglas"], avoid: ["Informação essencial (não aparece no toque)"], hover: true,
    component_refs: ["@shadcn/tooltip"],
    html: `<div class="w"><span class="tt">AA<span class="tip">Contraste mínimo 4,5:1</span></span></div>`,
    css: `.w{height:100vh;display:grid;place-items:center}.tt{position:relative;font:700 .9rem var(--font);border-bottom:1px dashed;cursor:help}
.tip{position:absolute;bottom:calc(100% + 10px);left:50%;transform:translate(-50%,4px);white-space:nowrap;padding:.45rem .7rem;border-radius:7px;background:var(--fg);color:var(--bg);font:500 .78rem var(--font);opacity:0;transition:.15s}
.tip::after{content:"";position:absolute;top:100%;left:50%;margin-left:-5px;border:5px solid transparent;border-top-color:var(--fg)}
.tt:hover .tip,html.hover .tip{opacity:1;transform:translate(-50%,0)}`,
  }),
  component({
    slug: "paginacao-numerada", title: "Paginação numerada", category: "navegação",
    summary: "Anterior/próxima com texto, números com reticências e página atual sublinhada.",
    tags: ["paginação", "lista", "navegação"], boldness: 1, use: ["Listagens grandes", "Blog"], avoid: ["Feeds (use scroll infinito)"],
    component_refs: ["@shadcn/pagination"],
    html: `<nav class="p"><a>← Anterior</a><a>1</a><a class="on">2</a><a>3</a><span>…</span><a>9</a><a>Próxima →</a></nav>`,
    css: `.p{display:flex;flex-wrap:wrap;align-items:center;gap:2px;padding:2rem 1rem;font:500 .9rem var(--font)}
.p a{min-width:40px;min-height:44px;display:grid;place-items:center;padding:0 .4rem;color:var(--fg)}.p a.on{font-weight:800;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:6px}.p span{color:var(--muted);padding:0 .3rem}`,
  }),
  component({
    slug: "linha-do-tempo", title: "Linha do tempo", category: "dados",
    summary: "Linha vertical com marcadores, data em mono à esquerda e evento à direita.",
    tags: ["timeline", "histórico", "processo"], boldness: 1, use: ["História da empresa", "Processo de trabalho"], avoid: ["Mais de 8 itens"],
    component_refs: [],
    html: `<ol class="tl"><li><time>2019</time><p>Primeiro cliente, uma padaria no Barreiro.</p></li><li><time>2023</time><p>Equipe de 6 pessoas.</p></li><li class="on"><time>2026</time><p>Estúdio próprio.</p></li></ol>`,
    css: `.tl{list-style:none;margin:0;padding:1.2rem;font:400 .9rem/1.4 var(--font)}
.tl li{display:grid;grid-template-columns:3.2rem 1fr;gap:1rem;position:relative;padding-bottom:1rem}.tl li::before{content:"";position:absolute;left:3.85rem;top:.35rem;width:9px;height:9px;border-radius:50%;background:var(--bg);border:2px solid var(--fg)}
.tl li::after{content:"";position:absolute;left:4.2rem;top:1rem;bottom:0;width:1px;background:var(--line)}.tl li:last-child::after{display:none}
.tl time{font:600 .8rem var(--mono);color:var(--muted)}.tl p{margin:0;padding-left:.8rem}.tl li.on::before{background:var(--accent);border-color:var(--accent)}`,
    height: 230,
  }),
  component({
    slug: "estado-vazio", title: "Estado vazio útil", category: "feedback",
    summary: "Quando não há nada: uma frase do que fazer, um botão e um exemplo. Sem ilustração genérica.",
    tags: ["empty-state", "onboarding", "vazio"], boldness: 1, use: ["Listas vazias", "Primeira visita"], avoid: ["Esconder o erro real atrás de 'nada aqui'"],
    anti: ["Ilustração de astronauta/caixa vazia", "Texto 'Ops!'"],
    component_refs: ["@shadcn/button"],
    html: `<div class="e"><b>Nenhum cliente ainda</b><p>Cadastre o primeiro ou importe uma planilha CSV.</p><div><button class="p">Novo cliente</button><button>Importar CSV</button></div></div>`,
    css: `.e{margin:1rem;padding:1.4rem;border:1.5px dashed var(--line);border-radius:12px;font:400 .9rem var(--font)}.e b{font-size:1.1rem}.e p{color:var(--muted);margin:.3rem 0 1rem}
.e div{display:flex;gap:8px;flex-wrap:wrap}.e button{min-height:44px;padding:0 1rem;border-radius:8px;border:1px solid var(--line);background:transparent;color:var(--fg);font:600 .9rem var(--font)}.e button.p{background:var(--fg);color:var(--bg);border-color:var(--fg)}`,
  }),
  component({
    slug: "aviso-lateral", title: "Aviso com barra lateral", category: "feedback",
    summary: "Callout com barra grossa na esquerda, título curto e texto. Para notas em docs.",
    tags: ["callout", "nota", "docs"], boldness: 1, use: ["Notas e avisos em documentação"], avoid: ["Usar em todo parágrafo"],
    component_refs: ["@shadcn/alert"],
    html: `<div class="w"><aside class="n"><b>Atenção</b><p>A fonte precisa ser OFL para entrar no molde.</p></aside><aside class="n t"><b>Dica</b><p>Use OKLCH para variar só a luminosidade.</p></aside></div>`,
    css: `.w{display:grid;gap:10px;padding:1rem}.n{--c:oklch(0.7 0.15 75);padding:.7rem .9rem;border-left:4px solid var(--c);background:color-mix(in oklch,var(--c) 12%,var(--bg));font:400 .88rem/1.4 var(--font)}
.n b{font-weight:700}.n p{margin:.15rem 0 0}.n.t{--c:oklch(0.6 0.12 200)}`,
  }),
  component({
    slug: "avaliacao-em-estrelas", title: "Nota em estrelas", category: "dados",
    summary: "Estrelas em CSS (clip-path) com preenchimento parcial e nota numérica ao lado.",
    tags: ["avaliação", "estrelas", "review"], boldness: 1, use: ["Avaliações de produto", "Depoimentos"], avoid: ["Nota sem número de avaliações"],
    component_refs: [],
    html: `<div class="r"><div class="st" style="--v:4.6"></div><b>4,6</b><span>· 212 avaliações</span></div>`,
    css: `.r{display:flex;align-items:center;gap:.5rem;padding:2rem 1.2rem;font:500 .9rem var(--font)}.r span{color:var(--muted)}
.st{width:110px;height:22px;background:linear-gradient(90deg,oklch(0.78 0.16 80) calc(var(--v)/5*100%),var(--line) 0);-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2l3 7 7 .6-5.3 4.6 1.6 7.3L12 17.8 5.7 21.5l1.6-7.3L2 9.6 9 9z'/%3E%3C/svg%3E") 0 0/22px 22px repeat-x;mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2l3 7 7 .6-5.3 4.6 1.6 7.3L12 17.8 5.7 21.5l1.6-7.3L2 9.6 9 9z'/%3E%3C/svg%3E") 0 0/22px 22px repeat-x}`,
  }),
  component({
    slug: "barra-de-envio", title: "Barra de envio de arquivo", category: "feedback",
    summary: "Linha de arquivo com nome, tamanho, progresso e cancelar. Estado claro sem modal.",
    tags: ["upload", "progresso", "arquivo"], boldness: 1, use: ["Upload de documentos"], avoid: ["Arquivos que sobem em menos de 1s"],
    component_refs: ["@shadcn/progress"],
    html: `<div class="u"><div class="row"><b>contrato-assinado.pdf</b><span>2,4 MB · 68%</span></div><div class="bar"><i></i></div></div>`,
    css: `.u{margin:2rem 1rem;padding:.9rem;border:1px solid var(--line);border-radius:10px;font:400 .85rem var(--font)}.row{display:flex;justify-content:space-between;gap:.5rem}.row span{color:var(--muted);font-family:var(--mono);font-size:.75rem}
.bar{height:6px;border-radius:3px;background:var(--line);margin-top:.6rem;overflow:hidden}.bar i{display:block;height:100%;width:68%;background:var(--fg);border-radius:3px;animation:up 3s ease-in-out infinite}
@keyframes up{0%{width:10%}70%,100%{width:68%}}`,
  }),
];
