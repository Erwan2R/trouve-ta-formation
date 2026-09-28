import Link from "next/link";
import { SectionHeading } from "@/components/public/SectionHeading";
import type { Verticale } from "@/lib/config/verticales";
import { getDemarches } from "@/lib/supabase/queries/demarches";
import { fr } from "@/lib/typo";

const carte = "flex w-full flex-col gap-[13px] rounded-[18px] border border-line bg-cream-100 p-[26px] text-ink-900";

/**
 * Bloc 8 — dit *quand* intervient chaque démarche, jamais *comment* (anti-cannibalisation).
 * Carte cliquable seulement si la page démarche est visible (vérifiée par Erwan en production).
 */
export async function Demarches({ verticale }: { verticale: Verticale }) {
  const base = `/${verticale.slug}/`;
  const { demarches, listeVisible } = await getDemarches(verticale);
  return (
    <section id="demarches" className="border-y border-line bg-white py-[88px]">
      <div className="container-public">
        <SectionHeading
          surtitre="CNAPS"
          titre="Les démarches CNAPS, étape par étape"
          chapo="Se former ne suffit pas : l'exercice de la sécurité privée est conditionné à des autorisations délivrées par le CNAPS. Elles s'enchaînent dans un ordre précis."
        />
        <ol className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-3.5">
          {demarches.map((d, i) => {
            const interieur = (
              <>
                <span
                  aria-hidden="true"
                  className="flex size-9 items-center justify-center rounded-full bg-brique-700 font-mono text-[12.5px] text-white"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-xl font-bold tracking-[-0.015em]">{d.libelle}</h3>
                <span className="text-[14.5px] leading-[1.65] text-ink-500">{fr(d.accroche)}</span>
              </>
            );
            return (
              <li key={d.slug} className="flex">
                {d.a_une_page ? (
                  <Link
                    href={`${base}demarches/${d.slug}/`}
                    className={`${carte} transition-[border-color,transform] hover:-translate-y-0.5 hover:border-ink-900 hover:text-ink-900`}
                  >
                    {interieur}
                  </Link>
                ) : (
                  <div className={carte}>{interieur}</div>
                )}
              </li>
            );
          })}
        </ol>
        {listeVisible && (
          <p className="mt-[26px] text-center">
            <Link href={`${base}demarches/`} className="border-b border-brique-200 pb-0.5 text-[15px] font-semibold">
              Voir toutes les démarches CNAPS →
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
