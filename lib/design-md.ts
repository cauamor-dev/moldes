import { ANTI_AI_CHECKLIST, mergedTokens, resolveSet, type BriefInput, type MoldeSet } from "./brief";
import { toHex } from "./color";
import type { TokenTree } from "./schema";
import { cssValue, flatten } from "./tokens";

const q = (s: string) => JSON.stringify(s);

function leafValue(tree: TokenTree, path: string[]): unknown {
  let node: unknown = tree;
  for (const p of path) node = (node as Record<string, unknown> | undefined)?.[p];
  return (node as { $value?: unknown } | undefined)?.$value;
}

const dimPx = (v: unknown) => (typeof v === "object" && v ? (v as { value: number }).value : undefined);

export function exportDesignMd(input: { slugs?: string[]; brief?: BriefInput; name?: string }): string {
  const base = input.brief ?? { goal: input.name ?? "projeto" };
  const set: MoldeSet = resolveSet({ ...base, slugs: [...(base.slugs ?? []), ...(input.slugs ?? [])] });
  const tree = mergedTokens(set);
  const name = input.name ?? input.brief?.goal ?? set.style?.title ?? "Design";

  const colors = flatten((tree.color as TokenTree) ?? {}).map(([p, t]) => `  ${p.join("-")}: ${q(toHex(String(t.$value)))} # ${t.$value}`);
  const fam = (k: string) => {
    const v = leafValue(tree, ["font", k]);
    return Array.isArray(v) ? String(v[0]) : v ? String(v) : undefined;
  };
  const steps = set.type_pair?.scale.steps ?? [14, 16, 21, 28, 38, 50];
  const displayWeight = Number(leafValue(tree, ["font", "display-weight"]) ?? set.type_pair?.display.weights.at(-1) ?? 700);
  const typo = [
    `  headline:\n    fontFamily: ${q(fam("display") ?? "serif")}\n    fontSize: ${Math.round(steps.at(-1)!)}\n    fontWeight: ${displayWeight}\n    lineHeight: 1.0`,
    `  title:\n    fontFamily: ${q(fam("display") ?? "serif")}\n    fontSize: ${Math.round(steps[3] ?? 28)}\n    fontWeight: ${displayWeight}\n    lineHeight: 1.1`,
    `  body:\n    fontFamily: ${q(fam("text") ?? "sans-serif")}\n    fontSize: ${Math.round(steps[1] ?? 16)}\n    fontWeight: 400\n    lineHeight: 1.5`,
    `  label:\n    fontFamily: ${q(fam("mono") ?? fam("text") ?? "monospace")}\n    fontSize: ${Math.round(steps[0] ?? 13)}\n    fontWeight: 500\n    letterSpacing: 0.04`,
  ];
  const r = (k: string) => dimPx(leafValue(tree, ["radius", k])) ?? 0;
  const unit = dimPx(leafValue(tree, ["space", "unit"])) ?? 8;
  const accent = leafValue(tree, ["color", "accent"]);
  const accentFg = leafValue(tree, ["color", "accent-fg"]);
  const fg = leafValue(tree, ["color", "fg"]);
  const bg = leafValue(tree, ["color", "bg"]);

  const yaml = [
    "---",
    `name: ${q(name)}`,
    "colors:",
    ...colors,
    "typography:",
    ...typo,
    "rounded:",
    `  sm: ${r("sm")}`,
    `  md: ${r("md")}`,
    `  lg: ${r("lg")}`,
    "spacing:",
    `  scale: [${[0.5, 1, 2, 3, 4, 6, 8].map((n) => n * unit).join(", ")}]`,
    "components:",
    "  button-primary:",
    `    backgroundColor: ${q(accent ? toHex(String(accent)) : "#000000")}`,
    `    textColor: ${q(accentFg ? toHex(String(accentFg)) : "#ffffff")}`,
    `    rounded: ${r("md")}`,
    "  card:",
    `    backgroundColor: ${q(leafValue(tree, ["color", "surface"]) ? toHex(String(leafValue(tree, ["color", "surface"]))) : "#ffffff")}`,
    `    textColor: ${q(fg ? toHex(String(fg)) : "#111111")}`,
    `    rounded: ${r("lg")}`,
    "---",
  ].join("\n");

  const st = set.style;
  const shadow = leafValue(tree, ["shadow", "card"]);
  const moves = st?.signature_moves.map((m) => `- ${m}`).join("\n") ?? "";
  const sections = set.pattern.map((p) => `- **${p.title}**: ${p.structure.join("; ")}`).join("\n");
  const comps = [...new Set([set.style, ...set.pattern, ...set.component, ...set.effect].flatMap((m) => m?.component_refs ?? []))];
  const dos = [...new Set([st, set.palette, set.type_pair].flatMap((m) => m?.when_to_use ?? []))].slice(0, 5);
  const donts = [...new Set([st, ...set.pattern, ...set.effect].flatMap((m) => m?.anti_patterns ?? []))].slice(0, 6);

  const body = `
# ${name}

## Overview
${st ? `${st.title}: ${st.summary}` : "Direção montada a partir de moldes."}
${moves}

## Colors
${set.palette ? `Paleta "${set.palette.title}". ${set.palette.summary}` : "Cores do estilo."} Valores-fonte em OKLCH (comentários do YAML); hex é conversão para ferramentas que não leem OKLCH. Texto principal ${fg} sobre ${bg}. O acento aparece em CTAs e destaques, nunca em texto corrido.
${set.palette ? `Modo escuro: bg ${set.palette.dark.bg}, surface ${set.palette.dark.surface}, fg ${set.palette.dark.fg}, accent ${set.palette.dark.accent}.` : ""}

## Typography
${set.type_pair ? `${set.type_pair.title}: ${set.type_pair.summary} Todas OFL-1.1 via Google Fonts.` : `Display ${fam("display")}, texto ${fam("text")}.`}
Escala: ${steps.join(" / ")} px.

## Layout
Grade de 12 colunas com composição assimétrica; unidade de espaço ${unit}px. Títulos alinhados à esquerda.
${sections || "- Hero assimétrico, conteúdo, CTA de rodapé."}

## Elevation & Depth
${shadow && typeof shadow === "object" ? `Sombra de card: ${cssValue({ $type: "shadow", $value: shadow })}.` : "Profundidade por cor de superfície e filetes, não por sombra."}
${set.effect.map((e) => `Efeito: ${e.title}, ${e.summary}`).join("\n")}

## Shapes
Raios: ${r("sm")} / ${r("md")} / ${r("lg")} px. Borda ${dimPx(leafValue(tree, ["border", "width"])) ?? 1}px.

## Components
${comps.length ? comps.map((c) => `- ${c}`).join("\n") : "- Usar componentes shadcn com os tokens acima."}
${set.motion.map((m) => `- Motion "${m.title}": ${m.trigger}, ${m.duration_ms}ms, ${m.easing}. Reduced motion: ${m.reduced_motion}`).join("\n")}

## Do's and Don'ts
${dos.map((d) => `- Do: ${d}`).join("\n")}
${donts.map((d) => `- Don't: ${d}`).join("\n")}
${ANTI_AI_CHECKLIST.map((d) => `- Don't esquecer: ${d}`).join("\n")}
`;
  return `${yaml}\n${body.replace(/\n{3,}/g, "\n\n")}`;
}
