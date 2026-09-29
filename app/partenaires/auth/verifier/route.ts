import { NextResponse, type NextRequest } from "next/server";
import { origineEspace } from "@/lib/espace-serveur";
import { hacher } from "@/lib/supabase/queries/liens-email";
import { supabaseAdmin } from "@/lib/supabase/serveur";

/**
 * Clic sur un lien reçu par email (validation d'adresse ou changement d'email). Usage unique, 24 h.
 * Valide l'adresse, puis recalcule la publication : la fiche peut passer en ligne sans que l'organisme soit connecté.
 */
export async function GET(requete: NextRequest) {
  const origine = await origineEspace();
  const vers = (chemin: string) => NextResponse.redirect(new URL(chemin, origine));
  const jeton = requete.nextUrl.searchParams.get("t");
  if (!jeton || jeton.length > 100) return vers("/connexion/?erreur=lien");

  const admin = supabaseAdmin();
  const maintenant = new Date().toISOString();
  // Consommation atomique : un lien déjà utilisé ou expiré ne correspond à aucune ligne.
  const { data: lien } = await admin
    .from("liens_email")
    .update({ utilise_le: maintenant })
    .eq("jeton_hash", hacher(jeton))
    .is("utilise_le", null)
    .gt("expire_le", maintenant)
    .select("compte_id, type, email, comptes_organisme (organisme_id)")
    .maybeSingle();
  if (!lien) return vers("/connexion/?erreur=lien");

  const { data: u } = await admin.auth.admin.getUserById(lien.compte_id);
  if (!u.user) return vers("/connexion/?erreur=lien");
  if (lien.type === "validation") {
    // Adresse changée depuis l'envoi : ce lien ne prouve plus rien.
    if (u.user.email?.toLowerCase() !== lien.email.toLowerCase()) return vers("/connexion/?erreur=lien");
  } else {
    // Changement d'email : la nouvelle adresse n'est prise en compte qu'ici, après confirmation.
    const { error } = await admin.auth.admin.updateUserById(lien.compte_id, { email: lien.email, email_confirm: true });
    if (error) {
      console.error("Changement d'email :", error.message);
      return vers("/parametres/?email=indisponible");
    }
  }
  await admin.from("comptes_organisme").update({ email_verifie_le: maintenant }).eq("id", lien.compte_id);
  await admin.rpc("maj_publication_organisme", { p_org: lien.comptes_organisme.organisme_id });
  return vers(lien.type === "validation" ? "/dashboard/?email=confirme" : "/parametres/?email=confirme");
}
