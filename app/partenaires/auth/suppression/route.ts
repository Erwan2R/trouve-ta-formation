import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { origineEspace } from "@/lib/espace-serveur";
import { supabaseAdmin, supabaseServeur } from "@/lib/supabase/serveur";

/**
 * Après la suppression d'un compte : cookies de session effacés et pages publiques régénérées sans attendre
 * (retrait immédiat de la fiche, UX Paramètres §3). Sans effet de bord pour un visiteur quelconque.
 */
export async function GET(requete: NextRequest) {
  const supabase = await supabaseServeur();
  await supabase.auth.signOut({ scope: "local" });
  // Fiche nommée par son URL exacte : revalidatePath("/securite-privee", "layout") seul la laissait en cache jusqu'à
  // une heure (audit e2e du 14/10/2026). Uniquement si l'organisme n'existe plus : rien à forcer pour un visiteur.
  const fiche = requete.nextUrl.searchParams.get("fiche");
  if (fiche && /^[a-z0-9-]{1,120}$/.test(fiche)) {
    const { data } = await supabaseAdmin().from("organismes").select("id").eq("slug", fiche).maybeSingle();
    if (!data) revalidatePath(`/securite-privee/organismes/${fiche}/`);
  }
  revalidatePath("/securite-privee/organismes/");
  revalidatePath("/securite-privee", "layout");
  return NextResponse.redirect(new URL("/compte-supprime/", await origineEspace()));
}
