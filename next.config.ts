import type { NextConfig } from "next";
// Imports relatifs : next.config ne résout pas l'alias « @/ ».
import { pilierVisible } from "./contenu/securite-privee/piliers";
import { redirectionsArchivage } from "./lib/resolution-pilier";
import { CONFIDENTIALITE } from "./contenu/legal/confidentialite";
import { MENTIONS_LEGALES } from "./contenu/legal/mentions-legales";
import { COOKIES } from "./contenu/legal/cookies";
import { CONDITIONS } from "./contenu/legal/conditions";
import { sansMarqueur } from "./contenu/marqueurs";

// Mise en production bloquée tant que les pages légales contiennent un champ [à compléter] (décision Erwan 30/09/2026).
// Société éditrice en cours de création (01/10/2026) : ses informations sont dans contenu/legal/editeur.ts.
if (process.env.VERCEL_ENV === "production" && !sansMarqueur([MENTIONS_LEGALES, CONFIDENTIALITE, COOKIES, CONDITIONS]))
  throw new Error("Mise en production bloquée : pages légales incomplètes (contenu/legal/editeur.ts).");

const nextConfig: NextConfig = {
  // Toutes les URLs publiques des specs se terminent par « / ».
  trailingSlash: true,
  images: {
    formats: ["image/webp"],
    // Logos déposés par les organismes (stockage Supabase, déjà convertis en WebP).
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/logos/**" },
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/blog/**" },
    ],
  },
  // Logo de l'espace organisme : 2 Mo maximum (UX Ma fiche §3.2), plus l'enveloppe du formulaire.
  experimental: { serverActions: { bodySizeLimit: "3mb" } },
  // Hors production (dev, preprod, local) : aucune page indexable, même si robots.txt est ignoré.
  async headers() {
    // Sécurité (audit du 01/10/2026) : HTTPS imposé au navigateur, pas d'intégration du site dans un cadre tiers,
    // type de fichier respecté, adresse de provenance réduite, fonctions sensibles du navigateur désactivées.
    const securite = [
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
    ];
    const indexation =
      process.env.VERCEL_ENV === "production" ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    return [{ source: "/:path*", headers: [...securite, ...indexation] }];
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
    // Fiches dont le slug a changé (admin) : 301 de l'ancienne URL vers la nouvelle.
    const anciens = await fetch(`${url}/rest/v1/organismes_anciens_slugs?select=slug,organismes(slug)`, {
      headers: { apikey: cle },
    });
    if (!anciens.ok) throw new Error(`Lecture des anciens slugs impossible (${anciens.status})`);
    const fiches = ((await anciens.json()) as { slug: string; organismes: { slug: string } }[]).map((a) => ({
      source: `/securite-privee/organismes/${a.slug}/`,
      destination: `/securite-privee/organismes/${a.organismes.slug}/`,
      statusCode: 301 as const,
    }));
    return [...redirectionsArchivage("securite-privee", titres), ...fiches];
  },
};

export default nextConfig;
