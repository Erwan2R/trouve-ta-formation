/**
 * Validation des champs saisis par l'organisme (Ma fiche, Mes formations). Aucun champ n'est obligatoire
 * au-delà du minimum publiable (UX Ma fiche §4) : une valeur vide est toujours acceptée et enregistrée à null.
 */
export type Resultat<T> = { ok: true; valeur: T } | { ok: false; erreur: string };

const vide = (s: string) => s.trim() === "";
const ok = <T>(valeur: T): Resultat<T> => ({ ok: true, valeur });
const ko = (erreur: string): Resultat<never> => ({ ok: false, erreur });

export const LANGUES = ["Français", "Anglais", "Arabe", "Espagnol", "Portugais", "Roumain", "Tamoul"] as const;
export const PLAFOND_PRESENTATION = 1500;

export function texte(s: string, max: number, champ: string): Resultat<string | null> {
  const t = s.trim().replace(/\s+/g, " ");
  if (!t) return ok(null);
  return t.length > max ? ko(`${champ} : ${max} caractères maximum.`) : ok(t);
}

export function siret(s: string): Resultat<string | null> {
  const chiffres = s.replace(/\s/g, "");
  if (!chiffres) return ok(null);
  return /^\d{14}$/.test(chiffres) ? ok(chiffres) : ko("Le SIRET compte 14 chiffres.");
}

export function codePostal(s: string): Resultat<string | null> {
  const c = s.replace(/\s/g, "");
  if (!c) return ok(null);
  return /^\d{5}$/.test(c) ? ok(c) : ko("Le code postal compte 5 chiffres.");
}

export function annee(s: string, maintenant = new Date().getFullYear()): Resultat<number | null> {
  if (vide(s)) return ok(null);
  const n = Number(s.trim());
  return Number.isInteger(n) && n >= 1900 && n <= maintenant
    ? ok(n)
    : ko("Indiquez une année entre 1900 et aujourd'hui.");
}

export function email(s: string): Resultat<string | null> {
  const e = s.trim().toLowerCase();
  if (!e) return ok(null);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 254 ? ok(e) : ko("Cette adresse email n'est pas valide.");
}

export function telephone(s: string): Resultat<string | null> {
  const t = s.trim().replace(/\s+/g, " ");
  if (!t) return ok(null);
  const chiffres = t.replace(/\D/g, "");
  return /^[+\d][\d .-]*$/.test(t) && chiffres.length >= 10 && chiffres.length <= 15
    ? ok(t)
    : ko("Ce numéro de téléphone n'est pas valide.");
}

/** « afs-formation.fr » → « https://afs-formation.fr ». */
export function siteWeb(s: string): Resultat<string | null> {
  const brut = s.trim();
  if (!brut) return ok(null);
  const url = /^https?:\/\//i.test(brut) ? brut : `https://${brut}`;
  try {
    const u = new URL(url);
    return u.hostname.includes(".") && url.length <= 300
      ? ok(u.toString().replace(/\/$/, ""))
      : ko("Cette adresse de site n'est pas valide.");
  } catch {
    return ko("Cette adresse de site n'est pas valide.");
  }
}

export function presentation(s: string): Resultat<string | null> {
  const t = s.trim();
  if (!t) return ok(null);
  return t.length > PLAFOND_PRESENTATION ? ko(`${PLAFOND_PRESENTATION} caractères maximum.`) : ok(t);
}

export function langues(l: string[]): string[] {
  return LANGUES.filter((x) => l.includes(x));
}

/** Montant en euros saisi librement (« 1 490 », « 1490,50 »). */
export function montant(s: string): Resultat<number | null> {
  const t = s.replace(/[\s €]/g, "").replace(",", ".");
  if (!t) return ok(null);
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 && n < 100000
    ? ok(Math.round(n * 100) / 100)
    : ko("Indiquez un montant en euros.");
}
