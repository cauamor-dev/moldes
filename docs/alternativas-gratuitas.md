# Já existe algo grátis que faça isso? — Alternativas (21/10/2026, horário de Brasília)
_Todos os links abaixo retornaram HTTP 200 hoje. Preços conferidos nas páginas oficiais; o v0 foi conferido via nocode.mba._

## Resumo
**Não existe um produto único e grátis** que seja uma biblioteca completa e curada de estilos, motion, tipografia, paletas, layouts e seções, consultável por agente via MCP e com regras anti-cara-de-IA. Mas **a combinação de ferramentas gratuitas já cobre uns 65–70% da necessidade**, e em 1 hora dá para montar isso.

## O que existe
| Ferramenta | Cobre | IA consome direto? | Custo / limite |
|---|---|---|---|
| **Skill frontend-design (Anthropic)** — https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md · https://claude.com/blog/improving-frontend-design-through-skills | Regras anti-"AI slop": tipografia, cor, motion e fundo | ✅ Skill do Claude Code (dá para copiar o texto para regras do Cursor) | Grátis. São só diretrizes, sem catálogo nem tokens |
| **DESIGN.md (formato do Google Stitch)** — https://github.com/google-labs-code/design.md · https://stitch.withgoogle.com | Especificação de "identidade visual para agentes" (tokens YAML + racional) | ✅ Arquivo na raiz do repo | Grátis (Apache-2.0). Ainda é versão alpha |
| **awesome-design-md (VoltAgent)** — https://github.com/VoltAgent/awesome-design-md | DESIGN.md de marcas conhecidas (cores, tipografia, componentes, do/don't, prompts) + preview HTML | ✅ Copia e cola no projeto | Grátis (MIT). Estilos são **de marcas reais**: copiar Stripe/Linear também é genérico e tem risco de identidade alheia |
| **design-md (WebDesignHot)** — https://github.com/WebDesignHot/design-md | 403 DESIGN.md com motion, a11y e dark mode, CLI `npx @webdesignhot/design-md add stripe` e MCP | ✅ CLI + MCP | Grátis (MIT). Mesmo problema: tudo é "de marca", nada é estilo genérico como brutalismo ou suíço |
| **shadcn/ui MCP + registry** — https://ui.shadcn.com/docs/mcp · https://ui.shadcn.com/docs/directory | Componentes e diretório de registries da comunidade | ✅ MCP (`npx shadcn@latest mcp`) | Grátis (MIT). O visual padrão **é** a cara de IA, então precisa de tema próprio |
| **Magic UI MCP** — https://magicui.design/docs/mcp · https://github.com/magicuidesign/mcp | 150+ componentes e efeitos animados (marquee, grid bg, blur fade) | ✅ MCP sem chave | Grátis (MIT). Pro US$199 só adiciona seções e templates |
| **21st.dev MCP (ex-Magic MCP)** — https://21st.dev/plans · https://help.21st.dev/ai/mcp | 12 mil+ componentes, temas e templates, busca "por vibe", com prompt + código | ✅ MCP HTTP com API key | Grátis: busca ilimitada, **2 cópias de código por dia**, sem geração por IA. Builder US$6/mês (anual) |
| **Aceternity UI llms.txt** — https://ui.aceternity.com/llms.txt · https://ui.aceternity.com/licence | 100+ componentes animados; llms.txt, API JSON e MCP | ✅ llms.txt/MCP | Grátis para uso em projetos; **proibido redistribuir** (não pode entrar na sua biblioteca) |
| **React Bits** — https://reactbits.dev · https://github.com/DavidHDev/react-bits | Efeitos de texto e fundos animados | ⚠️ Via shadcn registry/CLI; sem MCP próprio confirmado | Grátis (MIT + Commons Clause: não revender) |
| **Uiverse** — https://uiverse.io · https://github.com/uiverse-io/galaxy | Milhares de elementos HTML/CSS/Tailwind da comunidade | ⚠️ Repo no GitHub (dá para o agente ler); sem MCP | Grátis (MIT). Qualidade irregular |
| **Figma MCP** — https://help.figma.com/hc/en-us/articles/39216419318551-Get-started-with-the-Figma-MCP-server · limites: https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/ | Lê os **seus** designs e variáveis do Figma | ✅ MCP remoto | Starter grátis: **só 20 chamadas/mês**. Útil só se o design já existir no Figma |
| **Tokens W3C DTCG + Style Dictionary** — https://www.designtokens.org/TR/2025.10/format/ · https://styledictionary.com | Formato padrão de tokens e geração de CSS/Tailwind | ✅ JSON | Grátis. É infraestrutura, não conteúdo |
| **v0 (Vercel)** — https://v0.app/pricing | Gera UI por prompt | ❌ Não é uma referência; é outro gerador (e também cai no shadcn padrão) | Free: US$5/mês de créditos, cerca de 7 mensagens/dia |
| **Galerias de design systems** — https://designsystemsrepo.com · https://component.gallery · https://github.com/alexpate/awesome-design-systems | Índice de design systems e padrões de componentes | ❌ Só para humanos (só links) | Grátis |
| **llms.txt / AGENTS.md** — https://llmstxt.org · https://agents.md | Padrões de como expor contexto | — | Grátis |

## Veredito honesto
**Cobertura do combo grátis: cerca de 65–70%.**
- ✅ **Coberto:** regras anti-IA (skill da Anthropic), componentes animados consultáveis por MCP (Magic UI, shadcn, 21st com limite), sistemas de marca prontos (DESIGN.md), formato de tokens.
- ❌ **Lacunas que justificam construir o seu:**
  1. **Estilos como categoria** (brutalismo, neo-brutalismo, suíço, editorial, bento, Y2K…) com tokens, quando usar/evitar e anti-padrões. Os catálogos de DESIGN.md são **marcas**, não estilos.
  2. **Motion, pares tipográficos OFL e paletas OKLCH** como registros consultáveis. Hoje isso está espalhado e só é legível por humanos.
  3. **Busca unificada por um único MCP** (`compose_style_brief` mesclando estilo + seção + motion + fonte num brief ≤ 1,5k tokens). Hoje seriam 4–5 MCPs que não conversam entre si.
  4. **Anti-repetição entre clientes** (registro de "qual molde usei para quem"). Ninguém oferece isso.
  5. **Conteúdo pt-BR e voltado aos nichos da Axial** (saúde, jurídico, indústria MG…), com licença limpa para você reutilizar.
- **Recomendação:** não começar do zero. **Use o combo grátis já hoje** e faça a biblioteca própria **mais enxuta**: priorize a camada de *estilos + motion + tipografia + paletas + compose_brief* e aponte componentes para Magic UI/shadcn em vez de recriá-los. Na prática, isso corta talvez 40% do escopo da Fase 1 do `plano.md`. Também vale adotar **DESIGN.md (Stitch) como formato de export** do molde, além do DTCG.

## Setup custo zero para usar hoje (cerca de 1 h)
1. **Skill anti-IA:** copie `skills/frontend-design` para `~/.claude/skills/frontend-design/` (todos os projetos). No Cursor, cole o texto em `.cursor/rules/frontend-design.mdc`.
2. **MCPs grátis (sem chave):**
   ```bash
   claude mcp add shadcn -- npx -y shadcn@latest mcp
   claude mcp add magicui -- npx -y @magicuidesign/mcp@latest
   ```
   (Opcional) 21st no plano Free, para busca por vibe: `npx @21st-dev/cli@latest init --client claude` (precisa de conta; 2 cópias por dia).
3. **DESIGN.md por cliente:** em cada projeto, crie um `DESIGN.md` baseado no formato Stitch (use os do awesome-design-md e do WebDesignHot **como modelo de estrutura**, não como visual a copiar), com direção estética, par de fontes OFL, paleta OKLCH, uma assinatura de motion e uma lista de "proibidos".
4. **AGENTS.md / CLAUDE.md:** inclua: "Antes de UI, leia DESIGN.md; carregue a skill frontend-design; busque componentes no MCP magicui/shadcn; nunca use Inter, gradiente roxo, hero centralizado ou o tema padrão do shadcn."
5. **Tokens:** quando o cliente fechar, exporte o DTCG `.tokens.json` → CSS vars via Style Dictionary.
6. **Inspiração humana (fora do agente):** Godly, Land-book, Awwwards e Fonts In Use, como você já usa.

Esse setup vira o **"protótipo de papel"** da biblioteca. Depois de 3–5 projetos, os DESIGN.md que funcionarem viram os primeiros seeds do app Moldes.
