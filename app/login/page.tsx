export const metadata = { title: "Entrar" };

export default async function Login({ searchParams }: { searchParams: Promise<{ erro?: string; next?: string }> }) {
  const { erro, next } = await searchParams;
  return (
    <main className="wrap grid min-h-dvh content-center gap-10 py-12 md:grid-cols-[1.2fr_1fr] md:items-end">
      <h1 className="font-display text-[64px] leading-[0.85] md:text-[120px]">
        Moldes<span className="text-violet italic">.</span>
        <span className="mt-4 block font-sans text-base leading-snug text-paper-dim md:text-lg">Arquivo pessoal. Precisa do token para abrir a gaveta.</span>
      </h1>
      <form method="post" action="/api/login" className="grid gap-3 md:max-w-sm">
        <input type="hidden" name="next" value={next ?? "/"} />
        <label htmlFor="token" className="meta">
          Token de acesso
        </label>
        <input id="token" name="token" type="password" autoComplete="current-password" required className="field" aria-invalid={!!erro} aria-describedby={erro ? "erro" : undefined} />
        {erro && (
          <p id="erro" role="alert" className="text-sm text-[oklch(0.75_0.16_25)]">
            Token não confere.
          </p>
        )}
        <button className="btn btn-solid justify-center">Entrar</button>
      </form>
    </main>
  );
}
