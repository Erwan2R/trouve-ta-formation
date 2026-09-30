"use server";

import { revalidatePath } from "next/cache";
import { EMAILS_RAPPEL, TYPES_RAPPEL, type TypeRappel } from "@/contenu/admin/emails";
import { exigerAdmin } from "@/lib/admin-serveur";
import { envoyerEmail } from "@/lib/email/resend";
import { URL_ESPACE_ORGANISME } from "@/lib/espace";
import { supabaseAdmin } from "@/lib/supabase/serveur";

export type RetourModeration = { ok: true; message: string } | { ok: false; erreur: string };
const ECHEC = "L'opération a échoué. Réessayez dans un instant.";

async function lireOrganisme(id: string) {
  const { data } = await supabaseAdmin()
    .from("organismes")
    .select("id, nom, statut, comptes_organisme (id)")
    .eq("id", id)
    .maybeSingle();
  return data;
}

// Suspension et suppression changent ce que montre le site public : toutes les pages sont régénérées.
const rafraichirSitePublic = () => revalidatePath("/", "layout");

/** Rappel manuel : email fixe à l'adresse de connexion, type choisi explicitement (pas de valeur par défaut). */
export async function envoyerRappel(id: string, type: TypeRappel): Promise<RetourModeration> {
  await exigerAdmin();
  const libelle = TYPES_RAPPEL.find((t) => t.type === type)?.libelle;
  if (!libelle) return { ok: false, erreur: "Choisissez un type de rappel." };
  const org = await lireOrganisme(id);
  if (!org?.comptes_organisme) return { ok: false, erreur: "Cet organisme n'a pas de compte de connexion." };
  const admin = supabaseAdmin();
  const { data: u } = await admin.auth.admin.getUserById(org.comptes_organisme.id);
  if (!u.user?.email) return { ok: false, erreur: ECHEC };
  const email = EMAILS_RAPPEL[type](org.nom, URL_ESPACE_ORGANISME);
  if (!(await envoyerEmail({ a: u.user.email, ...email })))
    return { ok: false, erreur: "L'envoi a échoué. Réessayez." };
  await admin.from("rappels_organisme").insert({ organisme_id: id, type });
  revalidatePath(`/admin/organismes/${id}/`);
  return { ok: true, message: `${libelle} envoyé à ${org.nom}.` };
}

/**
 * Suspension réversible (UX Fichier client §5) : la fiche quitte le site public, le compte reste connectable et
 * voit un bandeau (décision Erwan). Réactivation : la publication est recalculée comme après un enregistrement.
 */
export async function basculerSuspension(id: string): Promise<RetourModeration> {
  await exigerAdmin();
  const org = await lireOrganisme(id);
  if (!org) return { ok: false, erreur: ECHEC };
  const admin = supabaseAdmin();
  const suspendre = org.statut !== "suspendu";
  const { error } = await admin
    .from("organismes")
    .update({ statut: suspendre ? "suspendu" : "brouillon" })
    .eq("id", id);
  if (error) {
    console.error("Suspension :", error.message);
    return { ok: false, erreur: ECHEC };
  }
  if (!suspendre) await admin.rpc("maj_publication_organisme", { p_org: id });
  rafraichirSitePublic();
  return { ok: true, message: suspendre ? `${org.nom} suspendu. La fiche est dépubliée.` : `${org.nom} réactivé.` };
}

/** Suppression définitive, confirmée par la saisie exacte du nom (même règle que Paramètres organisme). */
export async function supprimerOrganisme(id: string, confirmation: string): Promise<RetourModeration> {
  await exigerAdmin();
  const org = await lireOrganisme(id);
  if (!org) return { ok: false, erreur: ECHEC };
  if (confirmation.trim() !== org.nom.trim())
    return { ok: false, erreur: "Saisissez exactement le nom de l'organisme." };
  const admin = supabaseAdmin();
  const { data: fichiers } = await admin.storage.from("logos").list(id);
  if (fichiers?.length) await admin.storage.from("logos").remove(fichiers.map((f) => `${id}/${f.name}`));
  // Avec un compte : sa suppression emporte l'organisme (déclencheur). Sans compte : fiche créée en base.
  const { error } = org.comptes_organisme
    ? await admin.auth.admin.deleteUser(org.comptes_organisme.id)
    : await admin.from("organismes").delete().eq("id", id);
  if (error) {
    console.error("Suppression :", error.message);
    return { ok: false, erreur: ECHEC };
  }
  rafraichirSitePublic();
  return { ok: true, message: `${org.nom} supprimé.` };
}
