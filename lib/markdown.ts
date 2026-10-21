import { contrast } from "./color";
import { buildDemo } from "./demo";
import { KIND_LABELS } from "./labels";
import type { Molde } from "./schema";
import { formatTokens } from "./tokens";

const list = (title: string, items: string[]) => (items.length ? `\n## ${title}\n${items.map((i) => `- ${i}`).join("\n")}\n` : "");
const fence = (lang: string, code: string) => `\`\`\`${lang}\n${code.trim()}\n\`\`\``;

function specific(m: Molde): string {
  switch (m.kind) {
    case "style":
      return `${list("Assinatura", m.signature_moves)}\n## Tokens\n${fence("css", formatTokens(m, "css")!)}\n`;
    case "type_pair": {
      const f = (r: string, x: { family: string; weights: number[] }) => `- ${r}: ${x.family} (${x.weights.join(", ")}) · Google Fonts · OFL-1.1`;
      return `\n## Fontes\n${[f("display", m.display), f("texto", m.text), ...(m.mono ? [f("mono", m.mono)] : [])].join("\n")}\n\nEscala ${m.scale.ratio}, base ${m.scale.base_px}px: ${m.scale.steps.join(" / ")} px\n`;
    }
    case "palette": {
      const rows = (Object.keys(m.light) as (keyof typeof m.light)[]).map((k) => `| ${k} | ${m.light[k]} | ${m.dark[k]} |`);
      return `\n## Papéis\n| papel | claro | escuro |\n|---|---|---|\n${rows.join("\n")}\n\nContraste fg/bg: ${contrast(m.light.fg, m.light.bg).toFixed(2)}:1 (claro), ${contrast(m.dark.fg, m.dark.bg).toFixed(2)}:1 (escuro).\n\n${fence("css", formatTokens(m, "css")!)}\n`;
    }
    case "motion":
      return `\n## Motion\n- trigger: ${m.trigger}\n- duração: ${m.duration_ms}ms\n- easing: ${m.easing}\n- stagger: ${m.stagger_ms}ms\n- props: ${m.props.join(", ")}\n- reduced motion: ${m.reduced_motion}\n\n${fence("tsx", m.snippet)}\n`;
    case "pattern":
      return `${list("Estrutura", m.structure)}\n## Wireframe\n${fence("", m.wireframe)}\n${list("Variações", m.variations)}`;
    default:
      return "";
  }
}

export function moldeToMarkdown(m: Molde, opts: { code?: boolean } = { code: true }): string {
  const demo = m.demo && opts.code ? buildDemo(m) : null;
  const code = demo ? `\n## Código (HTML + CSS próprios)\n${fence("html", demo.html)}\n\n${fence("css", demo.css)}\n` : "";
  const refs = m.references.length ? `\n## Referências\n${m.references.map((r) => `- [${r.title}](${r.url}) · ${r.author} · ${r.license}`).join("\n")}\n` : "";
  return `# ${m.title}

\`${m.slug}\` · ${KIND_LABELS[m.kind]}${m.category ? ` · ${m.category}` : ""} · ousadia ${m.boldness}/5 · licença ${m.license}

${m.summary}

Tags: ${m.tags.join(", ")}${m.sectors.length ? `\nSetores: ${m.sectors.join(", ")}` : ""}
${list("Quando usar", m.when_to_use)}${list("Evite quando", m.avoid_when)}${list("Anti-padrões", m.anti_patterns)}${specific(m)}${code}${m.pairs_with.length ? `\n## Combina com\n${m.pairs_with.join(", ")}\n` : ""}${m.component_refs.length ? `\n## component_refs\n${m.component_refs.join(", ")}\n` : ""}${refs}`.replace(/\n{3,}/g, "\n\n");
}
