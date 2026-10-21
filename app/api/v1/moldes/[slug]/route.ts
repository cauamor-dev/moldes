import { bad } from "@/lib/api";
import { getMolde } from "@/lib/data";
import { moldeToMarkdown } from "@/lib/markdown";
import { formatTokens, type TokenFormat } from "@/lib/tokens";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const raw = (await params).slug;
  const md = raw.endsWith(".md");
  const slug = raw.replace(/\.(md|json)$/, "");
  const m = getMolde(slug);
  if (!m) return bad(`molde não encontrado: ${slug}`, 404);
  const tokens = new URL(req.url).searchParams.get("tokens") as TokenFormat | null;
  if (tokens) {
    if (!["dtcg", "css", "tailwind"].includes(tokens)) return bad("tokens: use dtcg, css ou tailwind");
    const out = formatTokens(m, tokens);
    if (!out) return bad("este molde não tem tokens", 404);
    return new Response(out, { headers: { "content-type": tokens === "dtcg" ? "application/json" : "text/css; charset=utf-8" } });
  }
  if (md) return new Response(moldeToMarkdown(m), { headers: { "content-type": "text/markdown; charset=utf-8" } });
  return Response.json(m);
}
