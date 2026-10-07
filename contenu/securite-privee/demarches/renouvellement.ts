import type { ContenuDemarche } from "./types";

// Copy_Pages_Demarches_CNAPS.md §7. BROUILLON : marqueurs à lever avant publication.
// Relevé CNAPS d'Erwan du 07/10/2026 (FAQ « Renouvellement et duplicata », « Dracar Ultimate », page « Renouveler
// votre carte professionnelle »). La fenêtre de dépôt vient de la base.
export const renouvellement: ContenuDemarche = {
  etape: 4,
  title: "Renouvellement carte professionnelle CNAPS : délais et MAC",
  description:
    "Renouveler sa carte professionnelle CNAPS : quand déposer sa demande, quel MAC suivre selon ses activités, quelles pièces fournir. Procédure à jour de Dracar Ultimate.",
  h1: "Renouveler sa carte professionnelle CNAPS",
  definition:
    "Votre carte professionnelle est valable cinq ans. Son renouvellement suppose d'avoir suivi un stage de maintien et d'actualisation des compétences correspondant à vos activités, et de déposer votre demande dans une fenêtre précise avant l'échéance.",
  encadre: {
    aQui: "Tout agent dont la carte professionnelle arrive à échéance",
    ou: "En ligne sur Dracar Ultimate, espace particulier",
    pieces: "Pièce d'identité, justificatif de domicile de moins de 3 mois, attestation MAC pour chaque activité",
  },
  qui: {
    h2: "Qui est concerné et quand",
    sommaire: "Qui et quand",
    paragraphes: [
      "Tout agent titulaire d'une carte professionnelle, cinq ans après sa délivrance.",
      "**Le calendrier est la difficulté principale de cette démarche.** Une carte expirée interdit d'exercer, immédiatement et sans période de tolérance. Un agent sans carte valide ne peut pas être affecté à une activité de sécurité privée.",
      "**Le MAC se suit dans les 24 mois qui précèdent l'échéance de la carte**, et la demande de renouvellement se dépose **entre six mois et trois mois avant cette échéance** : une demande adressée plus de six mois avant n'est pas prise en compte.",
    ],
    encart: {
      surtitre: "Calendrier",
      texte:
        "24 mois avant l'échéance : la fenêtre du MAC s'ouvre. 6 mois avant : le dépôt de la demande s'ouvre. 3 mois avant : date limite de dépôt pour pouvoir prétendre au récépissé. À l'échéance : sans nouvelle carte ni récépissé, plus d'exercice possible.",
    },
  },
  conditions: {
    h2: "Le MAC, condition du renouvellement",
    intro:
      "Le renouvellement est conditionné au suivi d'un stage de maintien et d'actualisation des compétences. Ce n'est pas une nouvelle formation initiale : c'est une remise à niveau, nettement plus courte, portant sur les évolutions réglementaires et la réactualisation des gestes professionnels.",
    sections: [
      {
        h3: "Un MAC par activité détenue",
        paragraphes: [
          "**Le point qui piège le plus d'agents : il faut un MAC par activité détenue.** Depuis Dracar Ultimate, chaque activité a sa propre carte, qui se renouvelle séparément avec l'attestation du MAC correspondant. Un module déjà suivi dans un autre stage, dans les 24 mois avant l'échéance, n'est pas à refaire si vous le demandez. Le MAC cynophile s'ajoute au socle commun et ses modules pratiques se font avec chaque chien inscrit sur la carte.",
          "Pour la surveillance humaine (MAC APS), le stage dure 34 heures, ramenées à 27 heures pour un agent titulaire d'un certificat SST valide ou d'un recyclage PSC1 de moins de deux ans, dispensé du module de premiers secours. Le MAC cynophile ajoute 32 heures au socle commun, et le MAC de protection physique des personnes dure 41 heures (34 avec la même dispense). Pour la sûreté aéroportuaire, une certification DGAC en cours de validité vaut attestation, complétée d'un module de 3 heures sur les principes de la République.",
        ],
      },
      {
        h3: "Les autres conditions, en bref",
        paragraphes: [
          "Les conditions de moralité sont réexaminées à chaque renouvellement. Une situation qui a évolué depuis la délivrance de votre carte peut conduire à un refus, même après cinq ans d'exercice sans incident.",
        ],
        lien: {
          href: "demarches/autorisation-prealable/#conditions",
          libelle: "Voir le détail des conditions de moralité →",
        },
      },
    ],
  },
  pieces: {
    intro:
      "L'attestation MAC est la pièce centrale, une par activité. Les conditions sont les mêmes que pour une première carte, à une exception : les ressortissants étrangers n'ont pas à fournir de nouveau l'équivalent du bulletin n° 3 de leur casier judiciaire. Le formulaire de demande sur Dracar Ultimate fait foi.",
    liste: [
      "Une carte nationale d'identité ou un passeport en cours de validité ; pour les ressortissants hors Union européenne, le titre de séjour",
      "Un justificatif de domicile de moins de trois mois",
      "Une photographie d'identité récente",
      "Une attestation de maintien et d'actualisation des compétences par activité détenue",
    ],
    source: {
      href: "https://www.cnaps.interieur.gouv.fr/Actualites/Nouvelles-obligations-pour-les-demandes-de-titres",
      libelle: "CNAPS, « Nouvelles obligations pour les demandes de titres »",
      verifieLe: "2026-10-02",
    },
  },
  depot: {
    intro:
      "La demande se dépose depuis votre espace particulier sur Dracar Ultimate. Elle est personnelle : un employeur ne peut pas la déposer pour ses agents, et une demande groupée n'existe pas. Chaque agent dispose de son propre compte.",
    etapes: [
      {
        h3: "Déposer la demande",
        texte:
          "L'écran « Déposer une demande » de Dracar Ultimate ne propose pas de vignette « Renouvellement » distincte : suivez la fiche du CNAPS « Renouveler votre carte professionnelle ». Chaque activité se renouvelle par sa propre demande, avec l'attestation du MAC correspondant.",
      },
    ],
  },
  delais: {
    intro:
      "Le CNAPS n'annonce pas de délai propre au renouvellement. Un dossier complet donne droit à un récépissé, qui vous permet de poursuivre votre activité jusqu'à la décision.",
    lignes: [
      [
        "Exercer pendant l'instruction",
        "Un récépissé peut vous permettre de continuer à exercer après l'échéance de votre carte, si votre dossier est complet et déposé au moins trois mois avant cette échéance. Il est valable trois mois et peut être renouvelé, mais sa délivrance n'est pas automatique.",
      ],
    ],
  },
  refus: {
    h2: "Cas particuliers",
    sommaire: "Cas particuliers",
    sections: [
      {
        titre: "Carte déjà expirée",
        texte:
          "Vous ne pouvez plus exercer. Le MAC doit être suivi dans les douze mois qui précèdent la nouvelle demande, et votre carte n'étant plus valide, vous devez demander une autorisation préalable pour entrer en MAC. La demande reste traitée comme un renouvellement jusqu'à cinq ans après l'expiration ; au-delà, comme une demande initiale.",
      },
      {
        titre: "MAC manquant à l'échéance",
        texte:
          "Sans attestation MAC, le renouvellement ne peut pas aboutir : le MAC doit être suivi avant le dépôt de la demande. Si la carte arrive à échéance entre-temps, vous ne pouvez plus exercer jusqu'à la délivrance de la nouvelle carte.",
      },
      {
        titre: "Renouvellement partiel",
        texte:
          "Selon le CNAPS, chaque activité se renouvelle indépendamment des autres, avec l'attestation du MAC qui lui correspond. Une activité dont le MAC n'a pas été suivi ne bloque donc pas, en principe, le renouvellement des autres.",
      },
    ],
  },
  ensuite: {
    h2: "Si vous n'avez pas encore suivi votre MAC",
    paragraphes: [
      "**C'est l'étape à engager en premier.** Le stage doit être suivi avant le dépôt de votre demande, et les sessions se remplissent.",
    ],
    liens: [
      { href: "organismes/", libelle: "Trouver un organisme proposant le MAC en Île-de-France" },
      { href: "#formations", libelle: "Voir les MAC par activité" },
    ],
  },
  formations: {
    h2: "Les stages de maintien des compétences",
    titres: [{ slug: "mac-aps" }, { slug: "mac-cyno" }, { slug: "mac-a3p" }],
  },
  faqTitre: "Questions fréquentes sur le renouvellement de la carte",
  faq: [
    {
      question: "Quand puis-je déposer ma demande au plus tôt ?",
      reponse:
        "Oui, c'est le plus tôt possible : la demande s'ouvre six mois avant l'expiration, et une demande adressée plus tôt n'est pas prise en compte. Votre MAC doit déjà être suivi, et la demande déposée au moins trois mois avant l'échéance.",
    },
    {
      question: "Faut-il un MAC par activité ?",
      reponse:
        "Oui. Une attestation de maintien des compétences est nécessaire pour chacune des activités que vous souhaitez conserver.",
    },
    {
      question: "Mon employeur peut-il faire la demande pour moi ?",
      reponse: "Non. La demande est personnelle et se dépose depuis votre propre espace.",
    },
    {
      question: "Puis-je continuer à travailler pendant l'instruction ?",
      reponse:
        "Oui tant que votre carte est valide. Au-delà de son échéance, seulement si le CNAPS vous a délivré un récépissé : il peut l'être si votre dossier complet a été déposé au moins trois mois avant l'échéance.",
    },
    {
      question: "Que se passe-t-il si ma carte expire avant la décision ?",
      reponse:
        "Sans récépissé, vous ne pouvez plus exercer à compter de l'échéance. Le récépissé, valable trois mois et renouvelable, n'est pas automatique : d'où l'intérêt de déposer un dossier complet au moins trois mois avant l'expiration.",
    },
    {
      question: "Ma carte a expiré il y a plus de cinq ans : que faire ?",
      reponse:
        "La demande n'est plus traitée comme un renouvellement mais comme une demande initiale de carte professionnelle. Elle suppose un MAC suivi dans les douze mois qui la précèdent.",
    },
    {
      question: "Le MAC est-il finançable par le CPF ?",
      reponse:
        "Non : le MAC APS n'est enregistré ni au RNCP ni au répertoire spécifique, condition pour être financé par le CPF. Il peut être pris en charge par l'employeur ou son OPCO, ou financé personnellement.",
    },
  ],
};
