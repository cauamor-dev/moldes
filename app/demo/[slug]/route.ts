import { getMolde } from "@/lib/data";
import { demoDocument } from "@/lib/demo";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const m = getMolde((await params).slug);
  if (!m) return new Response("not found", { status: 404 });
  const interactive = new URL(req.url).searchParams.has("live");
  return new Response(demoDocument(m, { interactive }), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "private, max-age=3600",
      "content-security-policy": "default-src 'none'; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src data:; frame-ancestors 'self'",
    },
  });
}
