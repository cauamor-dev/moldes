import { contrast } from "./color";
import { googleFontsHref } from "./fonts";
import type { Molde, MoldeOf, PaletteRoles } from "./schema";
import { cssValue, flatten } from "./tokens";

const BASE_FONTS = ["Instrument Sans", "JetBrains Mono"];

const THEME = {
  light: "--bg:oklch(0.97 0.008 85);--surface:oklch(0.995 0.003 85);--fg:oklch(0.2 0.01 60);--muted:oklch(0.46 0.012 60);--accent:oklch(0.52 0.2 295);--accent-fg:oklch(0.99 0 0);--line:oklch(0.87 0.01 80)",
  dark: "--bg:oklch(0.17 0.005 280);--surface:oklch(0.22 0.006 280);--fg:oklch(0.95 0.004 280);--muted:oklch(0.72 0.01 280);--accent:oklch(0.74 0.16 295);--accent-fg:oklch(0.15 0.02 295);--line:oklch(0.32 0.008 280)",
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

type Built = { html: string; css: string; fonts: string[]; dark?: boolean; scale?: boolean };

function styleDemo(m: MoldeOf<"style">): Built {
  const vars = flatten(m.tokens).map(([p, t]) => `--t-${p.join("-")}:${cssValue(t)}`).join(";");
  const fam = (k: string) => {
    const leaf = (m.tokens.font as Record<string, { $value: unknown }> | undefined)?.[k]?.$value;
    return Array.isArray(leaf) ? String(leaf[0]) : String(leaf ?? "");
  };
  const upper = (m.tokens.font as Record<string, { $value: unknown }> | undefined)?.uppercase?.$value === 1;
  return {
    fonts: [fam("display"), fam("text"), fam("mono")],
    html: `<div class="s"><small>${esc(m.category ?? "estilo")} · ousadia ${m.boldness}/5</small><h1>${esc(m.title)}</h1><p>${esc(m.summary)}</p><div class="row"><button>Começar</button><span class="ln">Saiba mais</span></div><div class="sw"><i style="background:var(--t-color-fg)"></i><i style="background:var(--t-color-accent)"></i><i style="background:var(--t-color-surface)"></i><i style="background:var(--t-color-muted)"></i></div><div class="mo"><b></b></div></div>`,
    css: `.s{${vars};background:var(--t-color-bg);color:var(--t-color-fg);height:100vh;box-sizing:border-box;padding:18px;display:flex;flex-direction:column;gap:10px;font-family:var(--t-font-text)}
.s small{font:500 10px var(--t-font-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--t-color-muted)}
.s h1{font-family:var(--t-font-display);font-weight:var(--t-font-display-weight);font-size:31px;line-height:.95;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;letter-spacing:calc(var(--t-font-tracking) * 1em);margin:0;${upper ? "text-transform:uppercase;" : ""}}
.s p{margin:0;font-size:13px;line-height:1.45;color:var(--t-color-muted);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.row{display:flex;gap:12px;align-items:center}.s button{font:600 13px var(--t-font-text);padding:10px 16px;background:var(--t-color-accent);color:var(--t-color-accent-fg);border:var(--t-border-width) solid var(--t-color-border);border-radius:var(--t-radius-md);box-shadow:var(--t-shadow-card)}
.ln{font-size:13px;text-decoration:underline;text-underline-offset:3px}
.sw{display:flex;gap:6px;margin-top:auto}.sw i{flex:1;height:22px;border-radius:var(--t-radius-sm);border:1px solid var(--t-color-border)}
.mo{height:4px;background:var(--t-color-surface);border-radius:2px;overflow:hidden}.mo b{display:block;height:100%;width:35%;background:var(--t-color-accent);animation:mv calc(var(--t-motion-duration) * 4 + 600ms) var(--t-motion-ease) infinite alternate}
@keyframes mv{to{transform:translateX(190%)}}`,
  };
}

function typeDemo(m: MoldeOf<"type_pair">): Built {
  const mono = m.mono?.family ?? "JetBrains Mono";
  return {
    fonts: [m.display.family, m.text.family, mono],
    html: `<div class="tp"><div class="aa"><span>Aa</span><small>${esc(m.display.family)}<br>${esc(m.text.family)}</small></div><h1>${esc(m.sample.headline)}</h1><p>${esc(m.sample.body)}</p><code>escala ${m.scale.ratio} · base ${m.scale.base_px}px · OFL</code></div>`,
    css: `.tp{padding:18px;height:100vh;box-sizing:border-box;display:flex;flex-direction:column;gap:10px;background:var(--bg);color:var(--fg)}
.aa{display:flex;justify-content:space-between;align-items:flex-start}.aa span{font:${m.display.weights.at(-1)} 54px/0.8 "${m.display.family}";color:var(--accent)}.aa small{font:500 10px/1.4 "${mono}";color:var(--muted);text-align:right}
.tp h1{font:${m.display.weights.at(-1)} 26px/1.02 "${m.display.family}";margin:0;letter-spacing:-.01em}
.tp p{font:${m.text.weights[0]} 13.5px/1.5 "${m.text.family}";margin:0;color:var(--muted)}
.tp code{margin-top:auto;font:500 10px "${mono}";color:var(--muted)}`,
  };
}

function paletteSide(r: PaletteRoles, label: string) {
  const ratio = contrast(r.fg, r.bg).toFixed(1);
  return `<div class="side" style="--b:${r.bg};--s:${r.surface};--f:${r.fg};--m:${r.muted};--a:${r.accent};--af:${r.accent_fg};--d:${r.danger}"><small>${label} · ${ratio}:1</small><b>Título</b><p>Texto de apoio</p><span class="btn">Ação</span><div class="chips"><i style="background:var(--b)"></i><i style="background:var(--s)"></i><i style="background:var(--f)"></i><i style="background:var(--m)"></i><i style="background:var(--a)"></i><i style="background:var(--d)"></i></div></div>`;
}

function paletteDemo(m: MoldeOf<"palette">): Built {
  return {
    fonts: [],
    html: `<div class="pl">${paletteSide(m.light, "claro")}${paletteSide(m.dark, "escuro")}</div>`,
    css: `.pl{display:grid;grid-template-columns:1fr 1fr;height:100vh}
.side{background:var(--b);color:var(--f);padding:14px;display:flex;flex-direction:column;gap:6px;font-family:var(--font)}
.side small{font:500 9.5px var(--mono);color:var(--m);letter-spacing:.04em}.side b{font-size:20px;letter-spacing:-.02em;line-height:1}.side p{margin:0;font-size:12px;color:var(--m)}
.btn{align-self:flex-start;font:600 12px var(--font);padding:7px 12px;border-radius:6px;background:var(--a);color:var(--af)}
.chips{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin-top:auto}.chips i{height:18px;border-radius:4px;box-shadow:inset 0 0 0 1px color-mix(in oklch,var(--f) 18%,transparent);background:var(--s)}`,
  };
}

export function buildDemo(m: Molde): Built {
  if (m.kind === "style" && !m.demo) return styleDemo(m);
  if (m.kind === "type_pair" && !m.demo) return typeDemo(m);
  if (m.kind === "palette" && !m.demo) return paletteDemo(m);
  const d = m.demo!;
  return { html: d.html, css: d.css, fonts: d.fonts, dark: d.dark, scale: m.kind === "pattern" };
}

export function demoDocument(m: Molde, opts: { interactive?: boolean } = {}): string {
  const b = buildDemo(m);
  const href = googleFontsHref([...BASE_FONTS, ...b.fonts]);
  const theme = b.dark ? THEME.dark : THEME.light;
  return `<!doctype html><html lang="pt-BR"${opts.interactive ? "" : ' class="feed"'}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(m.title)}</title>${href ? `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="${href}">` : ""}
<style>:root{${theme};--font:"Instrument Sans",system-ui,sans-serif;--mono:"JetBrains Mono",ui-monospace,monospace;color-scheme:${b.dark ? "dark" : "light"}}
*{box-sizing:border-box}html,body{margin:0;height:100%}body{background:var(--bg);color:var(--fg);font-family:var(--font);overflow:hidden;-webkit-font-smoothing:antialiased}
${b.scale ? "html{font-size:calc(100vw / 52)}" : ""}a{color:inherit;text-decoration:none}button{cursor:pointer}
@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation:none!important;transition:none!important}}
${b.css}</style></head><body>${b.html}</body></html>`;
}
