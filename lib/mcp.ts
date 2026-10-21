import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { composeBrief } from "./brief";
import { getMolde, searchMoldes, summarize, taxonomy } from "./data";
import { exportDesignMd } from "./design-md";
import { moldeToMarkdown } from "./markdown";
import { KINDS } from "./schema";
import { formatTokens } from "./tokens";
import { clientHistory, recordUsage } from "./usage";

const text = (t: string) => ({ content: [{ type: "text" as const, text: t }] });
const json = (v: unknown) => text(JSON.stringify(v, null, 2));
const fail = (t: string) => ({ ...text(t), isError: true });

const briefShape = {
  goal: z.string().min(2).describe("O que vai ser construído, ex.: 'landing de clínica odontológica'"),
  sector: z.string().optional(),
  boldness: z.number().int().min(1).max(5).optional(),
  slugs: z.array(z.string()).optional().describe("Moldes que devem entrar obrigatoriamente"),
  client: z.string().optional().describe("Cliente; evita moldes do histórico se o log estiver ativo"),
};

export const TOOL_NAMES = [
  "search_moldes", "get_molde", "list_taxonomy", "compose_style_brief", "export_design_md", "get_tokens", "record_usage", "get_client_history",
] as const;

export function createMoldesServer() {
  const server = new McpServer({ name: "moldes", version: "1.0.0" });

  server.registerTool("search_moldes", {
    description: "Busca moldes de design (estilos, fontes, paletas, animações, telas, efeitos, componentes). Retorna lista enxuta.",
    inputSchema: { query: z.string().default(""), kind: z.enum(KINDS).optional(), tags: z.array(z.string()).optional(), limit: z.number().int().min(1).max(50).default(8) },
  }, async ({ query, kind, tags, limit }) => json(searchMoldes({ query, kind, tags, limit }).map(summarize)));

  server.registerTool("get_molde", {
    description: "Retorna um molde completo por slug, em JSON ou Markdown.",
    inputSchema: { slug: z.string(), format: z.enum(["json", "md"]).default("md") },
  }, async ({ slug, format }) => {
    const m = getMolde(slug);
    if (!m) return fail(`molde não encontrado: ${slug}`);
    return format === "json" ? json(m) : text(moldeToMarkdown(m));
  });

  server.registerTool("list_taxonomy", {
    description: "Lista tipos, categorias, tags, setores e níveis de ousadia com contagens.",
    inputSchema: {},
  }, async () => json(taxonomy()));

  server.registerTool("compose_style_brief", {
    description: "Monta um brief de design (≤ 1.500 tokens) combinando estilo, fontes, paleta, motion e seções, respeitando pairs_with e evitando o histórico do cliente.",
    inputSchema: briefShape,
  }, async (input) => {
    const history = input.client ? (await clientHistory(input.client)).slugs : [];
    return text(composeBrief(input, history).text);
  });

  server.registerTool("export_design_md", {
    description: "Gera um DESIGN.md (formato Google Stitch: front matter YAML + seções) a partir de slugs ou de um brief.",
    inputSchema: { slugs: z.array(z.string()).optional(), brief: z.object(briefShape).optional(), name: z.string().optional() },
  }, async ({ slugs, brief, name }) => {
    if (!slugs?.length && !brief) return fail("informe slugs ou brief");
    return text(exportDesignMd({ slugs, brief, name }));
  });

  server.registerTool("get_tokens", {
    description: "Tokens de um molde em DTCG (JSON), CSS custom properties ou Tailwind v4 (@theme).",
    inputSchema: { slug: z.string(), format: z.enum(["dtcg", "css", "tailwind"]).default("dtcg") },
  }, async ({ slug, format }) => {
    const m = getMolde(slug);
    if (!m) return fail(`molde não encontrado: ${slug}`);
    const out = formatTokens(m, format);
    return out ? text(out) : fail(`o molde ${slug} (${m.kind}) não tem tokens; use get_molde para o código`);
  });

  server.registerTool("record_usage", {
    description: "Registra que um cliente/projeto usou certos moldes. Responde 'desativado' se o log não estiver configurado.",
    inputSchema: { client: z.string().min(1), project: z.string().min(1), slugs: z.array(z.string()).min(1) },
  }, async (input) => json(await recordUsage(input)));

  server.registerTool("get_client_history", {
    description: "Histórico de moldes usados por um cliente.",
    inputSchema: { client: z.string().min(1) },
  }, async ({ client }) => json(await clientHistory(client)));

  return server;
}
