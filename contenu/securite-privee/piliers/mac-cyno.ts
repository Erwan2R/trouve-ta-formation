import type { ContenuPilier } from "./types";

// Sources (vérifiées le 06/10/2026) : arrêté du 27 février 2017 relatif à la formation continue des agents privés de
// sécurité (art. 4 et 5, version en vigueur).
export const macCyno: ContenuPilier = {
  gabarit: "B",
  h1: "MAC cynophile — Maintien et actualisation des compétences des agents de sécurité cynophiles",
  definition:
    "Le MAC cynophile est le stage obligatoire pour renouveler votre carte professionnelle d'agent cynophile. Il s'ajoute au socle commun de la surveillance humaine et se suit avec chaque chien inscrit sur votre carte.",
  faits: {
    periodicite: "Tous les 5 ans",
    prerequis: "Carte professionnelle en cours de validité",
    verifieLe: "2026-10-06",
  },
  bloc4: {
    h2: "Quand suivre votre MAC cynophile",
    sections: [
      {
        h3: "La fenêtre à respecter",
        texte:
          "Le stage se suit **dans les 24 mois qui précèdent l'échéance de votre carte**, et l'attestation accompagne la demande de renouvellement, à déposer au moins trois mois avant cette échéance.",
      },
      {
        h3: "Ce qui se passe si vous dépassez l'échéance",
        texte:
          "Une carte expirée ne se renouvelle plus : il faut déposer une nouvelle demande de carte professionnelle, avec un stage suivi dans les douze mois qui la précèdent. D'ici là, vous ne pouvez plus exercer, ni avec ni sans chien.",
      },
      {
        h3: "Un stage pour chaque chien inscrit",
        texte:
          "Le maintien porte sur le binôme, pas seulement sur l'agent : **les modules pratiques doivent être effectués avec chaque chien dont le numéro d'immatriculation figure sur la carte renouvelée**. Le socle commun, lui, ne se refait pas s'il a déjà été suivi dans les 24 mois avant l'échéance, par exemple dans le cadre du MAC APS.",
      },
    ],
  },
  conditions: {
    premiere: {
      h3: "Une carte professionnelle en cours de validité",
      texte:
        "Le MAC s'adresse aux agents cynophiles déjà titulaires de leur carte. Si elle est expirée, une nouvelle demande de carte sera nécessaire.",
    },
    propres: {
      h3: "Les conditions propres au MAC cynophile",
      texte:
        "Vous venez avec chacun de vos chiens inscrits sur la carte. Le module de premiers secours du socle n'est pas à refaire si vous avez un SST valide ou un recyclage PSC de moins de deux ans.",
    },
  },
  programme: {
    intro:
      "Le contenu est fixé par l'article 5 de l'arrêté du 27 février 2017 relatif à la formation continue : 32 heures propres au cynophile, en plus du socle commun prévu pour la surveillance humaine.",
    modules: [
      {
        nom: "Socle commun : premiers secours, principes de la République, cadre juridique, conflits, inspection-filtrage, risques terroristes",
        volume: "34 h",
      },
      { nom: "Législation cynophile : identification, animal assimilé à une arme, légitime défense", volume: "7 h" },
      { nom: "Connaissance générale du chien : hygiène, habitat, maladies, vaccination", volume: "4 h" },
      { nom: "Obéissance et sociabilité, dont 6 h de pratique", volume: "7 h" },
      { nom: "Maîtrise du chien dans le cadre de la légitime défense, dont 6 h de pratique", volume: "7 h" },
      { nom: "Détection de personnes et d'objets lors d'une ronde, dont 6 h de pratique", volume: "7 h" },
    ],
    evaluation:
      "Le stage ne se conclut pas par un examen : il donne lieu à une attestation de suivi, à joindre à la demande de renouvellement.",
  },
  duree:
    "66 heures pour un agent qui suit tout en une fois : 34 heures de socle commun et 32 heures propres au cynophile. Si le socle a déjà été suivi dans les 24 mois avant l'échéance, seules les 32 heures cynophiles restent à faire. Le module de premiers secours peut être retiré à votre demande si vous avez un SST valide ou un recyclage PSC de moins de deux ans.",
  cout: "C'est un achat contraint, et le travail avec le chien suppose des installations adaptées. Chaque organisme référencé affiche son tarif : vérifiez qu'il propose bien les modules cynophiles, et pas seulement le socle commun.",
  financementCpf:
    "À vérifier sur Mon Compte Formation : seuls les stages rattachés à une certification enregistrée au RNCP ou au répertoire spécifique y sont proposés.",
  titresLies: [
    { slug: "tfp-asc", texte: "Le titre initial dont ce stage assure le maintien." },
    { slug: "mac-aps", texte: "Le maintien de la surveillance humaine, qui forme le socle commun de ce stage." },
  ],
  faq: [
    {
      question: "Le maintien porte-t-il sur l'agent ou sur le chien ?",
      reponse:
        "Sur les deux. Les modules pratiques (obéissance, légitime défense, détection) se font avec chaque chien inscrit sur la carte : c'est le binôme qui est maintenu à niveau.",
    },
    {
      question: "Deux chiens sont inscrits sur ma carte : comment se passe le stage ?",
      reponse:
        "Les modules pratiques doivent être effectués avec chacun d'eux. Prévoyez-le avec l'organisme au moment de l'inscription.",
    },
    {
      question: "Dois-je aussi suivre le MAC APS ?",
      reponse:
        "Le MAC cynophile s'ajoute au socle commun de la surveillance humaine. Si vous l'avez déjà suivi dans les 24 mois avant l'échéance, par exemple lors d'un MAC APS, vous en êtes dispensé à votre demande.",
    },
    {
      question: "Le MAC cynophile couvre-t-il la détection d'explosifs ?",
      reponse:
        "Non. La détection d'explosifs avec un chien a son propre stage de maintien, avec son propre contenu, et impose en plus des entraînements réguliers.",
    },
    {
      question: "Que travaille-t-on avec le chien pendant le stage ?",
      reponse:
        "L'obéissance et la sociabilité en présence du public et d'autres chiens, la maîtrise du chien en légitime défense (mordant, cessation, déconditionnement) et la détection de personnes ou d'objets au cours d'une ronde.",
    },
    {
      question: "Le stage peut-il se faire chez mon employeur ?",
      reponse:
        "Oui, avec un formateur d'un organisme autorisé par le CNAPS, à condition de déclarer la date et le lieu de la session au CNAPS quinze jours avant son début.",
    },
  ],
};
