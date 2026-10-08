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
        "Roissy-Charles de Gaulle s'étend sur trois départements, dont le Val-d'Oise, où résident 16 % de ses 94 600 salariés selon l'Insee (décembre 2025). Les entreprises de sûreté aéroportuaire y recrutent des agents d'exploitation et des opérateurs de sûreté, certifiés par typologie de missions : inspection-filtrage des passagers, des bagages, du fret, contrôle des accès côté piste.",
        "Hors de la zone aéroportuaire, le département offre des postes de surveillance plus classiques, sur des sites d'entreprise, des commerces ou des établissements recevant du public.",
        "À l'ouest, Cergy-Pontoise, préfecture du département, concentre administrations, campus universitaires et le centre commercial des 3 Fontaines. Argenteuil, la ville la plus peuplée du Val-d'Oise, a ses propres zones commerciales. Ces établissements recrutent pour la surveillance comme pour la sécurité incendie, sans le cadre réglementaire propre à l'aéroport.",
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
      lienTitre: "tfp-asa",
      paragraphes: [
        "La proximité de Roissy rend le TFP ASA cohérent comme projet local, mais il ne se prépare pas comme les autres titres : le projet se construit d'abord avec un employeur de la sûreté aérienne, puis avec un centre. Les conditions d'entrée sont détaillées sur la page du TFP ASA.",
        "Pour un candidat de l'ouest du département, Roissy reste loin. Le bassin de Cergy-Pontoise mérite donc d'être regardé pour lui-même, avec ses propres employeurs, plutôt que comme une annexe de la plateforme aéroportuaire.",
      ],
    },
  ],
  acces:
    "Le Val-d'Oise est desservi par les RER A, C et D et par des lignes Transilien qui rayonnent depuis Paris. Aller d'une branche à l'autre, par exemple de Cergy vers la zone de Roissy, demande une correspondance ou un bus : vérifiez le trajet réel aux horaires de la formation.",
  ancreSeFormer: "Se former dans le 95",
};
