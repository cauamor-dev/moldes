import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { moldeSchema } from "../../lib/schema";
import { components } from "./components";
import { effects } from "./effects";
import { motions } from "./motion";
import { palettes } from "./palettes";
import { patterns } from "./patterns";
import { styles } from "./styles";
import { typePairs } from "./type-pairs";

const dir = path.join(process.cwd(), "content/moldes");
const all = [...styles, ...typePairs, ...palettes, ...motions, ...effects, ...components, ...patterns];

const errors: string[] = [];
const parsed = all.map((seed) => {
  const r = moldeSchema.safeParse(seed);
  if (!r.success) errors.push(`${seed.slug}: ${r.error.issues.map((i) => `${i.path.join(".")} ${i.message}`).join("; ")}`);
  return r.data;
});
const slugs = new Set<string>();
for (const m of all) {
  if (slugs.has(m.slug)) errors.push(`duplicate slug ${m.slug}`);
  slugs.add(m.slug);
}
for (const m of all) for (const p of m.pairs_with ?? []) if (!slugs.has(p)) errors.push(`${m.slug}: pairs_with unknown "${p}"`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

mkdirSync(dir, { recursive: true });
for (const f of readdirSync(dir)) if (f.endsWith(".json")) rmSync(path.join(dir, f));
for (const m of parsed) writeFileSync(path.join(dir, `${m!.slug}.json`), JSON.stringify(m, null, 2) + "\n");
const count = parsed.reduce<Record<string, number>>((acc, m) => ((acc[m!.kind] = (acc[m!.kind] ?? 0) + 1), acc), {});
console.log(`wrote ${parsed.length} moldes`, count);
