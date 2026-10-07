import type { ContenuPilier } from "./types";

// Sources (vérifiées le 06/10/2026) : arrêté du 27 février 2017 relatif à la formation continue des agents privés de
// sécurité (art. 4 et article relatif à la protection physique des personnes, version en vigueur au 1er octobre 2025).
export const macA3p: ContenuPilier = {
  gabarit: "B",
  h1: "MAC A3P — Maintien et actualisation des compétences des agents de protection physique des personnes",
  definition:
    "Le MAC A3P est le stage obligatoire pour renouveler votre carte professionnelle de protection physique des personnes. Il se suit avant l'échéance des cinq ans, et sans lui le renouvellement n'est pas possible.",
  faits: {
    periodicite: "Tous les 5 ans",
    prerequis: "Carte professionnelle en cours de validité",
    verifieLe: "2026-10-06",
  },
  bloc4: {
    h2: "Quand suivre votre MAC A3P",
    sections: [
      {
        h3: "La fenêtre à respecter",
        texte:
          "Le stage se suit **dans les 24 mois qui précèdent l'échéance de votre carte**. L'attestation accompagne ensuite la demande de renouvellement, à déposer au moins trois mois avant l'échéance.",
      },
      {
        h3: "Ce qui se passe si vous dépassez l'échéance",
        texte:
          "Une carte expirée n'autorise plus l'exercice. La demande reste traitée comme un renouvellement jusqu'à cinq ans après l'expiration ; au-delà, elle devient une demande initiale. Dans les deux cas, l'attestation du MAC est exigée.",
      },
      {
        h3: "Un stage par activité détenue",
        texte:
          "Si vous détenez aussi une carte de surveillance humaine, celle-ci a son propre MAC. Les modules communs aux deux stages (premiers secours, principes de la République, prévention des risques terroristes) ne se refont pas s'ils ont été suivis dans les 24 mois avant l'échéance : vous en êtes dispensé à votre demande.",
      },
    ],
  },
  conditions: {
    premiere: {
      h3: "Une carte professionnelle en cours de validité",
      texte:
        "Le MAC s'adresse aux agents titulaires de la carte de protection physique des personnes. Il se suit avant le dépôt de la demande de renouvellement, qui s'ouvre six mois avant l'expiration de la carte.",
    },
    propres: {
      h3: "Les conditions propres au MAC A3P",
      texte:
        "Les agents qui exercent armés suivent, en plus, 26 heures sur la réglementation des armes, leur emploi et le secourisme tactique, et doivent justifier de tous leurs entraînements réguliers, dont au moins deux l'année du renouvellement.",
    },
  },
  programme: {
    intro:
      "Le contenu est fixé par l'arrêté du 27 février 2017 relatif à la formation continue, dans sa version en vigueur depuis le 1er octobre 2025. Il fait une large place aux gestes techniques du métier, travaillés en mises en situation sur différents scénarios.",
    modules: [
      { nom: "Gestes élémentaires de premiers secours", volume: "7 h" },
      { nom: "Principes de la République", volume: "3 h" },
      { nom: "Actualisation juridique : activité, déontologie, dispositions du code pénal", volume: "8 h" },
      { nom: "Principes fondamentaux : placements, secteurs d'observation, rôle de l'agent", volume: "1 h" },
      { nom: "Mettre en œuvre une mission : préparation, dispositif, itinéraires, protocole", volume: "2 h" },
      { nom: "Assurer un déplacement : portes, escaliers, ascenseurs, foule, individu menaçant", volume: "5 h" },
      { nom: "Dispositifs embarqués : embarquement et débarquement selon les scénarios", volume: "2 h" },
      { nom: "Prévention des risques terroristes", volume: "13 h" },
    ],
    evaluation:
      "Pas d'examen. Les modules techniques se travaillent en mises en situation et en exercices sur différents scénarios. Le stage donne lieu à une attestation de suivi, à joindre à la demande de renouvellement.",
  },
  duree:
    "Le stage dure 41 heures, ramenées à 34 heures si vous êtes titulaire d'un SST valide ou d'un recyclage PSC de moins de deux ans : vous êtes alors dispensé, à votre demande, du module de premiers secours. Pour un agent armé, 26 heures s'y ajoutent.",
  cout: "C'est un achat contraint et récurrent. Chaque organisme référencé affiche son tarif : vérifiez que les mises en situation techniques sont bien assurées avec du matériel et des véhicules adaptés.",
  financementCpf:
    "À vérifier sur Mon Compte Formation : seuls les stages rattachés à une certification enregistrée au RNCP ou au répertoire spécifique y sont proposés.",
  titresLies: [
    { slug: "tfp-a3p", texte: "Le titre initial dont ce stage assure le maintien." },
    { slug: "mac-aps", texte: "Le maintien de la surveillance humaine, si votre carte la porte aussi." },
  ],
  faq: [
    {
      question: "Quels gestes techniques sont révisés pendant le MAC A3P ?",
      reponse:
        "Les franchissements de portes, les escaliers et les ascenseurs, les demi-tours et arrêts du client, la gestion d'un individu menaçant, les passages de foule, et l'embarquement d'une personne protégée dans différents dispositifs de véhicules.",
    },
    {
      question: "J'exerce armé : mon stage est-il différent ?",
      reponse:
        "Oui. S'ajoutent 3 heures sur la réglementation des armes, 18 heures sur leur emploi et 5 heures de secourisme tactique. Vous devez aussi justifier de l'ensemble de vos entraînements réguliers, dont au moins deux l'année du renouvellement.",
    },
    {
      question: "Puis-je être dispensé d'une partie du stage ?",
      reponse:
        "Du module de premiers secours, si vous avez un SST valide ou un recyclage PSC de moins de deux ans. Et de tout module déjà suivi dans un autre stage de maintien au cours des 24 mois avant l'échéance.",
    },
    {
      question: "Quelle différence entre le MAC A3P et le MAC APS ?",
      reponse:
        "Ils partagent un socle (premiers secours, principes de la République, risques terroristes), mais le MAC A3P remplace les modules de surveillance par la protection rapprochée : préparation de mission, déplacements, véhicules. Il dure 41 heures, contre 34 pour le MAC APS.",
    },
    {
      question: "Le stage comporte-t-il des mises en situation ?",
      reponse:
        "Oui, c'est obligatoire pour les modules techniques : mises en situation et exercices sur différents scénarios, avec plusieurs types de véhicules et de dispositifs.",
    },
  ],
};
