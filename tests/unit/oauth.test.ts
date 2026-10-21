import { beforeAll, describe, expect, it } from "vitest";
import { sha256b64url } from "@/lib/jwt";
import { checkAuthorize, exchange, issueCode, registerClient, verifyAccessToken } from "@/lib/oauth";

const O = "https://moldes.test";
const REDIRECT = "https://claude.ai/api/mcp/auth_callback";
const verifier = "a".repeat(64);
let POST: (req: Request) => Promise<Response>;

beforeAll(async () => {
  process.env.MOLDES_TOKEN = "oauth-test-token";
  ({ POST } = await import("@/app/api/mcp/route"));
});

async function fullFlow(auth?: string) {
  const client = await registerClient({ redirect_uris: [REDIRECT], client_name: "Claude", token_endpoint_auth_method: auth });
  const { params } = await checkAuthorize(
    { client_id: client.client_id, redirect_uri: REDIRECT, response_type: "code", state: "xyz", code_challenge: await sha256b64url(verifier), code_challenge_method: "S256" },
    O,
  );
  const redirect = new URL(await issueCode(params));
  return { client, redirect, code: redirect.searchParams.get("code")! };
}

const form = (o: Record<string, string>) => new URLSearchParams(o);

describe("OAuth 2.1", () => {
  it("rejects unsafe redirect uris at registration", async () => {
    await expect(registerClient({ redirect_uris: ["http://evil.com/cb"] })).rejects.toThrow();
    await expect(registerClient({ redirect_uris: ["javascript:alert(1)"] })).rejects.toThrow();
    await expect(registerClient({ redirect_uris: ["http://localhost:3333/callback"] })).resolves.toBeTruthy();
  });

  it("requires PKCE S256 and a registered redirect", async () => {
    const client = await registerClient({ redirect_uris: [REDIRECT] });
    await expect(checkAuthorize({ client_id: client.client_id, redirect_uri: "https://other.app/cb", response_type: "code", code_challenge: "x", code_challenge_method: "S256" }, O)).rejects.toThrow(/redirect_uri/);
    await expect(checkAuthorize({ client_id: client.client_id, redirect_uri: REDIRECT, response_type: "code" }, O)).rejects.toThrow();
  });

  it("exchanges a code with the right verifier and refreshes", async () => {
    const { client, redirect, code } = await fullFlow();
    expect(redirect.origin + redirect.pathname).toBe(REDIRECT);
    expect(redirect.searchParams.get("state")).toBe("xyz");
    await expect(exchange(form({ grant_type: "authorization_code", code, client_id: client.client_id, code_verifier: "wrong".repeat(10), redirect_uri: REDIRECT }), null)).rejects.toThrow(/PKCE/);
    const t = await exchange(form({ grant_type: "authorization_code", code, client_id: client.client_id, code_verifier: verifier, redirect_uri: REDIRECT }), null);
    expect(t.token_type).toBe("Bearer");
    expect(await verifyAccessToken(t.access_token, O)).toBe(true);
    expect(await verifyAccessToken(t.access_token, "https://other.host")).toBe(false);
    expect(await verifyAccessToken(t.refresh_token, O)).toBe(false);
    const r = await exchange(form({ grant_type: "refresh_token", refresh_token: t.refresh_token, client_id: client.client_id }), null);
    expect(await verifyAccessToken(r.access_token, O)).toBe(true);
  });

  it("checks client_secret for confidential clients", async () => {
    const { client, code } = await fullFlow("client_secret_post");
    await expect(exchange(form({ grant_type: "authorization_code", code, client_id: client.client_id, client_secret: "nope", code_verifier: verifier }), null)).rejects.toThrow(/secret/);
    const basic = btoa(`${client.client_id}:${client.client_secret}`);
    const t = await exchange(form({ grant_type: "authorization_code", code, code_verifier: verifier }), basic);
    expect(t.access_token).toBeTruthy();
  });

  it("does not accept a code from another client", async () => {
    const { code } = await fullFlow();
    const other = await registerClient({ redirect_uris: [REDIRECT] });
    await expect(exchange(form({ grant_type: "authorization_code", code, client_id: other.client_id, code_verifier: verifier }), null)).rejects.toThrow(/code/);
  });

  it("MCP accepts the OAuth access token and advertises metadata on 401", async () => {
    const { client, code } = await fullFlow();
    const t = await exchange(form({ grant_type: "authorization_code", code, client_id: client.client_id, code_verifier: verifier }), null);
    const call = (token?: string) =>
      POST(
        new Request(`${O}/api/mcp`, {
          method: "POST",
          headers: { "content-type": "application/json", accept: "application/json, text/event-stream", ...(token ? { authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }),
        }),
      );
    const denied = await call();
    expect(denied.status).toBe(401);
    expect(denied.headers.get("www-authenticate")).toContain(`resource_metadata="${O}/.well-known/oauth-protected-resource"`);
    expect((await call(t.access_token)).status).toBe(200);
    expect((await call("oauth-test-token")).status).toBe(200);
  });
});
