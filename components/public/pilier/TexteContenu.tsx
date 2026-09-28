import { A_VERIFIER } from "@/contenu/securite-privee/piliers/types";
import { fr } from "@/lib/typo";

/** Texte éditorial : typographie française + marqueurs « à vérifier » rendus visibles (brouillons hors production). */
export function TexteContenu({ texte }: { texte: string }) {
  const [avant, ...reste] = fr(texte).split(A_VERIFIER);
  return (
    <>
      {avant}
      {reste.map((apres, i) => (
        <span key={i}>
          <span className="font-mono text-[12.5px] text-brique-700">{A_VERIFIER}</span>
          {apres}
        </span>
      ))}
    </>
  );
}
