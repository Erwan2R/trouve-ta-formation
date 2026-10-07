import Link from "next/link";
import { LienContenu } from "@/components/public/LienContenu";
import { conditionsCommunes } from "@/contenu/securite-privee/piliers/communs";
import { releveDuCnaps } from "@/lib/formulaire/parcours";
import type { ContenuPilier } from "@/contenu/securite-privee/piliers/types";
import { Grille } from "@/components/public/catalogue/ListingCatalogue";
import { JsonLd, faqJsonLd } from "@/lib/seo/json-ld";
import { absoluteUrl } from "@/lib/seo/metadata";
import type { Organisme } from "@/lib/supabase/queries/organismes";
import type { Departement, Titre } from "@/lib/supabase/queries/referentiel";
import { fr } from "@/lib/typo";
import { TexteContenu } from "@/components/public/TexteContenu";

const h2 = "scroll-mt-40 text-[clamp(25px,3vw,34px)] leading-[1.1] font-bold tracking-[-0.025em]";
const h2Petit = "scroll-mt-40 text-[clamp(22px,2.4vw,28px)] leading-[1.15] font-bold tracking-[-0.02em]";
const h3 = "text-[18.5px] font-bold tracking-[-0.015em]";
const prose = "max-w-[70ch] text-[17px] leading-[1.75] text-pretty text-ink-700";
const filet = "border-[#DFD9D2]";

// Financements : formulation commune de la maquette (bloc 7) ; la ligne CPF vient du contenu du titre.
const FINANCEMENTS = [
  ["CPF", ""],
  ["France Travail", "Possible dans le cadre d'un projet de retour à l'emploi validé avec votre conseiller."],
  ["OPCO", "Voie usuelle pour un salarié d'une entreprise de la branche, via son employeur."],
  ["Plan de dév.", "À l'initiative de l'employeur, sur son budget formation."],
];

function Cout({ contenu }: { contenu: ContenuPilier }) {
  return (
    <div className="flex flex-col gap-[18px]">
      <h2 id="cout" className={h2}>
        Combien de temps et combien ça coûte
      </h2>
      <div className="flex flex-col gap-[9px]">
        <h3 className={h3}>La durée</h3>
        <p className={prose}>
          <TexteContenu texte={contenu.duree} />
        </p>
      </div>
      <div className="flex flex-col gap-[9px]">
        <h3 className={h3}>Le coût</h3>
        <p className={prose}>
          <TexteContenu texte={contenu.cout} />
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className={h3}>Les financements possibles</h3>
        <dl className={`flex max-w-[74ch] flex-col border-t ${filet}`}>
          {FINANCEMENTS.map(([nom, defaut]) => {
            const texte = nom === "CPF" ? contenu.financementCpf : defaut;
            return (
              <div key={nom} className={`flex flex-wrap gap-x-6 gap-y-1.5 border-b ${filet} py-[15px]`}>
                <dt className="w-[126px] flex-none text-base font-bold">{nom}</dt>
                <dd className="flex-[1_1_240px] text-base leading-[1.65] text-ink-500">{fr(texte)}</dd>
              </div>
            );
          })}
        </dl>
        <p className="max-w-[70ch] text-base leading-[1.7] text-ink-500">
          {fr(
            "Les organismes référencés indiquent les financements qu'ils acceptent. Vérifiez qu'un centre est certifié Qualiopi : cette certification conditionne l'accès aux financements publics et mutualisés.",
          )}
        </p>
      </div>
    </div>
  );
}

/** Blocs 4 à 9 et 12 — ordre des blocs de fond selon le gabarit (A : coût après le programme ; B : coût remonté). */
export function CorpsPilier({
  base,
  titre,
  contenu,
  departements,
  demarchesVisibles,
  organismes,
}: {
  base: string;
  titre: Titre;
  contenu: ContenuPilier;
  departements: Departement[];
  demarchesVisibles: Set<string>;
  /** Bloc 8 : vide sous le seuil. */
  organismes: Organisme[];
}) {
  const court = titre.libelle_court;
  const conditions = [
    {
      ...contenu.conditions.premiere,
      // Filière incendie : pas de démarche CNAPS à lier.
      lien: !releveDuCnaps(titre.slug)
        ? undefined
        : contenu.gabarit === "A"
          ? { href: "demarches/autorisation-prealable/", libelle: "Voir comment faire la demande →" }
          : { href: "demarches/renouvellement-carte-professionnelle/", libelle: "Voir le renouvellement →" },
    },
    ...conditionsCommunes(titre.slug),
    contenu.conditions.propres,
  ];

  return (
    <div className="flex min-w-[min(100%,300px)] flex-[999_1_560px] flex-col gap-[46px]">
      <div className="flex flex-col gap-[18px]">
        <h2 id="bloc4" className={h2}>
          {contenu.bloc4.h2}
        </h2>
        {contenu.bloc4.sections.map((s) => (
          <div key={s.h3} className="flex flex-col gap-[9px]">
            <h3 className={h3}>{s.h3}</h3>
            <p className={prose}>
              <TexteContenu texte={s.texte} />
            </p>
          </div>
        ))}
      </div>

      {contenu.gabarit === "B" && <Cout contenu={contenu} />}

      <div className="flex flex-col gap-[18px]">
        <h2 id="prerequis" className={h2}>
          Les conditions pour s&apos;inscrire
        </h2>
        <ol className={`flex max-w-[74ch] flex-col border-t ${filet}`}>
          {conditions.map((c, i) => (
            <li key={c.h3} className={`flex items-start gap-4 border-b ${filet} py-[18px]`}>
              <span aria-hidden="true" className="flex-none pt-1 font-mono text-xs text-brique-700">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-[5px]">
                <h3 className="text-[17.5px] font-bold tracking-[-0.015em]">{c.h3}</h3>
                <p className="text-base leading-[1.7] text-ink-500">
                  <TexteContenu texte={c.texte} />
                  {"lien" in c && c.lien && (
                    <>
                      {" "}
                      <LienContenu
                        lien={c.lien}
                        base={base}
                        demarchesVisibles={demarchesVisibles}
                        className="font-bold"
                      />
                    </>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col gap-[18px]">
        <h2 id="programme" className={h2}>
          Le programme de la formation
        </h2>
        <p className={prose}>
          <TexteContenu texte={contenu.programme.intro} />
        </p>
        <table className="w-full max-w-[74ch] border-collapse text-left">
          <thead>
            <tr>
              <th
                scope="col"
                className="border-b border-line-heavy pr-3 pb-2.5 font-mono text-[10.5px] font-medium tracking-[0.12em] text-ink-400 uppercase"
              >
                Module
              </th>
              <th
                scope="col"
                className="border-b border-line-heavy pb-2.5 pl-3 text-right font-mono text-[10.5px] font-medium tracking-[0.12em] whitespace-nowrap text-ink-400 uppercase"
              >
                Volume
              </th>
            </tr>
          </thead>
          <tbody>
            {contenu.programme.modules.map((m) => (
              <tr key={m.nom}>
                <td className={`border-b ${filet} py-3.5 pr-3 text-base leading-[1.55] font-semibold`}>{fr(m.nom)}</td>
                <td
                  className={`border-b ${filet} py-3.5 pl-3 text-right font-mono text-[13.5px] whitespace-nowrap text-ink-400`}
                >
                  {m.volume ?? <TexteContenu texte="[à vérifier]" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={prose}>
          <TexteContenu texte={contenu.programme.evaluation} />
        </p>
      </div>

      {contenu.gabarit === "A" && <Cout contenu={contenu} />}

      {/* Bloc 8 — organismes du titre (Copy piliers §11) ; sous le seuil : bloc masqué, copy de remplacement. */}
      {organismes.length > 0 ? (
        <div className="flex flex-col gap-[18px]">
          <JsonLd
            data={{
              "@type": "ItemList",
              itemListElement: organismes.map((o, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: o.nom,
                url: absoluteUrl(`${base}organismes/${o.slug}/`),
              })),
            }}
          />
          <h2 id="organismes-titre" className={h2}>
            Où préparer le {court} en Île-de-France
          </h2>
          <Grille organismes={organismes} base={base} />
          {/* Catalogue filtré : non indexable, c'est de l'usage (UX pilier §8). */}
          <Link href={`${base}organismes/?titre=${titre.slug}`} className="self-start text-[15px] font-bold">
            Voir tous les organismes qui préparent le {court} <span aria-hidden="true">→</span>
          </Link>
        </div>
      ) : (
        <div className="flex max-w-[70ch] flex-col gap-3 rounded-[22px] border border-line bg-white p-[clamp(24px,3vw,34px)]">
          <h2
            id="organismes-titre"
            className="scroll-mt-40 text-[clamp(23px,2.8vw,30px)] leading-[1.12] font-bold tracking-[-0.025em]"
          >
            {fr(`Vous cherchez un centre pour le ${court} ?`)}
          </h2>
          <p className="text-[17px] leading-[1.7] text-ink-700">
            Consultez les organismes de formation référencés en Île-de-France, ou dites-nous ce que vous cherchez.
          </p>
          <Link
            href={`${base}organismes/`}
            className="mt-1 inline-flex items-center gap-2.5 self-start rounded-full bg-ink-900 px-[22px] py-3.5 text-[15px] font-bold text-white hover:bg-brique-700 hover:text-white"
          >
            Voir tous les organismes <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}

      {/* Bloc 9 — liste les zones publiées, ne développe rien (anti-cannibalisation). */}
      {departements.length > 0 && (
        <div className="flex flex-col gap-3.5">
          <h2 id="geo" className={h2Petit}>
            Se former près de chez soi
          </h2>
          <p className="max-w-[70ch] text-[16.5px] leading-[1.7] text-ink-500">
            {fr(
              "La formation se déroule en présentiel : chaque département dispose de sa page, avec les organismes qui y sont implantés.",
            )}
          </p>
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-2.5">
            {departements.map((d) => (
              <li key={d.code}>
                <Link
                  href={`${base}${d.slug}/`}
                  className="flex items-center justify-between gap-3 rounded-[14px] border border-line bg-white px-[18px] py-[15px] text-[15.5px] font-semibold text-ink-900 hover:border-ink-900 hover:text-ink-900"
                >
                  {d.nom} ({d.code})
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-[18px]">
        <JsonLd data={faqJsonLd(contenu.faq)} />
        <h2 id="faq" className={h2Petit}>
          Questions fréquentes sur le {court}
        </h2>
        <div className={`flex max-w-[80ch] flex-col border-t ${filet}`}>
          {contenu.faq.map((q) => (
            <details key={q.question} className={`border-b ${filet}`}>
              <summary className="flex cursor-pointer items-start justify-between gap-5 py-[19px] text-[16.5px] leading-[1.4] font-semibold">
                <h3>{fr(q.question)}</h3>
                <span aria-hidden="true" className="flex-none text-lg text-brique-700">
                  +
                </span>
              </summary>
              <p className="mb-5 pr-10 text-base leading-[1.7] text-ink-500">
                <TexteContenu texte={q.reponse} />
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
