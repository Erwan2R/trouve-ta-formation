"use server";

import sharp from "sharp";
import * as V from "@/lib/organismes/validation";
import { apresEnregistrement, type Retour } from "@/lib/supabase/queries/apres-enregistrement";
import { getEspaceFrais } from "@/lib/supabase/queries/espace";
import type { TablesUpdate } from "@/lib/supabase/types";

/** Première erreur de validation, ou les valeurs validées. */
function valider<T extends Record<string, V.Resultat<unknown>>>(
  champs: T,
):
  | { ok: false; erreur: string }
  | { ok: true; valeurs: { [K in keyof T]: T[K] extends V.Resultat<infer U> ? U : never } } {
  for (const r of Object.values(champs)) if (!r.ok) return { ok: false, erreur: r.erreur };
  return {
    ok: true,
    valeurs: Object.fromEntries(
      Object.entries(champs).map(([k, r]) => [k, (r as { valeur: unknown }).valeur]),
    ) as never,
  };
}

async function majFiche(maj: TablesUpdate<"organismes">): Promise<Retour> {
  const { supabase, organisme } = await getEspaceFrais();
  const { error } = await supabase.from("organismes").update(maj).eq("id", organisme.id);
  if (error) {
    console.error("Enregistrement de la fiche :", error.message);
    return { ok: false, erreur: "L'enregistrement a échoué. Réessayez dans un instant." };
  }
  return apresEnregistrement();
}

export async function enregistrerIdentite(d: {
  nom: string;
  raison_sociale: string;
  siret: string;
  numero_declaration_activite: string;
  annee_creation: string;
}): Promise<Retour> {
  if (!d.nom.trim())
    return { ok: false, erreur: "Le nom de l'organisme est obligatoire : il apparaît sur votre fiche." };
  const v = valider({
    nom: V.texte(d.nom, 150, "Nom"),
    raison_sociale: V.texte(d.raison_sociale, 200, "Raison sociale"),
    siret: V.siret(d.siret),
    numero_declaration_activite: V.texte(d.numero_declaration_activite, 30, "Numéro de déclaration d'activité"),
    annee_creation: V.annee(d.annee_creation),
  });
  if (!v.ok) return v;
  return majFiche({ ...v.valeurs, nom: v.valeurs.nom! });
}

export async function enregistrerAgrement(d: {
  numero_agrement_cnaps: string;
  qualiopi: boolean;
  numero_qualiopi: string;
}): Promise<Retour> {
  const v = valider({
    numero_agrement_cnaps: V.texte(d.numero_agrement_cnaps, 60, "Numéro d'agrément"),
    numero_qualiopi: V.texte(d.numero_qualiopi, 60, "Numéro de certificat"),
  });
  if (!v.ok) return v;
  return majFiche({
    ...v.valeurs,
    qualiopi: d.qualiopi,
    numero_qualiopi: d.qualiopi ? v.valeurs.numero_qualiopi : null,
  });
}

export async function enregistrerCoordonnees(d: {
  adresse: string;
  code_postal: string;
  ville: string;
  telephone: string;
  site_web: string;
  email_contact: string;
  horaires: string;
}): Promise<Retour> {
  const v = valider({
    adresse: V.texte(d.adresse, 200, "Adresse"),
    code_postal: V.codePostal(d.code_postal),
    ville: V.texte(d.ville, 100, "Ville"),
    telephone: V.telephone(d.telephone),
    site_web: V.siteWeb(d.site_web),
    email_contact: V.email(d.email_contact),
    horaires: V.texte(d.horaires, 200, "Horaires"),
  });
  if (!v.ok) return v;
  const { adresse, code_postal, ville, ...fiche } = v.valeurs;
  const adresseSaisie = adresse || code_postal || ville;
  if (adresseSaisie && !(adresse && code_postal && ville))
    return { ok: false, erreur: "Complétez l'adresse du siège : rue, code postal et ville." };

  const { supabase, organisme, siege } = await getEspaceFrais();
  if (adresseSaisie) {
    const lieu = { adresse: adresse!, code_postal: code_postal!, ville: ville! };
    const { error } = siege
      ? await supabase.from("lieux").update(lieu).eq("id", siege.id)
      : await supabase.from("lieux").insert({ ...lieu, organisme_id: organisme.id, est_siege: true });
    if (error) {
      console.error("Enregistrement du siège :", error.message);
      return { ok: false, erreur: "L'enregistrement a échoué. Réessayez dans un instant." };
    }
  }
  return majFiche(fiche);
}

export type LieuSaisi = { id: number | null; nom: string; adresse: string; code_postal: string; ville: string };

/** Lieux additionnels : la liste saisie remplace l'existante. Un lieu retiré détache ses formations (retour au siège). */
export async function enregistrerLieux(saisis: LieuSaisi[]): Promise<Retour> {
  const lieux = [];
  for (const [i, l] of saisis.entries()) {
    const v = valider({
      nom: V.texte(l.nom, 100, "Nom du lieu"),
      adresse: V.texte(l.adresse, 200, "Adresse"),
      code_postal: V.codePostal(l.code_postal),
      ville: V.texte(l.ville, 100, "Ville"),
    });
    if (!v.ok) return { ok: false, erreur: `Lieu ${i + 1} — ${v.erreur}` };
    const { adresse, code_postal, ville } = v.valeurs;
    if (!adresse || !code_postal || !ville)
      return { ok: false, erreur: `Lieu ${i + 1} : indiquez la rue, le code postal et la ville.` };
    lieux.push({ id: l.id, nom: v.valeurs.nom, adresse, code_postal, ville });
  }
  const { supabase, organisme, lieux: actuels } = await getEspaceFrais();
  const additionnels = actuels.filter((l) => !l.est_siege);
  const gardes = new Set(lieux.map((l) => l.id).filter((id) => id !== null));
  const retires = additionnels.filter((l) => !gardes.has(l.id)).map((l) => l.id);
  const erreurs = [
    retires.length ? (await supabase.from("lieux").delete().in("id", retires)).error : null,
    ...(await Promise.all(
      lieux.map(async ({ id, ...l }) =>
        id !== null && additionnels.some((a) => a.id === id)
          ? (await supabase.from("lieux").update(l).eq("id", id)).error
          : (await supabase.from("lieux").insert({ ...l, organisme_id: organisme.id, est_siege: false })).error,
      ),
    )),
  ].filter(Boolean);
  if (erreurs.length) {
    console.error("Enregistrement des lieux :", erreurs[0]!.message);
    return { ok: false, erreur: "L'enregistrement a échoué. Réessayez dans un instant." };
  }
  return apresEnregistrement();
}

export async function enregistrerPratique(d: { accessibilite_pmr: boolean; langues: string[] }): Promise<Retour> {
  return majFiche({ accessibilite_pmr: d.accessibilite_pmr, langues: V.langues(d.langues) });
}

export async function enregistrerPresentation(d: { presentation: string }): Promise<Retour> {
  const v = V.presentation(d.presentation);
  if (!v.ok) return v;
  return majFiche({ presentation: v.valeur });
}

/** Logo : JPG ou PNG de 2 Mo au plus, converti en WebP carré côté serveur (UX Ma fiche §3.2). */
export async function deposerLogo(donnees: FormData): Promise<Retour> {
  const fichier = donnees.get("logo");
  if (!(fichier instanceof File) || fichier.size === 0) return { ok: false, erreur: "Choisissez un fichier." };
  if (!/^image\/(png|jpeg)$/.test(fichier.type))
    return { ok: false, erreur: "Ce format n'est pas accepté. Choisissez un fichier JPG ou PNG." };
  if (fichier.size > 2 * 1024 * 1024) return { ok: false, erreur: "Ce fichier dépasse 2 Mo." };
  let webp: Buffer;
  try {
    webp = await sharp(Buffer.from(await fichier.arrayBuffer()))
      .resize(400, 400, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .webp({ quality: 85 })
      .toBuffer();
  } catch {
    return { ok: false, erreur: "Ce fichier n'a pas pu être lu comme une image." };
  }
  const { supabase, organisme } = await getEspaceFrais();
  const chemin = `${organisme.id}/logo-${Date.now()}.webp`;
  const { error } = await supabase.storage.from("logos").upload(chemin, webp, { contentType: "image/webp" });
  if (error) {
    console.error("Dépôt du logo :", error.message);
    return { ok: false, erreur: "L'envoi a échoué. Réessayez dans un instant." };
  }
  await supprimerAnciensLogos(chemin);
  const url = supabase.storage.from("logos").getPublicUrl(chemin).data.publicUrl;
  return majFiche({ logo_url: url });
}

export async function retirerLogo(): Promise<Retour> {
  await supprimerAnciensLogos(null);
  return majFiche({ logo_url: null });
}

async function supprimerAnciensLogos(sauf: string | null) {
  const { supabase, organisme } = await getEspaceFrais();
  const { data } = await supabase.storage.from("logos").list(organisme.id);
  const anciens = (data ?? []).map((f) => `${organisme.id}/${f.name}`).filter((c) => c !== sauf);
  if (anciens.length) await supabase.storage.from("logos").remove(anciens);
}

export type DonneesSirene = { raison_sociale: string; adresse: string; code_postal: string; ville: string };

const PETITS = new Set(["de", "du", "des", "la", "le", "les", "et", "sur", "en", "aux", "au"]);
/** « 14 RUE DE LA REPUBLIQUE » → « 14 Rue de la Republique ». */
const casse = (s: string) =>
  s
    .toLowerCase()
    .split(" ")
    .map((m, i) => (i > 0 && PETITS.has(m) ? m : m.charAt(0).toUpperCase() + m.slice(1)))
    .join(" ");

/** Pré-remplissage depuis le SIRET (API Recherche d'entreprises, publique et sans clé). */
export async function chercherSiret(
  saisie: string,
): Promise<{ ok: true; donnees: DonneesSirene } | { ok: false; erreur: string }> {
  const s = V.siret(saisie);
  if (!s.ok || !s.valeur) return { ok: false, erreur: "Saisissez les 14 chiffres du SIRET." };
  try {
    const r = await fetch(`https://recherche-entreprises.api.gouv.fr/search?q=${s.valeur}&per_page=1`, {
      signal: AbortSignal.timeout(8000),
    });
    const res = (await r.json()).results?.[0];
    const etab =
      res?.matching_etablissements?.find((e: { siret: string }) => e.siret === s.valeur) ??
      (res?.siege?.siret === s.valeur ? res.siege : null);
    if (!res || !etab) return { ok: false, erreur: "Aucun établissement trouvé pour ce SIRET." };
    const rue = String(etab.adresse ?? "")
      .replace(new RegExp(`\\s*${etab.code_postal}.*$`), "")
      .trim();
    return {
      ok: true,
      donnees: {
        raison_sociale: casse(res.nom_raison_sociale ?? res.nom_complet ?? ""),
        adresse: casse(rue),
        code_postal: etab.code_postal ?? "",
        ville: casse(etab.libelle_commune ?? ""),
      },
    };
  } catch {
    return { ok: false, erreur: "Le service de recherche ne répond pas. Réessayez dans un instant." };
  }
}
