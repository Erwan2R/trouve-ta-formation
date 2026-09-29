"use server";

import { getEspaceFrais } from "@/lib/supabase/queries/espace";

/** Reprise exacte de l'accompagnement (spec Inscription §7) : étape atteinte, ou null une fois terminé. */
export async function noterEtape(etape: number | null): Promise<void> {
  const { supabase, user, compte } = await getEspaceFrais();
  if (compte.onboarding_etape === null && etape !== null) return; // parcours déjà terminé : on ne le rouvre pas
  if (etape !== null && !(Number.isInteger(etape) && etape >= 1 && etape <= 7)) return;
  await supabase.from("comptes_organisme").update({ onboarding_etape: etape }).eq("id", user.id);
}
