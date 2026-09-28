import Link from "next/link";
import { LISTE_DEMARCHES, URL_CONSULTATION_CNAPS, URL_DRACAR } from "@/contenu/securite-privee/demarches/liste";
import type { Demarche } from "@/lib/supabase/queries/demarches";
import { fr } from "@/lib/typo";

const encart = "flex flex-col gap-0.5 rounded-[20px] border border-line bg-white p-[22px]";
const surtitre = "pb-2.5 font-mono text-[10.5px] tracking-[0.12em] text-ink-400 uppercase";

/** Colonne latérale — parcours en 4 étapes, accès au portail, autres démarches (bloc 12, visibles uniquement). */
export function ColonneDemarche({
  base,
  courante,
  demarches,
  listeVisible,
}: {
  base: string;
  courante: Demarche;
  demarches: Demarche[];
  listeVisible: boolean;
}) {
  const visibles = new Map(demarches.filter((d) => d.a_une_page).map((d) => [d.slug, d]));
  const autres = demarches.filter((d) => d.slug !== courante.slug && d.a_une_page);

  return (
    <aside className="flex min-w-[min(100%,270px)] flex-[1_1_300px] flex-col gap-3 lg:sticky lg:top-[calc(var(--header-h)+76px)]">
      <div className={encart}>
        <h2 className={surtitre}>Le parcours complet</h2>
        <ol>
          {LISTE_DEMARCHES.parcours.map((etape, i) => {
            const ici = etape.demarche === courante.slug;
            const cible = etape.demarche ? visibles.get(etape.demarche) : null;
            const href = etape.demarche ? `${base}demarches/${etape.demarche}/` : "#formations";
            const texte = (
              <span className="flex flex-col gap-0.5">
                <span className="text-[15px] font-bold">{etape.titre}</span>
                <span className="text-[12.5px] leading-normal text-ink-400">
                  {ici ? `Vous êtes ici — ${etape.texte}` : etape.texte}
                </span>
              </span>
            );
            return (
              <li key={etape.titre} className="flex items-start gap-3 border-t border-[#F0ECE6] py-[11px]">
                <span
                  className={`flex-none pt-[3px] font-mono text-[11px] ${ici ? "text-brique-700" : "text-line-heavy"}`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {ici || (etape.demarche && !cible) ? (
                  texte
                ) : (
                  <Link href={href} className="text-ink-900 hover:text-brique-700">
                    {texte}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="flex flex-col gap-3 rounded-[20px] border border-line bg-white p-[22px]">
        <h2 className="font-mono text-[10.5px] tracking-[0.12em] text-ink-400 uppercase">Déposer sa demande</h2>
        <p className="text-[15.5px] leading-[1.6] text-ink-700">
          Toutes les démarches passent par l&apos;espace usager du CNAPS, en ligne.
        </p>
        <a
          href={URL_DRACAR}
          rel="noopener"
          className="flex items-center justify-center gap-[9px] rounded-full bg-ink-900 px-5 py-3.5 text-[15px] font-bold text-white hover:bg-brique-700 hover:text-white"
        >
          Ouvrir Dracar Ultimate <span aria-hidden="true">↗</span>
        </a>
        <a
          href={URL_CONSULTATION_CNAPS}
          rel="noopener"
          className="flex items-center justify-center gap-[9px] rounded-full border border-line-strong bg-white px-[18px] py-[13px] text-[14.5px] font-semibold text-ink-900 hover:border-ink-900 hover:text-ink-900"
        >
          Consultation publique des titres <span aria-hidden="true">↗</span>
        </a>
      </div>

      {(autres.length > 0 || listeVisible) && (
        <div className={encart}>
          <h2 className={surtitre}>Les autres démarches CNAPS</h2>
          {autres.map((d) => (
            <Link
              key={d.slug}
              href={`${base}demarches/${d.slug}/`}
              className="flex flex-col gap-[3px] border-t border-[#F0ECE6] py-3 text-ink-900 hover:text-brique-700"
            >
              <span className="text-[15px] font-bold">{LISTE_DEMARCHES.cartes[d.slug]?.titre ?? d.libelle}</span>
              <span className="text-[13px] leading-normal text-ink-400">{fr(d.accroche)}</span>
            </Link>
          ))}
          {listeVisible && (
            <Link
              href={`${base}demarches/`}
              className="flex items-center justify-between gap-2.5 border-t border-[#F0ECE6] py-3 text-[14.5px] font-semibold"
            >
              Voir les trois démarches <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      )}
    </aside>
  );
}
