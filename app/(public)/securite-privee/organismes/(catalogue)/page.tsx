import type { Metadata } from "next";
import Link from "next/link";
import { EtatUnique, EtatZero, Grille, PucesFiltres, titreDedie } from "@/components/public/catalogue/ListingCatalogue";
import { FiltresCatalogue } from "@/components/public/catalogue/FiltresCatalogue";
import { FormAuto } from "@/components/public/catalogue/FormAuto";
import { TiroirFiltres } from "@/components/public/catalogue/TiroirFiltres";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { Faq } from "@/components/public/Faq";
import { TexteContenu } from "@/components/public/TexteContenu";
import { CATALOGUE, CATALOGUE_VIDE, FAQ_CATALOGUE, GUIDE } from "@/contenu/securite-privee/catalogue";
import { VERTICALES, type Verticale } from "@/lib/config/verticales";
import { RANG_PALIER } from "@/lib/organismes/completude";
import { aDesFiltres, filtrer, lireFiltres, puces, versQuery, type Filtres } from "@/lib/organismes/filtres";
import { JsonLd } from "@/lib/seo/json-ld";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { getCompteursAffiches } from "@/lib/supabase/queries/compteurs";
import { getOrganismes, type Organisme } from "@/lib/supabase/queries/organismes";
import { getDepartements, getTitres, getTitresParCategorie } from "@/lib/supabase/queries/referentiel";
import { fr } from "@/lib/typo";

const verticale: Verticale = VERTICALES["securite-privee"];
const base = `/${verticale.slug}/`;
const action = `${base}organismes/`;
const PAR_PAGE = 24;

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const f = lireFiltres(await searchParams);
  const compteurs = await getCompteursAffiches(verticale.seuilCompteurs);
  return buildMetadata({
    title: CATALOGUE.title,
    description: compteurs ? CATALOGUE.description : CATALOGUE.descriptionLancement,
    // Filtre actif : noindex, follow + canonical vers la version nue. Pagination seule : auto-canonique.
    path: `${action}${f.page > 1 && !aDesFiltres(f) ? `?page=${f.page}` : ""}`,
    noindex: aDesFiltres(f),
    canonicalPath: aDesFiltres(f) ? action : undefined,
  });
}

/** Tri « Pertinence » = palier de complétude (jamais affiché sous ce nom), puis nom pour un ordre stable. */
function trier(organismes: Organisme[], f: Filtres): Organisme[] {
  const nom = (a: Organisme, b: Organisme) => a.nom.localeCompare(b.nom, "fr");
  return [...organismes].sort((a, b) =>
    f.tri === "alpha"
      ? nom(a, b)
      : f.tri === "ville"
        ? (a.siege?.ville ?? "").localeCompare(b.siege?.ville ?? "", "fr") || nom(a, b)
        : RANG_PALIER[b.palier] - RANG_PALIER[a.palier] || nom(a, b),
  );
}

export default async function Catalogue({ searchParams }: Props) {
  const f = lireFiltres(await searchParams);
  const [tous, compteurs, departements, titres, groupesTitres] = await Promise.all([
    getOrganismes(),
    getCompteursAffiches(verticale.seuilCompteurs),
    getDepartements(),
    getTitres(),
    getTitresParCategorie(),
  ]);
  const titresParSlug = new Map(titres.map((t) => [t.slug, t]));
  const deptsOrdonnes = verticale.footerDepartements.flatMap((c) => departements.filter((d) => d.code === c));
  const resultats = trier(filtrer(tous, f), f);

  // Sous le seuil : ni compteurs ni pagination (Copy catalogue §16) — tous les résultats sur une page.
  const pages = compteurs ? Math.max(1, Math.ceil(resultats.length / PAR_PAGE)) : 1;
  const page = Math.min(f.page, pages);
  const affiches = compteurs ? resultats.slice((page - 1) * PAR_PAGE, page * PAR_PAGE) : resultats;

  const villes = f.dept
    ? [...new Set(tous.flatMap((o) => o.lieux.filter((l) => l.departement === f.dept).map((l) => l.ville)))].sort()
    : [];
  const contexte = { action, base, filtres: f, departements, titres: titresParSlug };
  const deptFiltre = departements.find((d) => d.code === f.dept && d.page_publiee);
  const dedie = titreDedie(contexte);
  const actifs = puces(f).length;
  const piliers = titres.filter((t) => t.a_une_page);
  const deptsPublies = deptsOrdonnes.filter((d) => d.page_publiee);
  const n = resultats.length;
  // Aucun organisme inscrit : ni recherche ni filtres (toutes les options seraient vides), un état dédié.
  const vide = tous.length === 0;

  const guide = (
    <section id="guide" className="border-t border-line py-20">
      <div className="container-public grid items-start gap-[clamp(28px,5vw,72px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,2.1fr)]">
        <div className="flex flex-col gap-3 lg:sticky lg:top-[calc(var(--header-h)+90px)]">
          <span aria-hidden="true" className="block h-0.5 w-[30px] bg-brique-700" />
          <span className="eyebrow text-brique-700">Le guide</span>
          <h2 className="text-[clamp(24px,2.6vw,30px)] leading-[1.15] font-bold tracking-[-0.02em]">{GUIDE.h2}</h2>
          <p className="text-[15.5px] leading-[1.7] text-ink-500">{GUIDE.intro}</p>
          <nav aria-label="Sommaire du guide" className="mt-3 flex flex-col border-t border-line">
            {/* Les « quatre points » du guide ; « Les pièges à éviter » n'est pas numéroté (maquette). */}
            {GUIDE.sections.slice(0, 4).map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex gap-3.5 border-b border-line py-[13px] text-[14.5px] font-semibold text-ink-900 hover:text-brique-700"
              >
                <span className="flex-none font-mono text-xs font-normal text-brique-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.h3}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-14">
          {GUIDE.sections.map((s, i) => (
            <div key={s.id} className="flex flex-col gap-4">
              <div className="flex items-baseline gap-4">
                {i < 4 && (
                  <span aria-hidden="true" className="flex-none font-mono text-[13px] text-brique-700">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                )}
                <h3
                  id={s.id}
                  className="scroll-mt-40 text-[clamp(21px,2.2vw,26px)] leading-[1.2] font-bold tracking-[-0.02em]"
                >
                  {fr(s.h3)}
                </h3>
              </div>
              {s.paragraphes.map((p) => (
                <p key={p} className="text-[16.5px] leading-[1.75] text-ink-700">
                  <TexteContenu texte={p} />
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <main>
      <JsonLd
        data={{
          "@type": "ItemList",
          itemListElement: affiches.map((o, i) => ({
            "@type": "ListItem",
            position: (page - 1) * PAR_PAGE + i + 1,
            url: absoluteUrl(`${base}organismes/${o.slug}/`),
            name: o.nom,
          })),
        }}
      />

      <section className="bg-white">
        <div className="container-public pt-[22px] pb-[26px]">
          <Breadcrumb
            items={[
              { name: verticale.nom, path: base },
              { name: "Organismes de formation", path: action },
            ]}
          />
          <h1 className="mt-[26px] max-w-[19ch] text-[clamp(30px,3.8vw,46px)] leading-[1.08] font-bold tracking-[-0.03em] text-balance">
            {CATALOGUE.h1}
          </h1>
          <div className="mt-[18px] flex flex-wrap items-baseline gap-3.5">
            <p className="max-w-[60ch] text-[17px] leading-[1.6] text-ink-500">
              {compteurs ? CATALOGUE.contexte : CATALOGUE.contexteLancement}
            </p>
            {compteurs && (
              <span className="border-l border-line pl-3.5 font-mono text-[12.5px] text-ink-400">
                {compteurs.total} organismes référencés
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="container-public flex flex-wrap gap-[clamp(20px,3.5vw,44px)] pt-5 pb-[22px]">
          <p className="flex-[3_1_480px] text-[14.5px] leading-[1.75] text-ink-500">
            <TexteContenu texte={CATALOGUE.chapo} />
          </p>
          <p className="flex-[1_1_240px] text-[13px] leading-[1.7] text-ink-400">{CATALOGUE.chapoMention}</p>
        </div>
      </section>

      {/* Bloc 3 — recherche par nom et tri. Carte des lieux : à venir (géocodage des adresses, Sprint 8). */}
      {!vide && (
        <section className="z-30 border-b border-line bg-white lg:sticky lg:top-[var(--header-h)]">
          <FormAuto
            action={action}
            libelleBouton="Rechercher"
            className="container-public flex flex-wrap items-center gap-2.5 py-3.5"
          >
            {versQuery({ ...f, q: "", tri: "pertinence", page: 1 })
              .slice(1)
              .split("&")
              .filter(Boolean)
              .map((kv) => {
                const [k, v] = kv.split("=").map(decodeURIComponent);
                return <input key={kv} type="hidden" name={k} value={v} />;
              })}
            <label className="flex min-w-0 flex-[1_1_320px] items-center gap-2.5 rounded-full border border-line bg-cream-100 px-[18px] py-3">
              <span
                aria-hidden="true"
                className="relative block size-[15px] flex-none rounded-full border-[1.6px] border-ink-400"
              >
                <span className="absolute -right-[5px] -bottom-1 block h-[1.6px] w-[7px] rotate-45 bg-ink-400" />
              </span>
              <input
                type="search"
                name="q"
                defaultValue={f.q}
                placeholder="Nom d'un organisme"
                aria-label="Rechercher un organisme par son nom"
                className="min-w-0 flex-1 bg-transparent text-[15px] text-ink-900 outline-none"
              />
            </label>
            <label className="flex flex-none items-center gap-2 rounded-full border border-line bg-white px-4 py-[11px] text-sm text-ink-600">
              <span className="text-ink-400">Trier par</span>
              <select
                name="tri"
                defaultValue={f.tri}
                className="cursor-pointer bg-transparent font-semibold text-ink-900 outline-none"
              >
                <option value="pertinence">Pertinence</option>
                <option value="alpha">Ordre alphabétique</option>
                <option value="ville">Par ville</option>
              </select>
            </label>
          </FormAuto>
        </section>
      )}

      <section id="listing" className="pt-7 pb-[72px]">
        <div className="container-public flex flex-wrap items-start gap-6">
          {!vide && (
            <aside className="flex flex-[1_1_280px] flex-col gap-3 lg:sticky lg:top-[calc(var(--header-h)+84px)] lg:max-h-[calc(100vh-var(--header-h)-100px)] lg:overflow-y-auto">
              <TiroirFiltres actifs={actifs}>
                <FiltresCatalogue
                  action={action}
                  filtres={f}
                  organismes={tous}
                  departements={deptsOrdonnes}
                  groupesTitres={groupesTitres}
                  villes={villes}
                  compteurs={!!compteurs}
                />
              </TiroirFiltres>
              {/* Bande contextuelle : le filtre sert l'usage, la page éditorialisée sert le référencement. */}
              {(deptFiltre || dedie) && (
                <Link
                  href={deptFiltre ? `${base}${deptFiltre.slug}/` : `${base}${dedie!.slug}/`}
                  className="flex flex-col gap-1.5 rounded-[18px] bg-ink-900 px-5 py-[18px] text-white hover:text-white"
                >
                  <span className="text-[14.5px] leading-[1.35] font-bold">
                    {deptFiltre
                      ? `Nous avons une page dédiée à ${deptFiltre.nom}`
                      : `Voir la page dédiée au ${dedie!.libelle_court}`}
                  </span>
                  {deptFiltre && (
                    <span className="text-[13.5px] leading-[1.55] text-line-heavy">
                      Organismes, spécificités locales et démarches.
                    </span>
                  )}
                  <span className="mt-0.5 text-[13.5px] font-semibold text-brique-400">La consulter →</span>
                </Link>
              )}
            </aside>
          )}

          <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-4">
            {n > 0 && (
              <p className="text-base font-bold tracking-[-0.01em]" role="status">
                {!aDesFiltres(f)
                  ? `${n} organisme${n > 1 ? "s" : ""}`
                  : n === 1
                    ? "1 organisme correspond à votre recherche"
                    : `${n} organismes correspondent à votre recherche`}
              </p>
            )}
            <PucesFiltres {...contexte} />

            {vide ? (
              <div className="flex flex-col gap-3 rounded-[20px] border border-line bg-white p-[clamp(24px,3vw,34px)]">
                <p className="text-[clamp(20px,2.2vw,24px)] font-bold tracking-[-0.02em]">{CATALOGUE_VIDE.titre}</p>
                <p className="max-w-[64ch] text-base leading-[1.7] text-ink-500">{fr(CATALOGUE_VIDE.texte)}</p>
                <Link href={`${base}#formations`} className="self-start text-[15px] font-semibold">
                  {CATALOGUE_VIDE.lien}
                </Link>
              </div>
            ) : n === 0 ? (
              <EtatZero {...contexte} tous={tous} />
            ) : n === 1 && aDesFiltres(f) ? (
              <EtatUnique {...contexte} organisme={resultats[0]} />
            ) : (
              <Grille organismes={affiches} base={base} />
            )}

            {pages > 1 && (
              <nav aria-label="Pagination" className="mt-3 flex flex-wrap items-center justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={`${action}${versQuery({ ...f, page: page - 1 })}`}
                    className="rounded-full border border-line-strong bg-white px-[18px] py-2.5 text-sm font-semibold text-ink-900"
                  >
                    Précédent
                  </Link>
                )}
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`${action}${versQuery({ ...f, page: p })}`}
                    aria-current={p === page ? "page" : undefined}
                    className={
                      p === page
                        ? "min-w-10 rounded-full bg-ink-900 px-3.5 py-2.5 text-center text-sm font-bold text-white hover:text-white"
                        : "min-w-10 rounded-full border border-line bg-white px-3.5 py-2.5 text-center text-sm font-semibold text-ink-600 hover:border-ink-900 hover:text-ink-900"
                    }
                  >
                    {p}
                  </Link>
                ))}
                {page < pages && (
                  <Link
                    href={`${action}${versQuery({ ...f, page: page + 1 })}`}
                    className="rounded-full border border-line-strong bg-white px-[18px] py-2.5 text-sm font-semibold text-ink-900"
                  >
                    Suivant
                  </Link>
                )}
                <span className="mt-1.5 w-full text-center font-mono text-[12.5px] text-ink-400">
                  Page {page} sur {pages}
                </span>
              </nav>
            )}

            {/* Encadré de lancement (Copy catalogue §16), sans formulaire : la recherche par nom suffit. */}
            {!compteurs && !vide && (
              <div className="mt-3 flex flex-col gap-2 rounded-[20px] border border-line bg-cream-200 p-[clamp(22px,2.6vw,30px)]">
                <p className="text-[19px] font-bold tracking-[-0.015em]">
                  Vous ne trouvez pas le centre que vous cherchez{" "}?
                </p>
                <p className="text-[15px] leading-[1.6] text-ink-500">
                  Notre annuaire se construit progressivement. Consultez les pages consacrées à chaque titre de
                  formation.
                </p>
                <Link href={`${base}#formations`} className="self-start text-[15px] font-semibold">
                  Voir les formations →
                </Link>
              </div>
            )}

            <div className="mt-3 flex flex-wrap items-center justify-between gap-[18px] rounded-[20px] border border-line bg-white p-[clamp(22px,2.6vw,30px)]">
              <div className="flex flex-col gap-1.5">
                <p className="text-[19px] font-bold tracking-[-0.015em]">
                  Vous dirigez un organisme de formation{" "}?
                </p>
                <p className="text-[15px] leading-[1.6] text-ink-500">
                  Le référencement est gratuit. Créez la fiche de votre centre et gérez-la vous-même.
                </p>
              </div>
              <Link
                href={`${base}referencer-mon-organisme/`}
                className="rounded-full bg-ink-900 px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-brique-700 hover:text-white"
              >
                Référencer mon organisme →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sous le seuil, le corps éditorial remonte juste après le listing (Copy catalogue §16). */}
      {!compteurs && guide}

      {piliers.length > 0 && (
        <section className="border-t border-line bg-white py-[72px]">
          <div className="container-public">
            <h2 className="text-[clamp(26px,2.9vw,34px)] leading-[1.15] font-bold tracking-[-0.025em]">
              Chercher par titre de formation
            </h2>
            <p className="mt-3 max-w-[64ch] text-base leading-[1.65] text-ink-500">
              Chaque titre dispose d&apos;une page dédiée{" "}: programme, conditions d&apos;accès, durée réglementaire
              et organismes qui le préparent.
            </p>
            <ul className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))] gap-2.5">
              {piliers.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`${base}${t.slug}/`}
                    className="flex items-center justify-between gap-3 rounded-[14px] border border-line bg-cream-100 px-[18px] py-[15px] text-[15px] font-semibold text-ink-900 hover:border-ink-900 hover:text-ink-900"
                  >
                    {t.libelle_court}
                    {compteurs && (
                      <span className="font-mono text-xs text-ink-400">{compteurs.parTitre.get(t.slug) ?? 0}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {deptsPublies.length > 0 && (
        <section className="bg-white pb-[72px]">
          <div className="container-public">
            <h2 className="text-[clamp(26px,2.9vw,34px)] leading-[1.15] font-bold tracking-[-0.025em]">
              Chercher par département
            </h2>
            <p className="mt-3 max-w-[64ch] text-base leading-[1.65] text-ink-500">
              La formation se déroule en présentiel{" "}: la proximité du centre compte.
            </p>
            <ul className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))] gap-2.5">
              {deptsPublies.map((d) => (
                <li key={d.code}>
                  <Link
                    href={`${base}${d.slug}/`}
                    className="flex rounded-[14px] border border-line bg-cream-100 px-[18px] py-[15px] text-[15px] font-semibold text-ink-900 hover:border-ink-900 hover:text-ink-900"
                  >
                    {d.nom} ({d.code})
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {compteurs && guide}

      <Faq titre="Questions fréquentes sur le choix d'un organisme" questions={FAQ_CATALOGUE} />
    </main>
  );
}
