import "server-only";
import { cache } from "react";
import { departementVisible } from "@/contenu/securite-privee/departements";
import { pilierVisible } from "@/contenu/securite-privee/piliers";
import { RANG_PALIER } from "@/lib/organismes/completude";
import { EST_PRODUCTION } from "@/lib/env";
import { supabasePublic } from "../client";
import type { Tables } from "../types";
import { getOrganismes } from "./organismes";
import { getSeuilPageDepartement } from "./parametres";

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
export type Departement = Pick<Tables<"departements">, "code" | "slug" | "nom" | "preposition"> & {
  /** Organismes publiés ayant au moins un lieu dans le département (tous paliers). */
  nbOrganismes: number;
  /** La page département existe dans cet environnement (seuil + contenu) : seule source de vérité pour les liens. */
  a_une_page: boolean;
};

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
  const [{ data, error }, organismes, seuil] = await Promise.all([
    supabasePublic().from("departements").select("code, slug, nom, preposition"),
    getOrganismes(),
    getSeuilPageDepartement(),
  ]);
  if (error) throw error;
  return data.map((d) => {
    const presents = organismes.filter((o) => o.lieux.some((l) => l.departement === d.code));
    const qualifies = presents.filter((o) => RANG_PALIER[o.palier] >= RANG_PALIER[seuil.palier_min]).length;
    return { ...d, nbOrganismes: presents.length, a_une_page: departementVisible(d, qualifies, seuil, EST_PRODUCTION) };
  });
});

/** « en Seine-Saint-Denis », « à Paris », « dans les Hauts-de-Seine ». */
export const dansDepartement = (d: Pick<Departement, "preposition" | "nom">) => `${d.preposition} ${d.nom}`;
