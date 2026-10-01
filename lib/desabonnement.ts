import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { URL_ESPACE_ORGANISME } from "./espace";

// Désabonnement des rappels (décision Erwan 01/10/2026) : lien sans connexion, signé pour qu'on ne puisse pas
// désabonner un autre organisme. La clé de signature est la clé serveur Supabase, jamais exposée au navigateur.
const signer = (id: string) =>
  createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY!).update(`desabonnement:${id}`).digest("base64url");

export const jetonDesabonnement = (organismeId: string) => `${organismeId}.${signer(organismeId)}`;

/** Identifiant de l'organisme si la signature est valide, sinon null. */
export function lireJetonDesabonnement(jeton: string | null): string | null {
  const [id, signature] = (jeton ?? "").split(".");
  if (!id || !signature || !/^[0-9a-f-]{36}$/.test(id)) return null;
  const attendu = Buffer.from(signer(id));
  const recu = Buffer.from(signature);
  return attendu.length === recu.length && timingSafeEqual(attendu, recu) ? id : null;
}

/** Page de désabonnement (espace organisme) et adresse de désabonnement en un clic (en-tête List-Unsubscribe). */
export const liensDesabonnement = (organismeId: string) => {
  const t = encodeURIComponent(jetonDesabonnement(organismeId));
  return {
    page: `${URL_ESPACE_ORGANISME}/desabonnement/?t=${t}`,
    unClic: `${URL_ESPACE_ORGANISME}/desabonnement/confirmer/?t=${t}`,
  };
};
