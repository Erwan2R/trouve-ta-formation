import type { ContenuPilier } from "./types";

// Sources (vérifiées le 06/10/2026) : arrêté du 1er septembre 2025 portant cahier des charges de la formation initiale
// (annexe VI), fiche France compétences RNCP40271 (qui remplace la fiche RNCP34486, inactive depuis le 2 mars 2025),
// arrêté du 27 février 2017 modifié (art. 5, immatriculation des chiens sur la carte).
export const tfpAsc: ContenuPilier = {
  gabarit: "A",
  titleSeo: "Formation agent de sécurité cynophile (TFP ASC) : programme et organismes",
  definition:
    "Le TFP ASC est le titre d'agent de sécurité cynophile, le maître-chien de la sécurité privée. Il permet d'exercer la surveillance et le gardiennage avec un chien, une activité qui a sa propre carte professionnelle.",
  faits: {
    niveau: "Niveau 3",
    prerequis: "Qualification APS et autorisation préalable",
    verifieLe: "2026-10-06",
  },
  bloc4: {
    h2: "Ce que permet le TFP ASC",
    sections: [
      {
        h3: "Les métiers accessibles",
        texte:
          "Agent de sécurité cynophile, maître-chien de sécurité, conducteur canin. L'agent effectue des rondes, de jour comme de nuit, pour prévenir intrusions, vandalisme et incendie ; il surveille des sites comme des parkings, des entrepôts ou des chapiteaux, en utilisant son chien de manière préventive et dissuasive. Il veille aussi à la santé physique et psychologique de l'animal et l'entraîne à l'obéissance et à la sociabilité.",
      },
      {
        h3: "Ce que la carte professionnelle autorise",
        texte:
          "La carte d'agent cynophile autorise la surveillance avec un chien. **Chaque chien y est inscrit avec son numéro d'immatriculation** : travailler avec un nouveau chien suppose une formation pratique d'au moins 70 heures, fixée après une évaluation initiale. La détection d'explosifs avec un chien est une autre activité, avec sa propre formation, que ce titre ne couvre pas.",
      },
      {
        h3: "Les débouchés en Île-de-France",
        texte:
          "Les agents cynophiles sont employés par les entreprises de sécurité privée pour surveiller des sites comme des parkings, des entrepôts, des hangars ou des chapiteaux. Les rondes se font à horaires fixes ou variables, de jour comme de nuit : la formation impose d'ailleurs des heures de pratique nocturne.",
      },
    ],
  },
  conditions: {
    premiere: {
      h3: "L'autorisation préalable du CNAPS",
      texte:
        "Elle conditionne l'entrée en formation, comme pour tous les titres de la sécurité privée. Elle se demande en ligne, avant l'inscription.",
    },
    propres: {
      h3: "Les conditions propres au TFP ASC",
      texte:
        "Il faut déjà détenir la certification d'agent de prévention et de sécurité, ou une carte professionnelle de surveillance humaine en cours de validité, ainsi que le permis B. Vous devez présenter **l'ensemble des documents obligatoires relatifs à la détention de votre chien**, et réussir un test d'entrée en formation.",
    },
  },
  programme: {
    intro:
      "La formation propre au cynophile est fixée par l'annexe VI de l'arrêté du 1er septembre 2025. Elle s'ajoute à la qualification d'agent de prévention et de sécurité, et se fait en binôme avec votre chien.",
    modules: [
      { nom: "Législation cynophile : code de la sécurité intérieure, code rural, chiens dangereux", volume: "35 h" },
      { nom: "Connaissances générales du chien : hygiène, santé, vaccination, psychologie canine", volume: "35 h" },
      { nom: "Obéissance et sociabilité du chien, dont 42 h de pratique", volume: "54 h" },
      { nom: "Maîtrise du chien dans le cadre de la légitime défense, dont 21 h de nuit", volume: "92 h" },
      { nom: "Détection de personnes et d'objets, dont 28 h de nuit", volume: "99 h" },
    ],
    evaluation:
      "Le titre est délivré par la branche professionnelle (ADEF et CPNEFP), et enregistré au RNCP sous le numéro 40271 jusqu'au 28 février 2028. L'examen comprend un questionnaire de 30 questions, une mise en situation tirée au sort, et une ronde de surveillance de jour ou de nuit sur un parking, un entrepôt ou un hangar, face à un assistant qui joue le rôle d'un intrus agresseur.",
  },
  duree:
    "La formation cynophile dure au minimum 315 heures, hors examen. Elle vient après la qualification d'agent de prévention et de sécurité (175 heures au minimum) : un candidat qui part de zéro suit donc au moins 490 heures. Seules la législation et les connaissances générales du chien peuvent se suivre à distance ; tout le travail avec le chien se fait sur le terrain, nuits comprises.",
  cout: "Chaque organisme référencé affiche son tarif sur sa fiche. Avec plus de 300 heures de formation propre, le coût dépend surtout de la durée réellement proposée, des installations du centre pour le travail du chien et de ce que le prix inclut.",
  financementCpf:
    "Mobilisable : le TFP ASC est enregistré au RNCP (40271). En 2026, une participation forfaitaire de 150 euros reste à votre charge.",
  titresLies: [
    { slug: "mac-cyno", texte: "Le maintien à suivre tous les cinq ans, avec chaque chien inscrit sur la carte." },
    {
      slug: "tfp-aps",
      texte: "La qualification d'agent de prévention et de sécurité, exigée avant d'entrer en formation.",
    },
  ],
  faq: [
    {
      question: "Faut-il posséder son propre chien pour passer le TFP ASC ?",
      reponse:
        "La formation se fait en binôme avec un chien, et la fiche officielle du titre exige à l'entrée l'ensemble des documents obligatoires relatifs à la détention d'un chien. Demandez à l'organisme ses conditions précises avant de vous inscrire.",
    },
    {
      question: "Faut-il déjà être agent de prévention et de sécurité ?",
      reponse:
        "Oui. Il faut détenir la certification d'agent de prévention et de sécurité, ou une carte professionnelle de surveillance humaine en cours de validité. Le TFP ASC est une spécialisation, pas un titre d'entrée.",
    },
    {
      question: "Le permis de conduire est-il obligatoire ?",
      reponse:
        "Oui, le permis B fait partie des pièces demandées à l'entrée en formation, avec l'autorisation préalable du CNAPS et les documents relatifs au chien.",
    },
    {
      question: "Peut-on changer de chien en cours de carrière ?",
      reponse:
        "Oui, mais le nouveau chien doit être inscrit sur votre carte professionnelle. Cela suppose une formation pratique d'au moins 70 heures, dont la durée exacte est fixée après une évaluation initiale du binôme.",
    },
    {
      question: "Le TFP ASC permet-il de faire de la détection d'explosifs ?",
      reponse:
        "Non. La détection de matières explosives avec un chien est une activité distincte, avec sa propre formation initiale, des entraînements mensuels obligatoires et une certification des équipes.",
    },
    {
      question: "Une partie de la formation se déroule-t-elle de nuit ?",
      reponse:
        "Oui. Le programme impose au moins 21 heures de nuit pour la maîtrise du chien en légitime défense et 28 heures de nuit pour la détection, conditions réelles d'une grande partie des missions.",
    },
    {
      question: "Le chien peut-il être utilisé pour se défendre ?",
      reponse:
        "Dans le seul cadre de la légitime défense. Le chien est considéré comme une arme par destination : la formation apprend à décider d'une intervention avec ou sans muselière, et à faire cesser immédiatement une action mordante.",
    },
  ],
};
