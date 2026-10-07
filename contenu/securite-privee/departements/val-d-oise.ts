import type { ContenuDepartement } from "./types";

// Faits vérifiés le 06/10/2026 : emprise de Paris-CDG à Roissy-en-France et Épiais-lès-Louvres (ACNUSA, Insee) et
// lieux de résidence de ses salariés, conditions d'entrée du TFP ASA (fiche RNCP40278), lignes RER A, C et D.
export const valDOise: ContenuDepartement = {
  chapo: [
    "Le Val-d'Oise accueille une partie de la plateforme de Roissy-Charles de Gaulle, sur les communes de Roissy-en-France et d'Épiais-lès-Louvres. C'est l'un des départements où la sûreté aéroportuaire a le plus de sens comme projet de formation local.",
  ],
  seFormer: [
    {
      h3: "Le bassin d'emploi",
      paragraphes: [
        "Roissy-Charles de Gaulle s'étend sur trois départements, dont le Val-d'Oise, où résident 16 % de ses 94 600 salariés selon l'Insee (décembre 2025). Les entreprises de sûreté aéroportuaire y recrutent des agents d'exploitation et des opérateurs de sûreté, certifiés par typologie de missions : inspection-filtrage des passagers, des bagages, du fret, contrôle des accès côté piste. La certification se passe à l'issue d'une formation initiale dont la DGAC fixe la durée minimale par typologie, de 109 h 30 à 136 heures selon l'étendue des contrôles, dont 38 à 50 heures d'analyse d'images sur simulateur. L'examen est organisé par l'École nationale de l'aviation civile.",
        "Hors de la zone aéroportuaire, le département offre des postes de surveillance plus classiques, sur des sites d'entreprise, des commerces ou des établissements recevant du public, où la carte de surveillance et le SSIAP 1 restent les qualifications d'entrée.",
      ],
    },
    {
      h3: "Accéder aux centres de formation",
      paragraphes: [
        "Le Val-d'Oise est desservi par les RER A (vers Cergy), C (vers Pontoise) et D (vers Goussainville et Villiers-le-Bel), et par plusieurs lignes Transilien. Ces lignes rayonnent depuis Paris : aller d'une branche à l'autre, par exemple de Cergy vers la zone de Roissy, demande une correspondance ou un trajet en bus. Pour une formation de plusieurs semaines, vérifiez le trajet réel aux horaires des cours.",
      ],
    },
    {
      h3: "Ce qui distingue le Val-d'Oise",
      paragraphes: [
        "La proximité de Roissy rend le TFP ASA accessible, mais il ne se prépare pas comme les autres titres : il faut être de nationalité française ou européenne, ne faire l'objet d'aucune inscription au bulletin n° 3 du casier judiciaire et détenir une lettre d'intention d'embauche d'une entreprise de sûreté aérienne avant d'entrer en formation. Le projet se construit donc d'abord avec un employeur, puis avec un centre. L'autorisation préalable ou provisoire du CNAPS doit aussi être obtenue avant l'entrée en formation : anticipez sa demande, dont l'instruction prend du temps. Une fois en poste, l'employeur organise chaque année une formation périodique obligatoire.",
      ],
    },
  ],
  acces:
    "Le Val-d'Oise est desservi par les RER A, C et D et par des lignes Transilien qui rayonnent depuis Paris. Aller d'une branche à l'autre, par exemple de Cergy vers la zone de Roissy, demande une correspondance ou un bus : vérifiez le trajet réel aux horaires de la formation.",
  ancreSeFormer: "Se former dans le 95",
};
