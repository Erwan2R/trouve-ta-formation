import { MARQUEURS } from "@/contenu/marqueurs";
import { fr } from "@/lib/typo";

// Gras **…** et marqueurs de MARQUEURS (repris en littéral pour une regex lisible).
const JETONS = /(\*\*[^*]+\*\*|\[à vérifier\]|\[à compléter\])/gi;

/**
 * Texte éditorial : typographie française, **gras** et marqueurs « à vérifier / à compléter »
 * rendus visibles (ils n'existent que dans les brouillons, jamais en production).
 */
export function TexteContenu({ texte }: { texte: string }) {
  return (
    <>
      {fr(texte)
        .split(JETONS)
        .map((morceau, i) => {
          if (morceau.startsWith("**")) return <strong key={i}>{morceau.slice(2, -2)}</strong>;
          if (MARQUEURS.includes(morceau.toLowerCase()))
            return (
              <span key={i} className="font-mono text-[12.5px] text-brique-700">
                {morceau.toLowerCase()}
              </span>
            );
          return morceau;
        })}
    </>
  );
}
