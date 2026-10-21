import { parseBody } from "@/lib/api";
import { composeBrief } from "@/lib/brief";
import { briefInput } from "@/lib/inputs";
import { clientHistory } from "@/lib/usage";

export async function POST(req: Request) {
  const input = await parseBody(req, briefInput);
  if (input instanceof Response) return input;
  const history = input.client ? (await clientHistory(input.client)).slugs : [];
  return Response.json(composeBrief(input, history));
}
