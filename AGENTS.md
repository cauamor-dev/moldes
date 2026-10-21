# AGENTS.md

## Comandos
- `pnpm dev` — roda local (gera índice antes)
- `pnpm build` — índice + build
- `pnpm check` — lint + typecheck + test
- `pnpm test:e2e` — Playwright
- `pnpm index` — regenera `lib/generated/index.json`

## Regras
- Respostas em pt-BR; código em inglês. Diffs curtos.
- `content/moldes/*.json` é a fonte de verdade; tudo valida em `lib/schema.ts`.
- Lógica fica em `lib/`; rotas REST e tools MCP só chamam `lib/`.
- Segredos só em `.env.local` (modelo em `.env.example`). Nunca imprimir `MOLDES_TOKEN`.
- Nenhum serviço pago. Push/deploy já liberados; dependência paga ou mudança de escopo: perguntar.

## Anti-IA (app e moldes)
- Proibido: Inter, Roboto, Arial, Space Grotesk; gradiente roxo/azul; hero centralizado; tema zinc/slate padrão do shadcn; emoji como ícone; glass sem motivo.
- Exigido: par OFL com caráter; cor dominante + acento OKLCH em CSS vars; grade assimétrica; stagger com `prefers-reduced-motion`; textura sutil; contraste AA; foco visível; alvos ≥ 44px.

## Licenças
- Fontes: só OFL (Google Fonts / Fontshare).
- Conteúdo dos moldes é próprio. Referências externas só como link (sem screenshot nem código de terceiros). Aceternity / React Bits: só link.
- Componentes: referenciar `@shadcn/*` e `@magicui/*` (MIT), não copiar.
