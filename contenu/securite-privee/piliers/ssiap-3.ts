import type { ContenuPilier } from "./types";

// Sources (vérifiées le 06/10/2026) : arrêté du 2 mai 2005 modifié (art. 2, 3, 6, 7, 8 ; annexes IV, IX et XIII),
// fiche France compétences RS5643.
export const ssiap3: ContenuPilier = {
  gabarit: "A",
  definition:
    "Le SSIAP 3 est le diplôme de chef de service de sécurité incendie. Il permet de diriger le service de sécurité d'un établissement recevant du public ou d'un immeuble de grande hauteur, et de conseiller le chef d'établissement en matière de sécurité incendie.",
  faits: {
    prerequis: "Diplôme de niveau 4, ou SSIAP 2 et 3 ans d'expérience",
    verifieLe: "2026-10-06",
  },
  bloc4: {
    h2: "Ce que permet le SSIAP 3",
    sections: [
      {
        h3: "Les métiers accessibles",
        texte:
          "Chef de service de sécurité incendie. Le poste porte sur un service entier, et non plus sur une équipe : manager le service, conseiller le chef d'établissement, assurer le suivi des contrôles et de l'entretien réglementaires, tenir les registres et les documents administratifs. Le chef de service est l'interlocuteur des commissions de sécurité.",
      },
      {
        h3: "Ce que le diplôme autorise",
        texte:
          "Seul le SSIAP 3, ou une équivalence prévue par l'arrêté, permet d'occuper un emploi de chef de service de sécurité incendie. En fonction, un chef de service peut être désigné membre du jury des examens SSIAP. Comme les niveaux 1 et 2, ce diplôme ne relève pas du CNAPS.",
      },
      {
        h3: "Les débouchés en Île-de-France",
        texte:
          "Les chefs de service sont recrutés par les établissements qui organisent eux-mêmes leur sécurité incendie et par les entreprises de sécurité qui gèrent ce service pour leurs clients. Le diplôme a deux publics : les chefs d'équipe expérimentés qui évoluent, et des titulaires d'un diplôme de niveau 4 qui n'ont jamais exercé en sécurité incendie. L'arrêté prévoit les deux voies d'accès.",
      },
    ],
  },
  conditions: {
    premiere: {
      h3: "Un diplôme de niveau 4 ou le SSIAP 2 avec trois ans d'expérience",
      texte:
        "Deux voies au choix : un diplôme de niveau 4 au minimum (niveau bac), éventuellement obtenu par validation des acquis de l'expérience ; ou le SSIAP 2 (ou un ancien diplôme ERP 2 ou IGH 2 délivré avant le 31 décembre 2005) avec trois ans d'expérience dans la fonction, attestés par l'employeur ou le contrat de travail.",
    },
    propres: {
      h3: "Les conditions propres au SSIAP 3",
      texte:
        "Une qualification de secourisme est exigée : PSC ou AFPS de moins de deux ans, SST ou PSE 1 en cours de validité. Les titulaires de certains diplômes, listés à l'annexe XIII de l'arrêté, peuvent se présenter directement à l'examen sans suivre la formation : un organisme agréé les y présente et leur propose un module facultatif adapté.",
    },
  },
  programme: {
    intro:
      "Le programme est fixé par l'annexe IV de l'arrêté du 2 mai 2005. La réglementation incendie et l'étude des bâtiments en occupent près des deux tiers. Dix stagiaires au plus par session.",
    modules: [
      { nom: "Le feu et ses conséquences", volume: "12 h" },
      { nom: "La sécurité incendie et les bâtiments : matériaux, études de plans, outils d'analyse", volume: "65 h" },
      { nom: "La réglementation incendie : classement, dispositions constructives, moyens de secours", volume: "70 h" },
      { nom: "Gestion des risques : analyse, travaux de sécurité, documents administratifs", volume: "23 h" },
      { nom: "Conseil au chef d'établissement", volume: "6 h" },
      { nom: "Correspondant des commissions de sécurité", volume: "6 h" },
      { nom: "Management de l'équipe de sécurité : organisation, encadrement, droit du travail", volume: "26 h" },
      { nom: "Budget du service sécurité : suivi budgétaire, achats, maintenance", volume: "8 h" },
    ],
    evaluation:
      "L'examen comprend un QCM de 40 questions en 40 minutes, une épreuve écrite de 2 h 30 avec documents (la rédaction d'une notice technique de sécurité pour l'aménagement de locaux) et un oral de 15 minutes devant un jury composé d'un président et de deux chefs de service en fonction. Chaque écrit doit atteindre 8 sur 20 et leur moyenne 12 sur 20 ; l'oral est évalué apte ou inapte. Les notes d'au moins 8 et l'aptitude à l'oral restent acquises un an.",
  },
  duree:
    "La formation dure au minimum 216 heures, hors examen et temps de déplacement, soit plus de trois fois le SSIAP 2. Cela représente plus de six semaines à temps plein. Une fois diplômé, le chef de service suit un recyclage de 21 heures tous les trois ans, et une remise à niveau de 35 heures s'il a laissé passer l'échéance ou n'a pas exercé 1 607 heures au cours des 36 derniers mois.",
  cout: "Chaque organisme référencé affiche son tarif sur sa fiche. La durée de la formation pèse sur le prix : comparez le coût total, mais aussi le calendrier, qui détermine combien de temps vous serez absent de votre poste.",
  financementCpf:
    "Mobilisable : le SSIAP 3 est enregistré au répertoire spécifique de France compétences (RS5643). En 2026, une participation forfaitaire de 150 euros reste à votre charge.",
  titresLies: [
    { slug: "ssiap-2", texte: "Le diplôme de chef d'équipe, l'une des deux voies d'accès au SSIAP 3." },
    { slug: "recyclage-ssiap-3", texte: "Le stage de 21 heures à suivre tous les trois ans." },
  ],
  faq: [
    {
      question: "Peut-on préparer le SSIAP 3 sans être passé par les SSIAP 1 et 2 ?",
      reponse:
        "Oui, avec un diplôme de niveau 4 au minimum, l'équivalent du bac. Sans ce diplôme, la seule voie est le SSIAP 2 avec trois ans d'expérience de la fonction.",
    },
    {
      question: "Qu'est-ce que la notice technique de sécurité demandée à l'examen ?",
      reponse:
        "Un document rédigé en 2 h 30, avec documents, sur un projet d'aménagement de locaux dans un groupement d'établissements de 1re ou 2e catégorie. Vous y présentez le projet, la nature des travaux, leurs incidences pour la commission de sécurité, et vous décrivez les dégagements, les matériaux et les équipements touchés.",
    },
    {
      question: "Certains diplômes dispensent-ils de la formation ?",
      reponse:
        "Oui. Les titulaires d'un diplôme inscrit à l'annexe XIII de l'arrêté peuvent se présenter directement à l'examen, sans suivre les 216 heures. Ils doivent être présentés par un organisme agréé, qui leur propose un module facultatif.",
    },
    {
      question: "Un ancien sapeur-pompier peut-il obtenir le SSIAP 3 par équivalence ?",
      reponse:
        "Oui, s'il a été au moins adjudant pendant un an et détient le PRV 2 ou le brevet de prévention, ou s'il détient l'AP 2. Il suit alors un module complémentaire sans évaluation. Certains DUT « hygiène et sécurité » ouvrent la même équivalence.",
    },
    {
      question: "Pourquoi la formation est-elle aussi longue ?",
      reponse:
        "Parce que le chef de service conseille son établissement sur la réglementation : 70 heures portent sur la réglementation incendie et 65 heures sur les bâtiments et la lecture de plans, deux matières quasi absentes des niveaux inférieurs.",
    },
    {
      question: "Le chef de service participe-t-il aux examens SSIAP ?",
      reponse:
        "Oui, il peut être désigné membre du jury. Le recyclage du SSIAP 3 aborde d'ailleurs ce rôle de membre de jury dans sa séquence consacrée à la réglementation.",
    },
  ],
};
