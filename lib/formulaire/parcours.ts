/**
 * Formulaire d'affinage (UX_Formulaire_Affinage.md, Copy_Formulaire_Affinage.md). Logique pure :
 * arbre de questions, recommandation de titre, cascade de relâchement.
 * L'état du parcours tient entièrement dans l'URL (page noindex) : aucune donnée stockée, aucune coordonnée,
 * rien sur le casier judiciaire (décision Erwan 01/10/2026).
 */

export type Etape =
  | "depart"
  | "poste"
  | "specialite"
  | "autorisation"
  | "detenu"
  | "carte"
  | "experience"
  | "objectif"
  | "situation"
  | "secteur"
  | "rythme"
  | "plusieurs"
  | "deplacement"
  | "debut"
  | "pmr";

export type Reponses = Partial<Record<Exclude<Etape, "secteur">, string>> & { secteur?: string[] };

export const AFFINAGE: Etape[] = ["plusieurs", "deplacement", "debut", "pmr"];
const FILTRAGE: Etape[] = ["situation", "secteur", "rythme"];
export const TOUS_SECTEURS = "tous";

/** Titre détenu → stage de renouvellement (Copy §5). Le TFP ASA n'a pas de sortie : message dédié. */
export const RENOUVELLEMENT: Record<string, string> = {
  "tfp-aps": "mac-aps",
  "tfp-asc": "mac-cyno",
  "ssiap-1": "recyclage-ssiap-1",
  "ssiap-2": "recyclage-ssiap-2",
  "ssiap-3": "recyclage-ssiap-3",
  "tfp-a3p": "mac-a3p",
};
export const TITRES_DETENUS = ["tfp-aps", "ssiap-1", "ssiap-2", "ssiap-3", "tfp-asc", "tfp-asa", "tfp-a3p"];
export const SPECIALITES: Record<string, string> = { cynophile: "tfp-asc", aeroport: "tfp-asa", personnes: "tfp-a3p" };
export const POSTES: Record<string, string | null> = { surveillance: "tfp-aps", incendie: "ssiap-1", specialite: null };

/** Situation → financement probable (UX §6, S1). Déduit, jamais demandé. */
export const FINANCEMENT_PROBABLE: Record<string, string> = { "demandeur-emploi": "france_travail", salarie: "opco" };

/** Étapes de la recommandation initiale, selon les réponses déjà données (total recalculé, jamais figé). */
export function etapesInitiales(r: Reponses): Etape[] {
  if (r.depart === "debutant")
    return [
      "depart",
      "poste",
      ...(r.poste === "specialite" ? ["specialite" as const] : []),
      "autorisation",
      ...FILTRAGE,
    ];
  if (r.depart === "renouvellement")
    return r.detenu === "tfp-asa" ? ["depart", "detenu"] : ["depart", "detenu", "carte", ...FILTRAGE];
  if (r.depart === "evolution")
    return [
      "depart",
      "detenu",
      "objectif",
      ...(r.objectif === "specialite" ? ["specialite" as const] : []),
      // Expérience ou diplôme : seulement pour encadrer, libellé selon le titre détenu (questionExperience).
      ...(r.objectif === "encadrer" ? ["experience" as const] : []),
      ...FILTRAGE,
    ];
  return ["depart"];
}

const repondu = (r: Reponses, e: Etape) => (e === "secteur" ? !!r.secteur?.length : e === "pmr" || !!r[e]);

/**
 * Écran à afficher. `etape` : écran demandé (retour, modification) ; `apres` : écran auquel on vient de répondre.
 * Un écran demandé dont les précédents ne sont pas tous répondus ramène au premier sans réponse.
 */
export function ecranCourant(r: Reponses, etape: string | null, apres: string | null): Etape | "resultat" {
  const initiales = etapesInitiales(r);
  const suite = [...initiales, ...AFFINAGE];
  const premierVide = initiales.find((e) => !repondu(r, e));
  const i = apres ? suite.indexOf(apres as Etape) : -1;
  const demande: string | null =
    i >= 0 ? (apres === initiales.at(-1) || i === suite.length - 1 ? "resultat" : suite[i + 1]) : etape;
  if (
    premierVide &&
    (demande === "resultat" || !demande || suite.indexOf(demande as Etape) > initiales.indexOf(premierVide))
  )
    return premierVide;
  if (demande && suite.includes(demande as Etape)) return demande as Etape;
  return premierVide ?? "resultat";
}

export type Recommandation =
  | { type: "asa" }
  | {
      type: "titre";
      titre: string;
      /** Gabarit de phrase d'explication (Copy §9). */
      gabarit:
        | "entree-surveillance"
        | "entree-incendie"
        | "entree-specialite"
        | "renouvellement"
        | "encadrement"
        | "encadrement-diplome"
        | "encadrement-sans-experience"
        | "encadrement-prerequis"
        | "vers-incendie"
        | "specialisation";
      /** Titre détenu, ou titre d'encadrement visé sans l'expérience demandée. */
      reference?: string;
      encart?: "autorisation" | "autorisation-inconnue" | "carte-expiree";
    };

/**
 * Expérience exigée pour un titre d'encadrement (arrêté du 2 mai 2005) — table parametres. Elle n'entre que dans le
 * libellé de la question : la réponse est un oui / non (ou « bac ») sur ce seuil.
 */
export type ExperienceMin = { "ssiap-2": { heures: number; mois: number }; "ssiap-3": number };

/** null : réponses incomplètes ou titre de sortie absent des titres actifs (archivé). */
export function recommander(r: Reponses, actifs: Set<string>): Recommandation | null {
  const reco = (
    titre: string | null | undefined,
    rest: Omit<Extract<Recommandation, { type: "titre" }>, "type" | "titre">,
  ) => (titre && actifs.has(titre) ? { type: "titre" as const, titre, ...rest } : null);
  if (r.depart === "debutant") {
    const encart =
      r.autorisation === "non" ? "autorisation" : r.autorisation === "inconnue" ? "autorisation-inconnue" : undefined;
    if (r.poste === "specialite")
      return reco(SPECIALITES[r.specialite ?? ""], { gabarit: "entree-specialite", encart, reference: r.specialite });
    return reco(POSTES[r.poste ?? ""], {
      gabarit: r.poste === "incendie" ? "entree-incendie" : "entree-surveillance",
      encart,
    });
  }
  if (r.depart === "renouvellement") {
    if (r.detenu === "tfp-asa") return { type: "asa" };
    return reco(RENOUVELLEMENT[r.detenu ?? ""], {
      gabarit: "renouvellement",
      reference: r.detenu,
      encart: r.carte === "expiree" ? "carte-expiree" : undefined,
    });
  }
  if (r.depart === "evolution" && r.detenu) {
    if (r.objectif === "encadrer") {
      // Accès réglementaires (arrêté du 2 mai 2005, décision Erwan 02/10/2026) : SSIAP 2 = SSIAP 1 + heures
      // d'exercice ; SSIAP 3 = SSIAP 2 + années d'expérience, OU diplôme de niveau 4 (jamais renvoyé au SSIAP 1).
      if (r.detenu === "ssiap-1")
        return r.experience === "oui"
          ? reco("ssiap-2", { gabarit: "encadrement", reference: r.detenu })
          : reco("tfp-aps", { gabarit: "encadrement-sans-experience", reference: "ssiap-2" });
      if (r.detenu === "ssiap-2")
        return r.experience === "oui" || r.experience === "bac"
          ? reco("ssiap-3", { gabarit: "encadrement", reference: r.detenu })
          : reco("tfp-aps", { gabarit: "encadrement-sans-experience", reference: "ssiap-3" });
      return r.experience === "bac"
        ? reco("ssiap-3", { gabarit: "encadrement-diplome" })
        : reco("ssiap-1", { gabarit: "encadrement-prerequis", reference: "ssiap-2" });
    }
    if (r.objectif === "incendie") return reco("ssiap-1", { gabarit: "vers-incendie" });
    if (r.objectif === "specialite")
      return reco(SPECIALITES[r.specialite ?? ""], { gabarit: "specialisation", reference: r.specialite });
  }
  return null;
}

/** Une option n'est proposée que si le titre auquel elle mène est actif (titres archivés exclus des questions). */
export function optionDisponible(etape: Etape, valeur: string, r: Reponses, actifs: Set<string>): boolean {
  const uneSpecialite = Object.values(SPECIALITES).some((t) => actifs.has(t));
  switch (etape) {
    case "poste":
      return valeur === "specialite" ? uneSpecialite : actifs.has(POSTES[valeur] ?? "");
    case "specialite":
      return actifs.has(SPECIALITES[valeur]);
    case "detenu":
      return (
        actifs.has(valeur) &&
        (r.depart !== "renouvellement" || valeur === "tfp-asa" || actifs.has(RENOUVELLEMENT[valeur]))
      );
    case "objectif":
      // SSIAP 3 : plus haut niveau de la filière ; SSIAP détenu : déjà en sécurité incendie.
      return valeur === "encadrer"
        ? r.detenu !== "ssiap-3" && actifs.has("ssiap-1") && actifs.has("ssiap-2") && actifs.has("ssiap-3")
        : valeur === "incendie"
          ? !r.detenu?.startsWith("ssiap") && actifs.has("ssiap-1")
          : uneSpecialite;
    default:
      return true;
  }
}

/** Titres alternatifs (maquette) : un titre toujours proposé, même quand la recommandation est certaine. */
export const ALTERNATIVES: Record<string, [string, string][]> = {
  "tfp-aps": [["ssiap-1", "Pour travailler en sécurité incendie, dans les bâtiments recevant du public."]],
  "ssiap-1": [["tfp-aps", "Pour surveiller des sites, des magasins ou des événements."]],
  "ssiap-2": [["tfp-aps", "Pour ajouter la surveillance à votre profil."]],
  "ssiap-3": [["recyclage-ssiap-2", "Pour maintenir votre titre actuel."]],
  "tfp-asc": [["tfp-aps", "Le titre d'entrée du métier, plus court."]],
  "tfp-asa": [["tfp-aps", "Le titre d'entrée du métier, plus court."]],
  "tfp-a3p": [["tfp-aps", "Le titre d'entrée du métier, plus court."]],
  "mac-aps": [["ssiap-1", "Pour ajouter la sécurité incendie à votre titre actuel."]],
  "mac-cyno": [["mac-aps", "Si vous exercez aussi comme agent de prévention et de sécurité."]],
  "mac-a3p": [["mac-aps", "Si vous exercez aussi comme agent de prévention et de sécurité."]],
  "recyclage-ssiap-1": [["ssiap-2", "Pour encadrer une équipe, avec l'expérience demandée."]],
  "recyclage-ssiap-2": [["ssiap-3", "Pour diriger un service, avec l'expérience demandée."]],
  "recyclage-ssiap-3": [["tfp-aps", "Pour ajouter la surveillance à votre profil."]],
};

export function alternatives(reco: Extract<Recommandation, { type: "titre" }>, actifs: Set<string>) {
  const liste: [string, string][] =
    reco.gabarit === "encadrement-sans-experience"
      ? [[reco.reference!, "Quand vous aurez l'expérience demandée."]]
      : reco.gabarit === "encadrement-prerequis"
        ? [["ssiap-2", "Quand vous aurez le SSIAP 1 et l'expérience demandée."]]
        : reco.gabarit === "encadrement-diplome"
          ? [["ssiap-1", "Pour commencer comme agent de sécurité incendie."]]
          : (ALTERNATIVES[reco.titre] ?? []);
  return liste.filter(([t]) => actifs.has(t));
}

/** Forme minimale d'un organisme pour la cascade (satisfaite par Organisme). */
export type OrganismeCascade = {
  titres: string[];
  rythmes: string[];
  financements: string[];
  accessibilite_pmr: boolean;
  lieux: { departement: string }[];
};

export type Criteres = {
  titre: string;
  departements: string[] | null;
  rythme: string | null;
  financement: string | null;
  /** O1 « deux titres » : organismes proposant à la fois le TFP APS et le SSIAP 1. */
  double: boolean;
  pmr: boolean;
};

/** Critère relâché : le rythme, puis les départements voisins, puis toute l'Île-de-France (tous critères levés). */
export type Relachement = "rythme" | "voisins" | "region";

/**
 * Ordre des relâchements piloté par le déplacement (O2, décision Erwan 02/10/2026) : véhicule → les voisins avant
 * le rythme ; transports (ou sans réponse) → le rythme d'abord, les voisins ensuite ; proximité immédiate → jamais
 * d'élargissement géographique.
 */
export function ordreRelachement(c: Criteres, deplacement?: string): Relachement[] {
  const rythme: Relachement[] = c.rythme ? ["rythme"] : [];
  const voisins: Relachement[] = c.departements ? ["voisins"] : [];
  if (deplacement === "proximite") return c.departements ? rythme : [...rythme, "region"];
  return deplacement === "vehicule" ? [...voisins, ...rythme, "region"] : [...rythme, ...voisins, "region"];
}

/**
 * Cascade de relâchement (UX §9). Relâchement automatique uniquement à zéro résultat (décision Erwan 01/10/2026).
 * `applique` : relâchements appliqués, dans l'ordre ; `suivant` : l'élargissement à proposer sans l'imposer, quand
 * il rend davantage d'organismes ; `minimum` : nombre de relâchements demandés par le visiteur.
 * `aucun` : aucun organisme ne prépare ce titre (niveau 5). Liste vide sans `aucun` : proximité immédiate.
 */
export function cascade<T extends OrganismeCascade>(
  organismes: T[],
  c: Criteres,
  voisins: Record<string, string[]>,
  ordre: Relachement[],
  minimum = 0,
): { applique: Relachement[]; liste: T[]; aucun: boolean; suivant: { applique: number; nombre: number } | null } {
  const base = organismes.filter(
    (o) =>
      o.titres.includes(c.titre) &&
      (!c.double || (o.titres.includes("tfp-aps") && o.titres.includes("ssiap-1"))) &&
      (!c.pmr || o.accessibilite_pmr),
  );
  if (base.length === 0) return { applique: [], liste: [], aucun: true, suivant: null };
  const ds = c.departements;
  const elargis = ds ? [...new Set([...ds, ...ds.flatMap((d) => voisins[d] ?? [])])] : null;
  const niveau = (applique: Relachement[]) => {
    if (applique.includes("region")) return base;
    const zone = applique.includes("voisins") ? elargis : ds;
    return base.filter(
      (o) =>
        (!c.financement || o.financements.includes(c.financement)) &&
        (!c.rythme || applique.includes("rythme") || o.rythmes.includes(c.rythme)) &&
        (!zone || o.lieux.some((l) => zone.includes(l.departement))),
    );
  };
  const niveaux = ordre.map((_, i) => niveau(ordre.slice(0, i + 1)));
  niveaux.unshift(niveau([]));
  const debut = Math.min(minimum, ordre.length);
  let i = niveaux.findIndex((l, k) => k >= debut && l.length > 0);
  if (i < 0) i = ordre.length; // proximité immédiate sans résultat : liste vide, jamais d'élargissement géographique
  const liste = niveaux[i];
  const plus = niveaux.findIndex((l, k) => k > i && l.length > liste.length);
  return {
    applique: ordre.slice(0, i),
    liste,
    aucun: false,
    suivant: plus > 0 ? { applique: plus, nombre: niveaux[plus].length } : null,
  };
}

/** Clé d'une recherche sans résultat au niveau 1 : combinaison de critères seule (même format que le catalogue). */
export function cleFormulaire(c: Criteres): string {
  const p = new URLSearchParams({ source: "formulaire", titre: c.titre });
  [...(c.departements ?? [])].sort().forEach((d) => p.append("dept", d));
  if (c.rythme) p.set("rythme", c.rythme);
  if (c.financement) p.set("fin", c.financement);
  if (c.double) p.set("double", "1");
  if (c.pmr) p.set("pmr", "1");
  return p.toString();
}

type Params = Record<string, string | string[] | undefined>;
const DEPART = ["debutant", "renouvellement", "evolution"];

/** Lecture des réponses depuis l'URL : valeurs inconnues ignorées. */
export function lireReponses(p: Params, departements: string[]): Reponses {
  const un = (k: string) => {
    const v = p[k];
    return (Array.isArray(v) ? v[0] : v) || undefined;
  };
  const brut = p.secteur === undefined ? [] : Array.isArray(p.secteur) ? p.secteur : [p.secteur];
  const codes = brut.filter((d) => departements.includes(d));
  // « Peu importe » exclut les départements, et inversement (Copy §7) : sans JavaScript, les départements l'emportent.
  const secteur = codes.length ? [...new Set(codes)] : brut.includes(TOUS_SECTEURS) ? [TOUS_SECTEURS] : undefined;
  const r: Reponses = {
    depart: DEPART.includes(un("depart") ?? "") ? un("depart") : undefined,
    secteur,
  };
  const cles: Exclude<Etape, "depart" | "secteur">[] = [
    "poste",
    "specialite",
    "autorisation",
    "detenu",
    "carte",
    "experience",
    "objectif",
    "situation",
    "rythme",
    "plusieurs",
    "deplacement",
    "debut",
    "pmr",
  ];
  for (const k of cles) {
    const v = un(k);
    if (v && /^[a-z0-9_-]{1,30}$/.test(v)) r[k] = v;
  }
  return r;
}

/** Réponses → paramètres d'URL (liens Retour, Modifier, Affiner). */
export function versParams(r: Reponses, extra: Record<string, string> = {}): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(r)) {
    if (Array.isArray(v)) v.forEach((x) => p.append(k, x));
    else if (v) p.set(k, v);
  }
  for (const [k, v] of Object.entries(extra)) p.set(k, v);
  return p.toString();
}

/** Page d'origine (lien de retour) : un chemin de la verticale, jamais le formulaire lui-même ni une URL externe. */
export function lireOrigine(v: string | string[] | undefined, base: string): string | null {
  const s = Array.isArray(v) ? v[0] : v;
  return s && s.startsWith(base) && /^[a-z0-9/-]+$/.test(s) && !s.startsWith(`${base}formulaire`) ? s : null;
}
