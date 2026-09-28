import "server-only";
import { revalidatePath } from "next/cache";
import { RANG_PALIER, type Palier } from "@/lib/organismes/completude";
import { getEspaceFrais } from "./espace";

export type Retour = { ok: true; heure: string } | { ok: false; erreur: string };

const heure = () =>
  new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" }).format(new Date());

/**
 * Après chaque enregistrement de l'espace : statut de publication recalculé (instantané, UX Dashboard §6),
 * meilleur palier retenu pour signaler un recul, pages publiques régénérées.
 */
export async function apresEnregistrement(): Promise<Retour> {
  const { supabase, organisme, palier } = await getEspaceFrais();
  await supabase.rpc("maj_publication");
  if (RANG_PALIER[palier] > RANG_PALIER[organisme.palier_max as Palier])
    await supabase.from("organismes").update({ palier_max: palier }).eq("id", organisme.id);
  revalidatePath(`/securite-privee/organismes/${organisme.slug}/`);
  revalidatePath("/securite-privee/organismes/");
  revalidatePath("/partenaires", "layout");
  return { ok: true, heure: heure() };
}
