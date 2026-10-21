# Pesquisa — Biblioteca de Design "Moldes" (Axial)
_21/10/2026 (horário de Brasília). Links marcados ✔ foram conferidos nesta pesquisa; os demais são as páginas iniciais oficiais (conferir os termos atuais antes de usar)._

## 1. Referências existentes
| Fonte | O que oferece | Licença / limite | Como usar na Axial |
|---|---|---|---|
| Mobbin — https://mobbin.com | Biblioteca de telas e fluxos de apps reais (iOS/Android/Web), padrões de UX | Pago; screenshots com copyright de terceiros | Só um link de referência ("ver padrão X"). Nada de raspar ou copiar imagens |
| Refero — https://refero.design | Telas e fluxos web com busca por padrão | Pago; mesmas restrições | Link + recriação própria |
| Dribbble — https://dribbble.com | Shots de designers (conceitos, nem sempre reais) | Copyright do autor | Inspiração com link e crédito ao autor |
| Godly — https://godly.website | Curadoria de sites "premiados", com vídeos | Copyright dos sites | Link |
| Land-book — https://land-book.com | Galeria de landing pages por categoria | Copyright dos sites | Link e taxonomia de seções |
| Lapa Ninja — https://www.lapa.ninja | Landing pages e seções | Copyright dos sites | Link |
| Awwwards — https://www.awwwards.com | Sites premiados e tendências de motion | Copyright dos sites | Link e referência de motion |
| UI Garage — https://uigarage.net | Padrões de UI por componente | Copyright | Link |
| Codrops — https://tympanus.net/codrops | Tutoriais e demos de efeitos/motion | Demos costumam ter licença própria e permissiva (conferir em cada demo) | Recriar a técnica + atribuição |
| Motion (ex-Framer Motion) — https://motion.dev | Lib de animação React/JS, exemplos | MIT | Base dos snippets de motion |
| Fonts In Use — https://fontsinuse.com | Tipografia em uso real, por fonte/setor | Arquivo editorial | Link para pares tipográficos |
| Typewolf — https://www.typewolf.com | Pares de fontes, alternativas a fontes populares | Editorial | Link; usar Google Fonts/Fontshare (OFL) nos snippets |
| Coolors — https://coolors.co | Gerador de paletas | Paletas são fatos (sem copyright relevante) | Gerar paletas próprias em OKLCH |
| shadcn/ui — https://ui.shadcn.com ✔ MCP: https://ui.shadcn.com/docs/mcp | Componentes copy-paste, registry, CLI e MCP (search/view/install) | MIT | Base técnica; **evitar o tema padrão** |
| Magic UI — https://magicui.design ✔ https://github.com/magicuidesign/magicui/blob/main/LICENSE.md | 150+ componentes animados | MIT (Pro é pago) | Pode adaptar com crédito |
| Aceternity UI — https://ui.aceternity.com ✔ https://ui.aceternity.com/licence, https://ui.aceternity.com/llms-full.txt | 100+ componentes animados, llms.txt, API JSON, MCP | Uso livre em produtos finais; **proibido redistribuir como biblioteca** | **Não** colocar o código na biblioteca; usar link + descrição |
| React Bits — https://reactbits.dev ✔ https://github.com/davidhdev/react-bits/ | Componentes/efeitos animados (texto, fundos) | MIT + Commons Clause (proibido revender/redistribuir os componentes) | Link; recriar a técnica com código próprio |
| Uiverse — https://uiverse.io | Elementos HTML/CSS/Tailwind da comunidade | MIT ✔ (via https://qodesign.dev/blog/choose-react-tailwind-component-library-2026) | Pode adaptar com crédito |
| Design Spells — https://www.designspells.com | Microinterações e "detalhes mágicos" | Copyright | Link e inspiração |
| Comparativo de libs 2026 ✔ https://qodesign.dev/blog/choose-react-tailwind-component-library-2026 | Preços e licenças de Magic UI, Aceternity, Kokonut, Cult UI, Animata… | — | Kokonut, Cult UI e Animata são MIT |

### Política de conteúdo (regra do produto)
1. **Preview = recriação própria** (componente renderizado ao vivo), nunca screenshot de terceiros.
2. Referências externas entram só como **link + autor + data de acesso** (campo `references[]`).
3. Código de terceiros entra só se a licença for MIT/Apache/OFL, com campo `license` e `source_url`. Código Aceternity Pro ou React Bits **não** entra (só link).
4. Fontes: só OFL/Google Fonts/Fontshare nos snippets. Fontes pagas aparecem como "alternativa" com link.

## 2. Como as ferramentas de IA consomem contexto de design
- **MCP (Model Context Protocol)** — https://modelcontextprotocol.io ; SDK TS: https://github.com/modelcontextprotocol/typescript-sdk. Claude Code, Cursor e outros clientes chamam ferramentas (`search_styles`, `get_entry`). Existem modelos prontos:
  - shadcn MCP ✔ (https://ui.shadcn.com/docs/mcp): `search_items_in_registries`, `view_items_in_registries`, `get_audit_checklist`. É o formato a imitar.
  - Figma MCP remoto ✔ (https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/): `claude mcp add --transport http figma https://mcp.figma.com/mcp`.
- **shadcn registry** (`registry.json` / `{name}.json`): a biblioteca pode **também ser um registry**, e aí `npx shadcn add @axial/hero-brutalista` instala o molde direto.
- **llms.txt** — https://llmstxt.org : índice markdown na raiz do site para LLMs. Aceternity já publica `llms.txt` + `llms-full.txt` ✔. A biblioteca deve gerar `/llms.txt` e `/llms-full.txt` e um `.md` por molde.
- **Design tokens W3C DTCG 2025.10 (estável desde 28/10/2025)** ✔ — https://www.designtokens.org/TR/2025.10/format/ ; anúncio: https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/. Usa JSON com `$value`/`$type`, MIME `application/design-tokens+json`, suporta OKLCH/P3, aliases e temas. É suportado por Style Dictionary, Tokens Studio, Terrazzo e Figma. **Formato padrão dos tokens de cada molde.**
- **Claude Code Skills** ✔ — skill `frontend-design` da Anthropic: https://github.com/anthropics/skills/blob/HEAD/skills/frontend-design/SKILL.md. Skills carregam contexto sob demanda, sem inflar o prompt. A biblioteca deve exportar uma skill `axial-design` que manda consultar o MCP.
- **AGENTS.md** — https://agents.md : instruções para agentes (Cursor, Codex etc.). O Claude Code lê `CLAUDE.md`, que pode apontar para o AGENTS.md. O export gera um trecho pronto para colar.
- **Cursor rules** — `.cursor/rules/*.mdc` (https://docs.cursor.com/context/rules).

## 3. Por que o design de IA parece genérico
Segundo a Anthropic ✔ (https://claude.com/blog/improving-frontend-design-through-skills), a causa é a **"convergência distribucional"**: o modelo escolhe o centro estatístico, ou seja, as escolhas "seguras". Sintomas:
- Inter/Roboto/Arial/system fonts, e Space Grotesk como "alternativa" que também virou clichê
- Gradiente roxo→azul sobre fundo branco; paleta tímida e distribuída por igual
- Hero centralizado (badge + H1 + subtítulo + 2 botões) → grade de 3 features com ícone Lucide → depoimentos → pricing de 3 colunas → FAQ
- Tema padrão do shadcn (zinc/slate, `rounded-lg` em tudo, sombras suaves iguais)
- Cards com glassmorphism sem motivo; emojis como ícones; "✨" e copy genérica ("Unlock the power of…")
- Animação ausente ou só `fade-in` em tudo; fundo branco liso
- Espaçamento uniforme, sem ritmo nem hierarquia; nenhuma grade assimétrica

## 4. Diretriz "anti-cara-de-IA" (usar no AGENTS.md dos projetos)
1. **Escolha uma direção estética antes de codar** (ex.: "editorial suíço", "neo-brutalista", "industrial") e registre no PLAN.
2. **Tipografia:** par display + texto com caráter (ex.: Fraunces/Instrument Serif/Clash Display/Satoshi/General Sans/JetBrains Mono). Proibido Inter/Roboto/Arial como display. Escala com contraste forte (ex.: 14 → 96px).
3. **Cor:** uma cor dominante + um acento forte, definidos em OKLCH via CSS vars. Proibido gradiente roxo/azul genérico.
4. **Layout:** pelo menos uma quebra de padrão por página (grade assimétrica, hero alinhado à esquerda, bento, texto gigante, sobreposição).
5. **Motion:** um momento orquestrado (entrada com stagger) em vez de fades espalhados. Easing próprio (ex.: `cubic-bezier(.2,.8,.2,1)`), 150–400 ms em UI. Respeitar `prefers-reduced-motion`.
6. **Fundo/textura:** grain, grid, padrão geométrico, gradiente com intenção. Nunca branco liso por padrão.
7. **Componentes:** customizar os tokens do shadcn (radius, borda, sombra). Ícones consistentes, sem emoji.
8. **Copy real** do cliente (pt-BR), nada de lorem ou chavão.
9. **Variar entre projetos:** registrar o molde usado por cliente para não repetir.
10. **Acessibilidade não é opcional:** contraste AA, foco visível, alvo ≥ 44 px.
