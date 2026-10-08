import { sansMarqueur } from "../../marqueurs";
import { essonne } from "./essonne";
import { hautsDeSeine } from "./hauts-de-seine";
import { paris } from "./paris";
import { seineEtMarne } from "./seine-et-marne";
import { seineSaintDenis } from "./seine-saint-denis";
import { valDeMarne } from "./val-de-marne";
import { valDOise } from "./val-d-oise";
import { yvelines } from "./yvelines";
import type { ContenuDepartement } from "./types";

/** Contenu rédigé par slug de département. Un département absent d'ici n'a pas de page. */
export const DEPARTEMENTS: Record<string, ContenuDepartement> = {
  paris,
  "seine-et-marne": seineEtMarne,
  yvelines,
  essonne,
  "hauts-de-seine": hautsDeSeine,
  "seine-saint-denis": seineSaintDenis,
  "val-de-marne": valDeMarne,
  "val-d-oise": valDOise,
};

/** Mots du bloc 7, à titre indicatif dans l’admin (objectif de la Copy géo §13 : 300). La publication dépend de la validation. */
export const motsBloc7 = (c: ContenuDepartement) =>
  c.seFormer
    .flatMap((s) => s.paragraphes)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

export type SeuilPage = { organismes: number; palier_min: "basique" | "correct" | "optimal" };

/**
 * Une page département existe si (décisions Erwan 01/10/2026 + UX géo §6-7) :
 *  - le département compte au moins `seuil.organismes` organismes au palier requis, lieu dans le département ;
 *  - son contenu propre est rédigé, sans aucun marqueur, et son bloc 7 validé par l’administrateur dans l’admin
 *    (décision Erwan du 08/10/2026 : la validation remplace le compteur de 300 mots, resté indicatif).
 * Hors production (dev, preprod, local), tout contenu rédigé est prévisualisable même sous le seuil, pour la relecture
 * (décision Erwan du 07/10/2026) ; ces environnements sont entièrement en noindex.
 */
export function departementVisible(
  departement: { slug: string; bloc7_valide: boolean },
  organismesQualifies: number,
  seuil: SeuilPage,
  production: boolean,
): boolean {
  const contenu = DEPARTEMENTS[departement.slug];
  if (!contenu) return false;
  if (!production) return true;
  return organismesQualifies >= seuil.organismes && sansMarqueur(contenu) && departement.bloc7_valide;
}
