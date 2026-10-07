import type { ContenuPilier } from "./types";

// Sources (vérifiées le 06/10/2026) : arrêté du 2 mai 2005 modifié (art. 2 à 4, 7, 8, 15 ; annexes II et IX),
// fiche France compétences RS5641.
export const ssiap1: ContenuPilier = {
  gabarit: "A",
  definition:
    "Le SSIAP 1 est le diplôme d'entrée de la sécurité incendie. Il permet d'exercer comme agent de service de sécurité incendie dans les établissements recevant du public et les immeubles de grande hauteur.",
  faits: {
    prerequis: "Secourisme à jour et certificat médical",
    verifieLe: "2026-10-06",
  },
  bloc4: {
    h2: "Ce que permet le SSIAP 1",
    sections: [
      {
        h3: "Les métiers accessibles",
        texte:
          "Agent de service de sécurité incendie, au poste de sécurité ou en ronde. Ses missions sont fixées par l'arrêté du 2 mai 2005 : prévenir les incendies, sensibiliser les employés, assurer l'entretien élémentaire des moyens de secours, alerter et accueillir les secours, évacuer le public, intervenir tôt sur un départ de feu, porter assistance aux personnes et exploiter le poste de sécurité incendie. L'agent travaille sous l'autorité d'un chef d'équipe SSIAP 2.",
      },
      {
        h3: "Ce que le diplôme autorise",
        texte:
          "Le SSIAP relève de la réglementation incendie des établissements recevant du public et des immeubles de grande hauteur, et non du livre VI du code de la sécurité intérieure qui encadre la surveillance. Il ne s'accompagne donc d'aucune carte professionnelle du CNAPS : c'est le diplôme lui-même qui ouvre l'emploi. Avant de prendre un poste dans un nouvel établissement, l'agent effectue deux périodes de travail en doublure avec un agent déjà en poste. Il doit aussi détenir l'habilitation électrique exigée sur le site, et sa tenue ne peut pas être bleu marine, couleur réservée aux secours publics.",
      },
      {
        h3: "Les débouchés en Île-de-France",
        texte:
          "Deux types d'employeurs recrutent des agents SSIAP 1 : les entreprises de sécurité privée, qui placent leurs agents chez des clients, et les exploitants qui gèrent eux-mêmes leur service de sécurité incendie. Les postes se trouvent dans tous les établissements soumis à cette obligation : commerces, établissements de santé, hôtels, salles de spectacle, immeubles de bureaux de grande hauteur.",
      },
    ],
  },
  conditions: {
    premiere: {
      h3: "Une qualification de secourisme",
      texte:
        "Elle est exigée dès l'entrée en formation : un PSC (ou l'ancienne AFPS) de moins de deux ans, ou un SST ou un PSE 1 en cours de validité.",
    },
    propres: {
      h3: "Les conditions propres au SSIAP 1",
      texte:
        "Un certificat médical de moins de trois mois, établi selon le modèle de l'arrêté, atteste votre aptitude physique. Aucune expérience professionnelle n'est demandée, ni aucun diplôme : c'est ce qui distingue le SSIAP 1 des deux niveaux supérieurs.",
    },
  },
  programme: {
    intro:
      "Le programme est fixé par l'annexe II de l'arrêté du 2 mai 2005. Il est identique dans tous les centres agréés, qui accueillent au plus douze stagiaires par session.",
    modules: [
      { nom: "Le feu et ses conséquences", volume: "6 h" },
      {
        nom: "Sécurité incendie : classement des établissements, évacuation, désenfumage, éclairage de sécurité",
        volume: "17 h",
      },
      { nom: "Installations techniques et système de sécurité incendie", volume: "9 h" },
      { nom: "Rôle et missions de l'agent : poste de sécurité, rondes, moyens d'extinction", volume: "18 h" },
      { nom: "Concrétisation des acquis : visites applicatives et mises en situation", volume: "17 h" },
    ],
    evaluation:
      "L'examen se passe devant un jury. Il comprend un QCM de 30 questions en 30 minutes, noté sur 20, et une épreuve pratique de 15 minutes : une ronde avec des anomalies et la découverte d'un sinistre, suivie de la rédaction d'une main courante. Le diplôme est délivré avec au moins 12 sur 20 au QCM et un avis « apte » à la pratique. En cas d'échec, vous avez un an pour repasser les épreuves manquées ; au-delà, il faut refaire toute la formation.",
  },
  duree:
    "La formation dure au minimum 67 heures, hors examen et temps de déplacement. Ce qui change d'un centre à l'autre, c'est le rythme. Une fois diplômé, vous suivez un recyclage de 14 heures tous les trois ans, et votre secourisme se recycle tous les deux ans. Une remise à niveau de 21 heures s'impose si le recyclage n'a pas été fait à temps, ou si vous n'avez pas travaillé au moins 1 607 heures comme agent au cours des 36 derniers mois.",
  cout: "Chaque organisme référencé affiche son tarif sur sa fiche. Les écarts s'expliquent par le format de la session, par ce que comprend le prix (frais d'examen, secourisme passé sur place) et par les moyens du centre pour les exercices d'extinction, sur feu réel ou sur bac à feu écologique.",
  financementCpf:
    "Mobilisable : le SSIAP 1 est enregistré au répertoire spécifique de France compétences (RS5641). En 2026, une participation forfaitaire de 150 euros reste à votre charge.",
  titresLies: [
    { slug: "ssiap-2", texte: "Le niveau supérieur, pour encadrer une équipe d'agents SSIAP 1." },
    { slug: "recyclage-ssiap-1", texte: "Le stage à suivre tous les trois ans pour conserver le droit d'exercer." },
    {
      slug: "tfp-aps",
      texte: "Le titre de la surveillance, avec sa carte professionnelle. Beaucoup d'agents cumulent les deux.",
    },
  ],
  faq: [
    {
      question: "Quelle différence entre le SSIAP 1 et le TFP APS ?",
      reponse:
        "Le SSIAP 1 porte sur la sécurité incendie des établissements recevant du public et des immeubles de grande hauteur. Le TFP APS porte sur la surveillance humaine, encadrée par le livre VI du code de la sécurité intérieure et soumise à la carte professionnelle du CNAPS. Un poste mixte suppose les deux qualifications.",
    },
    {
      question: "Le SSIAP 1 demande-t-il une autorisation du CNAPS ?",
      reponse:
        "Non. Les conditions d'accès fixées par l'arrêté du 2 mai 2005 ne prévoient ni autorisation préalable, ni carte professionnelle. C'est le diplôme qui permet d'occuper l'emploi.",
    },
    {
      question: "Peut-on exercer comme agent SSIAP 1 sans avoir suivi cette formation ?",
      reponse:
        "Oui, avec certains diplômes reconnus par l'arrêté : le bac professionnel « sécurité prévention », le brevet professionnel d'agent technique de prévention et de sécurité, le CAP d'agent de prévention et de sécurité ou la mention complémentaire « sécurité civile et d'entreprise ». Les anciens sapeurs-pompiers obtiennent aussi le diplôme par équivalence, après un module complémentaire.",
    },
    {
      question: "Quel secourisme faut-il avoir avant d'entrer en formation ?",
      reponse:
        "Un PSC ou une AFPS de moins de deux ans, ou un SST ou un PSE 1 en cours de validité. Le diplôme de secourisme doit ensuite être recyclé tous les deux ans, au plus tard à sa date anniversaire.",
    },
    {
      question: "Combien de temps le SSIAP 1 reste-t-il valable ?",
      reponse:
        "Le diplôme ne se perd pas, mais le droit d'exercer suppose un recyclage tous les trois ans, au plus tard à la date anniversaire du diplôme. Cette échéance est distincte des cinq ans de la carte professionnelle de surveillance, ce qui surprend les agents qui détiennent les deux.",
    },
    {
      question: "Où se déroule l'épreuve pratique de l'examen ?",
      reponse:
        "Dans un établissement recevant du public ou un immeuble de grande hauteur, dont l'exploitant autorise la manipulation des installations. Elle peut aussi avoir lieu au centre de formation s'il dispose des équipements nécessaires et si le président du jury l'accepte.",
    },
  ],
};
