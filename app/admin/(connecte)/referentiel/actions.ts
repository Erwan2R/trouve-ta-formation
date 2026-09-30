"use server";

import { revalidatePath } from "next/cache";
import { EMAIL_DEMANDE_ACCEPTEE, EMAIL_DEMANDE_REFUSEE } from "@/contenu/admin/emails";
import { exigerAdmin } from "@/lib/admin-serveur";
import { envoyerEmail } from "@/lib/email/resend";
import { URL_ESPACE_ORGANISME } from "@/lib/espace";
import { intituleDejaPris, slugIndisponible, slugTitre } from "@/lib/referentiel-admin";
import { supabaseAdmin } from "@/lib/supabase/serveur";

export type RetourReferentiel = { ok: true; message: string } | { ok: false; erreur: string };
type Saisie = { intitule: string; categorie: string };
const ECHEC = "L'opération a échoué. Réessayez dans un instant.";

// Un titre alimente Mes formations, les filtres, le catalogue et les fiches : tout le site est régénéré.
const rafraichir = () => revalidatePath("/", "layout");

async function verifier(s: Saisie, sauf?: number) {
  const intitule = s.intitule.replace(/\s+/g, " ").trim();
  const { data } = await supabaseAdmin()
    .from("titres_referentiel")
    .select("id, slug, libelle_court, libelle_long, categorie");
  const tous = data ?? [];
  if (intitule.length < 2 || intitule.length > 80)
    return { ok: false as const, erreur: "L'intitulé compte de 2 à 80 caractères." };
  if (!tous.some((t) => t.categorie === s.categorie))
    return { ok: false as const, erreur: "Choisissez une catégorie." };
  if (intituleDejaPris(intitule, tous, sauf))
    return { ok: false as const, erreur: "Un titre porte déjà cet intitulé." };
  return { ok: true as const, intitule, tous };
}

/** Création (ajout direct ou demande acceptée) : slug définitif, jamais réservé ni pris par un titre ou une zone géo. */
async function creerTitre(s: Saisie): Promise<{ ok: true; intitule: string } | { ok: false; erreur: string }> {
  const v = await verifier(s);
  if (!v.ok) return v;
  const admin = supabaseAdmin();
  const slug = slugTitre(v.intitule);
  const [{ count: departement }, { count: ville }, { data: dernier }] = await Promise.all([
    admin.from("departements").select("code", { count: "exact", head: true }).eq("slug", slug),
    admin.from("villes").select("id", { count: "exact", head: true }).eq("slug", slug),
    admin.from("titres_referentiel").select("ordre").order("ordre", { ascending: false }).limit(1).maybeSingle(),
  ]);
  if (slugIndisponible(slug, v.tous) || departement || ville)
    return { ok: false, erreur: "Slug déjà pris ou réservé." };
  // Libellé long provisoire = intitulé : il s'affiche sur les fiches ; il sera rédigé avec la page pilier.
  const { error } = await admin.from("titres_referentiel").insert({
    slug,
    libelle_court: v.intitule,
    libelle_long: v.intitule,
    categorie: s.categorie,
    ordre: (dernier?.ordre ?? 0) + 1,
  });
  if (error) {
    console.error("Création de titre :", error.message);
    return { ok: false, erreur: ECHEC };
  }
  return { ok: true, intitule: v.intitule };
}

export async function ajouterTitre(s: Saisie): Promise<RetourReferentiel> {
  await exigerAdmin();
  const r = await creerTitre(s);
  if (!r.ok) return r;
  rafraichir();
  return { ok: true, message: `« ${r.intitule} » ajouté au référentiel, catégorie ${s.categorie}.` };
}

/** Intitulé et catégorie seulement : le slug (URL de la page pilier) ne change jamais. Aucune suppression. */
export async function modifierTitre(id: number, s: Saisie): Promise<RetourReferentiel> {
  await exigerAdmin();
  const v = await verifier(s, id);
  if (!v.ok) return v;
  const avant = v.tous.find((t) => t.id === id);
  if (!avant) return { ok: false, erreur: ECHEC };
  const admin = supabaseAdmin();
  const { error } = await admin
    .from("titres_referentiel")
    .update({
      libelle_court: v.intitule,
      categorie: s.categorie,
      // Libellé long encore provisoire (identique à l'intitulé) : il suit la correction.
      ...(avant.libelle_long === avant.libelle_court ? { libelle_long: v.intitule } : {}),
    })
    .eq("id", id);
  if (error) {
    console.error("Modification de titre :", error.message);
    return { ok: false, erreur: ECHEC };
  }
  const { count } = await admin
    .from("organisme_titres")
    .select("id", { count: "exact", head: true })
    .eq("titre_id", id);
  rafraichir();
  return {
    ok: true,
    message: `« ${v.intitule} » mis à jour${count ? ` sur les offres de ${count} organisme${count > 1 ? "s" : ""}` : ""} et sur la page pilier.`,
  };
}

async function lireDemande(id: number) {
  const admin = supabaseAdmin();
  const { data: d } = await admin
    .from("demandes_titre")
    .select("id, intitule, statut, organismes (nom, comptes_organisme (id))")
    .eq("id", id)
    .maybeSingle();
  if (!d || d.statut !== "en_attente") return null;
  const compte = d.organismes.comptes_organisme?.id;
  const email = compte ? ((await admin.auth.admin.getUserById(compte)).data.user?.email ?? null) : null;
  return { ...d, email };
}

const clore = (id: number, statut: "acceptee" | "refusee") =>
  supabaseAdmin().from("demandes_titre").update({ statut, traitee_le: new Date().toISOString() }).eq("id", id);

/** Acceptation après relecture : le titre est créé, aucune offre n'est rattachée, l'organisme est prévenu. */
export async function accepterDemande(id: number, s: Saisie): Promise<RetourReferentiel> {
  await exigerAdmin();
  const d = await lireDemande(id);
  if (!d) return { ok: false, erreur: "Cette demande a déjà été traitée." };
  const r = await creerTitre(s);
  if (!r.ok) return r;
  await clore(id, "acceptee");
  const envoye =
    !!d.email &&
    (await envoyerEmail({ a: d.email, ...EMAIL_DEMANDE_ACCEPTEE(d.intitule, r.intitule, URL_ESPACE_ORGANISME) }));
  rafraichir();
  return {
    ok: true,
    message: `« ${r.intitule} » créé dans ${s.categorie}. ${envoye ? `Email d'acceptation envoyé à ${d.organismes.nom}.` : "L'email n'a pas pu partir : prévenez l'organisme."}`,
  };
}

export async function refuserDemande(id: number): Promise<RetourReferentiel> {
  await exigerAdmin();
  const d = await lireDemande(id);
  if (!d) return { ok: false, erreur: "Cette demande a déjà été traitée." };
  await clore(id, "refusee");
  const envoye =
    !!d.email && (await envoyerEmail({ a: d.email, ...EMAIL_DEMANDE_REFUSEE(d.intitule, URL_ESPACE_ORGANISME) }));
  revalidatePath("/admin/referentiel/");
  return {
    ok: true,
    message: envoye
      ? `Demande refusée. Email envoyé à ${d.organismes.nom}.`
      : "Demande refusée. L'email n'a pas pu partir : prévenez l'organisme.",
  };
}

/**
 * Archivage (décisions Erwan, Sprint 3) : jamais de suppression. Remplacé → 301 vers le titre actif final, générée au
 * build : un nouveau build est demandé à Vercel (deploy hook de la branche). Sans remplaçant : la page reste, avec un
 * lien vers le titre proche. Les offres sont conservées, masquées publiquement, signalées dans Mes formations.
 */
export async function archiverTitre(
  id: number,
  d: { remplacePar: number | null; proche: number | null },
): Promise<RetourReferentiel> {
  await exigerAdmin();
  if (d.remplacePar === id || d.proche === id) return { ok: false, erreur: "Choisissez un autre titre." };
  const { data: t, error } = await supabaseAdmin()
    .from("titres_referentiel")
    .update({
      statut: "archive",
      archive_le: new Date().toISOString(),
      remplace_par_id: d.remplacePar,
      titre_proche_id: d.remplacePar ? null : d.proche,
    })
    .eq("id", id)
    .eq("statut", "actif")
    .select("libelle_court")
    .maybeSingle();
  if (error || !t) {
    console.error("Archivage :", error?.message);
    return { ok: false, erreur: ECHEC };
  }
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL;
  const build = hook ? (await fetch(hook, { method: "POST" }).catch(() => null))?.ok : false;
  rafraichir();
  return {
    ok: true,
    message: `« ${t.libelle_court} » archivé.${d.remplacePar ? (build ? " La redirection définitive sera en place après le nouveau build (quelques minutes)." : " Redirection temporaire en place ; la définitive viendra au prochain build.") : ""}`,
  };
}
