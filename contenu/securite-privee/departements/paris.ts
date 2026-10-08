import type { ContenuDepartement } from "./types";

// Faits vérifiés le 06/10/2026 : réseau RATP (métro, RER A à E, ligne 14 prolongée le 24 juin 2024), arrêté du
// 2 mai 2005 (service de sécurité incendie des ERP). Aucune mention de disponibilité des titres : elle est calculée
// depuis l'inventaire.
export const paris: ContenuDepartement = {
  chapo: [
    "Paris réunit grands magasins, musées, hôtels, salles de spectacle, hôpitaux et parcs d'exposition : autant d'établissements recevant du public, qui emploient à la fois des agents de surveillance et des agents de sécurité incendie, souvent sur un même site.",
  ],
  seFormer: [
    {
      h3: "Le bassin d'emploi",
      paragraphes: [
        "Les employeurs parisiens de la sécurité se répartissent entre les entreprises de sécurité privée, qui placent leurs agents chez des clients, et les établissements qui gèrent leur propre service. Les postes couvrent l'accueil et le contrôle d'accès des immeubles de bureaux, la surveillance des commerces, la sécurité des événements et le service de sécurité incendie des établissements recevant du public.",
        "Ce dernier service répond à une obligation réglementaire : selon leur catégorie, les établissements recevant du public doivent disposer d'agents qualifiés SSIAP, encadrés par des chefs d'équipe et, dans les plus grands, par un chef de service. À Paris, les deux filières, surveillance avec le TFP APS et incendie avec le SSIAP, se côtoient donc au quotidien.",
      ],
    },
    {
      h3: "Accéder aux centres de formation",
      paragraphes: [
        "Toutes les lignes de métro et les cinq lignes de RER traversent Paris : un centre parisien reste accessible en transports en commun depuis l'ensemble de la région. Depuis juin 2024, la ligne 14 relie aussi directement Saint-Denis Pleyel, au nord, à l'aéroport d'Orly, au sud.",
        "La formation se déroule en présentiel, sur plusieurs semaines pour un titre d'entrée : comparez le temps de trajet quotidien entre votre domicile et le centre, aux horaires des cours, et pas seulement la distance.",
      ],
    },
    {
      h3: "Ce qui distingue Paris",
      paragraphes: [
        "Un centre parisien attire des candidats de toute l'Île-de-France, puisqu'il est le plus facile à rejoindre. Pour départager deux organismes, regardez ce qui varie réellement d'un centre à l'autre : la durée proposée au-delà des minimums réglementaires, le rythme (continu ou en alternance), les financements acceptés et, pour le SSIAP, les moyens prévus pour les exercices d'extinction.",
      ],
    },
  ],
  acces:
    "Paris est desservi par toutes les lignes de métro et les cinq lignes de RER, ce qui rend ses centres accessibles depuis toute l'Île-de-France. Depuis juin 2024, la ligne 14 relie directement Saint-Denis Pleyel à l'aéroport d'Orly en traversant Paris.",
  ancreSeFormer: "Se former à Paris",
};
