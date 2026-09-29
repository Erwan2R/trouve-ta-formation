"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import * as V from "@/lib/organismes/validation";
import { type Retour } from "@/lib/supabase/queries/apres-enregistrement";
import { getEspaceFrais } from "@/lib/supabase/queries/espace";
import { annulerChangement, envoyerLien } from "@/lib/supabase/queries/liens-email";
import { supabaseAdmin } from "@/lib/supabase/serveur";

const ECHEC = "L'opération a échoué. Réessayez dans un instant.";
const heure = () =>
  new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" }).format(new Date());

/**
 * Changement d'email différé (décision Erwan 29/09/2026) : un lien part vers la nouvelle adresse ; elle n'est prise
 * en compte qu'au clic (/auth/verifier/), et la validation de l'email suit la nouvelle adresse.
 */
export async function changerEmail(nouvel: string): Promise<Retour> {
  const e = V.email(nouvel);
  if (!e.ok || !e.valeur) return { ok: false, erreur: "Cette adresse email ne semble pas valide." };
  const { supabase, user } = await getEspaceFrais();
  if (e.valeur === user.email.toLowerCase()) return { ok: false, erreur: "C'est déjà votre email de connexion." };
  const { data: pris } = await supabase.rpc("email_deja_utilise", { p_email: e.valeur });
  if (pris) return { ok: false, erreur: "Cette adresse est déjà utilisée par un autre compte." };
  const r = await envoyerLien(user.id, "changement", e.valeur);
  return r.ok ? { ok: true, heure: heure() } : r;
}

/** Annule un changement en attente : le lien envoyé devient caduc, l'adresse actuelle reste la seule. */
export async function annulerChangementEmail(): Promise<Retour> {
  const { user } = await getEspaceFrais();
  await annulerChangement(user.id);
  return { ok: true, heure: heure() };
}

export async function renvoyerLienEmail(): Promise<Retour> {
  const { user } = await getEspaceFrais();
  if (!user.nouvelEmail) return { ok: false, erreur: ECHEC };
  const r = await envoyerLien(user.id, "changement", user.nouvelEmail);
  return r.ok ? { ok: true, heure: heure() } : r;
}

/**
 * Mot de passe : l'actuel est exigé (UX Paramètres §3), sauf juste après un lien « mot de passe oublié ».
 * Supabase envoie la notification de changement à l'adresse du compte.
 */
export async function changerMotDePasse(d: { actuel: string; nouveau: string; confirmation: string }): Promise<Retour> {
  if (d.nouveau.length < 10)
    return { ok: false, erreur: "Le nouveau mot de passe doit contenir au moins 10 caractères." };
  if (d.nouveau !== d.confirmation) return { ok: false, erreur: "Les deux mots de passe ne correspondent pas." };
  const magasin = await cookies();
  const reinitialisation = magasin.get("reinitialisation")?.value === "1";
  const { supabase, user } = await getEspaceFrais();
  if (!reinitialisation) {
    if (!d.actuel) return { ok: false, erreur: "Saisissez votre mot de passe actuel." };
    // Vérification sur un client jetable : la session courante n'est pas touchée.
    const verif = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error } = await verif.auth.signInWithPassword({ email: user.email, password: d.actuel });
    if (error) return { ok: false, erreur: "Le mot de passe actuel est incorrect." };
  }
  if (d.nouveau === d.actuel) return { ok: false, erreur: "Choisissez un mot de passe différent de l'actuel." };
  const { error } = await supabase.auth.updateUser({ password: d.nouveau });
  if (error) {
    console.error("Changement de mot de passe :", error.message);
    return {
      ok: false,
      erreur: /same|different/i.test(error.message) ? "Choisissez un mot de passe différent de l'actuel." : ECHEC,
    };
  }
  magasin.delete("reinitialisation");
  return { ok: true, heure: heure() };
}

export async function enregistrerInfos(d: { contact_nom: string; contact_telephone: string }): Promise<Retour> {
  const nom = V.texte(d.contact_nom, 120, "Nom");
  const tel = V.telephone(d.contact_telephone);
  if (!nom.ok) return nom;
  if (!tel.ok) return tel;
  const { supabase, user } = await getEspaceFrais();
  const { error } = await supabase
    .from("comptes_organisme")
    .update({ contact_nom: nom.valeur, contact_telephone: tel.valeur })
    .eq("id", user.id);
  if (error) {
    console.error("Informations du compte :", error.message);
    return { ok: false, erreur: ECHEC };
  }
  revalidatePath("/partenaires", "layout");
  return { ok: true, heure: heure() };
}

/**
 * Suppression immédiate et définitive (UX Paramètres §3) : confirmée par la saisie exacte du nom de l'organisme.
 * Le compte supprimé emporte l'organisme, ses lieux et ses offres (déclencheur), puis le logo.
 */
export async function supprimerCompte(confirmation: string): Promise<Retour> {
  const { organisme, user } = await getEspaceFrais();
  if (confirmation.trim() !== organisme.nom.trim())
    return { ok: false, erreur: "Saisissez exactement le nom de votre organisme." };
  const admin = supabaseAdmin();
  const { data: fichiers } = await admin.storage.from("logos").list(organisme.id);
  if (fichiers?.length) await admin.storage.from("logos").remove(fichiers.map((f) => `${organisme.id}/${f.name}`));
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    console.error("Suppression du compte :", error.message);
    return { ok: false, erreur: ECHEC };
  }
  // Ni déconnexion ni revalidation ici : elles relanceraient le rendu de la page courante (compte disparu).
  // /auth/suppression/ s'en charge, puis affiche la confirmation.
  return { ok: true, heure: heure() };
}

export async function seDeconnecter(): Promise<void> {
  const { supabase } = await getEspaceFrais();
  await supabase.auth.signOut();
}
