import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { palier, type Palier } from "@/lib/organismes/completude";
import { departementDuCodePostal } from "@/lib/organismes/libelles";
import { supabaseServeur } from "../serveur";
import type { Tables } from "../types";

export type LieuEspace = Tables<"lieux"> & { departement: string };
export type OffreEspace = Tables<"organisme_titres"> & {
  titre: Pick<Tables<"titres_referentiel">, "id" | "slug" | "libelle_court" | "libelle_long" | "categorie" | "statut" | "ordre">;
  lieux: number[];
};

const SELECT = `contact_nom, contact_telephone,
  organismes (*,
    lieux (*),
    organisme_titres (*, titres_referentiel (id, slug, libelle_court, libelle_long, categorie, statut, ordre), offre_lieux (lieu_id))
  )`;

/**
 * Compte connecté et sa fiche, quel que soit son statut (RLS propriétaire). Redirige vers la connexion sans session.
 * Les offres sur un titre archivé sont incluses : « Mes formations » les signale (décision Erwan 01/10/2026).
 */
async function lireEspace() {
  const sb = await supabaseServeur();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/connexion/");
  const { data, error } = await sb.from("comptes_organisme").select(SELECT).single();
  if (error) throw error;
  const { organismes: brut, ...compte } = data;
  const { lieux: lieuxBruts, organisme_titres, ...organisme } = brut;
  const lieux: LieuEspace[] = lieuxBruts
    .map((l) => ({ ...l, departement: departementDuCodePostal(l.code_postal) }))
    .sort((a, b) => Number(b.est_siege) - Number(a.est_siege) || a.id - b.id);
  const offres: OffreEspace[] = organisme_titres
    .map(({ titres_referentiel, offre_lieux, ...o }) => ({
      ...o,
      titre: titres_referentiel,
      lieux: offre_lieux.map((x) => x.lieu_id),
    }))
    .sort((a, b) => a.titre.ordre - b.titre.ordre);
  // Palier public : seules les offres sur un titre actif comptent (les autres ne sont jamais servies).
  const offresActives = offres.filter((o) => o.titre.statut === "actif");
  // Financements : ceux de la fiche et ceux des offres, comme sur le site public (getOrganismes).
  const financements = [...new Set([...organisme.financements, ...offresActives.flatMap((o) => o.financements)])];
  const p: Palier = palier({ ...organisme, financements, nbFormations: offresActives.length });
  return {
    user: { id: user.id, email: user.email ?? "", confirme: !!user.email_confirmed_at, nouvelEmail: user.new_email ?? null },
    compte,
    organisme,
    lieux,
    siege: lieux.find((l) => l.est_siege) ?? null,
    offres,
    offresActives,
    financements,
    palier: p,
    supabase: sb,
  };
}

export const getEspace = cache(lireEspace);
/** Relecture après une écriture (sans le cache du rendu en cours). */
export const getEspaceFrais = lireEspace;

export type Espace = Awaited<ReturnType<typeof lireEspace>>;
