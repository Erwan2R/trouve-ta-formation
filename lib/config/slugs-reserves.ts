// Segments de /securite-privee/[slug]/ qui ne peuvent jamais être un titre ou une zone géo.
// Dupliqué dans la contrainte SQL `titres_slug_non_reserve` : garder les deux alignés.
export const SLUGS_RESERVES = [
  "organismes",
  "demarches",
  "blog",
  "recherche",
  "formulaire",
  "referencer-mon-organisme",
] as const;

export function estSlugReserve(slug: string): boolean {
  return (SLUGS_RESERVES as readonly string[]).includes(slug);
}
