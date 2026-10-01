"use server";

import type { EtatFormulaire } from "@/app/partenaires/(acces)/actions";
import { exigerAdmin } from "@/lib/admin-serveur";
import { effacerTentatives, ipVisiteur, limiteAtteinte, MESSAGE_LIMITE, noterTentative, regles } from "@/lib/limite";
import { normaliserCode } from "@/lib/codes-recuperation";
import { hacher } from "@/lib/supabase/queries/liens-email";
import { supabaseAdmin, supabaseServeur } from "@/lib/supabase/serveur";

const CODE_INCORRECT = "Code incorrect. Vérifiez l'heure de votre appareil et réessayez.";

/** Étape 1 : mot de passe. Un compte organisme est refusé avec le même message qu'un mauvais mot de passe. */
export async function seConnecter(_: EtatFormulaire, donnees: FormData): Promise<EtatFormulaire> {
  const email = String(donnees.get("email") ?? "").trim();
  // Compte admin : 5 échecs par compte et 10 par adresse IP en 15 minutes.
  const r = regles("admin", email, await ipVisiteur(), 5, 10);
  if (await limiteAtteinte(r)) return { erreur: MESSAGE_LIMITE, valeurs: { email } };
  const supabase = await supabaseServeur();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: String(donnees.get("mot_de_passe") ?? ""),
  });
  const { data: admin } = data.user
    ? await supabase.from("administrateurs").select("id").eq("id", data.user.id).maybeSingle()
    : { data: null };
  if (error || !admin) {
    await noterTentative(r);
    if (data.user) await supabase.auth.signOut();
    return { erreur: "Adresse email ou mot de passe incorrect.", valeurs: { email } };
  }
  await effacerTentatives(r);
  // Le middleware oriente ensuite vers la vérification du code, ou vers Paramètres si le 2FA reste à configurer.
  return { vers: "/verification/" };
}

/** Étape 2 : code à six chiffres de l'application d'authentification (session portée au niveau aal2). */
export async function verifierCode(_: EtatFormulaire, donnees: FormData): Promise<EtatFormulaire> {
  const code = String(donnees.get("code") ?? "").replace(/\s/g, "");
  if (!/^\d{6}$/.test(code)) return { erreur: "Saisissez les six chiffres affichés par l'application." };
  const { supabase, user } = await exigerAdmin("a-verifier");
  // Code à six chiffres : 5 essais en 15 minutes (un million de combinaisons, jamais à portée d'essais en série).
  const r = regles("totp", user.id, await ipVisiteur(), 5, 10);
  if (await limiteAtteinte(r)) return { erreur: MESSAGE_LIMITE };
  const facteur = user.factors?.find((f) => f.factor_type === "totp" && f.status === "verified");
  if (!facteur) return { vers: "/parametres/" };
  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: facteur.id, code });
  if (error) {
    await noterTentative(r);
    return { erreur: CODE_INCORRECT };
  }
  await effacerTentatives(r);
  return { vers: "/dashboard/" };
}

/**
 * Appareil perdu : un code de récupération (usage unique) remplace le code TOTP. L'ancienne application est
 * retirée et le 2FA doit être configuré à nouveau avant tout accès (Paramètres, état « à configurer »).
 */
export async function utiliserCodeRecuperation(_: EtatFormulaire, donnees: FormData): Promise<EtatFormulaire> {
  const code = normaliserCode(String(donnees.get("code_recuperation") ?? ""));
  if (!code) return { erreur: "Un code de récupération a la forme XXXX-XXXX." };
  const { user } = await exigerAdmin("a-verifier");
  const r = regles("recuperation", user.id, await ipVisiteur(), 5, 10);
  if (await limiteAtteinte(r)) return { erreur: MESSAGE_LIMITE };
  const admin = supabaseAdmin();
  // Consommation atomique : un code déjà utilisé ne correspond à aucune ligne.
  const { data } = await admin
    .from("codes_recuperation_admin")
    .update({ utilise_le: new Date().toISOString() })
    .eq("admin_id", user.id)
    .eq("code_hash", hacher(code))
    .is("utilise_le", null)
    .select("id")
    .maybeSingle();
  if (!data) {
    await noterTentative(r);
    return { erreur: "Ce code n'est pas valable ou a déjà été utilisé." };
  }
  for (const f of user.factors ?? []) await admin.auth.admin.mfa.deleteFactor({ id: f.id, userId: user.id });
  await admin.from("administrateurs").update({ tfa_active_le: null }).eq("id", user.id);
  return { vers: "/parametres/" };
}
