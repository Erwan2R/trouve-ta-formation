/**
 * Marqueurs de contenu non finalisé. Tant qu'un contenu en contient un, la page correspondante
 * ne s'affiche jamais en production (brouillon prévisualisable sur dev/preprod uniquement).
 */
export const A_VERIFIER = "[à vérifier]";
export const A_COMPLETER = "[à compléter]";
export const MARQUEURS = [A_VERIFIER, A_COMPLETER];

/** Aucun marqueur dans l'objet, quelle que soit la profondeur. */
export function sansMarqueur(contenu: unknown): boolean {
  const texte = JSON.stringify(contenu).toLowerCase();
  return MARQUEURS.every((m) => !texte.includes(m));
}
