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

export type SeuilPage = { organismes: number; palier_min: "basique" | "correct" | "optimal" };

/**
 * Une page département existe si (décisions Erwan 01/10/2026 + UX géo §6-7) :
 *  - le département compte au moins `seuil.organismes` organismes au palier requis, lieu dans le département ;
 *  - son contenu propre est rédigé (et, en production, sans aucun marqueur).
 * Le seuil s'applique dans tous les environnements : une page sans inventaire n'a pas de raison d'exister.
 */
export function departementVisible(
  departement: { slug: string },
  organismesQualifies: number,
  seuil: SeuilPage,
  production: boolean,
): boolean {
  const contenu = DEPARTEMENTS[departement.slug];
  if (!contenu || organismesQualifies < seuil.organismes) return false;
  return !production || sansMarqueur(contenu);
}
