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
| `pnpm test:e2e` | Playwright (login → busca → molde → DESIGN.md, e o fluxo OAuth completo) |
| `pnpm seed` | regrava `content/moldes/*.json` a partir de `scripts/seed/` |

## Variáveis de ambiente

| Nome | Obrigatória | Uso |
|---|---|---|
| `MOLDES_TOKEN` | sim | token único: login da web, Bearer da API e do MCP, e base da chave que assina os tokens OAuth |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | não | log de uso por cliente (sem elas, `record_usage` responde "desativado") |

## Conectar em todas as IAs

URL do MCP: `https://moldes-pink.vercel.app/api/mcp` (Streamable HTTP).

Há dois jeitos de autenticar, e os dois funcionam ao mesmo tempo:
- **OAuth 2.1** (claude.ai, ChatGPT e qualquer cliente com login por navegador): o cliente se registra sozinho (DCR), abre a tela do Moldes, você cola o `MOLDES_TOKEN` uma vez e pronto. O app recebe uma chave própria (1 h, renovada sozinha por até 90 dias).
- **Bearer fixo**: header `Authorization: Bearer <MOLDES_TOKEN>`, para CLIs e scripts.

Para revogar todos os acessos de uma vez, troque o `MOLDES_TOKEN` na Vercel.

### claude.ai (web, desktop e celular)
1. Configurações → **Conectores** → **Adicionar conector personalizado**.
2. Nome `Moldes`, URL `https://moldes-pink.vercel.app/api/mcp`. Deixe os campos de OAuth Client ID/Secret em branco.
3. Clique em **Conectar**. Abre a tela do Moldes: cole o token e clique em **Autorizar**.
4. Numa conversa, ative o Moldes no menu de ferramentas e peça, por exemplo, "use o Moldes para montar um brief de landing para clínica".

Conector personalizado pode exigir plano pago, conforme a regra atual da Anthropic.

### ChatGPT (modo desenvolvedor)
1. Configurações → **Apps e conectores** → **Configurações avançadas** → ligue o **Modo desenvolvedor**.
2. Volte em Apps e conectores → **Criar** (novo conector/app).
3. Nome `Moldes`, URL do servidor MCP `https://moldes-pink.vercel.app/api/mcp`, autenticação **OAuth**. Confirme que confia no app e crie.
4. Na tela do Moldes, cole o token e clique em **Autorizar**.
5. Numa conversa, escolha o Moldes em **+ → Modo desenvolvedor** (ou no seletor de ferramentas).

Os nomes dos menus mudam com frequência e o modo desenvolvedor depende do plano. Se não achar, procure por "Developer mode" na ajuda da OpenAI.

### Claude Code (CLI)
Com OAuth (abre o navegador uma vez):
```bash
claude mcp add --transport http --scope user moldes https://moldes-pink.vercel.app/api/mcp
# dentro do Claude Code: /mcp → moldes → Authenticate
```
Ou com o token fixo:
```bash
claude mcp add --transport http --scope user moldes https://moldes-pink.vercel.app/api/mcp \
  --header "Authorization: Bearer $MOLDES_TOKEN"
```

### Codex CLI (`~/.codex/config.toml`)
Com o token fixo (o Codex lê da variável de ambiente, então o token não fica no arquivo):
```toml
[mcp_servers.moldes]
url = "https://moldes-pink.vercel.app/api/mcp"
bearer_token_env_var = "MOLDES_TOKEN"
```
Antes de abrir o Codex, rode `export MOLDES_TOKEN=...` no shell ou coloque no seu `.zshrc`/`.bashrc`. Para usar OAuth, tire a linha `bearer_token_env_var` e rode `codex mcp login moldes`; versões antigas do Codex exigem `experimental_use_rmcp_client = true` no topo do arquivo. Confira com `codex mcp list`.

### Cursor (`~/.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "moldes": {
      "url": "https://moldes-pink.vercel.app/api/mcp",
      "headers": { "Authorization": "Bearer ${env:MOLDES_TOKEN}" }
    }
  }
}
```
Sem o bloco `headers`, o Cursor usa OAuth: em Settings → MCP, clique em **Login** no Moldes.

### Outros (Grok, scripts, REST)
- Qualquer cliente MCP remoto: URL acima, Streamable HTTP, header `Authorization: Bearer SEU_TOKEN` ou OAuth.
- Descoberta OAuth: `/.well-known/oauth-protected-resource` e `/.well-known/oauth-authorization-server`.

**Tools**: `search_moldes`, `get_molde`, `list_taxonomy`, `compose_style_brief`, `export_design_md`, `get_tokens`, `record_usage`, `get_client_history`.

**REST** (só com o Bearer fixo)
```bash
curl -H "Authorization: Bearer $MOLDES_TOKEN" "https://moldes-pink.vercel.app/api/v1/moldes?q=editorial&kind=style"
curl -H "Authorization: Bearer $MOLDES_TOKEN" "https://moldes-pink.vercel.app/api/v1/moldes/suico.md"
curl -H "Authorization: Bearer $MOLDES_TOKEN" -H "content-type: application/json" \
  -d '{"goal":"landing de clínica","sector":"saúde","boldness":2}' https://moldes-pink.vercel.app/api/v1/brief
```
Também: `POST /api/v1/design-md`, `GET/POST /api/v1/usage`, `/llms.txt` e `/llms-full.txt`.

## Deploy (Vercel Hobby)

1. Importe o repositório em vercel.com/new (framework Next.js, nada a configurar).
2. Em Settings → Environment Variables, crie `MOLDES_TOKEN`.
3. Opcional: Marketplace → Upstash Redis (free) para o log de uso.

## Licenças

Conteúdo e código próprios (MIT). Fontes: só SIL OFL 1.1 via Google Fonts. Referências externas aparecem apenas como link.
