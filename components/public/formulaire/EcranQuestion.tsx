import Link from "next/link";
import type { Question } from "@/contenu/securite-privee/formulaire";
import type { Etape, Reponses } from "@/lib/formulaire/parcours";
import { ExclusionSecteur } from "./ExclusionSecteur";

export type GroupeOptions = { nom?: string; options: { valeur: string; libelle: string; detail?: string }[] };

const carte =
  "flex min-h-14 w-full items-center justify-between gap-4 rounded-[14px] border-[1.5px] px-[18px] py-3.5 text-left text-ink-900 transition-colors hover:border-brique-700 hover:bg-brique-050";
const etat = (choisi: boolean) =>
  choisi ? "border-ink-900 bg-white font-bold" : "border-line bg-cream-100 font-medium";
const grille = "grid grid-cols-[repeat(auto-fill,minmax(min(100%,220px),1fr))] gap-2";

/**
 * Un écran = une question = un formulaire GET (fonctionne sans JavaScript). Les réponses précédentes voyagent
 * en champs cachés : revenir en arrière ne réinitialise jamais rien, la réponse déjà donnée reste présélectionnée.
 */
export function EcranQuestion({
  etape,
  question,
  groupes,
  type,
  reponses,
  action,
  retour,
}: {
  etape: Etape;
  question: Question;
  groupes: GroupeOptions[];
  type: "unique" | "multiple" | "case";
  reponses: Reponses;
  action: string;
  retour: string | null;
}) {
  const caches = Object.entries(reponses).flatMap(([k, v]) =>
    k === etape || !v ? [] : (Array.isArray(v) ? v : [v]).map((x) => [k, x] as const),
  );
  const coche = (v: string) =>
    etape === "secteur" ? !!reponses.secteur?.includes(v) : reponses[etape as Exclude<Etape, "secteur">] === v;

  return (
    <form method="get" action={action} className="flex flex-col">
      {caches.map(([k, v]) => (
        <input key={`${k}-${v}`} type="hidden" name={k} value={v} />
      ))}
      <input type="hidden" name="apres" value={etape} />

      <div className="flex flex-col gap-[18px] px-[clamp(20px,3vw,32px)] py-[clamp(24px,3.5vw,40px)]">
        <div className="flex flex-col gap-2.5">
          <h2 className="text-[clamp(23px,3vw,30px)] leading-[1.15] font-bold tracking-[-0.025em] text-balance">
            {question.titre}
          </h2>
          {question.aide && <p className="max-w-[56ch] text-[15.5px] leading-[1.6] text-ink-700">{question.aide}</p>}
        </div>

        {type === "unique" ? (
          groupes.map((g) => (
            <div key={g.nom ?? "options"} className="flex flex-col gap-2">
              {g.nom && <span className="pt-1 eyebrow text-ink-400">{g.nom}</span>}
              <div className={g.nom ? grille : "grid gap-2"}>
                {g.options.map((o) => (
                  <button
                    key={o.valeur}
                    type="submit"
                    name={etape}
                    value={o.valeur}
                    aria-pressed={coche(o.valeur)}
                    className={`${carte} ${etat(coche(o.valeur))} cursor-pointer`}
                  >
                    <span className="flex min-w-0 flex-col gap-[3px]">
                      <span className="text-base leading-[1.4]">{o.libelle}</span>
                      {o.detail && (
                        <span className="text-[13px] leading-[1.45] font-normal text-ink-500">{o.detail}</span>
                      )}
                    </span>
                    <span aria-hidden="true" className="flex-none text-base text-brique-700">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <ExclusionSecteur>
            <fieldset className="flex flex-col gap-2">
              <legend className="sr-only">{question.titre}</legend>
              {groupes.map((g, i) => (
                <div key={i} className={g.options.length > 1 ? grille : "grid gap-2"}>
                  {g.options.map((o) => (
                    <label
                      key={o.valeur}
                      className={`${carte} cursor-pointer border-line bg-cream-100 font-medium has-checked:border-ink-900 has-checked:bg-white has-checked:font-bold`}
                    >
                      <span className="text-base leading-[1.4]">{o.libelle}</span>
                      <input
                        type="checkbox"
                        name={etape}
                        value={o.valeur}
                        defaultChecked={coche(o.valeur)}
                        className="size-[22px] flex-none accent-ink-900"
                      />
                    </label>
                  ))}
                </div>
              ))}
            </fieldset>
          </ExclusionSecteur>
        )}

        {question.mention && (
          <p className="mt-0.5 max-w-[60ch] border-t border-cream-200 pt-3.5 text-[14.5px] leading-[1.6] text-ink-500">
            {question.mention}
          </p>
        )}
      </div>

      <div className="flex min-h-[72px] items-center justify-between gap-3 border-t border-line px-[clamp(20px,3vw,32px)] py-3.5">
        <span className="flex">
          {retour && (
            <Link href={retour} className="px-1 py-3 text-[15px] font-bold text-ink-900 hover:text-brique-700">
              Retour
            </Link>
          )}
        </span>
        {type !== "unique" && (
          <button
            type="submit"
            className="inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-ink-900 px-[22px] py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-brique-700"
          >
            {type === "case" ? "Voir mes résultats" : "Continuer"}
            <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </form>
  );
}
