import Link from "next/link";
import { SectionHeading } from "@/components/public/SectionHeading";
import type { Departement } from "@/lib/supabase/queries/referentiel";

/**
 * Bloc 5 — les 8 départements. Seuls ceux qui ont une page (seuil d'organismes + contenu) sont cliquables ;
 * les autres restent en libellé simple, jamais un lien vers un filtre du catalogue (décision Erwan 01/10/2026).
 * Compteurs : tout ou rien, au-dessus du seuil d'affichage. Carte interactive : non retenue au lancement.
 */
export function EntreeGeo({
  base,
  departements,
  compteurs,
}: {
  base: string;
  departements: Departement[];
  compteurs: boolean;
}) {
  const pastille = "flex items-center gap-2.5 rounded-full border border-line px-5 py-3 text-[14.5px] font-semibold";
  return (
    <section id="departements" className="pb-[88px]">
      <div className="container-public flex flex-col items-center text-center">
        <SectionHeading
          surtitre="Île-de-France"
          titre="Se former près de chez soi en Île-de-France"
          chapo="Les formations à la sécurité privée se déroulent en présentiel : la proximité du centre est un critère de choix réel. Sélectionnez votre département."
        />
        <ul className="mt-7 flex flex-wrap justify-center gap-2.5">
          {departements.map((d) => {
            const libelle = (
              <>
                {d.nom} ({d.code})
                {compteurs && d.a_une_page && (
                  <span className="font-mono text-xs font-normal text-brique-700">{d.nbOrganismes}</span>
                )}
              </>
            );
            return (
              <li key={d.code}>
                {d.a_une_page ? (
                  <Link
                    href={`${base}${d.slug}/`}
                    className={`${pastille} bg-white text-ink-900 hover:border-ink-900 hover:text-ink-900`}
                  >
                    {libelle}
                  </Link>
                ) : (
                  <span className={`${pastille} text-ink-300`}>{libelle}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
