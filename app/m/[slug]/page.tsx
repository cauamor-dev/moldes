import Link from "next/link";
import { notFound } from "next/navigation";
import { MoldeView, type Panel } from "@/components/molde-view";
import { contrast } from "@/lib/color";
import { demoHeight, toCard } from "@/lib/cards";
import { getMolde } from "@/lib/data";
import { buildDemo } from "@/lib/demo";
import { KIND_LABELS } from "@/lib/labels";
import { moldeToMarkdown } from "@/lib/markdown";
import type { Molde } from "@/lib/schema";
import { formatTokens } from "@/lib/tokens";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const m = getMolde((await params).slug);
  return { title: m?.title ?? "Molde" };
}

function usage(m: Molde): Panel["blocks"] {
  const blocks: Panel["blocks"] = [
    { title: "Quando usar", items: m.when_to_use },
    { title: "Evite quando", items: m.avoid_when },
  ];
  if (m.anti_patterns.length) blocks.push({ title: "Não faça", items: m.anti_patterns });
  if (m.kind === "style") blocks.push({ title: "Assinatura", items: m.signature_moves });
  if (m.kind === "pattern") {
    blocks.push({ title: "Estrutura", items: m.structure });
    blocks.push({ title: "Variações", items: m.variations });
  }
  if (m.kind === "type_pair") {
    const f = (r: string, x: { family: string; weights: number[] }) => `${r}: ${x.family} · pesos ${x.weights.join(", ")} · OFL-1.1`;
    blocks.push({ title: "Fontes", items: [f("Display", m.display), f("Texto", m.text), ...(m.mono ? [f("Mono", m.mono)] : []), `Escala ${m.scale.ratio} · ${m.scale.steps.join(" / ")} px`] });
  }
  if (m.kind === "palette") {
    const r = (label: string, p: typeof m.light) => `${label}: texto ${contrast(p.fg, p.bg).toFixed(1)}:1 · apoio ${contrast(p.muted, p.bg).toFixed(1)}:1 · botão ${contrast(p.accent_fg, p.accent).toFixed(1)}:1`;
    blocks.push({ title: "Contraste (AA)", items: [r("Claro", m.light), r("Escuro", m.dark)] });
  }
  if (m.sectors.length) blocks.push({ title: "Setores", items: [m.sectors.join(", ")] });
  return blocks;
}

export default async function MoldePage({ params }: { params: Promise<{ slug: string }> }) {
  const m = getMolde((await params).slug);
  if (!m) notFound();
  const card = toCard(m);
  const demo = buildDemo(m);

  const panels: Panel[] = [{ id: "uso", label: "Uso", blocks: usage(m) }];
  const css = formatTokens(m, "css");
  if (css) panels.push({ id: "tokens", label: "Tokens", code: [{ label: "CSS", lang: "css", source: css }, { label: "Tailwind v4", lang: "css", source: formatTokens(m, "tailwind")! }, { label: "DTCG", lang: "json", source: formatTokens(m, "dtcg")! }] });
  if (m.kind === "motion" || m.kind === "effect" || m.kind === "component" || m.kind === "pattern") {
    const code = [{ label: "HTML", lang: "html", source: demo.html }, { label: "CSS", lang: "css", source: demo.css }];
    if (m.kind === "pattern") code.push({ label: "Wireframe", lang: "text", source: m.wireframe });
    panels.push({ id: "codigo", label: "Código", code });
  }
  if (m.kind === "motion")
    panels.push({
      id: "motion",
      label: "Motion",
      blocks: [{ title: "Parâmetros", items: [`Gatilho: ${m.trigger}`, `Duração: ${m.duration_ms}ms`, `Easing: ${m.easing}`, `Stagger: ${m.stagger_ms}ms`, `Props: ${m.props.join(", ")}`, `Reduced motion: ${m.reduced_motion}`] }],
      code: [{ label: "React + Motion", lang: "tsx", source: m.snippet }],
    });
  panels.push({ id: "refs", label: "Refs", refs: m.references, blocks: m.component_refs.length ? [{ title: "Componentes (MCP shadcn / Magic UI)", items: m.component_refs }] : [] });
  panels.push({ id: "export", label: "Export" });

  const pairs = m.pairs_with.map((s) => getMolde(s)).filter((x): x is Molde => !!x).map((x) => toCard(x));
  const isPattern = m.kind === "pattern";

  return (
    <main className="wrap pb-24">
      <nav className="flex items-center justify-between py-3">
        <Link href="/" className="tap -ml-2 gap-2 px-2 text-sm text-paper-dim hover:text-paper">
          ← Catálogo
        </Link>
        <Link href={`/brief?slugs=${m.slug}`} className="btn">
          Usar no brief
        </Link>
      </nav>
      <header className="grid gap-x-10 gap-y-3 pt-2 pb-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:items-end">
        <div>
          <p className="meta">
            Nº {String(card.n).padStart(3, "0")} · {KIND_LABELS[m.kind]}
            {m.category ? ` · ${m.category}` : ""} · ousadia {m.boldness}/5
          </p>
          <h1 className="mt-2 font-display text-[44px] leading-[0.9] tracking-[-0.01em] md:text-[76px]">{m.title}</h1>
        </div>
        <p className="max-w-[46ch] text-[15px] leading-relaxed text-paper-dim">{m.summary}</p>
      </header>
      <MoldeView
        slug={m.slug}
        title={m.title}
        height={demoHeight(m)}
        hover={!!m.demo?.hover}
        virtualWidth={isPattern ? 1040 : 340}
        maxScale={isPattern ? 1.2 : 1.9}
        panels={panels}
        markdown={moldeToMarkdown(m)}
        tokensCss={css}
        pairs={pairs}
        tags={m.tags}
      />
    </main>
  );
}
