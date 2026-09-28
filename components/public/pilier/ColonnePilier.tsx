import Link from "next/link";
import type { Titre } from "@/lib/supabase/queries/referentiel";
import { fr } from "@/lib/typo";

const encart = "flex flex-col gap-0.5 rounded-[20px] border border-line bg-white p-[22px]";
const surtitre = "pb-2.5 font-mono text-[10.5px] tracking-[0.12em] text-ink-400 uppercase";
const ligne = "flex flex-col gap-[3px] border-t border-[#F0ECE6] py-3 text-ink-900 hover:text-brique-700";

/**
 * Colonne latérale — passage à l'action, titres liés (bloc 10, publiés uniquement) et démarches (bloc 11,
 * avec leur position chronologique).
 */
export function ColonnePilier({
  base,
  titre,
  gabarit,
  nbOrganismes,
  titresLies,
  demarchesVisibles,
}: {
  base: string;
  titre: Titre;
  gabarit: "A" | "B";
  nbOrganismes: number | null;
  titresLies: { titre: Titre; texte: string }[];
  demarchesVisibles: Set<string>;
}) {
  const toutes =
    gabarit === "A"
      ? [
          ["autorisation-prealable", "Autorisation préalable", "Avant la formation"],
          ["carte-professionnelle", "Carte professionnelle", "Après l'obtention du titre"],
        ]
      : [
          ["renouvellement-carte-professionnelle", "Renouvellement de la carte", "Après le stage"],
          ["autorisation-prealable", "Autorisation préalable", "Si la carte est expirée"],
        ];
  const demarches = toutes.filter(([slug]) => demarchesVisibles.has(slug));
  const verbe = gabarit === "A" ? "préparent" : "proposent";

  return (
    <aside className="flex min-w-[min(100%,270px)] flex-[1_1_300px] flex-col gap-3 lg:sticky lg:top-[calc(var(--header-h)+76px)]">
      <div className="flex flex-col gap-3.5 rounded-[20px] bg-ink-900 p-6 text-on-dark-strong">
        <span className="font-mono text-[10.5px] tracking-[0.12em] text-brique-400 uppercase">
          Passer à l&apos;action
        </span>
        <span className="text-[19px] leading-[1.3] font-bold tracking-[-0.02em] text-white">
          {nbOrganismes !== null
            ? `${nbOrganismes} organismes ${verbe} le ${titre.libelle_court} en Île-de-France`
            : `Où préparer le ${titre.libelle_court} en Île-de-France`}
        </span>
        <a
          href="#organismes-titre"
          className="flex items-center justify-center rounded-full bg-white px-[22px] py-[15px] text-[15.5px] font-bold text-ink-900 hover:bg-brique-400 hover:text-ink-900"
        >
          Voir les organismes
        </a>
        <a
          href="#affinage"
          className="flex items-center justify-center rounded-full border border-[#2F2B29] px-5 py-3.5 text-[14.5px] font-semibold text-white hover:border-white hover:text-white"
        >
          {gabarit === "A" ? "Trouver mon titre" : "Vérifier mon cas"}
        </a>
      </div>

      {titresLies.length > 0 && (
        <div className={encart}>
          <h2 className={surtitre}>Les titres du même parcours</h2>
          {titresLies.map(({ titre: t, texte }) => (
            <Link key={t.slug} href={`${base}${t.slug}/`} className={ligne}>
              <span className="text-[15.5px] font-bold">{t.libelle_court}</span>
              <span className="text-[13px] leading-normal text-ink-400">{fr(texte)}</span>
            </Link>
          ))}
        </div>
      )}

      {demarches.length > 0 && (
        <div className={encart}>
          <h2 className={surtitre}>Les démarches à accomplir</h2>
          {demarches.map(([slug, libelle, quand]) => (
            <Link key={slug} href={`${base}demarches/${slug}/`} className={ligne}>
              <span className="text-[15px] font-bold">{libelle}</span>
              <span className="font-mono text-[11px] tracking-[0.08em] text-brique-700 uppercase">{quand}</span>
            </Link>
          ))}
        </div>
      )}
    </aside>
  );
}
