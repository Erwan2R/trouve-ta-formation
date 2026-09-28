// Formulaire d'affinage (Copy_Formulaire_Affinage.md). Niveau de langue B1 : une proposition par phrase.
import { A_VERIFIER } from "@/contenu/marqueurs";
import type { Etape } from "@/lib/formulaire/parcours";

export const FORMULAIRE = {
  title: "Trouver la formation adaptée à votre situation",
  description: "Quelques questions pour identifier le titre de sécurité privée adapté à votre situation.",
  h1: "Trouver la formation adaptée à votre situation",
};

type Option = { valeur: string; libelle: string; detail?: string };
export type Question = { titre: string; aide?: string; mention?: string; options?: Option[] };

const SPECIALITES: Option[] = [
  { valeur: "cynophile", libelle: "Travailler avec un chien" },
  { valeur: "aeroport", libelle: "Travailler dans un aéroport" },
  { valeur: "personnes", libelle: "Protéger une personne" },
];

/** Questions ; « detenu » et « secteur » reçoivent leurs options du référentiel et des départements. */
export const QUESTIONS: Record<Etape, Question> = {
  depart: {
    titre: "Où en êtes-vous aujourd'hui ?",
    options: [
      { valeur: "debutant", libelle: "Je ne travaille pas encore dans la sécurité privée" },
      { valeur: "renouvellement", libelle: "Je travaille dans la sécurité, ma carte arrive à échéance" },
      { valeur: "evolution", libelle: "Je travaille dans la sécurité, je veux évoluer" },
    ],
  },
  poste: {
    titre: "Quel type de poste vous intéresse ?",
    options: [
      { valeur: "surveillance", libelle: "Surveiller des sites, des magasins, des événements" },
      { valeur: "incendie", libelle: "Assurer la sécurité incendie dans un bâtiment" },
      { valeur: "specialite", libelle: "Un métier spécialisé" },
    ],
  },
  specialite: { titre: "Quelle spécialité vous intéresse ?", options: SPECIALITES },
  autorisation: {
    titre: "Avez-vous déjà demandé votre autorisation préalable au CNAPS ?",
    aide: "C'est l'autorisation du CNAPS qui permet d'entrer en formation. Elle se demande avant de s'inscrire.",
    options: [
      { valeur: "oui", libelle: "Oui, je l'ai obtenue" },
      { valeur: "non", libelle: "Non, pas encore" },
      { valeur: "inconnue", libelle: "Je ne sais pas ce que c'est" },
    ],
  },
  detenu: { titre: "Quel titre avez-vous obtenu ?" },
  carte: {
    titre: "Quand votre carte expire-t-elle ?",
    options: [
      { valeur: "expiree", libelle: "Elle est déjà expirée" },
      { valeur: "moins-3-mois", libelle: "Dans moins de 3 mois" },
      { valeur: "3-12-mois", libelle: "Dans 3 à 12 mois" },
      { valeur: "plus-1-an", libelle: "Dans plus d'un an" },
    ],
  },
  experience: {
    titre: "Depuis combien de temps travaillez-vous dans la sécurité ?",
    options: [
      { valeur: "moins-1-an", libelle: "Moins d'un an" },
      { valeur: "1-3-ans", libelle: "Entre 1 et 3 ans" },
      { valeur: "plus-3-ans", libelle: "Plus de 3 ans" },
    ],
  },
  objectif: {
    titre: "Vers quoi voulez-vous aller ?",
    options: [
      { valeur: "encadrer", libelle: "Encadrer une équipe" },
      { valeur: "incendie", libelle: "Aller vers la sécurité incendie" },
      { valeur: "specialite", libelle: "Me spécialiser" },
    ],
  },
  situation: {
    titre: "Quelle est votre situation aujourd'hui ?",
    options: [
      { valeur: "demandeur-emploi", libelle: "Demandeur d'emploi" },
      { valeur: "salarie", libelle: "Salarié" },
      { valeur: "reconversion", libelle: "En reconversion" },
      { valeur: "interimaire", libelle: "Intérimaire" },
      { valeur: "etudiant", libelle: "Étudiant" },
    ],
  },
  secteur: { titre: "Où cherchez-vous une formation ?" },
  rythme: {
    titre: "Quel rythme vous conviendrait ?",
    mention: "La formation se déroule en présentiel, souvent sur plusieurs semaines.",
    options: [
      { valeur: "temps_plein", libelle: "Temps plein" },
      { valeur: "soir", libelle: "Cours du soir" },
      { valeur: "week_end", libelle: "Week-end" },
      { valeur: "indifferent", libelle: "Peu importe" },
    ],
  },
  plusieurs: {
    titre: "Voulez-vous passer plusieurs titres ?",
    mention:
      "Beaucoup d'agents passent le TFP APS et le SSIAP 1. Cela permet de travailler à la fois en surveillance et en sécurité incendie.",
    options: [
      { valeur: "un", libelle: "Un seul pour commencer" },
      { valeur: "deux", libelle: "Deux titres pour être plus employable" },
    ],
  },
  deplacement: {
    titre: "Comment vous déplacez-vous ?",
    options: [
      { valeur: "transports", libelle: "En transports en commun" },
      { valeur: "vehicule", libelle: "J'ai un véhicule" },
      { valeur: "proximite", libelle: "Je cherche tout près de chez moi" },
    ],
  },
  debut: {
    titre: "Quand voulez-vous commencer ?",
    options: [
      { valeur: "vite", libelle: "Dès que possible" },
      { valeur: "3-mois", libelle: "Dans les 3 mois" },
      { valeur: "annee", libelle: "Dans l'année" },
      { valeur: "renseigne", libelle: "Je me renseigne seulement" },
    ],
  },
  pmr: { titre: "Avez-vous besoin d'un accès adapté aux personnes à mobilité réduite ?" },
};

/** Sous-libellés des titres détenus (maquette), groupés par catégorie. */
export const TITRES_DETENUS_GROUPES: { nom: string; titres: Option[] }[] = [
  {
    nom: "Agent de sécurité",
    titres: [{ valeur: "tfp-aps", libelle: "TFP APS", detail: "Agent de prévention et de sécurité" }],
  },
  {
    nom: "Sécurité incendie",
    titres: [
      { valeur: "ssiap-1", libelle: "SSIAP 1", detail: "Agent de sécurité incendie" },
      { valeur: "ssiap-2", libelle: "SSIAP 2", detail: "Chef d'équipe de sécurité incendie" },
      { valeur: "ssiap-3", libelle: "SSIAP 3", detail: "Chef de service de sécurité incendie" },
    ],
  },
  {
    nom: "Spécialités",
    titres: [
      { valeur: "tfp-asc", libelle: "TFP ASC", detail: "Agent cynophile, avec un chien" },
      { valeur: "tfp-asa", libelle: "TFP ASA", detail: "Agent de sûreté dans un aéroport" },
      { valeur: "tfp-a3p", libelle: "TFP A3P", detail: "Protection physique des personnes" },
    ],
  },
];

export const METIERS: Record<string, string> = {
  cynophile: "le travail avec un chien",
  aeroport: "le travail dans un aéroport",
  personnes: "la protection de personnes",
};

/** Gabarits d'explication (Copy §9) : deux phrases maximum. `t` : titre recommandé, `ref` : titre de référence. */
export const EXPLICATIONS = {
  "entree-surveillance": () =>
    "Vous débutez dans le secteur et vous voulez surveiller des sites ou des magasins : le TFP APS est le titre d'entrée de ce métier. C'est aussi celui qui ouvre le plus grand nombre d'offres d'emploi.",
  "entree-incendie": () =>
    "Vous débutez dans le secteur et vous visez la sécurité incendie : le SSIAP 1 est le titre d'entrée de cette filière. Il s'exerce en poste fixe, dans les bâtiments recevant du public.",
  "entree-specialite": (t: string, metier: string) =>
    `Vous débutez et vous visez ${metier} : le ${t} est le titre qui y donne accès. C'est une formation plus longue que celles d'entrée dans le métier, pour un marché plus étroit.`,
  renouvellement: (t: string, ref: string) =>
    `Vous détenez le ${ref} et votre carte arrive à échéance : le ${t} est le stage qui vous permet de la renouveler.`,
  encadrement: (t: string, ref: string) =>
    `Vous détenez le ${ref} et vous voulez encadrer une équipe : le ${t} est le niveau suivant de cette filière.`,
  "encadrement-sans-experience": () =>
    "C'est le titre à viser ensuite. En attendant, vous pouvez élargir vos compétences avec un titre complémentaire : beaucoup d'agents cumulent le TFP APS et le SSIAP 1, ce qui ouvre davantage de postes.",
  "vers-incendie": () =>
    "Vous travaillez déjà en surveillance et vous voulez aller vers la sécurité incendie : le SSIAP 1 est le titre d'entrée de cette filière. Le cumul avec votre titre actuel est fréquent et recherché par les employeurs.",
  specialisation: (t: string, metier: string) =>
    `Vous voulez vous spécialiser vers ${metier} : le ${t} est le titre correspondant.`,
};
export const sansExperience = (vise: string) =>
  `Le ${vise} demande une expérience professionnelle que vous n'avez pas encore.`;

const AUTORISATION = "demarches/autorisation-prealable/";
const RENOUVELLEMENT = "demarches/renouvellement-carte-professionnelle/";

export const ENCARTS = {
  autorisation: {
    titre: "Commencez par votre autorisation préalable",
    texte:
      "Vous ne pouvez pas entrer en formation sans elle. Elle se demande en ligne auprès du CNAPS, et son instruction prend du temps. Faites cette démarche avant de contacter un organisme.",
    lien: { libelle: "Voir comment faire la demande", href: AUTORISATION },
  },
  "autorisation-inconnue": {
    titre: "Commencez par votre autorisation préalable",
    texte:
      "C'est l'autorisation du CNAPS qui permet d'entrer en formation. Vous ne pouvez pas entrer en formation sans elle. Elle se demande en ligne auprès du CNAPS, et son instruction prend du temps. Faites cette démarche avant de contacter un organisme.",
    lien: { libelle: "Voir comment faire la demande", href: AUTORISATION },
  },
  // Copy §9 : traitement d'une carte expirée (renouvellement tardif ou nouvelle demande) à vérifier → aperçu seulement.
  "carte-expiree": {
    titre: "Votre carte est expirée",
    texte: `Vous ne pouvez pas exercer tant qu'elle n'est pas renouvelée. Inscrivez-vous à un stage dès que possible, puis déposez votre demande de renouvellement. ${A_VERIFIER}`,
    lien: { libelle: "Voir la démarche de renouvellement", href: RENOUVELLEMENT },
  },
};

export const ASA = {
  titre: "Le renouvellement d'une carte de sûreté aéroportuaire suit un parcours particulier.",
  paragraphes: [
    "Votre métier relève à la fois de la réglementation de la sécurité privée et de celle de la sûreté aérienne. Le maintien de vos compétences ne passe pas par un stage unique, et une partie est généralement organisée par votre employeur.",
    "Rapprochez-vous de votre employeur ou de votre centre de formation habituel, et consultez notre page sur le renouvellement de la carte professionnelle pour les délais de dépôt.",
  ],
  lien: { libelle: "Voir la démarche de renouvellement", href: RENOUVELLEMENT },
};

export const CONDITIONS = {
  titre: "Avant de vous inscrire, vérifiez que vous remplissez les conditions",
  texte:
    "La formation à la sécurité privée demande une autorisation du CNAPS, qui vérifie notamment votre casier judiciaire. Elle demande aussi un niveau de français correspondant au niveau B1, vérifié à l'entrée en formation.",
  lien: { libelle: "Voir toutes les conditions", href: AUTORISATION },
};

export const AUCUN_ORGANISME = {
  titre: (t: string) => `Aucun organisme référencé ne prépare au ${t} en Île-de-France.`,
  texte:
    "Notre annuaire se construit progressivement : cela ne veut pas dire qu'aucun centre ne le propose. Consultez la page du titre pour connaître le programme et les conditions d'accès, et regardez les titres proches ci-dessous.",
  demarches: { libelle: "Voir les démarches à accomplir", href: "demarches/" },
};

/** Messages de relâchement automatique (Copy §10). `ou` : « en Seine-Saint-Denis », « à Paris ou dans les Yvelines ». */
export const RELACHEMENT = {
  2: (t: string, ou: string | null, plusieurs: boolean) =>
    ou
      ? `Aucun centre ne propose ce rythme ${ou}. Voici tous les organismes ${plusieurs ? "de ces départements" : "du département"} qui préparent au ${t}.`
      : `Aucun centre ne propose ce rythme en Île-de-France. Voici tous les organismes qui préparent au ${t}.`,
  3: (t: string, ou: string) => `Aucun centre ne prépare au ${t} ${ou}. Voici les organismes des départements voisins.`,
  4: (t: string) =>
    `Le ${t} est rarement proposé en Île-de-France. Voici tous les organismes de la région qui le préparent.`,
};

/** Élargissement proposé (1 ou 2 résultats), puis choisi par le visiteur — décision Erwan 01/10/2026. */
export const ELARGISSEMENT = {
  proposition: "Peu de centres correspondent à tous vos critères.",
  lien: (n: number) => `Élargir la recherche : ${n} organismes →`,
  choisi: {
    2: "À votre demande, la recherche ne tient plus compte du rythme.",
    3: "À votre demande, la recherche inclut les départements voisins.",
    4: "À votre demande, la recherche couvre toute l'Île-de-France.",
  },
};

export const RESULTAT = {
  surtitre: "Votre résultat",
  surtitreAffine: "Votre résultat affiné",
  titreAViser: "Le titre à viser :",
  pilier: (t: string) => `Tout savoir sur le ${t} →`,
  encartSurtitre: "À faire en premier",
  compte: (n: number) =>
    n === 1 ? "1 organisme correspond à votre recherche" : `${n} organismes correspondent à votre recherche`,
  elargie: "Recherche élargie",
  alternatives: "Vous pourriez aussi envisager",
  affiner: "Affiner mes résultats",
  affinerCout: "4 questions de plus",
  modifier: "Modifier mes réponses",
};
