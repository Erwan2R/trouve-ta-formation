import type { ContenuPilier } from "./types";

// Sources (vérifiées le 06/10/2026) : arrêté du 2 mai 2005 modifié (art. 7 et 15 ; annexe V, parties 3 et 4),
// fiche France compétences RS5642.
export const recyclageSsiap2: ContenuPilier = {
  gabarit: "B",
  definition:
    "Le recyclage SSIAP 2 est le stage obligatoire tous les trois ans pour continuer d'exercer comme chef d'équipe de sécurité incendie. Passé l'échéance, une remise à niveau est nécessaire avant de reprendre le poste.",
  faits: {
    periodicite: "Tous les 3 ans",
    prerequis: "Diplôme SSIAP 2 et secourisme à jour",
    verifieLe: "2026-10-06",
  },
  bloc4: {
    h2: "Quand suivre votre recyclage SSIAP 2",
    sections: [
      {
        h3: "La fenêtre à respecter",
        texte:
          "Tous les trois ans, **au plus tard le jour de la date anniversaire de votre diplôme SSIAP 2**. La qualification de secourisme, elle, se recycle tous les deux ans.",
      },
      {
        h3: "Ce qui se passe si vous dépassez l'échéance",
        texte:
          "Vous devez suivre une **remise à niveau de 21 heures** avant de reprendre un emploi de chef d'équipe. C'est aussi le cas si vous ne justifiez pas de 1 607 heures d'activité d'agent, de chef d'équipe ou de chef de service au cours des 36 derniers mois. La remise à niveau SSIAP 2 demande un certificat médical de moins de trois mois.",
      },
      {
        h3: "Un recyclage selon l'emploi occupé",
        texte:
          "Le recyclage se choisit en fonction du poste occupé ou visé, pas du diplôme le plus élevé. Un titulaire du SSIAP 2 qui travaille comme agent peut se contenter du recyclage SSIAP 1 ; pour exercer comme chef d'équipe, il lui faut le recyclage SSIAP 2.",
      },
    ],
  },
  conditions: {
    premiere: {
      h3: "Le diplôme SSIAP 2 ou une équivalence",
      texte:
        "Le recyclage s'adresse aux titulaires du SSIAP 2, d'une équivalence reconnue par l'arrêté ou d'un ancien diplôme ERP 2 ou IGH 2.",
    },
    propres: {
      h3: "Les conditions propres au recyclage",
      texte:
        "Une qualification de secourisme en cours de validité. Pas d'examen : la validation tient à votre présence à toutes les séquences, et le centre transmet une appréciation à votre employeur. Quinze stagiaires au plus par session.",
    },
  },
  programme: {
    intro:
      "Le contenu est fixé par l'annexe V de l'arrêté du 2 mai 2005. Même durée que le recyclage des agents, mais plus de la moitié du temps porte sur l'encadrement : gestion du poste de sécurité en crise, formation des agents, vie de l'équipe.",
    modules: [
      { nom: "Prévention : évolution de la réglementation et de l'accessibilité, QCM « blanc »", volume: "4 h" },
      { nom: "Moyens de secours : agents extincteurs, système de sécurité incendie", volume: "2 h" },
      { nom: "Gestion du poste de sécurité en situation de crise", volume: "3 h" },
      { nom: "Organisation d'une séance de formation", volume: "2 h" },
      {
        nom: "L'équipe de sécurité incendie : accueil d'un nouvel agent, motivation, gestion des conflits",
        volume: "3 h",
      },
    ],
    evaluation:
      "Pas d'examen. La séquence de prévention se clôt par un QCM « blanc ». À l'issue du stage, le centre délivre une attestation de recyclage et transmet une appréciation à l'employeur.",
  },
  duree:
    "Le recyclage dure 14 heures. La remise à niveau dure 21 heures : elle ajoute les fondamentaux de la sécurité incendie et une mise en situation d'intervention, dans laquelle **c'est un stagiaire qui tient le rôle de chef d'équipe**, alors qu'au niveau des agents ce rôle est tenu par un formateur.",
  cout: "C'est un achat contraint, à renouveler tous les trois ans. Chaque organisme référencé affiche son tarif ; regardez surtout si une session est disponible avant la date anniversaire de votre diplôme.",
  financementCpf:
    "Mobilisable : le recyclage se rattache à la certification SSIAP 2 du répertoire spécifique (RS5642), lorsque l'organisme le propose sur Mon Compte Formation. En 2026, une participation forfaitaire de 150 euros reste à votre charge.",
  titresLies: [
    { slug: "ssiap-2", texte: "Le diplôme de chef d'équipe dont ce stage maintient la validité." },
    { slug: "recyclage-ssiap-1", texte: "Le recyclage des agents, si vous occupez un poste d'agent." },
    {
      slug: "recyclage-ssiap-3",
      texte: "Le recyclage des chefs de service, plus long et centré sur la réglementation.",
    },
  ],
  faq: [
    {
      question: "Quelle différence entre le recyclage SSIAP 2 et celui du SSIAP 1 ?",
      reponse:
        "La durée est la même, 14 heures, mais pas le contenu. Le recyclage SSIAP 2 consacre 8 heures à l'encadrement : gestion du poste de sécurité en crise, organisation d'une séance de formation, gestion de l'équipe et des conflits. Celui du SSIAP 1 porte surtout sur l'intervention.",
    },
    {
      question: "Un chef d'équipe doit-il aussi justifier de 1 607 heures d'activité ?",
      reponse:
        "Oui. Sans 1 607 heures d'activité d'agent, de chef d'équipe ou de chef de service sur les 36 derniers mois, il doit suivre la remise à niveau avant de reprendre un poste, même si son recyclage est à jour.",
    },
    {
      question: "Que contient la remise à niveau SSIAP 2 ?",
      reponse:
        "21 heures en sept séquences : fondamentaux de la sécurité incendie, mise en situation d'intervention avec exercices sur feux réels, prévention, moyens de secours, gestion du poste de sécurité, organisation d'une séance de formation et gestion de l'équipe.",
    },
    {
      question: "Mon ancien diplôme ERP 2 ou IGH 2 est-il encore utilisable ?",
      reponse:
        "Les diplômes ERP et IGH délivrés avant le 31 décembre 2005 permettent d'accéder à une remise à niveau, à l'issue de laquelle un diplôme SSIAP est délivré par équivalence.",
    },
    {
      question: "Le recyclage SSIAP 2 donne-t-il lieu à une appréciation ?",
      reponse:
        "Oui. Le centre transmet à l'employeur une appréciation sur vos actions pendant les séquences pratiques. En cas de défaillance notoire, il peut proposer une remise à niveau à la place du recyclage.",
    },
  ],
};
