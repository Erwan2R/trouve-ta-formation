import { NIVEAU_FRANCAIS } from "../formulaire";
import { releveDuCnaps } from "../../../lib/formulaire/parcours";

// Conditions communes aux pages piliers (Copy piliers §8, H3 2 et 3), selon la filière (décision Erwan 02/10/2026) :
// titres CNAPS → moralité et langue (B1 pour les seuls étrangers) ; SSIAP 1 → évaluation main courante (arrêté du
// 2 mai 2005, art. 4) ; autres niveaux et recyclages SSIAP : pas de condition commune, tout est propre au titre.
export function conditionsCommunes(slug: string): { h3: string; texte: string }[] {
  if (!releveDuCnaps(slug))
    return slug === "ssiap-1"
      ? [
          {
            h3: "Le niveau de français",
            texte:
              "La formation et les examens se déroulent en français. À l'entrée, le centre évalue votre capacité à rendre compte par écrit, sur la main courante, des anomalies constatées lors d'une ronde, et à alerter les secours.",
          },
        ]
      : [];
  return [
    {
      h3: "Les conditions de moralité",
      texte:
        "Le CNAPS instruit la moralité du candidat à partir de son casier judiciaire et des fichiers auxquels il a accès. Certaines condamnations sont incompatibles avec l'exercice de l'activité.",
    },
    { h3: "Le niveau de français", texte: NIVEAU_FRANCAIS },
  ];
}
