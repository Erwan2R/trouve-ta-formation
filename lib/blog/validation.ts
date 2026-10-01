import { problemesHierarchie, type Noeud } from "./document";

const TYPES = new Set([
  "doc",
  "paragraph",
  "text",
  "hardBreak",
  "heading",
  "bulletList",
  "orderedList",
  "listItem",
  "table",
  "tableRow",
  "tableHeader",
  "tableCell",
  "image",
  "callout",
]);
const MARQUES = new Set(["bold", "italic", "link"]);

/** Lien accepté : https:// (source externe) ou chemin interne du site (choisi dans la liste des pages). */
export const lienValide = (href: unknown) =>
  typeof href === "string" && (/^https:\/\/[^\s]+$/.test(href) || /^\/[a-z0-9\-/#]*$/.test(href));

/**
 * Contrôle du document envoyé par l'éditeur avant enregistrement (UX Blog admin §3.2 à 3.5, §4) : seuls les blocs de
 * l'éditeur, titres H2/H3 sans saut, images du stockage du blog avec texte alternatif, liens https ou internes.
 * `prefixeImages` : URL publique du dossier des images du blog.
 */
export function validerDocument(doc: unknown, prefixeImages: string): string[] {
  const erreurs = new Set<string>();
  const visiter = (n: unknown) => {
    if (!n || typeof n !== "object") return void erreurs.add("Contenu illisible.");
    const noeud = n as Record<string, unknown>;
    if (!TYPES.has(noeud.type as string)) return void erreurs.add(`Bloc non pris en charge : ${String(noeud.type)}.`);
    if (noeud.type === "heading") {
      const niveau = (noeud.attrs as { level?: number } | undefined)?.level;
      if (niveau !== 2 && niveau !== 3) erreurs.add("Seuls les intertitres de niveau 2 et 3 sont autorisés.");
    }
    if (noeud.type === "image") {
      const a = (noeud.attrs ?? {}) as { src?: string; alt?: string };
      if (!a.alt?.trim()) erreurs.add("Chaque image doit avoir un texte alternatif.");
      if (typeof a.src !== "string" || !a.src.startsWith(prefixeImages))
        erreurs.add("Une image ne provient pas du stockage du blog.");
    }
    if (noeud.type === "text")
      for (const m of (noeud.marks as { type: string; attrs?: { href?: unknown } }[] | undefined) ?? []) {
        if (!MARQUES.has(m.type)) erreurs.add(`Mise en forme non prise en charge : ${m.type}.`);
        if (m.type === "link" && !lienValide(m.attrs?.href))
          erreurs.add("Un lien n'est ni une adresse https ni une page du site.");
      }
    for (const enfant of (noeud.content as unknown[] | undefined) ?? []) visiter(enfant);
  };
  if ((doc as { type?: string } | null)?.type !== "doc") return ["Contenu illisible."];
  visiter(doc);
  return [...erreurs, ...(erreurs.size ? [] : problemesHierarchie(doc as Noeud))];
}

/** Chemins internes cités par le corps (liens), pour l'aide à l'audit : l'article renvoie-t-il vers une page structurante ? */
export function liensInternes(doc: Noeud): string[] {
  const liens = new Set<string>();
  const visiter = (n: Noeud) => {
    if (n.type === "text")
      for (const m of n.marks ?? []) if (m.type === "link" && m.attrs.href.startsWith("/")) liens.add(m.attrs.href);
    if ("content" in n) (n.content ?? []).forEach(visiter);
  };
  visiter(doc);
  return [...liens];
}

/** Slug d'article : minuscules, chiffres, tirets (« Le métier d'agent » → « le-metier-d-agent »). */
export const slugArticle = (titre: string) =>
  titre
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100)
    .replace(/-+$/, "");
