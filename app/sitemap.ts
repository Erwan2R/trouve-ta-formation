import type { MetadataRoute } from "next";
import { VERTICALES } from "@/lib/config/verticales";
import { absoluteUrl } from "@/lib/seo/metadata";
import { getTitres } from "@/lib/supabase/queries/referentiel";

// Uniquement les pages visibles. À ajouter : démarches (Sprint 4), fiches (5), géo (6).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const piliers = (await getTitres()).filter((t) => t.a_une_page);
  return [
    { url: absoluteUrl("/") },
    ...Object.keys(VERTICALES).map((v) => ({ url: absoluteUrl(`/${v}/`) })),
    ...piliers.map((t) => ({ url: absoluteUrl(`/securite-privee/${t.slug}/`) })),
  ];
}
