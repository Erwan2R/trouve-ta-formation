"use server";

import { supabaseServeur } from "@/lib/supabase/serveur";

/**
 * `vers` : page où envoyer le navigateur. Jamais redirect() dans une action serveur de l'espace : Next.js rendrait
 * la page cible sans repasser par le middleware du sous-domaine (404).
 */
export type EtatFormulaire = { erreur?: string; ok?: string; vers?: string; valeurs?: Record<string, string> } | null;

export async function seConnecter(_: EtatFormulaire, donnees: FormData): Promise<EtatFormulaire> {
  const email = String(donnees.get("email") ?? "").trim();
  const motDePasse = String(donnees.get("mot_de_passe") ?? "");
  const supabase = await supabaseServeur();
  const { error } = await supabase.auth.signInWithPassword({ email, password: motDePasse });
  // Message unique : ne révèle pas si l'adresse a un compte.
  if (error) return { erreur: "Adresse email ou mot de passe incorrect.", valeurs: { email } };
  return { vers: "/dashboard/" };
}
