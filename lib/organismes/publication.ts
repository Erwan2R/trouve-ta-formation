/**
 * Minimum publiable (spec Inscription, décision Erwan 02/10/2026) : nom, adresse du siège, un moyen de contact.
 * Même règle que la fonction SQL maj_publication, qui fait foi pour le statut.
 */
export function minimumPubliable(
  o: { nom: string; telephone: string | null; email_contact: string | null },
  siege: { adresse: string; code_postal: string; ville: string } | null,
): { siege: boolean; contact: boolean } {
  const plein = (v: string | null | undefined) => !!v && v.trim() !== "";
  return {
    siege: !!siege && plein(siege.adresse) && /^\d{5}$/.test(siege.code_postal) && plein(siege.ville),
    contact: plein(o.telephone) || plein(o.email_contact),
  };
}
