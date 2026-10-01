// Blog (Copy_Blog_404_Racine.md, partie 1). Textes validés : ne pas réécrire.

/** Catégories, dans l'ordre d'affichage (Copy §1, validées par Erwan 01/10/2026). Clés = valeurs en base. */
export const CATEGORIES_BLOG = [
  { cle: "le-metier", libelle: "Le métier" },
  { cle: "se-former", libelle: "Se former" },
  { cle: "conditions-acces", libelle: "Conditions d'accès" },
  { cle: "actualites", libelle: "Actualités" },
] as const;
export type CategorieBlog = (typeof CATEGORIES_BLOG)[number]["cle"];
export const libelleCategorie = (cle: string) => CATEGORIES_BLOG.find((c) => c.cle === cle)?.libelle ?? cle;

export const BLOG = {
  liste: {
    title: "Le blog de la sécurité privée : métier, formation et réglementation",
    description:
      "Salaires, conditions d'accès, financements, évolutions réglementaires : nos articles sur les métiers de la sécurité privée et l'accès à la formation.",
    h1: "Le blog de la sécurité privée",
    chapo: [
      "Les métiers de la sécurité privée s'apprennent en formation, mais tout ne s'y explique pas. Combien gagne un agent en Île-de-France, ce que change réellement un casier judiciaire, comment financer sa formation quand on est en reconversion, ce que modifie une évolution réglementaire pour ceux qui exercent déjà.",
      "Ces articles traitent ce qui entoure la formation : le métier lui-même, les conditions d'accès et l'actualité du secteur. Le détail des titres et des démarches administratives est ailleurs sur le site, sur les pages qui leur sont consacrées.",
    ],
    tous: "Tous les articles",
    allerPlusLoin: "Aller plus loin",
    colonneFormations: "Les formations",
    colonneDemarches: "Les démarches",
    // Hors copy (texte Claude, à valider) : aucun article publié.
    vide: "Aucun article n'est encore publié. Les premiers arrivent bientôt.",
  },
  article: {
    publie: "Publié le",
    misAJour: "Mis à jour le",
    verifie: "Informations vérifiées le",
    lecture: (min: number) => `${min} min de lecture`,
    essentiel: "L'essentiel",
    sommaire: "Dans cet article",
    aSavoir: "À savoir",
    surLeMemeSujet: "Sur le même sujet",
    aRetenir: "À retenir",
    aLireAussi: "À lire aussi",
    // Accroche générique (décision Erwan) : seulement si les champs de l'accroche contextuelle sont vides.
    accrocheGenerique: {
      question: "Vous cherchez la formation qui vous correspond ?",
      lien: "Trouver ma formation",
      cible: "/securite-privee/formulaire/",
    },
  },
} as const;

/** Seuils éditoriaux (UX blog §4, Copy §5) : table des matières et encadré au-delà de 1000 mots. */
export const SEUIL_MOTS_SOMMAIRE = 1000;
/** Vitesse de lecture retenue pour le temps de lecture affiché. */
export const MOTS_PAR_MINUTE = 200;
/** Pagination de la page liste (UX blog §3 : 10 à 12 articles). */
export const ARTICLES_PAR_PAGE = 12;
