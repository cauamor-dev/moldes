import { moldes } from "./data";
import { KIND_LABELS } from "./labels";
import { moldeToMarkdown } from "./markdown";
import { KINDS } from "./schema";

export function llmsTxt(origin: string): string {
  const sections = KINDS.map((k) => {
    const items = moldes.filter((m) => m.kind === k).map((m) => `- [${m.title}](${origin}/api/v1/moldes/${m.slug}.md): ${m.summary}`);
    return `## ${KIND_LABELS[k]}\n${items.join("\n")}`;
  });
  return `# Moldes

> Biblioteca pessoal de direção de design para gerar interfaces sem cara de IA. ${moldes.length} moldes: estilos, fontes OFL, paletas OKLCH com AA, animações, telas, efeitos e componentes. Componentes de terceiros são só referenciados (@shadcn/*, @magicui/*).

Acesso: header \`Authorization: Bearer <MOLDES_TOKEN>\`. MCP (Streamable HTTP): ${origin}/api/mcp. REST: ${origin}/api/v1/moldes, POST ${origin}/api/v1/brief, POST ${origin}/api/v1/design-md. Texto completo: ${origin}/llms-full.txt

${sections.join("\n\n")}
`;
}

export function llmsFullTxt(): string {
  return moldes.map((m) => moldeToMarkdown(m, { code: true })).join("\n\n---\n\n");
}
