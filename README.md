# Moldes

Galeria pessoal de direção de design: estilos, paletas, pares de fontes, animações, efeitos, telas e componentes. Cada item tem uma demo ao vivo e tokens prontos para CSS ou Tailwind v4.

Uso para escolher um rumo visual — e para agentes consultarem o mesmo catálogo via MCP — sem cair no visual genérico de IA. O conteúdo é próprio; referências externas entram só como link (`@shadcn/*`, `@magicui/*`).

O site no ar, [moldes-pink.vercel.app](https://moldes-pink.vercel.app), é de uso pessoal e pede token.

## O que tem

- Feed em mural: cada card mostra a demo, não um print
- 165 moldes (estilos, fontes OFL, paletas OKLCH testadas em AA, motion, efeitos, componentes, telas)
- Tokens em CSS, Tailwind v4 (`@theme`) e JSON DTCG
- Servidor MCP com 8 tools, API REST e `llms.txt`
- Compositor de brief e export de `DESIGN.md`

## Stack

Do `package.json`: Next.js 15, React 19, Tailwind CSS v4, Motion, Zod, MiniSearch, `@modelcontextprotocol/sdk` e `@upstash/redis` (opcional). Testes com Vitest e Playwright. pnpm.

## Servidor MCP

Oito tools, com a lógica em `lib/`:

| Tool | Faz |
|---|---|
| `search_moldes` | busca no catálogo |
| `get_molde` | molde completo (JSON ou Markdown) |
| `list_taxonomy` | tipos, tags, setores |
| `compose_style_brief` | brief de design (até 1.500 tokens) |
| `export_design_md` | gera um `DESIGN.md` |
| `get_tokens` | tokens em CSS, Tailwind v4 ou DTCG |
| `record_usage` | registra uso por cliente (precisa do Redis) |
| `get_client_history` | histórico daquele cliente |

URL remota: `https://moldes-pink.vercel.app/api/mcp` (Streamable HTTP). Auth com Bearer `MOLDES_TOKEN` ou OAuth 2.1 (DCR + PKCE). Trocar o token revoga os acessos.

Há também REST em `/api/v1/moldes`, `/api/v1/brief`, `/api/v1/design-md` e `/api/v1/usage`.

## Rodar local

```bash
pnpm install
cp .env.example .env.local   # preencha MOLDES_TOKEN
pnpm dev                      # http://localhost:3000
```

| Comando | O quê |
|---|---|
| `pnpm dev` / `pnpm build` | gera o índice e sobe / empacota |
| `pnpm check` | lint + typecheck + testes |
| `pnpm test:e2e` | Playwright |
| `pnpm seed` | regrava `content/moldes/*.json` a partir de `scripts/seed/` |

## Variáveis de ambiente

Nomes em `.env.example` — os valores ficam só no `.env.local` (ignorado pelo git):

| Nome | Precisa? | Uso |
|---|---|---|
| `MOLDES_TOKEN` | sim | login da web, Bearer da API/MCP e base da chave OAuth |
| `UPSTASH_REDIS_REST_URL` | não | log de uso (sem isso, `record_usage` responde “desativado”) |
| `UPSTASH_REDIS_REST_TOKEN` | não | idem |

## Licença

Código e conteúdo próprios (MIT). Fontes: só SIL OFL 1.1 via Google Fonts.
