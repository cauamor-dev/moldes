import type { z } from "zod";

export const bad = (message: string, status = 400) => Response.json({ error: message }, { status });

export async function parseBody<T extends z.ZodType>(req: Request, schema: T): Promise<z.infer<T> | Response> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return bad("JSON inválido");
  }
  const r = schema.safeParse(raw);
  return r.success ? r.data : bad(r.error.issues.map((i) => `${i.path.join(".") || "body"}: ${i.message}`).join("; "));
}
