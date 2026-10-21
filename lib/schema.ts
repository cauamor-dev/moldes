import { z } from "zod";

export const KINDS = ["style", "type_pair", "palette", "motion", "pattern", "effect", "component"] as const;
export type Kind = (typeof KINDS)[number];

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const oklch = z.string().regex(/^oklch\(\s*[\d.]+%?\s+[\d.]+\s+[\d.]+(\s*\/\s*[\d.]+%?)?\s*\)$/, "use OKLCH");
const text = z.string().min(1);

export const referenceSchema = z.object({
  title: text,
  url: z.url(),
  author: text,
  license: text,
  accessed_at: z.iso.date(),
});

export const demoSchema = z.object({
  html: text,
  css: z.string(),
  height: z.number().int().min(48).max(560),
  fonts: z.array(text).default([]),
  hover: z.boolean().default(false),
  dark: z.boolean().default(false),
});

const codeSchema = z.object({
  lang: z.enum(["html", "css", "tsx", "js"]),
  label: text,
  source: text,
});

const base = z.object({
  slug,
  title: text,
  summary: text.max(240),
  category: z.string().optional(),
  tags: z.array(text).min(1),
  sectors: z.array(text).default([]),
  boldness: z.number().int().min(1).max(5),
  when_to_use: z.array(text).min(1),
  avoid_when: z.array(text).min(1),
  anti_patterns: z.array(text).default([]),
  pairs_with: z.array(slug).default([]),
  component_refs: z.array(z.string().regex(/^@(shadcn|magicui)\/[a-z0-9-]+$/)).default([]),
  references: z.array(referenceSchema).default([]),
  license: text,
  demo: demoSchema.optional(),
  code: z.array(codeSchema).default([]),
});

// W3C DTCG 2025.10: groups nest, leaves carry $type/$value.
const tokenType = z.enum([
  "color", "fontFamily", "fontWeight", "dimension", "duration", "cubicBezier", "number", "shadow", "borderRadius",
]);
export type TokenLeaf = { $type: z.infer<typeof tokenType>; $value: unknown; $description?: string };
export type TokenTree = { [key: string]: TokenLeaf | TokenTree };

const leafSchema = z.object({ $type: tokenType, $value: z.unknown(), $description: z.string().optional() }).superRefine((t, ctx) => {
  if (t.$type === "color" && !oklch.safeParse(t.$value).success) ctx.addIssue({ code: "custom", message: "color tokens must be OKLCH" });
});
export const tokenTreeSchema: z.ZodType<TokenTree> = z.lazy(() =>
  z.record(z.string(), z.union([leafSchema, tokenTreeSchema])),
) as z.ZodType<TokenTree>;

const font = z.object({
  family: text,
  source: z.literal("google"),
  license: z.literal("OFL-1.1"),
  weights: z.array(z.number().int().min(100).max(900)).min(1),
  italic: z.boolean().default(false),
});

const roles = z.object({ bg: oklch, surface: oklch, fg: oklch, muted: oklch, accent: oklch, accent_fg: oklch, danger: oklch });
export type PaletteRoles = z.infer<typeof roles>;

export const moldeSchema = z.discriminatedUnion("kind", [
  base.extend({
    kind: z.literal("style"),
    tokens: tokenTreeSchema,
    signature_moves: z.array(text).min(2),
  }),
  base.extend({
    kind: z.literal("type_pair"),
    display: font,
    text: font,
    mono: font.optional(),
    scale: z.object({ ratio: z.number().min(1.05).max(1.8), base_px: z.number().int().min(14).max(20), steps: z.array(z.number()).min(4) }),
    sample: z.object({ headline: text, body: text }),
  }),
  base.extend({
    kind: z.literal("palette"),
    light: roles,
    dark: roles,
  }),
  base.extend({
    kind: z.literal("motion"),
    trigger: z.enum(["load", "scroll", "hover", "tap", "loop", "state"]),
    duration_ms: z.number().int().min(0).max(60000),
    easing: text,
    stagger_ms: z.number().int().min(0).max(1000).default(0),
    props: z.array(text).min(1),
    reduced_motion: text,
    snippet: text,
    demo: demoSchema,
  }),
  base.extend({
    kind: z.literal("pattern"),
    structure: z.array(text).min(2),
    wireframe: text,
    variations: z.array(text).min(1),
    demo: demoSchema,
  }),
  base.extend({ kind: z.literal("effect"), demo: demoSchema }),
  base.extend({ kind: z.literal("component"), demo: demoSchema }),
]);

export type Molde = z.infer<typeof moldeSchema>;
export type MoldeOf<K extends Kind> = Extract<Molde, { kind: K }>;
export type MoldeInput = z.input<typeof moldeSchema>;
