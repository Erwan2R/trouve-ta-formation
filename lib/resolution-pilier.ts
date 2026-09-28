type TitreResolu = {
  id: number;
  slug: string;
  statut: "actif" | "archive";
  a_une_page: boolean;
  archive_le: string | null;
  remplace_par_id: number | null;
  titre_proche_id: number | null;
};

export type ResolutionPilier<T> =
  | { type: "page"; titre: T; archive: null }
  | { type: "page"; titre: T; archive: { depuis: string; proche: T | null } }
  | { type: "redirection"; vers: T };

/**
 * Remplaçant final d'un titre archivé : on suit « remplacé par » jusqu'au premier titre actif
 * (jamais de chaîne de redirections). Null si pas de remplaçant, boucle, ou remplaçant final sans page.
 */
export function remplacantFinal<T extends TitreResolu>(titre: T, titres: T[]): T | null {
  const vus = new Set<number>([titre.id]);
  let courant = titre;
  while (courant.remplace_par_id !== null) {
    const suivant = titres.find((t) => t.id === courant.remplace_par_id);
    if (!suivant || vus.has(suivant.id)) return null;
    if (suivant.statut === "actif") return suivant.a_une_page ? suivant : null;
    vus.add(suivant.id);
    courant = suivant;
  }
  return null;
}

/**
 * Titre → page pilier (décisions Erwan 30/09 et 01/10/2026) :
 * actif avec page → page ; archivé remplacé → redirection 301 vers le titre actif final ;
 * archivé non remplacé avec page → page + mention « plus délivré depuis » et lien vers le titre proche.
 */
export function resoudrePilier<T extends TitreResolu>(slug: string, titres: T[]): ResolutionPilier<T> | null {
  const titre = titres.find((t) => t.slug === slug);
  if (!titre) return null;
  if (titre.statut === "archive") {
    const remplacant = remplacantFinal(titre, titres);
    if (remplacant) return { type: "redirection", vers: remplacant };
    if (!titre.a_une_page) return null;
    const proche = titres.find((t) => t.id === titre.titre_proche_id && t.statut === "actif" && t.a_une_page) ?? null;
    return { type: "page", titre, archive: { depuis: titre.archive_le ?? "", proche } };
  }
  return titre.a_une_page ? { type: "page", titre, archive: null } : null;
}

/** Redirections 301 générées au build (next.config.ts) : une par titre archivé remplacé. */
export function redirectionsArchivage<T extends TitreResolu>(verticale: string, titres: T[]) {
  return titres.flatMap((t) => {
    const r = t.statut === "archive" ? resoudrePilier(t.slug, titres) : null;
    return r?.type === "redirection"
      ? [{ source: `/${verticale}/${t.slug}/`, destination: `/${verticale}/${r.vers.slug}/`, statusCode: 301 as const }]
      : [];
  });
}
