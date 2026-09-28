import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BarreActions } from "@/components/public/organisme/BarreActions";
import { CarteOrganisme } from "@/components/public/organisme/CarteOrganisme";
import { ColonneFiche } from "@/components/public/organisme/ColonneFiche";
import { EnTeteFiche } from "@/components/public/organisme/EnTeteFiche";
import { OffresFiche } from "@/components/public/organisme/OffresFiche";
import { VERTICALES, type Verticale } from "@/lib/config/verticales";
import { RANG_PALIER, estIndexable } from "@/lib/organismes/completude";
import { autresOrganismes, faqFiche, metaFiche } from "@/lib/organismes/fiche";
import { JsonLd } from "@/lib/seo/json-ld";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { getOrganisme, getOrganismes } from "@/lib/supabase/queries/organismes";
import { getDepartements, getTitres } from "@/lib/supabase/queries/referentiel";
import { fr } from "@/lib/typo";

const verticale: Verticale = VERTICALES["securite-privee"];
const base = `/${verticale.slug}/`;

// Les fiches changent au rythme des organismes : régénération au plus toutes les heures.
export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getOrganismes()).map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const o = await getOrganisme((await params).slug);
  if (!o) return {};
  const m = metaFiche(o);
  return buildMetadata({
    title: m.title,
    description: m.description,
    path: `${base}organismes/${o.slug}/`,
    // Palier Basique : noindex jusqu'à enrichissement, accessible par lien direct (UX fiche §6).
    noindex: !estIndexable(o.palier),
    og: { title: o.nom, description: m.ogDescription },
  });
}

const h2 = "text-[clamp(22px,2.4vw,28px)] leading-[1.15] font-bold tracking-[-0.02em]";

export default async function FicheOrganisme({ params }: Props) {
  const o = await getOrganisme((await params).slug);
  if (!o) notFound();
  const [tous, titres, departements] = await Promise.all([getOrganismes(), getTitres(), getDepartements()]);
  const titresParSlug = new Map(titres.map((t) => [t.slug, t]));
  const titresAvecPage = o.offres.map((x) => titresParSlug.get(x.titre.slug)).filter((t) => t?.a_une_page);
  const autres = autresOrganismes(o, tous, (x) => RANG_PALIER[x.palier]);
  const dept = departements.find((d) => d.code === autres.departement);
  const faq = faqFiche(o);
  // « Formations dispensées ici » seulement si les titres diffèrent d'un site à l'autre (Copy fiche §7).
  const titresParLieu = (lieuId: number) =>
    o.offres
      .filter((x) => (x.lieux.length ? x.lieux.some((l) => l.id === lieuId) : lieuId === o.siege?.id))
      .map((x) => x.titre.libelle_court);
  const sitesDifferents = new Set(o.lieux.map((l) => titresParLieu(l.id).join("|"))).size > 1;

  return (
    <main className="max-lg:pb-20">
      <JsonLd
        data={{
          "@type": "EducationalOrganization",
          name: o.nom,
          url: absoluteUrl(`${base}organismes/${o.slug}/`),
          ...(o.telephone && { telephone: o.telephone }),
          ...(o.email_contact && { email: o.email_contact }),
          ...(o.site_web && { sameAs: [o.site_web] }),
          ...(o.presentation && { description: o.presentation }),
          address: o.lieux.map((l) => ({
            "@type": "PostalAddress",
            streetAddress: l.adresse,
            postalCode: l.code_postal,
            addressLocality: l.ville,
            addressCountry: "FR",
          })),
          ...(o.offres.length > 0 && {
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Formations proposées",
              itemListElement: o.offres.map((x, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: x.titre.libelle_long,
                url: absoluteUrl(`${base}organismes/${o.slug}/#${x.slug}`),
              })),
            },
          }),
        }}
      />
      {o.est_test && (
        <p className="bg-ink-900 px-7 py-2 text-center font-mono text-xs tracking-[0.08em] text-white uppercase">
          Organisme fictif de test — jamais publié en production
        </p>
      )}
      <EnTeteFiche organisme={o} base={base} />
      <BarreActions organisme={o} />

      <section className="bg-cream-100">
        <div className="container-public flex flex-wrap items-start gap-[clamp(24px,3vw,44px)] pt-11 pb-16">
          <div className="flex min-w-[min(100%,300px)] flex-[999_1_560px] flex-col gap-12">
            {/* Bloc 4 — présentation sans intertitre ; absente = bloc masqué, jamais de texte généré. */}
            {o.presentation && (
              <p className="max-w-[70ch] text-[19px] leading-[1.7] text-pretty text-ink-700">{fr(o.presentation)}</p>
            )}

            <OffresFiche organisme={o} base={base} titres={titresParSlug} />

            <div className="flex flex-col gap-[18px]">
              <h2 id="lieux" className={`${h2} scroll-mt-40`}>
                {o.lieux.length > 1 ? "Lieux de formation" : "Adresse"}
              </h2>
              <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-3">
                {o.lieux.map((l) => (
                  <li
                    key={l.id}
                    className="flex flex-col gap-[5px] rounded-[18px] border border-line bg-white px-[18px] py-4"
                  >
                    <span className="text-[15px] font-bold">{l.nom ?? (l.est_siege ? "Siège" : l.ville)}</span>
                    <span className="text-sm leading-[1.55] text-ink-500">
                      {l.adresse}, {l.code_postal} {l.ville}
                    </span>
                    {sitesDifferents && titresParLieu(l.id).length > 0 && (
                      <span className="text-[13px] leading-[1.55] text-ink-400">
                        Formations dispensées ici{" "}: {titresParLieu(l.id).join(", ")}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="text-[12.5px] leading-[1.65] text-ink-300">
                Les adresses sont déclarées par l&apos;organisme. Confirmez le lieu exact de votre session lors de votre
                inscription.
              </p>
            </div>

            {titresAvecPage.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <h2 className={h2}>En savoir plus sur ces formations</h2>
                <p className="mt-2 mb-[18px] text-[15.5px] leading-[1.6] text-ink-500">
                  Programme, conditions d&apos;accès et durée réglementaire de chaque titre.
                </p>
                <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-2.5">
                  {titresAvecPage.map((t) => (
                    <li key={t!.slug}>
                      <Link
                        href={`${base}${t!.slug}/`}
                        className="flex items-center justify-between gap-3 rounded-[14px] border border-line bg-white px-[18px] py-4 text-[15.5px] font-semibold text-ink-900 hover:border-ink-900 hover:text-ink-900"
                      >
                        {t!.libelle_court}
                        <span aria-hidden="true" className="text-brique-700">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bloc 11 — questions identiques d'une fiche à l'autre : pas de balisage FAQPage (Copy fiche §12). */}
            <div className="flex flex-col gap-[18px]">
              <h2 className={h2}>Questions fréquentes</h2>
              <div className="flex flex-col border-t border-[#DFD9D2]">
                {faq.map((q) => (
                  <details key={q.question} className="border-b border-[#DFD9D2]">
                    <summary className="flex cursor-pointer items-start justify-between gap-5 py-[19px] text-[16.5px] leading-[1.4] font-semibold">
                      <h3>{fr(q.question)}</h3>
                      <span aria-hidden="true" className="flex-none text-lg text-brique-700">
                        +
                      </span>
                    </summary>
                    <p className="mb-5 pr-10 text-base leading-[1.7] text-ink-500">{fr(q.reponse)}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          <ColonneFiche organisme={o} />
        </div>
      </section>

      {autres.liste.length > 0 && (
        <section className="border-t border-line bg-white">
          <div className="container-public py-14">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
              <h2 className={h2}>Autres organismes {dept ? dept.forme_de : "d'Île-de-France"}</h2>
              {dept && (
                <Link
                  href={dept.a_une_page ? `${base}${dept.slug}/` : `${base}organismes/?dept=${dept.code}`}
                  className="text-[14.5px] font-semibold"
                >
                  Voir tous les organismes {dept.forme_de} →
                </Link>
              )}
            </div>
            <ol className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-3.5">
              {autres.liste.map((x) => (
                <li key={x.id}>
                  <CarteOrganisme organisme={x} base={base} fond="creme" />
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}
    </main>
  );
}
