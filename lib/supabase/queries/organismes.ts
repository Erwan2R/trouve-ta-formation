import "server-only";
import { cache } from "react";
import { EST_PRODUCTION } from "@/lib/env";
import { palier, type Palier } from "@/lib/organismes/completude";
import { departementDuCodePostal } from "@/lib/organismes/libelles";
import { supabasePublic } from "../client";
import type { Tables } from "../types";

export type Lieu = Pick<Tables<"lieux">, "id" | "nom" | "adresse" | "code_postal" | "ville" | "est_siege"> & {
  departement: string;
};

export type Offre = Pick<
  Tables<"organisme_titres">,
  "id" | "slug" | "prix_min" | "prix_max" | "prix_compris" | "duree_heures" | "rythmes" | "financements" | "inscription"
> & {
  titre: { slug: string; libelle_court: string; libelle_long: string; ordre: number };
  /** Lieux où l'offre est dispensée ; vide = siège. */
  lieux: Lieu[];
};

/** Satisfait structurellement OrganismeFiltrable (filtres du catalogue). */
export type Organisme = Omit<Tables<"organismes">, "score_completude"> & {
    titres: string[];
    rythmes: string[];
    lieux: Lieu[];
    siege: Lieu | null;
    offres: Offre[];
    palier: Palier;
  };

const SELECT = `*,
  lieux (id, nom, adresse, code_postal, ville, est_siege),
  organisme_titres (
    id, slug, prix_min, prix_max, prix_compris, duree_heures, rythmes, financements, inscription,
    titres_referentiel (slug, libelle_court, libelle_long, ordre),
    offre_lieux (lieu_id)
  )`;

/**
 * Organismes publiés (RLS : statut « publie », offres des seuls titres actifs).
 * Production : jamais d'organisme de test (décision Erwan 01/10/2026 — rien n'est publié sans inscription).
 */
export const getOrganismes = cache(async (): Promise<Organisme[]> => {
  let requete = supabasePublic().from("organismes").select(SELECT);
  if (EST_PRODUCTION) requete = requete.eq("est_test", false);
  const { data, error } = await requete;
  if (error) throw error;

  return data.map(({ lieux: lieuxBruts, organisme_titres, score_completude: _ignore, ...o }) => {
    const lieux: Lieu[] = lieuxBruts
      .map((l) => ({ ...l, departement: departementDuCodePostal(l.code_postal) }))
      .sort((a, b) => Number(b.est_siege) - Number(a.est_siege) || a.id - b.id);
    const offres: Offre[] = organisme_titres
      .map(({ titres_referentiel, offre_lieux, ...offre }) => ({
        ...offre,
        titre: titres_referentiel,
        lieux: lieux.filter((l) => offre_lieux.some((ol) => ol.lieu_id === l.id)),
      }))
      .sort((a, b) => a.titre.ordre - b.titre.ordre); // ordre du référentiel, jamais celui de saisie
    return {
      ...o,
      lieux,
      siege: lieux.find((l) => l.est_siege) ?? lieux[0] ?? null,
      offres,
      titres: offres.map((x) => x.titre.slug),
      financements: [...new Set([...o.financements, ...offres.flatMap((x) => x.financements)])],
      rythmes: [...new Set(offres.flatMap((x) => x.rythmes))],
      palier: palier({ ...o, nbFormations: offres.length }),
    };
  });
});

export async function getOrganisme(slug: string): Promise<Organisme | null> {
  return (await getOrganismes()).find((o) => o.slug === slug) ?? null;
}
