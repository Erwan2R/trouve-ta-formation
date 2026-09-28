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
      "experience",
      "objectif",
      ...(r.objectif === "specialite" ? ["specialite" as const] : []),
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
        | "encadrement-sans-experience"
        | "vers-incendie"
        | "specialisation";
      /** Titre détenu, ou titre d'encadrement visé sans l'expérience demandée. */
      reference?: string;
      encart?: "autorisation" | "autorisation-inconnue" | "carte-expiree";
    };

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
      const vise = r.detenu === "ssiap-2" || r.detenu === "ssiap-3" ? "ssiap-3" : "ssiap-2";
      // [À VÉRIFIER Copy §6] conditions d'expérience exactes du SSIAP 2 et du SSIAP 3 : moins d'un an = insuffisant.
      if (r.experience === "moins-1-an")
        return reco(r.detenu.startsWith("ssiap") ? "tfp-aps" : "ssiap-1", {
          gabarit: "encadrement-sans-experience",
          reference: vise,
        });
      return reco(vise, { gabarit: "encadrement", reference: r.detenu });
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
      return valeur === "encadrer"
        ? actifs.has("ssiap-2") && actifs.has("ssiap-3")
        : valeur === "incendie"
          ? actifs.has("ssiap-1")
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

export type Niveau = 1 | 2 | 3 | 4 | 5;

/**
 * Cascade de relâchement (UX §9). 1 : tous critères ; 2 : sans le rythme ; 3 : départements voisins ;
 * 4 : toute l'Île-de-France ; 5 : aucun organisme sur ce titre.
 * Relâchement automatique uniquement à zéro résultat (décision Erwan 01/10/2026). `suivant` : l'élargissement
 * à proposer sans l'imposer, quand il rend davantage d'organismes. `minimum` : niveau demandé par le visiteur.
 */
export function cascade<T extends OrganismeCascade>(
  organismes: T[],
  c: Criteres,
  voisins: Record<string, string[]>,
  minimum: Niveau = 1,
): { niveau: Niveau; liste: T[]; suivant: { niveau: Niveau; nombre: number } | null } {
  const base = organismes.filter(
    (o) =>
      o.titres.includes(c.titre) &&
      (!c.double || (o.titres.includes("tfp-aps") && o.titres.includes("ssiap-1"))) &&
      (!c.pmr || o.accessibilite_pmr),
  );
  if (base.length === 0) return { niveau: 5, liste: [], suivant: null };
  const dans = (ds: string[] | null) => (o: T) => !ds || o.lieux.some((l) => ds.includes(l.departement));
  const fin = (o: T) => !c.financement || o.financements.includes(c.financement);
  const ry = (o: T) => !c.rythme || o.rythmes.includes(c.rythme);
  const ds = c.departements;
  const elargis = ds ? [...new Set([...ds, ...ds.flatMap((d) => voisins[d] ?? [])])] : null;
  const niveaux: [Niveau, T[]][] = [[1, base.filter((o) => fin(o) && ry(o) && dans(ds)(o))]];
  if (c.rythme) niveaux.push([2, base.filter((o) => fin(o) && dans(ds)(o))]);
  if (ds) niveaux.push([3, base.filter((o) => fin(o) && dans(elargis)(o))]);
  niveaux.push([4, base]);

  const i = Math.max(
    0,
    niveaux.findIndex(([n, l]) => n >= minimum && l.length > 0),
  );
  const [niveau, liste] = niveaux[i];
  const plus = niveaux.slice(i + 1).find(([, l]) => l.length > liste.length);
  return { niveau, liste, suivant: plus ? { niveau: plus[0], nombre: plus[1].length } : null };
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
