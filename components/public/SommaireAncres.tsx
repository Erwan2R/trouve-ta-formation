const pastille =
  "whitespace-nowrap rounded-full border border-line px-3.5 py-2 text-[13.5px] font-semibold text-ink-600 hover:border-ink-900 hover:text-ink-900";
const principale =
  "whitespace-nowrap rounded-full border border-ink-900 bg-ink-900 px-3.5 py-2 text-[13.5px] font-bold text-white hover:border-brique-700 hover:bg-brique-700 hover:text-white";

/** Table des matières en ancres dures (piliers, démarches). Collante sous le header du site sur desktop. */
export function SommaireAncres({ ancres }: { ancres: { id: string; libelle: string; principale?: boolean }[] }) {
  return (
    <nav
      aria-label="Sur cette page"
      className="z-30 border-b border-line bg-white/94 backdrop-blur-md lg:sticky lg:top-[var(--header-h)]"
    >
      <div className="container-public flex flex-wrap items-center gap-2 py-[11px]">
        <span className="mr-1.5 font-mono text-[10.5px] tracking-[0.12em] text-ink-400 uppercase">Sur cette page</span>
        {ancres.map((a) => (
          <a key={a.id} href={`#${a.id}`} className={a.principale ? principale : pastille}>
            {a.libelle}
          </a>
        ))}
      </div>
    </nav>
  );
}
