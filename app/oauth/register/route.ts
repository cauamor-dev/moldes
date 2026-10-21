import { json, preflight } from "@/lib/cors";
import { OAuthError, registerClient } from "@/lib/oauth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return json({ error: "invalid_client_metadata", error_description: "JSON inválido" }, 400);
  try {
    return json(await registerClient(body), 201);
  } catch (e) {
    if (e instanceof OAuthError) return json({ error: e.code, error_description: e.description }, e.status);
    throw e;
  }
}

export const OPTIONS = preflight;
