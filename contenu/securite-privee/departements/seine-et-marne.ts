import type { ContenuDepartement } from "./types";

// Faits vérifiés le 06/10/2026 : superficie (Insee : la moitié de la superficie régionale), Disneyland Paris à Chessy
// (plus de 17 000 salariés), communes d'emprise de Paris-CDG en Seine-et-Marne (Insee), RER A, B, D et E.
export const seineEtMarne: ContenuDepartement = {
  chapo: [
    "La Seine-et-Marne couvre à elle seule la moitié de la superficie de l'Île-de-France. Elle accueille Disneyland Paris, à Chessy, et une partie de la plateforme de Roissy-Charles de Gaulle, au nord : loisirs, événementiel et aéroportuaire y emploient des agents de sécurité, mais sur des sites parfois très éloignés les uns des autres.",
  ],
  seFormer: [
    {
      h3: "Le bassin d'emploi",
      paragraphes: [
        "Disneyland Paris, à Chessy, emploie plus de 17 000 salariés et reçoit du public toute l'année : contrôle d'accès, filtrage, surveillance et sécurité incendie y sont indispensables. Un parc de loisirs de cette taille filtre ses entrées comme un grand événement : contrôle d'accès, inspection visuelle des bagages, palpation de sécurité. Au nord du département, quatre communes de Seine-et-Marne font partie de l'emprise de Roissy-Charles de Gaulle, dont Mitry-Mory et Le Mesnil-Amelot, et environ 12 000 salariés de la plateforme résident dans le département.",
        "Ailleurs, autour de Melun, de Sénart ou de Meaux, les employeurs de la sécurité interviennent sur des sites d'entreprise, des zones commerciales et des établissements recevant du public, où la carte de surveillance et le SSIAP 1 sont les qualifications d'entrée.",
      ],
    },
    {
      h3: "Accéder aux centres de formation",
      paragraphes: [
        "La desserte dépend fortement de la zone. Le RER A rejoint Marne-la-Vallée–Chessy, le RER B Mitry-Claye au nord, le RER D Melun et le sud du département, le RER E Chelles et Tournan ; plusieurs lignes Transilien complètent le réseau. Ces lignes convergent vers Paris, pas entre elles : traverser le département du nord au sud ou d'est en ouest peut prendre beaucoup plus de temps qu'un trajet vers Paris. Pour le titre cynophile, la question est encore plus sensible : 490 heures au minimum pour un candidat qui part de zéro, soit plus de trois mois à temps plein, avec des séances de nuit imposées par le programme. Un centre accessible en voiture devient alors un critère, d'autant que le permis B est exigé à l'entrée.",
      ],
    },
    {
      h3: "Ce qui distingue la Seine-et-Marne",
      paragraphes: [
        "Sa taille. Dans un département qui couvre la moitié de la région, « près de chez soi » ne se mesure pas en kilomètres mais en temps de trajet et en correspondances. Pour une formation suivie en présentiel pendant plusieurs semaines, un centre situé dans un département voisin, mais sur votre ligne de RER, peut être plus accessible qu'un centre seine-et-marnais à l'autre bout du territoire.",
      ],
    },
  ],
  acces:
    "La Seine-et-Marne est desservie par les RER A (Marne-la-Vallée), B (Mitry-Claye), D (Melun) et E (Chelles, Tournan), complétés par des lignes Transilien. Ces lignes convergent vers Paris : dans un département aussi vaste, un trajet entre deux zones du territoire peut être plus long qu'un trajet vers un département voisin.",
  ancreSeFormer: "Se former dans le 77",
};
