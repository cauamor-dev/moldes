export const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, mcp-protocol-version",
  "Access-Control-Max-Age": "86400",
};

export const preflight = () => new Response(null, { status: 204, headers: CORS });

export const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  Response.json(body, { status, headers: { ...CORS, "Cache-Control": "no-store", ...extra } });
