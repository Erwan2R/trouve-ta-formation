import type { ContenuDemarche } from "./types";

// Copy_Pages_Demarches_CNAPS.md §6. BROUILLON : marqueurs à lever avant publication.
export const carteProfessionnelle: ContenuDemarche = {
  etape: 3,
  title: "Carte professionnelle CNAPS : demande, pièces et délais 2026",
  description:
    "Comment demander sa carte professionnelle CNAPS après sa formation : conditions, aptitude professionnelle, pièces à fournir et dépôt sur Dracar Ultimate.",
  h1: "Carte professionnelle CNAPS : faire sa demande après la formation",
  definition:
    "La carte professionnelle est le document qui vous autorise à exercer. Obtenir votre titre ne suffit pas : c'est la carte, délivrée par le CNAPS après vérification de votre aptitude et de votre moralité, qui vous permet de travailler.",
  encadre: {
    aQui: "Toute personne titulaire d'un titre reconnu souhaitant exercer une activité de sécurité privée",
    quand: "Après l'obtention du titre",
    ou: "En ligne sur Dracar Ultimate",
    pieces: "Pièce d'identité, justificatif de domicile, attestation du titre obtenu",
  },
  qui: {
    h2: "Qui doit demander une carte professionnelle",
    sommaire: "Qui doit la demander",
    paragraphes: [
      "Toute personne exerçant une activité de sécurité privée doit détenir une carte professionnelle : surveillance et gardiennage, sécurité incendie, agent cynophile, opérateur de vidéoprotection, protection physique des personnes, transport de fonds.",
      "La carte est **nominative et attachée à vous**, pas à votre employeur. Un changement d'entreprise ne suppose aucune nouvelle demande : vous conservez votre carte.",
      "Exercer sans carte valide expose l'agent et son employeur à des sanctions pénales. [à vérifier]",
    ],
  },
  conditions: {
    h2: "L'aptitude professionnelle : quel titre pour quelle activité",
    intro:
      "C'est la condition qui distingue cette démarche des deux autres, et celle sur laquelle se jouent la plupart des rejets.",
    sections: [
      {
        h3: "Votre carte porte les activités que votre titre couvre",
        paragraphes: [
          "**Votre carte porte les activités que votre titre couvre, et uniquement celles-là.** Demander une mention pour une activité que votre formation ne couvre pas conduit au rejet de cette mention. Un titulaire du TFP APS ne peut pas obtenir la mention cynophile sans le titre correspondant.",
          "Tableau de correspondance titre / activité. [à compléter]",
        ],
      },
      {
        h3: "Les autres conditions, en bref",
        paragraphes: [
          "Les conditions de moralité, de casier judiciaire et de titre de séjour sont les mêmes que celles vérifiées lors de l'autorisation préalable, et le CNAPS les réexamine à ce stade. Une situation qui a changé depuis votre entrée en formation peut donc modifier la décision.",
        ],
        lien: {
          href: "demarches/autorisation-prealable/#conditions",
          libelle: "Voir le détail des conditions de moralité →",
        },
      },
      {
        h3: "La nouvelle spécialité « surveillance de grands événements »",
        paragraphes: [
          "Le CNAPS a annoncé fin juillet 2026 la pérennisation de cette carte, créée pour la Coupe du monde de rugby et les Jeux. [à compléter]",
        ],
      },
    ],
  },
  pieces: {
    intro:
      "Base de travail : pièce d'identité, justificatif de domicile, attestation ou diplôme du titre obtenu, photographie d'identité. La question d'une promesse d'embauche ou d'un contrat de travail est traitée différemment selon les sources et doit être tranchée. [à vérifier]",
    liste: [
      "Une pièce d'identité en cours de validité",
      "Un justificatif de domicile",
      "L'attestation ou le diplôme du titre obtenu",
      "Une photographie d'identité",
    ],
  },
  depot: {
    intro:
      "La demande se dépose en ligne sur Dracar Ultimate. Si vous avez créé votre compte pour l'autorisation préalable, la demande de carte se dépose depuis le même espace.",
    etapes: [
      {
        h3: "Se connecter à votre espace personnel",
        texte: "Le même compte que pour l'autorisation préalable, s'il existe déjà.",
      },
      {
        h3: "Remplir et déposer le formulaire",
        texte: "Déroulé exact des écrans à relever sur le portail. [à compléter]",
      },
      {
        h3: "Suivre l'instruction depuis votre espace",
        texte:
          "Les échanges avec le service instructeur passent par la messagerie interne du portail : consultez-la régulièrement pendant l'instruction.",
      },
    ],
  },
  delais: {
    intro:
      "Même incertitude sur les sources que pour l'autorisation préalable. Le délai sera affiché une fois confirmé auprès du CNAPS. [à vérifier]",
    lignes: [
      ["Ce qui l'allonge", "Dossier incomplet, pièce illisible, demande de complément"],
      [
        "Récépissé",
        "Plusieurs sources évoquent un récépissé permettant d'exercer dans l'attente de la carte, sous conditions. [à vérifier]",
      ],
    ],
  },
  refus: {
    h2: "Rejets, duplicata et extension d'activité",
    sections: [
      {
        titre: "Les motifs de rejet les plus fréquents",
        liste: [
          "Demander une mention d'activité non couverte par le titre obtenu",
          "Découvrir au stade de la carte une inscription au casier qui n'avait pas été vérifiée avant la formation",
          "Déposer un dossier incomplet, ce qui n'entraîne pas un refus mais une demande de complément, avec un délai de réponse limité",
        ],
      },
      {
        titre: "Perte, vol, duplicata",
        texte: "Procédure de duplicata et poursuite d'activité dans l'attente. [à compléter]",
      },
      {
        titre: "Extension d'activité",
        texte:
          "Un agent qui obtient un titre supplémentaire peut demander l'ajout de l'activité correspondante à sa carte, sans repartir d'une première demande. [à vérifier]",
      },
    ],
  },
  ensuite: {
    h2: "Une fois la carte obtenue",
    paragraphes: [
      "Votre carte est valable cinq ans. Notez dès maintenant sa date d'expiration : le renouvellement suppose un stage de maintien des compétences à suivre **avant** l'échéance, et une carte expirée interdit d'exercer.",
      "Si vous envisagez d'élargir vos activités — sécurité incendie, cynophile, spécialités — c'est le moment de repérer le titre correspondant.",
    ],
    liens: [
      { href: "demarches/renouvellement-carte-professionnelle/", libelle: "Préparer le renouvellement de sa carte" },
      { href: "#formations", libelle: "Comparer les titres de la sécurité privée" },
    ],
  },
  formations: {
    h2: "Les titres qui donnent accès à une carte professionnelle",
    titres: [{ slug: "tfp-aps" }, { slug: "tfp-asc" }, { slug: "tfp-asa" }, { slug: "tfp-a3p" }],
  },
  faqTitre: "Questions fréquentes sur la carte professionnelle",
  faq: [
    {
      question: "Le titre suffit-il pour travailler ?",
      reponse:
        "Non. Le titre établit votre aptitude professionnelle ; c'est la carte professionnelle qui autorise l'exercice.",
    },
    {
      question: "Ma carte est-elle liée à mon employeur ?",
      reponse: "Non. Elle est nominative et vous suit d'une entreprise à l'autre.",
    },
    {
      question: "Puis-je demander plusieurs activités sur la même carte ?",
      reponse: "Oui, à condition de détenir le titre correspondant à chacune.",
    },
    {
      question: "Puis-je travailler pendant l'instruction de ma demande ?",
      reponse: "Question du récépissé, à trancher en priorité. [à vérifier]",
    },
    { question: "Que se passe-t-il si je change d'adresse ?", reponse: "[à compléter]" },
    {
      question: "Comment un employeur vérifie-t-il ma carte ?",
      reponse:
        "Par la consultation publique des titres mise à disposition par le CNAPS, qui permet de vérifier la validité d'une carte professionnelle.",
    },
  ],
};
