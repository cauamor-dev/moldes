"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Card } from "@/lib/cards";
import { KIND_LABELS } from "@/lib/labels";
import type { TokenTree } from "@/lib/schema";
import { normalize } from "@/lib/text";
import { toCss } from "@/lib/tokens";
import { copyText, downloadText } from "./copy";
import { DemoFrame } from "./demo-frame";

type Result = { text: string; slugs: string[]; tokens: TokenTree; estimated_tokens: number };

export function BriefComposer({ cards, initial }: { cards: Card[]; initial: string[] }) {
  const [goal, setGoal] = useState("");
  const [sector, setSector] = useState("");
  const [client, setClient] = useState("");
  const [boldness, setBoldness] = useState(3);
  const [picked, setPicked] = useState<string[]>(initial);
  const [find, setFind] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const bySlug = useMemo(() => new Map(cards.map((c) => [c.slug, c])), [cards]);
  const matches = useMemo(() => {
    const q = normalize(find.trim());
    if (!q) return [];
    return cards.filter((c) => !picked.includes(c.slug) && normalize(`${c.title} ${c.category ?? ""} ${KIND_LABELS[c.kind]}`).includes(q)).slice(0, 8);
  }, [find, cards, picked]);

  const input = () => ({ goal: goal.trim() || "landing page", sector: sector.trim() || undefined, client: client.trim() || undefined, boldness, slugs: picked });

  async function suggest(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/v1/brief", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input()) });
      if (!r.ok) throw new Error((await r.json()).error ?? "erro");
      setResult(await r.json());
    } catch (err) {
      setError(String(err instanceof Error ? err.message : err));
    } finally {
      setBusy(false);
    }
  }

  async function designMd(action: "copy" | "download") {
    const brief = input();
    const r = await fetch("/api/v1/design-md", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ brief, slugs: result?.slugs ?? picked, name: brief.goal }) });
    const md = await r.text();
    if (action === "copy") copyText(md, "DESIGN.md copiado");
    else downloadText(md, "DESIGN.md");
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:items-start">
      <form onSubmit={suggest} className="grid gap-4 lg:sticky lg:top-4">
        <label className="grid gap-1.5">
          <span className="meta">O que vai construir</span>
          <input className="field" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="landing de clínica odontológica" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1.5">
            <span className="meta">Setor</span>
            <input className="field" value={sector} onChange={(e) => setSector(e.target.value)} placeholder="saúde" />
          </label>
          <label className="grid gap-1.5">
            <span className="meta">Cliente</span>
            <input className="field" value={client} onChange={(e) => setClient(e.target.value)} placeholder="opcional" />
          </label>
        </div>
        <label className="grid gap-1.5">
          <span className="meta">Ousadia · {boldness}/5</span>
          <input type="range" min={1} max={5} value={boldness} onChange={(e) => setBoldness(Number(e.target.value))} className="h-11 accent-violet" />
        </label>
        <div className="grid gap-1.5">
          <label htmlFor="find" className="meta">
            Moldes obrigatórios
          </label>
          <input id="find" className="field" value={find} onChange={(e) => setFind(e.target.value)} placeholder="buscar e adicionar…" autoComplete="off" />
          {matches.length > 0 && (
            <ul className="grid overflow-hidden rounded-xl border border-line">
              {matches.map((c) => (
                <li key={c.slug}>
                  <button type="button" className="flex min-h-11 w-full items-center justify-between px-3 text-left text-sm hover:bg-ink-3" onClick={() => (setPicked((p) => [...p, c.slug]), setFind(""))}>
                    {c.title}
                    <span className="meta text-[10px]">{KIND_LABELS[c.kind]}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {picked.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {picked.map((s) => (
                <button key={s} type="button" className="chip" aria-pressed="true" onClick={() => setPicked((p) => p.filter((x) => x !== s))} aria-label={`Remover ${bySlug.get(s)?.title}`}>
                  {bySlug.get(s)?.title ?? s} ×
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="btn btn-accent justify-center" disabled={busy}>
          {busy ? "Montando…" : picked.length ? "Completar e montar brief" : "Sugerir direção"}
        </button>
        {error && <p role="alert" className="text-sm text-[oklch(0.75_0.16_25)]">{error}</p>}
      </form>

      <section aria-live="polite" className="min-w-0">
        {!result ? (
          <div className="grid min-h-60 place-content-center rounded-2xl border border-dashed border-line p-8 text-center text-paper-dim">O brief aparece aqui.</div>
        ) : (
          <div className="grid gap-6">
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {result.slugs.map((s) => {
                const c = bySlug.get(s);
                if (!c) return null;
                return (
                  <Link key={s} href={`/m/${s}`} className="card-link">
                    <DemoFrame slug={s} title={c.title} height={Math.min(c.height, 240)} />
                    <p className="pt-1.5 text-xs leading-tight">{c.title}</p>
                  </Link>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-accent" onClick={() => copyText(result.text, "Brief copiado")}>
                Copiar brief
              </button>
              <button className="btn" onClick={() => designMd("copy")}>
                Copiar DESIGN.md
              </button>
              <button className="btn" onClick={() => designMd("download")}>
                Baixar DESIGN.md
              </button>
              <button className="btn" onClick={() => copyText(toCss(result.tokens), "Tokens copiados")}>
                Copiar tokens
              </button>
              <span className="meta ml-auto self-center">≈ {result.estimated_tokens} tokens</span>
            </div>
            <pre className="code max-h-[70vh] whitespace-pre-wrap">{result.text}</pre>
          </div>
        )}
      </section>
    </div>
  );
}
