"use server";

import { getEspace } from "@/lib/supabase/queries/espace";
import { envoyerLien } from "@/lib/supabase/queries/liens-email";

/** Renvoie l'email de validation (1 envoi toutes les 2 minutes, 5 par jour et par compte). */
export async function renvoyerValidation(): Promise<{ ok: true } | { ok: false; erreur: string }> {
  const { user } = await getEspace();
  if (user.confirme) return { ok: false, erreur: "Votre adresse est déjà validée." };
  return envoyerLien(user.id, "validation", user.email);
}
