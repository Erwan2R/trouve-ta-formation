import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "./supabase/types";

/**
 * Accès à l'espace admin (UX Paramètres admin §1, décisions Erwan) : compte unique, mot de passe puis code TOTP
 * obligatoire, session de 8 heures au plus depuis la saisie du mot de passe.
 * Fonction pure : partagée par le middleware (redirections) et le serveur (garde des pages et des actions).
 */
export const DUREE_SESSION_ADMIN_MS = 8 * 3600 * 1000;

export type EtatAdmin =
  | "anonyme" // pas de session
  | "refuse" // session d'un compte qui n'est pas l'administrateur
  | "expire" // plus de 8 heures depuis la connexion
  | "a-configurer" // aucune application d'authentification : seule la page Paramètres est ouverte
  | "a-verifier" // mot de passe saisi, code TOTP attendu
  | "ok";

type Jeton = { aal?: string; amr?: { method: string; timestamp: number }[] };

export function etatAdmin(p: {
  connecte: boolean;
  estAdmin: boolean;
  jeton: Jeton | null;
  facteurVerifie: boolean;
  maintenant: number;
}): EtatAdmin {
  if (!p.connecte || !p.jeton) return "anonyme";
  if (!p.estAdmin) return "refuse";
  // amr : horodatage (secondes) de chaque méthode utilisée dans cette session ; le mot de passe ouvre la session.
  const connexion = p.jeton.amr?.find((m) => m.method === "password")?.timestamp;
  if (!connexion || p.maintenant - connexion * 1000 > DUREE_SESSION_ADMIN_MS) return "expire";
  if (!p.facteurVerifie) return "a-configurer";
  return p.jeton.aal === "aal2" ? "ok" : "a-verifier";
}

/** Page vers laquelle renvoyer (null : la page demandée est accessible dans cet état). */
export function redirectionAdmin(etat: EtatAdmin, chemin: string): string | null {
  const sur = (...pages: string[]) => pages.some((p) => chemin === p || chemin === p.slice(0, -1));
  // Lien reçu par email (changement d'adresse) : le jeton suffit, il peut s'ouvrir dans un autre navigateur.
  if (chemin.startsWith("/auth/verifier")) return null;
  switch (etat) {
    case "anonyme":
      return sur("/connexion/") ? null : "/connexion/";
    case "refuse":
    case "expire":
      return `/connexion/?erreur=${etat}`;
    case "a-configurer":
      return sur("/parametres/") ? null : "/parametres/";
    case "a-verifier":
      return sur("/verification/") ? null : "/verification/";
    case "ok":
      return sur("/", "/connexion/", "/verification/") ? "/dashboard/" : null;
  }
}

/** Lit l'état de la session admin. `user` doit venir de getUser (jeton vérifié auprès de Supabase). */
export async function lireSessionAdmin(supabase: SupabaseClient<Database>, user: User | null) {
  const [{ data: admin }, { data: s }] = await Promise.all([
    user ? supabase.from("administrateurs").select("*").eq("id", user.id).maybeSingle() : { data: null },
    supabase.auth.getSession(),
  ]);
  // Jeton déjà vérifié : on n'en lit que le niveau d'authentification (aal) et ses méthodes (amr).
  const charge = s.session?.access_token.split(".")[1];
  const jeton: Jeton | null = charge ? JSON.parse(atob(charge.replace(/-/g, "+").replace(/_/g, "/"))) : null;
  const etat = etatAdmin({
    connecte: !!user,
    estAdmin: !!admin,
    jeton,
    facteurVerifie: !!user?.factors?.some((f) => f.status === "verified"),
    maintenant: Date.now(),
  });
  return { admin, etat };
}
