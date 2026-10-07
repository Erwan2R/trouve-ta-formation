import type { ContenuPilier } from "./types";

// Sources (vérifiées le 06/10/2026) : arrêté du 1er septembre 2025 portant cahier des charges de la formation initiale
// (annexes II, XI et XII), fiche France compétences RNCP38002 (qui remplace la fiche RNCP35098, inactive).
export const tfpA3p: ContenuPilier = {
  gabarit: "A",
  titleSeo: "Formation agent de protection physique des personnes (TFP A3P) : programme et organismes",
  definition:
    "Le TFP A3P est le titre d'agent de protection physique des personnes, le métier appelé couramment garde du corps ou protection rapprochée. Il permet d'obtenir la carte professionnelle qui autorise à protéger l'intégrité physique d'une personne.",
  faits: {
    niveau: "Niveau 4",
    prerequis: "Autorisation préalable du CNAPS",
    verifieLe: "2026-10-06",
  },
  bloc4: {
    h2: "Ce que permet le TFP A3P",
    sections: [
      {
        h3: "Les métiers accessibles",
        texte:
          "Agent de protection rapprochée et conducteur de sécurité, les deux grandes familles de postes. L'agent a pour seule mission de protéger la vie et l'intégrité physique de la personne dont il a la charge, ainsi que sa vie privée : personnalités politiques, médiatiques ou sportives, artistes, hauts fonctionnaires, dirigeants d'entreprise. Il travaille seul ou en équipe, et peut aussi être chauffeur de sécurité lorsque son contrat inclut la conduite des véhicules du client.",
      },
      {
        h3: "Ce que la carte professionnelle autorise",
        texte:
          "« Garde du corps » est le mot courant ; l'activité réglementée s'appelle protection physique des personnes, et elle a sa propre carte professionnelle. Le titre prépare à cette activité sans arme : exercer armé demande une formation complémentaire spécifique, avec des entraînements réguliers. La sécurité du personnel politique et des chefs d'État étrangers relève, elle, d'un service public, le Service de la protection.",
      },
      {
        h3: "Les débouchés en Île-de-France",
        texte:
          "Les agents sont employés par des agences de protection rapprochée et par des sociétés de gardiennage. Ils accompagnent leurs clients lors de déplacements privés ou professionnels, en France comme à l'étranger : le programme couvre d'ailleurs le cadre légal de la protection des personnes dans les pays d'intervention.",
      },
    ],
  },
  conditions: {
    premiere: {
      h3: "L'autorisation préalable du CNAPS",
      texte:
        "Elle conditionne l'entrée en formation. Elle se demande en ligne, avant l'inscription, et le CNAPS y vérifie notamment votre moralité.",
    },
    propres: {
      h3: "Les conditions propres au TFP A3P",
      texte:
        "**Le niveau de français B1 est vérifié pour tous les candidats**, et non pour les seuls étrangers : votre dossier doit attester que vous comprenez le langage du métier et savez faire un compte rendu oral et écrit. Pour les ressortissants étrangers, c'est le test officiel de l'arrêté du 31 mars 2022 qui fait foi, et un titre de séjour depuis au moins cinq ans est exigé pour l'autorisation préalable. La formation se suit dans un organisme agréé par l'ADEF.",
    },
  },
  programme: {
    intro:
      "Le contenu minimal est fixé par l'arrêté du 1er septembre 2025 : le tronc commun de la sécurité privée, puis la formation propre à la protection des personnes. Plus d'un quart du programme porte sur les déplacements : escortes à pied, véhicules, cortèges, évacuation.",
    modules: [
      { nom: "Tronc commun : cadre juridique, premiers secours, conflits, transmission des consignes", volume: "41 h" },
      { nom: "Cadre juridique de la protection des personnes, en France et à l'étranger", volume: "12 h" },
      { nom: "Prévention des risques terroristes", volume: "13 h" },
      { nom: "Gestion des conflits et du stress", volume: "9 h" },
      { nom: "Principes de la protection rapprochée et préparation de la mission", volume: "35 h" },
      {
        nom: "Déplacements : escorte à pied, dispositifs embarqués, conduite de sécurité, cortège, évacuation",
        volume: "87 h",
      },
      { nom: "Communication et comptes rendus", volume: "8 h" },
      { nom: "Secourisme tactique d'urgence", volume: "14 h" },
      {
        nom: "Module technique : transports, malveillance, grands événements, protection de l'information",
        volume: "49 h",
      },
      { nom: "Gestes techniques d'intervention, pratique sportive de défense, surveillance", volume: "38 h" },
    ],
    evaluation:
      "Le titre est délivré par la branche professionnelle (ADEF et CPNE), et enregistré au RNCP sous le numéro 38002 jusqu'au 20 septembre 2028. L'examen repose sur une mission : vous la préparez en situation reconstituée, puis vous exécutez au moins une mission complète en condition réelle. Vous soutenez votre dossier de préparation devant un jury, qui dispose de votre évaluation continue ; des questionnaires contextualisés complètent l'examen.",
  },
  duree:
    "La formation dure au minimum 306 heures hors examen, soit 41 heures de tronc commun et 265 heures propres à la protection des personnes. C'est nettement plus que les 175 heures du TFP APS. Les parties théoriques peuvent en partie se suivre à distance ; escortes, conduite, gestes techniques et secourisme se pratiquent en présentiel.",
  cout: "Chaque organisme référencé affiche son tarif. Avec plus de 300 heures, dont une part importante de conduite et de mises en situation, le prix dépend beaucoup des moyens du centre : véhicules, terrains, encadrement.",
  financementCpf:
    "Mobilisable : le TFP A3P est enregistré au RNCP (38002). En 2026, une participation forfaitaire de 150 euros reste à votre charge.",
  titresLies: [
    { slug: "mac-a3p", texte: "Le maintien à suivre tous les cinq ans pour renouveler la carte." },
    { slug: "tfp-aps", texte: "Le titre de la surveillance humaine, plus court et de niveau 3." },
  ],
  faq: [
    {
      question: "Quelle différence entre agent de protection physique des personnes et garde du corps ?",
      reponse:
        "Aucune sur le fond : « garde du corps » est le nom courant du métier. L'activité réglementée par le code de la sécurité intérieure s'appelle protection physique des personnes, et le titre qui y prépare est le TFP A3P.",
    },
    {
      question: "Le TFP A3P permet-il de porter une arme ?",
      reponse:
        "Non. Le titre prépare à la protection sans arme. L'exercice armé suppose une formation spécifique supplémentaire et des entraînements réguliers, prévus par une autre annexe du cahier des charges.",
    },
    {
      question: "La conduite fait-elle partie de la formation ?",
      reponse:
        "Oui : 8 heures d'initiation à la conduite de sécurité, 8 heures de conduite en cortège et 12 heures sur l'embarquement et le débarquement d'une personne protégée. Le métier peut inclure la conduite des véhicules du client.",
    },
    {
      question: "Pourquoi le niveau de français est-il vérifié pour tous les candidats ?",
      reponse:
        "Parce que la certification l'exige : chaque candidat doit présenter un dossier attestant du niveau B1, avec la capacité à faire un compte rendu oral et écrit. Les ressortissants étrangers passent obligatoirement le test officiel.",
    },
    {
      question: "Comment se déroule l'examen ?",
      reponse:
        "Autour d'une mission réelle. Vous la préparez, vous l'exécutez en condition réelle, puis vous soutenez votre dossier de préparation devant un jury, qui peut vous interroger sur la mission comme sur le métier.",
    },
    {
      question: "Qu'est-ce que le secourisme tactique d'urgence ?",
      reponse:
        "Un module de 14 heures sur les gestes de secours en environnement hostile : blessures par balle ou par explosion, garrot, extraction d'un blessé, selon des méthodes internationales comme le protocole MARCHE. Il va au-delà du secourisme du tronc commun.",
    },
  ],
};
