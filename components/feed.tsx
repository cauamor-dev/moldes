"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Card } from "@/lib/cards";
import { KIND_LABELS, TABS } from "@/lib/labels";
import { DemoFrame } from "./demo-frame";

const BATCH = 16;
const CAPTION = 0.2; // caption height relative to card width, for column balancing

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

// Spread kinds out so "Tudo" never shows five palettes in a row.
function interleave(cards: Card[]): Card[] {
  const groups = new Map<string, Card[]>();
  for (const c of shuffle(cards)) groups.set(c.kind, [...(groups.get(c.kind) ?? []), c]);
  const out: Card[] = [];
  const queues = shuffle([...groups.values()]);
  while (queues.some((q) => q.length)) for (const q of queues) if (q.length) out.push(q.shift()!);
  return out;
}

function columnsFor(width: number) {
  if (width < 640) return 2;
  if (width < 1024) return 3;
  if (width < 1280) return 4;
  return 5;
}

function uniqueBySlug(cards: Card[]): Card[] {
  const seen = new Set<string>();
  return cards.filter((c) => !seen.has(c.slug) && (seen.add(c.slug), true));
}

function readOrder(key: string): string[] | null {
  try {
    const v = sessionStorage.getItem(key);
    return v ? (JSON.parse(v) as string[]) : null;
  } catch {
    return null;
  }
}

function writeOrder(key: string, slugs: string[]) {
  try {
    sessionStorage.setItem(key, JSON.stringify(slugs));
  } catch {}
}

export function Feed({ cards, initialTab }: { cards: Card[]; initialTab: string }) {
  const [tab, setTab] = useState(TABS.some((t) => t.id === initialTab) ? initialTab : "tudo");
  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[] | null>(null);
  const [order, setOrder] = useState<Card[] | null>(null);
  const [count, setCount] = useState(BATCH);
  const [cols, setCols] = useState(0);
  const grid = useRef<HTMLDivElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const tabDef = TABS.find((t) => t.id === tab)!;
  const inTab = useMemo(() => cards.filter((c) => !tabDef.kinds.length || tabDef.kinds.includes(c.kind)), [cards, tabDef]);
  const categories = useMemo(() => {
    if (!tabDef.kinds.length) return [];
    const counts = new Map<string, number>();
    for (const c of inTab) if (c.category) counts.set(c.category, (counts.get(c.category) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name);
  }, [inTab, tabDef]);

  useEffect(() => {
    const key = `moldes:order:${tab}`;
    const saved = readOrder(key);
    const bySlug = new Map(inTab.map((c) => [c.slug, c]));
    const restored = saved?.map((s) => bySlug.get(s)).filter((c): c is Card => !!c);
    const next = restored && restored.length === inTab.length ? restored : tab === "tudo" ? interleave(inTab) : shuffle(inTab);
    writeOrder(key, next.map((c) => c.slug));
    setOrder(next);
    setCount(BATCH);
    setCategory(null);
  }, [tab, inTab]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (tab === "tudo") url.searchParams.delete("tab");
    else url.searchParams.set("tab", tab);
    window.history.replaceState(null, "", url);
  }, [tab]);

  useEffect(() => {
    const q = query.trim();
    if (!q) return setResults(null);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      const kind = tabDef.kinds.length === 1 ? `&kind=${tabDef.kinds[0]}` : "";
      const r = await fetch(`/api/v1/moldes?q=${encodeURIComponent(q)}&limit=200${kind}`, { signal: ctrl.signal }).catch(() => null);
      if (r?.ok) setResults(((await r.json()) as { items: { slug: string }[] }).items.map((i) => i.slug));
    }, 180);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query, tabDef]);

  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setCols(columnsFor(e!.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const base = useMemo(() => {
    if (!order) return [];
    let list = order;
    if (results) {
      const pos = new Map(results.map((s, i) => [s, i]));
      list = list.filter((c) => pos.has(c.slug)).sort((a, b) => pos.get(a.slug)! - pos.get(b.slug)!);
    }
    return uniqueBySlug(category ? list.filter((c) => c.category === category) : list);
  }, [order, results, category]);

  // Each molde appears once; the feed stops at the end of the list.
  const items = useMemo(() => base.slice(0, count), [base, count]);
  const done = items.length > 0 && items.length >= base.length;

  const more = useCallback(() => setCount((c) => c + BATCH), []);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    if (done) return;
    const io = new IntersectionObserver(([e]) => e!.isIntersecting && more(), { rootMargin: "1200px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [more, items.length, done]);

  const columns = useMemo(() => {
    const n = cols || 2;
    const out: { items: Card[]; h: number }[] = Array.from({ length: n }, () => ({ items: [], h: 0 }));
    for (const it of items) {
      const target = out.reduce((min, c) => (c.h < min.h ? c : min), out[0]!);
      target.items.push(it);
      target.h += it.height / 340 + CAPTION;
    }
    return out;
  }, [items, cols]);

  const total = (id: string) => {
    const def = TABS.find((t) => t.id === id)!;
    return def.kinds.length ? cards.filter((c) => def.kinds.includes(c.kind)).length : cards.length;
  };

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-line/70 bg-ink/92 backdrop-blur-md">
        <div className="wrap">
          <div role="tablist" aria-label="Tipos de molde" className="tabs -mx-3.5">
            {TABS.map((t) => (
              <button key={t.id} role="tab" aria-selected={tab === t.id} className="tab" onClick={() => setTab(t.id)}>
                {t.label}
                <small>{total(t.id)}</small>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap grid gap-3 pt-4 pb-3 md:grid-cols-[minmax(0,26rem)_1fr] md:items-center md:gap-6">
        <label className="relative block">
          <span className="sr-only">Buscar moldes</span>
          <input
            type="search"
            className="field pl-10"
            placeholder={`Buscar em ${tabDef.label.toLowerCase()}…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            enterKeyHint="search"
          />
          <svg aria-hidden className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-paper-dim" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="7" cy="7" r="5" />
            <path d="m11 11 3.5 3.5" />
          </svg>
        </label>
        {categories.length > 1 && (
          <div className="tabs gap-2" aria-label="Categorias">
            <button className="chip" aria-pressed={!category} onClick={() => setCategory(null)}>
              todas
            </button>
            {categories.map((c) => (
              <button key={c} className="chip" aria-pressed={category === c} onClick={() => setCategory(category === c ? null : c)}>
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      <div ref={grid} className="wrap pb-24">
        {results && base.length === 0 && <p className="py-16 text-paper-dim">Nada para “{query}”. Tente outra palavra, como “editorial” ou “hover”.</p>}
        <div className="flex items-start gap-3 md:gap-4">
          {columns.map((col, ci) => (
            <div key={ci} className="flex min-w-0 flex-1 flex-col gap-5 md:gap-7">
              {col.items.map((it, i) => (
                <FeedCard key={it.slug} card={it} delay={reduce || count > BATCH ? 0 : Math.min(ci + i * cols, 12) * 0.05} reduce={!!reduce} />
              ))}
            </div>
          ))}
        </div>
        <div ref={sentinel} aria-hidden className="h-px" />
        {done && (
          <p role="status" className="pt-14 text-center">
            <span className="font-display text-3xl italic">Você viu todos os moldes</span>
            <span className="meta mt-2 block">{base.length} {base.length === 1 ? "molde" : "moldes"} · fim</span>
          </p>
        )}
      </div>
    </>
  );
}

function FeedCard({ card, delay, reduce }: { card: Card; delay: number; reduce: boolean }) {
  const [hovering, setHovering] = useState(false);
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0, 0, 1], delay }}
    >
      <Link
        href={`/m/${card.slug}`}
        className="card-link group"
        onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        aria-label={`${card.title}, ${KIND_LABELS[card.kind]}`}
      >
        <DemoFrame slug={card.slug} title={card.title} height={card.height} hover={card.hover} hovering={card.hover ? hovering : undefined} />
        <div className="flex items-baseline justify-between gap-2 px-0.5 pt-2.5">
          <h2 className="truncate text-[15px] leading-tight font-medium">{card.title}</h2>
          <span className="meta shrink-0 text-[10px]">Nº {String(card.n).padStart(3, "0")}</span>
        </div>
        <p className="meta px-0.5 pt-1 text-[10px]">
          {KIND_LABELS[card.kind]}
          {card.category ? ` · ${card.category}` : ""}
        </p>
      </Link>
    </motion.article>
  );
}
