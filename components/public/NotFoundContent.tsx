import Link from "next/link";
import { PAGE_404 } from "@/contenu/erreurs-racine";

export type Sortie = { titre: string; liens: { href: string; libelle: string }[] };

/**
 * Page d'erreur (Copy 404 §8) : un H1, une phrase, des sorties. Ni illustration, ni recherche, ni redirection
 * automatique, ni code d'erreur en gros caractères. Les groupes de sorties ne contiennent que des pages servies.
 * Réutilisée pour l'article retiré (410) avec son propre titre, son texte et un bouton.
 */
export function NotFoundContent({
  titre = PAGE_404.h1,
  texte = PAGE_404.explication,
  sorties,
  action,
}: {
  titre?: string;
  texte?: React.ReactNode;
  sorties: Sortie[];
  action?: { href: string; libelle: string };
}) {
  const groupes = sorties.filter((s) => s.liens.length > 0);
  return (
    <main data-page-404 className="container-public w-full flex-1 py-[clamp(56px,9vw,88px)]">
      <div className="max-w-[760px]">
        <h1 className="text-[clamp(32px,4.4vw,54px)] leading-[1.06] font-bold tracking-[-0.03em] text-balance">
          {titre}
        </h1>
        <p className="mt-5 max-w-[620px] text-[17px] leading-[1.6] text-ink-600">{texte}</p>
        {action && (
          <Link
            href={action.href}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-3 text-[15px] font-bold text-white hover:bg-brique-700 hover:text-white"
          >
            {action.libelle} <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>

      {groupes.length > 0 && (
        <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-x-10 gap-y-8 border-t border-line pt-10">
          {groupes.map((g) => (
            <div key={g.titre} className="flex flex-col gap-3">
              <h2 className="eyebrow text-ink-400">{g.titre}</h2>
              <ul className="flex flex-col gap-2">
                {g.liens.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[16px] font-semibold text-ink-900 hover:text-brique-700">
                      {l.libelle}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
