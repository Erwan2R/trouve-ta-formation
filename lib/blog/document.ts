// Document d'un article : format JSON de l'éditeur (Tiptap / ProseMirror), stocké tel quel en base et rendu côté
// serveur (components/public/blog/CorpsArticle.tsx). Seuls les nœuds ci-dessous existent : l'éditeur n'en propose pas
// d'autres (UX Blog admin §3.2 à 3.5).

export type Marque =
  | { type: "bold" }
  | { type: "italic" }
  /** `href` : URL externe (https://…) ou chemin interne (/securite-privee/…), choisi dans la liste des pages. */
  | { type: "link"; attrs: { href: string } };

export type Noeud =
  | { type: "doc"; content?: Noeud[] }
  | { type: "paragraph"; content?: Noeud[] }
  | { type: "text"; text: string; marks?: Marque[] }
  | { type: "hardBreak" }
  | { type: "heading"; attrs: { level: 2 | 3 }; content?: Noeud[] }
  | { type: "bulletList" | "orderedList"; content?: Noeud[] }
  | { type: "listItem"; content?: Noeud[] }
  | { type: "table" | "tableRow"; content?: Noeud[] }
  | { type: "tableHeader" | "tableCell"; content?: Noeud[] }
  | {
      type: "image";
      attrs: { src: string; alt: string; legende?: string | null; largeur?: number; hauteur?: number };
    }
  /** Call-outs (trois types fixes) : « À savoir », chiffre clé (le chiffre est le libellé), « Sur le même sujet ». */
  | {
      type: "callout";
      attrs: { variante: "vigilance" | "chiffre" | "renvoi"; chiffre?: string | null };
      content?: Noeud[];
    };

/** Texte brut d'un nœud et de ses descendants. */
export function texteDe(n: Noeud): string {
  if (n.type === "text") return n.text;
  if (n.type === "hardBreak") return " ";
  if (n.type === "image") return "";
  const enfants = "content" in n ? (n.content ?? []) : [];
  const sep = ["doc", "bulletList", "orderedList", "table", "tableRow"].includes(n.type) ? " " : "";
  return enfants.map(texteDe).join(sep) + (n.type === "paragraph" || n.type === "heading" ? " " : "");
}

/** Nombre de mots du corps (temps de lecture, seuil de la table des matières). */
export const compterMots = (doc: Noeud) =>
  texteDe(doc)
    .split(/\s+/)
    .filter((m) => /[\p{L}\p{N}]/u.test(m)).length;

/** Ancre stable d'un intertitre (« Les horaires de nuit » → « les-horaires-de-nuit »), unique dans l'article. */
export function ancres(doc: Noeud): { niveau: 2 | 3; texte: string; id: string }[] {
  const vus = new Map<string, number>();
  const titres = ("content" in doc ? (doc.content ?? []) : []).filter(
    (n): n is Extract<Noeud, { type: "heading" }> => n.type === "heading",
  );
  return titres.map((h) => {
    const texte = texteDe(h).trim();
    const base =
      texte
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60) || "section";
    const n = (vus.get(base) ?? 0) + 1;
    vus.set(base, n);
    return { niveau: h.attrs.level, texte, id: n === 1 ? base : `${base}-${n}` };
  });
}

/** Hiérarchie propre (UX blog §7) : pas de H3 avant le premier H2. Liste des problèmes, vide si conforme. */
export function problemesHierarchie(doc: Noeud): string[] {
  const premier = ancres(doc)[0];
  return premier && premier.niveau === 3 ? ["Un intertitre de niveau 3 apparaît avant le premier de niveau 2."] : [];
}
