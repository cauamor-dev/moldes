import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_MAX_AGE, sessionMatches, sessionValue, tokenMatches } from "@/lib/auth";
import { consentPage, errorPage } from "@/lib/consent-page";
import { checkAuthorize, checkConsentNonce, consentNonce, issueCode, OAuthError, origin, redirectError, RedirectError } from "@/lib/oauth";

export const dynamic = "force-dynamic";

const html = (body: string, status = 200) =>
  new Response(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "content-security-policy": "default-src 'none'; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; form-action 'self' https: http://localhost:* http://127.0.0.1:*; frame-ancestors 'none'; base-uri 'none'",
      "x-frame-options": "DENY",
    },
  });

const go = (location: string) => new Response(null, { status: 303, headers: { location, "cache-control": "no-store" } });

function fail(e: unknown) {
  if (e instanceof RedirectError) return go(e.location);
  if (e instanceof OAuthError) return html(errorPage(e.description), e.status);
  throw e;
}

export async function GET(req: Request) {
  const query = Object.fromEntries(new URL(req.url).searchParams);
  try {
    const { params, client } = await checkAuthorize(query, origin(req));
    const logged = await sessionMatches((await cookies()).get(SESSION_COOKIE)?.value);
    return html(consentPage({ params, clientName: client.name, nonce: await consentNonce(params), needsToken: !logged }));
  } catch (e) {
    return fail(e);
  }
}

export async function POST(req: Request) {
  const form = Object.fromEntries((await req.formData()) as unknown as Iterable<[string, string]>);
  try {
    const { params, client } = await checkAuthorize({ ...form, response_type: "code" }, origin(req));
    if (!(await checkConsentNonce(form.nonce, params))) return html(errorPage("A página expirou. Volte ao app e conecte de novo."), 400);
    if (form.action !== "approve") return fail(redirectError(params, "access_denied", "usuário cancelou"));

    const jar = await cookies();
    const token = form.token?.trim();
    const ok = token ? await tokenMatches(token) : await sessionMatches(jar.get(SESSION_COOKIE)?.value);
    if (!ok) {
      return html(consentPage({ params, clientName: client.name, nonce: await consentNonce(params), needsToken: true, error: "Token não confere." }), 401);
    }
    if (token) {
      jar.set(SESSION_COOKIE, (await sessionValue())!, { httpOnly: true, secure: process.env.INSECURE_COOKIE !== "1", sameSite: "lax", path: "/", maxAge: SESSION_MAX_AGE });
    }
    return go(await issueCode(params));
  } catch (e) {
    return fail(e);
  }
}
