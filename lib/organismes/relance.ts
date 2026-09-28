import type { DonneesCompletude, Palier } from "./completude";

/**
 * Checklist de relance du tableau de bord (UX Dashboard §3, maquette) : au plus 3 actions, classées par impact.
 * Basique → ce qui manque pour Correct (formations d'abord) ; Correct → éléments d'Optimal, agrément et Qualiopi
 * d'abord ; Optimal → aucune action inventée.
 */
export type Action =
  | "formations"
  | "financements"
  | "presentation"
  | "cnaps"
  | "qualiopi"
  | "siret"
  | "logo"
  | "accessibilite"
  | "horaires"
  | "siteweb";

const OPTIMAL: Action[] = ["cnaps", "qualiopi", "siret", "logo", "accessibilite", "horaires", "siteweb"];
const rempli = (v: string | null) => !!v && v.trim() !== "";

export function elementsOptimal(o: DonneesCompletude): Record<Action, boolean> {
  return {
    formations: o.nbFormations > 0,
    financements: o.financements.length > 0,
    presentation: rempli(o.presentation),
    cnaps: rempli(o.numero_agrement_cnaps),
    qualiopi: o.qualiopi,
    siret: rempli(o.siret),
    logo: rempli(o.logo_url),
    accessibilite: o.accessibilite_pmr,
    horaires: rempli(o.horaires),
    siteweb: rempli(o.site_web),
  };
}

export function actionsRelance(o: DonneesCompletude, p: Palier): Action[] {
  const fait = elementsOptimal(o);
  if (p === "basique") return (["formations", "financements", "presentation"] as Action[]).filter((k) => !fait[k]);
  if (p === "correct") return OPTIMAL.filter((k) => !fait[k]).slice(0, 3);
  return [];
}

/** Éléments d'Optimal encore à renseigner pour l'atteindre (au moins 5 sur 7). */
export const manquantsOptimal = (o: DonneesCompletude) =>
  Math.max(0, 5 - OPTIMAL.filter((k) => elementsOptimal(o)[k]).length);
