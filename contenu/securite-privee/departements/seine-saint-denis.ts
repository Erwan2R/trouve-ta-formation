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
        "Le Stade de France, le Centre aquatique olympique à Saint-Denis et le parc des expositions Paris Nord Villepinte emploient, eux, des agents pour l'événementiel : contrôle d'accès et filtrage des spectateurs ou des visiteurs, gestion des flux les jours de match, de concert ou de salon. Ces missions relèvent de la carte de surveillance obtenue avec le TFP APS.",
      ],
    },
    {
      h3: "Accéder aux centres de formation",
      paragraphes: [
        "Le département est traversé par les RER A, B, D et E, par les lignes de métro 3, 5, 7, 9, 11, 12, 13 et 14, et par plusieurs lignes de tramway, dont le T1 et le T11. Depuis juin 2024, la ligne 14 dessert Saint-Denis Pleyel et rejoint Paris puis l'aéroport d'Orly en une quarantaine de minutes. Le RER B relie aussi le département à l'aéroport Charles de Gaulle. Les lignes de tramway et de bus qui relient les villes entre elles, sans passer par Paris, comptent autant que le métro pour rejoindre un centre situé dans une autre commune du département.",
      ],
    },
    {
      h3: "Ce qui distingue la Seine-Saint-Denis",
      lienTitre: "tfp-asa",
      paragraphes: [
        "C'est l'un des départements où un candidat peut viser, près de chez lui, aussi bien un poste d'agent de sûreté aéroportuaire qu'un poste événementiel ou de surveillance classique. Avant de choisir une formation, regardez donc quel employeur vous visez. La sûreté aéroportuaire se prépare avec une entreprise du secteur, et ses conditions d'entrée sont détaillées sur la page du TFP ASA, tandis que le TFP APS ouvre sur l'ensemble des postes de surveillance.",
      ],
    },
  ],
  acces:
    "La Seine-Saint-Denis est desservie par les RER A, B, D et E, les lignes de métro 3, 5, 7, 9, 11, 12, 13 et 14 et plusieurs lignes de tramway, dont le T1 et le T11. Depuis juin 2024, la ligne 14 relie Saint-Denis Pleyel à Paris et à l'aéroport d'Orly.",
  ancreSeFormer: "Se former dans le 93",
};
