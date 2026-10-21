import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_MAX_AGE, sessionValue, tokenMatches } from "@/lib/auth";

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const token = String(form?.get("token") ?? "");
  const next = String(form?.get("next") ?? "/");
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  if (!(await tokenMatches(token))) {
    return Response.redirect(new URL(`/login?erro=1&next=${encodeURIComponent(safeNext)}`, req.url), 303);
  }
  (await cookies()).set(SESSION_COOKIE, (await sessionValue())!, {
    httpOnly: true,
    secure: process.env.INSECURE_COOKIE !== "1",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return Response.redirect(new URL(safeNext, req.url), 303);
}

export async function DELETE() {
  (await cookies()).delete(SESSION_COOKIE);
  return new Response(null, { status: 204 });
}
