import { describe, expect, it } from "vitest";
import { markdownVersDocument } from "./markdown";
import { validerDocument } from "./validation";

const P = "https://x.supabase.co/storage/v1/object/public/blog/";
const resoudre = (f: string) => ({ src: `${P}${f}`, largeur: 1600, hauteur: 900 });

describe("markdownVersDocument", () => {
  it("convertit les blocs de l'éditeur et produit un document valide", () => {
    const md = [
      "Ouverture **en gras** avec un [lien *interne*](/securite-privee/ssiap-1/).  ",
      "Suite après retour forcé",
      "et ligne jointe.",
      "",
      "## Intertitre",
      "### Sous-titre",
      "- un",
      "- deux",
      "1. premier",
      "2. second",
      "",
      "| A | B |",
      "|---|---|",
      "| *a* | b |",
      "",
      '![Schéma des niveaux](niveaux.jpg "Source : arrêté")',
      "",
      ":::a-savoir",
      "Texte de l'encadré.",
      ":::",
      ":::chiffre 40 questions",
      "En 40 minutes.",
      ":::",
    ].join("\n");
    const doc = markdownVersDocument(md, resoudre);
    expect(validerDocument(doc, P)).toEqual([]);
    const c = "content" in doc ? doc.content! : [];
    expect(c.map((n) => n.type)).toEqual([
      "paragraph",
      "heading",
      "heading",
      "bulletList",
      "orderedList",
      "table",
      "image",
      "callout",
      "callout",
    ]);
    expect(c[0]).toEqual({
      type: "paragraph",
      content: [
        { type: "text", text: "Ouverture " },
        { type: "text", text: "en gras", marks: [{ type: "bold" }] },
        { type: "text", text: " avec un " },
        { type: "text", text: "lien ", marks: [{ type: "link", attrs: { href: "/securite-privee/ssiap-1/" } }] },
        {
          type: "text",
          text: "interne",
          marks: [{ type: "link", attrs: { href: "/securite-privee/ssiap-1/" } }, { type: "italic" }],
        },
        { type: "text", text: "." },
        { type: "hardBreak" },
        { type: "text", text: "Suite après retour forcé et ligne jointe." },
      ],
    });
    expect(c[6]).toMatchObject({
      attrs: { src: `${P}niveaux.jpg`, alt: "Schéma des niveaux", legende: "Source : arrêté" },
    });
    expect(c[7]).toMatchObject({ attrs: { variante: "vigilance", chiffre: null } });
    expect(c[8]).toMatchObject({ attrs: { variante: "chiffre", chiffre: "40 questions" } });
  });

  it("refuse un encadré inconnu ou non fermé", () => {
    expect(() => markdownVersDocument(":::autre\nx\n:::", resoudre)).toThrow("Encadré inconnu");
    expect(() => markdownVersDocument(":::renvoi\nx", resoudre)).toThrow("non fermé");
  });
});
