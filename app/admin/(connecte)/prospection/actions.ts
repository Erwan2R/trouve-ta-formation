"use server";

import { revalidatePath } from "next/cache";
import { exigerAdmin } from "@/lib/admin-serveur";
import { analyserCsv, domaine, empreinte, empreintesDe } from "@/lib/prospection";
import { supabaseAdmin } from "@/lib/supabase/serveur";
import type { Enums } from "@/lib/supabase/types";

const ECHEC = "L'opération a échoué. Réessayez dans un instant.";

export type CompteRendu = {
  ajoutes: number;
  misAJour: number;
  exclus: number;
  sansIdentifiant: number;
  emails: number;
  emailsPersonnels: number;
};

async function empreintesExclues(): Promise<Set<string>> {
  const { data } = await supabaseAdmin().from("exclusions_prospection").select("empreinte");
  return new Set((data ?? []).map((e) => e.empreinte));
}

/**
 * Import du CSV du scraping. Les organismes de la liste d'exclusion sont écartés avant toute écriture ; un prospect
 * déjà connu garde son statut (seules ses coordonnées sont mises à jour).
 */
export async function importerProspects(
  donnees: FormData,
): Promise<{ ok: true; compteRendu: CompteRendu } | { ok: false; erreur: string }> {
  await exigerAdmin();
  const fichier = donnees.get("fichier");
  if (!(fichier instanceof File) || fichier.size === 0) return { ok: false, erreur: "Choisissez un fichier CSV." };
  if (fichier.size > 5 * 1024 * 1024) return { ok: false, erreur: "Fichier trop volumineux (5 Mo au plus)." };
  const analyse = analyserCsv(await fichier.text());
  if ("erreur" in analyse) return { ok: false, erreur: analyse.erreur ?? ECHEC };

  const exclues = await empreintesExclues();
  const admis = analyse.prospects.filter((p) => !empreintesDe(p).some((e) => exclues.has(e)));
  const admin = supabaseAdmin();
  const identifiants = admis.map((p) => p.identifiant);
  const [{ data: connus }, { data: inscrits }] = await Promise.all([
    admin.from("prospects").select("identifiant").in("identifiant", identifiants),
    admin
      .from("organismes")
      .select("siret")
      .in(
        "siret",
        admis.flatMap((p) => (p.siret ? [p.siret] : [])),
      ),
  ]);
  const dejaConnus = new Set((connus ?? []).map((c) => c.identifiant));
  const sirets = new Set((inscrits ?? []).map((o) => o.siret));
  const nouveaux = admis.filter((p) => !dejaConnus.has(p.identifiant));
  const existants = admis.filter((p) => dejaConnus.has(p.identifiant));

  const [a, b] = await Promise.all([
    nouveaux.length
      ? admin
          .from("prospects")
          .insert(
            nouveaux.map((p) => ({
              ...p,
              statut: p.siret && sirets.has(p.siret) ? ("inscrit" as const) : ("a_contacter" as const),
            })),
          )
      : { error: null },
    existants.length ? admin.from("prospects").upsert(existants, { onConflict: "identifiant" }) : { error: null },
  ]);
  if (a.error || b.error) {
    console.error("Import prospection :", a.error?.message ?? b.error?.message);
    return { ok: false, erreur: ECHEC };
  }
  revalidatePath("/admin/prospection/");
  return {
    ok: true,
    compteRendu: {
      ajoutes: nouveaux.length,
      misAJour: existants.length,
      exclus: analyse.prospects.length - admis.length,
      sansIdentifiant: analyse.sansIdentifiant,
      emails: analyse.emails,
      emailsPersonnels: analyse.emailsPersonnels,
    },
  };
}

export async function changerStatut(id: number, statut: Enums<"statut_prospect">): Promise<{ ok: boolean }> {
  await exigerAdmin();
  const { error } = await supabaseAdmin().from("prospects").update({ statut }).eq("id", id);
  return { ok: !error };
}

/**
 * Demande de suppression : les identifiants (SIRET, SIREN, email, domaine du site) entrent dans la liste d'exclusion
 * sous forme d'empreintes, et tous les prospects correspondants sont effacés. Aucun import ne pourra les réintégrer.
 * Depuis une ligne (`id`) ou saisie à la main (demande reçue pour un organisme absent du fichier).
 */
export async function enregistrerSuppression(
  d: { id: number } | { siret?: string; email?: string; site?: string },
): Promise<{ ok: true; message: string } | { ok: false; erreur: string }> {
  await exigerAdmin();
  const admin = supabaseAdmin();
  let empreintes: { type: "siret" | "siren" | "email" | "domaine"; empreinte: string }[];
  if ("id" in d) {
    const { data: p } = await admin
      .from("prospects")
      .select("siret, siren, email, site_web")
      .eq("id", d.id)
      .maybeSingle();
    if (!p) return { ok: false, erreur: ECHEC };
    const dom = domaine(p.site_web);
    empreintes = [
      ...(p.siret ? [{ type: "siret" as const, empreinte: empreinte("siret", p.siret) }] : []),
      { type: "siren" as const, empreinte: empreinte("siren", p.siren) },
      ...(p.email ? [{ type: "email" as const, empreinte: empreinte("email", p.email) }] : []),
      ...(dom ? [{ type: "domaine" as const, empreinte: empreinte("domaine", dom) }] : []),
    ];
  } else {
    const n = (d.siret ?? "").replace(/\D/g, "");
    const email = d.email?.trim().toLowerCase();
    const dom = domaine(d.site);
    if (n && n.length !== 9 && n.length !== 14)
      return { ok: false, erreur: "Un SIRET compte 14 chiffres, un SIREN 9." };
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return { ok: false, erreur: "Cette adresse email ne semble pas valide." };
    empreintes = [
      ...(n.length === 14 ? [{ type: "siret" as const, empreinte: empreinte("siret", n) }] : []),
      ...(n ? [{ type: "siren" as const, empreinte: empreinte("siren", n.slice(0, 9)) }] : []),
      ...(email ? [{ type: "email" as const, empreinte: empreinte("email", email) }] : []),
      ...(dom ? [{ type: "domaine" as const, empreinte: empreinte("domaine", dom) }] : []),
    ];
    if (!empreintes.length) return { ok: false, erreur: "Indiquez au moins un SIRET, un email ou un site." };
  }
  const { error } = await admin
    .from("exclusions_prospection")
    .upsert(empreintes, { onConflict: "type,empreinte", ignoreDuplicates: true });
  if (error) {
    console.error("Exclusion :", error.message);
    return { ok: false, erreur: ECHEC };
  }
  // Tous les prospects qui partagent un de ces identifiants (autres établissements du même SIREN compris).
  const cibles = new Set(empreintes.map((e) => e.empreinte));
  const { data: tous } = await admin.from("prospects").select("id, siret, siren, email, site_web");
  const aEffacer = (tous ?? []).filter((p) => empreintesDe(p).some((e) => cibles.has(e))).map((p) => p.id);
  if (aEffacer.length) await admin.from("prospects").delete().in("id", aEffacer);
  revalidatePath("/admin/prospection/");
  return {
    ok: true,
    message:
      aEffacer.length === 0
        ? "Demande enregistrée. Aucun prospect correspondant ; ces identifiants ne pourront plus être importés."
        : `Demande enregistrée. ${aEffacer.length === 1 ? "1 prospect effacé" : `${aEffacer.length} prospects effacés`} ; ces identifiants ne pourront plus être importés.`,
  };
}
