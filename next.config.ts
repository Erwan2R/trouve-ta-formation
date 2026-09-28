import type { NextConfig } from "next";
// Imports relatifs : next.config ne résout pas l'alias « @/ ».
import { pilierVisible } from "./contenu/securite-privee/piliers";
import { redirectionsArchivage } from "./lib/resolution-pilier";

const nextConfig: NextConfig = {
  // Toutes les URLs publiques des specs se terminent par « / ».
  trailingSlash: true,
  images: {
    formats: ["image/webp"],
    // Logos déposés par les organismes (stockage Supabase, déjà convertis en WebP).
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/logos/**" }],
  },
  // Logo de l'espace organisme : 2 Mo maximum (UX Ma fiche §3.2), plus l'enveloppe du formulaire.
  experimental: { serverActions: { bodySizeLimit: "3mb" } },
  // Hors production (dev, preprod, local) : aucune page indexable, même si robots.txt est ignoré.
  async headers() {
    if (process.env.VERCEL_ENV === "production") return [];
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
  // Titres archivés remplacés : 301 directe vers le titre actif final, calculée au build depuis la base.
  // (Entre un archivage et le build suivant, la page pilier redirige elle-même en 308.)
  async redirects() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const cle = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !cle) return [];
    const reponse = await fetch(
      `${url}/rest/v1/titres_referentiel?select=id,slug,statut,page_publiee,archive_le,remplace_par_id,titre_proche_id`,
      { headers: { apikey: cle } },
    );
    if (!reponse.ok)
      throw new Error(`Lecture du référentiel impossible (${reponse.status}) : redirections non générées`);
    const production = process.env.VERCEL_ENV === "production";
    const titres = (await reponse.json()).map((t: Parameters<typeof pilierVisible>[0]) => ({
      ...t,
      a_une_page: pilierVisible(t, production),
    }));
    return redirectionsArchivage("securite-privee", titres);
  },
};

export default nextConfig;
