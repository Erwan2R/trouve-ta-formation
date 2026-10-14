import type { Metadata } from "next";

export const SITE_NAME = "Trouve ta formation";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

type PageSeo = {
  title: string;
  description: string;
  /** Chemin de la page, avec slash final (trailingSlash activé). */
  path: string;
  /** noindex, follow — filtres catalogue, formulaire, fiches sous le seuil de complétude. */
  noindex?: boolean;
  /** Canonical différent du path (ex. catalogue filtré → catalogue nu). */
  canonicalPath?: string;
  /** Titre/description Open Graph quand la copy les distingue du title/description. */
  og?: { title: string; description: string };
};

export function buildMetadata({ title, description, path, noindex, canonicalPath, og }: PageSeo): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(canonicalPath ?? path) },
    // Pages indexables : grande image et extrait complet autorisés dans Google (Discover, résultats enrichis).
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true, googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
    openGraph: {
      title: og?.title ?? title,
      description: og?.description ?? description,
      url,
      siteName: SITE_NAME,
      locale: "fr_FR",
      type: "website",
      // Image de partage par défaut (public/og.png, 1200×630) ; un article de blog la remplace par sa couverture.
      images: [{ url: absoluteUrl("/og.png"), width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: { card: "summary_large_image" },
  };
}
