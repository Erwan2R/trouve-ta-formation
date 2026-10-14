import Link from "next/link";
import type { Verticale } from "@/lib/config/verticales";
import { URL_ESPACE_ORGANISME } from "@/lib/espace";
import { getDemarches } from "@/lib/supabase/queries/demarches";
import { getTitresParCategorie } from "@/lib/supabase/queries/referentiel";
import { Logo } from "./Logo";
import { MenuMobile } from "./MenuMobile";

const navLink =
  "whitespace-nowrap rounded-full px-4 py-[9px] text-sm font-medium text-ink-600 transition-colors hover:bg-cream-200 hover:text-ink-900";

// Méga-menu en <details> natif : tous les liens sont dans le HTML serveur, aucun JS (UX accueil §1).
export async function SiteHeader({ verticale }: { verticale: Verticale }) {
  const [groupes, { listeVisible }] = await Promise.all([getTitresParCategorie(), getDemarches(verticale)]);
  const base = `/${verticale.slug}/`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream-100/88 backdrop-blur-md">
      <div className="relative container-public flex flex-wrap items-center gap-x-6 gap-y-3 py-4">
        <Link href={base} className="flex items-center gap-3 text-ink-900 hover:text-ink-900">
          {/* 36 px au lieu des 27 px du handoff (§12) : demande d'Erwan, logo jugé trop petit. */}
          <Logo height={36} priority />
          <span className="border-l border-line pl-3 font-mono text-[10.5px] tracking-[0.12em] text-ink-400 uppercase max-[400px]:hidden">
            {verticale.nom}
          </span>
        </Link>

        <nav
          aria-label="Navigation principale"
          className="mx-auto hidden items-center gap-1 rounded-full border border-line bg-white p-[5px] xl:flex"
        >
          <details className="group">
            <summary className="flex cursor-pointer items-center gap-1.5 rounded-full bg-cream-200 px-4 py-[9px] text-sm font-semibold whitespace-nowrap text-ink-900">
              Les formations <span className="text-[10px] text-ink-400">▾</span>
            </summary>
            <div className="absolute inset-x-7 top-full z-50 mt-2 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-7 rounded-[20px] border border-line bg-white p-7 shadow-menu">
              {groupes.map((g) => (
                <div key={g.categorie} className="flex flex-col gap-2.5">
                  <span className="font-mono text-[10.5px] tracking-[0.14em] text-ink-400 uppercase">
                    {g.categorie}
                  </span>
                  {g.titres.map((t) =>
                    t.a_une_page ? (
                      <Link
                        key={t.slug}
                        href={`${base}${t.slug}/`}
                        className="text-[15px] font-medium text-ink-900 hover:text-brique-700"
                      >
                        {t.libelle_court}
                      </Link>
                    ) : (
                      <span key={t.slug} className="text-[15px] font-medium text-ink-200">
                        {t.libelle_court}
                      </span>
                    ),
                  )}
                </div>
              ))}
            </div>
          </details>
          <Link href={`${base}organismes/`} className={navLink}>
            Organismes
          </Link>
          {listeVisible && (
            <Link href={`${base}demarches/`} className={navLink}>
              Démarches CNAPS
            </Link>
          )}
          <Link href={`${base}blog/`} className={navLink}>
            Blog
          </Link>
        </nav>

        <a
          href={`${URL_ESPACE_ORGANISME}/`}
          className="hidden flex-none rounded-full bg-ink-900 px-5 py-[11px] text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-brique-700 hover:text-white xl:block"
        >
          Espace organisme
        </a>

        {/* Mobile et tablette (< 1280 px) : la barre de navigation ne tient pas, elle passe dans un menu burger. */}
        <MenuMobile>
          <summary
            aria-label="Menu"
            className="flex size-11 cursor-pointer list-none flex-col items-center justify-center gap-[5px] rounded-full border border-line bg-white [&::-webkit-details-marker]:hidden"
          >
            <span className="h-[1.5px] w-[18px] rounded-full bg-ink-900 transition-transform group-open:translate-y-[6.5px] group-open:rotate-45" />
            <span className="h-[1.5px] w-[18px] rounded-full bg-ink-900 transition-opacity group-open:opacity-0" />
            <span className="h-[1.5px] w-[18px] rounded-full bg-ink-900 transition-transform group-open:-translate-y-[6.5px] group-open:-rotate-45" />
          </summary>
          <nav
            aria-label="Navigation principale (mobile)"
            className="absolute inset-x-4 top-full z-50 mt-2 flex max-h-[calc(100dvh-96px)] flex-col gap-6 overflow-y-auto rounded-[20px] border border-line bg-white p-6 shadow-menu"
          >
            <div className="flex flex-col gap-4">
              <span className="text-[15px] font-bold text-ink-900">Les formations</span>
              <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                {groupes.map((g) => (
                  <div key={g.categorie} className="flex flex-col gap-2">
                    <span className="font-mono text-[10.5px] tracking-[0.14em] text-ink-400 uppercase">
                      {g.categorie}
                    </span>
                    {g.titres
                      .filter((t) => t.a_une_page)
                      .map((t) => (
                        <Link
                          key={t.slug}
                          href={`${base}${t.slug}/`}
                          className="text-[15px] font-medium text-ink-900 hover:text-brique-700"
                        >
                          {t.libelle_court}
                        </Link>
                      ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col border-t border-line pt-2">
              <Link href={`${base}organismes/`} className="py-3 text-[15px] font-semibold text-ink-900">
                Organismes
              </Link>
              {listeVisible && (
                <Link href={`${base}demarches/`} className="py-3 text-[15px] font-semibold text-ink-900">
                  Démarches CNAPS
                </Link>
              )}
              <Link href={`${base}blog/`} className="py-3 text-[15px] font-semibold text-ink-900">
                Blog
              </Link>
            </div>
            <a
              href={`${URL_ESPACE_ORGANISME}/`}
              className="rounded-full bg-ink-900 px-5 py-3.5 text-center text-sm font-semibold text-white hover:bg-brique-700 hover:text-white"
            >
              Espace organisme
            </a>
          </nav>
        </MenuMobile>
      </div>
    </header>
  );
}
