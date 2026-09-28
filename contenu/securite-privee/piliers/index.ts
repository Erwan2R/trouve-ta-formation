import { CONDITIONS_COMMUNES } from "./communs";
import { macAps } from "./mac-aps";
import { ssiap1 } from "./ssiap-1";
import { sansMarqueur } from "@/contenu/marqueurs";
import { contenuVerifie, type ContenuPilier } from "./types";

/** Contenu rédigé, par slug du référentiel. Un titre absent d'ici n'a pas de page. */
export const PILIERS: Record<string, ContenuPilier> = {
  "ssiap-1": ssiap1,
  "mac-aps": macAps,
};

const communsVerifies = sansMarqueur(CONDITIONS_COMMUNES);

/**
 * Une page pilier est visible en production seulement si : publiée en base, contenu rédigé, aucun « à vérifier ».
 * Hors production (dev, preprod, local) : tout contenu rédigé est prévisualisable (pages noindex).
 */
export function pilierVisible(titre: { slug: string; page_publiee: boolean }, production: boolean): boolean {
  const contenu = PILIERS[titre.slug];
  if (!contenu) return false;
  return production ? titre.page_publiee && contenuVerifie(contenu) && communsVerifies : true;
}

/** H1 (Copy piliers §5) : « [court] — [long] », sans doubler l'acronyme si le libellé long le porte déjà. */
export function h1Pilier(titre: { libelle_court: string; libelle_long: string }, contenu: ContenuPilier): string {
  if (contenu.h1) return contenu.h1;
  const { libelle_court: court, libelle_long: long } = titre;
  return long.startsWith(court) ? long : `${court} — ${long}`;
}
