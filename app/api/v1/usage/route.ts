import { bad, parseBody } from "@/lib/api";
import { usageInput } from "@/lib/inputs";
import { clientHistory, recordUsage } from "@/lib/usage";

export async function GET(req: Request) {
  const client = new URL(req.url).searchParams.get("client");
  if (!client) return bad("informe ?client=");
  return Response.json(await clientHistory(client));
}

export async function POST(req: Request) {
  const input = await parseBody(req, usageInput);
  if (input instanceof Response) return input;
  return Response.json(await recordUsage(input));
}
