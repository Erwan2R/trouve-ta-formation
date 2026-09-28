import "server-only";
import { cache } from "react";
import { pilierVisible } from "@/contenu/securite-privee/piliers";
import { EST_PRODUCTION } from "@/lib/env";
import { supabasePublic } from "../client";
import type { Tables } from "../types";

export type Titre = Pick<
  Tables<"titres_referentiel">,
  "slug" | "libelle_court" | "libelle_long" | "categorie" | "page_publiee" | "duree" | "accroche" | "created_at"
> & {
  /** La page pilier est visible (et donc liable) dans cet environnement : seule source de vérité pour les liens. */
  a_une_page: boolean;
};
export type Departement = Pick<Tables<"departements">, "code" | "slug" | "nom" | "page_publiee">;

// cache() : header, footer et page partagent la même requête pendant un rendu.
/** Titres actifs (RLS), dans l'ordre du référentiel. */
export const getTitres = cache(async (): Promise<Titre[]> => {
  const { data, error } = await supabasePublic()
    .from("titres_referentiel")
    .select("slug, libelle_court, libelle_long, categorie, page_publiee, duree, accroche, created_at")
    .order("ordre");
  if (error) throw error;
  return data.map((t) => ({ ...t, a_une_page: pilierVisible(t, EST_PRODUCTION) }));
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
