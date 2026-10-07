import type { ContenuPilier } from "./types";

// Sources (vérifiées le 06/10/2026) : arrêté du 2 mai 2005 modifié (art. 7 et 15 ; annexe V, parties 5 et 6),
// fiche France compétences RS5643.
export const recyclageSsiap3: ContenuPilier = {
  gabarit: "B",
  definition:
    "Le recyclage SSIAP 3 est le stage obligatoire tous les trois ans pour continuer d'exercer comme chef de service de sécurité incendie. Passé l'échéance, une remise à niveau de 35 heures est nécessaire.",
  faits: {
    periodicite: "Tous les 3 ans",
    prerequis: "Diplôme SSIAP 3 et secourisme à jour",
    verifieLe: "2026-10-06",
  },
  bloc4: {
    h2: "Quand suivre votre recyclage SSIAP 3",
    sections: [
      {
        h3: "La fenêtre à respecter",
        texte:
          "Tous les trois ans, **au plus tard le jour de la date anniversaire de votre diplôme SSIAP 3**. La qualification de secourisme se recycle à part, tous les deux ans.",
      },
      {
        h3: "Ce qui se passe si vous dépassez l'échéance",
        texte:
          "Vous devez suivre une **remise à niveau de 35 heures** avant de reprendre un emploi de chef de service. Elle s'impose aussi si vous n'avez pas exercé au moins 1 607 heures d'activité réglementée (agent, chef d'équipe ou chef de service) au cours des 36 derniers mois.",
      },
      {
        h3: "Un recyclage selon l'emploi occupé",
        texte:
          "Le recyclage se choisit en fonction du poste occupé ou visé. Un titulaire du SSIAP 3 qui occupe un poste de chef d'équipe peut suivre le recyclage SSIAP 2 ; pour diriger un service, il lui faut celui du SSIAP 3.",
      },
    ],
  },
  conditions: {
    premiere: {
      h3: "Le diplôme SSIAP 3 ou une équivalence",
      texte:
        "Le recyclage s'adresse aux titulaires du SSIAP 3, d'une équivalence reconnue par l'arrêté ou d'un ancien diplôme ERP 3 ou IGH 3.",
    },
    propres: {
      h3: "Les conditions propres au recyclage",
      texte:
        "Une qualification de secourisme en cours de validité. Pas d'examen : la validation tient à votre présence à toutes les séquences, et une appréciation sur l'étude de cas est transmise à l'employeur.",
    },
  },
  programme: {
    intro:
      "Le contenu est fixé par l'annexe V de l'arrêté du 2 mai 2005. Contrairement aux niveaux 1 et 2, il ne comporte pas d'exercice d'intervention : il porte sur la réglementation, le droit, la maintenance et l'analyse des risques. L'arrêté fixe la durée totale à 21 heures ; le détail de ses séquences en totalise 19.",
    modules: [
      { nom: "Réglementation : ERP, IGH, code du travail, rôle de membre de jury SSIAP", volume: "4 h" },
      { nom: "Notions de droit civil et pénal : délégations, responsabilités", volume: "2 h" },
      { nom: "Fonction maintenance : contrats des installations de sécurité", volume: "2 h" },
      { nom: "Étude de cas : rédaction d'une notice technique de sécurité", volume: "3 h" },
      { nom: "Accessibilité des personnes handicapées", volume: "2 h" },
      { nom: "Analyse des risques et suivi des travaux", volume: "4 h" },
      { nom: "Moyens de secours et exploitation d'un système de sécurité incendie", volume: "2 h" },
    ],
    evaluation:
      "Pas d'examen. À l'issue du stage, le centre délivre une attestation de recyclage et transmet à l'employeur une appréciation sur l'étude de cas.",
  },
  duree:
    "Le recyclage dure 21 heures, une journée de plus que pour les niveaux 1 et 2. La remise à niveau dure 35 heures : elle ajoute les documents administratifs, les commissions de sécurité et 6 heures sur l'organisation d'un service de sécurité incendie (recrutement, équipements, organisation des rondes).",
  cout: "Chaque organisme référencé affiche son tarif. Vérifiez qu'une session est disponible avant la date anniversaire de votre diplôme : au-delà, c'est la remise à niveau de 35 heures qui s'impose.",
  financementCpf:
    "Mobilisable : le recyclage se rattache à la certification SSIAP 3 du répertoire spécifique (RS5643), lorsque l'organisme le propose sur Mon Compte Formation. En 2026, une participation forfaitaire de 150 euros reste à votre charge.",
  titresLies: [
    { slug: "ssiap-3", texte: "Le diplôme de chef de service dont ce stage maintient la validité." },
    { slug: "recyclage-ssiap-2", texte: "Le recyclage des chefs d'équipe, si vous occupez ce poste." },
  ],
  faq: [
    {
      question: "Pourquoi le recyclage SSIAP 3 est-il plus long que ceux des niveaux 1 et 2 ?",
      reponse:
        "Parce qu'il porte sur ce qui évolue le plus dans le métier de chef de service : la réglementation, le droit, les contrats de maintenance et l'accessibilité. Il dure 21 heures, contre 14 heures pour les deux autres niveaux.",
    },
    {
      question: "Le recyclage SSIAP 3 comporte-t-il des exercices sur feu ?",
      reponse:
        "Non. Ses séquences portent sur la réglementation, le droit, la maintenance, une étude de cas, l'accessibilité, l'analyse des risques et les moyens de secours. Les exercices d'extinction sont propres aux recyclages des niveaux 1 et 2.",
    },
    {
      question: "Que contient la remise à niveau SSIAP 3 ?",
      reponse:
        "35 heures en dix séquences : documents administratifs, commissions de sécurité, réglementation, droit, maintenance, étude de cas, accessibilité, analyse des risques, moyens de secours, et organisation d'un service de sécurité incendie.",
    },
    {
      question: "Le recyclage aborde-t-il le rôle de membre de jury ?",
      reponse:
        "Oui. La séquence de réglementation traite du rôle du chef de service en tant que membre de jury des examens SSIAP, aux côtés de l'actualité des règlements de sécurité.",
    },
    {
      question: "Je dirige un service mais j'ai peu travaillé ces trois dernières années : quel stage suivre ?",
      reponse:
        "Si vous n'avez pas exercé 1 607 heures d'activité réglementée au cours des 36 derniers mois, c'est la remise à niveau de 35 heures, et non le recyclage, qui vous permet de reprendre un poste.",
    },
  ],
};
