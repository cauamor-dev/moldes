// Minimal HS256 JWT on Web Crypto (works in Edge middleware and Node).
const enc = new TextEncoder();
const dec = new TextDecoder();

function b64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string): Uint8Array {
  const pad = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
  const bin = atob(pad);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function key(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export type Claims = Record<string, unknown> & { typ: string; exp: number; iat?: number };

export async function sign(claims: Omit<Claims, "iat">, secret: string): Promise<string> {
  const head = b64url(enc.encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const body = b64url(enc.encode(JSON.stringify({ iat: Math.floor(Date.now() / 1000), ...claims })));
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", await key(secret), enc.encode(`${head}.${body}`)));
  return `${head}.${body}.${b64url(sig)}`;
}

export async function verify<T extends Claims = Claims>(token: string | null | undefined, secret: string, typ: string): Promise<T | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [head, body, sig] = parts as [string, string, string];
  try {
    const ok = await crypto.subtle.verify("HMAC", await key(secret), fromB64url(sig) as BufferSource, enc.encode(`${head}.${body}`));
    if (!ok) return null;
    const header = JSON.parse(dec.decode(fromB64url(head))) as { alg?: string };
    if (header.alg !== "HS256") return null;
    const claims = JSON.parse(dec.decode(fromB64url(body))) as T;
    if (claims.typ !== typ || typeof claims.exp !== "number" || claims.exp < Date.now() / 1000) return null;
    return claims;
  } catch {
    return null;
  }
}

export async function sha256b64url(input: string): Promise<string> {
  return b64url(new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(input))));
}
