import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, bearer, sessionMatches, tokenMatches } from "@/lib/auth";

const PUBLIC = new Set(["/login", "/api/login"]);

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (PUBLIC.has(pathname) || pathname.startsWith("/.well-known/") || pathname.startsWith("/oauth/")) return NextResponse.next();
  // MCP checks its own Bearer (MOLDES_TOKEN or OAuth access token) and must never fall back to the cookie.
  if (pathname === "/api/mcp") return NextResponse.next();

  const machine = pathname.startsWith("/api/") || pathname.startsWith("/llms");
  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  const ok = (machine && (await tokenMatches(bearer(req)))) || (await sessionMatches(cookie));
  if (ok) return NextResponse.next();

  if (machine) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: { "WWW-Authenticate": "Bearer" } });
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt).*)"],
};
