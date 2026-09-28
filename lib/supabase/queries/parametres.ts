import "server-only";
import { cache } from "react";
import type { SeuilPage } from "@/contenu/securite-privee/departements";
import { supabasePublic } from "../client";

const lireParametres = cache(async () => {
  const { data, error } = await supabasePublic().from("parametres").select("cle, valeur");
  if (error) throw error;
  return new Map(data.map((p) => [p.cle, p.valeur]));
});

/** Seuil d'existence d'une page département (réglable en base, table parametres). */
export async function getSeuilPageDepartement(): Promise<SeuilPage> {
  const v = (await lireParametres()).get("seuil_page_departement") as SeuilPage | undefined;
  if (!v) throw new Error("Paramètre seuil_page_departement manquant");
  return v;
}
