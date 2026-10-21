import { llmsTxt } from "@/lib/llms";

export function GET(req: Request) {
  return new Response(llmsTxt(new URL(req.url).origin), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
