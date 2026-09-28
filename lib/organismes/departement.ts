import type { Organisme } from "@/lib/supabase/queries/organismes";
import { DEPARTEMENTS_VOISINS } from "./voisins";

/** Les organismes ayant au moins un lieu dans le département (rattachement par lieu, jamais le seul siège). */
export const organismesDuDepartement = (organismes: Organisme[], code: string) =>
  organismes.filter((o) => o.lieux.some((l) => l.departement === code));

/** Lieu à afficher sur la carte d'un organisme dans une page département : celui situé dans le département. */
export function lieuDansDepartement(o: Organisme, code: string) {
  return o.lieux.find((l) => l.departement === code) ?? o.siege;
}

/** Organismes qui dispensent le titre dans le département (lieux de l'offre, siège par défaut) et leurs villes. */
function offreLocale(organismes: Organisme[], code: string, slugTitre: string) {
  const villes = new Map<string, number>();
  let nombre = 0;
  for (const o of organismes) {
    const offre = o.offres.find((x) => x.titre.slug === slugTitre);
    if (!offre) continue;
    const lieux = (offre.lieux.length ? offre.lieux : o.siege ? [o.siege] : []).filter((l) => l.departement === code);
    if (!lieux.length) continue;
    nombre++;
    for (const l of lieux) villes.set(l.ville, (villes.get(l.ville) ?? 0) + 1);
  }
  return { nombre, villes: [...villes].sort((a, b) => b[1] - a[1]).map(([v]) => v) };
}

export type DisponibiliteTitre = {
  slug: string;
  nombre: number;
  villes: string[];
  /** Titre absent : département limitrophe qui le propose le plus (null si aucun). */
  voisin: string | null;
};

/** Bloc 4 : pour chaque titre, disponibilité locale ; pour les absents, le voisin de repli (Copy géo §6). */
export function disponibilites(organismes: Organisme[], code: string, slugsTitres: string[]): DisponibiliteTitre[] {
  return slugsTitres.map((slug) => {
    const local = offreLocale(organismes, code, slug);
    if (local.nombre > 0) return { slug, ...local, villes: local.villes.slice(0, 3), voisin: null };
    const voisin =
      (DEPARTEMENTS_VOISINS[code] ?? [])
        .map((v) => ({ v, n: offreLocale(organismes, v, slug).nombre }))
        .filter((x) => x.n > 0)
        .sort((a, b) => b.n - a.n)[0]?.v ?? null;
    return { slug, nombre: 0, villes: [], voisin };
  });
}

/** Bloc 6 : villes du département et nombre d'organismes (décroissant ; alphabétique sans compteurs). */
export function villesDuDepartement(organismes: Organisme[], code: string, avecCompteurs: boolean) {
  const n = new Map<string, number>();
  for (const o of organismesDuDepartement(organismes, code))
    for (const v of new Set(o.lieux.filter((l) => l.departement === code).map((l) => l.ville)))
      n.set(v, (n.get(v) ?? 0) + 1);
  return [...n]
    .map(([ville, nombre]) => ({ ville, nombre }))
    .sort((a, b) => (avecCompteurs ? b.nombre - a.nombre : 0) || a.ville.localeCompare(b.ville, "fr"));
}
