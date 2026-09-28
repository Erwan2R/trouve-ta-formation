import "server-only";
import { getOrganismes } from "./organismes";

/** Organismes publiés (hors test en production) : total et nombre par titre (slug). */
export async function getCompteurs(): Promise<{ total: number; parTitre: Map<string, number> }> {
  const organismes = await getOrganismes();
  const parTitre = new Map<string, number>();
  for (const slug of organismes.flatMap((o) => o.titres)) parTitre.set(slug, (parTitre.get(slug) ?? 0) + 1);
  return { total: organismes.length, parTitre };
}

/** Compteurs à afficher : null tant que le seuil n'est pas fixé ou pas atteint (tout ou rien, UX accueil §4). */
export async function getCompteursAffiches(
  seuil: number | null,
): Promise<{ total: number; parTitre: Map<string, number> } | null> {
  if (seuil === null) return null;
  const c = await getCompteurs();
  return c.total >= seuil ? c : null;
}
