import Link from "next/link";
import { BriefComposer } from "@/components/brief-composer";
import { allCards } from "@/lib/cards";

export const metadata = { title: "Brief" };

export default async function BriefPage({ searchParams }: { searchParams: Promise<{ slugs?: string }> }) {
  const { slugs } = await searchParams;
  const cards = allCards();
  const initial = (slugs ?? "").split(",").filter((s) => cards.some((c) => c.slug === s));
  return (
    <main className="wrap pb-24">
      <nav className="py-3">
        <Link href="/" className="tap -ml-2 px-2 text-sm text-paper-dim hover:text-paper">
          ← Catálogo
        </Link>
      </nav>
      <header className="grid gap-3 pb-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:items-end">
        <h1 className="font-display text-[48px] leading-[0.9] md:text-[84px]">
          Compositor <span className="text-violet italic">de brief</span>
        </h1>
        <p className="max-w-[44ch] text-[15px] leading-relaxed text-paper-dim">Diga o que vai construir. Escolha moldes ou deixe sugerir: sai um brief de até 1.500 tokens, um DESIGN.md e os tokens mesclados.</p>
      </header>
      <BriefComposer cards={cards} initial={initial} />
    </main>
  );
}
