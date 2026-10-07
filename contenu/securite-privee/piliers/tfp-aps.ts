import type { ContenuPilier } from "./types";

// Sources (vérifiées le 06/10/2026) : arrêté du 1er septembre 2025 portant cahier des charges de la formation initiale
// (annexes II et III), fiche France compétences RNCP36648, fiche RNCP40271 (accès au TFP ASC).
export const tfpAps: ContenuPilier = {
  gabarit: "A",
  definition:
    "Le TFP APS est le titre d'entrée de la surveillance humaine. Il permet d'obtenir la carte professionnelle d'agent de prévention et de sécurité, qui ouvre les postes de surveillance, de gardiennage, de contrôle d'accès et de rondes.",
  faits: {
    niveau: "Niveau 3",
    prerequis: "Autorisation préalable du CNAPS",
    verifieLe: "2026-10-06",
  },
  bloc4: {
    h2: "Ce que permet le TFP APS",
    sections: [
      {
        h3: "Les métiers accessibles",
        texte:
          "Agent de prévention et de sécurité, agent de surveillance et de gardiennage, agent rondier, agent d'intervention mobile, agent de sécurité pré-vol ou arrière-caisse. L'agent assure la sécurité des personnes et des biens, filtre les accès, effectue des rondes, alerte sa hiérarchie et les secours, porte secours et assure le premier niveau d'intervention après un incident. Le métier s'exerce jour et nuit, week-ends et jours fériés compris, le plus souvent en tenue professionnelle.",
      },
      {
        h3: "Ce que la carte professionnelle autorise",
        texte:
          "La carte obtenue couvre la surveillance humaine et le gardiennage. La formation prépare aussi aux palpations de sécurité et à l'inspection visuelle des bagages, pratiquées dans le cadre légal des manifestations ou de circonstances particulières. La carte ne couvre pas la sécurité incendie des établissements recevant du public, qui demande le SSIAP, ni la protection rapprochée ou la sûreté aéroportuaire, qui ont leurs propres titres. Elle est en revanche la porte d'entrée vers le titre d'agent cynophile.",
      },
      {
        h3: "Les débouchés en Île-de-France",
        texte:
          "Les agents sont employés par des entreprises de sécurité privée, qui interviennent chez leurs clients, ou directement par des entreprises dotées d'un service interne de sécurité, y compris des structures d'hébergement et de soins. Les secteurs qui recrutent couvrent l'événementiel, le transport et la logistique, l'industrie, le tertiaire, la grande distribution et le commerce.",
      },
    ],
  },
  conditions: {
    premiere: {
      h3: "L'autorisation préalable du CNAPS",
      texte:
        "Elle conditionne l'entrée en formation. Le CNAPS vérifie notamment votre moralité avant de la délivrer ; elle se demande en ligne, avant l'inscription, et son instruction prend du temps.",
    },
    propres: {
      h3: "Les conditions propres au TFP APS",
      texte:
        "Aucun diplôme ni expérience n'est demandé. La formation se suit dans un organisme titulaire d'une autorisation d'exercice du CNAPS et agréé par l'ADEF, l'association chargée par la branche professionnelle d'agréer les centres qui préparent ses titres. Un ressortissant d'un pays hors Union européenne et hors Espace économique européen ne peut demander l'autorisation préalable que s'il est titulaire d'un titre de séjour depuis au moins cinq ans.",
    },
  },
  programme: {
    intro:
      "Le contenu minimal est fixé par l'arrêté du 1er septembre 2025, en vigueur depuis le 1er octobre 2025 : un tronc commun à toutes les activités de sécurité privée, puis la formation propre à la surveillance humaine. Les organismes peuvent dépasser ces durées, jamais rester en deçà.",
    modules: [
      {
        nom: "Tronc commun juridique : livre VI, code pénal, libertés publiques, principes de la République, déontologie",
        volume: "17 h",
      },
      { nom: "Tronc commun : premiers secours, gestion des conflits, transmission des consignes", volume: "24 h" },
      { nom: "Cadre juridique de la surveillance et convention collective", volume: "5 h" },
      {
        nom: "Gestion des risques : incendie, alarmes, travailleur isolé, risque électrique",
        volume: "25 h",
      },
      { nom: "Prévention des risques terroristes", volume: "13 h" },
      { nom: "Gestion des conflits et des situations dégradées", volume: "16 h" },
      { nom: "Outil informatique et main courante électronique", volume: "2 h" },
      {
        nom: "Surveillance, contrôle d'accès, poste de sécurité, rondes, interpellation (article 73)",
        volume: "52 h",
      },
      { nom: "Événementiel : grands rassemblements, inspection des bagages, palpation", volume: "14 h" },
      { nom: "Télésurveillance et vidéoprotection", volume: "7 h" },
    ],
    evaluation:
      "Le titre est délivré par la branche professionnelle (ADEF et CPNEFP), et enregistré au RNCP sous le numéro 36648 jusqu'au 1er juillet 2027. L'examen comprend deux mises en situation individuelles et des questionnaires à choix unique, posés sur boîtier électronique à partir d'une banque de plus d'un millier de questions.",
  },
  duree:
    "La formation dure au minimum 175 heures, hors examen. Certaines parties théoriques peuvent être suivies à distance ; les premiers secours, la gestion des conflits, les rondes, le contrôle d'accès et toutes les mises en situation se font obligatoirement en présentiel. La carte professionnelle obtenue est valable cinq ans : son renouvellement passe par le MAC APS.",
  cout: "Chaque organisme référencé affiche son tarif sur sa fiche. Comparez la durée réellement proposée au regard des 175 heures minimales, le rythme (continu ou en alternance) et ce que le prix comprend : frais d'examen, aide aux démarches auprès du CNAPS.",
  financementCpf:
    "Mobilisable : le TFP APS est enregistré au RNCP (36648). En 2026, une participation forfaitaire de 150 euros reste à votre charge.",
  titresLies: [
    { slug: "mac-aps", texte: "Le stage à suivre tous les cinq ans pour renouveler la carte." },
    { slug: "ssiap-1", texte: "La sécurité incendie, régie par un autre texte. Beaucoup d'agents cumulent les deux." },
    { slug: "tfp-asc", texte: "La spécialité cynophile, accessible une fois la qualification APS obtenue." },
    { slug: "tfp-a3p", texte: "La protection physique des personnes, un titre de niveau 4." },
  ],
  faq: [
    {
      question: "Le TFP APS permet-il de travailler en sécurité incendie ?",
      reponse:
        "Non. Le service de sécurité incendie des établissements recevant du public et des immeubles de grande hauteur demande le SSIAP, qui relève d'une autre réglementation. Le TFP APS comporte une initiation au risque incendie, mais ne qualifie pas pour ces emplois.",
    },
    {
      question: "Peut-on suivre une partie du TFP APS à distance ?",
      reponse:
        "Oui, pour certaines parties théoriques, comme une partie du cadre juridique et de la prévention du terrorisme. Les modules pratiques, dont les premiers secours, la gestion des conflits et les rondes, se suivent obligatoirement en présentiel.",
    },
    {
      question: "Les palpations de sécurité font-elles partie de la formation ?",
      reponse:
        "Oui. Un module de 7 heures, dont 4 de mise en situation, porte sur l'inspection visuelle des bagages et la palpation de sécurité, avec leur cadre légal et la prise en compte des mineurs et des personnes en situation de handicap.",
    },
    {
      question: "Un ressortissant d'un pays hors Union européenne peut-il préparer le TFP APS ?",
      reponse:
        "Oui, s'il est titulaire d'un titre de séjour depuis au moins cinq ans : c'est la condition pour demander l'autorisation préalable, qui ne concerne pas les ressortissants de l'Union européenne et de l'Espace économique européen. Tout ressortissant étranger devra aussi justifier d'un niveau de français B1 pour obtenir sa carte professionnelle.",
    },
    {
      question: "Le TFP APS ouvre-t-il l'accès à d'autres titres ?",
      reponse:
        "Oui. Le titre d'agent de sécurité cynophile exige, à l'entrée, la certification d'agent de prévention et de sécurité ou une carte professionnelle de surveillance humaine en cours de validité.",
    },
    {
      question: "Combien de temps dure la carte obtenue avec le TFP APS ?",
      reponse:
        "Cinq ans. Pour la renouveler, il faut suivre le MAC APS dans les 24 mois qui précèdent l'échéance, et déposer sa demande au moins trois mois avant cette échéance.",
    },
  ],
};
