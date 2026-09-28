import type { ContenuDepartement } from "./types";

// BROUILLON de gabarit — structure et angle repris de la Copy géo §13 et de la maquette, faits locaux NON vérifiés.
// La Copy est explicite : ces 300 mots demandent une connaissance du terrain et ne doivent pas être inventés.
// Tant que les marqueurs restent, la page n'existe pas en production.
export const seineSaintDenis: ContenuDepartement = {
  chapo: [
    "La Seine-Saint-Denis est l'un des premiers bassins de recrutement de la sécurité privée en Île-de-France : grands équipements, zones d'activité de la Plaine, aéroport du Bourget et une partie de la plateforme de Roissy. [à vérifier]",
  ],
  seFormer: [
    {
      h3: "Le bassin d'emploi",
      paragraphes: [
        "Principaux employeurs du secteur dans le département : tertiaire de la Plaine Saint-Denis, grands équipements sportifs et culturels, centres commerciaux du nord-est parisien, sites logistiques et aéroportuaires. [à compléter]",
        "Conséquence sur les titres à viser selon les postes dominants localement. [à compléter]",
      ],
    },
    {
      h3: "Accéder aux centres de formation",
      paragraphes: [
        "Concentration de l'offre, lignes de transport desservant les villes où se trouvent les centres, temps de trajet réalistes. [à compléter]",
      ],
    },
    {
      h3: "Ce qui distingue la Seine-Saint-Denis",
      paragraphes: ["Particularité locale, positive ou négative, qui n'est vraie qu'ici. [à compléter]"],
    },
  ],
  acces: "Réponse rédigée à partir du bloc « Accéder aux centres de formation ». [à compléter]",
  ancreSeFormer: "Se former dans le 93",
};
