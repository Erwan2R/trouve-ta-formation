import type { ContenuDepartement } from "./types";

// Faits vérifiés le 06/10/2026 : emprise de Paris-CDG à Tremblay-en-France et lieux de résidence de ses salariés,
// aéroport de Paris-Le Bourget (Groupe ADP : 553 ha, 1er aéroport d'affaires en Europe), Stade de France à
// Saint-Denis, ligne 14 à Saint-Denis Pleyel depuis le 24 juin 2024 (RATP), conditions d'entrée du TFP ASA (RNCP40278).
export const seineSaintDenis: ContenuDepartement = {
  chapo: [
    "La Seine-Saint-Denis réunit une partie de la plateforme de Roissy-Charles de Gaulle, à Tremblay-en-France, l'aéroport d'affaires du Bourget et le Stade de France, à Saint-Denis. Sûreté aéroportuaire, événementiel et surveillance de sites s'y côtoient.",
  ],
  seFormer: [
    {
      h3: "Le bassin d'emploi",
      paragraphes: [
        "Roissy-Charles de Gaulle s'étend en partie sur la commune de Tremblay-en-France, et parmi les trois départements sur lesquels s'étend l'aéroport, c'est en Seine-Saint-Denis que résident le plus de salariés de la plateforme : 19 %, contre 16 % pour le Val-d'Oise et la Seine-et-Marne, selon l'Insee (décembre 2025). L'aéroport de Paris-Le Bourget, premier aéroport d'affaires d'Europe selon son exploitant, s'étend sur 553 hectares. Les métiers de la sûreté aéroportuaire y sont donc à portée, avec leurs conditions propres.",
        "Le Stade de France et les grands équipements du département emploient, eux, des agents pour l'événementiel : contrôle d'accès, filtrage, palpations de sécurité. Ces missions relèvent de la carte de surveillance obtenue avec le TFP APS, dont le programme comporte un module consacré aux grands rassemblements. Les palpations et l'inspection visuelle des bagages y sont encadrées par la loi : le TFP APS leur consacre 7 heures, dont 4 de mise en situation, et le MAC APS les révise tous les cinq ans. Pour un même agent, ces deux univers ne demandent pas la même qualification : la sûreté aéroportuaire suppose une certification de la DGAC en plus de la carte professionnelle.",
      ],
    },
    {
      h3: "Accéder aux centres de formation",
      paragraphes: [
        "Le département est traversé par les RER B, D et E, et par les lignes de métro 5, 9, 13 et 14. Depuis juin 2024, la ligne 14 dessert Saint-Denis Pleyel et rejoint Paris puis l'aéroport d'Orly en une quarantaine de minutes. Le RER B relie aussi le département à l'aéroport Charles de Gaulle. Pour une formation de plusieurs semaines, vérifiez le trajet réel entre votre domicile et le centre, aux horaires des cours.",
      ],
    },
    {
      h3: "Ce qui distingue la Seine-Saint-Denis",
      paragraphes: [
        "C'est l'un des départements où un candidat peut viser, près de chez lui, aussi bien un poste d'agent de sûreté aéroportuaire qu'un poste événementiel ou de surveillance classique. Avant de choisir une formation, regardez quel employeur vous visez : le TFP ASA exige une nationalité française ou européenne et une lettre d'intention d'embauche avant même d'entrer en formation, alors que le TFP APS ouvre sur l'ensemble des postes de surveillance.",
      ],
    },
  ],
  acces:
    "La Seine-Saint-Denis est desservie par les RER B, D et E et par les lignes de métro 5, 9, 13 et 14. La ligne 14, prolongée jusqu'à Saint-Denis Pleyel en juin 2024, relie le département à Paris et à l'aéroport d'Orly.",
  ancreSeFormer: "Se former dans le 93",
};
