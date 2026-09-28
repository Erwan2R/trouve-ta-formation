import type { ContenuDemarche } from "./types";

// Copy_Pages_Demarches_CNAPS.md §7. BROUILLON : marqueurs à lever avant publication.
// « Quand » (fenêtre de dépôt) vient de la base : champ vide tant qu'Erwan ne l'a pas vérifié sur la FAQ CNAPS.
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
    pieces: "Pièce d'identité, justificatif de domicile, attestation MAC correspondant à chaque activité",
  },
  qui: {
    h2: "Qui est concerné et quand",
    sommaire: "Qui et quand",
    paragraphes: [
      "Tout agent titulaire d'une carte professionnelle, cinq ans après sa délivrance.",
      "**Le calendrier est la difficulté principale de cette démarche.** Une carte expirée interdit d'exercer, immédiatement et sans période de tolérance. Un agent sans carte valide ne peut pas être affecté à une activité de sécurité privée, et son employeur non plus ne peut pas l'y affecter.",
      "Mais l'anticipation excessive ne fonctionne pas davantage : plusieurs sources indiquent que les demandes déposées trop en amont ne sont pas prises en compte. [à vérifier]",
    ],
    encart: {
      surtitre: "Calendrier",
      texte: "Quand programmer le MAC, quand déposer la demande, date limite absolue. [à compléter]",
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
          "**Le point qui piège le plus d'agents : il faut un MAC par activité détenue.** Une carte portant plusieurs mentions suppose une attestation de maintien des compétences correspondant à chacune. L'activité cynophile fait l'objet d'un traitement particulier. [à vérifier]",
          "Tableau MAC par activité : activité portée par la carte, MAC correspondant, durée. [à compléter]",
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
    intro: "L'attestation MAC est la pièce centrale, une par activité. Liste officielle à relever. [à compléter]",
    liste: [
      "Une pièce d'identité en cours de validité",
      "Un justificatif de domicile",
      "Une attestation de maintien des compétences par activité détenue",
    ],
  },
  depot: {
    intro:
      "La demande se dépose depuis votre espace particulier sur Dracar Ultimate. Elle est personnelle : un employeur ne peut pas la déposer pour ses agents, et une demande groupée n'existe pas. Chaque agent dispose de son propre compte.",
    etapes: [{ h3: "Déposer la demande", texte: "Déroulé exact des écrans à relever sur le portail. [à compléter]" }],
  },
  delais: {
    intro: "Délai d'instruction à confirmer auprès du CNAPS. [à vérifier]",
    lignes: [
      [
        "Exercer pendant l'instruction",
        "Question du récépissé : pour un agent en poste, elle a des conséquences immédiates sur son salaire. [à vérifier]",
      ],
    ],
  },
  refus: {
    h2: "Cas particuliers",
    sommaire: "Cas particuliers",
    sections: [
      {
        titre: "Carte déjà expirée",
        texte: "Nouvelle demande initiale ou renouvellement tardif : à vérifier en priorité. [à compléter]",
      },
      { titre: "MAC manquant à l'échéance", texte: "[à compléter]" },
      {
        titre: "Renouvellement partiel",
        texte:
          "Un agent peut-il renouveler certaines activités et pas d'autres, faute d'avoir suivi tous les MAC ? [à vérifier]",
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
      question: "Puis-je déposer ma demande six mois avant l'échéance ?",
      reponse: "Question centrale de la page. [à vérifier]",
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
      reponse: "Question du récépissé. [à vérifier]",
    },
    { question: "Que se passe-t-il si ma carte expire avant la décision ?", reponse: "[à vérifier]" },
    {
      question: "Le MAC est-il finançable par le CPF ?",
      reponse:
        "Éligibilité à vérifier selon les titres, puis renvoi vers les organismes qui l'acceptent. [à compléter]",
    },
  ],
};
