# Plano de Produto — "Moldes" · Biblioteca de Design consultável por agentes (Axial)

## 1. Conceito
É um app estilo Pinterest em que cada **molde** é um registro estruturado e legível por máquina. Humanos navegam por masonry. Agentes (Claude Code, Cursor, Grok Bots) consultam via **MCP, REST e llms.txt** e recebem tokens, regras e código prontos.

## 2. Modelo de dados (molde)
```ts
Molde {
  id, slug, title, kind: 'style'|'pattern'|'component'|'section'|'motion'|'effect'|'type_pair'|'palette'|'layout'
  category, tags[], summary, description_md
  when_to_use[], avoid_when[], anti_patterns[]            // o que NÃO fazer
  tokens: DTCG 2025.10 JSON (color OKLCH, fontFamily, dimension/spacing, borderRadius, shadow, duration, cubicBezier)
  motion?: { trigger, duration_ms, easing, stagger_ms, reduced_motion_fallback }
  fonts?: [{ family, role, source:'google'|'fontshare', license:'OFL' }]
  code: [{ framework:'react-tailwind'|'html-css', file, source, deps[] }]
  preview: { type:'live'|'image', component_path, aspect }
  a11y_notes[], perf_notes[]
  references: [{ title, url, author, license, accessed_at }]
  license, source_url?, compatible_with[] (slugs), status:'draft'|'review'|'published'
  embedding vector(1536), created_by, updated_at, version
}
Board { id, owner, name, moldes[], notes }      // coleções / "brief" por cliente
```

## 3. Funcionalidades
**Navegação:** masonry com preview ao vivo (iframe sandbox ou componente isolado, carregado de forma preguiçosa), busca (texto + semântica), filtros (tipo, categoria, tags, tema claro/escuro, intensidade de motion, "nível de ousadia"), página de detalhe.
**Ações:** copiar código, copiar prompt, baixar tokens (`.tokens.json`), copiar trecho para AGENTS.md/skill, "ver combinações" (`compatible_with`).
**Boards:** juntar moldes num "brief" e exportar **Prompt Pack** (markdown curto + tokens mesclados + regras anti-IA + snippets).
**Para agentes:**
- MCP (stdio + Streamable HTTP): `search_moldes(query, kind?, tags?, limit)`, `get_molde(slug, include_code?)`, `list_taxonomy()`, `compose_style_brief(slugs[] | board_id | goal)` → brief + tokens DTCG mesclados + do/don't, `get_tokens(slug, format:'dtcg'|'css'|'tailwind')`, `random_direction(constraints)` (anti-repetição).
- REST `/api/v1/moldes`, `/api/v1/moldes/:slug(.md|.json)`, `/api/v1/brief` com API key por agente.
- `/llms.txt`, `/llms-full.txt` e `/moldes/:slug.md` estáticos.
- Fase 3: endpoint de registry shadcn (`/r/{name}.json`).
**Admin/curadoria:** editor de molde (formulário + JSON + preview), validação de schema (Zod), checklist de licença obrigatório, fluxo draft→review→published, importação por JSON/MD em lote.
**Auth:** Supabase Auth (e-mail/Google), papéis `admin | editor | viewer`, API keys para agentes, RLS.

## 4. Stack recomendada
| Camada | Escolha | Trade-off |
|---|---|---|
| App | **Next.js 15 (App Router) + TypeScript** | Ecossistema e SSR/ISR para llms.txt; mais complexo que Astro, mas precisa de app interativo |
| UI | Tailwind v4 + Radix/shadcn **com tema próprio** | Rápido; exige disciplina para não cair no padrão |
| Motion | Motion (motion.dev) | MIT, padrão do mercado |
| DB/Auth/Storage | **Supabase (Postgres + RLS + Storage)** | Free tier ok, tudo em um; dependência de fornecedor (mitigada por usar Postgres puro + Drizzle) |
| ORM | Drizzle + Zod | Tipos fortes; menos "mágico" que Prisma |
| Busca | **Postgres FTS (`tsvector`, config `portuguese`/`simple`) + pgvector, híbrida (RRF)** | Sem serviço extra. Meilisearch tem typo-tolerance e facetas melhores, mas é mais um servidor: deixar para quando passar de ~5k moldes |
| Embeddings | OpenAI `text-embedding-3-small` (ou Voyage) via job | Custo baixo; abstrair o provedor |
| MCP | `@modelcontextprotocol/sdk` (TS), pacote no monorepo reutilizando o mesmo service layer da API | — |
| Previews | Componentes do próprio repo em `/previews/[slug]`, isolados em iframe | Seguro; sem executar código arbitrário de usuário no MVP |
| Testes | Vitest (unit/schema/busca) + Playwright (E2E + screenshot visual) | — |
| Monorepo | pnpm workspaces: `apps/web`, `packages/core` (schema, busca, brief), `packages/mcp`, `content/moldes/*.json` | Seeds versionados no Git = revisáveis por IA |
| Deploy (depois) | Vercel + Supabase, ou VPS com Docker/Coolify | Só com aprovação |

## 5. Taxonomia inicial e seed (~120 moldes na Fase 1, todos recriações próprias)
| Tipo | Itens seed (exemplos) | Qtde |
|---|---|---|
| Estilos | brutalismo, neo-brutalismo, suíço/internacional, editorial, glassmorphism, neumorphism, bento, minimal japonês, Y2K, retro-futurismo, terminal/dev, luxo, orgânico, Memphis, dark tech, claymorphism | 16 |
| Seções de landing | hero (6 variações não centralizadas), features, social proof, pricing, CTA, FAQ, footer, logos, comparativo, timeline | 25 |
| Componentes | navbar, cards, botões, inputs, tabs, toasts, tabelas, empty states, modais | 20 |
| Layouts | bento grid, split, grade assimétrica, scroll horizontal, sticky storytelling, dashboard | 10 |
| Motion | stagger reveal, scroll-linked, text split, magnetic button, page transition, marquee, parallax leve, number ticker | 15 |
| Efeitos | grain/noise, gradient mesh, spotlight cursor, grid background, blur reveal, borda animada | 12 |
| Pares tipográficos | 12 pares OFL com papel e escala | 12 |
| Paletas | 10 paletas OKLCH com claro/escuro e uso por setor (saúde, jurídico, food, indústria MG…) | 10 |

## 6. Fases
**Fase 0 (1–2 dias):** PLAN.md, AGENTS.md, schema Zod/DB, design system próprio do app.
**Fase 1 — MVP (2–3 semanas):** schema + seed JSON (~60 primeiro, depois 120); masonry, busca FTS, filtros, detalhe com preview ao vivo, copiar código/prompt/tokens; boards simples; export Prompt Pack; REST read-only; MCP (search/get/taxonomy/compose_brief/get_tokens); llms.txt; auth com admin básico (CRUD + validação); testes; README.
**Fase 2:** busca semântica pgvector, editor visual com preview, fluxo de revisão, API keys por agente, analytics de "mais consultados pelo agente", skill `axial-design` exportável.
**Fase 3:** registry shadcn, sandbox para previews enviados (Sandpack), import assistido por IA (gera rascunho a partir de uma descrição), boards por cliente integrados ao CRM/painel Axial.

## 7. Critérios de aceite (MVP)
- [ ] Todos os seeds validam no schema Zod e no JSON Schema DTCG; o CI falha se algum quebrar.
- [ ] A busca "hero brutalista escuro" retorna resultado relevante no top 3 em < 300 ms (dataset seed).
- [ ] Cada molde publicado tem preview ao vivo, código copiável, tokens `.tokens.json`, when/avoid, a11y e ao menos 1 referência com licença.
- [ ] Prompt Pack de um board com 3 moldes cabe em ≤ 1.500 tokens.
- [ ] O MCP funciona no Claude Code (`claude mcp add`) e no Cursor; testes de contrato das ferramentas passam.
- [ ] `/llms.txt` válido e listando todos os publicados.
- [ ] Lighthouse ≥ 90 em perf e a11y na home; `prefers-reduced-motion` respeitado; navegação por teclado no masonry.
- [ ] O app não usa Inter, nem gradiente roxo, nem tema padrão shadcn (checado por um teste lint simples).
- [ ] Rotas de admin protegidas por RLS + papel; o E2E cobre login, CRUD e cópia.

## 8. Riscos e mitigação
| Risco | Mitigação |
|---|---|
| Copyright (screenshots/código pago) | Política da pesquisa.md §1; campo de licença obrigatório; nada de scraping |
| Seed virar "IA genérica" (gerado por IA) | Revisão humana do Cauã por molde; anti-padrões explícitos; Playwright screenshot para revisão |
| Previews pesados no masonry | Thumbnails estáticas geradas pelo Playwright + preview ao vivo só no hover/detalhe |
| Contexto do agente estourado | Respostas MCP enxutas por padrão (`include_code=false`), brief ≤ 1.5k tokens |
| Escopo infinito | Fases rígidas; 120 seeds no máximo na Fase 1 |
| Lock-in Supabase | Drizzle + SQL portável; seeds em Git |
| Segurança do MCP HTTP | API key, rate limit, só leitura no MVP |
