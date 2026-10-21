# Moldes — plano (fase 1)

Biblioteca pessoal de direção de design, consultada por mim e por agentes (Claude Code, Cursor, Grok via MCP remoto). Sem componentes próprios: moldes só referenciam `@shadcn/*` e `@magicui/*`.

## Stack
Next.js 15 (App Router, TS strict) · Tailwind v4 · Motion · Zod · MiniSearch (índice gerado no build) · `mcp-handler` + `@modelcontextprotocol/sdk` (Streamable HTTP, stateless, sem Redis) · `@upstash/redis` opcional · Vitest + Playwright. pnpm, app único.

## Rotas
| Rota | O quê |
|---|---|
| `/login` | pede token, grava cookie httpOnly (secure, lax, 30d) |
| `/` | masonry + busca + filtros (kind, setor, boldness) |
| `/m/[slug]` | abas Uso / Tokens / Motion / Refs / Export |
| `/brief` | compositor (escolher slugs ou "sugerir") + copiar brief / DESIGN.md / tokens |
| `/api/mcp` | MCP Streamable HTTP (Bearer) |
| `/api/v1/moldes`, `/api/v1/moldes/[slug]` (`.json`/`.md`) | GET |
| `/api/v1/brief`, `/api/v1/design-md` | POST |
| `/api/v1/usage` | GET `?client=` / POST |
| `/llms.txt`, `/llms-full.txt` | Bearer |

`middleware.ts`: libera só `/login` e `/api/login`; `/api/*` e `llms*` aceitam Bearer **ou** cookie; páginas exigem cookie. Comparação com `timingSafeEqual` sobre hash SHA-256.

## Schema (`lib/schema.ts`)
Base: `slug, kind, title, summary, tags[], sectors[], boldness 1–5, when_to_use[], avoid_when[], anti_patterns[], pairs_with[], component_refs[], references[{title,url,author,license,accessed_at}], license`.
União discriminada por `kind`:
- `style`: `tokens` (DTCG 2025.10, `$type/$value`, cores OKLCH) + `signature_moves[]`
- `type_pair`: `display/text/mono {family, source: google|fontshare, license: "OFL-1.1", weights[]}`, `scale`
- `palette`: `light/dark {bg, surface, fg, muted, accent, danger}` em OKLCH
- `motion`: `trigger, duration_ms, easing, stagger_ms, props[], reduced_motion, snippet`
- `pattern`: `structure[], wireframe, variations[]`

## Tools MCP (lógica em `lib/`, reaproveitada pela REST)
`search_moldes`, `get_molde`, `list_taxonomy`, `compose_style_brief` (≤ 1.500 tokens, chars/4), `export_design_md`, `get_tokens` (dtcg|css|tailwind), `record_usage`, `get_client_history` (sem Upstash → "desativado").

## Ordem
1. Scaffold Next + Tailwind v4 + Vitest/Playwright + `pnpm check`
2. Schema Zod + utilitários OKLCH (contraste AA)
3. Seed: 8 styles, 6 type_pairs, 5 palettes, 5 motion, 4 patterns (28)
4. `scripts/build-index.ts` → `lib/generated/index.json` (prebuild/predev)
5. `lib/`: search, brief, design-md, tokens, usage, auth
6. REST + MCP + llms.txt + middleware/login
7. Web: tema do app, masonry com previews dos tokens, detalhe, compositor
8. Testes (schema/AA/OFL, contrato MCP, 1 E2E), README, push
