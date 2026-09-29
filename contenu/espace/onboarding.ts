// Accompagnement à l'inscription en 7 étapes (UX_Inscription_Organisme.md §6-7). Pas de maquette :
// composé avec les éléments de Ma fiche et Mes formations. Textes à valider par Erwan.

export type EtapeOnboarding = {
  titre: string;
  intro: string;
  /** Sections de Ma fiche affichées à cette étape (étapes 4 et 5 : composants dédiés). */
  sections?: ("identite" | "logo" | "agrement" | "coordonnees" | "lieux" | "pratique" | "presentation")[];
};

export const ETAPES: EtapeOnboarding[] = [
  {
    titre: "Identité de votre organisme",
    intro:
      "Renseignez votre SIRET : nous pouvons alors pré-remplir votre raison sociale et l'adresse de votre siège. Rien n'est obligatoire à cette étape.",
    sections: ["identite", "logo"],
  },
  {
    titre: "Agrément et certifications",
    intro:
      "L'agrément CNAPS est l'information la plus importante de votre fiche : c'est ce qui distingue un centre autorisé à former. Sans lui, votre fiche affiche « agrément non renseigné ».",
    sections: ["agrement"],
  },
  {
    titre: "Coordonnées et siège",
    intro:
      "L'adresse du siège et un moyen de contact (téléphone ou email) suffisent pour publier votre fiche, une fois votre adresse email validée.",
    sections: ["coordonnees"],
  },
  {
    titre: "Lieux de formation",
    intro: "Une seule fiche pour votre organisme, quel que soit le nombre de lieux où vous formez.",
    sections: ["lieux"],
  },
  {
    titre: "Vos formations",
    intro:
      "Cochez d'abord les titres que vous préparez : c'est ce qui vous fait apparaître dans les recherches des candidats. Prix, durée et rythme peuvent attendre.",
  },
  {
    titre: "Financements et modalités",
    intro: "Ces informations permettent aux candidats de vous trouver : elles alimentent les filtres du catalogue.",
    sections: ["pratique"],
  },
  {
    titre: "Présentation",
    intro:
      "Quelques lignes sur votre centre, vos publics et votre façon de former. C'est ce qui distingue votre fiche des autres. Vous pourrez y revenir plus tard.",
    sections: ["presentation"],
  },
];

export const ONBOARDING = {
  progression: (n: number, total: number) => `Étape ${n} sur ${total}`,
  restantes: (r: number) => (r === 0 ? "Dernière étape" : r === 1 ? "Encore 1 étape" : `Encore ${r} étapes`),
  quitter: "Enregistrer et quitter",
  precedent: "← Étape précédente",
  passer: "Passer cette étape",
  continuer: "Continuer",
  terminer: "Terminer",
  sauvegarde: "Vos réponses sont enregistrées automatiquement.",
  lieuxQuestion: "Dispensez-vous vos formations ailleurs qu'au siège ?",
  lieuxOui: "Oui",
  lieuxNon: "Non, uniquement au siège",
  reprendre: {
    titre: "Votre fiche n'est pas terminée",
    texte: (n: number) => `Reprenez là où vous vous êtes arrêté : étape ${n} sur 7.`,
    cta: "Reprendre",
  },
};
