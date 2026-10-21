import { Redis } from "@upstash/redis";

export type UsageEntry = { client: string; project: string; slugs: string[]; at: string };

const MAX = 200;
let redis: Redis | null | undefined;

function client(): Redis | null {
  if (redis !== undefined) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  redis = url && token ? new Redis({ url, token }) : null;
  return redis;
}

export const usageEnabled = () => client() !== null;
const key = (c: string) => `moldes:usage:${c.trim().toLowerCase()}`;

export async function recordUsage(entry: Omit<UsageEntry, "at">): Promise<{ status: "ok" | "desativado"; entry?: UsageEntry }> {
  const r = client();
  if (!r) return { status: "desativado" };
  const full: UsageEntry = { ...entry, at: new Date().toISOString() };
  await r.lpush(key(entry.client), JSON.stringify(full));
  await r.ltrim(key(entry.client), 0, MAX - 1);
  return { status: "ok", entry: full };
}

export async function clientHistory(name: string): Promise<{ status: "ok" | "desativado"; entries: UsageEntry[]; slugs: string[] }> {
  const r = client();
  if (!r) return { status: "desativado", entries: [], slugs: [] };
  const raw = await r.lrange<UsageEntry | string>(key(name), 0, MAX - 1);
  const entries = raw.map((e) => (typeof e === "string" ? (JSON.parse(e) as UsageEntry) : e));
  return { status: "ok", entries, slugs: [...new Set(entries.flatMap((e) => e.slugs))] };
}
