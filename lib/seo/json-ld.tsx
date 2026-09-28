import { SITE_NAME, SITE_URL, absoluteUrl } from "./metadata";

type JsonLdObject = { "@type": string; [key: string]: unknown };

/** Rendu serveur d'un bloc JSON-LD. `<` échappé pour empêcher toute sortie du <script>. */
export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  const graph = Array.isArray(data)
    ? { "@context": "https://schema.org", "@graph": data }
    : { "@context": "https://schema.org", ...data };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}

export function organizationJsonLd(): JsonLdObject {
  return { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: `${SITE_URL}/` };
}

export function websiteJsonLd(): JsonLdObject {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    inLanguage: "fr-FR",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLdObject {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
