import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { contrast } from "@/lib/color";
import { FONT_CATALOG } from "@/lib/fonts";
import { moldeSchema, type Molde } from "@/lib/schema";

const dir = path.join(process.cwd(), "content/moldes");
const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
const moldes = files.map((f) => ({ file: f, data: JSON.parse(readFileSync(path.join(dir, f), "utf8")) as unknown }));

describe("content/moldes", () => {
  it("has a healthy catalog", () => {
    expect(files.length).toBeGreaterThanOrEqual(100);
  });

  it.each(moldes.map((m) => [m.file, m.data]))("%s validates against the schema", (file, data) => {
    const r = moldeSchema.safeParse(data);
    expect(r.success, r.success ? "" : r.error.message).toBe(true);
    expect(`${(data as Molde).slug}.json`).toBe(file);
  });

  const parsed = moldes.map((m) => moldeSchema.parse(m.data));
  const slugs = new Set(parsed.map((m) => m.slug));

  it("pairs_with only points to existing moldes", () => {
    const broken = parsed.flatMap((m) => m.pairs_with.filter((p) => !slugs.has(p)).map((p) => `${m.slug} -> ${p}`));
    expect(broken).toEqual([]);
  });

  it("palettes pass WCAG AA in light and dark", () => {
    const fails: string[] = [];
    for (const m of parsed) {
      if (m.kind !== "palette") continue;
      for (const mode of ["light", "dark"] as const) {
        const r = m[mode];
        const check = (name: string, a: string, b: string, min: number) => {
          const c = contrast(a, b);
          if (c < min) fails.push(`${m.slug}/${mode} ${name} ${c.toFixed(2)}`);
        };
        check("fg/bg", r.fg, r.bg, 4.5);
        check("fg/surface", r.fg, r.surface, 4.5);
        check("muted/bg", r.muted, r.bg, 4.5);
        check("accent_fg/accent", r.accent_fg, r.accent, 4.5);
        check("accent/bg", r.accent, r.bg, 3);
        check("danger/bg", r.danger, r.bg, 4.5);
      }
    }
    expect(fails).toEqual([]);
  });

  it("type pairs only use OFL fonts from the catalog", () => {
    for (const m of parsed) {
      if (m.kind !== "type_pair") continue;
      for (const f of [m.display, m.text, m.mono].filter(Boolean)) {
        expect(f!.license).toBe("OFL-1.1");
        expect(FONT_CATALOG[f!.family], `${m.slug}: ${f!.family}`).toBeDefined();
      }
    }
  });

  it("styles reference fonts from the OFL catalog", () => {
    for (const m of parsed) {
      if (m.kind !== "style") continue;
      const font = m.tokens.font as Record<string, { $value: unknown }>;
      for (const k of ["display", "text", "mono"]) {
        const fam = (font[k]!.$value as string[])[0]!;
        expect(FONT_CATALOG[fam], `${m.slug}: ${fam}`).toBeDefined();
      }
    }
  });

  it("never ships forbidden fonts", () => {
    const raw = moldes.map((m) => JSON.stringify(m.data)).join("\n");
    for (const banned of ['"Inter"', '"Roboto"', '"Arial"', '"Space Grotesk"']) expect(raw).not.toContain(banned);
  });
});
