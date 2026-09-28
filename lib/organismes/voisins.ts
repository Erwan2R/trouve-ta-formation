/** Départements franciliens limitrophes (état « zéro résultat » : alternative géographique). */
export const DEPARTEMENTS_VOISINS: Record<string, string[]> = {
  "75": ["92", "93", "94"],
  "77": ["93", "94", "91", "95"],
  "78": ["92", "95", "91"],
  "91": ["94", "92", "78", "77"],
  "92": ["75", "78", "95", "93", "94", "91"],
  "93": ["75", "94", "95", "77", "92"],
  "94": ["75", "93", "91", "92", "77"],
  "95": ["93", "92", "78", "77"],
};
