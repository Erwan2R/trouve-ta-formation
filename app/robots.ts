import type { MetadataRoute } from "next";
import { VERTICALES } from "@/lib/config/verticales";
import { EST_PRODUCTION } from "@/lib/env";
import { absoluteUrl } from "@/lib/seo/metadata";

// dev et preprod (déploiements Vercel « preview ») : tout est bloqué.
// Production : les pages noindex (catalogue filtré, fiches sous seuil) restent crawlables, le noindex passe par la balise meta.
export default function robots(): MetadataRoute.Robots {
  if (!EST_PRODUCTION) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", ...Object.keys(VERTICALES).map((v) => `/${v}/formulaire/`)],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
