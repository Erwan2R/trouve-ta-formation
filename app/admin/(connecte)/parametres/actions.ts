"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { exigerAdmin } from "@/lib/admin-serveur";
import { genererCodes } from "@/lib/codes-recuperation";
import * as V from "@/lib/organismes/validation";
import type { Retour } from "@/lib/supabase/queries/apres-enregistrement";
import { annulerChangement, changementEnAttente, envoyerLien, hacher } from "@/lib/supabase/queries/liens-email";
import { supabaseAdmin } from "@/lib/supabase/serveur";

const ECHEC = "L'opération a échoué. Réessayez dans un instant.";
const CODE_INCORRECT = "Code incorrect. Vérifiez l'heure de votre appareil et réessayez.";
const heure = () =>
  new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" }).format(new Date());

/** Changement d'email différé : même mécanique que l'espace organisme (lien à usage unique vers la nouvelle adresse). */
export async function changerEmail(nouvel: string): Promise<Retour> {
  const e = V.email(nouvel);
  if (!e.ok || !e.valeur) return { ok: false, erreur: "Cette adresse email ne semble pas valide." };
  const { supabase, user } = await exigerAdmin();
  if (e.valeur === user.email?.toLowerCase()) return { ok: false, erreur: "C'est déjà votre email de connexion." };
  const { data: pris } = await supabase.rpc("email_deja_utilise", { p_email: e.valeur });
  if (pris) return { ok: false, erreur: "Cette adresse est déjà utilisée par un autre compte." };
  const r = await envoyerLien(user.id, "changement", e.valeur, "admin_id");
  return r.ok ? { ok: true, heure: heure() } : r;
}

export async function annulerChangementEmail(): Promise<Retour> {
  const { user } = await exigerAdmin();
  await annulerChangement(user.id, "admin_id");
  return { ok: true, heure: heure() };
}

export async function renvoyerLienEmail(): Promise<Retour> {
  const { user } = await exigerAdmin();
  const email = await changementEnAttente(user.id, "admin_id");
  if (!email) return { ok: false, erreur: ECHEC };
  const r = await envoyerLien(user.id, "changement", email, "admin_id");
  return r.ok ? { ok: true, heure: heure() } : r;
}

/** Mot de passe admin (UX Paramètres admin) : l'actuel est exigé, 12 caractères au moins, différent de l'actuel. */
export async function changerMotDePasse(d: { actuel: string; nouveau: string; confirmation: string }): Promise<Retour> {
  if (!d.actuel) return { ok: false, erreur: "Saisissez votre mot de passe actuel." };
  if (d.nouveau.length < 12)
    return { ok: false, erreur: "Le nouveau mot de passe doit contenir au moins 12 caractères." };
  if (d.nouveau === d.actuel) return { ok: false, erreur: "Le nouveau mot de passe doit être différent de l'actuel." };
  if (d.nouveau !== d.confirmation) return { ok: false, erreur: "Les deux mots de passe ne correspondent pas." };
  const { supabase, user } = await exigerAdmin();
  // Vérification sur un client jetable : la session courante (niveau aal2) n'est pas touchée.
  const verif = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error: faux } = await verif.auth.signInWithPassword({ email: user.email!, password: d.actuel });
  if (faux) return { ok: false, erreur: "Le mot de passe actuel est incorrect." };
  const { error } = await supabase.auth.updateUser({ password: d.nouveau });
  if (error) {
    console.error("Mot de passe admin :", error.message);
    return { ok: false, erreur: ECHEC };
  }
  await supabaseAdmin().from("administrateurs").update({ mdp_modifie_le: new Date().toISOString() }).eq("id", user.id);
  return { ok: true, heure: heure() };
}

/** Nouveau jeu de 10 codes : les précédents sont invalidés, seuls les hachés sont conservés. */
async function nouveauxCodes(adminId: string): Promise<string[]> {
  const codes = genererCodes();
  const admin = supabaseAdmin();
  await admin.from("codes_recuperation_admin").delete().eq("admin_id", adminId);
  await admin.from("codes_recuperation_admin").insert(codes.map((c) => ({ admin_id: adminId, code_hash: hacher(c) })));
  await admin.from("administrateurs").update({ codes_generes_le: new Date().toISOString() }).eq("id", adminId);
  return codes;
}

export type Configuration = { ok: true; facteur: string; qr: string; cle: string } | { ok: false; erreur: string };

/**
 * Étape 1 de la configuration (première fois, ou changement d'appareil) : un nouveau facteur TOTP non vérifié.
 * L'ancien reste actif jusqu'à la vérification du nouveau (maquette, setupIntro).
 */
export async function demarrerConfiguration(): Promise<Configuration> {
  const { supabase, user } = await exigerAdmin("a-configurer");
  // Configurations commencées puis abandonnées : sans effet, retirées avant d'en ouvrir une autre.
  for (const f of user.factors ?? [])
    if (f.status === "unverified") await supabase.auth.mfa.unenroll({ factorId: f.id });
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
    issuer: "Trouve ta formation",
    friendlyName: `Admin ${new Date().toISOString()}`,
  });
  if (error || !data) {
    console.error("2FA, configuration :", error?.message);
    return { ok: false, erreur: ECHEC };
  }
  return { ok: true, facteur: data.id, qr: data.totp.qr_code, cle: data.totp.secret };
}

/** Étape 2 : le code prouve que l'application fonctionne. L'ancien appareil est retiré, 10 nouveaux codes générés. */
export async function verifierConfiguration(
  facteur: string,
  code: string,
): Promise<{ ok: true; codes: string[] } | { ok: false; erreur: string }> {
  if (!/^\d{6}$/.test(code)) return { ok: false, erreur: CODE_INCORRECT };
  const { supabase, user } = await exigerAdmin("a-configurer");
  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: facteur, code });
  if (error) return { ok: false, erreur: CODE_INCORRECT };
  const admin = supabaseAdmin();
  for (const f of user.factors ?? [])
    if (f.id !== facteur) await admin.auth.admin.mfa.deleteFactor({ id: f.id, userId: user.id });
  await admin.from("administrateurs").update({ tfa_active_le: new Date().toISOString() }).eq("id", user.id);
  return { ok: true, codes: await nouveauxCodes(user.id) };
}

/** Nouveaux codes de récupération, confirmés par un code de l'application. */
export async function regenererCodes(
  code: string,
): Promise<{ ok: true; codes: string[] } | { ok: false; erreur: string }> {
  if (!/^\d{6}$/.test(code)) return { ok: false, erreur: CODE_INCORRECT };
  const { supabase, user } = await exigerAdmin();
  const facteur = user.factors?.find((f) => f.factor_type === "totp" && f.status === "verified");
  if (!facteur) return { ok: false, erreur: ECHEC };
  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: facteur.id, code });
  if (error) return { ok: false, erreur: CODE_INCORRECT };
  return { ok: true, codes: await nouveauxCodes(user.id) };
}

export async function seDeconnecter(): Promise<void> {
  const { supabase } = await exigerAdmin("a-configurer", "a-verifier");
  await supabase.auth.signOut();
}

export type Reglages = {
  departement: { organismes: number; palier_min: string };
  ville: { organismes: number; palier_min: string };
  elargissement: number;
  experience: { "ssiap-2": number; "ssiap-3": number };
};

/** Seuils du site (table parametres, note de passation §5.4), jusqu'ici provisoires et fixés en base. */
export async function enregistrerReglages(r: Reglages): Promise<Retour> {
  await exigerAdmin();
  const entier = (n: number, min: number, max: number) => Number.isInteger(n) && n >= min && n <= max;
  const palierOk = (p: string) => ["basique", "correct", "optimal"].includes(p);
  if (
    !entier(r.departement.organismes, 1, 100) ||
    !entier(r.ville.organismes, 1, 100) ||
    !palierOk(r.departement.palier_min) ||
    !palierOk(r.ville.palier_min) ||
    !entier(r.elargissement, 1, 50) ||
    !entier(r.experience["ssiap-2"], 0, 20) ||
    !entier(r.experience["ssiap-3"], 0, 20)
  )
    return { ok: false, erreur: "Une valeur est hors des limites autorisées." };
  const admin = supabaseAdmin();
  const lignes = [
    ["seuil_page_departement", r.departement],
    ["seuil_page_ville", r.ville],
    ["seuil_proposition_elargissement", r.elargissement],
    ["experience_encadrement", r.experience],
  ] as const;
  for (const [cle, valeur] of lignes) {
    const { error } = await admin.from("parametres").update({ valeur }).eq("cle", cle);
    if (error) {
      console.error("Réglages :", error.message);
      return { ok: false, erreur: ECHEC };
    }
  }
  // Pages départements, formulaire, catalogue : tout le site public dépend de ces seuils.
  revalidatePath("/", "layout");
  return { ok: true, heure: heure() };
}
