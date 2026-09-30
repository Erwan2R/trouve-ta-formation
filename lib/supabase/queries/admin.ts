import "server-only";
import { palier, type Palier } from "@/lib/organismes/completude";
import { departementDuCodePostal } from "@/lib/organismes/libelles";
import { supabaseAdmin } from "../serveur";

/**
 * Requêtes de l'espace admin (service role, après exigerAdmin). Lecture seule sur le contenu des fiches :
 * les seules écritures sont les actions de modération (suspension, suppression, rappel).
 */

export type OrganismeAdmin = {
  id: string;
  slug: string;
  nom: string;
  statut: "brouillon" | "publie" | "suspendu";
  inscritLe: string;
  lieu: string | null;
  departement: string | null;
  palier: Palier;
  nbFormations: number;
  /** Compte de connexion (null : fiche créée directement en base, sans compte). */
  compteId: string | null;
};

const SELECT = `*, lieux (code_postal, ville, est_siege),
  organisme_titres (financements, titres_referentiel (statut)), comptes_organisme (id)`;

// ponytail: tout le parc en mémoire (quelques centaines de fiches en V1) ; paginer côté base au-delà de ~5 000.
export async function getOrganismesAdmin(): Promise<OrganismeAdmin[]> {
  const { data, error } = await supabaseAdmin().from("organismes").select(SELECT);
  if (error) throw error;
  return data
    .map(({ lieux, organisme_titres, comptes_organisme, ...o }) => {
      // Même calcul que l'espace organisme : seules les offres sur un titre actif comptent.
      const offres = organisme_titres.filter((t) => t.titres_referentiel.statut === "actif");
      const financements = [...new Set([...o.financements, ...offres.flatMap((t) => t.financements)])];
      const siege = lieux.find((l) => l.est_siege) ?? lieux[0];
      const dep = siege ? departementDuCodePostal(siege.code_postal) : null;
      return {
        id: o.id,
        slug: o.slug,
        nom: o.nom,
        statut: o.statut,
        inscritLe: o.created_at,
        lieu: siege ? `${siege.ville} (${dep})` : null,
        departement: dep,
        palier: palier({ ...o, financements, nbFormations: offres.length }),
        nbFormations: offres.length,
        compteId: comptes_organisme?.id ?? null,
      };
    })
    .sort((a, b) => b.inscritLe.localeCompare(a.inscritLe));
}

/** Demandes de titre non arbitrées, les plus anciennes d'abord. */
export async function getDemandesEnAttente() {
  const { data, error } = await supabaseAdmin()
    .from("demandes_titre")
    .select("id, intitule, created_at, organismes (id, nom)")
    .eq("statut", "en_attente")
    .order("created_at");
  if (error) throw error;
  return data;
}

/** Fiche client (UX Fiche client) : tout ce que l'organisme a renseigné, internes compris, et les rappels envoyés. */
export async function getFicheClient(id: string) {
  const admin = supabaseAdmin();
  const { data: o } = await admin
    .from("organismes")
    .select(
      `*, lieux (*),
      organisme_titres (*, titres_referentiel (slug, libelle_court, statut, ordre), offre_lieux (lieu_id)),
      comptes_organisme (id, contact_nom, contact_telephone),
      rappels_organisme (type, envoye_le)`,
    )
    .eq("id", id)
    .maybeSingle();
  if (!o) return null;
  const { lieux, organisme_titres, comptes_organisme: compte, rappels_organisme, ...organisme } = o;
  const actives = organisme_titres.filter((t) => t.titres_referentiel.statut === "actif");
  const financements = [...new Set([...organisme.financements, ...actives.flatMap((t) => t.financements)])];
  const email = compte ? (await admin.auth.admin.getUserById(compte.id)).data.user?.email ?? null : null;
  return {
    organisme,
    lieux: lieux.sort((a, b) => Number(b.est_siege) - Number(a.est_siege) || a.id - b.id),
    offres: organisme_titres.sort((a, b) => a.titres_referentiel.ordre - b.titres_referentiel.ordre),
    palier: palier({ ...organisme, financements, nbFormations: actives.length }),
    nbFormations: actives.length,
    compte: compte ? { ...compte, email } : null,
    rappels: rappels_organisme.sort((a, b) => b.envoye_le.localeCompare(a.envoye_le)),
  };
}

export async function getDepartements() {
  const { data } = await supabaseAdmin().from("departements").select("code, nom").order("code");
  return data ?? [];
}

/** Prospection : fichier issu du scraping, jamais relié aux fiches publiques ni au Fichier client. */
export async function getProspects() {
  const admin = supabaseAdmin();
  const [{ data, error }, { count }] = await Promise.all([
    admin.from("prospects").select("*").order("nom"),
    admin.from("exclusions_prospection").select("id", { count: "exact", head: true }),
  ]);
  if (error) throw error;
  return { prospects: data, empreintesExclues: count ?? 0 };
}

/** Référentiel des titres : titres actifs, nombre d'organismes par titre, demandes en attente et email du demandeur. */
export async function getReferentielAdmin() {
  const admin = supabaseAdmin();
  const [{ data: titres, error }, { data: offres }, demandes] = await Promise.all([
    admin
      .from("titres_referentiel")
      .select("id, slug, libelle_court, libelle_long, categorie, ordre")
      .eq("statut", "actif")
      .order("ordre"),
    admin.from("organisme_titres").select("titre_id"),
    admin
      .from("demandes_titre")
      .select("id, intitule, created_at, organismes (id, nom, comptes_organisme (id))")
      .eq("statut", "en_attente")
      .order("created_at"),
  ]);
  if (error) throw error;
  if (demandes.error) throw demandes.error;
  const nb = new Map<number, number>();
  for (const o of offres ?? []) nb.set(o.titre_id, (nb.get(o.titre_id) ?? 0) + 1);
  const emails = await Promise.all(
    demandes.data.map(async (d) => {
      const compte = d.organismes.comptes_organisme?.id;
      return compte ? ((await admin.auth.admin.getUserById(compte)).data.user?.email ?? null) : null;
    }),
  );
  return {
    titres: titres.map((t) => ({ ...t, nbOrganismes: nb.get(t.id) ?? 0 })),
    demandes: demandes.data.map((d, i) => ({
      id: d.id,
      intitule: d.intitule,
      demandeLe: d.created_at,
      organisme: { id: d.organismes.id, nom: d.organismes.nom },
      email: emails[i],
    })),
  };
}
