import "server-only";
import { supabasePublic } from "../client";

/** Organismes publiés (RLS) : total et nombre par titre (slug). */
export async function getCompteurs(): Promise<{ total: number; parTitre: Map<string, number> }> {
  const db = supabasePublic();
  const [organismes, offres] = await Promise.all([
    db.from("organismes").select("*", { count: "exact", head: true }),
    db.from("organisme_titres").select("titres_referentiel(slug)"),
  ]);
  if (organismes.error) throw organismes.error;
  if (offres.error) throw offres.error;
  const parTitre = new Map<string, number>();
  for (const o of offres.data) {
    const slug = o.titres_referentiel.slug;
    parTitre.set(slug, (parTitre.get(slug) ?? 0) + 1);
  }
  return { total: organismes.count ?? 0, parTitre };
}
