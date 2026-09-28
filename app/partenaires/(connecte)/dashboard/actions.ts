"use server";

import { origineEspace } from "@/lib/espace-serveur";
import { getEspace } from "@/lib/supabase/queries/espace";

/** Renvoie l'email de validation de l'adresse du compte. */
export async function renvoyerValidation(): Promise<"ok" | "erreur"> {
  const { user, supabase } = await getEspace();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: user.email,
    options: { emailRedirectTo: `${await origineEspace()}/auth/confirm/` },
  });
  if (error) console.error("Renvoi de l'email de validation :", error.message);
  return error ? "erreur" : "ok";
}
