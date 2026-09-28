import Link from "next/link";
import type { Verticale } from "@/lib/config/verticales";
import { URL_ESPACE_ORGANISME } from "@/lib/espace";
import { getDemarches } from "@/lib/supabase/queries/demarches";
import { getTitresParCategorie } from "@/lib/supabase/queries/referentiel";
import { Logo } from "./Logo";

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
          <Logo height={27} priority />
          <span className="border-l border-line pl-3 font-mono text-[10.5px] tracking-[0.12em] text-ink-400 uppercase">
            {verticale.nom}
          </span>
        </Link>

        <nav
          aria-label="Navigation principale"
          className="order-last mx-auto flex max-w-full [scrollbar-width:none] items-center gap-1 overflow-x-auto rounded-full border border-line bg-white p-[5px] lg:order-none"
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
          className="ml-auto flex-none rounded-full bg-ink-900 px-5 py-[11px] text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-brique-700 hover:text-white lg:ml-0"
        >
          Espace organisme
        </a>
      </div>
    </header>
  );
}
