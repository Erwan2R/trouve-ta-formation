/**
 * Paliers de complétude (UX_Dashboard_Organisme §2). Seuils posés par la spec, « à confirmer » :
 * centralisés ici pour être ajustés en un seul endroit.
 *  - Basique : minimum publiable (nom, adresse du siège, un moyen de contact) → fiche en noindex.
 *  - Correct : Basique + ≥ 1 formation + (financements OU présentation) → indexable.
 *  - Optimal : Correct + ≥ 5 des 7 éléments (logo, SIRET, agrément CNAPS, Qualiopi, horaires, accessibilité, site web).
 */
export const SEUILS_COMPLETUDE = { formationsMin: 1, optimalMin: 5 } as const;

export type Palier = "basique" | "correct" | "optimal";

export type DonneesCompletude = {
  nbFormations: number;
  financements: string[];
  presentation: string | null;
  logo_url: string | null;
  siret: string | null;
  numero_agrement_cnaps: string | null;
  qualiopi: boolean;
  horaires: string | null;
  accessibilite_pmr: boolean;
  site_web: string | null;
};

const rempli = (v: string | null) => !!v && v.trim() !== "";

export function palier(o: DonneesCompletude): Palier {
  const correct =
    o.nbFormations >= SEUILS_COMPLETUDE.formationsMin && (o.financements.length > 0 || rempli(o.presentation));
  if (!correct) return "basique";
  const optionnels = [
    rempli(o.logo_url),
    rempli(o.siret),
    rempli(o.numero_agrement_cnaps),
    o.qualiopi,
    rempli(o.horaires),
    o.accessibilite_pmr,
    rempli(o.site_web),
  ].filter(Boolean).length;
  return optionnels >= SEUILS_COMPLETUDE.optimalMin ? "optimal" : "correct";
}

/** Une fiche au palier Basique n'a pas assez de substance pour être indexée. */
export const estIndexable = (p: Palier) => p !== "basique";

/** Rang pour le tri « Pertinence » (jamais affiché sous ce nom). */
export const RANG_PALIER: Record<Palier, number> = { optimal: 2, correct: 1, basique: 0 };
