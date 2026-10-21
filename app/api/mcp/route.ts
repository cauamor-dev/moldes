import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { bearer, tokenMatches } from "@/lib/auth";
import { CORS } from "@/lib/cors";
import { createMoldesServer } from "@/lib/mcp";
import { origin, verifyAccessToken } from "@/lib/oauth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized(req: Request) {
  const meta = `${origin(req)}/.well-known/oauth-protected-resource`;
  return Response.json(
    { jsonrpc: "2.0", error: { code: -32001, message: "unauthorized" }, id: null },
    { status: 401, headers: { ...CORS, "WWW-Authenticate": `Bearer resource_metadata="${meta}", scope="moldes"`, "Access-Control-Expose-Headers": "WWW-Authenticate" } },
  );
}

async function handle(req: Request) {
  const token = bearer(req);
  if (!(await tokenMatches(token)) && !(await verifyAccessToken(token, origin(req)))) return unauthorized(req);
  const server = createMoldesServer();
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  await server.connect(transport);
  const res = await transport.handleRequest(req);
  for (const [k, v] of Object.entries(CORS)) res.headers.set(k, v);
  return res;
}

const options = () => new Response(null, { status: 204, headers: CORS });

export { handle as GET, handle as POST, handle as DELETE, options as OPTIONS };
