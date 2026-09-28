import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/metadata";

// Les pages noindex (catalogue filtré, fiches sous seuil) restent crawlables : le noindex passe par la balise meta.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/formulaire/"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
