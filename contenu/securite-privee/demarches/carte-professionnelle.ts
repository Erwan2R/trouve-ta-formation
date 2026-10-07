import type { ContenuDemarche } from "./types";

// Copy_Pages_Demarches_CNAPS.md §6. Relevé CNAPS d'Erwan du 07/10/2026 (FAQ, actualité du 31/07/2026, page
// « Renouveler votre carte professionnelle ») et écrans Dracar Ultimate.
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
      "Toute personne exerçant une activité de sécurité privée relevant du CNAPS doit détenir une carte professionnelle, par exemple surveillance et gardiennage, agent cynophile, protection physique des personnes, sûreté aéroportuaire ou transport de fonds. La sécurité incendie (SSIAP) n'en relève pas : c'est le diplôme qui ouvre l'emploi.",
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
        h3: "Policiers, gendarmes, militaires et réservistes",
        paragraphes: [
          "Certaines fonctions valent aptitude professionnelle, sur justificatif : officiers et agents de police judiciaire de la police et de la gendarmerie nationales, policiers adjoints et gendarmes adjoints volontaires ayant la qualité d'agent de police judiciaire adjoint, policiers municipaux ayant cette qualité (arrêté de nomination) ; militaires et agents des armées (attestation du ministère des Armées, délivrée par le service gestionnaire) ; réservistes de la garde nationale justifiant de trois ans de service, de 110 jours d'activité dont 20 en mission opérationnelle et de la formation prévue (contrat d'engagement, état de service, attestation de formation).",
        ],
      },
      {
        h3: "La nouvelle spécialité « surveillance de grands événements »",
        paragraphes: [
          "Le décret n° 2026-670 du 27 juillet 2026 crée une spécialité « surveillance de grands évènements », pour les manifestations sportives, récréatives, culturelles ou économiques de plus de 300 personnes. Elle donne lieu à une carte professionnelle spécifique, délivrée après une formation adaptée, et ne permet pas d'exercer la surveillance en dehors de ces manifestations. Une passerelle vers la surveillance et le gardiennage doit être fixée par arrêté. Les titulaires de l'ancienne carte « Surveillance grands évènements » sont réputés détenir la nouvelle jusqu'à la fin de sa validité.",
        ],
      },
    ],
  },
  pieces: {
    intro: "Le formulaire de demande sur Dracar Ultimate fait foi : il indique les pièces propres à votre situation.",
    liste: [
      "Une carte nationale d'identité ou un passeport en cours de validité, mentionnant la date et le lieu de naissance (à défaut, un extrait d'acte de naissance) ; pour les ressortissants hors Union européenne, le titre de séjour",
      "Un justificatif de domicile de moins de trois mois",
      "Le justificatif de votre aptitude professionnelle pour l'activité demandée : certification enregistrée au RNCP, CQP agréé ou titre reconnu dans un État de l'Union européenne",
      "Une photographie d'identité récente",
      "Pour les ressortissants étrangers, européens compris : un justificatif du niveau de français B1 (votre titre d'agent de sécurité suffit), et l'équivalent du bulletin n° 3 du casier judiciaire du pays de naissance, de moins de trois mois, traduit par un traducteur assermenté",
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
        texte:
          "Dans « Déposer une demande », choisissez « Carte professionnelle », puis l'activité concernée : une seule par demande, parmi 20 (les 19 de l'autorisation préalable, plus formateur). Si vous détenez plusieurs titres, déposez une demande par activité. Un brouillon d'autorisation préalable jamais envoyé bloque toute nouvelle demande : terminez-le ou envoyez-le d'abord. Si vous avez accepté le « circuit court » lors de l'autorisation préalable, cette demande n'est pas nécessaire.",
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
      "Selon le CNAPS, une demande de carte professionnelle est traitée en quatre jours ouvrés en moyenne, pour un dossier complet et sans vérification complémentaire. L'enquête peut prendre plus de temps si vous êtes connu des services de police ou de gendarmerie. Sans réponse au bout de deux mois, la demande est considérée comme rejetée.",
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
      question: "Puis-je avoir plusieurs activités sur la même carte ?",
      reponse:
        "Non. Depuis Dracar Ultimate, chaque activité fait l'objet d'une demande et d'une carte distinctes, à condition de détenir le titre correspondant à chacune. On ne peut plus ajouter une activité à une carte existante.",
    },
    {
      question: "Puis-je travailler pendant l'instruction de ma demande ?",
      reponse:
        "Non. Le titre ne suffit pas : seule la carte délivrée autorise l'exercice. Le récépissé permettant de continuer à exercer concerne le renouvellement d'une carte existante, pas une première demande.",
    },
    {
      question: "Que se passe-t-il si je change d'adresse ?",
      reponse: "Vous devez le signaler au CNAPS, depuis la messagerie de votre espace Dracar Ultimate.",
    },
    {
      question: "Dois-je redemander une carte après l'examen si j'ai choisi le « circuit court » ?",
      reponse:
        "Non. Si vous avez accepté le « circuit court » lors de votre demande d'autorisation préalable, la carte professionnelle est générée automatiquement une fois votre réussite à l'examen enregistrée par le CNAPS.",
    },
    {
      question: "À quel nom la carte est-elle délivrée ?",
      reponse: "Uniquement au nom de naissance, selon le CNAPS.",
    },
    {
      question: "Mon titre d'agent de sécurité prouve-t-il mon niveau de français ?",
      reponse:
        "Oui. Le CNAPS accepte comme justificatif du niveau de langue un diplôme français de niveau 3 au moins, ce qui inclut le CQP ou le titre à finalité professionnelle d'agent privé de sécurité.",
    },
    {
      question: "Que mentionne la carte professionnelle ?",
      reponse:
        "Votre numéro d'autorisation et l'activité pour laquelle vous êtes autorisé à exercer. Pour un agent cynophile, elle porte aussi le numéro d'identification de chacun des chiens utilisés.",
    },
    {
      question: "Comment un employeur vérifie-t-il ma carte ?",
      reponse:
        "Par la consultation publique des titres mise à disposition par le CNAPS, qui permet de vérifier la validité d'une carte professionnelle.",
    },
  ],
};
