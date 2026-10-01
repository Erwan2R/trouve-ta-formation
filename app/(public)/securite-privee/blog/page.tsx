import type { Metadata } from "next";
import Link from "next/link";
import { CarteArticle } from "@/components/public/blog/CarteArticle";
import { FiltreCategories } from "@/components/public/blog/FiltreCategories";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { ARTICLES_PAR_PAGE, BLOG, CATEGORIES_BLOG } from "@/contenu/securite-privee/blog";
import { VERTICALES } from "@/lib/config/verticales";
import { JsonLd } from "@/lib/seo/json-ld";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { cheminArticle, getArticles } from "@/lib/supabase/queries/blog";
import { getDemarches } from "@/lib/supabase/queries/demarches";
import { getTitres } from "@/lib/supabase/queries/referentiel";
import { fr } from "@/lib/typo";

const verticale = VERTICALES["securite-privee"];
const base = `/${verticale.slug}/`;
const chemin = `${base}blog/`;

type Props = { searchParams: Promise<{ page?: string }> };

const numeroPage = (p: string | undefined) => Math.max(1, Number.parseInt(p ?? "1", 10) || 1);

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const page = numeroPage((await searchParams).page);
  const vide = (await getArticles()).length === 0;
  // Pagination : chaque page s'auto-canonise, jamais de canonical vers la page 1 (UX blog §3.6).
  const meta = buildMetadata({
    title: BLOG.liste.title,
    description: BLOG.liste.description,
    path: page > 1 ? `${chemin}?page=${page}` : chemin,
    noindex: vide,
  });
  return { ...meta, title: { absolute: BLOG.liste.title } };
}

export default async function PageBlog({ searchParams }: Props) {
  const page = numeroPage((await searchParams).page);
  const [articles, titres, { demarches, listeVisible: listeDemarches }] = await Promise.all([
    getArticles(),
    getTitres(),
    getDemarches(verticale),
  ]);
  // Article mis en avant : choisi dans l'admin (le plus stratégique), à défaut le plus récent.
  const enAvant = articles.find((a) => a.mis_en_avant) ?? articles[0] ?? null;
  const reste = articles.filter((a) => a !== enAvant);
  const pages = Math.max(1, Math.ceil(reste.length / ARTICLES_PAR_PAGE));
  const affiches = reste.slice((page - 1) * ARTICLES_PAR_PAGE, page * ARTICLES_PAR_PAGE);
  const formations = titres.filter((t) => t.a_une_page);
  const demarchesVisibles = demarches.filter((d) => d.a_une_page);

  return (
    <main>
      {affiches.length > 0 && (
        <JsonLd
          data={{
            "@type": "ItemList",
            itemListElement: [...(page === 1 && enAvant ? [enAvant] : []), ...affiches].map((a, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: absoluteUrl(cheminArticle(a.slug)),
              name: a.titre,
            })),
          }}
        />
      )}

      {/* Blocs 1 et 2 — fil d'Ariane, H1, chapô */}
      <section className="border-b border-line-strong bg-cream-200">
        <div className="container-public flex flex-col gap-4 pt-[18px] pb-11">
          <Breadcrumb
            items={[
              { name: verticale.nom, path: base },
              { name: "Blog", path: chemin },
            ]}
          />
          <div className="mt-6 flex max-w-[780px] flex-col gap-4">
            <h1 className="text-[clamp(34px,4.6vw,58px)] leading-[1.02] font-bold tracking-[-0.04em] text-balance">
              {BLOG.liste.h1}
            </h1>
            {BLOG.liste.chapo.map((p) => (
              <p key={p} className="max-w-[66ch] text-[17px] leading-[1.65] text-pretty text-ink-700">
                {fr(p)}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-100">
        <div className="container-public flex flex-col gap-8 pt-10 pb-16">
          {articles.length === 0 ? (
            <div className="flex flex-col gap-4 rounded-[18px] border border-line bg-white p-6">
              <p className="max-w-[66ch] text-base leading-[1.6] text-ink-600">{BLOG.liste.vide}</p>
              {(formations.length > 0 || listeDemarches) && (
                <span className="flex flex-wrap gap-2">
                  {formations.length > 0 && (
                    <Link
                      href={`${base}#formations`}
                      className="rounded-full bg-ink-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-brique-700 hover:text-white"
                    >
                      {BLOG.liste.videFormations} →
                    </Link>
                  )}
                  {listeDemarches && (
                    <Link
                      href={`${base}demarches/`}
                      className="rounded-full border border-line-strong bg-white px-4 py-2.5 text-sm font-bold text-ink-900 hover:border-ink-900"
                    >
                      {BLOG.liste.videDemarches} →
                    </Link>
                  )}
                </span>
              )}
            </div>
          ) : (
            <>
              {/* Bloc 3 — filtres */}
              <FiltreCategories
                presentes={CATEGORIES_BLOG.map((c) => c.cle).filter((c) => articles.some((a) => a.categorie === c))}
              />

              {/* Bloc 4 — article mis en avant (aucun libellé de bloc, Copy §3) */}
              {page === 1 && enAvant && (
                <div id="article-en-avant">
                  <CarteArticle article={enAvant} grand />
                </div>
              )}

              {/* Bloc 5 — listing, du plus récent au plus ancien */}
              <div id="listing-blog" className="flex flex-col gap-4">
                <h2 id="titre-listing" hidden className="text-[clamp(22px,2.4vw,28px)] font-bold tracking-[-0.02em]" />
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-3.5">
                  {(page === 1 ? [enAvant!, ...affiches] : affiches).map((a) => (
                    // L'article mis en avant figure aussi dans le listing, masqué tant qu'aucun filtre n'est actif.
                    <li key={a.id} hidden={page === 1 && a === enAvant} data-en-avant={a === enAvant || undefined}>
                      <CarteArticle article={a} />
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bloc 6 — pagination numérotée, liens en dur */}
              {pages > 1 && (
                <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-2">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={p === 1 ? chemin : `${chemin}?page=${p}`}
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
                </nav>
              )}
            </>
          )}

          {/* Bloc 7 — Aller plus loin : formations publiées, démarches */}
          {(formations.length > 0 || demarchesVisibles.length > 0) && (
            <section className="mt-4 flex flex-col gap-5 border-t border-line-strong pt-10">
              <h2 className="text-[clamp(24px,2.8vw,32px)] leading-[1.1] font-bold tracking-[-0.025em]">
                {BLOG.liste.allerPlusLoin}
              </h2>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-8">
                {formations.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <h3 className="eyebrow text-ink-400">{BLOG.liste.colonneFormations}</h3>
                    <ul className="flex flex-col gap-2">
                      {formations.map((t) => (
                        <li key={t.slug}>
                          <Link
                            href={`${base}${t.slug}/`}
                            className="text-[15.5px] font-semibold text-ink-900 hover:text-brique-700"
                          >
                            {t.libelle_court}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {demarchesVisibles.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <h3 className="eyebrow text-ink-400">{BLOG.liste.colonneDemarches}</h3>
                    <ul className="flex flex-col gap-2">
                      {demarchesVisibles.map((d) => (
                        <li key={d.slug}>
                          <Link
                            href={`${base}demarches/${d.slug}/`}
                            className="text-[15.5px] font-semibold text-ink-900 hover:text-brique-700"
                          >
                            {d.libelle}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
