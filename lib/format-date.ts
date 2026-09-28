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
