import type { ContenuPilier } from "./types";

// Sources (vérifiées le 06/10/2026) : fiche France compétences RNCP40278 ; arrêté du 11 septembre 2013 relatif aux
// mesures de sûreté de l'aviation civile (art. 11-3-1, appendices de durées minimales et de formation périodique) ;
// arrêté du 27 février 2017 modifié (art. 7, renouvellement de la carte).
export const tfpAsa: ContenuPilier = {
  gabarit: "A",
  titleSeo: "Formation agent de sûreté aéroportuaire (TFP ASA) : programme et organismes",
  definition:
    "Le TFP ASA est le titre d'agent de sûreté aéroportuaire. Il prépare aux contrôles de sûreté des aéroports, comme l'inspection-filtrage des passagers, des bagages, du fret et des véhicules, et à la certification exigée par la réglementation européenne de l'aviation civile.",
  faits: {
    niveau: "Niveau 3",
    prerequis: "Autorisation préalable et promesse d'embauche",
    verifieLe: "2026-10-06",
  },
  bloc4: {
    h2: "Ce que permet le TFP ASA",
    sections: [
      {
        h3: "Les métiers accessibles",
        texte:
          "Agent d'exploitation de sûreté aéroportuaire, opérateur de sûreté qualifié puis confirmé, profileur, et à terme coordinateur, chef d'équipe ou superviseur. L'agent contrôle les accès au côté piste, régule les flux de passagers, de bagages et de fret, vérifie la cabine et les soutes des avions, et examine sur écran les bagages et les objets pour détecter ce qui est dangereux.",
      },
      {
        h3: "Ce que la carte professionnelle autorise",
        texte:
          "Le métier relève d'une **double réglementation** : le livre VI du code de la sécurité intérieure, avec la carte professionnelle du CNAPS, et les règles de sûreté de l'aviation civile fixées par la DGAC. Pour exercer, il faut donc la carte professionnelle, une certification par typologie de missions, obtenue à l'examen de l'École nationale de l'aviation civile, ainsi qu'un agrément du préfet et du procureur de la République.",
      },
      {
        h3: "Les débouchés en Île-de-France",
        texte:
          "Les employeurs sont les entreprises de sécurité qui exercent des activités de sûreté aérienne et aéroportuaire, et les entreprises dotées d'un service interne de sûreté. C'est l'une d'elles qui doit vous adresser une lettre d'intention d'embauche avant votre entrée en formation : le parcours se construit avec un employeur, pas seul.",
      },
    ],
  },
  conditions: {
    premiere: {
      h3: "L'autorisation préalable du CNAPS",
      texte:
        "Elle conditionne l'entrée en formation. Le titre accepte aussi l'autorisation provisoire délivrée par le CNAPS. Elle se demande en ligne, avant l'inscription.",
    },
    propres: {
      h3: "Les conditions propres au TFP ASA",
      texte:
        "Être de nationalité française ou ressortissant d'un État membre de l'Union européenne ; ne faire l'objet d'aucune inscription au bulletin n° 3 du casier judiciaire ; **détenir une lettre d'intention d'embauche** d'une entreprise exerçant des activités de sûreté aérienne et aéroportuaire. Ces conditions viennent du code de la sécurité intérieure et du code des transports.",
    },
  },
  programme: {
    intro:
      "Le titre se compose de trois blocs : l'exercice fondamental du métier, commun à tous, puis l'inspection-filtrage du fret et du courrier, et celle des bagages de soute et des véhicules. Ils mènent aux trois typologies de certification visées (2, 7 et 10). La DGAC fixe pour chacune une durée minimale de formation initiale, qui comprend la théorie et la pratique, la connaissance des équipements et l'analyse d'images sur simulateur.",
    modules: [
      {
        nom: "Typologie 2 : passagers, bagages de cabine, fret et courrier, contrôle d'accès",
        volume: "109 h 30",
      },
      {
        nom: "Typologie 7 : passagers, bagages de cabine et de soute, véhicules, contrôle d'accès",
        volume: "109 h 30",
      },
      { nom: "Typologie 10 : l'ensemble des contrôles, fret et bagages de soute compris", volume: "136 h" },
    ],
    evaluation:
      "L'examen de certification est organisé par l'École nationale de l'aviation civile (ENAC) : épreuves théoriques et, pour les typologies avec imagerie, épreuves d'analyse d'images, avec des notes minimales fixées par la DGAC. Le nombre de présentations est limité à quatre. Le titre, délivré par la branche professionnelle, est enregistré au RNCP sous le numéro 40278 jusqu'au 28 février 2028 ; il s'évalue aussi par des questionnaires contextualisés.",
  },
  duree:
    "Les durées minimales fixées par la DGAC vont de 109 h 30 (typologies 2 et 7) à 136 heures (typologie 10), dont 38 à 50 heures d'analyse d'images sur simulateur. Une fois en poste, la formation continue est obligatoire et organisée par l'employeur : 14 heures par an pour les typologies 2 et 7, 21 heures par an pour la typologie 10.",
  cout: "Chaque organisme référencé affiche son tarif. Comme l'entrée en formation suppose une lettre d'intention d'embauche, abordez la question du financement avec l'employeur concerné avant de comparer les prix.",
  financementCpf:
    "Mobilisable : le TFP ASA est enregistré au RNCP (40278). En 2026, une participation forfaitaire de 150 euros reste à votre charge.",
  titresLies: [
    { slug: "tfp-aps", texte: "Le titre de la surveillance humaine, pour les postes de sécurité hors aéroport." },
  ],
  faq: [
    {
      question: "Faut-il une promesse d'embauche pour entrer en formation ?",
      reponse:
        "Oui. Une lettre d'intention d'embauche d'une entreprise exerçant des activités de sûreté aérienne et aéroportuaire fait partie des conditions d'entrée, avec l'autorisation préalable ou provisoire du CNAPS.",
    },
    {
      question: "Un ressortissant hors Union européenne peut-il préparer le TFP ASA ?",
      reponse:
        "Non. L'entrée en formation est réservée aux personnes de nationalité française ou ressortissantes d'un État membre de l'Union européenne.",
    },
    {
      question: "Que sont les typologies 2, 7 et 10 ?",
      reponse:
        "Des périmètres de certification définis par la DGAC. La typologie 2 couvre notamment les passagers, le fret et le courrier ; la 7, les passagers, les bagages de soute et les véhicules ; la 10, l'ensemble de ces contrôles. Chaque agent est certifié pour une typologie, avec ou sans analyse d'images.",
    },
    {
      question: "Combien de fois peut-on se présenter à l'examen de certification ?",
      reponse: "Quatre fois au plus, quelle que soit la typologie présentée.",
    },
    {
      question: "Existe-t-il un MAC pour renouveler la carte d'agent de sûreté aéroportuaire ?",
      reponse:
        "Pas sous la forme d'un stage de 34 heures comme pour la surveillance humaine. Une certification DGAC en cours de validité au moment du renouvellement vaut attestation de maintien des compétences ; il faut seulement y ajouter un module de 3 heures sur les principes de la République.",
    },
    {
      question: "La formation continue s'arrête-t-elle une fois la certification obtenue ?",
      reponse:
        "Non. L'employeur doit organiser une formation périodique, avec ses examens : 14 heures par an pour les typologies 2 et 7, 21 heures pour la typologie 10. La certification doit aussi être renouvelée selon les mêmes modalités que la certification initiale.",
    },
  ],
};
