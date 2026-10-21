# Moldes: plano (fase 1)

Biblioteca pessoal de direção de design, consultada por mim e por agentes (Claude Code, Cursor, Grok via MCP remoto). A web é um **feed estilo Pinterest**: abrir, rolar e ter ideias. Cada card tem demonstração ao vivo. Componentes de terceiros não entram: moldes referenciam `@shadcn/*` e `@magicui/*`. Demos e snippets são código próprio.

## Stack
Next.js 15 (App Router, TS strict) · Tailwind v4 · Motion · Zod · MiniSearch (índice gerado no build) · `@modelcontextprotocol/sdk` com `WebStandardStreamableHTTPServerTransport` (Streamable HTTP, stateless, resposta JSON, sem Redis) · `@upstash/redis` opcional · Vitest + Playwright. pnpm, app único.

## Rotas
| Rota | O quê |
|---|---|
| `/login` | pede token, grava cookie httpOnly (secure, lax, 30d) |
| `/` | feed masonry infinito, abas no topo, busca |
| `/m/[slug]` | demo grande interativa + abas Uso / Tokens / Código / Motion / Refs / Export |
| `/brief` | compositor (escolher ou "sugerir") + copiar brief / DESIGN.md / tokens |
| `/demo/[slug]` | HTML isolado da demo (carregado em iframe `loading=lazy`, `sandbox=allow-same-origin`, sem script) |
| `/api/mcp` | MCP (Bearer) |
| `/api/v1/moldes`, `/api/v1/moldes/[slug]` (`.json`/`.md`) | GET (`?q=&kind=&tags=&limit=`) |
| `/api/v1/brief`, `/api/v1/design-md` | POST |
| `/api/v1/usage` | GET `?client=` / POST |
| `/llms.txt`, `/llms-full.txt` | Bearer |

`middleware.ts`: libera só `/login` e `/api/login`. API e `llms*` aceitam Bearer **ou** cookie; páginas exigem cookie. Comparação com `timingSafeEqual` sobre SHA-256.

## Abas do feed
Tudo · Telas (`pattern`) · Estilos (`style`) · Animações (`motion`) · Efeitos (`effect`: gradiente, glass, noise, sombra, hover, borda, fundo, texto) · Fontes (`type_pair`) · Paletas (`palette`) · Componentes (`component`). Sub-filtro por `category` em chips. Feed: distribui cards na coluna mais curta (altura conhecida pelo dado), renderiza em lotes ao rolar e, ao acabar, recomeça embaralhado.

## Schema (`lib/schema.ts`)
Base: `slug, kind, title, summary, category?, tags[], sectors[], boldness 1–5, when_to_use[], avoid_when[], anti_patterns[], pairs_with[], component_refs[], references[{title,url,author,license,accessed_at}], license, demo?{html, css, height, fonts[], hover?}`.
Por `kind`: `style` (tokens DTCG 2025.10, OKLCH, `signature_moves[]`) · `type_pair` (display/text/mono Google Fonts, licença `OFL-1.1`, escala, pesos) · `palette` (light/dark: bg, surface, fg, muted, accent, danger) · `motion` (trigger, duration_ms, easing, stagger_ms, props, reduced_motion, snippet Motion) · `pattern` (structure, wireframe ASCII, variations) · `effect` e `component` (demo obrigatória + `code`). Demo de style/palette/type_pair é gerada dos dados.

## Tools MCP (lógica em `lib/`, reaproveitada pela REST)
`search_moldes`, `get_molde`, `list_taxonomy`, `compose_style_brief` (≤ 1.500 tokens, chars/4), `export_design_md` (front matter YAML + seções Stitch), `get_tokens` (dtcg|css|tailwind), `record_usage`, `get_client_history` (sem Upstash → "desativado").

## Conteúdo (meta ~150, conteúdo próprio)
~12 styles, ~24 type_pairs OFL, ~22 paletas (AA testado), ~24 motion, ~30 efeitos, ~22 componentes, ~18 telas. Autoria em `scripts/seed/*.ts` → `pnpm seed` grava `content/moldes/*.json` (fonte que o app lê).

## Ordem
1. Scaffold + `pnpm check` · 2. Schema + OKLCH/AA · 3. Seed · 4. Índice · 5. `lib/` · 6. REST + MCP + auth · 7. Web (feed, detalhe, brief) · 8. Testes, README, push, deploy (precisa login na Vercel)
