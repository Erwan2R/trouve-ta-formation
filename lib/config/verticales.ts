export type Verticale = {
  slug: string;
  nom: string;
  region: string;
  description: string;
  /** Colonne 1 du footer (Page Departement.dc.html) : `libelle` remplace le libellé court quand le métier est plus parlant. */
  footerTitres: { slug: string; libelle?: string }[];
  /** Colonne 2 du footer, dans l'ordre de la copy. */
  footerDepartements: string[];
  demarches: { slug: string; libelle: string }[];
};

export const VERTICALES = {
  "securite-privee": {
    slug: "securite-privee",
    nom: "Sécurité privée",
    region: "Île-de-France",
    description:
      "Annuaire indépendant des organismes de formation en sécurité privée agréés par le CNAPS en Île-de-France.",
    footerTitres: [
      { slug: "tfp-aps" },
      { slug: "mac-aps" },
      { slug: "ssiap-1" },
      { slug: "recyclage-ssiap-1" },
      { slug: "ssiap-2" },
      { slug: "tfp-asc", libelle: "Agent cynophile" },
    ],
    footerDepartements: ["75", "93", "92", "94", "91", "78", "95", "77"],
    demarches: [
      { slug: "autorisation-prealable", libelle: "Autorisation préalable" },
      { slug: "carte-professionnelle", libelle: "Carte professionnelle" },
      { slug: "renouvellement-carte-professionnelle", libelle: "Renouvellement de la carte" },
    ],
  },
} as const satisfies Record<string, Verticale>;

export type VerticaleSlug = keyof typeof VERTICALES;

/** Espace organisme : sous-domaine dédié (Copy accueil §1). */
export const URL_ESPACE_ORGANISME = "https://partenaires.trouve-ta-formation.fr/";
