import "server-only";
import { cache } from "react";
import type { SeuilPage } from "@/contenu/securite-privee/departements";
import type { ExperienceMin } from "@/lib/formulaire/parcours";
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

/** Formulaire d'affinage : en dessous de ce nombre de résultats, l'élargissement est proposé (jamais imposé). */
export async function getSeuilPropositionElargissement(): Promise<number> {
  const v = (await lireParametres()).get("seuil_proposition_elargissement");
  return typeof v === "number" ? v : 3;
}

/** Formulaire d'affinage : années d'expérience minimales pour recommander le SSIAP 2 et le SSIAP 3. */
export async function getExperienceEncadrement(): Promise<ExperienceMin> {
  const v = (await lireParametres()).get("experience_encadrement") as ExperienceMin | undefined;
  if (!v) throw new Error("Paramètre experience_encadrement manquant");
  return v;
}
