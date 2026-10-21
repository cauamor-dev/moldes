import Link from "next/link";
import { Feed } from "@/components/feed";
import { allCards } from "@/lib/cards";

export default async function Home({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const cards = allCards();
  return (
    <main>
      <header className="wrap grid grid-cols-[1fr_auto] items-end gap-x-6 pt-6 pb-4 md:grid-cols-[minmax(0,7fr)_minmax(0,3fr)_auto] md:pt-10">
        <h1 className="font-display text-[56px] leading-[0.85] tracking-[-0.02em] md:text-[96px]">
          Moldes<span className="text-violet italic">.</span>
        </h1>
        <Link href="/brief" className="btn btn-accent md:order-3">
          Montar brief
        </Link>
        <p className="col-span-2 mt-3 max-w-[34ch] text-[15px] leading-snug text-paper-dim md:order-2 md:col-span-1 md:mt-0">
          Catálogo de direção de design. Role, roube a ideia, copie o token. <span className="meta whitespace-nowrap">{cards.length} itens · ed. 2026</span>
        </p>
      </header>
      <Feed cards={cards} initialTab={tab ?? "tudo"} />
    </main>
  );
}
