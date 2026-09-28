import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/metadata";

// dev et preprod (déploiements Vercel « preview ») : tout est bloqué.
// Production : les pages noindex (catalogue filtré, fiches sous seuil) restent crawlables, le noindex passe par la balise meta.
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV !== "production") return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/formulaire/"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
