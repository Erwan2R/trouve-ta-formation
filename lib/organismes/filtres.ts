/**
 * Filtres du catalogue (UX catalogue §5, Copy catalogue §6-8). Logique pure : parse des paramètres d'URL,
 * filtrage, compteurs par option (facettes), relâchement du filtre le plus restrictif.
 * ponytail: filtrage en mémoire sur l'ensemble des organismes publiés ; passer en requête SQL
 * quand l'inventaire dépassera quelques milliers de fiches.
 */

export type Tri = "pertinence" | "alpha" | "ville";

export type Filtres = {
  dept: string | null;
  villes: string[];
  titres: string[];
  fin: string[];
  rythmes: string[];
  qualiopi: boolean;
  q: string;
  tri: Tri;
  page: number;
};

/** Forme minimale d'un organisme pour le filtrage. */
export type OrganismeFiltrable = {
  nom: string;
  qualiopi: boolean;
  lieux: { ville: string; departement: string }[];
  titres: string[];
  financements: string[];
  rythmes: string[];
};

type Params = Record<string, string | string[] | undefined>;
const liste = (v: string | string[] | undefined) => (v === undefined ? [] : Array.isArray(v) ? v : [v]).filter(Boolean);
const premier = (v: string | string[] | undefined) => liste(v)[0] ?? "";

export function lireFiltres(p: Params): Filtres {
  const tri = premier(p.tri);
  const page = Number.parseInt(premier(p.page), 10);
  const dept = premier(p.dept) || null;
  return {
    dept,
    villes: dept ? liste(p.ville) : [], // la ville n'existe qu'une fois un département choisi
    titres: liste(p.titre),
    fin: liste(p.fin),
    rythmes: liste(p.rythme),
    qualiopi: premier(p.qualiopi) === "1",
    q: premier(p.q).trim().slice(0, 80),
    tri: tri === "alpha" || tri === "ville" ? tri : "pertinence",
    page: Number.isFinite(page) && page > 1 ? page : 1,
  };
}

/** Un filtre actif restreint les résultats (le tri et la page n'en sont pas). → noindex + canonical. */
export function aDesFiltres(f: Filtres): boolean {
  return !!f.dept || f.titres.length + f.fin.length + f.rythmes.length > 0 || f.qualiopi || f.q !== "";
}

export function versQuery(f: Filtres): string {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.dept) p.set("dept", f.dept);
  f.villes.forEach((v) => p.append("ville", v));
  f.titres.forEach((v) => p.append("titre", v));
  f.fin.forEach((v) => p.append("fin", v));
  f.rythmes.forEach((v) => p.append("rythme", v));
  if (f.qualiopi) p.set("qualiopi", "1");
  if (f.tri !== "pertinence") p.set("tri", f.tri);
  if (f.page > 1) p.set("page", String(f.page));
  const s = p.toString();
  return s ? `?${s}` : "";
}

const normaliser = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

type Dimension = "dept" | "villes" | "titres" | "fin" | "rythmes" | "qualiopi" | "q";

function correspond(o: OrganismeFiltrable, f: Filtres, sauf?: Dimension): boolean {
  const unDe = (valeurs: string[], possedees: string[]) =>
    valeurs.length === 0 || valeurs.some((v) => possedees.includes(v));
  return (
    (sauf === "q" || !f.q || normaliser(o.nom).includes(normaliser(f.q))) &&
    (sauf === "dept" || !f.dept || o.lieux.some((l) => l.departement === f.dept)) &&
    (sauf === "villes" ||
      unDe(
        f.villes,
        o.lieux.map((l) => l.ville),
      )) &&
    (sauf === "titres" || unDe(f.titres, o.titres)) &&
    (sauf === "fin" || unDe(f.fin, o.financements)) &&
    (sauf === "rythmes" || unDe(f.rythmes, o.rythmes)) &&
    (sauf === "qualiopi" || !f.qualiopi || o.qualiopi)
  );
}

export function filtrer<T extends OrganismeFiltrable>(organismes: T[], f: Filtres): T[] {
  return organismes.filter((o) => correspond(o, f));
}

/**
 * Nombre d'organismes par option, calculé avec tous les autres filtres actifs (facettes).
 * Une option à zéro est grisée et non cliquable, jamais masquée.
 */
export function facettes(organismes: OrganismeFiltrable[], f: Filtres) {
  const compter = (dim: Dimension, valeurs: (o: OrganismeFiltrable) => string[]) => {
    const n = new Map<string, number>();
    for (const o of organismes.filter((x) => correspond(x, f, dim)))
      for (const v of new Set(valeurs(o))) n.set(v, (n.get(v) ?? 0) + 1);
    return n;
  };
  return {
    dept: compter("dept", (o) => o.lieux.map((l) => l.departement)),
    villes: compter("villes", (o) => o.lieux.filter((l) => !f.dept || l.departement === f.dept).map((l) => l.ville)),
    titres: compter("titres", (o) => o.titres),
    fin: compter("fin", (o) => o.financements),
    rythmes: compter("rythmes", (o) => o.rythmes),
    qualiopi: organismes.filter((o) => correspond(o, f, "qualiopi") && o.qualiopi).length,
  };
}

/** Chaque filtre actif, individuellement retirable (pastilles « Votre recherche »). */
export type Puce = { dimension: Dimension; valeur: string; sans: Filtres };

export function puces(f: Filtres): Puce[] {
  const sans = (patch: Partial<Filtres>): Filtres => ({ ...f, ...patch, page: 1 });
  return [
    ...(f.q ? [{ dimension: "q" as const, valeur: f.q, sans: sans({ q: "" }) }] : []),
    ...(f.dept ? [{ dimension: "dept" as const, valeur: f.dept, sans: sans({ dept: null, villes: [] }) }] : []),
    ...f.villes.map((v) => ({
      dimension: "villes" as const,
      valeur: v,
      sans: sans({ villes: f.villes.filter((x) => x !== v) }),
    })),
    ...f.titres.map((v) => ({
      dimension: "titres" as const,
      valeur: v,
      sans: sans({ titres: f.titres.filter((x) => x !== v) }),
    })),
    ...f.fin.map((v) => ({ dimension: "fin" as const, valeur: v, sans: sans({ fin: f.fin.filter((x) => x !== v) }) })),
    ...f.rythmes.map((v) => ({
      dimension: "rythmes" as const,
      valeur: v,
      sans: sans({ rythmes: f.rythmes.filter((x) => x !== v) }),
    })),
    ...(f.qualiopi ? [{ dimension: "qualiopi" as const, valeur: "1", sans: sans({ qualiopi: false }) }] : []),
  ];
}

/** Zéro résultat : le filtre dont le retrait rend le plus d'organismes (« Retirez X et N organismes correspondent »). */
export function relachement<T extends OrganismeFiltrable>(
  organismes: T[],
  f: Filtres,
): { puce: Puce; nombre: number } | null {
  let meilleur: { puce: Puce; nombre: number } | null = null;
  for (const puce of puces(f)) {
    const nombre = filtrer(organismes, puce.sans).length;
    if (nombre > 0 && (!meilleur || nombre > meilleur.nombre)) meilleur = { puce, nombre };
  }
  return meilleur;
}

/**
 * Clé d'une recherche sans résultat (décision Erwan 01/10/2026) : la combinaison de filtres seule, valeurs triées,
 * sans tri ni page. Jamais le texte libre : une recherche par nom n'est pas enregistrée (null).
 */
export function cleRecherche(f: Filtres): string | null {
  if (f.q || !aDesFiltres(f)) return null;
  const tries = { ...f, villes: [], titres: [...f.titres].sort(), fin: [...f.fin].sort(), rythmes: [...f.rythmes].sort() };
  // Les villes sont du texte libre saisi par les organismes : on ne garde que le département.
  const cle = versQuery({ ...tries, q: "", tri: "pertinence", page: 1 }).slice(1);
  return /^[a-z0-9=&_-]+$/.test(cle) && cle.length <= 300 ? cle : null;
}
