import { searchMoldes, summarize } from "@/lib/data";
import { KINDS, type Kind } from "@/lib/schema";
import { bad } from "@/lib/api";

export function GET(req: Request) {
  const u = new URL(req.url);
  const kind = u.searchParams.get("kind") ?? undefined;
  if (kind && !KINDS.includes(kind as Kind)) return bad(`kind inválido; use ${KINDS.join(", ")}`);
  const tags = u.searchParams.get("tags")?.split(",").map((t) => t.trim()).filter(Boolean);
  const limit = Number(u.searchParams.get("limit") ?? 50) || 50;
  const items = searchMoldes({ query: u.searchParams.get("q") ?? "", kind: kind as Kind | undefined, tags, limit }).map(summarize);
  return Response.json({ count: items.length, items });
}
