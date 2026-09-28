export type Verticale = {
  slug: string;
  nom: string;
  region: string;
  description: string;
};

export const VERTICALES = {
  "securite-privee": {
    slug: "securite-privee",
    nom: "Sécurité privée",
    region: "Île-de-France",
    description:
      "Annuaire indépendant des organismes de formation en sécurité privée agréés par le CNAPS en Île-de-France.",
  },
} as const satisfies Record<string, Verticale>;

export type VerticaleSlug = keyof typeof VERTICALES;
