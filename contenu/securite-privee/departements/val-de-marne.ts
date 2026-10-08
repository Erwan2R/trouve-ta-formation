import type { ContenuDepartement } from "./types";

// Faits vérifiés le 08/10/2026 : emprise de Paris-Orly (ACNUSA : Orly, Rungis, Thiais, Villeneuve-le-Roi dans le 94),
// Marché international de Rungis (rungisinternational.com, chiffres clés : 234 ha, 1 226 entreprises, 13 000 employés), ligne 14 jusqu'à l'aéroport
// d'Orly depuis le 24 juin 2024 (RATP), RER A, C et D, métro 7 et 8.
export const valDeMarne: ContenuDepartement = {
  chapo: [
    "Le Val-de-Marne réunit l'aéroport d'Orly, dont l'emprise couvre notamment Orly, Rungis, Thiais et Villeneuve-le-Roi, et le Marché international de Rungis, qui rassemble plus de 1 200 entreprises. Sûreté aéroportuaire, surveillance de sites logistiques et d'entrepôts : le département combine deux grands pôles d'emploi de la sécurité.",
  ],
  seFormer: [
    {
      h3: "Le bassin d'emploi",
      paragraphes: [
        "L'aéroport de Paris-Orly s'étend sur le Val-de-Marne et l'Essonne. Ses entreprises de sûreté recrutent des agents certifiés pour l'inspection-filtrage et le contrôle des accès côté piste, titulaires du TFP ASA.",
        "À côté, le Marché international de Rungis couvre 234 hectares et compte 13 000 employés. Un site de cette taille, traversé par des flux permanents de marchandises, demande du contrôle d'accès, des rondes et de la surveillance : des missions relevant de la carte de surveillance obtenue avec le TFP APS.",
        "Le reste du département a d'autres employeurs. Créteil, préfecture, réunit le centre commercial Créteil Soleil, l'hôpital Henri-Mondor et l'université Paris-Est Créteil ; les bords de Seine, d'Ivry à Vitry, gardent des sites industriels et des entrepôts. Hôpitaux et centres commerciaux étant des établissements recevant du public, la sécurité incendie y offre des postes aux côtés de la surveillance.",
      ],
    },
    {
      h3: "Accéder aux centres de formation",
      paragraphes: [
        "Le département est desservi par les RER A, B, C, D et E et par les lignes de métro 1, 7, 8 et 14. Depuis juin 2024, la ligne 14 traverse le Val-de-Marne jusqu'à l'aéroport d'Orly, ce qui a raccourci les trajets entre Paris, le sud du département et la zone aéroportuaire. Vérifiez si le centre qui vous intéresse se trouve sur l'une de ces lignes avant de comparer les distances. Le tramway T7 relie aussi Villejuif à la zone d'Orly.",
        "Le tramway T9, ouvert en 2021, relie aussi la porte de Choisy à Orly-Ville en traversant Vitry et Choisy-le-Roi.",
      ],
    },
    {
      h3: "Ce qui distingue le Val-de-Marne",
      paragraphes: [
        "La ligne 14 a changé la géographie du département : un candidat qui habite le long de son tracé, au nord comme au sud de Paris, rejoint désormais Orly et ses employeurs sans changement. Pour les métiers aéroportuaires, c'est autant le trajet vers le futur poste que vers le centre de formation qu'il faut regarder.",
      ],
    },
  ],
  acces:
    "Le Val-de-Marne est desservi par les RER A, B, C, D et E et par les lignes de métro 1, 7, 8 et 14, prolongée jusqu'à l'aéroport d'Orly en juin 2024. Ces lignes rejoignent Paris directement ; vérifiez si le centre qui vous intéresse se trouve sur l'une d'elles.",
  ancreSeFormer: "Se former dans le 94",
};
