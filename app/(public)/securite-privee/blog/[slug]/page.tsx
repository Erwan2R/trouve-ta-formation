import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CarteArticle, minutesDeLecture } from "@/components/public/blog/CarteArticle";
import { CorpsArticle } from "@/components/public/blog/CorpsArticle";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { BLOG, libelleCategorie, SEUIL_MOTS_SOMMAIRE } from "@/contenu/securite-privee/blog";
import { ancres } from "@/lib/blog/document";
import { VERTICALES } from "@/lib/config/verticales";
import { dateLongue } from "@/lib/format-date";
import { monogramme } from "@/lib/organismes/libelles";
import { JsonLd } from "@/lib/seo/json-ld";
import { absoluteUrl, buildMetadata, SITE_URL } from "@/lib/seo/metadata";
import { cheminArticle, getArticle, getArticles, getCheminsVisibles } from "@/lib/supabase/queries/blog";
import { fr } from "@/lib/typo";

const verticale = VERTICALES["securite-privee"];
const base = `/${verticale.slug}/`;
const surtitre = "font-mono text-[10.5px] tracking-[0.12em] uppercase";
const carte = "flex flex-col gap-3.5 rounded-[22px] border border-line bg-white p-[clamp(22px,3vw,30px)]";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await getArticle((await params).slug);
  if (!a) return {};
  // Copy blog §4 : le titre de l'article, sans suffixe de marque ; version courte saisie si le H1 dépasse 60 caractères.
  const meta = buildMetadata({
    title: a.titre_seo || a.titre,
    description: a.meta_description ?? "",
    path: cheminArticle(a.slug),
  });
  return {
    ...meta,
    title: { absolute: a.titre_seo || a.titre },
    openGraph: {
      ...meta.openGraph,
      type: "article",
      publishedTime: a.publie_le ?? undefined,
      modifiedTime: a.maj_le ?? undefined,
      ...(a.couverture_url && { images: [{ url: a.couverture_url, alt: a.couverture_alt ?? "" }] }),
    },
  };
}

/** Même jour calendaire (heure de Paris) : la date de mise à jour ne s'affiche que si elle diffère (Copy §5). */
const memeJour = (a: string, b: string) => dateLongue(a) === dateLongue(b);

export default async function PageArticle({ params }: Props) {
  const a = await getArticle((await params).slug);
  // Article dépublié ou ancien slug : le middleware répond avant (301 ou 410). Ici, slug réellement inconnu.
  if (!a) notFound();
  const [visibles, tous] = await Promise.all([getCheminsVisibles(), getArticles()]);
  const long = a.mots > SEUIL_MOTS_SOMMAIRE;
  const sommaire = long ? ancres(a.corps) : [];
  const lies = a.lies.flatMap((id) => tous.filter((x) => x.id === id && x.id !== a.id)).slice(0, 3);
  const misAJour = a.maj_le && a.publie_le && !memeJour(a.maj_le, a.publie_le) ? a.maj_le : null;
  // Accroche contextuelle saisie dans l'éditeur ; générique seulement si les champs sont vides (décision Erwan).
  const contextuelle = !!(a.accroche_question && a.accroche_lien && a.accroche_cible && visibles.has(a.accroche_cible));
  const accroche = contextuelle
    ? { question: a.accroche_question!, phrase: a.accroche_phrase, lien: a.accroche_lien!, cible: a.accroche_cible! }
    : { ...BLOG.article.accrocheGenerique, phrase: null };
  const url = absoluteUrl(cheminArticle(a.slug));

  return (
    <main>
      <JsonLd
        data={{
          "@type": "BlogPosting",
          "@id": `${url}#article`,
          headline: a.titre,
          description: a.meta_description ?? undefined,
          url,
          mainEntityOfPage: url,
          inLanguage: "fr-FR",
          datePublished: a.publie_le ?? undefined,
          dateModified: a.maj_le ?? a.publie_le ?? undefined,
          wordCount: a.mots,
          articleSection: libelleCategorie(a.categorie),
          ...(a.couverture_url && { image: a.couverture_url }),
          ...(a.auteur && {
            author: {
              "@type": "Person",
              name: a.auteur.nom,
              jobTitle: a.auteur.qualification,
              ...(a.auteur.biographie && { description: a.auteur.biographie }),
            },
          }),
          publisher: { "@id": `${SITE_URL}/#organization` },
        }}
      />

      {/* Blocs 1 et 2 — fil d'Ariane, en-tête */}
      <section className="border-b border-line-strong bg-cream-200">
        <div className="container-public flex flex-col gap-4 pt-[18px] pb-11">
          <Breadcrumb
            items={[
              { name: verticale.nom, path: base },
              { name: "Blog", path: `${base}blog/` },
              { name: a.titre, path: cheminArticle(a.slug) },
            ]}
          />
          <div className="mt-6 flex max-w-[820px] flex-col gap-4">
            <Link
              href={`${base}blog/#${a.categorie}`}
              className={`inline-flex items-center gap-2 self-start rounded-full border border-line-strong bg-white px-3.5 py-2 ${surtitre} text-ink-600 hover:border-ink-900 hover:text-ink-900`}
            >
              <span aria-hidden="true" className="block size-1.5 rounded-full bg-brique-700" />
              {libelleCategorie(a.categorie)}
            </Link>
            <h1 className="text-[clamp(32px,4.4vw,54px)] leading-[1.04] font-bold tracking-[-0.035em] text-balance">
              {fr(a.titre)}
            </h1>
            <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[12.5px] text-ink-400">
              {a.publie_le && (
                <span>
                  {BLOG.article.publie} <time dateTime={a.publie_le}>{dateLongue(a.publie_le)}</time>
                </span>
              )}
              {misAJour && (
                <span>
                  · {BLOG.article.misAJour} <time dateTime={misAJour}>{dateLongue(misAJour)}</time>
                </span>
              )}
              <span>· {BLOG.article.lecture(minutesDeLecture(a.mots))}</span>
            </p>
            {a.reglementaire && a.verifie_le && (
              <p className="font-mono text-[12.5px] text-ink-600">
                {BLOG.article.verifie} <time dateTime={a.verifie_le}>{dateLongue(a.verifie_le)}</time>
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-cream-100">
        <div className="container-public pt-12 pb-16">
          <div className="flex flex-col gap-[38px] lg:grid lg:grid-cols-[minmax(0,700px)_240px] lg:items-start lg:gap-x-16">
            {/* Bloc 3 — L'essentiel (articles de plus de 1000 mots) */}
            {long && a.essentiel.length > 0 && (
              <aside className={`${carte} lg:col-start-1`}>
                <h2 className={`${surtitre} text-brique-700`}>{BLOG.article.essentiel}</h2>
                <ul className="flex flex-col">
                  {a.essentiel.map((e) => (
                    <li
                      key={e}
                      className="flex gap-3 border-b border-[#F0ECE6] py-2.5 text-[16px] leading-[1.55] text-ink-900 last:border-b-0"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[9px] block size-1.5 flex-none rounded-full bg-brique-700"
                      />
                      {fr(e)}
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            {/* Bloc 4 — Dans cet article (au-delà de 1000 mots), ancres en dur */}
            {sommaire.length > 1 && (
              <nav
                aria-labelledby="dans-cet-article"
                className="flex flex-col gap-3 border-y border-line-strong py-5 lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:border-y-0 lg:border-l lg:py-1 lg:pl-6"
              >
                <h2 id="dans-cet-article" className={`${surtitre} text-ink-400`}>
                  {BLOG.article.sommaire}
                </h2>
                <ol className="flex flex-col gap-1.5">
                  {sommaire.map((s) => (
                    <li key={s.id} className={s.niveau === 3 ? "pl-5" : ""}>
                      <a
                        href={`#${s.id}`}
                        className={`text-ink-700 hover:text-brique-700 ${s.niveau === 2 ? "text-[15.5px] font-semibold" : "text-[14.5px]"}`}
                      >
                        {fr(s.texte)}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <div className="flex min-w-0 flex-col gap-[38px] lg:col-start-1">
              {/* Bloc 5 — Corps */}
              <article>
                <CorpsArticle doc={a.corps} visibles={visibles} />
              </article>

              {/* Bloc 6 — À retenir */}
              {a.a_retenir.length > 0 && (
                <aside className="flex flex-col gap-3 rounded-[22px] bg-ink-900 p-[clamp(22px,3vw,30px)] text-white">
                  <h2 className={`${surtitre} text-brique-400`}>{BLOG.article.aRetenir}</h2>
                  <ol className="flex flex-col gap-2.5">
                    {a.a_retenir.map((r, i) => (
                      <li key={r} className="flex gap-3.5 text-[16.5px] leading-[1.55] text-on-dark-strong">
                        <span className="flex-none pt-[3px] font-mono text-[12px] text-brique-400">0{i + 1}</span>
                        {fr(r)}
                      </li>
                    ))}
                  </ol>
                </aside>
              )}

              {/* Bloc 7 — Auteur (pas de photo : monogramme, jamais une photo inventée) */}
              {a.auteur && (
                <section
                  aria-label="Auteur de l'article"
                  className="flex flex-wrap items-start gap-4 border-t border-line-strong pt-7"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-14 flex-none items-center justify-center rounded-full bg-cream-200 font-mono text-sm text-ink-600"
                  >
                    {monogramme(a.auteur.nom)}
                  </span>
                  <div className="flex min-w-[min(100%,240px)] flex-1 flex-col gap-1">
                    <span className="text-[17px] font-bold">{a.auteur.nom}</span>
                    <span className="text-[14.5px] text-ink-500">{fr(a.auteur.qualification)}</span>
                    {a.auteur.biographie && (
                      <p className="mt-1 max-w-[62ch] text-[15px] leading-[1.6] text-ink-700">
                        {fr(a.auteur.biographie)}
                      </p>
                    )}
                  </div>
                </section>
              )}

              {/* Bloc 8 — Accroche formation contextuelle */}
              <aside className="flex flex-col gap-3 rounded-[22px] border border-line bg-white p-[clamp(22px,3vw,30px)]">
                <p className="text-[clamp(20px,2.2vw,24px)] leading-[1.2] font-bold tracking-[-0.02em] text-balance">
                  {fr(accroche.question)}
                </p>
                {accroche.phrase && (
                  <p className="max-w-[62ch] text-base leading-[1.6] text-ink-700">{fr(accroche.phrase)}</p>
                )}
                <Link
                  href={accroche.cible}
                  rel={contextuelle ? undefined : "nofollow"}
                  className="inline-flex items-center gap-2 self-start rounded-full bg-ink-900 px-5 py-3 text-[15px] font-bold text-white hover:bg-brique-700 hover:text-white"
                >
                  {fr(accroche.lien)} <span aria-hidden="true">→</span>
                </Link>
              </aside>

              {/* Bloc 9 — À lire aussi */}
              {lies.length > 0 && (
                <section className="flex flex-col gap-4">
                  <h2 className="text-[clamp(22px,2.4vw,28px)] leading-[1.15] font-bold tracking-[-0.02em]">
                    {BLOG.article.aLireAussi}
                  </h2>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,240px),1fr))] gap-3.5">
                    {lies.map((l) => (
                      <CarteArticle key={l.id} article={l} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
