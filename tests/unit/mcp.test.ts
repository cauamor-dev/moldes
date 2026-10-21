import { beforeAll, describe, expect, it } from "vitest";
import { estimateTokens } from "@/lib/text";

const TOKEN = "test-token-for-contract";
let POST: (req: Request) => Promise<Response>;

beforeAll(async () => {
  process.env.MOLDES_TOKEN = TOKEN;
  ({ POST } = await import("@/app/api/mcp/route"));
});

function rpc(body: unknown, token?: string) {
  return POST(
    new Request("http://localhost/api/mcp", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json, text/event-stream", ...(token ? { authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body),
    }),
  );
}

describe("MCP contract", () => {
  it("rejects requests without a token", async () => {
    expect((await rpc({ jsonrpc: "2.0", id: 1, method: "tools/list" })).status).toBe(401);
    expect((await rpc({ jsonrpc: "2.0", id: 1, method: "tools/list" }, "wrong")).status).toBe(401);
  });

  it("lists the 8 tools", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 1, method: "tools/list" }, TOKEN);
    expect(res.status).toBe(200);
    const names = ((await res.json()).result.tools as { name: string }[]).map((t) => t.name).sort();
    expect(names).toEqual(
      ["compose_style_brief", "export_design_md", "get_client_history", "get_molde", "get_tokens", "list_taxonomy", "record_usage", "search_moldes"].sort(),
    );
  });

  it("compose_style_brief returns at most 1500 tokens", async () => {
    const res = await rpc(
      { jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "compose_style_brief", arguments: { goal: "landing de estúdio de arquitetura", sector: "arquitetura", boldness: 3 } } },
      TOKEN,
    );
    const text = (await res.json()).result.content[0].text as string;
    expect(text).toContain("Checklist anti-IA");
    expect(estimateTokens(text)).toBeLessThanOrEqual(1500);
  });

  it("record_usage reports disabled without Upstash", async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    const res = await rpc({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "record_usage", arguments: { client: "x", project: "y", slugs: ["suico"] } } }, TOKEN);
    expect((await res.json()).result.content[0].text).toContain("desativado");
  });
});
