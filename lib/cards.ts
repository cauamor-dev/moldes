import { buildDemo } from "./demo";
import { moldes } from "./data";
import type { Kind, Molde } from "./schema";

export const FRAME_WIDTH = 340;

export type Card = { slug: string; n: number; kind: Kind; title: string; category?: string; height: number; hover: boolean; boldness: number; sectors: string[] };

const DEFAULT_HEIGHT: Partial<Record<Kind, number>> = { style: 300, type_pair: 270, palette: 210 };

export function demoHeight(m: Molde): number {
  return m.demo?.height ?? DEFAULT_HEIGHT[m.kind] ?? 220;
}

export function catalogNumber(slug: string): number {
  return moldes.findIndex((m) => m.slug === slug) + 1;
}

export function toCard(m: Molde, i = catalogNumber(m.slug) - 1): Card {
  return { slug: m.slug, n: i + 1, kind: m.kind, title: m.title, category: m.category, height: demoHeight(m), hover: !!m.demo?.hover, boldness: m.boldness, sectors: m.sectors };
}

export const allCards = (): Card[] => moldes.map((m, i) => toCard(m, i));

export function hasCode(m: Molde): boolean {
  return !!buildDemo(m).html && (m.kind === "effect" || m.kind === "component" || m.kind === "pattern" || m.kind === "motion");
}
