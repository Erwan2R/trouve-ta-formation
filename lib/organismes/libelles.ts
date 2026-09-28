/** Vocabulaires fermés de la fiche (valeurs stockées en base → libellés affichés). */
export const FINANCEMENTS = {
  cpf: "CPF",
  france_travail: "France Travail",
  opco: "OPCO",
  plan_developpement: "Plan de développement des compétences",
} as const;

/** Filtre « Financement accepté » du catalogue : trois options seulement (Copy catalogue §6). */
export const FINANCEMENTS_FILTRE = ["cpf", "france_travail", "opco"] as const;

export const RYTHMES = { temps_plein: "Temps plein", soir: "Cours du soir", week_end: "Week-end" } as const;

export const libelle = (table: Record<string, string>, cle: string) => table[cle] ?? cle;

/** « 1 490 € », « 390 € – 450 € », ou null (→ « Prix sur demande »). */
export function prix(min: number | null, max: number | null): string | null {
  // Séparateur de milliers U+202F absent de Plus Jakarta Sans : remplacé par une espace insécable classique.
  const f = (n: number) =>
    `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n).replace(/ /g, " ")} €`;
  if (min === null) return null;
  return max !== null && max !== min ? `${f(min)} – ${f(max)}` : f(min);
}

/** Département d'un code postal francilien (« 93200 » → « 93 »). */
export const departementDuCodePostal = (cp: string) => cp.slice(0, 2);

/** Monogramme de repli quand le logo est absent (« Académie Française de Sécurité » → « AF »). */
export function monogramme(nom: string): string {
  const mots = nom.split(/[\s-]+/).filter((m) => /^\p{Lu}/u.test(m));
  return (mots.length >= 2 ? mots[0][0] + mots[1][0] : nom.slice(0, 2)).toUpperCase();
}
