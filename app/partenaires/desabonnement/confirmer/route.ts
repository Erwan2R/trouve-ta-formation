import { NextResponse, type NextRequest } from "next/server";
import { lireJetonDesabonnement } from "@/lib/desabonnement";
import { origineEspace } from "@/lib/espace-serveur";
import { supabaseAdmin } from "@/lib/supabase/serveur";

/**
 * Désabonnement des rappels, sans connexion. Deux appelants : le bouton de la page /desabonnement/ (redirection vers
 * la confirmation) et la messagerie du destinataire (désabonnement en un clic, RFC 8058, réponse 200).
 */
export async function POST(requete: NextRequest) {
  const jeton = requete.nextUrl.searchParams.get("t");
  const id = lireJetonDesabonnement(jeton);
  const corps = await requete.text().catch(() => "");
  const messagerie = corps.includes("List-Unsubscribe=One-Click");
  if (id)
    await supabaseAdmin()
      .from("organismes")
      .update({ rappels_desabonne_le: new Date().toISOString() })
      .eq("id", id)
      .is("rappels_desabonne_le", null);
  if (messagerie) return new NextResponse(null, { status: id ? 200 : 400 });
  const vers = new URL(`/desabonnement/?t=${encodeURIComponent(jeton ?? "")}&fait=1`, await origineEspace());
  return NextResponse.redirect(vers, 303);
}
