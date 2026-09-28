import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/metadata";

// Uniquement les pages qui existent. À ajouter : accueil verticale (Sprint 2), piliers (3), démarches (4), fiches (5), géo (6).
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: absoluteUrl("/") }];
}
