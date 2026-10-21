import type { AuthorizeParams } from "./oauth";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function consentPage(o: { params: AuthorizeParams; clientName: string; nonce: string; needsToken: boolean; error?: string }): string {
  const host = new URL(o.params.redirect_uri).host || o.params.redirect_uri;
  const hidden = Object.entries(o.params)
    .map(([k, v]) => `<input type="hidden" name="${k}" value="${esc(v)}">`)
    .join("");
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Autorizar acesso · Moldes</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
:root{--ink:oklch(0.165 0.006 285);--ink2:oklch(0.205 0.007 285);--line:oklch(0.33 0.008 285);--paper:oklch(0.94 0.012 85);--dim:oklch(0.76 0.01 85);--violet:oklch(0.75 0.15 295);--vink:oklch(0.17 0.03 295);color-scheme:dark}
*{box-sizing:border-box}body{margin:0;min-height:100dvh;background:var(--ink);color:var(--paper);font:400 16px/1.5 "Instrument Sans",system-ui,sans-serif;display:grid;align-content:center;padding:32px 16px}
main{width:100%;max-width:960px;margin:0 auto;display:grid;gap:40px}
@media(min-width:800px){main{grid-template-columns:1.1fr 1fr;align-items:end}}
h1{font:400 64px/.85 "Instrument Serif",serif;margin:0}h1 i{color:var(--violet)}
.meta{font:500 11px "JetBrains Mono",monospace;letter-spacing:.06em;text-transform:uppercase;color:var(--dim)}
p{margin:12px 0 0;color:var(--dim);max-width:40ch}b{color:var(--paper);font-weight:600}
form{display:grid;gap:12px}
.card{border:1px solid var(--line);border-radius:14px;padding:16px;background:var(--ink2);display:grid;gap:6px}
.host{font:500 14px "JetBrains Mono",monospace;word-break:break-all}
input[type=password]{min-height:48px;width:100%;padding:0 14px;border-radius:12px;border:1px solid var(--line);background:var(--ink2);color:var(--paper);font-size:16px}
input[type=password]:focus{outline:none;border-color:var(--violet)}
.row{display:flex;gap:8px}button{min-height:48px;flex:1;border-radius:999px;font:600 15px "Instrument Sans",sans-serif;cursor:pointer;border:1px solid var(--line);background:transparent;color:var(--paper)}
button.ok{background:var(--violet);border-color:var(--violet);color:var(--vink)}
:focus-visible{outline:2px solid var(--violet);outline-offset:2px}
.err{color:oklch(0.75 0.16 25);margin:0}
</style></head><body><main>
<div><h1>Moldes<i>.</i></h1><p><b>${esc(o.clientName)}</b> quer ler o catálogo e montar briefs pelo MCP. Ele não vê seu token: recebe uma chave própria que dura 90 dias e pode ser revogada trocando o MOLDES_TOKEN.</p></div>
<form method="post" action="/oauth/authorize">
<div class="card"><span class="meta">Vai devolver o acesso para</span><span class="host">${esc(host)}</span></div>
${hidden}<input type="hidden" name="nonce" value="${esc(o.nonce)}">
${o.needsToken ? `<label class="meta" for="token">Token do Moldes (só desta vez)</label><input id="token" name="token" type="password" autocomplete="current-password" required autofocus>` : `<p style="margin:0">Você já está logado neste navegador.</p>`}
${o.error ? `<p class="err" role="alert">${esc(o.error)}</p>` : ""}
<div class="row"><button type="submit" name="action" value="deny">Cancelar</button><button class="ok" type="submit" name="action" value="approve">Autorizar</button></div>
</form></main></body></html>`;
}

export function errorPage(message: string): string {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Erro · Moldes</title>
<style>body{margin:0;min-height:100dvh;display:grid;place-content:center;padding:16px;background:oklch(0.165 0.006 285);color:oklch(0.94 0.012 85);font:16px/1.5 system-ui,sans-serif}</style></head>
<body><main><h1 style="font-weight:500">Não deu para autorizar</h1><p>${esc(message)}</p></main></body></html>`;
}
