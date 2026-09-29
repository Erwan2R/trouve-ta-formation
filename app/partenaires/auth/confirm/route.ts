import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { origineEspace } from "@/lib/espace-serveur";
import { supabaseAdmin, supabaseServeur } from "@/lib/supabase/serveur";

/**
 * Liens reçus par email (validation d'adresse, changement d'email, mot de passe oublié) : le jeton est vérifié,
 * la session ouverte, puis la publication recalculée (la validation de l'email peut mettre la fiche en ligne).
 */
export async function GET(requete: NextRequest) {
  const { searchParams } = requete.nextUrl;
  const jeton = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  // Hôte d'origine (sous-domaine), pas l'URL interne réécrite par le middleware.
  const origine = await origineEspace();
  const vers = (chemin: string) => NextResponse.redirect(new URL(chemin, origine));
  if (!jeton || !type) return vers("/connexion/?erreur=lien");

  const supabase = await supabaseServeur();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash: jeton });
  if (error) return vers("/connexion/?erreur=lien");
  if (type === "recovery") {
    // Le lien de réinitialisation prouve la possession de l'adresse : il la valide aussi (décision Erwan 29/09/2026).
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const admin = supabaseAdmin();
      const { data: c } = await admin
        .from("comptes_organisme")
        .update({ email_verifie_le: new Date().toISOString() })
        .eq("id", user.id)
        .is("email_verifie_le", null)
        .select("organisme_id")
        .maybeSingle();
      if (c) await admin.rpc("maj_publication_organisme", { p_org: c.organisme_id });
    }
    // Mot de passe oublié : le nouveau mot de passe se choisit sans l'actuel pendant 15 minutes.
    const r = vers("/parametres/?mot-de-passe=nouveau");
    r.cookies.set("reinitialisation", "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: origine.startsWith("https:"),
      maxAge: 900,
      path: "/",
    });
    return r;
  }
  await supabase.rpc("maj_publication");
  return vers(type === "email_change" ? "/parametres/?email=confirme" : "/dashboard/?email=confirme");
}
