import { conditionsCommunes } from "./communs";
import { macA3p } from "./mac-a3p";
import { macAps } from "./mac-aps";
import { macCyno } from "./mac-cyno";
import { recyclageSsiap1 } from "./recyclage-ssiap-1";
import { recyclageSsiap2 } from "./recyclage-ssiap-2";
import { recyclageSsiap3 } from "./recyclage-ssiap-3";
import { ssiap1 } from "./ssiap-1";
import { ssiap2 } from "./ssiap-2";
import { ssiap3 } from "./ssiap-3";
import { tfpA3p } from "./tfp-a3p";
import { tfpAps } from "./tfp-aps";
import { tfpAsa } from "./tfp-asa";
import { tfpAsc } from "./tfp-asc";
import { sansMarqueur } from "../../marqueurs";
import { contenuVerifie, type ContenuPilier } from "./types";

/** Contenu rédigé, par slug du référentiel. Un titre absent d'ici n'a pas de page. */
export const PILIERS: Record<string, ContenuPilier> = {
  "tfp-aps": tfpAps,
  "mac-aps": macAps,
  "ssiap-1": ssiap1,
  "ssiap-2": ssiap2,
  "ssiap-3": ssiap3,
  "recyclage-ssiap-1": recyclageSsiap1,
  "recyclage-ssiap-2": recyclageSsiap2,
  "recyclage-ssiap-3": recyclageSsiap3,
  "tfp-asc": tfpAsc,
  "mac-cyno": macCyno,
  "tfp-asa": tfpAsa,
  "tfp-a3p": tfpA3p,
  "mac-a3p": macA3p,
};

/**
 * Une page pilier est visible en production seulement si : publiée en base, contenu rédigé, aucun « à vérifier ».
 * Hors production (dev, preprod, local) : tout contenu rédigé est prévisualisable (pages noindex).
 */
export function pilierVisible(titre: { slug: string; page_publiee: boolean }, production: boolean): boolean {
  const contenu = PILIERS[titre.slug];
  if (!contenu) return false;
  return production
    ? titre.page_publiee && contenuVerifie(contenu) && sansMarqueur(conditionsCommunes(titre.slug))
    : true;
}

/** H1 (Copy piliers §5) : « [court] — [long] », sans doubler l'acronyme si le libellé long le porte déjà. */
export function h1Pilier(titre: { libelle_court: string; libelle_long: string }, contenu: ContenuPilier): string {
  if (contenu.h1) return contenu.h1;
  const { libelle_court: court, libelle_long: long } = titre;
  return long.startsWith(court) ? long : `${court} — ${long}`;
}
