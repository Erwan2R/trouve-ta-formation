import Link from "next/link";
import type { Lien } from "@/contenu/securite-privee/demarches/types";

/**
 * Lien éditorial résolu depuis la verticale. Vers une démarche (ou la liste « demarches/ ») non visible :
 * appel à l'action masqué, ou texte simple si `enLigne` (lien inséré dans une phrase). Jamais de lien vers une 404.
 * `demarchesVisibles` contient les slugs visibles, et "" (chaîne vide) si la page de liste l'est.
 */
export function LienContenu({
  lien,
  base,
  demarchesVisibles,
  className,
  enLigne = false,
  children,
}: {
  lien: Lien;
  base: string;
  demarchesVisibles: Set<string>;
  className?: string;
  enLigne?: boolean;
  children?: React.ReactNode;
}) {
  const contenu = children ?? lien.libelle;
  if (/^https?:\/\//.test(lien.href))
    return (
      <a href={lien.href} className={className} rel="noopener">
        {contenu}
      </a>
    );
  if (lien.href.startsWith("#"))
    return (
      <a href={lien.href} className={className}>
        {contenu}
      </a>
    );
  const demarche = lien.href.match(/^demarches\/([^/#]*)/)?.[1];
  if (demarche !== undefined && !demarchesVisibles.has(demarche)) return enLigne ? <>{contenu}</> : null;
  return (
    <Link href={`${base}${lien.href}`} className={className}>
      {contenu}
    </Link>
  );
}
