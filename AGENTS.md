# AGENTS.md

## Comandos
- `pnpm dev`: roda local (gera o índice antes)
- `pnpm build`: índice + build
- `pnpm check`: lint + typecheck + test
- `pnpm test:e2e`: Playwright (em ambiente sem browser baixado: `PW_CHROMIUM=/caminho/chrome`)
- `pnpm index`: regenera `lib/generated/` (ignorado no git)
- `pnpm seed`: regrava `content/moldes/*.json` a partir de `scripts/seed/*.ts`

## Regras
- Respostas em pt-BR; código em inglês. Diffs curtos.
- `content/moldes/*.json` é o que o app lê; tudo valida em `lib/schema.ts`. Para criar/alterar moldes em lote, edite `scripts/seed/` e rode `pnpm seed`.
- Lógica fica em `lib/`; rotas REST e tools MCP só chamam `lib/`.
- Demos: HTML/CSS próprios, sem JS (o iframe não roda script). Use as vars `--bg --surface --fg --muted --accent --accent-fg --line --font --mono`. Telas (`pattern`) usam `rem` (1rem = 1/52 da largura).
- Segredos só em `.env.local` (modelo em `.env.example`). Nunca imprimir `MOLDES_TOKEN`.
- Nenhum serviço pago. Push/deploy já liberados; dependência paga ou mudança de escopo: perguntar.

## Anti-IA (app e moldes)
- Proibido: Inter, Roboto, Arial, Space Grotesk; gradiente roxo/azul; hero centralizado; tema zinc/slate padrão do shadcn; emoji como ícone; glass sem motivo.
- Exigido: par OFL com caráter; cor dominante + acento OKLCH em CSS vars; grade assimétrica; stagger com `prefers-reduced-motion`; textura sutil; contraste AA; foco visível; alvos ≥ 44px.

## Licenças
- Fontes: só OFL via Google Fonts (lista em `lib/fonts.ts`).
- Conteúdo dos moldes é próprio. Referências externas só como link (sem screenshot nem código de terceiros). Aceternity / React Bits: só link.
- Componentes: referenciar `@shadcn/*` e `@magicui/*` (MIT), não copiar.
