import type { QuestionFaq } from "@/components/public/Faq";

/**
 * Lien éditorial. `href` : relatif à la verticale (« demarches/carte-professionnelle/ »), ancre (« #formations »)
 * ou absolu (« https://… »). Un lien vers une page non visible s'affiche comme texte simple.
 */
export type Lien = { href: string; libelle: string };

type Section = { h3: string; paragraphes: string[]; lien?: Lien };

/** Contenu éditorial d'une page démarche (Copy_Pages_Demarches_CNAPS.md). Texte brut, **gras** autorisé. */
export type ContenuDemarche = {
  /** Position dans le parcours en 4 étapes (1 autorisation, 2 formation, 3 carte, 4 renouvellement). */
  etape: 1 | 3 | 4;
  title: string;
  description: string;
  h1: string;
  definition: string;
  /** Encadré de synthèse : champs éditoriaux. Délai, coût, validité, fenêtre et date viennent de la base. */
  encadre: { aQui: string; quand?: string; ou: string; pieces: string };
  qui: { h2: string; sommaire: string; paragraphes: string[]; encart?: { surtitre: string; texte: string } };
  conditions: { h2: string; intro?: string; sections: Section[] };
  pieces: { intro?: string; liste: string[]; encart?: { surtitre: string; titre: string; texte: string } };
  depot: { intro: string; etapes: { h3: string; texte: string }[]; alerte?: { titre: string; texte: string } };
  delais: { intro: string; lignes: [string, string][] };
  refus: {
    h2: string;
    /** Libellé du sommaire, « En cas de refus » par défaut. */ sommaire?: string;
    sections: { titre: string; texte?: string; liste?: string[] }[];
  };
  ensuite: { h2: string; paragraphes: string[]; liens: Lien[] };
  /** Bloc 11 : seules les formations dont la page est visible s'affichent. `texte` remplace l'accroche du titre. */
  formations: { h2: string; titres: { slug: string; texte?: string }[] };
  faqTitre: string;
  faq: QuestionFaq[];
};
