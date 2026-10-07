import type { ContenuPilier } from "./types";

// Sources (vérifiées le 06/10/2026) : arrêté du 2 mai 2005 modifié (art. 7 et 15 ; annexe V, parties 1 et 2),
// fiche France compétences RS5641.
export const recyclageSsiap1: ContenuPilier = {
  gabarit: "B",
  definition:
    "Le recyclage SSIAP 1 est le stage obligatoire tous les trois ans pour continuer d'exercer comme agent de sécurité incendie. Passé l'échéance, il faut suivre une remise à niveau avant de reprendre un poste.",
  faits: {
    periodicite: "Tous les 3 ans",
    prerequis: "Diplôme SSIAP 1 et secourisme à jour",
    verifieLe: "2026-10-06",
  },
  bloc4: {
    h2: "Quand suivre votre recyclage SSIAP 1",
    sections: [
      {
        h3: "La fenêtre à respecter",
        texte:
          "Le recyclage a lieu tous les trois ans, **au plus tard le jour de la date anniversaire de votre diplôme**. Votre qualification de secourisme suit son propre calendrier : elle se recycle tous les deux ans, au plus tard à sa propre date anniversaire. Les deux échéances ne tombent pas en même temps.",
      },
      {
        h3: "Ce qui se passe si vous dépassez l'échéance",
        texte:
          "Le recyclage n'est plus possible : vous devez suivre une **remise à niveau de 21 heures** avant de reprendre un emploi d'agent. La même règle s'applique si vous n'avez pas travaillé au moins 1 607 heures comme agent au cours des 36 derniers mois, même avec un recyclage à jour. Pour la remise à niveau, un certificat médical de moins de trois mois est exigé.",
      },
      {
        h3: "Un recyclage selon l'emploi occupé",
        texte:
          "Un titulaire de plusieurs niveaux SSIAP se recycle au niveau de l'emploi qu'il occupe, ou qu'il envisage d'occuper. Le recyclage SSIAP ne vaut que pour la sécurité incendie : un agent qui détient aussi une carte professionnelle de surveillance suit en plus son MAC APS, à une autre échéance.",
      },
    ],
  },
  conditions: {
    premiere: {
      h3: "Le diplôme SSIAP 1 ou une équivalence",
      texte:
        "Le recyclage s'adresse aux titulaires du SSIAP 1, d'une équivalence reconnue par l'arrêté ou d'un ancien diplôme ERP 1 ou IGH 1.",
    },
    propres: {
      h3: "Les conditions propres au recyclage",
      texte:
        "Votre qualification de secourisme doit être en cours de validité. Il n'y a pas d'examen : la validation tient à votre présence à toutes les séquences. En cas de défaillance notoire pendant le stage, le centre peut vous proposer une remise à niveau, et il transmet une appréciation à votre employeur. Quinze stagiaires au plus par session.",
    },
  },
  programme: {
    intro:
      "Le contenu est fixé par l'annexe V de l'arrêté du 2 mai 2005. Il est centré sur l'évolution de la réglementation et sur la pratique de l'intervention.",
    modules: [
      { nom: "Prévention : évolution de la réglementation, accessibilité du public, QCM « blanc »", volume: "5 h" },
      { nom: "Moyens de secours : agents extincteurs, système de sécurité incendie", volume: "3 h" },
      {
        nom: "Mises en situation d'intervention, dont exercices d'extinction sur feux réels",
        volume: "6 h",
      },
    ],
    evaluation:
      "Pas d'examen. Chaque stagiaire doit avoir manipulé des extincteurs en situation réelle, mis en œuvre un robinet d'incendie armé sur un parcours non rectiligne et évacué une victime d'un local enfumé. À l'issue du stage, le centre délivre une attestation de recyclage.",
  },
  duree:
    "Le recyclage dure 14 heures, soit deux journées de sept heures. La remise à niveau, pour ceux qui ont dépassé l'échéance ou manquent d'heures d'exercice, dure 21 heures : elle reprend les fondamentaux de la sécurité incendie, l'exploitation du poste de sécurité et les rondes, en plus du contenu du recyclage.",
  cout: "C'est un achat contraint, à renouveler tous les trois ans. Chaque organisme référencé affiche son tarif ; vérifiez surtout qu'une session est disponible avant la date anniversaire de votre diplôme.",
  financementCpf:
    "Mobilisable : le recyclage se rattache à la certification SSIAP 1 du répertoire spécifique (RS5641), lorsque l'organisme le propose sur Mon Compte Formation. En 2026, une participation forfaitaire de 150 euros reste à votre charge.",
  titresLies: [
    { slug: "ssiap-1", texte: "Le diplôme initial dont ce stage maintient la validité." },
    {
      slug: "recyclage-ssiap-2",
      texte: "Le recyclage des chefs d'équipe, de même durée mais centré sur l'encadrement.",
    },
    { slug: "mac-aps", texte: "Le maintien de la carte de surveillance, à suivre en plus si vous la détenez." },
  ],
  faq: [
    {
      question: "Quelle différence entre le recyclage et la remise à niveau SSIAP 1 ?",
      reponse:
        "Le recyclage (14 heures) se suit à temps, tous les trois ans. La remise à niveau (21 heures) remplace le recyclage quand l'échéance est dépassée, ou quand vous n'avez pas exercé au moins 1 607 heures au cours des 36 derniers mois. Elle exige en plus un certificat médical.",
    },
    {
      question: "Le recyclage SSIAP 1 remplace-t-il le MAC APS ?",
      reponse:
        "Non. Le recyclage SSIAP relève de la réglementation incendie et revient tous les trois ans. Le MAC APS conditionne le renouvellement de la carte professionnelle de surveillance, tous les cinq ans. Un agent qui exerce les deux métiers suit les deux stages.",
    },
    {
      question: "Je n'ai pas travaillé comme agent depuis un an : que dois-je faire ?",
      reponse:
        "Tout dépend de vos heures sur les 36 derniers mois. En dessous de 1 607 heures d'activité d'agent, vous devez suivre la remise à niveau avant de reprendre un poste, même si votre dernier recyclage date de moins de trois ans.",
    },
    {
      question: "Faut-il aussi recycler son secourisme ?",
      reponse:
        "Oui, tous les deux ans, au plus tard à la date anniversaire de votre qualification de secourisme. Une qualification à jour est d'ailleurs exigée pour entrer en recyclage.",
    },
    {
      question: "Le recyclage se termine-t-il par un examen ?",
      reponse:
        "Non. La séquence de prévention se clôt par un QCM « blanc », pour vous situer, mais la validation repose sur votre présence à l'ensemble des séquences.",
    },
    {
      question: "Je détiens le SSIAP 2 mais je travaille comme agent : quel recyclage suivre ?",
      reponse:
        "Celui de l'emploi que vous occupez ou envisagez d'occuper. En poste d'agent, le recyclage SSIAP 1 suffit ; si vous visez un poste de chef d'équipe, suivez le recyclage SSIAP 2.",
    },
  ],
};
