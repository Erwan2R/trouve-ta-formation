import Link from "next/link";

/** Organisme absent : juste après une suppression depuis sa fiche (maquette « Compte supprimé »), ou adresse erronée. */
export default function OrganismeIntrouvable() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center rounded-[28px] bg-ink-900 p-6">
      <div className="flex max-w-[520px] flex-col items-center gap-3.5 text-center">
        <h1 className="text-[clamp(28px,4vw,40px)] leading-[1.05] font-extrabold tracking-[-0.035em] text-white">
          Compte supprimé
        </h1>
        <p className="text-[15.5px] leading-[1.65] text-on-dark">
          Cet organisme a été retiré du site et de la base, ou l&apos;adresse est incorrecte.
        </p>
        <Link
          href="/organismes/"
          className="mt-1.5 inline-flex items-center gap-2.5 rounded-full bg-white px-[22px] py-3.5 text-[15px] font-bold text-ink-900 hover:text-ink-900"
        >
          Retour au Fichier client<span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
