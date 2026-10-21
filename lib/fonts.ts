// Every family here is published on Google Fonts under SIL OFL 1.1.
// `weights` lists what we request, not everything the family ships.
export const FONT_CATALOG: Record<string, { weights: number[]; italic?: boolean }> = {
  "Abril Fatface": { weights: [400] },
  "Albert Sans": { weights: [400, 600, 800] },
  Anybody: { weights: [400, 700, 900] },
  Archivo: { weights: [400, 600, 800] },
  "Archivo Black": { weights: [400] },
  "Atkinson Hyperlegible": { weights: [400, 700] },
  Barlow: { weights: [400, 600] },
  "Barlow Condensed": { weights: [500, 700, 800] },
  "Bebas Neue": { weights: [400] },
  "Big Shoulders Display": { weights: [600, 800, 900] },
  Bitter: { weights: [400, 700] },
  "Bodoni Moda": { weights: [400, 600, 800], italic: true },
  "Bricolage Grotesque": { weights: [400, 600, 700, 800] },
  Caveat: { weights: [500, 700] },
  "Chivo Mono": { weights: [400, 600] },
  Commissioner: { weights: [400, 600, 800] },
  "Cormorant Garamond": { weights: [400, 500, 600], italic: true },
  "Courier Prime": { weights: [400, 700] },
  "DM Mono": { weights: [400, 500] },
  "DM Sans": { weights: [400, 600, 700] },
  "DM Serif Display": { weights: [400], italic: true },
  "EB Garamond": { weights: [400, 600], italic: true },
  Epilogue: { weights: [400, 600, 800] },
  "Familjen Grotesk": { weights: [400, 600, 700] },
  Figtree: { weights: [400, 600, 800] },
  "Fragment Mono": { weights: [400] },
  Fraunces: { weights: [400, 600, 800], italic: true },
  Geist: { weights: [400, 600, 700] },
  "Geist Mono": { weights: [400, 600] },
  Gloock: { weights: [400] },
  "Hanken Grotesk": { weights: [300, 400, 600] },
  "IBM Plex Mono": { weights: [400, 600, 700] },
  "IBM Plex Sans": { weights: [400, 600] },
  "IBM Plex Serif": { weights: [400, 600], italic: true },
  "Instrument Sans": { weights: [400, 500, 600, 700] },
  "Instrument Serif": { weights: [400], italic: true },
  "JetBrains Mono": { weights: [400, 600, 700] },
  Karla: { weights: [400, 600, 700] },
  "Krona One": { weights: [400] },
  Lexend: { weights: [400, 600] },
  "Libre Caslon Display": { weights: [400] },
  "Libre Caslon Text": { weights: [400, 700], italic: true },
  "Libre Franklin": { weights: [400, 600, 800] },
  Literata: { weights: [400, 600], italic: true },
  "Major Mono Display": { weights: [400] },
  Manrope: { weights: [400, 600, 800] },
  "Martian Mono": { weights: [400, 600] },
  Newsreader: { weights: [400, 600], italic: true },
  Onest: { weights: [400, 600, 800] },
  Outfit: { weights: [400, 600, 800] },
  "Playfair Display": { weights: [400, 700, 900], italic: true },
  "Plus Jakarta Sans": { weights: [400, 600, 800] },
  "Red Hat Display": { weights: [400, 700, 900] },
  "Red Hat Mono": { weights: [400, 600] },
  "Rethink Sans": { weights: [400, 600, 800] },
  "Rozha One": { weights: [400] },
  "Schibsted Grotesk": { weights: [400, 600, 700, 800] },
  "Shippori Mincho": { weights: [400, 500, 700] },
  Shrikhand: { weights: [400] },
  Silkscreen: { weights: [400, 700] },
  Sora: { weights: [400, 600, 800] },
  "Space Mono": { weights: [400, 700] },
  Spectral: { weights: [400, 600], italic: true },
  Syne: { weights: [400, 600, 800] },
  "Tenor Sans": { weights: [400] },
  Unbounded: { weights: [400, 600, 800] },
  VT323: { weights: [400] },
  "Work Sans": { weights: [400, 600, 800] },
  "Young Serif": { weights: [400] },
  "Zen Kaku Gothic New": { weights: [400, 500, 700] },
  "Zilla Slab": { weights: [400, 600, 700] },
};

export function googleFontsHref(families: string[]): string | null {
  const unique = [...new Set(families)].filter((f) => FONT_CATALOG[f]);
  if (!unique.length) return null;
  const params = unique.map((family) => {
    const { weights, italic } = FONT_CATALOG[family]!;
    const name = family.replace(/ /g, "+");
    if (italic) {
      const axes = [...weights.map((w) => `0,${w}`), ...weights.map((w) => `1,${w}`)].join(";");
      return `family=${name}:ital,wght@${axes}`;
    }
    return `family=${name}:wght@${weights.join(";")}`;
  });
  return `https://fonts.googleapis.com/css2?${params.join("&")}&display=swap`;
}

const SERIF = new Set([
  "Abril Fatface", "Bitter", "Bodoni Moda", "Cormorant Garamond", "DM Serif Display", "EB Garamond", "Fraunces", "Gloock", "IBM Plex Serif",
  "Instrument Serif", "Libre Caslon Display", "Libre Caslon Text", "Literata", "Newsreader", "Playfair Display", "Rozha One", "Shippori Mincho",
  "Spectral", "Young Serif", "Zilla Slab",
]);
const MONO = new Set(["Chivo Mono", "Courier Prime", "DM Mono", "Fragment Mono", "Geist Mono", "IBM Plex Mono", "JetBrains Mono", "Martian Mono", "Red Hat Mono", "Space Mono", "VT323", "Major Mono Display"]);
const HAND = new Set(["Caveat"]);

export function genericFamily(family: string): string {
  if (SERIF.has(family)) return "serif";
  if (MONO.has(family)) return "monospace";
  if (HAND.has(family)) return "cursive";
  return "sans-serif";
}
