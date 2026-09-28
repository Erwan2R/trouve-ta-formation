import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { CarteOrganisme } from "@/components/public/organisme/CarteOrganisme";
import { SommaireAncres } from "@/components/public/SommaireAncres";
import { TexteContenu } from "@/components/public/TexteContenu";
import { DEPARTEMENTS } from "@/contenu/securite-privee/departements";
import { VERTICALES, type Verticale } from "@/lib/config/verticales";
import {
  disponibilites,
  lieuDansDepartement,
  organismesDuDepartement,
  villesDuDepartement,
} from "@/lib/organismes/departement";
import { listeFr } from "@/lib/organismes/fiche";
import { trier } from "@/lib/organismes/tri";
import { DEPARTEMENTS_VOISINS } from "@/lib/organismes/voisins";
import { JsonLd, faqJsonLd } from "@/lib/seo/json-ld";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { getCompteursAffiches } from "@/lib/supabase/queries/compteurs";
import { getDemarches } from "@/lib/supabase/queries/demarches";
import { getOrganismes } from "@/lib/supabase/queries/organismes";
import {
  dansDepartement,
  getDepartements,
  getTitresParCategorie,
  type Departement,
} from "@/lib/supabase/queries/referentiel";
import { fr } from "@/lib/typo";

const majuscule = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const verticale: Verticale = VERTICALES["securite-privee"];
const base = `/${verticale.slug}/`;

const h2 = "scroll-mt-40 text-[clamp(25px,3vw,34px)] leading-[1.1] font-bold tracking-[-0.025em]";
const encart = "flex flex-col gap-3 rounded-[20px] border border-line bg-white p-[22px]";
const surtitre = "font-mono text-[10.5px] tracking-[0.12em] text-ink-400 uppercase";
const ligneLien =
  "flex items-center justify-between gap-2.5 border-t border-[#F0ECE6] py-3 text-[15px] font-semibold text-ink-900 hover:text-brique-700";

/** Métadonnées (Copy géo §2) : title avec préposition, description en cascade selon le seuil des compteurs. */
export async function metadataDepartement(d: Departement): Promise<Metadata> {
  const compteurs = await getCompteursAffiches(verticale.seuilCompteurs);
  const zone = `${dansDepartement(d)} (${d.code})`;
  const long = `Formation sécurité privée ${zone} : organismes et titres`;
  const contenu = DEPARTEMENTS[d.slug];
  return buildMetadata({
    title: long.length > 70 ? `Formation sécurité privée ${zone}` : long,
    description: `${compteurs ? `Les ${d.nbOrganismes}` : "Les"} organismes de formation à la sécurité privée ${zone}. Titres préparés, villes couvertes, financements acceptés et démarches CNAPS.`,
    path: `${base}${d.slug}/`,
    og: { title: `Formation sécurité privée ${zone}`, description: contenu.chapo.join(" ").slice(0, 150) },
  });
}

/**
 * Page département (UX/Copy pages géographiques). N'existe qu'au-dessus du seuil d'organismes et avec son contenu
 * rédigé : la route ne l'appelle que si `a_une_page`. Listing complet (remplace le filtre non indexable).
 * ponytail: pas de pagination, les inventaires départementaux restent courts ; l'ajouter comme au catalogue au-delà
 * d'une trentaine d'organismes.
 */
export async function PageDepartement({ departement: d }: { departement: Departement }) {
  const contenu = DEPARTEMENTS[d.slug];
  const [tous, departements, groupes, compteurs, { demarches }] = await Promise.all([
    getOrganismes(),
    getDepartements(),
    getTitresParCategorie(),
    getCompteursAffiches(verticale.seuilCompteurs),
    getDemarches(verticale),
  ]);
  const zone = dansDepartement(d);
  const parCode = new Map(departements.map((x) => [x.code, x]));
  const organismes = trier(organismesDuDepartement(tous, d.code), "pertinence");
  const titres = groupes.flatMap((g) => g.titres);
  const dispo = new Map(
    disponibilites(
      tous,
      d.code,
      titres.map((t) => t.slug),
    ).map((x) => [x.slug, x]),
  );
  const presents = titres.filter((t) => dispo.get(t.slug)!.nombre > 0);
  const absents = titres.filter((t) => dispo.get(t.slug)!.nombre === 0);
  const villes = villesDuDepartement(tous, d.code, !!compteurs);
  const voisins = (DEPARTEMENTS_VOISINS[d.code] ?? []).flatMap((c) => {
    const v = parCode.get(c);
    return v?.a_une_page ? [v] : [];
  });
  const demarchesVisibles = demarches.filter((x) => x.a_une_page);

  // Phrase de disponibilité du chapô, calculée depuis l'inventaire (jamais une absence écrite à la main).
  const absentsAvecVoisin = absents.filter((t) => dispo.get(t.slug)!.voisin).slice(0, 2);
  const voisinsCites = [...new Set(absentsAvecVoisin.map((t) => dispo.get(t.slug)!.voisin!))]
    .map((c) => parCode.get(c))
    .filter((v): v is Departement => !!v);
  const phraseAbsences =
    absentsAvecVoisin.length > 0
      ? `${majuscule(listeFr(absentsAvecVoisin.map((t) => `le ${t.libelle_court.replace(/^Recyclage/, "recyclage")}`)))} ${absentsAvecVoisin.length > 1 ? "ne sont proposés" : "n'est proposé"} par aucun centre du département : les organismes les plus proches se trouvent ${listeFr(voisinsCites.map(dansDepartement))}.`
      : null;

  const premierAbsent = absentsAvecVoisin[0];
  const faq = [
    ...(compteurs
      ? [
          {
            question: `Combien d'organismes de formation à la sécurité privée y a-t-il ${zone} ?`,
            reponse: `${organismes.length} organismes référencés disposent d'au moins un lieu de formation dans le département, répartis principalement à ${listeFr(villes.slice(0, 3).map((v) => v.ville))}.`,
          },
        ]
      : []),
    ...(presents.length
      ? [
          {
            question: `Quelles formations peut-on suivre ${zone} ?`,
            reponse: `${groupes
              .map((g) => ({ g, t: g.titres.filter((t) => dispo.get(t.slug)!.nombre > 0) }))
              .filter((x) => x.t.length)
              .map((x) => `${x.g.categorie} : ${x.t.map((t) => t.libelle_court).join(", ")}`)
              .join(" ; ")}.`,
          },
        ]
      : []),
    ...(premierAbsent
      ? [
          {
            question: `Peut-on préparer le ${premierAbsent.libelle_court} ${zone} ?`,
            reponse: `Non, aucun organisme référencé ne le propose dans le département. Les centres les plus proches se trouvent ${dansDepartement(parCode.get(dispo.get(premierAbsent.slug)!.voisin!)!)}.`,
          },
        ]
      : []),
    {
      question: "Faut-il se former dans son département de résidence ?",
      reponse:
        "Non. Votre carte professionnelle est valable sur tout le territoire national, quel que soit le lieu de votre formation. Le seul critère est pratique : la formation se déroule en présentiel, souvent sur plusieurs semaines.",
    },
    { question: `Comment se rendre dans les centres de formation ${zone} ?`, reponse: contenu.acces },
    {
      question: "Les démarches CNAPS sont-elles différentes selon le département ?",
      reponse: "Non. Les procédures sont identiques dans toute l'Île-de-France et se déposent sur le même portail.",
    },
  ];

  return (
    <main>
      <JsonLd
        data={[
          {
            "@type": "ItemList",
            itemListElement: organismes.map((o, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: o.nom,
              url: absoluteUrl(`${base}organismes/${o.slug}/`),
            })),
          },
          faqJsonLd(faq),
        ]}
      />

      <section className="border-b border-line-strong bg-cream-200">
        <div className="container-public pt-[18px] pb-9">
          <Breadcrumb
            items={[
              { name: verticale.nom, path: base },
              { name: `${d.nom} (${d.code})`, path: `${base}${d.slug}/` },
            ]}
          />
          <div className="mt-7 flex flex-wrap items-start gap-[clamp(20px,3vw,48px)]">
            <div className="flex min-w-[min(100%,290px)] flex-[1_1_480px] flex-col gap-[13px]">
              <h1 className="text-[clamp(30px,4vw,50px)] leading-[1.04] font-bold tracking-[-0.035em] text-balance">
                Formation sécurité privée {zone} ({d.code})
              </h1>
              <p className="max-w-[62ch] text-lg leading-[1.6] text-pretty text-ink-700">
                Les organismes qui préparent aux titres de la sécurité privée dans le département, avec les titres
                qu&apos;ils dispensent et les villes où ils sont implantés.
              </p>
              {compteurs && (
                <p className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1.5 text-[15.5px] font-semibold text-ink-700">
                  {[
                    [organismes.length, "organismes"],
                    [villes.length, "villes"],
                    [presents.length, "titres disponibles"],
                  ].map(([n, l], i) => (
                    <span key={l} className="inline-flex items-baseline gap-2">
                      {i > 0 && (
                        <span aria-hidden="true" className="text-line-heavy">
                          ·
                        </span>
                      )}
                      <span className="text-[21px] font-bold tracking-[-0.02em] text-ink-900">{n}</span>
                      {l}
                    </span>
                  ))}
                </p>
              )}
            </div>
            <div className="flex min-w-[min(100%,280px)] flex-[1_1_340px] flex-col gap-3 rounded-[20px] border border-line-strong bg-white p-[22px]">
              {contenu.chapo.map((p) => (
                <p key={p} className="text-base leading-[1.7] text-pretty text-ink-700">
                  <TexteContenu texte={p} />
                </p>
              ))}
              {phraseAbsences && <p className="text-base leading-[1.7] text-ink-700">{fr(phraseAbsences)}</p>}
            </div>
          </div>
        </div>
      </section>

      <SommaireAncres
        ancres={[
          { id: "titres", libelle: "Les titres préparés" },
          { id: "organismes-dept", libelle: "Les organismes", principale: true },
          { id: "villes", libelle: "Où sont les centres" },
          { id: "se-former", libelle: contenu.ancreSeFormer ?? `Se former ${zone}` },
          { id: "faq", libelle: "Questions fréquentes" },
        ]}
      />

      {/* Bloc 4 — contenu unique : titres disponibles localement, absents affichés avec leur repli. */}
      <section className="bg-cream-100">
        <div className="container-public pt-12">
          <div className="mb-[18px] flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="titres" className={h2}>
              Les titres préparés {zone}
            </h2>
            <span className="font-mono text-xs text-ink-400">
              {presents.length} titre{presents.length > 1 ? "s" : ""} sur {titres.length} disponible
              {presents.length > 1 ? "s" : ""} localement
            </span>
          </div>
          <div className="flex flex-col gap-[26px]">
            {groupes.map((g) => (
              <div key={g.categorie} className="flex flex-col gap-2.5">
                <h3 className="font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400 uppercase">
                  {g.categorie}
                </h3>
                <ul className="flex flex-col border-t border-[#DFD9D2]">
                  {g.titres.map((t) => {
                    const x = dispo.get(t.slug)!;
                    const voisin = x.voisin ? parCode.get(x.voisin) : undefined;
                    return (
                      <li
                        key={t.slug}
                        className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-[#DFD9D2] py-[15px]"
                      >
                        {x.nombre > 0 && t.a_une_page ? (
                          <Link
                            href={`${base}${t.slug}/`}
                            className="min-w-40 flex-[1_1_200px] text-[17.5px] font-bold tracking-[-0.015em] text-ink-900 hover:text-brique-700"
                          >
                            {t.libelle_court}
                          </Link>
                        ) : (
                          <span
                            className={`min-w-40 flex-[1_1_200px] text-[17.5px] font-bold tracking-[-0.015em] ${x.nombre > 0 ? "text-ink-900" : "text-[#635D58]"}`}
                          >
                            {t.libelle_court}
                          </span>
                        )}
                        {x.nombre > 0 ? (
                          <>
                            <span className="min-w-[110px] flex-none text-[15px] font-semibold text-ink-700">
                              {compteurs ? `${x.nombre} organisme${x.nombre > 1 ? "s" : ""}` : "Proposé"}
                            </span>
                            <span className="flex-[2_1_220px] text-[14.5px] text-ink-400">{x.villes.join(", ")}</span>
                          </>
                        ) : (
                          <>
                            <span className="min-w-[110px] flex-none text-[14.5px] text-[#635D58]">
                              Non proposé dans le département
                            </span>
                            {/* Repli : voisin avec page, sinon page pilier ; jamais un lien vers une page absente. */}
                            {voisin?.a_une_page ? (
                              <Link
                                href={`${base}${voisin.slug}/`}
                                className="flex-[2_1_220px] text-[14.5px] font-semibold"
                              >
                                Voir les organismes {dansDepartement(voisin)} →
                              </Link>
                            ) : t.a_une_page ? (
                              <Link href={`${base}${t.slug}/`} className="flex-[2_1_220px] text-[14.5px] font-semibold">
                                Voir la page du {t.libelle_court} →
                              </Link>
                            ) : (
                              <span className="flex-[2_1_220px]" />
                            )}
                          </>
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

      {/* Bloc 5 — listing complet, adresse du lieu situé dans le département. */}
      <section className="mt-[52px] border-y border-line bg-white">
        <div className="container-public py-14">
          <div className="mb-[22px] flex flex-col gap-1.5">
            <h2 id="organismes-dept" className={h2}>
              Les organismes de formation {zone}
            </h2>
            <p className="text-base leading-[1.65] text-ink-500">
              Tous les organismes disposant d&apos;au moins un lieu de formation dans le département.
            </p>
          </div>
          <ol className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-3.5">
            {organismes.map((o) => (
              <li key={o.id}>
                <CarteOrganisme organisme={o} base={base} fond="creme" lieu={lieuDansDepartement(o, d.code)} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-cream-100">
        <div className="container-public flex flex-wrap items-start gap-[clamp(24px,3vw,44px)] py-14">
          <div className="flex min-w-[min(100%,300px)] flex-[999_1_560px] flex-col gap-[46px]">
            {/* Bloc 6 — texte simple : aucune page ville n'existe encore (seuil 5, contenu propre requis). */}
            <div className="flex flex-col gap-3.5">
              <h2 id="villes" className={h2}>
                Où se trouvent les centres
              </h2>
              <ul className="flex max-w-[74ch] flex-col border-t border-[#DFD9D2]">
                {villes.map((v) => (
                  <li
                    key={v.ville}
                    className="flex items-baseline justify-between gap-4 border-b border-[#DFD9D2] py-3.5"
                  >
                    <span className="text-[16.5px] font-semibold">{v.ville}</span>
                    {compteurs && <span className="font-mono text-[13.5px] text-ink-600">{v.nombre}</span>}
                  </li>
                ))}
              </ul>
            </div>

            {/* Bloc 7 — le contenu qui justifie la page. */}
            <div className="flex flex-col gap-[18px]">
              <h2 id="se-former" className={h2}>
                Se former à la sécurité privée {zone}
              </h2>
              {contenu.seFormer.map((s) => (
                <div key={s.h3} className="flex flex-col gap-2.5">
                  <h3 className="text-[18.5px] font-bold tracking-[-0.015em]">{fr(s.h3)}</h3>
                  {s.paragraphes.map((p) => (
                    <p key={p} className="max-w-[70ch] text-[17px] leading-[1.75] text-pretty text-ink-700">
                      <TexteContenu texte={p} />
                    </p>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-[18px]">
              <h2
                id="faq"
                className="scroll-mt-40 text-[clamp(22px,2.4vw,28px)] leading-[1.15] font-bold tracking-[-0.02em]"
              >
                Questions fréquentes
              </h2>
              <div className="flex max-w-[80ch] flex-col border-t border-[#DFD9D2]">
                {faq.map((q) => (
                  <details key={q.question} className="border-b border-[#DFD9D2]">
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

          <aside className="flex min-w-[min(100%,270px)] flex-[1_1_300px] flex-col gap-3 lg:sticky lg:top-[calc(var(--header-h)+76px)]">
            {/* Bloc 8 — voisins avec page ; sinon repli unique vers le catalogue (décision Erwan 01/10/2026). */}
            <div className={encart}>
              <h2 className={surtitre}>
                {voisins.length ? "Se former dans un département voisin" : "Élargir sa recherche"}
              </h2>
              <p className="text-[15px] leading-[1.65] text-ink-700">
                Les trajets entre départements franciliens sont courants{" "}: élargir sa recherche multiplie souvent
                l&apos;offre disponible.
              </p>
              {voisins.length ? (
                <div className="flex flex-col gap-0.5">
                  {voisins.map((v) => (
                    <Link key={v.code} href={`${base}${v.slug}/`} className={ligneLien}>
                      {v.nom} ({v.code})
                      {compteurs && <span className="font-mono text-[13px] text-ink-400">{v.nbOrganismes}</span>}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  href={`${base}organismes/`}
                  className="flex items-center justify-center gap-[9px] rounded-full bg-ink-900 px-5 py-3.5 text-[15px] font-bold text-white hover:bg-brique-700 hover:text-white"
                >
                  Voir tous les organismes d&apos;Île-de-France <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>

            {demarchesVisibles.length > 0 && (
              <div className={encart}>
                <h2 className={surtitre}>Les démarches à accomplir</h2>
                <p className="text-[15px] leading-[1.65] text-ink-700">
                  Les démarches CNAPS sont identiques dans toute l&apos;Île-de-France.
                </p>
                <div className="flex flex-col gap-0.5">
                  {demarchesVisibles.map((x) => (
                    <Link key={x.slug} href={`${base}demarches/${x.slug}/`} className={ligneLien}>
                      {x.libelle}
                      <span aria-hidden="true" className="text-brique-700">
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 rounded-[20px] bg-ink-900 p-6">
              <span className="font-mono text-[10.5px] tracking-[0.12em] text-brique-400 uppercase">Vous hésitez</span>
              <p className="text-lg leading-[1.35] font-bold tracking-[-0.02em] text-white">
                Vous ne savez pas quel titre viser{" "}?
              </p>
              <p className="text-[15px] leading-[1.65] text-on-dark">
                Six questions sur votre projet, et nous vous indiquons le titre adapté et les centres du département qui
                le préparent.
              </p>
              <Link
                href={`${base}formulaire/`}
                rel="nofollow"
                className="flex items-center justify-center rounded-full bg-white px-5 py-3.5 text-[15px] font-bold text-ink-900 hover:bg-brique-400 hover:text-ink-900"
              >
                Trouver mon titre
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
