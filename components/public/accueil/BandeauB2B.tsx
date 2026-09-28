import Link from "next/link";

/** Bloc 12 — une ligne discrète vers la landing B2B (jamais un bloc de conversion voyant). */
export function BandeauB2B({ base }: { base: string }) {
  return (
    <section className="pb-[88px]">
      <div className="container-public">
        <div className="flex flex-wrap items-center justify-between gap-5 rounded-[22px] border border-line bg-white p-[clamp(24px,2.8vw,34px)]">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[19px] font-bold tracking-[-0.015em]">Vous êtes un organisme de formation ?</h2>
            <p className="text-[15px] leading-[1.6] text-ink-500">
              Référencez votre centre gratuitement et gérez votre fiche.
            </p>
          </div>
          <Link
            href={`${base}referencer-mon-organisme/`}
            className="rounded-full bg-ink-900 px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-brique-700 hover:text-white"
          >
            En savoir plus →
          </Link>
        </div>
      </div>
    </section>
  );
}
