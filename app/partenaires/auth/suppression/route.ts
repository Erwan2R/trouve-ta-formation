import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { origineEspace } from "@/lib/espace-serveur";
import { supabaseServeur } from "@/lib/supabase/serveur";

/**
 * Après la suppression d'un compte : cookies de session effacés et pages publiques régénérées sans attendre
 * (retrait immédiat de la fiche, UX Paramètres §3). Sans effet de bord pour un visiteur quelconque.
 */
export async function GET() {
  const supabase = await supabaseServeur();
  await supabase.auth.signOut({ scope: "local" });
  revalidatePath("/securite-privee", "layout");
  return NextResponse.redirect(new URL("/compte-supprime/", await origineEspace()));
}
