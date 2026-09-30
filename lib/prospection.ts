import { createHash } from "node:crypto";

/**
 * Import du fichier de prospection (CSV du scraping, décision Erwan 01/10/2026) : séparateur « ; », UTF-8 avec BOM,
 * champs entre guillemets possibles (qui peuvent contenir des « ; »). Identifiant : SIRET, sinon SIREN.
 */

/** CSV → lignes de cellules (RFC 4180 : guillemets doublés, retours à la ligne dans un champ entre guillemets). */
export function lireCsv(texte: string, sep = ";"): string[][] {
  const lignes: string[][] = [];
  let ligne: string[] = [];
  let cellule = "";
  let guillemets = false;
  const t = texte.replace(/^\uFEFF/, "");
  const finDeLigne = () => {
    ligne.push(cellule);
    if (ligne.some((x) => x !== "")) lignes.push(ligne);
    ligne = [];
    cellule = "";
  };
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (guillemets) {
      if (c === '"' && t[i + 1] === '"') {
        cellule += '"';
        i++;
      } else if (c === '"') guillemets = false;
      else cellule += c;
    } else if (c === '"') guillemets = true;
    else if (c === sep) {
      ligne.push(cellule);
      cellule = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && t[i + 1] === "\n") i++;
      finDeLigne();
    } else cellule += c;
  }
  finDeLigne();
  return lignes;
}

/** Domaine d'un site (« https://www.afc-idf.fr/formations » → « afc-idf.fr ») ; null si ce n'est pas une URL. */
export function domaine(site: string | null | undefined): string | null {
  if (!site?.trim()) return null;
  try {
    const u = new URL(/^https?:\/\//i.test(site.trim()) ? site.trim() : `https://${site.trim()}`);
    return u.hostname.toLowerCase().replace(/^www\./, "") || null;
  } catch {
    return null;
  }
}

// Messageries grand public : une adresse chez elles est probablement celle d'une personne, pas d'un organisme
// (compte rendu d'import, pour valider la FAQ « D'où vient mon adresse email ? »).
const MESSAGERIES_PERSONNELLES = new Set([
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "hotmail.fr",
  "outlook.com",
  "outlook.fr",
  "live.com",
  "live.fr",
  "msn.com",
  "yahoo.com",
  "yahoo.fr",
  "icloud.com",
  "me.com",
  "aol.com",
  "orange.fr",
  "wanadoo.fr",
  "free.fr",
  "sfr.fr",
  "neuf.fr",
  "laposte.net",
  "bbox.fr",
  "gmx.fr",
  "gmx.com",
  "protonmail.com",
  "proton.me",
]);
export const estMessageriePersonnelle = (email: string) =>
  MESSAGERIES_PERSONNELLES.has(email.split("@")[1]?.toLowerCase() ?? "");

export type TypeExclusion = "siret" | "siren" | "email" | "domaine";
/** Empreinte stockée dans la liste d'exclusion : la valeur normalisée n'est jamais conservée en clair. */
export const empreinte = (type: TypeExclusion, valeur: string) =>
  createHash("sha256").update(`${type}:${valeur.trim().toLowerCase()}`).digest("hex");

export type ProspectImport = {
  /** SIRET, sinon SIREN ; null : ni l'un ni l'autre (dédoublonnage par email, domaine ou téléphone). */
  identifiant: string | null;
  siret: string | null;
  siren: string | null;
  nom: string;
  raison_sociale: string | null;
  email: string | null;
  telephone: string | null;
  site_web: string | null;
  departements: string | null;
  titres: string | null;
  source: string | null;
  scrape_le: string | null;
};

/** Empreintes à comparer à la liste d'exclusion (SIRET, SIREN, email, domaine du site : toujours actives). */
export function empreintesDe(p: Pick<ProspectImport, "siret" | "siren" | "email" | "site_web">): string[] {
  const d = domaine(p.site_web);
  return [
    p.siret && empreinte("siret", p.siret),
    p.siren && empreinte("siren", p.siren),
    p.email && empreinte("email", p.email),
    d && empreinte("domaine", d),
  ].filter((x): x is string => !!x);
}

/** Clés de dédoublonnage d'un prospect sans SIRET : email, domaine du site, téléphone (9 derniers chiffres). */
export function clesContact(p: Pick<ProspectImport, "email" | "site_web" | "telephone">): string[] {
  const tel = (p.telephone ?? "").replace(/\D/g, "").slice(-9);
  const d = domaine(p.site_web);
  return [p.email && `email:${p.email.toLowerCase()}`, d && `domaine:${d}`, tel.length === 9 && `tel:${tel}`].filter(
    (x): x is string => !!x,
  );
}

const chiffres = (s: string | undefined) => (s ?? "").replace(/\D/g, "");
const texte = (s: string | undefined) => s?.replace(/\s+/g, " ").trim() || null;
const EMAIL = /^[^\s@;,]+@[^\s@;,]+\.[^\s@;,]+$/;
const sansAccent = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

/** Premier code postal francilien d'une adresse (« 66 Av. des Champs-Élysées, 75008 Paris » → « 75008 »). */
export const codePostal = (adresse: string | null | undefined) =>
  adresse?.match(/\b(?:75|77|78|91|92|93|94|95)\d{3}\b/)?.[0] ?? null;

type Etablissement = {
  siret: string;
  code_postal?: string | null;
  etat_administratif?: string;
  liste_enseignes?: string[] | null;
  nom_commercial?: string | null;
};
export type ReponseRechercheEntreprises = {
  total_results: number;
  results: {
    siren: string;
    nom_complet?: string | null;
    nom_raison_sociale?: string | null;
    sigle?: string | null;
    matching_etablissements?: Etablissement[];
  }[];
};

/**
 * SIRET retrouvé par l'API Recherche d'entreprises (recherche nom + code postal), seulement sans ambiguïté :
 * une seule entreprise, un seul établissement actif à ce code postal, et chaque mot du nom scrapé présent dans
 * les noms de l'entreprise ou de l'établissement. Sinon null : la ligne reste « SIRET manquant ».
 */
export function siretSansAmbiguite(r: ReponseRechercheEntreprises, nom: string, cp: string): string | null {
  if (r.total_results !== 1 || r.results.length !== 1) return null;
  const e = r.results[0];
  const actifs = (e.matching_etablissements ?? []).filter((x) => x.code_postal === cp && x.etat_administratif === "A");
  if (actifs.length !== 1 || !/^\d{14}$/.test(actifs[0].siret)) return null;
  const noms = sansAccent(
    [e.nom_complet, e.nom_raison_sociale, e.sigle, actifs[0].nom_commercial, ...(actifs[0].liste_enseignes ?? [])]
      .filter(Boolean)
      .join(" "),
  );
  const mots = sansAccent(nom)
    .split(/[^a-z0-9]+/)
    .filter((m) => m.length >= 3);
  return mots.length > 0 && mots.every((m) => noms.includes(m)) ? actifs[0].siret : null;
}

export type LigneAnalysee = ProspectImport & { codePostal: string | null };

export function analyserCsv(contenu: string) {
  const [entete, ...lignes] = lireCsv(contenu);
  const col = (nom: string) => entete?.findIndex((h) => h.trim().toLowerCase() === nom) ?? -1;
  const c = Object.fromEntries(
    [
      "nom_organisme",
      "raison_sociale",
      "siret",
      "siren",
      "sites",
      "departements",
      "site_web",
      "email",
      "telephone",
      "titres_prepares",
      "url_source_principale",
      "date_scraping",
    ].map((n) => [n, col(n)]),
  );
  if (c.nom_organisme < 0 || (c.siret < 0 && c.siren < 0))
    return {
      erreur: "Colonnes attendues introuvables (nom_organisme, siret, siren) : est-ce le bon fichier ?",
    } as const;

  const identifies = new Map<string, LigneAnalysee>();
  const sansSiret: LigneAnalysee[] = [];
  let ignorees = 0;
  for (const l of lignes) {
    const siret = chiffres(l[c.siret]);
    const siren = chiffres(l[c.siren]) || siret.slice(0, 9);
    const nom = texte(l[c.nom_organisme]);
    const email = texte(l[c.email])?.toLowerCase() ?? null;
    const date = texte(l[c.date_scraping]);
    const valide = !!siren && siren.length === 9 && (!siret || siret.length === 14);
    const p: LigneAnalysee = {
      identifiant: valide ? siret || siren : null,
      siret: valide && siret ? siret : null,
      siren: valide ? siren : null,
      nom: nom ?? "",
      raison_sociale: texte(l[c.raison_sociale]),
      email: email && EMAIL.test(email) ? email : null,
      telephone: texte(l[c.telephone]),
      site_web: domaine(l[c.site_web]) ? texte(l[c.site_web]) : null,
      departements: texte(l[c.departements]),
      titres: texte(l[c.titres_prepares]),
      source: texte(l[c.url_source_principale]),
      scrape_le: date && /^\d{4}-\d{2}-\d{2}/.test(date) ? date.slice(0, 10) : null,
      codePostal: codePostal(l[c.sites]),
    };
    if (!nom) ignorees++;
    else if (p.identifiant) identifies.set(p.identifiant, p);
    else if (!clesContact(p).length)
      ignorees++; // ni identifiant ni contact : impossible à dédoublonner
    else {
      // Doublon dans le fichier : même email, domaine ou téléphone qu'une ligne déjà lue.
      const cles = clesContact(p);
      if (!sansSiret.some((x) => clesContact(x).some((k) => cles.includes(k)))) sansSiret.push(p);
    }
  }
  // Même contact qu'une ligne identifiée du fichier : c'est le même organisme, déjà présent.
  const clesIdentifiees = new Set([...identifies.values()].flatMap(clesContact));
  const prospects = [
    ...identifies.values(),
    ...sansSiret.filter((p) => !clesContact(p).some((k) => clesIdentifiees.has(k))),
  ];
  const emails = prospects.filter((p) => p.email);
  return {
    prospects,
    lignes: lignes.length,
    ignorees,
    emails: emails.length,
    emailsPersonnels: emails.filter((p) => estMessageriePersonnelle(p.email!)).length,
  } as const;
}
