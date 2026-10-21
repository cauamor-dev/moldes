# Moldes

Catálogo pessoal de direção de design para gerar interfaces sem cara de IA. Web em feed estilo Pinterest (com demo ao vivo em cada card) e as mesmas informações para agentes via MCP, REST e `llms.txt`.

165 moldes próprios: 14 estilos, 26 pares de fontes OFL, 22 paletas OKLCH testadas em AA, 28 animações, 32 efeitos, 22 componentes e 21 telas. Componentes de terceiros só entram como referência (`@shadcn/*`, `@magicui/*`).

## Rodar local

```bash
pnpm install
cp .env.example .env.local   # preencha MOLDES_TOKEN
pnpm dev                      # http://localhost:3000
```

| Comando | O quê |
|---|---|
| `pnpm dev` / `pnpm build` | gera o índice de busca e roda/compila |
| `pnpm check` | lint + typecheck + testes (Vitest) |
| `pnpm test:e2e` | Playwright (login → busca → molde → DESIGN.md) |
| `pnpm seed` | regrava `content/moldes/*.json` a partir de `scripts/seed/` |

## Variáveis de ambiente

| Nome | Obrigatória | Uso |
|---|---|---|
| `MOLDES_TOKEN` | sim | token único: login da web, Bearer da API e do MCP |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | não | log de uso por cliente (sem elas, `record_usage` responde "desativado") |

## Como conectar

Tudo exige `Authorization: Bearer <MOLDES_TOKEN>`. Troque `SEU_DOMINIO` pela URL da Vercel.

**Claude Code**
```bash
claude mcp add --transport http moldes https://SEU_DOMINIO/api/mcp --header "Authorization: Bearer $MOLDES_TOKEN"
```

**Cursor** (`~/.cursor/mcp.json`)
```json
{ "mcpServers": { "moldes": { "url": "https://SEU_DOMINIO/api/mcp", "headers": { "Authorization": "Bearer SEU_TOKEN" } } } }
```

**Grok Bot / outro cliente de MCP remoto**: URL `https://SEU_DOMINIO/api/mcp`, transporte Streamable HTTP, header `Authorization: Bearer SEU_TOKEN`.

**Tools**: `search_moldes`, `get_molde`, `list_taxonomy`, `compose_style_brief`, `export_design_md`, `get_tokens`, `record_usage`, `get_client_history`.

**REST**
```bash
curl -H "Authorization: Bearer $MOLDES_TOKEN" "https://SEU_DOMINIO/api/v1/moldes?q=editorial&kind=style"
curl -H "Authorization: Bearer $MOLDES_TOKEN" "https://SEU_DOMINIO/api/v1/moldes/suico.md"
curl -H "Authorization: Bearer $MOLDES_TOKEN" "https://SEU_DOMINIO/api/v1/moldes/suico?tokens=tailwind"
curl -H "Authorization: Bearer $MOLDES_TOKEN" -H "content-type: application/json" \
  -d '{"goal":"landing de clínica","sector":"saúde","boldness":2}' https://SEU_DOMINIO/api/v1/brief
curl -H "Authorization: Bearer $MOLDES_TOKEN" -H "content-type: application/json" \
  -d '{"slugs":["editorial"]}' https://SEU_DOMINIO/api/v1/design-md
```
Também: `GET/POST /api/v1/usage`, `/llms.txt` e `/llms-full.txt`.

## Deploy (Vercel Hobby)

1. Importe o repositório em vercel.com/new (framework Next.js, nada a configurar).
2. Em Settings → Environment Variables, crie `MOLDES_TOKEN`.
3. Opcional: Marketplace → Upstash Redis (free) para o log de uso.

## Licenças

Conteúdo e código próprios (MIT). Fontes: só SIL OFL 1.1 via Google Fonts. Referências externas aparecem apenas como link.
