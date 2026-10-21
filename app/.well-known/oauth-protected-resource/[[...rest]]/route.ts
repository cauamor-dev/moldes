import { json, preflight } from "@/lib/cors";
import { origin, protectedResourceMetadata } from "@/lib/oauth";

export const GET = (req: Request) => json(protectedResourceMetadata(origin(req)));
export const OPTIONS = preflight;
