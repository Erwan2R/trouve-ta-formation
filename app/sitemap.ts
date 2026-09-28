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
  const { demarches, listeVisible } = await getDemarches(VERTICALES["securite-privee"]);
  const piliers = titres.filter((t) => resoudrePilier(t.slug, titres)?.type === "page");
  return [
    { url: absoluteUrl("/") },
    ...Object.keys(VERTICALES).map((v) => ({ url: absoluteUrl(`/${v}/`) })),
    ...piliers.map((t) => ({ url: absoluteUrl(`/securite-privee/${t.slug}/`) })),
    ...(listeVisible ? [{ url: absoluteUrl("/securite-privee/demarches/") }] : []),
    ...demarches
      .filter((d) => d.a_une_page)
      .map((d) => ({ url: absoluteUrl(`/securite-privee/demarches/${d.slug}/`) })),
  ];
}
