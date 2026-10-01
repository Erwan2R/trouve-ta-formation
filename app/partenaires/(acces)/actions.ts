"use server";

import { headers } from "next/headers";
import { origineEspace } from "@/lib/espace-serveur";
import { effacerTentatives, ipVisiteur, limiteAtteinte, MESSAGE_LIMITE, noterTentative, regles } from "@/lib/limite";
import { envoyerLien } from "@/lib/supabase/queries/liens-email";
import { verifierTurnstile } from "@/lib/turnstile";
import { supabaseServeur } from "@/lib/supabase/serveur";

/**
 * `vers` : page où envoyer le navigateur. Jamais redirect() dans une action serveur de l'espace : Next.js rendrait
 * la page cible sans repasser par le middleware du sous-domaine (404).
 */
export type EtatFormulaire = { erreur?: string; ok?: string; vers?: string; valeurs?: Record<string, string> } | null;

export async function seConnecter(_: EtatFormulaire, donnees: FormData): Promise<EtatFormulaire> {
  const email = String(donnees.get("email") ?? "").trim();
  const motDePasse = String(donnees.get("mot_de_passe") ?? "");
  // 5 échecs par compte et 30 par adresse IP en 15 minutes.
  const r = regles("connexion", email, await ipVisiteur(), 5, 30);
  if (await limiteAtteinte(r)) return { erreur: MESSAGE_LIMITE, valeurs: { email } };
  const supabase = await supabaseServeur();
  const { error } = await supabase.auth.signInWithPassword({ email, password: motDePasse });
  // Message unique : ne révèle pas si l'adresse a un compte.
  if (error) {
    await noterTentative(r);
    return { erreur: "Adresse email ou mot de passe incorrect.", valeurs: { email } };
  }
  await effacerTentatives(r);
  return { vers: "/dashboard/" };
}

/** Mot de passe oublié : même réponse que l'adresse ait un compte ou non (aucune information divulguée). */
export async function reinitialiserMotDePasse(_: EtatFormulaire, donnees: FormData): Promise<EtatFormulaire> {
  const email = String(donnees.get("email") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { erreur: "Cette adresse email ne semble pas valide.", valeurs: { email } };
  // 3 demandes par adresse et 10 par IP par heure (quota d'envoi d'emails).
  const r = regles("oubli", email, await ipVisiteur(), 3, 10, 60);
  if (await limiteAtteinte(r)) return { erreur: MESSAGE_LIMITE, valeurs: { email } };
  await noterTentative(r);
  const supabase = await supabaseServeur();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await origineEspace()}/auth/confirm/`,
  });
  if (error) console.error("Mot de passe oublié :", error.message);
  return {
    ok: "Si un compte existe pour cette adresse, un lien de réinitialisation vient d'y être envoyé. Il est valable une heure.",
    valeurs: { email },
  };
}

/**
 * Inscription en 3 champs (spec Inscription §3). Accès immédiat à l'onboarding : la validation de l'email
 * bloque la publication, pas l'accès (§4). L'organisme est créé en brouillon par un déclencheur en base.
 */
export async function sInscrire(_: EtatFormulaire, donnees: FormData): Promise<EtatFormulaire> {
  const email = String(donnees.get("email") ?? "")
    .trim()
    .toLowerCase();
  const motDePasse = String(donnees.get("mot_de_passe") ?? "");
  const nom = String(donnees.get("nom_organisme") ?? "")
    .trim()
    .replace(/\s+/g, " ");
  const valeurs = { email, nom_organisme: nom };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { erreur: "Cette adresse email ne semble pas valide.", valeurs };
  if (motDePasse.length < 10) return { erreur: "Le mot de passe doit contenir au moins 10 caractères.", valeurs };
  if (nom.length < 2 || nom.length > 150) return { erreur: "Indiquez le nom de votre organisme.", valeurs };
  // En plus de l'anti-robots : 10 inscriptions par adresse IP et par heure.
  const r = regles("inscription", null, await ipVisiteur(), 0, 10, 60);
  if (await limiteAtteinte(r)) return { erreur: MESSAGE_LIMITE, valeurs };
  await noterTentative(r);
  const h = await headers();
  if (
    !(await verifierTurnstile(
      donnees.get("cf-turnstile-response") as string | null,
      h.get("x-forwarded-for")?.split(",")[0] ?? null,
    ))
  )
    return { erreur: "La vérification anti-robots a échoué. Réessayez.", valeurs };
  const supabase = await supabaseServeur();
  const { data, error } = await supabase.auth.signUp({
    email,
    password: motDePasse,
    options: { data: { nom_organisme: nom }, emailRedirectTo: `${await origineEspace()}/auth/confirm/` },
  });
  if (error) {
    console.error("Inscription :", error.message);
    if (/password/i.test(error.message))
      return { erreur: "Ce mot de passe est trop faible. Choisissez-en un plus long.", valeurs };
    return { erreur: "L'inscription a échoué. Réessayez dans un instant.", valeurs };
  }
  // Adresse déjà inscrite : Supabase ne le dit pas (protection) et renvoie un compte sans identité.
  if (!data.user?.identities?.length)
    return {
      erreur:
        "Un compte existe peut-être déjà avec cette adresse. Connectez-vous, ou utilisez « Mot de passe oublié ».",
      valeurs,
    };
  // Nouveau compte : connexion immédiate (connexion autorisée avant validation de l'email).
  if (!data.session) {
    const { error: e } = await supabase.auth.signInWithPassword({ email, password: motDePasse });
    if (e) {
      console.error("Connexion après inscription :", e.message);
      return { erreur: "Votre compte est créé. Connectez-vous pour continuer.", valeurs };
    }
  }
  // Email de validation envoyé par l'application ; un échec d'envoi ne bloque pas l'accès (renvoi possible).
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) await envoyerLien(user.id, "validation", email);
  return { vers: "/bienvenue/1/" };
}
