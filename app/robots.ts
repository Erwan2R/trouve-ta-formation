import type { MetadataRoute } from "next";
import { EST_PRODUCTION } from "@/lib/env";
import { absoluteUrl } from "@/lib/seo/metadata";

// dev et preprod (déploiements Vercel « preview ») : tout est bloqué.
// Production : les pages noindex (catalogue filtré, fiches sous seuil, formulaire) restent crawlables, le noindex
// passe par la balise meta — une page bloquée ici ne verrait jamais son noindex lu (décision Erwan 02/10/2026).
export default function robots(): MetadataRoute.Robots {
  if (!EST_PRODUCTION) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
