import { NextResponse, type NextRequest } from "next/server";
import { origineEspace } from "@/lib/espace-serveur";
import { hacher } from "@/lib/supabase/queries/liens-email";
import { supabaseAdmin } from "@/lib/supabase/serveur";

/** Changement d'email de l'administrateur : la nouvelle adresse n'est prise en compte qu'au clic (usage unique, 24 h). */
export async function GET(requete: NextRequest) {
  const origine = await origineEspace();
  const vers = (chemin: string) => NextResponse.redirect(new URL(chemin, origine));
  const jeton = requete.nextUrl.searchParams.get("t");
  if (!jeton || jeton.length > 100) return vers("/connexion/?erreur=lien");
  const admin = supabaseAdmin();
  const maintenant = new Date().toISOString();
  const { data: lien } = await admin
    .from("liens_email")
    .update({ utilise_le: maintenant })
    .eq("jeton_hash", hacher(jeton))
    .not("admin_id", "is", null)
    .eq("type", "changement")
    .is("utilise_le", null)
    .gt("expire_le", maintenant)
    .select("admin_id, email")
    .maybeSingle();
  if (!lien?.admin_id) return vers("/connexion/?erreur=lien");
  const { error } = await admin.auth.admin.updateUserById(lien.admin_id, { email: lien.email, email_confirm: true });
  if (error) {
    console.error("Changement d'email admin :", error.message);
    return vers("/connexion/?erreur=lien");
  }
  return vers("/parametres/?email=confirme");
}
