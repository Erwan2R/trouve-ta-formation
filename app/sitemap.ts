import type { MetadataRoute } from "next";
import { VERTICALES } from "@/lib/config/verticales";
import { resoudrePilier } from "@/lib/resolution-pilier";
import { absoluteUrl } from "@/lib/seo/metadata";
import { getDemarches } from "@/lib/supabase/queries/demarches";
import { getTousLesTitres } from "@/lib/supabase/queries/referentiel";

// Uniquement les pages servies (les titres archivés remplacés redirigent, ils sortent du sitemap).
// À ajouter : fiches (Sprint 5), géo (6).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const titres = await getTousLesTitres();
  const { publiees, listeVisible } = await getDemarches(VERTICALES["securite-privee"]);
  // Pages publiées uniquement, quel que soit l'environnement (décision Erwan 01/10/2026).
  const piliers = titres.filter((t) => t.page_publiee && resoudrePilier(t.slug, titres)?.type === "page");
  return [
    { url: absoluteUrl("/") },
    ...Object.keys(VERTICALES).map((v) => ({ url: absoluteUrl(`/${v}/`) })),
    ...piliers.map((t) => ({ url: absoluteUrl(`/securite-privee/${t.slug}/`) })),
    ...(listeVisible ? [{ url: absoluteUrl("/securite-privee/demarches/") }] : []),
    ...publiees.map((d) => ({ url: absoluteUrl(`/securite-privee/demarches/${d.slug}/`) })),
  ];
}
