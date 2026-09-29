"use server";

import { FINANCEMENTS, RYTHMES } from "@/lib/organismes/libelles";
import * as V from "@/lib/organismes/validation";
import { apresEnregistrement, type Retour } from "@/lib/supabase/queries/apres-enregistrement";
import { getEspaceFrais } from "@/lib/supabase/queries/espace";

const ECHEC = "L'enregistrement a échoué. Réessayez dans un instant.";

/** Coche d'abord, détaille ensuite (UX Mes formations §4) : chaque titre coché crée une offre « À compléter ». */
export async function ajouterOffres(titreIds: number[]): Promise<Retour> {
  const { supabase, organisme, offres } = await getEspaceFrais();
  const deja = new Set(offres.map((o) => o.titre.id));
  const nouveaux = [...new Set(titreIds)].filter((id) => Number.isInteger(id) && !deja.has(id));
  if (!nouveaux.length) return { ok: false, erreur: "Sélectionnez au moins un titre." };
  // Slug de l'offre = slug du titre, stocké et jamais recalculé. RLS : titre actif du référentiel uniquement.
  const { data: titres } = await supabase
    .from("titres_referentiel")
    .select("id, slug")
    .eq("statut", "actif")
    .in("id", nouveaux);
  if (!titres?.length) return { ok: false, erreur: ECHEC };
  const { error } = await supabase
    .from("organisme_titres")
    .insert(titres.map((t) => ({ organisme_id: organisme.id, titre_id: t.id, slug: t.slug })));
  if (error) {
    console.error("Ajout d'offres :", error.message);
    return { ok: false, erreur: ECHEC };
  }
  return apresEnregistrement();
}

export type DetailOffre = {
  id: string;
  prixMin: string;
  prixMax: string;
  duree: string;
  rythmes: string[];
  financements: string[];
  lieux: number[];
};

export async function enregistrerOffre(d: DetailOffre): Promise<Retour> {
  const min = V.montant(d.prixMin);
  const max = V.montant(d.prixMax);
  if (!min.ok) return min;
  if (!max.ok) return max;
  const prixMin = min.valeur ?? max.valeur;
  const prixMax = min.valeur !== null && max.valeur !== null && max.valeur !== min.valeur ? max.valeur : null;
  if (prixMin !== null && prixMax !== null && prixMax < prixMin)
    return { ok: false, erreur: "Le prix maximum doit être supérieur au prix minimum." };
  const duree = d.duree.trim() === "" ? null : Number(d.duree);
  if (duree !== null && !(Number.isInteger(duree) && duree > 0 && duree < 5000))
    return { ok: false, erreur: "Indiquez une durée en heures." };

  const { supabase, offres, lieux } = await getEspaceFrais();
  const offre = offres.find((o) => o.id === d.id);
  if (!offre) return { ok: false, erreur: ECHEC };
  const { error } = await supabase
    .from("organisme_titres")
    .update({
      prix_min: prixMin,
      prix_max: prixMax,
      duree_heures: duree,
      rythmes: Object.keys(RYTHMES).filter((r) => d.rythmes.includes(r)),
      financements: Object.keys(FINANCEMENTS).filter((f) => d.financements.includes(f)),
    })
    .eq("id", d.id);
  if (error) {
    console.error("Enregistrement d'une offre :", error.message);
    return { ok: false, erreur: ECHEC };
  }
  // Lieux de rattachement : aucun = siège (UX Mes formations §5, mono-site silencieux).
  const ids = new Set(lieux.map((l) => l.id));
  const choisis = [...new Set(d.lieux)].filter((id) => ids.has(id));
  await supabase.from("offre_lieux").delete().eq("offre_id", d.id);
  if (choisis.length) {
    const { error: e } = await supabase
      .from("offre_lieux")
      .insert(choisis.map((lieu_id) => ({ offre_id: d.id, lieu_id })));
    if (e) {
      console.error("Rattachement des lieux :", e.message);
      return { ok: false, erreur: ECHEC };
    }
  }
  return apresEnregistrement();
}

export async function retirerOffre(id: string): Promise<Retour> {
  const { supabase } = await getEspaceFrais();
  const { error } = await supabase.from("organisme_titres").delete().eq("id", id);
  if (error) {
    console.error("Retrait d'une offre :", error.message);
    return { ok: false, erreur: ECHEC };
  }
  return apresEnregistrement();
}

/** « Votre titre n'est pas dans la liste ? » : demande arbitrée par l'admin, jamais une saisie libre d'offre. */
export async function demanderTitre(intitule: string): Promise<Retour> {
  const t = intitule.trim().replace(/\s+/g, " ");
  if (t.length < 2 || t.length > 150)
    return { ok: false, erreur: "Indiquez l'intitulé du titre (150 caractères maximum)." };
  const { supabase, organisme } = await getEspaceFrais();
  const { error } = await supabase.from("demandes_titre").insert({ organisme_id: organisme.id, intitule: t });
  if (error) {
    console.error("Demande de titre :", error.message);
    return { ok: false, erreur: ECHEC };
  }
  return { ok: true, heure: "" };
}
