/**
 * Espace organisme : sous-domaine dédié (README handoff §7.2, décision Erwan 02/10/2026).
 * partenaires. (main) · partenaires-dev. (dev) · partenaires-preprod. (preprod) · partenaires.localhost (local).
 * Les pages vivent sous app/partenaires/ ; le middleware réécrit « /dashboard/ » en « /partenaires/dashboard/ ».
 */
export const PREFIXE_ESPACE = "/partenaires";

export function estHoteEspace(hote: string | null): boolean {
  return !!hote && /^partenaires(-dev|-preprod)?\./.test(hote);
}

/** Espace admin : admin. (main) · admin-dev. · admin-preprod. · admin.localhost ; pages sous app/admin/. */
export const PREFIXE_ADMIN = "/admin";

export function estHoteAdmin(hote: string | null): boolean {
  return !!hote && /^admin(-dev|-preprod)?\./.test(hote);
}

/** Pages accessibles sans être connecté. */
export const PAGES_PUBLIQUES_ESPACE = [
  "/connexion/",
  "/inscription/",
  "/mot-de-passe-oublie/",
  "/auth/confirm/",
  "/auth/verifier/",
  "/auth/suppression/",
  "/compte-supprime/",
];

/** URL absolue de l'espace depuis le site public (variable par environnement, production par défaut). */
export const URL_ESPACE_ORGANISME = (
  process.env.NEXT_PUBLIC_URL_ESPACE_ORGANISME ?? "https://partenaires.trouve-ta-formation.fr"
).replace(/\/$/, "");
