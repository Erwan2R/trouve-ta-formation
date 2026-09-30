"use server";

import { revalidatePath } from "next/cache";
import { exigerAdmin } from "@/lib/admin-serveur";
import {
  analyserCsv,
  clesContact,
  domaine,
  empreinte,
  empreintesDe,
  type ProspectImport,
  type ReponseRechercheEntreprises,
  siretSansAmbiguite,
} from "@/lib/prospection";
import { supabaseAdmin } from "@/lib/supabase/serveur";
import type { Enums } from "@/lib/supabase/types";

const ECHEC = "L'opération a échoué. Réessayez dans un instant.";

export type CompteRendu = {
  ajoutes: number;
  misAJour: number;
  exclus: number;
  siretRetrouves: number;
  sansSiret: number;
  ignorees: number;
  emails: number;
  emailsPersonnels: number;
};

async function empreintesExclues(): Promise<Set<string>> {
  const { data } = await supabaseAdmin().from("exclusions_prospection").select("empreinte");
  return new Set((data ?? []).map((e) => e.empreinte));
}

const pause = (ms: number) => new Promise((ok) => setTimeout(ok, ms));

/**
 * API publique Recherche d'entreprises : un appel par ligne sans SIRET, espacés ; en cas de limite de débit (429),
 * nouvelles tentatives de plus en plus espacées. Aucune réponse exploitable : la ligne reste « SIRET manquant ».
 */
async function chercherSiret(nom: string, cp: string): Promise<string | null> {
  const url = `https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(nom)}&code_postal=${cp}&per_page=5`;
  for (let essai = 1; essai <= 4; essai++) {
    const r = await fetch(url, { signal: AbortSignal.timeout(8000) }).catch(() => null);
    await pause(r?.status === 429 ? 1500 * essai : 350);
    if (r?.status === 429) continue;
    if (!r?.ok) return null;
    return siretSansAmbiguite((await r.json()) as ReponseRechercheEntreprises, nom, cp);
  }
  return null;
}

/**
 * Import du CSV du scraping (décisions Erwan 01/10/2026) :
 * 1. lignes sans SIRET ni SIREN : SIRET cherché par l'API Recherche d'entreprises, retenu seulement sans ambiguïté ;
 * 2. liste d'exclusion appliquée avant toute écriture (SIRET, SIREN, email, domaine : toujours actifs) ;
 * 3. dédoublonnage : par identifiant, sinon par email, domaine ou téléphone ; un prospect connu garde son statut.
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

  let siretRetrouves = 0;
  for (const p of analyse.prospects) {
    if (p.identifiant || !p.codePostal) continue;
    const siret = await chercherSiret(p.nom, p.codePostal);
    if (!siret) continue;
    Object.assign(p, { identifiant: siret, siret, siren: siret.slice(0, 9) });
    siretRetrouves++;
  }
  // Un SIRET retrouvé peut être celui d'une autre ligne du fichier : une seule ligne par identifiant.
  const vus = new Set<string>();
  const lignes = analyse.prospects.filter((p) => !p.identifiant || (!vus.has(p.identifiant) && vus.add(p.identifiant)));

  const exclues = await empreintesExclues();
  const admis = lignes.filter((p) => !empreintesDe(p).some((e) => exclues.has(e)));
  const admin = supabaseAdmin();
  const [{ data: connus }, { data: inscrits }] = await Promise.all([
    admin.from("prospects").select("id, identifiant, email, site_web, telephone"),
    admin
      .from("organismes")
      .select("siret")
      .in(
        "siret",
        admis.flatMap((p) => (p.siret ? [p.siret] : [])),
      ),
  ]);
  const existants = connus ?? [];
  const sirets = new Set((inscrits ?? []).map((o) => o.siret));
  const retrouver = (p: (typeof admis)[number]) => {
    const parId = p.identifiant && existants.find((e) => e.identifiant === p.identifiant);
    if (parId) return parId;
    const cles = clesContact(p);
    // Un prospect identifié ne fusionne qu'avec un prospect encore sans SIRET (jamais deux SIRET différents).
    return existants.find((e) => (!p.identifiant || !e.identifiant) && clesContact(e).some((k) => cles.includes(k)));
  };

  const nouveaux: ProspectImport[] = [];
  const miseAJour: { id: number; p: ProspectImport }[] = [];
  for (const { codePostal: _cp, ...p } of admis) {
    const e = retrouver({ ...p, codePostal: null });
    if (e) miseAJour.push({ id: e.id, p });
    else nouveaux.push(p);
  }
  const erreurs = [
    nouveaux.length
      ? (
          await admin.from("prospects").insert(
            nouveaux.map((p) => ({
              ...p,
              statut: p.siret && sirets.has(p.siret) ? ("inscrit" as const) : ("a_contacter" as const),
            })),
          )
        ).error
      : null,
    ...(
      await Promise.all(
        // Coordonnées mises à jour, statut conservé ; un SIRET déjà connu n'est jamais effacé par une ligne sans SIRET.
        miseAJour.map(({ id, p }) => {
          const { identifiant, siret, siren, ...reste } = p;
          return admin
            .from("prospects")
            .update(identifiant ? { ...reste, identifiant, siret, siren } : reste)
            .eq("id", id);
        }),
      )
    ).map((r) => r.error),
  ].filter(Boolean);
  if (erreurs.length) {
    console.error("Import prospection :", erreurs[0]?.message);
    return { ok: false, erreur: ECHEC };
  }
  revalidatePath("/admin/prospection/");
  return {
    ok: true,
    compteRendu: {
      ajoutes: nouveaux.length,
      misAJour: miseAJour.length,
      exclus: lignes.length - admis.length,
      siretRetrouves,
      sansSiret: admis.filter((p) => !p.identifiant).length,
      ignorees: analyse.ignorees,
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
      ...(p.siren ? [{ type: "siren" as const, empreinte: empreinte("siren", p.siren) }] : []),
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
