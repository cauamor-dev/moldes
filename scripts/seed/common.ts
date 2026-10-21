import type { MoldeInput } from "../../lib/schema";

export const ACCESSED = "2026-10-21";
export const OWN = "MIT (conteúdo próprio)";

export function ref(title: string, url: string, author: string, license = "link") {
  return { title, url, author, license, accessed_at: ACCESSED };
}

export const refs = {
  dtcg: ref("Design Tokens Format Module 2025.10", "https://www.designtokens.org/tr/2025.10/format/", "W3C DTCG"),
  oklch: ref("OKLCH in CSS", "https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl", "Evil Martians"),
  wcag: ref("Understanding Contrast (Minimum)", "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html", "W3C WAI"),
  reducedMotion: ref("prefers-reduced-motion", "https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-motion", "MDN", "CC-BY-SA 2.5"),
  motion: ref("Motion for React", "https://motion.dev/docs/react", "Motion", "MIT"),
  shadcn: ref("shadcn/ui", "https://ui.shadcn.com", "shadcn", "MIT"),
  magicui: ref("Magic UI", "https://magicui.design", "Magic UI", "MIT"),
  aceternity: ref("Aceternity UI (só referência)", "https://ui.aceternity.com", "Aceternity", "link"),
  reactbits: ref("React Bits (só referência)", "https://reactbits.dev", "David Haz", "link"),
  swiss: ref("Grid Systems in Graphic Design", "https://en.wikipedia.org/wiki/Josef_M%C3%BCller-Brockmann", "Josef Müller-Brockmann (verbete)", "CC-BY-SA 4.0"),
  brutalist: ref("Brutalist Websites", "https://brutalistwebsites.com", "Pascal Deville"),
  bento: ref("Bento Grids", "https://bentogrids.com", "Bento Grids"),
  googleFonts: ref("Google Fonts", "https://fonts.google.com", "Google", "OFL-1.1 (por família)"),
  ofl: ref("SIL Open Font License", "https://openfontlicense.org", "SIL International", "OFL-1.1"),
  easings: ref("Easing functions", "https://developer.mozilla.org/docs/Web/CSS/easing-function", "MDN", "CC-BY-SA 2.5"),
  viewTransitions: ref("View Transition API", "https://developer.mozilla.org/docs/Web/API/View_Transition_API", "MDN", "CC-BY-SA 2.5"),
  scrollTimeline: ref("Scroll-driven animations", "https://developer.mozilla.org/docs/Web/CSS/CSS_scroll-driven_animations", "MDN", "CC-BY-SA 2.5"),
  backdrop: ref("backdrop-filter", "https://developer.mozilla.org/docs/Web/CSS/backdrop-filter", "MDN", "CC-BY-SA 2.5"),
  noise: ref("Grainy gradients", "https://css-tricks.com/grainy-gradients/", "CSS-Tricks"),
  shadows: ref("Designing beautiful shadows in CSS", "https://www.joshwcomeau.com/css/designing-shadows/", "Josh W. Comeau"),
  laws: ref("Laws of UX", "https://lawsofux.com", "Jon Yablonski"),
  stitch: ref("DESIGN.md (Google Stitch)", "https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/", "Google Labs"),
};

export type Seed = MoldeInput;
