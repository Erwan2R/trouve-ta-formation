/** « 1er septembre 2026 », « 28 septembre 2026 » (heure de Paris). */
export function dateLongue(iso: string): string {
  const s = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(new Date(iso));
  return s.replace(/^1 /, "1er ");
}

/** « 12 sept. 2026 » (maquettes de l'espace organisme). */
export function dateCourte(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Paris" })
    .format(new Date(iso))
    .replace(/^1 /, "1er ");
}
