import { sha256b64url, sign, verify, type Claims } from "./jwt";

// Everything is stateless: client registrations, codes and tokens are JWTs signed
// with a key derived from MOLDES_TOKEN. Rotating MOLDES_TOKEN revokes all of them.
export const SCOPE = "moldes";
export const CODE_TTL = 5 * 60;
export const ACCESS_TTL = 60 * 60;
export const REFRESH_TTL = 60 * 60 * 24 * 90;

export function signingKey(): string | null {
  const t = process.env.MOLDES_TOKEN;
  return t ? `moldes-oauth-v1:${t}` : null;
}

export function origin(req: Request): string {
  const url = new URL(req.url);
  const host = req.headers.get("x-forwarded-host") ?? url.host;
  const proto = req.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
  return `${proto}://${host}`;
}

export const resourceUrl = (o: string) => `${o}/api/mcp`;

export function protectedResourceMetadata(o: string) {
  return {
    resource: resourceUrl(o),
    authorization_servers: [o],
    scopes_supported: [SCOPE],
    bearer_methods_supported: ["header"],
    resource_name: "Moldes",
  };
}

export function authorizationServerMetadata(o: string) {
  return {
    issuer: o,
    authorization_endpoint: `${o}/oauth/authorize`,
    token_endpoint: `${o}/oauth/token`,
    registration_endpoint: `${o}/oauth/register`,
    response_types_supported: ["code"],
    response_modes_supported: ["query"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint_auth_methods_supported: ["none", "client_secret_post", "client_secret_basic"],
    scopes_supported: [SCOPE],
  };
}

export type ClientClaims = Claims & { typ: "client"; redirect_uris: string[]; name: string; auth: string };
export type CodeClaims = Claims & { typ: "code"; cid: string; redirect_uri: string; challenge: string; scope: string; resource: string };
export type AccessClaims = Claims & { typ: "access"; cid: string; scope: string; aud: string };
export type RefreshClaims = Claims & { typ: "refresh"; cid: string; scope: string; aud: string };

const now = () => Math.floor(Date.now() / 1000);

export function validRedirect(uri: string): boolean {
  try {
    const u = new URL(uri);
    if (u.hash) return false;
    if (u.protocol === "https:") return true;
    // Native/CLI clients use loopback redirects (RFC 8252).
    if (u.protocol === "http:") return ["localhost", "127.0.0.1", "[::1]"].includes(u.hostname);
    // Custom schemes for desktop apps (e.g. cursor://).
    return /^[a-z][a-z0-9+.-]*:$/.test(u.protocol) && !["javascript:", "data:", "file:", "vbscript:"].includes(u.protocol);
  } catch {
    return false;
  }
}

export async function registerClient(input: { redirect_uris?: unknown; client_name?: unknown; token_endpoint_auth_method?: unknown }) {
  const key = signingKey();
  if (!key) throw new OAuthError("server_error", "MOLDES_TOKEN não configurado", 500);
  const uris = Array.isArray(input.redirect_uris) ? input.redirect_uris.filter((u): u is string => typeof u === "string") : [];
  if (!uris.length || !uris.every(validRedirect)) throw new OAuthError("invalid_redirect_uri", "redirect_uris inválidas");
  const auth = typeof input.token_endpoint_auth_method === "string" ? input.token_endpoint_auth_method : "none";
  if (!["none", "client_secret_post", "client_secret_basic"].includes(auth)) throw new OAuthError("invalid_client_metadata", "token_endpoint_auth_method não suportado");
  const name = typeof input.client_name === "string" ? input.client_name.slice(0, 80) : "Cliente MCP";
  const iat = now();
  const client_id = await sign({ typ: "client", redirect_uris: uris, name, auth, exp: iat + 60 * 60 * 24 * 365 * 5 }, key);
  const secret = auth === "none" ? undefined : await clientSecret(client_id);
  return {
    client_id,
    ...(secret ? { client_secret: secret, client_secret_expires_at: 0 } : {}),
    client_id_issued_at: iat,
    client_name: name,
    redirect_uris: uris,
    grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"],
    token_endpoint_auth_method: auth,
    scope: SCOPE,
  };
}

async function clientSecret(clientId: string) {
  return sha256b64url(`${signingKey()}:secret:${clientId}`);
}

export async function readClient(clientId: string | null): Promise<ClientClaims | null> {
  const key = signingKey();
  return key ? verify<ClientClaims>(clientId, key, "client") : null;
}

export class OAuthError extends Error {
  constructor(public code: string, public description: string, public status = 400) {
    super(description);
  }
}

export type AuthorizeParams = {
  client_id: string;
  redirect_uri: string;
  state: string;
  code_challenge: string;
  code_challenge_method: string;
  scope: string;
  resource: string;
};

// Errors that must not redirect (bad client or redirect) are thrown; the rest go back to the client.
export async function checkAuthorize(p: Record<string, string | undefined>, o: string): Promise<{ params: AuthorizeParams; client: ClientClaims }> {
  const client = await readClient(p.client_id ?? null);
  if (!client) throw new OAuthError("invalid_client", "client_id desconhecido. Remova e adicione o conector de novo.");
  const redirect = p.redirect_uri ?? (client.redirect_uris.length === 1 ? client.redirect_uris[0] : undefined);
  if (!redirect || !client.redirect_uris.includes(redirect)) throw new OAuthError("invalid_request", "redirect_uri não registrada para este cliente");
  const params: AuthorizeParams = {
    client_id: p.client_id!,
    redirect_uri: redirect,
    state: p.state ?? "",
    code_challenge: p.code_challenge ?? "",
    code_challenge_method: p.code_challenge_method ?? "",
    scope: SCOPE,
    resource: p.resource || resourceUrl(o),
  };
  if (p.response_type !== "code") throw redirectError(params, "unsupported_response_type", "use response_type=code");
  if (!params.code_challenge || params.code_challenge_method !== "S256") throw redirectError(params, "invalid_request", "PKCE S256 obrigatório");
  if (!params.resource.startsWith(o)) throw redirectError(params, "invalid_target", "resource deste servidor apenas");
  return { params, client };
}

export class RedirectError extends Error {
  constructor(public location: string) {
    super("redirect");
  }
}

export function redirectError(p: AuthorizeParams, error: string, description: string) {
  const u = new URL(p.redirect_uri);
  u.searchParams.set("error", error);
  u.searchParams.set("error_description", description);
  if (p.state) u.searchParams.set("state", p.state);
  return new RedirectError(u.toString());
}

export async function consentNonce(p: AuthorizeParams): Promise<string> {
  return sign({ typ: "consent", h: await sha256b64url(JSON.stringify(p)), exp: now() + 10 * 60 }, signingKey()!);
}

export async function checkConsentNonce(nonce: string | undefined, p: AuthorizeParams): Promise<boolean> {
  const c = await verify<Claims & { h: string }>(nonce, signingKey()!, "consent");
  return !!c && c.h === (await sha256b64url(JSON.stringify(p)));
}

export async function issueCode(p: AuthorizeParams): Promise<string> {
  const code = await sign(
    { typ: "code", cid: await sha256b64url(p.client_id), redirect_uri: p.redirect_uri, challenge: p.code_challenge, scope: p.scope, resource: p.resource, exp: now() + CODE_TTL },
    signingKey()!,
  );
  const u = new URL(p.redirect_uri);
  u.searchParams.set("code", code);
  if (p.state) u.searchParams.set("state", p.state);
  return u.toString();
}

async function tokens(cid: string, scope: string, aud: string) {
  const key = signingKey()!;
  const t = now();
  return {
    access_token: await sign({ typ: "access", cid, scope, aud, exp: t + ACCESS_TTL }, key),
    token_type: "Bearer",
    expires_in: ACCESS_TTL,
    refresh_token: await sign({ typ: "refresh", cid, scope, aud, exp: t + REFRESH_TTL }, key),
    scope,
  };
}

export async function exchange(form: URLSearchParams, basic: string | null) {
  const key = signingKey();
  if (!key) throw new OAuthError("server_error", "MOLDES_TOKEN não configurado", 500);
  let clientId = form.get("client_id");
  let secret = form.get("client_secret");
  if (basic) {
    const [id, sec] = atob(basic).split(":").map((s) => decodeURIComponent(s));
    clientId = id ?? clientId;
    secret = sec ?? secret;
  }
  const client = await readClient(clientId);
  if (!client || !clientId) throw new OAuthError("invalid_client", "cliente inválido", 401);
  if (client.auth !== "none" && secret !== (await clientSecret(clientId))) throw new OAuthError("invalid_client", "client_secret inválido", 401);
  const cid = await sha256b64url(clientId);

  const grant = form.get("grant_type");
  if (grant === "authorization_code") {
    const code = await verify<CodeClaims>(form.get("code"), key, "code");
    if (!code || code.cid !== cid) throw new OAuthError("invalid_grant", "code inválido ou expirado");
    if (form.get("redirect_uri") && form.get("redirect_uri") !== code.redirect_uri) throw new OAuthError("invalid_grant", "redirect_uri diferente");
    const verifier = form.get("code_verifier");
    if (!verifier || (await sha256b64url(verifier)) !== code.challenge) throw new OAuthError("invalid_grant", "PKCE falhou");
    return tokens(cid, code.scope, code.resource);
  }
  if (grant === "refresh_token") {
    const r = await verify<RefreshClaims>(form.get("refresh_token"), key, "refresh");
    if (!r || r.cid !== cid) throw new OAuthError("invalid_grant", "refresh_token inválido");
    return tokens(cid, r.scope, r.aud);
  }
  throw new OAuthError("unsupported_grant_type", "use authorization_code ou refresh_token");
}

export async function verifyAccessToken(token: string | null, o: string): Promise<boolean> {
  const key = signingKey();
  if (!key || !token) return false;
  const c = await verify<AccessClaims>(token, key, "access");
  return !!c && c.aud.startsWith(o);
}
