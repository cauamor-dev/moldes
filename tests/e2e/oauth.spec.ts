import { expect, test } from "@playwright/test";
import { createHash } from "node:crypto";

const TOKEN = process.env.MOLDES_TOKEN ?? "e2e-local-token";
const REDIRECT = "http://localhost:9999/callback";
const verifier = "v".repeat(60);
const challenge = createHash("sha256").update(verifier).digest("base64url");

test("OAuth: metadata → DCR → consentimento → token → MCP", async ({ page, request, baseURL }) => {
  const prm = await (await request.get("/.well-known/oauth-protected-resource/api/mcp")).json();
  expect(prm.resource).toBe(`${baseURL}/api/mcp`);
  const as = await (await request.get("/.well-known/oauth-authorization-server")).json();
  expect(as.code_challenge_methods_supported).toContain("S256");

  const reg = await request.post(as.registration_endpoint, { data: { client_name: "Teste E2E", redirect_uris: [REDIRECT] } });
  expect(reg.status()).toBe(201);
  const { client_id } = await reg.json();

  const q = new URLSearchParams({ client_id, redirect_uri: REDIRECT, response_type: "code", state: "s1", code_challenge: challenge, code_challenge_method: "S256", resource: prm.resource });
  let callback = "";
  await page.route("http://localhost:9999/**", (route) => {
    callback = route.request().url();
    return route.fulfill({ body: "ok" });
  });
  await page.goto(`${as.authorization_endpoint}?${q}`);
  await expect(page.getByText("Teste E2E")).toBeVisible();
  await page.fill("#token", TOKEN);
  await page.getByRole("button", { name: "Autorizar" }).click();
  await expect.poll(() => callback).toContain("code=");
  const back = new URL(callback);
  expect(back.searchParams.get("state")).toBe("s1");

  const tok = await request.post(as.token_endpoint, {
    form: { grant_type: "authorization_code", code: back.searchParams.get("code")!, client_id, redirect_uri: REDIRECT, code_verifier: verifier },
  });
  expect(tok.status()).toBe(200);
  const { access_token } = await tok.json();

  const mcp = await request.post("/api/mcp", {
    headers: { authorization: `Bearer ${access_token}`, accept: "application/json, text/event-stream" },
    data: { jsonrpc: "2.0", id: 1, method: "tools/list" },
  });
  expect(mcp.status()).toBe(200);
  expect((await mcp.json()).result.tools).toHaveLength(8);
});
