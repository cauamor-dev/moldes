import { parseBody } from "@/lib/api";
import { exportDesignMd } from "@/lib/design-md";
import { designMdInput } from "@/lib/inputs";

export async function POST(req: Request) {
  const input = await parseBody(req, designMdInput);
  if (input instanceof Response) return input;
  const md = exportDesignMd(input);
  const download = new URL(req.url).searchParams.has("download");
  return new Response(md, {
    headers: { "content-type": "text/markdown; charset=utf-8", ...(download ? { "content-disposition": 'attachment; filename="DESIGN.md"' } : {}) },
  });
}
