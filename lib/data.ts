import MiniSearch from "minisearch";
import moldesJson from "./generated/moldes.json";
import indexJson from "./generated/search-index.json";
import { KINDS, type Kind, type Molde } from "./schema";
import { searchOptions, type SearchDoc } from "./search-config";

export const moldes = moldesJson as unknown as Molde[];
const bySlug = new Map(moldes.map((m) => [m.slug, m]));
const index = MiniSearch.loadJSON<SearchDoc>(JSON.stringify(indexJson), searchOptions);

export function getMolde(slug: string): Molde | undefined {
  return bySlug.get(slug);
}

export type SearchParams = { query?: string; kind?: Kind; tags?: string[]; limit?: number };

export function searchMoldes({ query, kind, tags, limit = 8 }: SearchParams): Molde[] {
  const wanted = tags?.map((t) => t.toLowerCase());
  const pass = (m: Molde) =>
    (!kind || m.kind === kind) && (!wanted?.length || wanted.every((t) => m.tags.some((x) => x.toLowerCase() === t)));
  const q = query?.trim();
  let list: Molde[];
  if (q) {
    let hits = index.search(q);
    if (!hits.length) hits = index.search(q, { combineWith: "OR" });
    list = hits.map((h) => bySlug.get(h.id as string)!).filter(Boolean);
  } else list = moldes;
  return list.filter(pass).slice(0, Math.max(1, Math.min(limit, 200)));
}

export function searchHits(query: string): { slug: string; score: number }[] {
  if (!query.trim()) return [];
  return index.search(query, { combineWith: "OR" }).map((h) => ({ slug: h.id as string, score: h.score }));
}

export function summarize(m: Molde) {
  return { slug: m.slug, kind: m.kind, title: m.title, summary: m.summary, category: m.category, tags: m.tags, boldness: m.boldness };
}

export function taxonomy() {
  const count = <T extends string>(values: T[]) =>
    Object.entries(values.reduce<Record<string, number>>((a, v) => ((a[v] = (a[v] ?? 0) + 1), a), {}))
      .sort((a, b) => b[1] - a[1])
      .map(([name, n]) => ({ name, count: n }));
  return {
    total: moldes.length,
    kinds: KINDS.map((k) => ({ kind: k, count: moldes.filter((m) => m.kind === k).length })),
    categories: count(moldes.flatMap((m) => (m.category ? [`${m.kind}:${m.category}`] : []))),
    tags: count(moldes.flatMap((m) => m.tags)),
    sectors: count(moldes.flatMap((m) => m.sectors)),
    boldness: [1, 2, 3, 4, 5].map((b) => ({ level: b, count: moldes.filter((m) => m.boldness === b).length })),
  };
}
