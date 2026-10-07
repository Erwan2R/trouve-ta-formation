// Page de liste /securite-privee/demarches/ (Copy_Pages_Demarches_CNAPS.md §4). BROUILLON tant que le marqueur reste.
export const LISTE_DEMARCHES = {
  title: "Démarches CNAPS : autorisation, carte professionnelle, renouvellement",
  description:
    "Les trois démarches CNAPS de la sécurité privée expliquées pas à pas : autorisation préalable avant la formation, carte professionnelle, renouvellement. Procédures à jour de Dracar Ultimate.",
  h1: "Les démarches CNAPS de la sécurité privée",
  chapo:
    "Exercer un métier de la sécurité privée suppose trois démarches auprès du CNAPS, qui s'enchaînent dans un ordre précis. Elles se déposent toutes sur le même portail, mais elles n'interviennent pas au même moment et n'exigent pas les mêmes pièces.",
  /** Schéma d'enchaînement : texte dans le DOM, jamais en image. */
  parcours: [
    { titre: "Autorisation préalable", texte: "avant l'entrée en formation", demarche: "autorisation-prealable" },
    { titre: "Formation et titre", texte: "aptitude professionnelle", demarche: null },
    { titre: "Carte professionnelle", texte: "autorisation d'exercer", demarche: "carte-professionnelle" },
    { titre: "Renouvellement", texte: "tous les 5 ans après un MAC", demarche: "renouvellement-carte-professionnelle" },
  ],
  cartes: {
    "autorisation-prealable": {
      titre: "Autorisation préalable d'entrée en formation",
      texte:
        "Avant de vous inscrire. Le CNAPS vérifie que rien dans votre situation ne s'oppose à l'exercice du métier.",
    },
    "carte-professionnelle": {
      titre: "Demande de carte professionnelle",
      texte: "Après l'obtention de votre titre. C'est la carte, et non le titre, qui vous autorise à travailler.",
    },
    "renouvellement-carte-professionnelle": {
      titre: "Renouvellement de la carte",
      texte:
        "Tous les cinq ans, après un stage de maintien des compétences. À anticiper : une carte expirée interdit d'exercer.",
    },
  } as Record<string, { titre: string; texte: string }>,
  aptitude: {
    texte:
      "**L'aptitude professionnelle ne se demande pas, elle s'obtient.** C'est la réussite d'un titre reconnu qui l'établit : TFP APS, SSIAP, titre de spécialité. Elle n'est donc pas une procédure administrative mais une condition, vérifiée par le CNAPS au moment de la demande de carte.",
    lien: "Voir les formations qui donnent l'aptitude professionnelle →",
  },
  cloture:
    "**Toutes ces démarches se déposent sur Dracar Ultimate**, le portail du CNAPS en service depuis le 18 février 2026. L'ancien téléservice est définitivement fermé : chaque usager dépose désormais ses demandes depuis son propre compte.",
};

/** Bandeau de datation « · Procédure mise à jour depuis le passage à Dracar Ultimate » (Copy §3.4) : à retirer courant 2027. */
export const BANDEAU_DRACAR = true;

export const URL_DRACAR = "https://espace-usagers.cnaps.interieur.gouv.fr";
export const URL_CONSULTATION_CNAPS = "https://espace-consultation.cnaps.interieur.gouv.fr";
export const URL_CNAPS = "https://www.cnaps.interieur.gouv.fr";
