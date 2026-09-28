import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseServeur } from "@/lib/supabase/serveur";

/**
 * Liens reçus par email (validation d'adresse, changement d'email, mot de passe oublié) : le jeton est vérifié,
 * la session ouverte, puis la publication recalculée (la validation de l'email peut mettre la fiche en ligne).
 */
export async function GET(requete: NextRequest) {
  const { searchParams } = requete.nextUrl;
  const jeton = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const vers = (chemin: string) => NextResponse.redirect(new URL(chemin, requete.url));
  if (!jeton || !type) return vers("/connexion/?erreur=lien");

  const supabase = await supabaseServeur();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash: jeton });
  if (error) return vers("/connexion/?erreur=lien");
  if (type === "recovery") return vers("/parametres/?mot-de-passe=nouveau");
  await supabase.rpc("maj_publication");
  return vers(type === "email_change" ? "/parametres/?email=confirme" : "/dashboard/?email=confirme");
}
