import type { ContenuDepartement } from "./types";

// Faits vérifiés le 06/10/2026 : quartier d'affaires de La Défense (environ 200 000 salariés, 75 IGH : Paris La
// Défense, « La verticalité de La Défense », septembre 2025), arrêté du 2 mai 2005 (missions et emplois
// SSIAP 2 et 3), RER A, B et C, métro 1 et 13, tramway T2.
export const hautsDeSeine: ContenuDepartement = {
  chapo: [
    "Les Hauts-de-Seine accueillent La Défense, présenté par son gestionnaire comme le premier quartier d'affaires d'Europe : environ 200 000 salariés et 75 tours, dont 8 des 10 plus hautes de France. Dans ces tours, la sécurité incendie est une obligation permanente, qui emploie des agents mais aussi des chefs d'équipe et des chefs de service.",
  ],
  seFormer: [
    {
      h3: "Le bassin d'emploi",
      paragraphes: [
        "Un immeuble de grande hauteur doit disposer d'un service de sécurité incendie permanent. À La Défense, qui compte 75 immeubles de grande hauteur, les postes ne se limitent pas aux agents SSIAP 1 : ces services emploient aussi des chefs d'équipe SSIAP 2, qui dirigent le poste de sécurité, et des chefs de service SSIAP 3, qui conseillent l'exploitant et suivent les contrôles réglementaires.",
        "Les sièges sociaux et les immeubles de bureaux du département emploient aussi des agents d'accueil et de contrôle d'accès, titulaires de la carte de surveillance obtenue avec le TFP APS.",
      ],
    },
    {
      h3: "Accéder aux centres de formation",
      paragraphes: [
        "Le département est desservi par les RER A, B, C et E, par sept lignes de métro (1, 3, 4, 9, 10, 12 et 13), par plusieurs lignes de tramway dont le T2 et par des lignes Transilien. La Défense est l'un des principaux nœuds de correspondance de la région.",
      ],
    },
    {
      h3: "Ce qui distingue les Hauts-de-Seine",
      paragraphes: [
        "La concentration d'immeubles de grande hauteur rend visibles les débouchés de toute la filière incendie, de l'agent au chef de service.",
      ],
    },
  ],
  acces:
    "Les Hauts-de-Seine sont desservis par les RER A, B, C et E, par sept lignes de métro (1, 3, 4, 9, 10, 12 et 13), par plusieurs lignes de tramway dont le T2 et par des lignes Transilien, avec La Défense comme principal nœud de correspondance.",
  ancreSeFormer: "Se former dans le 92",
};
