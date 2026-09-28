import type { MetadataRoute } from "next";
import { VERTICALES } from "@/lib/config/verticales";
import { resoudrePilier } from "@/lib/resolution-pilier";
import { absoluteUrl } from "@/lib/seo/metadata";
import { getTousLesTitres } from "@/lib/supabase/queries/referentiel";

// Uniquement les pages servies (les titres archivés remplacés redirigent, ils sortent du sitemap).
// À ajouter : démarches (Sprint 4), fiches (5), géo (6).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const titres = await getTousLesTitres();
  const piliers = titres.filter((t) => resoudrePilier(t.slug, titres)?.type === "page");
  return [
    { url: absoluteUrl("/") },
    ...Object.keys(VERTICALES).map((v) => ({ url: absoluteUrl(`/${v}/`) })),
    ...piliers.map((t) => ({ url: absoluteUrl(`/securite-privee/${t.slug}/`) })),
  ];
}
