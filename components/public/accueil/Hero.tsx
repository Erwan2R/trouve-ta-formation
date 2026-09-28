import Link from "next/link";

const cta = "rounded-full px-[26px] py-3.5 text-[15px] font-semibold transition-colors";

/** Bloc 2 — hauteur ≤ 400 px, aucun visuel (UX accueil §2). */
export function Hero({ base, ligneChiffres }: { base: string; ligneChiffres: string }) {
  return (
    <section className="border-b border-line bg-[image:var(--hero-rays)]">
      <div className="mx-auto flex max-w-[900px] flex-col items-center gap-[18px] px-7 pt-[52px] pb-14 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-ink-600">
          <span aria-hidden="true" className="block size-[7px] rounded-full bg-brique-700" />
          Annuaire indépendant
        </span>
        <h1 className="text-[clamp(32px,4.4vw,54px)] leading-[1.06] font-bold tracking-[-0.03em] text-balance">
          Trouvez votre formation en sécurité privée en Île-de-France
        </h1>
        <p className="max-w-[620px] text-[16.5px] leading-[1.6] text-ink-500">
          Comparez les organismes agréés d&apos;Île-de-France, titre par titre et département par département. Un
          annuaire indépendant, sans commission ni classement payant.
        </p>
        <div className="mt-0.5 flex flex-wrap justify-center gap-2.5">
          <Link href="#affinage" className={`${cta} bg-ink-900 text-white hover:bg-brique-700 hover:text-white`}>
            Quelle formation pour moi ?
          </Link>
          <Link
            href={`${base}organismes/`}
            className={`${cta} border border-line-strong bg-white text-ink-900 hover:border-ink-900 hover:text-ink-900`}
          >
            Voir les organismes
          </Link>
        </div>
        <p className="mt-1.5 font-mono text-[12.5px] tracking-[0.01em] text-ink-400">{ligneChiffres}</p>
      </div>
    </section>
  );
}
