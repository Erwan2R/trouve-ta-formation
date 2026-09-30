import { estSlugReserve } from "./config/slugs-reserves";

// Référentiel des titres, côté admin (UX Référentiel des titres, maquette « Referentiel Titres »).

const sansAccent = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

/** « Agent de sûreté magasin » → « agent-de-surete-magasin ». Le slug ne change plus après la création. */
export const slugTitre = (intitule: string) =>
  sansAccent(intitule)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

type TitreConnu = { id: number; slug: string; libelle_court: string; libelle_long: string };

/** Même intitulé (casse et accents ignorés) qu'un autre titre du référentiel. */
export const intituleDejaPris = (intitule: string, titres: TitreConnu[], sauf?: number) =>
  titres.some((t) => t.id !== sauf && sansAccent(t.libelle_court).trim() === sansAccent(intitule).trim());

/** Slug vide, réservé ou déjà utilisé par un titre (les zones géographiques sont vérifiées côté serveur). */
export const slugIndisponible = (slug: string, titres: TitreConnu[]) =>
  !slug || estSlugReserve(slug) || titres.some((t) => t.slug === slug);

// Mots trop courants pour signaler un titre proche.
const VIDES = new Set([
  "agent",
  "agents",
  "securite",
  "formation",
  "titre",
  "finalite",
  "professionnelle",
  "tfp",
  "service",
  "chef",
  "des",
  "les",
  "aux",
  "pour",
]);
const mots = (s: string) =>
  sansAccent(s)
    .split(/[^a-z0-9]+/)
    .filter((m) => m.length > 2 && !VIDES.has(m));

/** Titres qui partagent un mot significatif avec l'intitulé proposé (aide contre les doublons, 4 au plus). */
export function titresProches(intitule: string, titres: TitreConnu[], sauf?: number): string[] {
  const cherches = new Set(mots(intitule));
  if (!sansAccent(intitule).trim()) return [];
  return titres
    .filter(
      (t) =>
        t.id !== sauf &&
        (sansAccent(t.libelle_court) === sansAccent(intitule).trim() ||
          mots(`${t.libelle_court} ${t.libelle_long}`).some((m) => cherches.has(m))),
    )
    .map((t) => t.libelle_court)
    .slice(0, 4);
}
