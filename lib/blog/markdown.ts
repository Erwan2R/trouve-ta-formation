// Conversion d'un article rédigé en Markdown vers le document de l'éditeur (lib/blog/document.ts), pour l'import des
// articles rédigés hors du site (scripts/importer-articles-blog.ts). Sous-ensemble volontairement réduit, calqué sur
// les blocs de l'éditeur : intertitres ## et ###, paragraphes, listes, tableaux, images, gras, italique, liens et
// encadrés (:::a-savoir, :::renvoi, :::chiffre <valeur>, fermés par :::).
import type { Marque, Noeud } from "./document";

/** Image du corps : `![alt](fichier "légende")`, seule sur sa ligne. `resoudre` fournit l'URL publiée et la taille. */
export type ResoudreImage = (fichier: string) => { src: string; largeur?: number; hauteur?: number };

const VARIANTES = { "a-savoir": "vigilance", renvoi: "renvoi", chiffre: "chiffre" } as const;

/** Texte en ligne : **gras**, *italique*, [texte](lien), imbriqués. */
export function enLigne(s: string, marques: Marque[] = []): Noeud[] {
  const motifs: [RegExp, (m: RegExpExecArray) => Noeud[]][] = [
    [/\[([^\]]+)\]\(([^)\s]+)\)/, (m) => enLigne(m[1], [...marques, { type: "link", attrs: { href: m[2] } }])],
    [/\*\*(.+?)\*\*/, (m) => enLigne(m[1], [...marques, { type: "bold" }])],
    [/\*([^*]+)\*/, (m) => enLigne(m[1], [...marques, { type: "italic" }])],
  ];
  let premier: { m: RegExpExecArray; rendu: (m: RegExpExecArray) => Noeud[] } | null = null;
  for (const [re, rendu] of motifs) {
    const m = re.exec(s);
    if (m && (!premier || m.index < premier.m.index)) premier = { m, rendu };
  }
  const texte = (t: string): Noeud[] =>
    t ? [{ type: "text", text: t, ...(marques.length && { marks: marques }) }] : [];
  if (!premier) return texte(s);
  const { m, rendu } = premier;
  return [...texte(s.slice(0, m.index)), ...rendu(m), ...enLigne(s.slice(m.index + m[0].length), marques)];
}

/** Paragraphe : lignes jointes par une espace ; deux espaces en fin de ligne = retour à la ligne forcé. */
function paragraphe(lignes: string[]): Noeud {
  const content: Noeud[] = [];
  lignes.forEach((l, i) => {
    if (i > 0) content.push(/ {2,}$/.test(lignes[i - 1]) ? { type: "hardBreak" } : { type: "text", text: " " });
    content.push(...enLigne(l.trim()));
  });
  return { type: "paragraph", content: fusionner(content) };
}

/** Fusionne les textes voisins de mêmes marques (le « » de jointure notamment). */
function fusionner(noeuds: Noeud[]): Noeud[] {
  const sortie: Noeud[] = [];
  for (const n of noeuds) {
    const prec = sortie.at(-1);
    if (n.type === "text" && prec?.type === "text" && JSON.stringify(prec.marks) === JSON.stringify(n.marks))
      sortie[sortie.length - 1] = { ...prec, text: prec.text + n.text };
    else sortie.push(n);
  }
  return sortie;
}

const cellules = (ligne: string) =>
  ligne
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => ({ type: "paragraph" as const, content: enLigne(c.trim()) }));

function blocs(lignes: string[], resoudre: ResoudreImage): Noeud[] {
  const sortie: Noeud[] = [];
  let i = 0;
  while (i < lignes.length) {
    const l = lignes[i];
    if (!l.trim()) {
      i++;
      continue;
    }
    const titre = /^(#{2,3}) (.+)$/.exec(l);
    if (titre) {
      sortie.push({ type: "heading", attrs: { level: titre[1].length as 2 | 3 }, content: enLigne(titre[2].trim()) });
      i++;
      continue;
    }
    const encadre = /^:::([a-z-]+)(?: (.+))?$/.exec(l);
    if (encadre) {
      const variante = VARIANTES[encadre[1] as keyof typeof VARIANTES];
      if (!variante) throw new Error(`Encadré inconnu : ${encadre[1]}`);
      const fin = lignes.indexOf(":::", i + 1);
      if (fin < 0) throw new Error(`Encadré non fermé : ${l}`);
      sortie.push({
        type: "callout",
        attrs: { variante, chiffre: encadre[2]?.trim() ?? null },
        content: blocs(lignes.slice(i + 1, fin), resoudre),
      });
      i = fin + 1;
      continue;
    }
    const image = /^!\[([^\]]+)\]\(([^)\s]+)(?: "([^"]+)")?\)$/.exec(l.trim());
    if (image) {
      const { src, largeur, hauteur } = resoudre(image[2]);
      sortie.push({ type: "image", attrs: { src, alt: image[1], legende: image[3] ?? null, largeur, hauteur } });
      i++;
      continue;
    }
    if (l.startsWith("|")) {
      const rangs: string[] = [];
      while (i < lignes.length && lignes[i].startsWith("|")) rangs.push(lignes[i++]);
      const [entete, , ...corps] = rangs;
      const rang = (ligne: string, type: "tableHeader" | "tableCell"): Noeud => ({
        type: "tableRow",
        content: cellules(ligne).map((p) => ({ type, content: [p] })),
      });
      sortie.push({ type: "table", content: [rang(entete, "tableHeader"), ...corps.map((r) => rang(r, "tableCell"))] });
      continue;
    }
    const puce = /^(- |\d+\. )/.exec(l);
    if (puce) {
      const ordonnee = puce[1] !== "- ";
      const items: Noeud[] = [];
      while (i < lignes.length && (ordonnee ? /^\d+\. /.test(lignes[i]) : lignes[i].startsWith("- ")))
        items.push({ type: "listItem", content: [paragraphe([lignes[i++].replace(/^(- |\d+\. )/, "")])] });
      sortie.push({ type: ordonnee ? "orderedList" : "bulletList", content: items });
      continue;
    }
    const para: string[] = [];
    while (i < lignes.length && lignes[i].trim() && !/^(#{2,3} |:::|\||- |\d+\. |!\[)/.test(lignes[i]))
      para.push(lignes[i++]);
    if (!para.length) throw new Error(`Ligne non reconnue : ${l}`);
    sortie.push(paragraphe(para));
  }
  return sortie;
}

export function markdownVersDocument(md: string, resoudre: ResoudreImage): Noeud {
  return { type: "doc", content: blocs(md.replace(/\r\n/g, "\n").split("\n"), resoudre) };
}
