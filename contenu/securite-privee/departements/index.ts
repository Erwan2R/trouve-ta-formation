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

/** Mots du bloc 7 : « pas de 300 mots spécifiques, pas de page » (Copy géo §13). */
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
 *  - son contenu propre est rédigé (et, en production, sans aucun marqueur).
 * Hors production (dev, preprod, local), tout contenu rédigé est prévisualisable même sous le seuil, pour la relecture
 * (décision Erwan du 07/10/2026) ; ces environnements sont entièrement en noindex.
 */
export function departementVisible(
  departement: { slug: string },
  organismesQualifies: number,
  seuil: SeuilPage,
  production: boolean,
): boolean {
  const contenu = DEPARTEMENTS[departement.slug];
  if (!contenu) return false;
  if (!production) return true;
  return organismesQualifies >= seuil.organismes && sansMarqueur(contenu) && motsBloc7(contenu) >= 300;
}
