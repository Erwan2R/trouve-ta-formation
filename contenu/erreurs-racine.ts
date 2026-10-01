// Page 404 et racine du domaine (Copy_Blog_404_Racine.md, parties 2 et 3). Textes validés : ne pas réécrire.

export const PAGE_404 = {
  h1: "Cette page n'existe pas",
  explication: "La page que vous cherchez a peut-être été déplacée, ou son adresse comporte une erreur.",
  silo: {
    formations: {
      titre: "Les formations les plus recherchées",
      slugs: ["tfp-aps", "mac-aps", "ssiap-1", "ssiap-2", "ssiap-3"],
    },
    demarches: "Les démarches CNAPS",
    organismes: {
      titre: "Chercher un organisme",
      tous: "Voir tous les organismes d'Île-de-France",
      departement: "Chercher par département",
    },
  },
  racine: { titre: "Choisissez un secteur" },
} as const;

export const RACINE = {
  title: "Trouve ta formation — l'annuaire des organismes de formation",
  description:
    "Trouve ta formation référence les organismes de formation secteur par secteur. Première verticale ouverte : la sécurité privée en Île-de-France.",
  h1: "Trouve ta formation",
  positionnement: "L'annuaire des organismes de formation, secteur par secteur.",
  verticales: {
    "securite-privee": {
      nom: "Sécurité privée",
      texte: "Organismes de formation en Île-de-France : TFP APS, SSIAP, spécialités.",
      lien: "Voir les formations en sécurité privée",
    },
  },
  aVenir: "D'autres secteurs ouvriront progressivement.",
  b2b: { texte: "Vous dirigez un organisme de formation ?", lien: "Référencez-vous gratuitement" },
} as const;

/** Pied de page minimal (racine, landing organismes) : Copy racine §10. */
export const PIED_MINIMAL = ["Mentions légales", "Politique de confidentialité", "Contact"] as const;
