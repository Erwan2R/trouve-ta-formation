import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { EMAIL_CHANGEMENT, EMAIL_VALIDATION } from "@/contenu/espace/emails";
import { envoyerEmail } from "@/lib/email/resend";
import { origineEspace } from "@/lib/espace-serveur";
import { supabaseAdmin } from "../serveur";

/**
 * Liens envoyés par email (décision Erwan 29/09/2026) : usage unique, valables 24 h, jeton stocké haché.
 * Quota par compte (protection du quota Resend) : 1 envoi toutes les 2 minutes, 5 par jour.
 */
export type TypeLien = "validation" | "changement";
export const QUOTA = { intervalleMs: 2 * 60 * 1000, parJour: 5 };

export const hacher = (jeton: string) => createHash("sha256").update(jeton).digest("hex");

export type ResultatEnvoi = { ok: true } | { ok: false; erreur: string };
/** Titulaire du lien : un compte organisme (compte_id) ou l'administrateur (admin_id, changement d'email seul). */
export type Titulaire = "compte_id" | "admin_id";

export async function envoyerLien(
  compteId: string,
  type: TypeLien,
  email: string,
  titulaire: Titulaire = "compte_id",
): Promise<ResultatEnvoi> {
  const admin = supabaseAdmin();
  const depuis = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { data: recents } = await admin
    .from("liens_email")
    .select("created_at")
    .eq(titulaire, compteId)
    .gte("created_at", depuis)
    .order("created_at", { ascending: false });
  if ((recents?.length ?? 0) >= QUOTA.parJour)
    return { ok: false, erreur: "Vous avez atteint la limite de 5 envois aujourd'hui. Réessayez demain." };
  if (recents?.[0] && Date.now() - new Date(recents[0].created_at).getTime() < QUOTA.intervalleMs)
    return { ok: false, erreur: "Un email vient d'être envoyé. Patientez deux minutes avant d'en demander un autre." };

  const jeton = randomBytes(32).toString("base64url");
  // Un seul lien actif par compte et par type : les précédents deviennent caducs.
  await admin
    .from("liens_email")
    .update({ utilise_le: new Date().toISOString() })
    .eq(titulaire, compteId)
    .eq("type", type)
    .is("utilise_le", null);
  const { error } = await admin
    .from("liens_email")
    .insert({
      compte_id: titulaire === "compte_id" ? compteId : null,
      admin_id: titulaire === "admin_id" ? compteId : null,
      type,
      email,
      jeton_hash: hacher(jeton),
    });
  if (error) {
    console.error("Lien email :", error.message);
    return { ok: false, erreur: "L'envoi a échoué. Réessayez dans un instant." };
  }
  const lien = `${await origineEspace()}/auth/verifier/?t=${jeton}`;
  const espace = titulaire === "admin_id" ? "l'espace admin" : "votre espace organisme";
  const envoye = await envoyerEmail(
    type === "validation"
      ? { a: email, sujet: EMAIL_VALIDATION.sujet, html: EMAIL_VALIDATION.html(lien), texte: EMAIL_VALIDATION.texte(lien) }
      : {
          a: email,
          sujet: EMAIL_CHANGEMENT.sujet,
          html: EMAIL_CHANGEMENT.html(lien, email, espace),
          texte: EMAIL_CHANGEMENT.texte(lien, email, espace),
        },
  );
  return envoye ? { ok: true } : { ok: false, erreur: "L'envoi a échoué. Réessayez dans un instant." };
}

/** Changement d'email en attente (lien non utilisé et non expiré), pour l'afficher dans Paramètres. */
export async function changementEnAttente(
  compteId: string,
  titulaire: Titulaire = "compte_id",
): Promise<string | null> {
  const { data } = await supabaseAdmin()
    .from("liens_email")
    .select("email")
    .eq(titulaire, compteId)
    .eq("type", "changement")
    .is("utilise_le", null)
    .gt("expire_le", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data?.email ?? null;
}

export async function annulerChangement(compteId: string, titulaire: Titulaire = "compte_id"): Promise<void> {
  await supabaseAdmin()
    .from("liens_email")
    .update({ utilise_le: new Date().toISOString() })
    .eq(titulaire, compteId)
    .eq("type", "changement")
    .is("utilise_le", null);
}
