import type { Options } from "minisearch";
import { normalize } from "./text";

export type SearchDoc = {
  id: string;
  kind: string;
  title: string;
  summary: string;
  category: string;
  tags: string;
  sectors: string;
  usage: string;
};

const STOPWORDS = new Set(["a", "o", "as", "os", "de", "da", "do", "das", "dos", "e", "em", "no", "na", "um", "uma", "para", "pra", "com", "por", "que", "site", "landing", "page", "pagina"]);

export const searchOptions: Options<SearchDoc> = {
  idField: "id",
  fields: ["title", "summary", "category", "tags", "sectors", "usage", "kind"],
  storeFields: ["kind"],
  processTerm: (term) => {
    const t = normalize(term);
    return STOPWORDS.has(t) ? null : t;
  },
  searchOptions: { boost: { title: 3, tags: 2, category: 1.5 }, prefix: true, fuzzy: 0.2, combineWith: "AND" },
};
