import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { tokenMatches, bearer } from "@/lib/auth";
import { createMoldesServer } from "@/lib/mcp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const unauthorized = () =>
  Response.json({ jsonrpc: "2.0", error: { code: -32001, message: "unauthorized" }, id: null }, { status: 401, headers: { "WWW-Authenticate": "Bearer" } });

async function handle(req: Request) {
  if (!(await tokenMatches(bearer(req)))) return unauthorized();
  const server = createMoldesServer();
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  await server.connect(transport);
  return transport.handleRequest(req);
}

export { handle as GET, handle as POST, handle as DELETE };
