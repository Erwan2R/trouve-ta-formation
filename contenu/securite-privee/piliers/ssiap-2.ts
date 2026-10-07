import type { ContenuPilier } from "./types";

// Sources (vérifiées le 06/10/2026) : arrêté du 2 mai 2005 modifié (art. 2, 3, 5, 7 ; annexes III et IX),
// fiche France compétences RS5642.
export const ssiap2: ContenuPilier = {
  gabarit: "A",
  definition:
    "Le SSIAP 2 est le diplôme de chef d'équipe de sécurité incendie. Il permet d'encadrer les agents SSIAP 1 d'un établissement recevant du public ou d'un immeuble de grande hauteur, et de diriger le poste de sécurité lors d'un sinistre.",
  faits: {
    prerequis: "SSIAP 1 et 1 607 heures d'exercice sur 24 mois",
    verifieLe: "2026-10-06",
  },
  bloc4: {
    h2: "Ce que permet le SSIAP 2",
    sections: [
      {
        h3: "Les métiers accessibles",
        texte:
          "Chef d'équipe de service de sécurité incendie. Ce poste fait passer de l'exécution à l'encadrement : manager l'équipe, former les agents à la sécurité incendie, délivrer les permis de feu, lire et manipuler les tableaux de signalisation, veiller à l'hygiène et à la sécurité du travail. Lors d'un sinistre, c'est le chef d'équipe qui dirige le poste de sécurité.",
      },
      {
        h3: "Ce que le diplôme autorise",
        texte:
          "Seul le SSIAP 2, ou une équivalence prévue par l'arrêté, permet d'occuper un emploi de chef d'équipe. Avant de prendre ses fonctions dans un nouvel établissement, le chef d'équipe effectue trois périodes de travail en doublure, contre deux pour un agent. Comme le SSIAP 1, ce diplôme ne relève pas du CNAPS et ne donne lieu à aucune carte professionnelle.",
      },
      {
        h3: "Les débouchés en Île-de-France",
        texte:
          "Les chefs d'équipe sont recrutés par les entreprises de sécurité privée pour encadrer les équipes placées chez leurs clients, et par les établissements qui disposent de leur propre service de sécurité incendie. Il s'adresse à des agents SSIAP 1 expérimentés, puisque l'accès au diplôme suppose l'équivalent d'une année d'exercice.",
      },
    ],
  },
  conditions: {
    premiere: {
      h3: "Le SSIAP 1 ou une qualification équivalente",
      texte:
        "Il faut d'abord être qualifié pour l'emploi d'agent : diplôme SSIAP 1, ou l'un des diplômes et parcours que l'arrêté reconnaît comme équivalents.",
    },
    propres: {
      h3: "Les conditions propres au SSIAP 2",
      texte:
        "**1 607 heures d'exercice comme agent de sécurité incendie au cours des 24 derniers mois**, attestées par l'employeur ou par le contrat de travail. S'y ajoutent une qualification de secourisme (PSC ou AFPS de moins de deux ans, SST ou PSE 1 en cours de validité) et un certificat médical de moins de trois mois.",
    },
  },
  programme: {
    intro:
      "Le programme est fixé par l'annexe III de l'arrêté du 2 mai 2005. Plus de la moitié du temps porte sur le rôle du chef d'équipe, et notamment sur la conduite d'une séance de formation. Douze stagiaires au plus par session.",
    modules: [
      {
        nom: "Rôle et missions du chef d'équipe : management, formation des agents, gestion des conflits, permis de feu",
        volume: "38 h",
      },
      { nom: "Manipulation du système de sécurité incendie", volume: "10 h" },
      {
        nom: "Hygiène et sécurité : code du travail, commissions de sécurité et d'accessibilité",
        volume: "6 h",
      },
      { nom: "Chef du poste central de sécurité en situation de crise", volume: "16 h" },
    ],
    evaluation:
      "L'examen comprend trois épreuves : un QCM de 40 questions en 40 minutes, à réussir avec au moins 12 sur 20 ; une épreuve orale de 15 minutes, où vous animez une séquence pédagogique après 15 minutes de préparation ; une épreuve pratique de 20 minutes, la gestion du poste de sécurité en situation de crise, avec au moins trois incidents. Les épreuves orale et pratique sont évaluées apte ou inapte. En cas d'échec, vous avez un an pour repasser les épreuves manquées.",
  },
  duree:
    "La formation dure au minimum 70 heures, hors examen et temps de déplacement. Une fois diplômé, le chef d'équipe suit un recyclage de 14 heures tous les trois ans, et une remise à niveau de 21 heures s'il a laissé passer l'échéance ou s'il n'a pas exercé 1 607 heures au cours des 36 derniers mois.",
  cout: "Chaque organisme référencé affiche son tarif sur sa fiche. Vérifiez ce que le prix comprend (frais d'examen, recyclage du secourisme) et les dates de session : pour un agent en poste, elles comptent autant que le prix.",
  financementCpf:
    "Mobilisable : le SSIAP 2 est enregistré au répertoire spécifique de France compétences (RS5642). En 2026, une participation forfaitaire de 150 euros reste à votre charge.",
  titresLies: [
    { slug: "ssiap-1", texte: "Le diplôme d'agent, indispensable avant d'accéder au SSIAP 2." },
    { slug: "recyclage-ssiap-2", texte: "Le stage à suivre tous les trois ans pour rester chef d'équipe." },
    { slug: "ssiap-3", texte: "Le niveau supérieur, pour diriger un service de sécurité incendie." },
  ],
  faq: [
    {
      question: "Le SSIAP 2 est-il accessible sans expérience professionnelle ?",
      reponse:
        "Non. Il faut avoir exercé 1 607 heures comme agent de sécurité incendie au cours des 24 derniers mois, soit l'équivalent d'une année à temps plein. C'est la principale différence avec le SSIAP 1, ouvert sans expérience.",
    },
    {
      question: "Comment justifier les 1 607 heures d'exercice ?",
      reponse:
        "Par une attestation de votre employeur ou par la présentation de votre contrat de travail. Le centre de formation vérifie cette condition avant de vous présenter à l'examen.",
    },
    {
      question: "Pourquoi l'examen comporte-t-il une épreuve de pédagogie ?",
      reponse:
        "Parce que le chef d'équipe forme ses agents. Le jury évalue d'abord la justesse technique de la séquence animée : l'aisance pédagogique ne doit pas être le seul critère d'élimination.",
    },
    {
      question: "L'épreuve pratique se fait-elle sur un vrai système de sécurité incendie ?",
      reponse:
        "Oui. La gestion du poste de sécurité en situation de crise se passe sur un système de sécurité incendie de catégorie A en fonctionnement. Vous remettez votre main courante au jury à la fin de l'épreuve.",
    },
    {
      question: "Un ancien sapeur-pompier peut-il obtenir le SSIAP 2 par équivalence ?",
      reponse:
        "Oui, s'il a été au moins sous-officier pendant un an et détient certaines qualifications de prévention (PRV 1, AP 1 ou certificat de prévention). Il suit alors un module complémentaire, sans évaluation, et reçoit le diplôme par équivalence.",
    },
    {
      question: "Devenu chef d'équipe, quel recyclage dois-je suivre ?",
      reponse:
        "Celui qui correspond à l'emploi que vous occupez ou envisagez d'occuper. Un titulaire du SSIAP 2 en poste de chef d'équipe suit le recyclage SSIAP 2, tous les trois ans.",
    },
  ],
};
