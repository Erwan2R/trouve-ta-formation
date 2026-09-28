import { sansMarqueur } from "@/contenu/marqueurs";
import { autorisationPrealable } from "./autorisation-prealable";
import { carteProfessionnelle } from "./carte-professionnelle";
import { LISTE_DEMARCHES } from "./liste";
import { renouvellement } from "./renouvellement";
import type { ContenuDemarche } from "./types";

export const DEMARCHES: Record<string, ContenuDemarche> = {
  "autorisation-prealable": autorisationPrealable,
  "carte-professionnelle": carteProfessionnelle,
  "renouvellement-carte-professionnelle": renouvellement,
};

type DonneesDemarche = { slug: string; page_publiee: boolean; verifie_le: string | null };

/**
 * Production : publiée, datée (vérifiée par Erwan) et sans aucun marqueur, contenu comme données en base.
 * Hors production : tout contenu rédigé est prévisualisable (noindex).
 */
export function demarcheVisible(d: DonneesDemarche, production: boolean): boolean {
  const contenu = DEMARCHES[d.slug];
  if (!contenu) return false;
  return production ? d.page_publiee && d.verifie_le !== null && sansMarqueur(contenu) && sansMarqueur(d) : true;
}

/** La page de liste n'existe que si au moins une démarche est visible et que son propre texte est finalisé. */
export function listeDemarchesVisible(visibles: number, production: boolean): boolean {
  return visibles > 0 && (!production || sansMarqueur(LISTE_DEMARCHES));
}
