import type { MetadataRoute } from "next";
import { VERTICALES } from "@/lib/config/verticales";
import { absoluteUrl } from "@/lib/seo/metadata";

// Uniquement les pages qui existent. À ajouter : piliers (3), démarches (4), fiches (5), géo (6).
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: absoluteUrl("/") }, ...Object.keys(VERTICALES).map((v) => ({ url: absoluteUrl(`/${v}/`) }))];
}
