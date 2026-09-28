import "server-only";
import { cache } from "react";
import { supabasePublic } from "../client";
import type { Tables } from "../types";

export type Titre = Pick<
  Tables<"titres_referentiel">,
  "slug" | "libelle_court" | "categorie" | "page_publiee" | "duree" | "accroche" | "created_at"
>;
export type Departement = Pick<Tables<"departements">, "code" | "slug" | "nom" | "page_publiee">;

// cache() : header, footer et page partagent la même requête pendant un rendu.
/** Titres actifs (RLS), dans l'ordre du référentiel. */
export const getTitres = cache(async (): Promise<Titre[]> => {
  const { data, error } = await supabasePublic()
    .from("titres_referentiel")
    .select("slug, libelle_court, categorie, page_publiee, duree, accroche, created_at")
    .order("ordre");
  if (error) throw error;
  return data;
});

/** Même liste, groupée par catégorie dans l'ordre d'apparition. */
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
