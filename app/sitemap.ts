import type { MetadataRoute } from "next";
import { VERTICALES } from "@/lib/config/verticales";
import { estIndexable } from "@/lib/organismes/completude";
import { resoudrePilier } from "@/lib/resolution-pilier";
import { absoluteUrl } from "@/lib/seo/metadata";
import { getDemarches } from "@/lib/supabase/queries/demarches";
import { getOrganismes } from "@/lib/supabase/queries/organismes";
import { getDepartements, getTousLesTitres } from "@/lib/supabase/queries/referentiel";

// Uniquement les pages servies et indexables (les titres archivés remplacés redirigent, ils sortent du sitemap).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [titres, { publiees, listeVisible }, organismes, departements] = await Promise.all([
    getTousLesTitres(),
    getDemarches(VERTICALES["securite-privee"]),
    getOrganismes(), // jamais d'organisme de test en production
    getDepartements(),
  ]);
  // Pages publiées uniquement, quel que soit l'environnement (décision Erwan 01/10/2026).
  const piliers = titres.filter((t) => t.page_publiee && resoudrePilier(t.slug, titres)?.type === "page");
  return [
    { url: absoluteUrl("/") },
    ...Object.keys(VERTICALES).map((v) => ({ url: absoluteUrl(`/${v}/`) })),
    // Landing organismes : indexable, dans le sitemap (décision Erwan 30/09/2026).
    { url: absoluteUrl("/securite-privee/referencer-mon-organisme/") },
    ...piliers.map((t) => ({ url: absoluteUrl(`/securite-privee/${t.slug}/`) })),
    ...(listeVisible ? [{ url: absoluteUrl("/securite-privee/demarches/") }] : []),
    ...publiees.map((d) => ({ url: absoluteUrl(`/securite-privee/demarches/${d.slug}/`) })),
    // Pages département : seulement au-dessus du seuil et avec leur contenu (sinon 404).
    ...departements.filter((d) => d.a_une_page).map((d) => ({ url: absoluteUrl(`/securite-privee/${d.slug}/`) })),
    // Catalogue : hors sitemap tant qu'il est vide (noindex).
    ...(organismes.length ? [{ url: absoluteUrl("/securite-privee/organismes/") }] : []),
    // Fiches au palier Basique : noindex, donc hors sitemap.
    ...organismes
      .filter((o) => estIndexable(o.palier))
      .map((o) => ({ url: absoluteUrl(`/securite-privee/organismes/${o.slug}/`), lastModified: o.updated_at })),
  ];
}
