import Link from "next/link";
import { SectionHeading } from "@/components/public/SectionHeading";
import type { Titre } from "@/lib/supabase/queries/referentiel";

const carte = "flex min-w-0 gap-4 rounded-[18px] border border-line bg-white p-[22px] text-ink-900";

/**
 * Bloc 3 — une carte par titre, tous visibles, groupés par catégorie.
 * Titre sans page publiée : carte non cliquable. Durée masquée tant qu'elle n'est pas vérifiée (null).
 * Compteurs : tout ou rien (`compteurs` null = masqués).
 */
export function GrilleTitres({
  base,
  groupes,
  compteurs,
}: {
  base: string;
  groupes: { categorie: string; titres: Titre[] }[];
  compteurs: Map<string, number> | null;
}) {
  let n = 0;
  return (
    <section id="formations" className="py-[88px]">
      <div className="container-public">
        <SectionHeading
          surtitre="Les titres"
          titre="Quelle formation en sécurité privée suivre ?"
          chapo="Chaque métier de la sécurité privée correspond à un titre précis, reconnu par le CNAPS et exigé pour obtenir sa carte professionnelle. Voici ceux qui se préparent en Île-de-France."
        />
        <div className="mt-11 flex flex-col gap-8">
          {groupes.map((g) => (
            <div key={g.categorie} className="flex flex-col gap-[13px]">
              <h3 className="eyebrow text-ink-400">{g.categorie}</h3>
              <ul className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                {g.titres.map((t) => {
                  const numero = String(++n).padStart(2, "0");
                  const contenu = (
                    <>
                      <span className="flex-none pt-1 font-mono text-[12.5px] text-brique-700">{numero}</span>
                      <span className="flex min-w-0 flex-col gap-[9px]">
                        <span className="text-lg leading-[1.25] font-bold tracking-[-0.015em]">{t.libelle_court}</span>
                        {t.accroche && <span className="text-sm leading-[1.6] text-ink-500">{t.accroche}</span>}
                        {(t.duree || compteurs) && (
                          <span className="mt-0.5 flex flex-wrap items-center gap-2">
                            {t.duree && (
                              <span className="rounded-full bg-cream-200 px-[11px] py-[5px] font-mono text-[11.5px] text-ink-600">
                                {t.duree}
                              </span>
                            )}
                            {compteurs && (
                              <span className="text-xs font-semibold text-brique-700">
                                {compteurs.get(t.slug) ?? 0} organismes
                              </span>
                            )}
                          </span>
                        )}
                      </span>
                    </>
                  );
                  return (
                    <li key={t.slug} className="flex">
                      {t.a_une_page ? (
                        <Link
                          href={`${base}${t.slug}/`}
                          className={`${carte} w-full transition-[border-color,transform] hover:-translate-y-0.5 hover:border-ink-900 hover:text-ink-900`}
                        >
                          {contenu}
                        </Link>
                      ) : (
                        <div className={`${carte} w-full`}>{contenu}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
