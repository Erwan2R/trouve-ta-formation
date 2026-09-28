const pastille =
  "whitespace-nowrap rounded-full border border-line px-3.5 py-2 text-[13.5px] font-semibold text-ink-600 hover:border-ink-900 hover:text-ink-900";

/** Bloc 3 — ancres en dur, ordre selon le gabarit. Collant sous le header du site (desktop). */
export function SommairePilier({ gabarit }: { gabarit: "A" | "B" }) {
  const ancres =
    gabarit === "A"
      ? [
          ["bloc4", "Ce que ça permet"],
          ["prerequis", "Conditions d'inscription"],
          ["programme", "Programme"],
          ["cout", "Durée et coût"],
        ]
      : [
          ["bloc4", "Quand le suivre"],
          ["cout", "Durée et coût"],
          ["prerequis", "Conditions d'inscription"],
          ["programme", "Programme"],
        ];
  return (
    <nav
      aria-label="Sur cette page"
      className="z-30 border-b border-line bg-white/94 backdrop-blur-md lg:sticky lg:top-[var(--header-h)]"
    >
      <div className="container-public flex flex-wrap items-center gap-2 py-[11px]">
        <span className="mr-1.5 font-mono text-[10.5px] tracking-[0.12em] text-ink-400 uppercase">Sur cette page</span>
        {ancres.map(([id, libelle]) => (
          <a key={id} href={`#${id}`} className={pastille}>
            {libelle}
          </a>
        ))}
        <a
          href="#organismes-titre"
          className="rounded-full border border-ink-900 bg-ink-900 px-3.5 py-2 text-[13.5px] font-bold whitespace-nowrap text-white hover:border-brique-700 hover:bg-brique-700 hover:text-white"
        >
          Les organismes
        </a>
        <a href="#faq" className={pastille}>
          Questions fréquentes
        </a>
      </div>
    </nav>
  );
}
