import { json, preflight } from "@/lib/cors";
import { exchange, OAuthError } from "@/lib/oauth";

export async function POST(req: Request) {
  const type = req.headers.get("content-type") ?? "";
  let form: URLSearchParams;
  if (type.includes("application/json")) {
    const body = (await req.json().catch(() => ({}))) as Record<string, string>;
    form = new URLSearchParams(Object.entries(body).map(([k, v]) => [k, String(v)]));
  } else form = new URLSearchParams(await req.text());
  const basic = req.headers.get("authorization")?.match(/^Basic\s+(.+)$/i)?.[1] ?? null;
  try {
    return json(await exchange(form, basic), 200, { Pragma: "no-cache" });
  } catch (e) {
    if (e instanceof OAuthError) return json({ error: e.code, error_description: e.description }, e.status);
    return json({ error: "invalid_request", error_description: "requisição inválida" }, 400);
  }
}

export const OPTIONS = preflight;
