import "server-only";
import { cache } from "react";
import { supabasePublic } from "../client";

export type TitreNav = { slug: string; libelle_court: string; categorie: string; page_publiee: boolean };
export type DepartementNav = { code: string; slug: string; nom: string; page_publiee: boolean };

/** Titres actifs, dans l'ordre du référentiel, groupés par catégorie (ordre d'apparition conservé). */
// cache() : header et footer partagent la même requête pendant un rendu.
export const getTitresParCategorie = cache(async (): Promise<{ categorie: string; titres: TitreNav[] }[]> => {
  const { data, error } = await supabasePublic()
    .from("titres_referentiel")
    .select("slug, libelle_court, categorie, page_publiee")
    .order("ordre");
  if (error) throw error;
  const groupes = new Map<string, TitreNav[]>();
  for (const t of data) groupes.set(t.categorie, [...(groupes.get(t.categorie) ?? []), t]);
  return [...groupes].map(([categorie, titres]) => ({ categorie, titres }));
});

export async function getDepartements(): Promise<DepartementNav[]> {
  const { data, error } = await supabasePublic().from("departements").select("code, slug, nom, page_publiee");
  if (error) throw error;
  return data;
}
