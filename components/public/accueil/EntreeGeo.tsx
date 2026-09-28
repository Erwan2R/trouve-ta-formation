import Link from "next/link";
import { SectionHeading } from "@/components/public/SectionHeading";
import type { Departement } from "@/lib/supabase/queries/referentiel";

/**
 * Bloc 5 — uniquement les départements dont la page géographique est publiée (ni grisé, ni filtre catalogue).
 * Aucune page publiée → bloc absent. Carte interactive : Sprint 6.
 */
export function EntreeGeo({ base, departements }: { base: string; departements: Departement[] }) {
  if (departements.length === 0) return null;
  return (
    <section id="departements" className="pb-[88px]">
      <div className="container-public flex flex-col items-center text-center">
        <SectionHeading
          surtitre="Île-de-France"
          titre="Se former près de chez soi en Île-de-France"
          chapo="Les formations à la sécurité privée se déroulent en présentiel : la proximité du centre est un critère de choix réel. Sélectionnez votre département."
        />
        <ul className="mt-7 flex flex-wrap justify-center gap-2.5">
          {departements.map((d) => (
            <li key={d.code}>
              <Link
                href={`${base}${d.slug}/`}
                className="flex items-center gap-2.5 rounded-full border border-line bg-white px-5 py-3 text-[14.5px] font-semibold text-ink-900 hover:border-ink-900 hover:text-ink-900"
              >
                {d.nom} ({d.code})
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
