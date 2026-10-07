import type { ContenuPilier } from "./types";

// Sources (vérifiées le 06/10/2026) : arrêté du 27 février 2017 relatif à la formation continue des agents privés de
// sécurité (art. 1 à 4, version en vigueur), page démarche « Renouvellement » (fenêtre de dépôt).
export const macAps: ContenuPilier = {
  gabarit: "B",
  h1: "MAC APS — Maintien et actualisation des compétences des agents de prévention et de sécurité",
  definition:
    "Le MAC APS est le stage obligatoire pour renouveler votre carte professionnelle d'agent de prévention et de sécurité. Il se suit avant l'échéance des cinq ans, et sans lui le renouvellement n'est pas possible.",
  faits: {
    periodicite: "Tous les 5 ans",
    prerequis: "Carte professionnelle en cours de validité",
    verifieLe: "2026-10-06",
  },
  bloc4: {
    h2: "Quand suivre votre MAC APS",
    sections: [
      {
        h3: "La fenêtre à respecter",
        texte:
          "Le stage se suit **dans les 24 mois qui précèdent l'échéance de votre carte**. Un stage suivi plus tôt ne compte pas. L'attestation accompagne ensuite la demande de renouvellement, à déposer au moins trois mois avant l'échéance.",
      },
      {
        h3: "Ce qui se passe si vous dépassez l'échéance",
        texte:
          "Une carte expirée n'autorise plus l'exercice et ne se renouvelle plus : il faut déposer une nouvelle demande de carte professionnelle, avec un MAC suivi dans les douze mois qui la précèdent. Sans carte valide, l'entrée en MAC suppose une autorisation préalable du CNAPS.",
      },
      {
        h3: "Un stage par activité détenue",
        texte:
          "Chaque activité inscrite sur la carte a son propre stage de maintien. Un module déjà suivi dans un autre stage, dans les 24 mois avant l'échéance, n'est pas à refaire : à votre demande, vous en êtes dispensé. Un agent titulaire de la surveillance et du cynophile ne suit donc qu'une fois le socle commun.",
      },
    ],
  },
  conditions: {
    premiere: {
      h3: "Une carte professionnelle en cours de validité",
      texte:
        "Le MAC s'adresse aux agents déjà titulaires. Si votre carte est déjà expirée, il reste possible, mais il faut d'abord obtenir une autorisation préalable du CNAPS.",
    },
    propres: {
      h3: "Les conditions propres au MAC APS",
      texte:
        "Le stage commence par une évaluation individuelle de vos connaissances, en dix questions à réponse courte. Il porte sur la surveillance humaine et le gardiennage. Douze stagiaires au plus par session.",
    },
  },
  programme: {
    intro:
      "Le contenu est fixé par l'arrêté du 27 février 2017 relatif à la formation continue, dans sa version modifiée en 2025. Il est identique quel que soit l'organisme.",
    modules: [
      { nom: "Gestes élémentaires de premiers secours", volume: "7 h" },
      { nom: "Principes de la République", volume: "3 h" },
      { nom: "Cadre juridique d'intervention et déontologie", volume: "4 h" },
      { nom: "Gestion des conflits", volume: "3 h 30" },
      { nom: "Inspection-filtrage : palpation et inspection visuelle des bagages", volume: "3 h 30" },
      { nom: "Prévention des risques terroristes", volume: "13 h" },
    ],
    evaluation:
      "Le stage ne se conclut pas par un examen : il donne lieu à une attestation de suivi, selon un modèle publié par le CNAPS, à joindre à la demande de renouvellement.",
  },
  duree:
    "Le stage dure 34 heures, ramenées à 27 heures si vous êtes titulaire d'un certificat SST valide ou d'un recyclage PSC de moins de deux ans : vous êtes alors dispensé, à votre demande, du module de premiers secours. Il peut se dérouler dans les locaux de votre employeur, avec un formateur d'un organisme autorisé par le CNAPS.",
  cout: "C'est un achat contraint : l'écart entre organismes porte surtout sur le rythme proposé et sur la disponibilité de sessions dans les mois qui précèdent votre échéance. Chaque organisme référencé affiche son tarif.",
  financementCpf:
    "Non mobilisable : le MAC APS n'est enregistré ni au RNCP ni au répertoire spécifique, condition pour être financé par le CPF.",
  titresLies: [
    { slug: "tfp-aps", texte: "Le titre initial dont ce stage assure le maintien." },
    { slug: "mac-cyno", texte: "Le maintien de la mention cynophile, à suivre en plus si votre carte la porte." },
    { slug: "recyclage-ssiap-1", texte: "Le recyclage incendie, tous les trois ans, si vous êtes aussi SSIAP 1." },
  ],
  faq: [
    {
      question: "Quelle différence entre le MAC APS et le recyclage SSIAP ?",
      reponse:
        "Le MAC APS conditionne le renouvellement de la carte professionnelle de surveillance, tous les cinq ans. Le recyclage SSIAP conditionne l'exercice de la sécurité incendie, tous les trois ans. Un agent qui détient les deux qualifications suit les deux stages, à des échéances différentes.",
    },
    {
      question: "Ma carte porte deux mentions : dois-je tout refaire deux fois ?",
      reponse:
        "Non. Chaque activité a son stage, mais un module déjà suivi dans les 24 mois avant l'échéance, dans le cadre d'un autre stage, n'est pas à refaire si vous le demandez. Le socle commun ne se suit donc qu'une fois.",
    },
    {
      question: "À quel moment précis dois-je suivre le stage ?",
      reponse:
        "Dans les 24 mois qui précèdent l'échéance de votre carte, et assez tôt pour déposer votre demande de renouvellement au moins trois mois avant cette échéance.",
    },
    {
      question: "Mon employeur peut-il organiser le MAC APS dans ses locaux ?",
      reponse:
        "Oui, avec un formateur d'un organisme autorisé par le CNAPS. La date et le lieu de chaque session doivent être déclarés au CNAPS quinze jours avant son début.",
    },
    {
      question: "Le MAC APS se termine-t-il par un examen ?",
      reponse:
        "Non. Il commence par une évaluation de vos connaissances en dix questions, qui sert à orienter le stage, et se termine par une attestation de suivi.",
    },
    {
      question: "J'ai laissé ma carte expirer : puis-je encore faire un MAC ?",
      reponse:
        "Oui. Il faudra déposer une nouvelle demande de carte professionnelle, avec un MAC suivi dans les douze mois qui la précèdent. Comme vous ne détenez plus de carte valide, l'entrée en MAC suppose d'abord une autorisation préalable du CNAPS.",
    },
  ],
};
