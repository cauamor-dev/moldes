import { contrast } from "./color";
import { getMolde, moldes, searchHits } from "./data";
import type { Kind, Molde, MoldeOf, TokenTree } from "./schema";
import { estimateTokens, normalize } from "./text";
import { toCss, tokensFor } from "./tokens";

export type BriefInput = { goal: string; sector?: string; boldness?: number; slugs?: string[]; client?: string };

export type MoldeSet = {
  style?: MoldeOf<"style">;
  type_pair?: MoldeOf<"type_pair">;
  palette?: MoldeOf<"palette">;
  motion: MoldeOf<"motion">[];
  pattern: MoldeOf<"pattern">[];
  effect: MoldeOf<"effect">[];
  component: MoldeOf<"component">[];
};

export const BRIEF_TOKEN_LIMIT = 1500;

export const ANTI_AI_CHECKLIST = [
  "Nada de Inter/Roboto/Arial/Space Grotesk; use o par OFL do brief",
  "Sem gradiente roxo/azul e sem glow espalhado",
  "Hero alinhado à esquerda ou assimétrico, nunca título+subtítulo+2 botões centralizados",
  "Sem emoji como ícone; ícone só com função",
  "Glass só com algo atrás para borrar",
  "Uma cor dominante + um acento; nada de tons inventados",
  "Contraste AA, foco visível, alvos de toque ≥ 44px",
  "Animação com prefers-reduced-motion; uma entrada com stagger, não tudo",
  "Texto específico do negócio, sem 'inovação e qualidade'",
];

const LIMITS: Record<Kind, number> = { style: 1, type_pair: 1, palette: 1, motion: 2, pattern: 3, effect: 1, component: 2 };

function score(m: Molde, input: BriefInput, hits: Map<string, number>, paired: Set<string>, avoid: Set<string>) {
  let s = (hits.get(m.slug) ?? 0) * 2;
  if (paired.has(m.slug)) s += 6;
  if (input.sector) {
    const sec = normalize(input.sector);
    if (m.sectors.some((x) => normalize(x).includes(sec) || sec.includes(normalize(x)))) s += 5;
  }
  if (input.boldness) s -= Math.abs(m.boldness - input.boldness) * 1.5;
  if (avoid.has(m.slug)) s -= 8;
  return s;
}

export function resolveSet(input: BriefInput, history: string[] = []): MoldeSet {
  const set: MoldeSet = { motion: [], pattern: [], effect: [], component: [] };
  const chosen: Molde[] = [];
  const add = (m: Molde) => {
    if (chosen.some((c) => c.slug === m.slug)) return;
    const k = m.kind;
    if (k === "style" || k === "type_pair" || k === "palette") {
      if (set[k]) return;
      (set as Record<string, unknown>)[k] = m;
    } else {
      const list = set[k] as Molde[];
      if (list.length >= LIMITS[k]) return;
      list.push(m);
    }
    chosen.push(m);
  };
  for (const slug of input.slugs ?? []) {
    const m = getMolde(slug);
    if (m) add(m);
  }

  const query = [input.goal, input.sector].filter(Boolean).join(" ");
  const hits = new Map<string, number>();
  const found = searchHits(query);
  const top = found[0]?.score ?? 1;
  for (const h of found) hits.set(h.slug, (h.score / top) * 3);
  const avoid = new Set(history);

  const order: Kind[] = ["style", "palette", "type_pair", "motion", "pattern", "effect", "component"];
  for (const kind of order) {
    const have = kind === "style" || kind === "type_pair" || kind === "palette" ? (set[kind] ? 1 : 0) : (set[kind] as Molde[]).length;
    const need = LIMITS[kind] - have;
    if (need <= 0) continue;
    const paired = new Set(chosen.flatMap((c) => c.pairs_with));
    const reverse = new Set(moldes.filter((m) => m.pairs_with.some((p) => chosen.some((c) => c.slug === p))).map((m) => m.slug));
    for (const r of reverse) paired.add(r);
    const ranked = moldes
      .filter((m) => m.kind === kind && !chosen.includes(m))
      .filter((m) => (kind !== "effect" && kind !== "component") || paired.has(m.slug) || hits.has(m.slug))
      .map((m) => ({ m, s: score(m, input, hits, paired, avoid) }))
      .sort((a, b) => b.s - a.s || a.m.slug.localeCompare(b.m.slug));
    if (kind === "pattern") {
      // A page brief needs an opening and a closing before anything else.
      for (const cat of ["hero", "cta"]) {
        if (set.pattern.some((p) => p.category === cat)) continue;
        const best = ranked.find(({ m }) => m.category === cat);
        if (best) add(best.m);
      }
    }
    ranked.forEach(({ m }) => add(m));
  }
  return set;
}

export function setSlugs(set: MoldeSet): string[] {
  return [set.style, set.type_pair, set.palette, ...set.motion, ...set.pattern, ...set.effect, ...set.component].filter(Boolean).map((m) => m!.slug);
}

export function mergedTokens(set: MoldeSet): TokenTree {
  const tree: TokenTree = structuredClone(set.style?.tokens ?? {});
  if (set.palette) {
    const color = (tree.color ?? {}) as TokenTree;
    const r = set.palette.light;
    const map: Record<string, string> = { bg: r.bg, surface: r.surface, fg: r.fg, muted: r.muted, accent: r.accent, "accent-fg": r.accent_fg, danger: r.danger };
    for (const [k, v] of Object.entries(map)) color[k] = { $type: "color", $value: v };
    tree.color = color;
  }
  if (set.type_pair) {
    const t = tokensFor(set.type_pair)!;
    tree.font = { ...((tree.font as TokenTree) ?? {}), ...(t.font as TokenTree) };
    tree.size = t.size!;
  }
  const mo = set.motion[0];
  if (mo) {
    const t = tokensFor(mo)!;
    tree.motion = { ...((tree.motion as TokenTree) ?? {}), ...(t.motion as TokenTree) };
  }
  return tree;
}

const bullet = (items: string[]) => items.map((i) => `- ${i}`).join("\n");
const uniq = (items: string[]) => [...new Set(items)];

export function composeBrief(input: BriefInput, history: string[] = []) {
  const set = resolveSet(input, history);
  const tree = mergedTokens(set);
  const st = set.style;
  const parts: string[] = [];
  parts.push(`# Brief de design — ${input.goal}`);
  if (input.client) parts.push(`Cliente: ${input.client}${history.length ? ` (evitando ${history.length} moldes já usados)` : ""}`);
  if (st) parts.push(`## Direção: ${st.title}\n${st.summary}\nAssinatura:\n${bullet(st.signature_moves.slice(0, 4))}`);
  if (set.type_pair) {
    const tp = set.type_pair;
    parts.push(`## Tipografia: ${tp.title}\nDisplay ${tp.display.family} (${tp.display.weights.join("/")}), texto ${tp.text.family}${tp.mono ? `, mono ${tp.mono.family}` : ""}. Google Fonts, OFL-1.1. Escala ${tp.scale.ratio}, base ${tp.scale.base_px}px.`);
  }
  if (set.palette) {
    const p = set.palette;
    parts.push(`## Paleta: ${p.title}\nfg/bg ${contrast(p.light.fg, p.light.bg).toFixed(1)}:1 claro, ${contrast(p.dark.fg, p.dark.bg).toFixed(1)}:1 escuro. Escuro: bg ${p.dark.bg}, fg ${p.dark.fg}, accent ${p.dark.accent}.`);
  }
  parts.push(`## Tokens (CSS)\n\`\`\`css\n${toCss(tree).trim()}\n\`\`\``);
  const all = setSlugs(set).map((s) => getMolde(s)!);
  const dos = uniq([st, set.palette, ...set.pattern].flatMap((m) => m?.when_to_use ?? [])).slice(0, 4);
  const donts = uniq([...(st?.anti_patterns ?? []), ...all.flatMap((m) => m.anti_patterns)]).slice(0, 6);
  parts.push(`## Faça\n${bullet(dos)}\n## Não faça\n${bullet(donts)}`);
  if (set.motion.length) parts.push(`## Motion\n${bullet(set.motion.map((m) => `${m.title}: ${m.trigger}, ${m.duration_ms}ms, ${m.easing}${m.stagger_ms ? `, stagger ${m.stagger_ms}ms` : ""}. Reduced: ${m.reduced_motion}`))}`);
  if (set.pattern.length) parts.push(`## Seções\n${set.pattern.map((p, i) => `${i + 1}. ${p.title}: ${p.structure.slice(0, 3).join("; ")}`).join("\n")}`);
  if (set.effect.length) parts.push(`## Efeito\n${bullet(set.effect.map((e) => `${e.title}: ${e.summary}`))}`);
  const refsList = uniq(all.flatMap((m) => m.component_refs));
  if (refsList.length) parts.push(`## component_refs\n${refsList.join(", ")}`);
  parts.push(`## Checklist anti-IA\n${ANTI_AI_CHECKLIST.map((c) => `- [ ] ${c}`).join("\n")}`);
  parts.push(`Moldes: ${setSlugs(set).join(", ")}`);

  let text = parts.join("\n\n");
  const budget = BRIEF_TOKEN_LIMIT * 4;
  while (text.length > budget && parts.length > 4) {
    const drop = parts.findIndex((p) => p.startsWith("## Efeito") || p.startsWith("## component_refs") || p.startsWith("## Paleta"));
    parts.splice(drop >= 0 ? drop : parts.length - 3, 1);
    text = parts.join("\n\n");
  }
  if (text.length > budget) text = text.slice(0, budget - 1) + "…";
  return { text, slugs: setSlugs(set), tokens: tree, estimated_tokens: estimateTokens(text) };
}
