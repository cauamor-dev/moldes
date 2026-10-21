import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import MiniSearch from "minisearch";
import { moldeSchema, type Molde } from "../lib/schema";
import { searchOptions, type SearchDoc } from "../lib/search-config";
import { KIND_LABELS } from "../lib/labels";

const root = process.cwd();
const dir = path.join(root, "content/moldes");
const out = path.join(root, "lib/generated");

const moldes: Molde[] = readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .sort()
  .map((f) => {
    const r = moldeSchema.safeParse(JSON.parse(readFileSync(path.join(dir, f), "utf8")));
    if (!r.success) throw new Error(`${f}: ${r.error.message}`);
    return r.data;
  });

const docs: SearchDoc[] = moldes.map((m) => ({
  id: m.slug,
  kind: `${m.kind} ${KIND_LABELS[m.kind]}`,
  title: m.title,
  summary: m.summary,
  category: m.category ?? "",
  tags: m.tags.join(" "),
  sectors: m.sectors.join(" "),
  usage: m.when_to_use.join(" "),
}));

const index = new MiniSearch<SearchDoc>(searchOptions);
index.addAll(docs);

mkdirSync(out, { recursive: true });
writeFileSync(path.join(out, "moldes.json"), JSON.stringify(moldes));
writeFileSync(path.join(out, "search-index.json"), JSON.stringify(index));
console.log(`index: ${moldes.length} moldes`);
