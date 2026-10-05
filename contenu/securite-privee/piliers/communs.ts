import { NIVEAU_FRANCAIS } from "../formulaire";
import { releveDuCnaps } from "../../../lib/formulaire/parcours";

// Conditions communes aux pages piliers (Copy piliers §8, H3 2 et 3), selon la filière (décision Erwan 02/10/2026) :
// titres CNAPS → moralité et langue (B1 pour les seuls étrangers) ; SSIAP → évaluation main courante (arrêté du 2 mai 2005).
export function conditionsCommunes(slug: string) {
  return releveDuCnaps(slug)
    ? [
        {
          h3: "Les conditions de moralité",
          texte:
            "Le CNAPS instruit la moralité du candidat à partir de son casier judiciaire et des fichiers auxquels il a accès. Certaines condamnations sont incompatibles avec l'exercice de l'activité.",
        },
        { h3: "Le niveau de français", texte: NIVEAU_FRANCAIS },
      ]
    : [
        {
          h3: "Le niveau de français",
          texte:
            "La formation et les examens se déroulent en français. À l'entrée, une évaluation vérifie votre capacité à rendre compte par écrit d'une anomalie dans une main courante.",
        },
      ];
}
