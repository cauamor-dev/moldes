import { describe, expect, it } from "vitest";
import { composeBrief } from "@/lib/brief";
import { contrast, toHex } from "@/lib/color";
import { getMolde, searchMoldes } from "@/lib/data";
import { exportDesignMd } from "@/lib/design-md";
import { estimateTokens } from "@/lib/text";
import { formatTokens } from "@/lib/tokens";

describe("color", () => {
  it("converts OKLCH and measures contrast", () => {
    expect(toHex("oklch(0.628 0.2577 29.23)")).toBe("#ff0000");
    expect(contrast("oklch(1 0 0)", "oklch(0 0 0)")).toBeCloseTo(21, 0);
  });
});

describe("search", () => {
  it("ignores accents", () => {
    const a = searchMoldes({ query: "editorial", limit: 50 }).map((m) => m.slug);
    const b = searchMoldes({ query: "EDITÓRIAL", limit: 50 }).map((m) => m.slug);
    expect(a.length).toBeGreaterThan(0);
    expect(b).toEqual(a);
    expect(searchMoldes({ query: "clinica", limit: 5 }).map((m) => m.slug)).toContain("verde-clinica");
  });

  it("filters by kind", () => {
    expect(searchMoldes({ query: "", kind: "motion", limit: 100 }).every((m) => m.kind === "motion")).toBe(true);
  });
});

describe("tokens", () => {
  it("exports css and tailwind", () => {
    const m = getMolde("suico")!;
    expect(formatTokens(m, "css")).toContain("--color-accent: oklch(");
    expect(formatTokens(m, "tailwind")).toContain("@theme");
    expect(JSON.parse(formatTokens(m, "dtcg")!).color.bg.$type).toBe("color");
  });
});

describe("brief + DESIGN.md", () => {
  it("stays under 1500 tokens and respects required slugs", () => {
    const r = composeBrief({ goal: "landing de clínica odontológica", sector: "saúde", boldness: 2, slugs: ["suico"] });
    expect(estimateTokens(r.text)).toBeLessThanOrEqual(1500);
    expect(r.slugs[0]).toBe("suico");
    expect(r.slugs.some((s) => getMolde(s)!.kind === "pattern")).toBe(true);
  });

  it("avoids the client's history", () => {
    const first = composeBrief({ goal: "cafeteria artesanal", sector: "café" });
    const second = composeBrief({ goal: "cafeteria artesanal", sector: "café" }, first.slugs);
    expect(second.slugs).not.toEqual(first.slugs);
  });

  it("produces a Stitch-style DESIGN.md", () => {
    const md = exportDesignMd({ slugs: ["editorial"] });
    expect(md.startsWith("---\nname:")).toBe(true);
    for (const h of ["## Overview", "## Colors", "## Typography", "## Layout", "## Elevation & Depth", "## Shapes", "## Components", "## Do's and Don'ts"]) expect(md).toContain(h);
  });
});
