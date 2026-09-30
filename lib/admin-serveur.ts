import "server-only";
import { notFound } from "next/navigation";
import { cache } from "react";
import { type EtatAdmin, lireSessionAdmin } from "./admin-acces";
import { supabaseServeur } from "./supabase/serveur";

const session = cache(async () => {
  const supabase = await supabaseServeur();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user, ...(await lireSessionAdmin(supabase, user)) };
});

/**
 * Garde de chaque page et action de l'espace admin, en plus du middleware : administrateur, second facteur vérifié,
 * session de moins de 8 heures. Les données passent ensuite par le client service role (supabaseAdmin).
 * `admis` : états tolérés en plus de « ok » (la page Paramètres s'ouvre avant la configuration du 2FA).
 */
export async function exigerAdmin(...admis: EtatAdmin[]) {
  const s = await session();
  if (!s.user || !s.admin || (s.etat !== "ok" && !admis.includes(s.etat))) notFound();
  return { supabase: s.supabase, user: s.user, admin: s.admin, etat: s.etat };
}
