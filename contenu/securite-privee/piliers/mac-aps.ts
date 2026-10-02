import type { ContenuPilier } from "./types";

// BROUILLON repris de la maquette (Page Pilier Titre v3) — non publiable tant que les [à vérifier] restent.
export const macAps: ContenuPilier = {
  gabarit: "B",
  h1: "MAC APS — Maintien et actualisation des compétences des agents de prévention et de sécurité",
  definition:
    "Le MAC APS est le stage obligatoire pour renouveler votre carte professionnelle d'agent de prévention et de sécurité. Il se suit avant l'échéance des cinq ans, et sans lui le renouvellement n'est pas possible.",
  faits: {
    periodicite: "Tous les 5 ans",
    prerequis: "Carte professionnelle en cours de validité",
    verifieLe: "2026-09-01",
  },
  bloc4: {
    h2: "Quand suivre votre MAC APS",
    sections: [
      {
        h3: "La fenêtre à respecter",
        texte:
          "Le stage se suit dans les 24 mois qui précèdent l'échéance de votre carte. Un stage suivi plus tôt ne compte pas. L'attestation accompagne ensuite la demande de renouvellement, à déposer au moins trois mois avant l'échéance.",
      },
      {
        h3: "Ce qui se passe si vous dépassez l'échéance",
        texte:
          "Une carte expirée n'autorise plus l'exercice et ne se renouvelle plus : il faut déposer une nouvelle demande de carte professionnelle, avec un MAC suivi dans les douze mois qui la précèdent. Sans carte valide, l'entrée en MAC suppose une autorisation préalable du CNAPS.",
      },
      {
        h3: "Un stage par activité détenue",
        texte:
          "Une carte professionnelle portant plusieurs mentions demande une attestation de maintien par activité. Un agent titulaire de la surveillance et du cynophile suit donc deux stages distincts, et non un maintien unique.",
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
        "Le stage porte sur les activités effectivement inscrites sur votre carte. Les agents titulaires de plusieurs mentions doivent vérifier, avant de s'inscrire, que le centre propose bien le maintien correspondant à chacune. [à vérifier]",
    },
  },
  programme: {
    intro:
      "Le programme reprend le socle juridique et opérationnel du métier, actualisé des évolutions réglementaires depuis votre dernière qualification. Il est identique quel que soit l'organisme.",
    modules: [
      { nom: "Cadre légal et déontologie — actualisation" },
      { nom: "Gestion des situations conflictuelles" },
      { nom: "Secours à personne — maintien des acquis" },
      { nom: "Prévention des risques d'incendie et évacuation" },
    ],
    evaluation:
      "Le maintien ne donne pas lieu à un examen sanctionnant : il se conclut par une attestation de suivi, exigée à l'appui de la demande de renouvellement. [à vérifier]",
  },
  duree:
    "Le stage dure 34 heures, ramenées à 27 heures si vous êtes titulaire d'un certificat SST en cours de validité ou d'un recyclage PSC1 de moins de deux ans : vous êtes alors dispensé, à votre demande, du module de premiers secours. Les centres le programment le plus souvent sur quelques jours consécutifs, parfois en week-end pour les agents en poste.",
  cout: "C'est un achat contraint : les tarifs sont resserrés et l'écart entre organismes porte surtout sur le rythme proposé et la disponibilité des sessions dans les mois qui précèdent votre échéance.",
  titresLies: [
    { slug: "tfp-aps", texte: "Le titre initial dont ce stage assure le maintien." },
    { slug: "mac-cyno", texte: "Le maintien de la mention cynophile, à suivre en plus si votre carte la porte." },
    { slug: "ssiap-1", texte: "La qualification incendie, avec son propre recyclage tous les trois ans." },
  ],
  faq: [
    {
      question: "Quelle différence entre le MAC APS et le recyclage SSIAP ?",
      reponse:
        "Le MAC APS conditionne le renouvellement de la carte professionnelle de surveillance, tous les cinq ans. Le recyclage SSIAP conditionne l'exercice de la fonction de sécurité incendie, tous les trois ans. Un agent qui détient les deux qualifications suit les deux stages, à des échéances différentes.",
    },
    {
      question: "Ma carte porte deux mentions : un seul MAC suffit-il ?",
      reponse:
        "Non. Le maintien s'apprécie par activité : chaque mention inscrite sur la carte demande son attestation. C'est le cas de figure le plus fréquemment mal anticipé au moment du renouvellement.",
    },
    {
      question: "À quel moment précis dois-je suivre le stage ?",
      reponse:
        "Dans les 24 mois qui précèdent l'échéance de votre carte, et assez tôt pour déposer votre demande de renouvellement au moins trois mois avant cette échéance.",
    },
    {
      question: "Mon employeur peut-il prendre en charge le MAC APS ?",
      reponse:
        "Oui, c'est la voie la plus courante pour un agent en poste : l'employeur mobilise l'OPCO de la branche ou son plan de développement des compétences.",
    },
    {
      question: "Le MAC APS peut-il se suivre à distance ?",
      reponse:
        "Le stage comporte des mises en situation qui supposent du présentiel. Les organismes référencés indiquent le format de leurs sessions sur leur fiche. [à vérifier]",
    },
    {
      question: "J'ai laissé ma carte expirer : puis-je encore faire un MAC ?",
      reponse:
        "Oui. Il faudra déposer une nouvelle demande de carte professionnelle, avec un MAC suivi dans les douze mois qui la précèdent. Comme vous ne détenez plus de carte valide, l'entrée en MAC suppose d'abord une autorisation préalable du CNAPS.",
    },
  ],
};
