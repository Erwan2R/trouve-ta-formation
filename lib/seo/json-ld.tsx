import { EDITEUR } from "@/contenu/legal/editeur";
import { EMAIL_CONTACT } from "@/lib/config/contact";
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

// Identité lue par Google (panneau, logo) et par les LLM : qui édite l'annuaire, comment le joindre.
export function organizationJsonLd(): JsonLdObject {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: EDITEUR.denomination,
    url: `${SITE_URL}/`,
    logo: { "@type": "ImageObject", url: absoluteUrl("/icon.png"), width: 512, height: 512 },
    image: absoluteUrl("/og.png"),
    description:
      "Annuaire indépendant des organismes de formation professionnelle, sans commission ni classement payant.",
    email: EMAIL_CONTACT,
    address: { "@type": "PostalAddress", addressLocality: "Poissy", addressCountry: "FR" },
  };
}

export function websiteJsonLd(): JsonLdObject {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    // Nom de site affiché par Google au-dessus du résultat.
    alternateName: "trouve-ta-formation.fr",
    url: `${SITE_URL}/`,
    inLanguage: "fr-FR",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** Page pilier : le titre décrit comme une formation (lu par Bing et les LLM ; plus de résultat enrichi Google). */
export function courseJsonLd(t: { nom: string; court: string; description: string; path: string }): JsonLdObject {
  return {
    "@type": "Course",
    name: t.nom,
    alternateName: t.court,
    description: t.description,
    url: absoluteUrl(t.path),
    inLanguage: "fr-FR",
    educationalCredentialAwarded: t.nom,
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

export function faqJsonLd(questions: { question: string; reponse: string }[]): JsonLdObject {
  return {
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.reponse },
    })),
  };
}
