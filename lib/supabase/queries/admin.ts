import "server-only";
import { cumul, instantanes, parTranche, type Periode, tranches } from "@/lib/analytics";
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
  /** L'organisme a cliqué « Ne plus recevoir ces rappels » : plus aucun rappel possible. */
  desabonne: boolean;
};

const SELECT = `*, lieux (code_postal, ville, est_siege),
  organisme_titres (financements, titres_referentiel (statut)), comptes_organisme (id)`;

// ponytail: tout le parc en mémoire (quelques centaines de fiches en V1) ; paginer côté base au-delà de ~5 000.
export async function getOrganismesAdmin(): Promise<OrganismeAdmin[]> {
  const data = await toutLire((de, a) => supabaseAdmin().from("organismes").select(SELECT).order("id").range(de, a));
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
        desabonne: !!o.rappels_desabonne_le,
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

/** Lecture complète malgré la limite de 1 000 lignes par requête de l'API Supabase. */
async function toutLire<T>(page: (de: number, a: number) => PromiseLike<{ data: T[] | null; error: unknown }>) {
  const lignes: T[] = [];
  for (let de = 0; ; de += 1000) {
    const { data, error } = await page(de, de + 999);
    if (error) throw error;
    lignes.push(...(data ?? []));
    if (!data || data.length < 1000) return lignes;
  }
}

/**
 * Analytics (UX Analytics admin) : courbes et classements de la période. L'instantané des paliers du jour est
 * enregistré à chaque consultation : c'est la seule donnée qui ne se reconstitue pas après coup.
 */
// ponytail: agrégation en mémoire ; passer à des requêtes SQL agrégées au-delà de ~100 000 événements par période.
export async function getAnalytics(periode: Periode) {
  const admin = supabaseAdmin();
  const organismes = await getOrganismesAdmin();
  const n = { basique: 0, correct: 0, optimal: 0 };
  organismes.forEach((o) => n[o.palier]++);
  const aujourdhui = new Date().toISOString().slice(0, 10);
  await admin.from("statistiques_quotidiennes").upsert({ jour: aujourdhui, ...n });

  const maintenant = Date.now();
  const ouverture = Math.min(maintenant, ...organismes.map((o) => new Date(o.inscritLe).getTime()));
  const { debut, liste } = tranches(periode, maintenant, ouverture);
  const depuis = new Date(debut).toISOString();
  const [offres, evenements, { data: paliers }, { data: formulaire }, { data: sansResultat }, { data: articles }] =
    await Promise.all([
    toutLire((de, a) =>
      admin
        .from("organisme_titres")
        .select("created_at, organismes (statut), titres_referentiel (statut)")
        .range(de, a),
    ),
    toutLire((de, a) =>
      admin
        .from("evenements")
        .select("type, organisme_id, chemin, created_at")
        .gt("created_at", depuis)
        .order("id")
        .range(de, a),
    ),
    admin.from("statistiques_quotidiennes").select("jour, basique, correct, optimal"),
    admin.from("formulaire_statistiques").select("cle, compteur"),
    admin.from("recherches_sans_resultat").select("combinaison, compteur").order("compteur", { ascending: false }).limit(10),
    admin.from("articles_blog").select("id, slug, titre"),
  ]);
  const t = (iso: string) => new Date(iso).getTime();
  const vues = evenements.filter((e) => e.type === "vue_page");
  const snap = instantanes(paliers ?? [], liste, { jour: "", basique: 0, correct: 0, optimal: 0 });

  const parOrganisme = new Map<string, { vues: number; telephone: number; email: number; site: number }>();
  for (const e of evenements) {
    if (!e.organisme_id) continue;
    const c = parOrganisme.get(e.organisme_id) ?? { vues: 0, telephone: 0, email: 0, site: 0 };
    if (e.type === "vue_page") c.vues++;
    else c[e.type.replace("clic_", "") as "telephone" | "email" | "site"]++;
    parOrganisme.set(e.organisme_id, c);
  }
  // Blog : vues des pages d'article (/securite-privee/blog/<slug>/), y compris d'anciens slugs encore référencés.
  const vuesBlog = vues.filter((e) => e.chemin.startsWith("/securite-privee/blog/"));
  const parSlug = new Map<string, number>();
  for (const e of vuesBlog) {
    const slug = e.chemin.match(/^\/securite-privee\/blog\/([a-z0-9-]+)\/?$/)?.[1];
    if (slug && slug !== "article-retire") parSlug.set(slug, (parSlug.get(slug) ?? 0) + 1);
  }
  const articlesVus = (articles ?? [])
    .filter((x) => parSlug.has(x.slug))
    .map((x) => ({ id: x.id, titre: x.titre, vues: parSlug.get(x.slug)! }))
    .sort((x, y) => y.vues - x.vues)
    .slice(0, 10);
  const noms = new Map(organismes.map((o) => [o.id, o]));
  const classement = [...parOrganisme]
    .filter(([id]) => noms.has(id))
    .map(([id, c]) => ({ id, nom: noms.get(id)!.nom, lieu: noms.get(id)!.lieu, ...c, clics: c.telephone + c.email + c.site }));

  return {
    libelles: liste.map((x) => x.libelle),
    parJour: periode === "7" || periode === "30",
    organismes: cumul(organismes.map((o) => t(o.inscritLe)), liste),
    paliers: { basique: snap.map((s) => s.basique), correct: snap.map((s) => s.correct), optimal: snap.map((s) => s.optimal) },
    formations: cumul(
      offres
        .filter((o) => o.organismes.statut === "publie" && o.titres_referentiel.statut === "actif")
        .map((o) => t(o.created_at)),
      liste,
    ),
    trafic: parTranche(vues.map((e) => t(e.created_at)), liste, debut),
    blog: {
      courbe: parTranche(vuesBlog.map((e) => t(e.created_at)), liste, debut),
      total: vuesBlog.length,
      articles: articlesVus,
    },
    fichesVues: classement.filter((c) => c.vues).sort((a, b) => b.vues - a.vues).slice(0, 10),
    clicsCta: classement.filter((c) => c.clics).sort((a, b) => b.clics - a.clics).slice(0, 10),
    ctaTotaux: {
      telephone: evenements.filter((e) => e.type === "clic_telephone").length,
      email: evenements.filter((e) => e.type === "clic_email").length,
      site: evenements.filter((e) => e.type === "clic_site").length,
    },
    formulaire: formulaire ?? [],
    sansResultat: sansResultat ?? [],
  };
}

/** Blog : tous les articles (brouillons, publiés, dépubliés), du plus récemment modifié au plus ancien. */
export async function getArticlesAdmin() {
  const { data, error } = await supabaseAdmin()
    .from("articles_blog")
    .select("id, slug, titre, categorie, statut, updated_at, publie_le, auteur:auteurs_blog (nom)")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getArticleAdmin(id: string) {
  const { data } = await supabaseAdmin().from("articles_blog").select("*").eq("id", id).maybeSingle();
  return data;
}

/** Auteurs du blog. Production : jamais l'auteur de démonstration (il n'existe que sur dev). */
export async function getAuteurs() {
  const { data, error } = await supabaseAdmin()
    .from("auteurs_blog")
    .select("id, nom, qualification, biographie, est_test, articles_blog (count)")
    .order("id");
  if (error) throw error;
  return data.map(({ articles_blog, ...a }) => ({ ...a, nbArticles: articles_blog[0]?.count ?? 0 }));
}
