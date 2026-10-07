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
    pieces: "Pièce d'identité, justificatif de domicile de moins de 3 mois, titre obtenu, photo d'identité",
  },
  qui: {
    h2: "Qui doit demander une carte professionnelle",
    sommaire: "Qui doit la demander",
    paragraphes: [
      "Toute personne exerçant une activité de sécurité privée doit détenir une carte professionnelle : surveillance et gardiennage, sécurité incendie, agent cynophile, opérateur de vidéoprotection, protection physique des personnes, transport de fonds.",
      "La carte est **nominative et attachée à vous**, pas à votre employeur. Un changement d'entreprise ne suppose aucune nouvelle demande : vous conservez votre carte.",
      "Exercer sans carte valide expose l'agent comme son employeur à des sanctions disciplinaires du CNAPS, et peut entraîner la rupture du contrat de travail de l'agent.",
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
          "**Depuis Dracar Ultimate, le CNAPS délivre une carte par activité, et seulement pour les activités que votre titre couvre.** Une demande pour une activité que votre formation ne couvre pas est rejetée : un titulaire du TFP APS ne peut pas obtenir la carte cynophile sans le titre correspondant.",
          "Correspondance titre / activité : le TFP APS ouvre la surveillance humaine ou le gardiennage ; le TFP ASC, l'activité d'agent cynophile ; le TFP A3P, la protection physique des personnes ; le TFP ASA, la sûreté aéroportuaire, qui demande en plus une certification de la DGAC. Les diplômes SSIAP de la sécurité incendie ne donnent lieu à aucune carte professionnelle.",
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
    intro: "Le formulaire de demande sur Dracar Ultimate fait foi : il indique les pièces propres à votre situation.",
    liste: [
      "Une carte nationale d'identité ou un passeport en cours de validité, mentionnant la date et le lieu de naissance (à défaut, un extrait d'acte de naissance) ; pour les ressortissants hors Union européenne, le titre de séjour",
      "Un justificatif de domicile de moins de trois mois",
      "Le justificatif de votre aptitude professionnelle : le diplôme, le titre ou le certificat obtenu pour l'activité demandée",
      "Une photographie d'identité récente",
      "Pour les ressortissants étrangers, européens compris : un justificatif du niveau de français B1, et l'équivalent du bulletin n° 3 du casier judiciaire du pays de naissance, de moins de trois mois, traduit par un traducteur assermenté",
    ],
    source: {
      href: "https://www.cnaps.interieur.gouv.fr/Actualites/Nouvelles-obligations-pour-les-demandes-de-titres",
      libelle: "CNAPS, « Nouvelles obligations pour les demandes de titres »",
      verifieLe: "2026-10-02",
    },
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
      "Selon le CNAPS, un dossier est en général traité en moins de 10 jours pour un demandeur inconnu des services de police. Sans réponse au bout de 2 mois, la demande est considérée comme rejetée.",
    lignes: [
      ["Ce qui l'allonge", "Dossier incomplet, pièce illisible, demande de complément"],
      ["Exercer dans l'attente", "Pas avant la délivrance de la carte : c'est elle qui autorise l'exercice"],
    ],
  },
  refus: {
    h2: "Rejets, duplicata et extension d'activité",
    sections: [
      {
        titre: "Les motifs de rejet les plus fréquents",
        liste: [
          "Demander une carte pour une activité non couverte par le titre obtenu",
          "Découvrir au stade de la carte une inscription au casier qui n'avait pas été vérifiée avant la formation",
          "Déposer un dossier incomplet, ce qui n'entraîne pas un refus mais une demande de complément, avec un délai de réponse limité",
        ],
      },
      {
        titre: "Perte, vol, duplicata",
        texte:
          "Contactez la délégation territoriale du CNAPS dont vous dépendez, par son formulaire de contact, par email ou par courrier, avec la copie recto verso lisible d'une pièce d'identité en cours de validité et un justificatif de domicile.",
      },
      {
        titre: "Extension d'activité",
        texte:
          "Une activité ne s'ajoute plus à une carte existante : depuis Dracar Ultimate, chaque activité a sa propre carte. Un agent qui obtient un titre supplémentaire dépose donc une demande de carte pour cette nouvelle activité.",
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
      reponse:
        "Non. Le titre ne suffit pas : seule la carte délivrée autorise l'exercice. Le récépissé permettant de continuer à exercer concerne le renouvellement d'une carte existante, pas une première demande.",
    },
    {
      question: "Que se passe-t-il si je change d'adresse ?",
      reponse:
        "Vous devez le signaler au CNAPS, par la démarche « Signaler un changement de coordonnées personnelles », en joignant notamment une copie de votre titre d'identité et votre numéro de titre CNAPS.",
    },
    {
      question: "Comment un employeur vérifie-t-il ma carte ?",
      reponse:
        "Par la consultation publique des titres mise à disposition par le CNAPS, qui permet de vérifier la validité d'une carte professionnelle.",
    },
  ],
};
