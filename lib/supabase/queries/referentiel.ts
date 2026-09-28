import "server-only";
import { cache } from "react";
import { pilierVisible } from "@/contenu/securite-privee/piliers";
import { EST_PRODUCTION } from "@/lib/env";
import { supabasePublic } from "../client";
import type { Tables } from "../types";

export type Titre = Pick<
  Tables<"titres_referentiel">,
  | "id"
  | "slug"
  | "libelle_court"
  | "libelle_long"
  | "categorie"
  | "statut"
  | "page_publiee"
  | "duree"
  | "accroche"
  | "created_at"
  | "archive_le"
  | "remplace_par_id"
  | "titre_proche_id"
> & {
  /** La page pilier est visible (et donc liable) dans cet environnement : seule source de vérité pour les liens. */
  a_une_page: boolean;
};
export type Departement = Pick<Tables<"departements">, "code" | "slug" | "nom" | "page_publiee">;

// cache() : header, footer et page partagent la même requête pendant un rendu.
/** Tous les titres, archivés compris (résolution des URL des pages piliers). */
export const getTousLesTitres = cache(async (): Promise<Titre[]> => {
  const { data, error } = await supabasePublic()
    .from("titres_referentiel")
    .select(
      "id, slug, libelle_court, libelle_long, categorie, statut, page_publiee, duree, accroche, created_at, archive_le, remplace_par_id, titre_proche_id",
    )
    .order("ordre");
  if (error) throw error;
  return data.map((t) => ({ ...t, a_une_page: pilierVisible(t, EST_PRODUCTION) }));
});

/** Titres actifs : les seuls à figurer dans les listes, grilles, menus, maillages et le formulaire. */
export async function getTitres(): Promise<Titre[]> {
  return (await getTousLesTitres()).filter((t) => t.statut === "actif");
}

/** Titres actifs groupés par catégorie, dans l'ordre d'apparition. */
export async function getTitresParCategorie(): Promise<{ categorie: string; titres: Titre[] }[]> {
  const groupes = new Map<string, Titre[]>();
  for (const t of await getTitres()) groupes.set(t.categorie, [...(groupes.get(t.categorie) ?? []), t]);
  return [...groupes].map(([categorie, titres]) => ({ categorie, titres }));
}

export const getDepartements = cache(async (): Promise<Departement[]> => {
  const { data, error } = await supabasePublic().from("departements").select("code, slug, nom, page_publiee");
  if (error) throw error;
  return data;
});
