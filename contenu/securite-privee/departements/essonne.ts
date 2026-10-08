import type { ContenuDepartement } from "./types";

// Faits vérifiés le 06/10/2026 : emprise de Paris-Orly sur Paray-Vieille-Poste et Athis-Mons (ACNUSA), ligne 14
// jusqu'à l'aéroport d'Orly desservant l'Essonne depuis le 24 juin 2024 (RATP), RER B, C et D.
export const essonne: ContenuDepartement = {
  chapo: [
    "L'Essonne partage avec le Val-de-Marne l'aéroport d'Orly, dont l'emprise s'étend notamment sur Paray-Vieille-Poste et Athis-Mons. Le reste du département, de Massy à Évry-Courcouronnes et jusqu'au sud rural, offre surtout des postes de surveillance de sites et d'établissements recevant du public.",
  ],
  seFormer: [
    {
      h3: "Le bassin d'emploi",
      paragraphes: [
        "Au nord, la zone d'Orly concentre les métiers de la sûreté aéroportuaire, qui demandent un TFP ASA et une certification par typologie de missions. Plus au sud, les employeurs de la sécurité interviennent sur des sites d'entreprise, des zones commerciales et des établissements recevant du public. L'aéroport d'Orly étant partagé avec le Val-de-Marne, ses employeurs recrutent des deux côtés de la limite départementale.",
      ],
    },
    {
      h3: "Accéder aux centres de formation",
      paragraphes: [
        "L'Essonne est desservie par trois RER : le B (Massy, Orsay), le C (Massy, Juvisy, Étampes) et le D (Évry-Courcouronnes, Corbeil-Essonnes). Massy et Juvisy sont les principaux points de correspondance. Depuis juin 2024, la ligne 14 rejoint aussi l'aéroport d'Orly. Hors de ces axes, le bus ou la voiture deviennent souvent nécessaires : tenez-en compte pour une formation de plusieurs semaines. En alternance, quand les cours reviennent chaque semaine pendant plusieurs mois, le trajet compte encore davantage.",
      ],
    },
    {
      h3: "Ce qui distingue l'Essonne",
      paragraphes: [
        "La structure en branches de RER. Deux centres distants de quelques kilomètres peuvent être sur deux branches différentes, et donc à des temps de trajet très différents de chez vous. Avant de choisir, repérez sur quelle ligne se trouve chaque centre et si votre trajet passe par Massy ou Juvisy.",
      ],
    },
  ],
  acces:
    "L'Essonne est desservie par les RER B, C et D, avec des correspondances à Massy et Juvisy, et par la ligne 14 jusqu'à l'aéroport d'Orly depuis juin 2024. Hors de ces axes, le bus ou la voiture sont souvent nécessaires.",
  ancreSeFormer: "Se former dans le 91",
};
