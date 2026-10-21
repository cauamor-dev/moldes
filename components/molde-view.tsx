"use client";

import Link from "next/link";
import { useState } from "react";
import type { Card } from "@/lib/cards";
import { KIND_LABELS } from "@/lib/labels";
import { copyText, downloadText } from "./copy";
import { DemoFrame } from "./demo-frame";

type Ref = { title: string; url: string; author: string; license: string };
type Code = { label: string; lang: string; source: string };
export type Panel = { id: string; label: string; blocks?: { title: string; items: string[] }[]; code?: Code[]; refs?: Ref[] };

type Props = {
  slug: string;
  title: string;
  height: number;
  hover: boolean;
  virtualWidth: number;
  maxScale: number;
  panels: Panel[];
  markdown: string;
  tokensCss: string | null;
  pairs: Card[];
  tags: string[];
};

async function designMd(slugs: string[], name: string) {
  const r = await fetch("/api/v1/design-md", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slugs, name }) });
  if (!r.ok) throw new Error(await r.text());
  return r.text();
}

export function CodeBlock({ code }: { code: Code }) {
  return (
    <figure className="grid gap-2">
      <figcaption className="flex items-center justify-between">
        <span className="meta">{code.label}</span>
        <button className="btn h-9 min-h-9 px-3 text-xs" onClick={() => copyText(code.source, `${code.label} copiado`)}>
          Copiar
        </button>
      </figcaption>
      <pre className="code max-h-[28rem]">
        <code>{code.source}</code>
      </pre>
    </figure>
  );
}

export function MoldeView(p: Props) {
  const [active, setActive] = useState(p.panels[0]!.id);
  const [simHover, setSimHover] = useState(false);
  const [busy, setBusy] = useState(false);
  const panel = p.panels.find((x) => x.id === active)!;

  const withMd = async (fn: (md: string) => void) => {
    setBusy(true);
    try {
      fn(await designMd([p.slug], p.title));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-start">
      <section aria-label="Demonstração" className="lg:sticky lg:top-4">
        <div className="mx-auto" style={{ maxWidth: p.virtualWidth * p.maxScale }}>
          <DemoFrame slug={p.slug} title={p.title} height={p.height} hover={p.hover} live virtualWidth={p.virtualWidth} maxScale={p.maxScale} hovering={p.hover ? simHover : undefined} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {p.hover && (
            <button className="btn" aria-pressed={simHover} onClick={() => setSimHover((v) => !v)}>
              {simHover ? "Tirar hover" : "Simular hover"}
            </button>
          )}
          <a className="btn" href={`/demo/${p.slug}?live`} target="_blank" rel="noreferrer">
            Abrir demo ↗
          </a>
          <span className="meta ml-auto">{p.tags.join(" · ")}</span>
        </div>
      </section>

      <section aria-label="Detalhes" className="min-w-0">
        <div role="tablist" aria-label="Seções do molde" className="tabs -mx-3.5 border-b border-line">
          {p.panels.map((x) => (
            <button key={x.id} role="tab" id={`tab-${x.id}`} aria-controls="panel" aria-selected={active === x.id} className="tab" onClick={() => setActive(x.id)}>
              {x.label}
            </button>
          ))}
        </div>
        <div id="panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="grid gap-7 pt-6">
          {panel.blocks?.map((b) => (
            <div key={b.title}>
              <h3 className="meta mb-2">{b.title}</h3>
              <ul className="grid gap-1.5 text-[15px] leading-snug">
                {b.items.map((i) => (
                  <li key={i} className="border-l-2 border-line pl-3">
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {panel.code?.map((c) => <CodeBlock key={c.label} code={c} />)}
          {panel.refs && (
            <div>
              <h3 className="meta mb-2">Referências (só link)</h3>
              {panel.refs.length ? (
                <ul className="grid gap-2 text-[15px]">
                  {panel.refs.map((r) => (
                    <li key={r.url}>
                      <a href={r.url} target="_blank" rel="noreferrer" className="underline decoration-line underline-offset-4 hover:decoration-paper">
                        {r.title}
                      </a>
                      <span className="text-paper-dim"> · {r.author} · {r.license}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-paper-dim">Conteúdo próprio, sem referência externa.</p>
              )}
            </div>
          )}
          {active === "export" && (
            <div className="grid gap-3">
              <p className="text-[15px] text-paper-dim">DESIGN.md (formato Google Stitch) completa o molde com os pares sugeridos para virar uma direção inteira.</p>
              <div className="flex flex-wrap gap-2">
                <button className="btn btn-accent" disabled={busy} onClick={() => withMd((md) => copyText(md, "DESIGN.md copiado"))}>
                  Copiar DESIGN.md
                </button>
                <button className="btn" disabled={busy} onClick={() => withMd((md) => downloadText(md, "DESIGN.md"))}>
                  Baixar DESIGN.md
                </button>
                <button className="btn" onClick={() => copyText(p.markdown, "Markdown copiado")}>
                  Copiar molde (.md)
                </button>
                {p.tokensCss && (
                  <button className="btn" onClick={() => copyText(p.tokensCss!, "Tokens copiados")}>
                    Copiar tokens
                  </button>
                )}
                <button className="btn" onClick={() => copyText(`get_molde({ slug: "${p.slug}" })`, "Chamada MCP copiada")}>
                  Copiar chamada MCP
                </button>
              </div>
            </div>
          )}
        </div>

        {p.pairs.length > 0 && (
          <div className="mt-12">
            <h3 className="meta mb-3">Combina com</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {p.pairs.map((c) => (
                <Link key={c.slug} href={`/m/${c.slug}`} className="card-link">
                  <DemoFrame slug={c.slug} title={c.title} height={Math.min(c.height, 260)} />
                  <p className="pt-2 text-sm leading-tight">{c.title}</p>
                  <p className="meta pt-0.5 text-[10px]">{KIND_LABELS[c.kind]}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
