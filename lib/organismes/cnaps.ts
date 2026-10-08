import { releveDuCnaps } from "@/lib/formulaire/parcours";

/**
 * L'autorisation d'exercice CNAPS ne concerne que les organismes qui préparent au moins un titre hors SSIAP
 * (décision Erwan du 08/10/2026) : la filière incendie relève de l'arrêté du 2 mai 2005, pas du CNAPS. Sans aucun
 * titre déclaré, on ne sait pas encore : le champ reste proposé.
 */
export const soumisAutorisationCnaps = (titres: string[]) => titres.length === 0 || titres.some(releveDuCnaps);
