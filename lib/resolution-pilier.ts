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
 * Titre → page pilier (décision Erwan 30/09/2026) :
 * actif avec page → page ; archivé remplacé (remplaçant avec page) → redirection permanente ;
 * archivé non remplacé avec page → page + mention « plus délivré depuis » et lien vers le titre proche.
 */
export function resoudrePilier<T extends TitreResolu>(slug: string, titres: T[]): ResolutionPilier<T> | null {
  const titre = titres.find((t) => t.slug === slug);
  if (!titre) return null;
  const parId = (id: number | null) => titres.find((t) => t.id === id && t.a_une_page) ?? null;
  if (titre.statut === "archive") {
    const remplacant = parId(titre.remplace_par_id);
    if (remplacant) return { type: "redirection", vers: remplacant };
    if (!titre.a_une_page) return null;
    return { type: "page", titre, archive: { depuis: titre.archive_le ?? "", proche: parId(titre.titre_proche_id) } };
  }
  return titre.a_une_page ? { type: "page", titre, archive: null } : null;
}
