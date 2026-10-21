export const SESSION_COOKIE = "moldes_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

const enc = new TextEncoder();

async function sha256(input: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(input)));
}

function equal(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i]! ^ b[i]!;
  return diff === 0;
}

const hex = (b: Uint8Array) => Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");

function expected(): string | null {
  const t = process.env.MOLDES_TOKEN;
  return t && t.length > 0 ? t : null;
}

// Both sides are hashed first so the comparison always runs over 32 bytes.
export async function tokenMatches(candidate: string | null | undefined): Promise<boolean> {
  const token = expected();
  if (!token || !candidate) return false;
  return equal(await sha256(candidate), await sha256(token));
}

export async function sessionValue(): Promise<string | null> {
  const token = expected();
  return token ? hex(await sha256(`moldes-session:${token}`)) : null;
}

export async function sessionMatches(cookie: string | null | undefined): Promise<boolean> {
  const value = await sessionValue();
  if (!value || !cookie) return false;
  return equal(await sha256(cookie), await sha256(value));
}

export function bearer(req: Request): string | null {
  const h = req.headers.get("authorization");
  const m = h?.match(/^Bearer\s+(.+)$/i);
  return m?.[1]?.trim() ?? null;
}

export async function isAuthorized(req: Request, cookie?: string | null): Promise<boolean> {
  return (await tokenMatches(bearer(req))) || (await sessionMatches(cookie));
}
