import "server-only";
import { cache } from "react";
import { demarcheVisible, listeDemarchesVisible } from "@/contenu/securite-privee/demarches";
import type { Verticale } from "@/lib/config/verticales";
import { EST_PRODUCTION } from "@/lib/env";
import { supabasePublic } from "../client";
import type { Tables } from "../types";

export type Demarche = Verticale["demarches"][number] &
  Omit<Tables<"demarches">, "slug"> & {
    /** Page visible (donc liable) dans cet environnement : seule source de vérité pour les liens. */
    a_une_page: boolean;
  };

const lireDemarches = cache(async () => {
  const { data, error } = await supabasePublic().from("demarches").select("*");
  if (error) throw error;
  return data;
});

/** Démarches de la verticale, dans l'ordre du parcours, avec leurs données vérifiées en base. */
export async function getDemarches(
  verticale: Verticale,
): Promise<{ demarches: Demarche[]; publiees: Demarche[]; listeVisible: boolean; visibles: Set<string> }> {
  const lignes = await lireDemarches();
  const demarches = verticale.demarches.flatMap((config) => {
    const ligne = lignes.find((l) => l.slug === config.slug);
    return ligne ? [{ ...ligne, ...config, a_une_page: demarcheVisible(ligne, EST_PRODUCTION) }] : [];
  });
  // Décision Erwan 01/10/2026 : la liste ne compte que les démarches publiées (même en aperçu).
  const publiees = demarches.filter((d) => d.a_une_page && d.page_publiee);
  const listeVisible = listeDemarchesVisible(publiees.length, EST_PRODUCTION);
  // Clés pour LienContenu : slugs visibles, et "" pour la page de liste.
  const cles = new Set(demarches.filter((d) => d.a_une_page).map((d) => d.slug));
  if (listeVisible) cles.add("");
  return { demarches, publiees, listeVisible, visibles: cles };
}
