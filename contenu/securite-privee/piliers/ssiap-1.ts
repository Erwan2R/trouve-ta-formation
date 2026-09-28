import type { ContenuPilier } from "./types";

// BROUILLON repris de la maquette (Page Pilier Titre v3) — non publiable tant que les [à vérifier] restent.
export const ssiap1: ContenuPilier = {
  gabarit: "A",
  definition:
    "Le SSIAP 1 est le titre d'entrée de la sécurité incendie. Il permet d'exercer comme agent de service de sécurité incendie dans les établissements recevant du public et les immeubles de grande hauteur.",
  faits: {
    niveau: "Niveau 3",
    prerequis: "Autorisation préalable du CNAPS",
    verifieLe: "2026-09-01",
  },
  bloc4: {
    h2: "Ce que permet le SSIAP 1",
    sections: [
      {
        h3: "Les métiers accessibles",
        texte:
          "Agent de service de sécurité incendie en poste de sécurité, en ronde ou en surveillance de travaux, dans les établissements recevant du public — centres commerciaux, hôpitaux, hôtels, salles de spectacle — et dans les immeubles de grande hauteur. Le poste s'exerce le plus souvent en vacation, sous l'autorité d'un chef d'équipe SSIAP 2.",
      },
      {
        h3: "Ce que la qualification autorise",
        texte:
          "Le SSIAP relève de la réglementation applicable aux services de sécurité incendie des ERP et des IGH, pas du Livre VI du code de la sécurité intérieure qui encadre la surveillance humaine. Il ne donne donc pas accès à la carte professionnelle de surveillance, et un agent chargé des deux missions doit détenir les deux qualifications.",
      },
      {
        h3: "Les débouchés en Île-de-France",
        texte:
          "Les employeurs sont d'un côté les sociétés de sécurité privée prestataires des grands sites tertiaires et commerciaux, de l'autre les exploitants qui internalisent leur service de sécurité incendie : centres hospitaliers, grands équipements culturels, gestionnaires de tours de bureaux.",
      },
    ],
  },
  conditions: {
    premiere: {
      h3: "L'autorisation préalable du CNAPS",
      texte:
        "Elle conditionne l'entrée en formation et se demande en ligne auprès du CNAPS, avant l'inscription ; son instruction prend du temps.",
    },
    propres: {
      h3: "Les conditions propres au SSIAP 1",
      texte:
        "Une aptitude médicale à l'exercice de l'emploi est exigée, ainsi qu'une qualification de secourisme en cours de validité. Aucune expérience professionnelle préalable n'est demandée — c'est ce qui distingue le SSIAP 1 du SSIAP 2. [à vérifier]",
    },
  },
  programme: {
    intro:
      "Le programme est fixé par la réglementation applicable aux services de sécurité incendie. Il est identique quel que soit l'organisme : ce qui varie, c'est le rythme, le tarif et les moyens du plateau technique.",
    modules: [
      { nom: "Le feu et ses conséquences" },
      { nom: "Sécurité incendie — principes et moyens de secours" },
      { nom: "Installations techniques et système de sécurité incendie" },
      { nom: "Rôle et missions de l'agent de sécurité incendie" },
    ],
    evaluation:
      "L'évaluation se compose d'un questionnaire à choix multiples sur les connaissances théoriques et d'une épreuve pratique de ronde avec anomalies et sinistre, devant un jury. [à vérifier]",
  },
  duree:
    "La durée réglementaire est fixée par les textes et ne varie pas d'un organisme à l'autre. Ce qui change, c'est le rythme : temps plein sur deux semaines, cours du soir ou week-end selon les centres.",
  cout: "Les tarifs relevés en Île-de-France s'étalent sur une fourchette large. L'écart s'explique par le format, l'effectif par session et les moyens du plateau technique, rarement par la qualité seule. Le prix affiché peut inclure ou exclure les frais d'examen et le livret de formation.",
  titresLies: [
    { slug: "ssiap-2", texte: "Le niveau supérieur, pour encadrer une équipe d'agents SSIAP 1." },
    { slug: "recyclage-ssiap-1", texte: "Le stage à suivre tous les trois ans pour conserver votre qualification." },
    { slug: "tfp-aps", texte: "Le titre de la surveillance. Beaucoup d'agents cumulent les deux." },
  ],
  faq: [
    {
      question: "Quelle différence entre le SSIAP 1 et le TFP APS ?",
      reponse:
        "Le SSIAP 1 porte sur la sécurité incendie dans les ERP et les IGH ; le TFP APS sur la surveillance humaine, régie par le Livre VI du code de la sécurité intérieure. Les deux qualifications se cumulent fréquemment sur un même poste, mais elles ne relèvent pas du même régime d'autorisation.",
    },
    {
      question: "Le SSIAP 1 donne-t-il droit à une carte professionnelle ?",
      reponse:
        "Non. La carte professionnelle du CNAPS concerne les activités de surveillance humaine. La qualification SSIAP atteste d'une aptitude à l'emploi de sécurité incendie, distincte de cette carte. [à vérifier]",
    },
    {
      question: "Faut-il un diplôme de secourisme avant d'entrer en formation ?",
      reponse:
        "Une qualification de secourisme en cours de validité est exigée à l'entrée. Les organismes proposent souvent de la passer en amont, dans le même centre. [à vérifier]",
    },
    {
      question: "Combien de temps la qualification SSIAP 1 reste-t-elle valable ?",
      reponse:
        "Elle doit être maintenue par un recyclage tous les trois ans. Cette périodicité triennale est distincte des cinq ans de la carte professionnelle de surveillance, ce qui surprend les agents qui détiennent les deux.",
    },
    {
      question: "Peut-on passer directement le SSIAP 2 sans le SSIAP 1 ?",
      reponse:
        "Non dans le cas général : le SSIAP 2 suppose de détenir le niveau 1 et une expérience professionnelle. Certaines équivalences existent pour les agents issus des services publics de secours. [à vérifier]",
    },
    {
      question: "Le plateau technique est-il obligatoire pendant la formation ?",
      reponse:
        "La formation comporte des mises en situation sur installations réelles. La qualité et la disponibilité du plateau technique sont l'un des points sur lesquels les centres se distinguent réellement.",
    },
  ],
};
