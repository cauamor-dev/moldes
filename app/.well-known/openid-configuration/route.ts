import { json, preflight } from "@/lib/cors";
import { authorizationServerMetadata, origin } from "@/lib/oauth";

// Some clients only probe the OIDC path; serve the same OAuth metadata there.
export const GET = (req: Request) => json(authorizationServerMetadata(origin(req)));
export const OPTIONS = preflight;
