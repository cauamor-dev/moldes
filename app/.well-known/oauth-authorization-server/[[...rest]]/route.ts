import { json, preflight } from "@/lib/cors";
import { authorizationServerMetadata, origin } from "@/lib/oauth";

export const GET = (req: Request) => json(authorizationServerMetadata(origin(req)));
export const OPTIONS = preflight;
