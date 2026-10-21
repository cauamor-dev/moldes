export function normalize(s: string): string {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export function estimateTokens(s: string): number {
  return Math.ceil(s.length / 4);
}
