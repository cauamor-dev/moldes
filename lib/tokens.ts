import { genericFamily } from "./fonts";
import type { Molde, PaletteRoles, TokenLeaf, TokenTree } from "./schema";

export type TokenFormat = "dtcg" | "css" | "tailwind";

const px = (value: number) => ({ value, unit: "px" });

function paletteGroup(r: PaletteRoles): TokenTree {
  return Object.fromEntries(Object.entries(r).map(([k, v]) => [k.replace("_", "-"), { $type: "color", $value: v }])) as TokenTree;
}

export function tokensFor(m: Molde): TokenTree | null {
  switch (m.kind) {
    case "style":
      return m.tokens;
    case "palette":
      return { color: { light: paletteGroup(m.light), dark: paletteGroup(m.dark) } };
    case "type_pair": {
      const fam = (f: { family: string }) => ({ $type: "fontFamily" as const, $value: [f.family, genericFamily(f.family)] });
      const size: TokenTree = {};
      m.scale.steps.forEach((s, i) => (size[`step-${i - 1}`] = { $type: "dimension", $value: px(s) }));
      return {
        font: {
          display: fam(m.display),
          text: fam(m.text),
          ...(m.mono ? { mono: fam(m.mono) } : {}),
        },
        size,
      };
    }
    case "motion": {
      const bezier = m.easing.match(/cubic-bezier\(([^)]+)\)/)?.[1]?.split(",").map(Number);
      return {
        motion: {
          [m.slug]: {
            duration: { $type: "duration", $value: { value: m.duration_ms, unit: "ms" } },
            ...(bezier?.length === 4 ? { ease: { $type: "cubicBezier", $value: bezier } } : {}),
            stagger: { $type: "duration", $value: { value: m.stagger_ms, unit: "ms" } },
          },
        },
      };
    }
    default:
      return null;
  }
}

function isLeaf(v: unknown): v is TokenLeaf {
  return typeof v === "object" && v !== null && "$value" in v;
}

const dim = (v: unknown) => {
  const d = v as { value: number; unit: string };
  return `${d.value}${d.unit}`;
};

const quoteFont = (f: string) => (/^(serif|sans-serif|monospace|cursive|system-ui)$/.test(f) ? f : `"${f}"`);

export function cssValue(t: TokenLeaf): string {
  const v = t.$value;
  switch (t.$type) {
    case "dimension":
    case "borderRadius":
    case "duration":
      return typeof v === "object" ? dim(v) : String(v);
    case "cubicBezier":
      return `cubic-bezier(${(v as number[]).join(", ")})`;
    case "fontFamily":
      return Array.isArray(v) ? v.map(quoteFont).join(", ") : quoteFont(String(v));
    case "shadow": {
      const s = v as { color: string; offsetX: unknown; offsetY: unknown; blur: unknown; spread: unknown };
      return `${dim(s.offsetX)} ${dim(s.offsetY)} ${dim(s.blur)} ${dim(s.spread)} ${s.color}`;
    }
    default:
      return String(v);
  }
}

export function flatten(tree: TokenTree, prefix: string[] = []): [string[], TokenLeaf][] {
  return Object.entries(tree).flatMap(([k, v]) => (isLeaf(v) ? [[[...prefix, k], v] as [string[], TokenLeaf]] : flatten(v as TokenTree, [...prefix, k])));
}

function decls(entries: [string[], TokenLeaf][], name: (p: string[]) => string, indent = "  ") {
  return entries.map(([p, t]) => `${indent}${name(p)}: ${cssValue(t)};`).join("\n");
}

function splitPalette(tree: TokenTree) {
  const color = tree.color as TokenTree | undefined;
  if (color && "light" in color && "dark" in color) return { light: color.light as TokenTree, dark: color.dark as TokenTree };
  return null;
}

export function toCss(tree: TokenTree): string {
  const pal = splitPalette(tree);
  if (pal) {
    const name = (p: string[]) => `--color-${p.join("-")}`;
    const dark = decls(flatten(pal.dark), name, "    ");
    return `:root {\n${decls(flatten(pal.light), name)}\n}\n@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {\n${dark}\n  }\n}\n:root[data-theme="dark"] {\n${decls(flatten(pal.dark), name)}\n}\n`;
  }
  return `:root {\n${decls(flatten(tree), (p) => `--${p.join("-")}`)}\n}\n`;
}

const TW_NAMESPACE: Record<string, string> = { color: "color", font: "font", radius: "radius", shadow: "shadow", size: "text" };

export function toTailwind(tree: TokenTree): string {
  const pal = splitPalette(tree);
  if (pal) {
    const name = (p: string[]) => `--color-${p.join("-")}`;
    return `@import "tailwindcss";\n\n@theme {\n${decls(flatten(pal.light), name)}\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n${decls(flatten(pal.dark), name, "    ")}\n  }\n}\n`;
  }
  const name = ([group, ...rest]: string[]) => {
    if (group === "motion") return rest.at(-1) === "ease" ? `--ease-${rest.slice(0, -1).join("-") || "default"}` : `--${["motion", ...rest].join("-")}`;
    const ns = TW_NAMESPACE[group!] ?? group;
    return `--${[ns, ...rest].join("-")}`;
  };
  return `@import "tailwindcss";\n\n@theme {\n${decls(flatten(tree), name)}\n}\n`;
}

export function formatTokens(m: Molde, format: TokenFormat): string | null {
  const tree = tokensFor(m);
  if (!tree) return null;
  if (format === "css") return toCss(tree);
  if (format === "tailwind") return toTailwind(tree);
  return JSON.stringify(tree, null, 2);
}
